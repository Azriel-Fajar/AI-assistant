export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['**/*.js', '!node_modules/**', '!tests/**'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {},
};
