import { encodeKTX2, encodeKTX2Cube } from "../src";
import { write, read } from "./ktx-parse";

function downloadBlob(data: BlobPart, fileName: string, mimeType?: string) {
  var blob, url;
  blob = new Blob([data], {
    type: mimeType
  });
  url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(function () {
    return window.URL.revokeObjectURL(url);
  }, 1000);
}

function downloadURL(data: string, fileName: string) {
  var a;
  a = document.createElement("a");
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style = "display: none";
  a.click();
  a.remove();
}

fetch("/DuckCM.png")
  .then((res) => res.arrayBuffer())
  .then((pngBuffer) => {
    encodeKTX2(pngBuffer, { kvData: { GalaceanTextureParams: new Uint8Array([0, 0, 0, 16]) } }).then((output) => {
      const container = read(output);
      // downloadBlob(output, "KVImage.ktx2");
    });
  });

Promise.all([
  fetch("/cube/nx.png").then((res) => res.arrayBuffer()),
  fetch("/cube/ny.png").then((res) => res.arrayBuffer()),
  fetch("/cube/nz.png").then((res) => res.arrayBuffer()),
  fetch("/cube/px.png").then((res) => res.arrayBuffer()),
  fetch("/cube/py.png").then((res) => res.arrayBuffer()),
  fetch("/cube/pz.png").then((res) => res.arrayBuffer())
]).then((buffers) => {
  encodeKTX2Cube(buffers).then((output) => {
    console.log(output);
  });
});
