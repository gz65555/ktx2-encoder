import { encodeToKTX2 } from "../src";
import { SourceType } from "../src/IBasisEncoder";
import { BufferReader } from "./BufferReader";
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

function decodeText(uint8Array: Uint8Array) {
  return new TextDecoder().decode(uint8Array);
}

function decodeHeader(arrayBuffer: ArrayBuffer) {
  const dataView = new DataView(arrayBuffer);
  const totalLen = dataView.getUint32(0, true);
  const fileVersion = dataView.getUint8(4);
  const typeLen = dataView.getUint16(5, true);
  const typeUint8Array = new Uint8Array(arrayBuffer, 7, typeLen);
  const nameLen = dataView.getUint16(7 + typeLen, true);
  const nameUint8Array = new Uint8Array(arrayBuffer, 9 + typeLen, nameLen);

  const name = decodeText(nameUint8Array);
  const type = decodeText(typeUint8Array);
  // const header = new FileHeader();
  // header.totalLength = totalLen;
  // header.name = name;
  // header.type = type;
  // header.version = fileVersion;
  // header.headerLength = nameUint8Array.byteLength + typeUint8Array.byteLength + 9;
  return { headerLength: nameUint8Array.byteLength + typeUint8Array.byteLength + 9, totalLength: totalLen };
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

fetch("/scene-test/base.json")
  .then((res) => res.json())
  .then(async (data) => {
    // Promise.all(
    //   data.map((info) => {
    //     const url = info.path;
    //     return fetch(url)
    //       .then((res) => res.arrayBuffer())
    //       .then((buffer) => encodeToKTX2(buffer));
    //   })
    // ).then((ktx2data) => {
    //   // console.log(ktx2data);
    // });
    for (let i = 0; i < data.length; i++) {
      const info = data[i];
      const url = info.path;
      await fetch(url)
        .then((res) => res.arrayBuffer())
        .then(async (buffer) => {
          const header = decodeHeader(buffer);
          const bufferReader = new BufferReader(
            new Uint8Array(buffer),
            header.headerLength,
            header.totalLength - header.headerLength
          );
          const objectId = bufferReader.nextStr();
          const mipmap = !!bufferReader.nextUint8();
          const filterMode = bufferReader.nextUint8();
          const anisoLevel = bufferReader.nextUint8();
          const wrapModeU = bufferReader.nextUint8();
          const wrapModeV = bufferReader.nextUint8();
          const format = bufferReader.nextUint8();
          const width = bufferReader.nextUint16();
          const height = bufferReader.nextUint16();
          const isPixelBuffer = bufferReader.nextUint8();

          const mipCount = bufferReader.nextUint8();
          const imagesData = bufferReader.nextImagesData(mipCount);

          const uint8Array = imagesData[0];
          // const ab = uint8Array.buffer.slice(uint8Array.byteOffset, uint8Array.byteLength + uint8Array.byteOffset);
          // const ktx2Buffer = await encodeToKTX2(new Blob([uint8Array]), { generateMipmap: false });
          const path = info.virtualPath;
          const regex = /[^/]+$/;
          const match = regex.exec(path);
          const filename = match![0];
          const regex0 = /\.[^.]+$/;
          const newExtension = ".ktx2";
          // const newFilename = filename.replace(regex0, newExtension);
          // console.log(filename); // 输出：file.txt
          // downloadBlob(uint8Array, filename);
        });
    }
  });
