import { Button } from "antd";
import React from "react";
import { DownloadOutlined } from "@ant-design/icons";
import jszip from "jszip";
import { PreEncodeFile } from "./type";
import { useState } from "react";
import { downloadBlob } from "./utils";
import { encodeToKTX2 } from "../../src/web";

export const DownloadComponent: React.FC<{ list: PreEncodeFile[] }> = ({ list }) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      loading={isLoading}
      icon={<DownloadOutlined />}
      onClick={() => {
        const zip = new jszip();
        setIsLoading(true);
        const promises = list.map((item) => {
          return item.file.arrayBuffer().then(async (buffer) => {
            return encodeToKTX2(new Uint8Array(buffer), {
              isUASTC: true,
              enableDebug: false,
              qualityLevel: 230,
              generateMipmap: true
            });
          });
        });
        Promise.all(promises)
          .then((result) => {
            result.forEach((data, index) => {
              console.log(data);
              zip.file(list[index].name.replace(/\.[^.]+$/, ".ktx2"), data);
            });
            return zip.generateAsync({ type: "blob" });
          })
          .then((blob) => {
            downloadBlob(blob, "files.zip");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }}
    />
  );
};
