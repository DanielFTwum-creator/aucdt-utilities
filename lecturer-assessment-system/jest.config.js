module.exports = {
  preset: 'jest-playwright',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: './e2e/.*\\.test\\.ts$',
  setupFilesAfterEnv: ['./e2e/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
