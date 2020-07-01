module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  runner: 'groups',
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/types/*',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!src/utils/logger/*',
    '!src/index.ts'
  ]
};
