import { CubeBufferData, IBasisModule, IEncodeOptions } from "../type.js";
import { encodeWithModule } from "../encodeCore.js";
import BASIS from "../basis/basis_encoder.js";

let promise: Promise<IBasisModule> | null = null;

class NodeBasisEncoder {
  async init(): Promise<IBasisModule> {
    if (!promise) {
      promise = BASIS().then((basis: IBasisModule) => {
        basis.initializeBasis();
        return basis;
      });
    }
    return promise;
  }

  async encode(
    bufferOrBufferArray: Uint8Array | CubeBufferData,
    options: Partial<IEncodeOptions> = {}
  ): Promise<Uint8Array> {
    return encodeWithModule(await this.init(), bufferOrBufferArray, options);
  }
}

export const nodeEncoder = new NodeBasisEncoder();
