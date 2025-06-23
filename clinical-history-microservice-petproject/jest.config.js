module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/main.ts',
    '!**/create-clinical-history.dto.ts',
    '!**/update-clinical-history.dto.ts',
    '!**/clinical-history.module.ts',
    '!**/app.module.ts',
    '!**/app.controller.ts',
    '!**/app.service.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
