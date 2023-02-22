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
        target: "es5"
      },
      sourceMaps: true
    })
  ),
  minify()
];

export default [
  {
    input: "./src/index.ts",
    plugins,
    output: [
      {
        file: "dist/module.esm.js",
        format: "es"
      },
      {
        file: "dist/main.js",
        format: "umd",
        name: "KTX2Encoder"
      }
    ]
  }
];
