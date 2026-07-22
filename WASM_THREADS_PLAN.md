# Basis Universal 多线程编码支持计划(V0)

> 对应 issue:[#48 — Support multithreaded encoding (bundle the threaded WASM variant)](https://github.com/gz65555/ktx2-encoder/issues/48)
>
> 前置:PR #47(v2.5 编码器升级)已合入的兼容层与构建脚本是本计划的基线。本文所有 "已核实" 条目均查证于上游 `1b33fd5` 源码与本机 emsdk 4.0.15 安装,标注 "待验证" 的条目需要 Phase 0 的探索性构建给出答案后才能锁定方案。

## 1. 背景与目标

当前打包的 `basis_encoder.{js,wasm}` 是上游 `basis_encoder.js` CMake target(wasm32、线程 OFF)。所有编码都在单线程上执行;wrapper 中的线程逻辑被 `#if WASM_THREADS_ENABLED` 整体编译裁掉, JS 侧绑定 `controlThreading()` 在当前产物里是空操作。

目标:提供 **opt-in 的多线程编码变体**,在满足条件的浏览器环境显著加速ETC1S(高 compressionLevel)与 UASTC HDR 编码,同时:

- 不满足条件时**静默回退**到现有单线程路径,零破坏;
- Node 路径**保持单线程不变**(首期 non-goal);
- 主 bundle 体积与现有加载行为**完全不变**(线程变体懒加载)。

## 2. 已核实事实

### 2.1 上游构建目标(`webgl/encoder/CMakeLists.txt` @ 1b33fd5)

| target | 位宽 | 线程 | 额外 link flags |
| --- | --- | --- | --- |
| `basis_encoder.js`(现打包) | wasm32 | OFF | — |
| `basis_encoder_threads.js` | wasm32 | ON | `-s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=32 -s ENVIRONMENT=web,worker` |
| `basis_encoder_threads_wasm64.js` | wasm64 | ON | + `MEMORY64`(non-goal) |

线程 target 额外的编译选项:`-matomics -mbulk-memory` + `WASM_THREADS_ENABLED=1`。其余(源文件列表、`COMMON_DEFS`、`LINK_BASE`、Release `-O3`)与现有 target 完全一致, 因此 **embind 方法面(ABI)与单线程版相同**,现有兼容层(rename 桥接、7 参 HDR、返回值检查、12 Mpix 上限)可原样复用。

### 2.2 wrapper 线程语义(`webgl/transcoder/basis_wrappers.cpp`)

- `controlThreading(enable: boolean, numExtraWorkerThreads: uint32)`(绑定 @ :3506) 写入 `m_threading_enabled` / `m_num_extra_worker_threads`(:1916-1917、:1930-1934)。
- `encode()` 内(:2072-2081):仅当 `emscripten_has_threading_support() && m_threading_enabled && m_num_extra_worker_threads > 0` 时 `job_pool(1 + num_new_threads)`,否则 `job_pool(1)`(纯主线程,不派生任何 helper)。
- 即:**线程版默认行为 = 单线程版**。不调用 `controlThreading` 就不会用线程 ——这让 "同一兼容层驱动两种产物" 天然安全。
- 12 Mpix 源纹素上限(:2095-2110)在线程版**同样存在**,与线程无关。encodeCore 的 texel guard 不需要区分变体。

### 2.3 Emscripten 4.0.15 pthreads 产物形态(本机 emsdk 查证)

- **无独立 worker.js**:pthread worker 由主 glue 自派生 (`src/lib/libpthread.js:445`:`new Worker(new URL(..., import.meta.url), ...)`)。产物仍是 `basis_encoder_threads.js` + `basis_encoder_threads.wasm` 两个文件。
- libpthread.js 自带 `ENVIRONMENT_IS_NODE` 分支(worker_threads),即 emscripten 本身支持 Node 线程;是上游 target 的 `ENVIRONMENT=web,worker` 把 node 排除了。→ Node 线程化技术上可行(改 ENVIRONMENT 即可),但作为后续迭代,首期不做。
- `USE_PTHREADS=1` 要求 `SharedArrayBuffer` → 浏览器页面必须 cross-origin isolated (COOP: `same-origin` + COEP: `require-corp`),运行时可用 `crossOriginIsolated` 全局变量探测。
- 共享内存 + `ALLOW_MEMORY_GROWTH=1`:shared WebAssembly.Memory 创建时必须声明maximum。emscripten 会用默认/显式的 `MAXIMUM_MEMORY` 兜底,但**应显式固定**以保证产物可复现且行为可预期(见 D4)。

### 2.4 现有代码接入点

- `src/web/BrowserBasisEncoder.ts`:静态 `import BASIS from "../basis/basis_encoder.js"`, 单例 `modulePromise` + `wasmUrl` 冲突告警。线程变体的选择逻辑加在 `init()`。
- `src/encodeCore.ts` / `src/applyInputOptions.ts`:与变体无关,只需新增 `controlThreading` 的调用(见 §4 Phase 2)。
- `vite.config.ts`(vitest):浏览器测试需给 dev server 加 COOP/COEP 头才能在测试里拿到 `crossOriginIsolated === true`。
- `package.json` `build`:`tsc && cp -R src/basis dist` → 需同步拷贝线程变体目录。

## 3. 关键设计决策

### D1. 启用方式:显式 opt-in,而非自动检测启用 【建议:opt-in】

新增 `IEncodeOptions.useThreads?: boolean`(默认 `false`):

- `useThreads: true` 且 `crossOriginIsolated && typeof SharedArrayBuffer !== "undefined"` → 加载线程变体,并 `controlThreading(true, numThreads)`。
- `useThreads: true` 但环境不满足 → `console.warn` 一次 + 回退单线程变体(不抛错)。
- 未设置/false → 现有路径,一个字节都不多加载。

理由:自动启用会让"是否 cross-origin isolated"这一部署差异悄悄改变加载的 WASM 与内存形态(shared memory、固定 maximum),对库消费者是不可见的行为跳变;opt-in 把选择权交给知道自己部署形态的使用方,回退路径保证写 `useThreads: true` 也不会在不满足的环境炸掉。

### D2. 线程数:`numThreads?: number` 【建议:默认 `min(hardwareConcurrency - 1, 8)`】

- 语义对齐 wrapper:`controlThreading` 的第二参是 **extra** helper 线程数 (总并行度 = 1 + numThreads)。
- 上限 8:收益递减 + 每 worker 有内存/启动开销;且不得超过 pthread 池大小(D3)。
- `numThreads: 0` 等价于不启用(wrapper 侧 `m_num_extra_worker_threads == 0` 即单线程)。

### D3. PTHREAD_POOL_SIZE:覆盖上游的 32 【锁定:定为 8,需 sed 补丁 CMakeLists】

上游 `-s PTHREAD_POOL_SIZE=32` 会在模块初始化时**预派生 32 个 worker**(glue 里 `initMainThread(){var pthreadPoolSize=32;while(pthreadPoolSize--)allocateUnusedWorker()}`), 启动开销与常驻内存对 web 库过重,且 Phase 0 已实测其危害(见 §8 观察 8)。定为 8。

**Phase 0 已验证的落地方式**:`-s PTHREAD_POOL_SIZE=8` 经 `CMAKE_EXE_LINKER_FLAGS` 追加**无效** —— 该旗标位于 emcc 链接行中 target 自身 `LINK_FLAGS` **之前**,冲突的 `-s KEY=` 值由后者(=32)胜出(对照:`MAXIMUM_MEMORY` 因是纯新增项而生效,见 D4)。因此构建脚本必须对上游 `webgl/encoder/CMakeLists.txt` 的 `LINK_THREADS` 行做一次 **定向 sed 补丁**(`PTHREAD_POOL_SIZE=32` → `=8`),补丁内容记入 provenance。

注意事项:`job_pool` 构造在**主线程同步等待线程就绪**;WASM 上若池中 worker 不足需现场派生,主线程同步等待会死锁 —— 这正是上游预派生池的原因。因此 **numThreads 上限必须 ≤ 池大小(8)**,兼容层需 clamp 并注释原因。

### D4. MAXIMUM_MEMORY:显式固定 + 保留 growth 【锁定:1.5 GiB + `ALLOW_MEMORY_GROWTH=1`】

shared memory 必须声明 maximum。**Phase 0/1 实测**(ETC1S,`HEAP8.buffer.byteLength` 为峰值代理):

| 输入                    | 单线程峰值 | 单线程耗时 | 线程(N=8)峰值 | 线程耗时  | 加速      |
| ----------------------- | ---------- | ---------- | ------------- | --------- | --------- |
| 2048²(4.0 Mpix)         | 389 MiB    | 6.3 s      | 405 MiB       | 3.5 s     | **1.8×**  |
| 3456²(11.4 Mpix,近上限) | 728 MiB    | 48.8 s     | **752 MiB**   | **7.3 s** | **6.68×** |

近上限线程峰值 **752 MiB**(比单线程仅 +24 MiB,per-thread 开销可忽略),1 GiB 即够;取 **1.5 GiB(`1610612736`)** 留足余量。经 `CMAKE_EXE_LINKER_FLAGS` 追加**已验证生效**(追加项不与 target 冲突)。

**保留 `ALLOW_MEMORY_GROWTH=1`(拒绝固定内存)** —— Phase 1 A/B 实测:固定内存 (`INITIAL=MAXIMUM`、关 growth)与 growth **加速比相同**(1.79× vs 1.81×,同噪声内),但**每次 init 预留 1.5 GiB**(growth 对 4 Mpix 只用 405 MiB,按需增长)。emcc 的 `growth+pthread 变慢` 告警在实测中**未兑现**,growth 甚至略快。固定内存对常见小纹理是净负担且在受限设备上可能分配失败 → 拒绝。

### D5. 包结构:同包懒加载,不拆新包 【建议:同包】

- 产物放 `src/basis-threads/basis_encoder_threads.{js,wasm}`,与 `src/basis/` 平行; `build` 脚本同步 `cp -R` 到 dist。
- `BrowserBasisEncoder.init()` 内 **动态 `import("../basis-threads/basis_encoder_threads.js")`** → 主 bundle 不变,未 opt-in 的消费者不多下载任何字节。
- npm 包体 +~3.3 MB(unpacked)。接受:npm 体积不影响使用方最终产物,浏览器只按需取用其一;拆 `ktx2-encoder-threads` 子包会带来版本对齐与文档成本,不值得。
- `wasmUrl` 语义:opt-in 线程时,`wasmUrl` 指向**线程版** wasm(文档明确);两变体 wasm 不可互换,沿用 #47 的 "fail loudly" 策略(fetch 失败带 URL+status 抛错)。

### D6. Node:首期不做,保留通路

`src/node/` 不变,`useThreads` 在 Node 入口忽略 + 文档标注。后续迭代可加 `ENVIRONMENT=web,worker,node` 的自建 target(§2.3 已确认 emscripten 支持), 但那偏离上游 CMake 预设 target,需要单独的验证矩阵,不混入首期。

## 3b. Phase 0 结果(2026-07-19 已执行)

在本机(emsdk 4.0.15、macOS、12 逻辑核)完成探索性构建与浏览器实跑,结论如下。产物、服务器、HTML харness 见 scratchpad(未入库)。

**观察 1 — 构建可行、产物形态如预期**:`basis_encoder_threads.js` target 17s 构建完成, **仅两个文件**:glue 118 KB(单线程 104 KB)、wasm 3.33 MB(单线程 3.29 MB,仅 +40 KB)。 `export default BASIS`,是原生 ESM;无独立 worker/mem 文件。

**观察 2 — worker 自派生模式确认**:glue 用 `new Worker(new URL("basis_encoder_threads.js", import.meta.url), {type:"module", name:"em-pthread"})` 自派生 module worker —— 正是 Vite 原生支持的写法(R1 的原生 ESM 路径已通,见观察 5; vite build 二次打包路径留待 Phase 3)。

**观察 3 — ABI 与单线程版逐字一致**:对两份 wasm 扫描 23 个 embind 方法名,**差异 0**; `controlThreading` 在**单线程版也存在**(空操作)。→ 兼容层完全复用,`test:abi` 可对两产物断言同一方法面。

**观察 4 — 链接旗标覆盖顺序(见 D3/D4)**:`MAXIMUM_MEMORY=1GiB` 生效,`PTHREAD_POOL_SIZE=8` 未生效(target 的 32 胜出)→ 池大小必须改 CMakeLists。

**观察 5 — COOP/COEP 浏览器实跑通过**:`crossOriginIsolated===true`,worker 正常派生, 编码出合法 KTX2。2048² ETC1S(CL2):

|               | 编码耗时 | 字节   |
| ------------- | -------- | ------ |
| 单线程        | 6845 ms  | 450001 |
| 线程(8 extra) | 4044 ms  | 450001 |

**观察 6 — 加速比随纹理增大而提升**:2048²/CL2 约 1.8×,但 **11.4 Mpix 达 6.68×** (48.8s→7.3s,见 D4 表)。小图 sublinear(串行相占比高);大图并行工作量主导,收益显著。本例字节相等,但仍保留 R4(不同参/线程数不保证字节一致)。

**观察 7 — D4 内存实测**:见 D4 表。近上限(11.4 Mpix)峰值 728 MiB。

**观察 8 — 32 worker 池的实证危害**:harness 每次 `BASIS()` 预派生 32 worker 且未销毁 module,连续 5 次跑同一编码时,第 3 次(累计 ~96 worker)编码耗时从 5.7s 暴增到 16s (12 核被严重超订)。→ 印证 D3(缩池)+ 复用单一 module 实例(库的 singleton 已满足)。

**观察 9 — 大纹理才是主场**:11.4 Mpix ETC1S 单线程要 **48.8 s**。2048² 的 1.69x 只是下限;大纹理上串行相占比下降、可并行工作量大,收益更显著。价值叙事应以大输入为主。

**观察 10 — 固定内存实验已做,结论:拒绝**(Phase 1)。emcc 告警 `-pthread + ALLOW_MEMORY_GROWTH may run non-wasm code slowly` 未在实测中兑现:固定内存与 growth 加速比相同(1.79× vs 1.81×),但固定内存每次 init 预留 1.5 GiB。保留 growth。详见 D4。

## 4. 分阶段计划

### Phase 0 — 探索性构建与产物验证 ✅ 已完成(见 §3b)

1. [x] 手动跑通 `basis_encoder_threads.js` 构建(`EXPORT_ES6=1` + 覆盖旗标)。
2. [x] 产物为 js+wasm 两文件,无额外 worker/mem 文件(观察 1)。
3. [x] glue 在 Chromium(COOP/COEP)下实例化并派生 worker、编码出合法 KTX2(观察 5)。vite build 二次打包路径**未测**,留 Phase 3 / R1。
4. [x] `controlThreading(true, N)` 后 encode 确有加速;不调用时与单线程一致(观察 5/6)。
5. [x] ABI 与单线程版 diff 为空(观察 3)。
6. [x] 峰值内存锁定 D4(观察 7);**HDR 峰值未测**,Phase 1 补。
7. [x] 结论产出:见 §3b,D3/D4 已锁。

### Phase 1 — 构建脚本与产物落地 ✅ 已完成

1. [x] `build-basis-wasm.sh` 重构为 `build_variant` 函数,一次构建两个 target:
   - 单线程:旗标不变(`-s EXPORT_ES6=1`),**重建产物与已发布字节完全一致** (wasm sha256 `9807719e…` 未变)→ 复现性验证通过,不改动已发布产物。
   - 线程版:perl 补丁 `LINK_THREADS` 的 `PTHREAD_POOL_SIZE=32→8`(带校验 + `trap` 经 `git checkout` 恢复 CMakeLists);追加 `-s MAXIMUM_MEMORY=1610612736`(1.5GiB); 保留 `ALLOW_MEMORY_GROWTH=1`。产物:wasm sha256 `d95fcbf8…`,3328636 bytes; glue 118455 bytes,`export default`、pool=8、maximum=24576 pages(1.5GiB)、shared。
   - 固定内存实验已做并**拒绝**(见 D4/观察 10)。HDR 峰值仍待 Phase 3 补测。
   - 预检增强:CMakeLists 有未提交改动时拒绝构建(避免叠加补丁)。
2. [x] 新增 `src/basis-threads/`,同步 `public/basis_encoder_threads.wasm` 与 `website/public/basis-threads/`。
3. [x] `package.json`:`build` 追加 `cp -R src/basis-threads dist`;`docs:build` 同步; `files` 的 `dist` 已覆盖新目录。`npm run build` 验证 dist 双产物就位。
4. [x] `THIRD_PARTY_NOTICES.md` 补线程版 provenance(同 commit/工具链,仅 flags + 池补丁差异)。
5. [x] 既有测试(node + abi,15 例)全绿 —— 单线程路径未受影响。

### Phase 2 — JS 兼容层(1 天)

1. `src/type.ts`:
   - `IBasisEncoder` 增加 `controlThreading?(enable: boolean, numExtraWorkerThreads: number): void` (optional —— 单线程产物无此绑定语义,虽然符号存在也不调用);
   - `BasisOptions` 增加 `useThreads?: boolean`、`numThreads?: number`(JSDoc 写明 COOP/COEP 前提、extra 线程语义、clamp 到 [0, 8]、Node 忽略)。
2. `src/web/BrowserBasisEncoder.ts`:
   - `init(options)` 依 D1 选择变体;线程条件不满足时 warn 一次并回退;
   - 单线程与线程变体各自单例缓存,保证全局 `browserEncoder` 可按调用 opt-in,不会因第一次默认编码而永久锁死在线程 OFF;同一变体内更换 `wasmUrl` 仍沿用现有 "已用 X,忽略 Y" 告警模式;
   - 线程变体默认 wasm URL:`new URL("../basis-threads/basis_encoder_threads.wasm", import.meta.url)`。
3. `src/encodeCore.ts`:在 `applyInputOptions` 后,若 `options.useThreads` 且 `encoder.controlThreading` 存在 → `controlThreading(true, clampedNumThreads)`。注:单线程产物也导出该绑定符号(wrapper 源码未按宏裁剪绑定,Phase 0 复核), 但其内部状态在 `encode()` 处被 `WASM_THREADS_ENABLED` 裁剪的分支忽略 —— 调用无害, 为明确语义仍按 "仅 opt-in 时调用" 实现。
4. `src/node/index.ts`:`useThreads` 显式忽略(不 warn,文档说明即可)。

### Phase 3 — 测试 ✅ 已完成

1. [x] 独立 `vite.threads.config.ts` 给线程 vitest 浏览器实例加 `server.headers = { "Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "require-corp" }`; 先断言测试环境 `crossOriginIsolated === true`(前提不成立时测试面全失效,要 fail loudly)。
2. [x] `test/abi-contract.test.ts`:抽出共享断言,新增对线程模块的同一方法面 + `controlThreading` 存在性断言(`test:abi` 覆盖两变体)。
3. [x] 浏览器测试新增:
   - `useThreads: true` 编码 ETC1S/UASTC 成功,输出过 ktx-parse 校验;
   - 与单线程输出的 SSIM ≥ 现有阈值(0.99 / 0.995)—— **不断言字节相等** (多线程 job 切分可能引入非确定性,以质量门为准);
   - 回退路径:mock `crossOriginIsolated === false` 场景下 warn + 单线程结果正常。
4. [x] perf 冒烟(非门禁,记录数字进 PR):2048² ETC1S compressionLevel 2, 单线程 vs 1+7 线程 wall time。预期 ≥ 2x,仅记录不设阈值。
5. [x] `test/encode-core.test.ts`:mock 层补 `controlThreading` 调用时机与 clamp 行为。

Phase 3 实测补充(2026-07-19,Chromium,12 逻辑核):

- `test:abi` 同时实例化单线程与线程 WASM,共享 ABI 断言全绿。
- ETC1S/UASTC 线程输出均经独立 transcoder + SSIM 质量门;另有 UASTC HDR 真实编码覆盖。
- 2048² 高细节固定种子 ETC1S CL2:单线程 21.05s,1+7 线程 6.32s,**3.33x**。平滑放大的低细节输入则为 1.33s→2.21s(**0.60x**),确认线程只应 opt-in 且主要服务计算密集的大纹理,不把性能比设成 CI 门禁。
- 3456²(11.94 Mpix)线程 UASTC HDR:共享堆峰值 **936.8 MiB**,耗时 4.32s; 1.5 GiB maximum 仍留约 600 MiB 余量,D4 验证闭环。
- 实际 npm `dist` 经 Vite production build 后,在 COOP/COEP preview 中成功派生 worker 并编码;Vitest 已覆盖 dev 形态,R1 二次打包风险关闭。

### Phase 4 — 文档 🚧 本地文档已完成

1. [x] `README.md` + `website/guide/advanced.md`:新 "Multithreaded encoding" 小节 —— opt-in 用法、COOP/COEP 部署要求(附常见平台配置示例)、回退语义、Node 不支持、 `wasmUrl` 与变体的对应关系、包体影响(懒加载,默认零成本)。
2. [ ] issue #48 勾选项对照更新(随 PR 一起处理)。

### Phase 5 — 发布(0.5 天)

- 纯增量 feature + 默认行为零变化 → **minor**:`0.7.0`。
- Commit/PR 走 conventional commits:`feat: add opt-in multithreaded encoding (closes #48)`。
- 发布前跑满:`test` + `test:abi` + `test:quality` + `test:gltf` + `npm pack` 装入消费者工程验证(含一个开了 COOP/COEP 的 vite 消费者样例)。

## 5. 验收标准

1. 默认路径(不传 `useThreads`)的加载字节、行为、输出与 0.6.0 **完全一致**。
2. cross-origin isolated 页面 + `useThreads: true`:编码成功、SSIM 过现有质量门、2048² ETC1S 相对单线程有可复现实测加速(数字记录在 PR)。
3. 非 isolated 页面 + `useThreads: true`:一次 warn,结果与单线程一致,不抛错。
4. Node + `useThreads: true`:忽略,行为不变。
5. `test:abi` 同时覆盖两份产物且全绿;两份 wasm 的 provenance(commit/emsdk/flags/sha256) 都记录在 `THIRD_PARTY_NOTICES.md`。

## 6. 风险与回退

- **R1(已关闭)打包器与 `new Worker(new URL(import.meta.url))` 的相性**: **Phase 0 已验证原生 ESM 路径可行**(COOP/COEP 下直接 `import` glue,worker 正常派生、编码成功)。**残余风险**仅在 glue 作为 npm 依赖被消费者 bundler **二次打包**时:worker 派生对 chunk URL/format 有假设。Phase 3 已在 Vite dev(vitest)与实际 npm `dist` 的production build + preview 两形态真实编码通过;构建产物正确重写 worker/chunk URL。
- **R2 死锁**:numThreads > 池大小时主线程同步等待新 worker → 挂死。已由 clamp(D3) 防御,测试覆盖 clamp。
- **R3 线程版内存形态回退**:固定 MAXIMUM_MEMORY 后,原本能靠 growth 侥幸完成的大输入可能 OOM。缓解:D4 取值以 12 Mpix 上限工作负载实测为准,且 12 Mpix guard 本就挡掉了最危险的输入。
- **R4 非确定性输出**:多线程 ETC1S 输出与单线程可能字节级不同。已决策:质量门 (SSIM)代替字节对比;文档明确 "同参数跨线程数不保证字节一致"。
- **回退开关**:任何阶段发现不可解问题,`useThreads` 不发布即可 —— 单线程路径全程未动,无需 revert 代码结构。

## 7. Non-goals(首期)

- wasm64 / `basis_encoder_threads_wasm64.js`(12 Mpix 上限的根本解,单独 issue)。
- Node 线程化(§D6,保留通路)。
- 自动启用线程(§D1,未来若要改默认值,是独立的 minor/major 决策)。
- HDR 6x6 / XUASTC 等新格式(与线程正交,另行跟踪 #27)。
