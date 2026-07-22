import { encodeToKTX2 } from "ktx2-encoder";

const status = document.querySelector<HTMLPreElement>("#status");
if (!status) throw new Error("missing status element");

try {
  if (!crossOriginIsolated) throw new Error("consumer page is not cross-origin isolated");
  const input = new Uint8Array(await fetch("/tests/DuckCM.png").then((response) => response.arrayBuffer()));
  const output = await encodeToKTX2(input, {
    isUASTC: false,
    qualityLevel: 230,
    generateMipmap: false,
    useThreads: true,
    numThreads: 4
  });
  const ktx2Magic = [0xab, 0x4b, 0x54, 0x58, 0x20, 0x32, 0x30, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a];
  if (!ktx2Magic.every((value, index) => output[index] === value)) throw new Error("encoder returned invalid KTX2");

  status.dataset.status = "success";
  status.textContent = `encoded ${output.byteLength} bytes`;
} catch (error) {
  status.dataset.status = "error";
  status.textContent = error instanceof Error ? (error.stack ?? error.message) : String(error);
}
