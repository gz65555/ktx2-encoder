import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { UploadComponent } from "./UploadComponents";
import { ImageGroup } from "./ImageGroup";
import { useState } from "react";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const [list, setImageList] = useState<{ name: string; url: string }[]>([]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "row-reverse"
        }}
      >
        {/* <div className="demo-logo" /> */}
        <div>
          <UploadComponent setImageList={setImageList} />
        </div>
      </Header>
      <Content
        className="site-layout"
        style={{ padding: "0 50px", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <ImageGroup list={list} setImageList={setImageList} />
      </Content>
      <Footer style={{ textAlign: "center" }}>KTX2 Encoder ©2023 Created by HuSong</Footer>
    </Layout>
  );
};

export default App;
