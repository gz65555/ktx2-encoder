import type { IBasisModule } from "../../type";

declare const BASIS: (options?: { wasmBinary?: ArrayBuffer }) => Promise<IBasisModule>;
export default BASIS;
