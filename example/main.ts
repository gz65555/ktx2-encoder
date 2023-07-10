import { encodeToKTX2, encodeKTX2Cube, encodeImageToKTX2 } from "../src";
import { SourceType } from "../src/IBasisEncoder";
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

// fetch("/DuckCM.png")
fetch("/photo-min.jpeg")
  .then((res) => res.blob())
  .then(async (pngBlob) => {
    // const buffer = await pngBlob.arrayBuffer();
    for (let i = 0; i < 3; i++) {
      console.time("encode time");
      await encodeToKTX2(pngBlob, { type: SourceType.JPG });
      console.timeEnd("encode time");
    }
  });

// Promise.all([
//   fetch("/cube/nx.png").then((res) => res.arrayBuffer()),
//   fetch("/cube/ny.png").then((res) => res.arrayBuffer()),
//   fetch("/cube/nz.png").then((res) => res.arrayBuffer()),
//   fetch("/cube/px.png").then((res) => res.arrayBuffer()),
//   fetch("/cube/py.png").then((res) => res.arrayBuffer()),
//   fetch("/cube/pz.png").then((res) => res.arrayBuffer())
// ]).then((buffers) => {
//   encodeKTX2Cube(buffers, { sourceType: SourceType.PNG }).then((output) => {
//     console.log(output);
//   });
// });
