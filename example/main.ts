import { encodeKTX2, encodeKTX2Cube } from "../src";

fetch("/DuckCM.png")
  .then((res) => res.arrayBuffer())
  .then((pngBuffer) => {
    encodeKTX2(pngBuffer).then((output) => {
      console.log(output);
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
