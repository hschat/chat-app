'use strict';

module.exports = {
  // Only include files directly in __tests__, not in nested folders.
  testRegex: '__tests__/[^/]*(\\.test.js|\\.test.coffee|[^d]\\.test.ts)$',
  moduleFileExtensions: ['js', 'jsx', 'json', 'node', 'coffee', 'ts'],
  rootDir: process.cwd(),
  modulePaths: [
      '<rootDir>/src',
      '<rootDir>/node_modules'
  ],
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!react-navigation|react-native|@expo|expo|native-base-shoutem-theme|react-native-action-sheet|react-runtime|sentry-expo)'
  ]
};