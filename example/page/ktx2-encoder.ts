import { WorkerPool } from "./WorkerPool";

class KTX2Encoder {
  private encoderWorkerPool: WorkerPool;
  private initPromise: Promise<any>;

  constructor() {
    this.encoderWorkerPool = new WorkerPool(4, async () => {
      const code = await fetch("https://gw.alipayobjects.com/os/lib/ktx2-encoder/0.0.6/dist/main.umd.js").then((res) =>
        res.text()
      );
      const blob = new Blob([code], { type: "application/javascript" });
      return new Worker(URL.createObjectURL(blob));
    });
    this.initPromise = this.encoderWorkerPool.prepareWorker();
  }

  encode(buffer: ArrayBuffer): Promise<Uint8Array> {
    return this.initPromise.then(() => {
      return this.encoderWorkerPool.postMessage(buffer).then((event) => {
        return event.data;
      });
    });
  }
}

export const ktx2Encoder = new KTX2Encoder();
