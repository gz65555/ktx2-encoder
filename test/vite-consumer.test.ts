import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Page } from "playwright";
import { afterAll, beforeAll, expect, test } from "vitest";
import { build, preview, type PreviewServer } from "vite";

const REPO_ROOT = fileURLToPath(new URL("../", import.meta.url));
const FIXTURE_ROOT = resolve(REPO_ROOT, "test/fixtures/vite-consumer");
let outputDir: string;
let server: PreviewServer;
let pageUrl: string;

beforeAll(async () => {
  outputDir = await mkdtemp(resolve(tmpdir(), "ktx2-vite-consumer-"));
  await build({
    root: FIXTURE_ROOT,
    publicDir: resolve(REPO_ROOT, "public"),
    logLevel: "warn",
    build: { outDir: outputDir, emptyOutDir: true }
  });

  server = await preview({
    root: FIXTURE_ROOT,
    publicDir: resolve(REPO_ROOT, "public"),
    configFile: false,
    logLevel: "silent",
    build: { outDir: outputDir },
    preview: {
      host: "127.0.0.1",
      port: 0,
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp"
      }
    }
  });
  const address = server.httpServer.address();
  if (!address || typeof address === "string") throw new Error("Vite preview did not expose a TCP address");
  pageUrl = `http://127.0.0.1:${address.port}`;
}, 120_000);

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolveClose, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolveClose()));
    });
  }
  if (outputDir) await rm(outputDir, { recursive: true, force: true });
});

test("Vite production build emits and runs the threaded variant", { timeout: 120_000 }, async () => {
  const assets = await readdir(resolve(outputDir, "assets"));
  expect(assets.some((name) => /^basis_encoder_threads[.-].*\.wasm$/.test(name))).toBe(true);
  expect(assets.some((name) => /^basis_encoder_threads[.-].*\.js$/.test(name))).toBe(true);

  const browser = await chromium.launch();
  let page: Page | undefined;
  try {
    page = await browser.newPage();
    await page.goto(pageUrl);
    await page.locator('[data-status="success"]').waitFor({ timeout: 60_000 });
    await expect(page.locator("#status").textContent()).resolves.toMatch(/^encoded \d+ bytes$/);
  } catch (error) {
    const status = page
      ? await page
          .locator("#status")
          .textContent()
          .catch(() => null)
      : null;
    throw new Error(`Vite consumer failed: ${String(error)}\npage status: ${status ?? "unavailable"}`, {
      cause: error
    });
  } finally {
    await browser.close();
  }
});
