module.exports = {
  moduleFileExtensions: ['js'],
  testMatch: ['<rootDir>/dist/**/*.test.js'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/dist/shared/test/setup.js'],
};
