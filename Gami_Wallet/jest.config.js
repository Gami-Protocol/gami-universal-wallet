/**
 * Jest config scoped to pure-TS utilities only.
 *
 * The Expo / React Native runtime is intentionally NOT initialised here —
 * mixing in jest-expo / RN transformers requires a much heavier setup that
 * is out of scope for this initial test suite. Tests that need to mount
 * components or touch native modules should live behind a separate jest
 * project (e.g. with the `jest-expo` preset) and is tracked as follow-up
 * work.
 *
 * To stay safe, `testMatch` only picks up files under `src/utils/`. Adding
 * tests for code that imports `react-native`, `expo-*`, or any UI component
 * here will fail unless the preset is upgraded.
 */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["<rootDir>/src/utils/**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
