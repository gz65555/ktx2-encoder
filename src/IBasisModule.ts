import { IBasisEncoder } from "./IBasisEncoder";

export interface IBasisModule {
  BasisEncoder: IBasisEncoder;
  initializeBasis: () => void;
}
