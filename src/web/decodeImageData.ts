export const decodeImageBitmap = (function () {
  const getGlContext = (function () {
    let gl: WebGL2RenderingContext | null = null;
    return function () {
      if (!gl) {
        const canvas = new OffscreenCanvas(128, 128);
        const context = canvas.getContext("webgl2", { premultipliedAlpha: false });
        if (!context) throw new Error("WebGL2 is not supported");
        gl = context;
      }
      return gl;
    };
  })();

  return async function webglDecode(imageBuffer: Uint8Array) {
    const gl = getGlContext();
    const imageBitmap = await createImageBitmap(new Blob([new Uint8Array(imageBuffer)]));
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
  };
})();
