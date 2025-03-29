module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'], // Ensure test files are matched
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/services/**/*.ts', // Include service files for coverage
        '!src/types/**/*.d.ts' // Exclude type definitions
    ]
};