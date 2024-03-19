import resolve from "@rollup/plugin-node-resolve";
import { swc, defineRollupSwcOption, minify } from "rollup-plugin-swc3";
import alias from "@rollup/plugin-alias";

const plugins = [
  resolve({ extensions: [".ts"], browser: false }),
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
  )
  // alias({
  //   entries: [{ find: "@basis/basis_encoder.js", replacement: "../libs/basis_encoder.js" }]
  // })
  // minify({
  //   module: true
  // })
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
    external: ["@basis/basis_encoder.js"],
    output: [
      {
        file: "dist/node.esm.js",
        format: "es",
        inlineDynamicImports: true
      }
    ]
  }
];
