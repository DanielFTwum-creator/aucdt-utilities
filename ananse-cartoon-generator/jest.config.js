/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'jest-playwright',
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-node/esm',
  },
  moduleNameMapper: {
    '^(.*)\\.js$': '$1',
  },
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['expect-playwright'],
  testTimeout: 40000,
};
