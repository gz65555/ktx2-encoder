import { encodeToKTX2, IEncodeOptions } from "./index.js";

self.onmessage = (event: MessageEvent<{ buffer: Uint8Array; options: Partial<IEncodeOptions> }>) => {
  const { buffer, options } = event.data;
  encodeToKTX2(buffer, options).then((data) => {
    self.postMessage(data);
  });
};