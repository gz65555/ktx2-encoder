import { InboxOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useRef } from "react";
import "./App.css";
import { initEngine } from "./loader";

export default function App() {
  async function beforeUpload(file: File) {
    if (!loadKTXRef.current) return;
    const buffer = await file.arrayBuffer();
    console.log(new Uint8Array(buffer));
    const blob = new Blob([buffer], { type: "image/ktx2" });
    const url = URL.createObjectURL(blob);
    await loadKTXRef.current(url + "#.ktx2");
    URL.revokeObjectURL(url);
    return false;
  }

  const loadKTXRef = useRef<(url: string) => any>();

  useEffect(() => {
    initEngine(document.getElementById("canvas") as HTMLCanvasElement).then((load) => {
      loadKTXRef.current = load;
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column"
      }}
    >
      <canvas id="canvas" style={{ backgroundColor: "rgba(76, 76, 76, 255)", width: 500, height: 500 }}></canvas>
      <div style={{ height: 140, marginTop: 20 }}>
        <Dragger showUploadList={false} beforeUpload={beforeUpload} style={{ width: "500px" }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Select ktx2 file to this area to show</p>
        </Dragger>
      </div>
    </div>
  );
}
