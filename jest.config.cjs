module.exports = {
    testEnvironment: "node",
    collectCoverage: false,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "html", "lcov"],
    transform: {
        "^.+\\.js$": "babel-jest"
    }
}
