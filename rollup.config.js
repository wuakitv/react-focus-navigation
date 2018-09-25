// rollup.config.js
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";

export default {
  input: "src/index.js",
  output: {
    file: "build/bundle.js",
    format: "umd",
    name: "react-focus-navigation",
    globals: {
      react: "React",
      "react-dom": "ReactDOM"
    }
  },
  external: ["react", "react-dom"],
  plugins: [
    babel({
      exclude: "node_modules/**" // only transpile our source code
    }),
    commonjs(),
    resolve({ jsnext: true, main: true, browser: true }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
};
