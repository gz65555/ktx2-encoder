import { read, write } from "ktx-parse";
import { IBasisModule, IEncodeOptions } from "../type.js";
import { applyInputOptions } from "../utils.js";
import { BasisTextureType, SourceType } from "../enum.js";

declare function importScripts(...args: any): any;

let promise: Promise<IBasisModule> | null = null;
const isInWorker = typeof document === "undefined";

class BrowserBasisEncoder {
  async init() {
    if (!promise) {
      function _init(): Promise<IBasisModule> {
        return new Promise((resolve, reject) => {
          if (!isInWorker) {
            Promise.all([
              fetch(
                "https://mdn.alipayobjects.com/rms/afts/file/A*SrRkQarYYl4AAAAAAAAAAAAAARQnAQ/basis_encoder.js"
              ).then((res) => res.text()),
              fetch(
                "https://mdn.alipayobjects.com/rms/afts/file/A*qFWbTrA0hZYAAAAAAAAAAAAAARQnAQ/basis_encoder.wasm"
              ).then((res) => res.arrayBuffer())
            ])
              .then(([basisEncoderCode, wasmBinary]) => {
                const script = document.createElement("script");
                script.onload = () => {
                  const basisModule = {
                    wasmBinary
                  };
                  // @ts-ignore
                  BASIS(basisModule)
                    .then((Module: any) => {
                      Module.initializeBasis();
                      resolve(Module);
                    })
                    .catch(reject);
                };
                script.src = URL.createObjectURL(new Blob([basisEncoderCode]));
                script.onerror = reject;
                document.body.appendChild(script);
              })
              .catch(reject);
          } else {
            importScripts(
              "https://mdn.alipayobjects.com/rms/afts/file/A*SrRkQarYYl4AAAAAAAAAAAAAARQnAQ/basis_encoder.js"
            );
            fetch("https://mdn.alipayobjects.com/rms/afts/file/A*qFWbTrA0hZYAAAAAAAAAAAAAARQnAQ/basis_encoder.wasm")
              .then((res) => res.arrayBuffer())
              .then((wasmBinary) => {
                const basisModule = {
                  wasmBinary
                };
                // @ts-ignore
                BASIS(basisModule)
                  .then((Module: any) => {
                    Module.initializeBasis();
                    resolve(Module);
                  })
                  .catch(reject);
              })
              .catch(reject);
          }
        });
      }
      promise = _init();
    }
    return promise;
  }

  encode(imageBuffer: Uint8Array, options: Partial<IEncodeOptions> = {}) {
    return this.init().then((basisModule) => {
      const encoder = new basisModule.BasisEncoder();
      applyInputOptions(options, encoder);
      encoder.setTexType(BasisTextureType.cBASISTexType2D);

      return options.imageDecoder!(imageBuffer).then((imageData) => {
        encoder.setSliceSourceImage(
          0,
          new Uint8Array(imageData.data),
          imageData.width,
          imageData.height,
          SourceType.RAW
        );

        const ktx2FileData = new Uint8Array(1024 * 1024 * 10);
        const byteLength = encoder!.encode(ktx2FileData);
        if (byteLength === 0) {
          throw "encode failed";
        }
        let actualKTX2FileData = new Uint8Array(ktx2FileData.buffer, 0, byteLength);
        if (options.kvData) {
          const container = read(ktx2FileData);
          for (let k in options.kvData) {
            container.keyValue[k] = options.kvData[k];
          }
          actualKTX2FileData = write(container, { keepWriter: true });
        }
        return actualKTX2FileData;
      });
    });
  }
}

export const browserEncoder = new BrowserBasisEncoder();
