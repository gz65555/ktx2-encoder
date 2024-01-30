export const decodeImageBitmap = (function () {
  async function webgpuDecode(device: GPUDevice, imageBitmap: ImageBitmap) {
    // 创建 WebGPU 纹理
    const texture = device!.createTexture({
      size: [imageBitmap.width, imageBitmap.height, 1],
      format: "rgba8unorm", // 根据需要选择合适的格式
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
    });

    // 将 ImageBitmap 上传到纹理
    device!.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture: texture }, [
      imageBitmap.width,
      imageBitmap.height
    ]);

    // 创建一个读取缓冲区
    const buffer = device!.createBuffer({
      size: imageBitmap.width * imageBitmap.height * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    // 从纹理复制到缓冲区
    const commandEncoder = device!.createCommandEncoder();
    commandEncoder.copyTextureToBuffer(
      { texture: texture, mipLevel: 0, origin: { x: 0, y: 0, z: 0 } },
      { buffer: buffer, bytesPerRow: imageBitmap.width * 4 },
      { width: imageBitmap.width, height: imageBitmap.height }
    );

    // 提交指令
    const gpuCommands = commandEncoder.finish();
    device!.queue.submit([gpuCommands]);

    // 读取缓冲区数据并转换为 ImageData
    await buffer.mapAsync(GPUMapMode.READ);
    const arrayBuffer = buffer.getMappedRange(0, imageBitmap.width * imageBitmap.height * 4);
    const data = new Uint8Array(arrayBuffer.slice(0));

    buffer.unmap();

    texture.destroy();
    buffer.destroy();

    return {
      data,
      width: imageBitmap.width,
      height: imageBitmap.height
    };
  }

  const getDevice = (function () {
    const gpu = navigator.gpu;
    let adapter = undefined;
    let device: GPUDevice | undefined = undefined;
    return async () => {
      if (gpu) {
        adapter = await gpu.requestAdapter();
        device = await adapter!.requestDevice();
      }
      return device;
    };
  })();

  const getGlContext = (function () {
    let gl: WebGL2RenderingContext | null = null;
    return function () {
      if (!gl) {
        const canvas = new OffscreenCanvas(128, 128);
        gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
      }
      return gl as WebGL2RenderingContext;
    };
  })();

  function webglDecode(imageBitmap: ImageBitmap) {
    const gl = getGlContext();
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageBitmap);

    let framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    let width = imageBitmap.width;
    let height = imageBitmap.height;
    let pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    gl.deleteTexture(texture);
    gl.deleteFramebuffer(framebuffer);

    return {
      data: new Uint8Array(pixels),
      width,
      height
    };
  }

  return async function (imageBitmap: ImageBitmap) {
    const device = await getDevice();
    if (device) return webgpuDecode(device, imageBitmap);
    else return webglDecode(imageBitmap);
  };
})();
