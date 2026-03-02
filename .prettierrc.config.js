/** @type {import("prettier").Config} */

const config = {
  semi: true,
  trailingComma: "es5",
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  bracketSameLine: false,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  jsxSingleQuote: false,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
