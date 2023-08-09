import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";

const props: UploadProps = {
  name: "file",
  multiple: true,
  accept: ".jpg,.jpeg,.png,.webp",
  showUploadList: false
};

let lastFileList: any;

export const UploadComponent: React.FC<{ setImageList: (list: { name: string; url: string }[]) => void }> = ({
  setImageList
}) => (
  <Upload
    {...props}
    beforeUpload={(_, fileList) => {
      if (fileList === lastFileList) {
        return false;
      }
      lastFileList = fileList;
      setImageList(
        fileList.map((file) => {
          const url = URL.createObjectURL(file);
          const name = file.name;
          return { url, name };
        })
      );
      return false;
    }}
  >
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
);
