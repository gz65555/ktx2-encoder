import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import workerUrl from "../../src/web/index.js?worker&url";

const worker = new Worker(workerUrl, { type: "module" });
console.log(worker);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
