import { CubeBufferData, IBasisModule, IEncodeOptions } from "../type.js";
import { encodeWithModule } from "../encodeCore.js";
import BASIS from "../basis/basis_encoder.js";

export class NodeBasisEncoder {
  private modulePromise: Promise<IBasisModule> | null = null;

  async init(): Promise<IBasisModule> {
    if (!this.modulePromise) {
      this.modulePromise = BASIS().then((basis: IBasisModule) => {
        basis.initializeBasis();
        return basis;
      });
    }
    return this.modulePromise;
  }

  async encode(
    bufferOrBufferArray: Uint8Array | CubeBufferData,
    options: Partial<IEncodeOptions> = {}
  ): Promise<Uint8Array> {
    return encodeWithModule(await this.init(), bufferOrBufferArray, options);
  }
}

export const nodeEncoder = new NodeBasisEncoder();
