import React, { useState } from "react";
import { Modal, Upload } from "antd";
import type { RcFile } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const ImageGroup: React.FC<{
  list: { url: string; name: string }[];
  setImageList: (list: { name: string; url: string }[]) => void;
}> = ({ list, setImageList }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const data = list.map(({ url, name }, index) => {
    return {
      url,
      uid: index + "",
      status: "done",
      name: name
    } as UploadFile;
  });

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={data}
        onPreview={handlePreview}
        onRemove={(file) => {
          URL.revokeObjectURL(file.url!);
          setImageList(list.filter((item) => file.url !== item.url));
        }}
      ></Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};
