module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coveragePathIgnorePatterns: [
    'main.ts',
    '.*\\.module\\.ts',
    'src/auth/auth.service.ts',
  ],
  coverageDirectory: '../coverage',
};
