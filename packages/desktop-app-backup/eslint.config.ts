import baseConfig from "../../eslint.config";
import tseslint from "typescript-eslint";

export default tseslint.config(baseConfig, {
  rules: {
    "@typescript-eslint/consistent-type-definitions": "off",
  },
});
