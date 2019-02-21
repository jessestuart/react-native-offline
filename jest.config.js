const path = require('path');

module.exports = {
  collectCoverage: true,
  preset: 'react-native',
  moduleDirectories: ['node_modules', 'src', 'test'],
  modulePaths: [path.join(__dirname, 'src')],
  preset: 'react-native',
  reporters: ['default', 'jest-junit'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  setupTestFrameworkScriptFile: '<rootDir>/test/setupTestEnv.ts',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(js|ts|tsx)$':
      '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  modulePathIgnorePatterns: ['<rootDir>/example/'],
};
