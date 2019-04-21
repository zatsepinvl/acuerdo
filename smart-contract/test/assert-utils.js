const assertBigNumbers = (expected, actual, message) => {
    assert.equal(expected.toFixed(), actual.toFixed(), message);
};

module.exports = {
    assertBigNumbers: assertBigNumbers
};