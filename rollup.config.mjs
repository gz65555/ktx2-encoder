import resolve from "@rollup/plugin-node-resolve";
import { swc, defineRollupSwcOption, minify } from "rollup-plugin-swc3";

const plugins = [
  resolve({ extensions: [".ts"] }),
  swc(
    defineRollupSwcOption({
      include: /\.[mc]?[jt]sx?$/,
      exclude: /node_modules/,
      jsc: {
        loose: true,
        externalHelpers: true,
        target: "es2020"
      },
      sourceMaps: true
    })
  ),
  minify({
    module: true
  })
];

export default [
  {
    input: "./src/web/index.ts",
    plugins,
    output: [
      {
        file: "dist/web.esm.js",
        format: "es"
      }
    ]
  },
  {
    input: "./src/node/index.ts",
    plugins,
    output: [
      {
        file: "dist/node.esm.js",
        format: "es"
      }
    ]
  }
];
