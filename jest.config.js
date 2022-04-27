const { defaults } = require('jest-config');

module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.ts$': 'ts-jest/legacy'
    },
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
    setupFiles: ['dotenv/config'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['types.ts']
};
