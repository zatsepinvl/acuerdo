const assertBigNumbers = (expected, actual, message) => {
    assert.equal(expected.toFixed(), actual.toFixed(), message);
};

const expectError = async (promise, message) => {
    let error;
    await promise.catch(err => error = err);
    expect(error.message).to.contains(message);
};

module.exports = {
    assertBigNumbers: assertBigNumbers,
    expectError: expectError
};