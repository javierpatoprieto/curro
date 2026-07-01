import next from "eslint-config-next";

// eslint-config-next 16 exporta directamente un flat config (array).
const eslintConfig = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**"],
  },
];

export default eslintConfig;
