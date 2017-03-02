const mock = {reset: resetMock}

mock.reset()

module.exports = {
  sync() {
    return mock.sync.returnValue
  },
  __mock: mock,
}

function resetMock() {
  Object.assign(mock, {
    sync: {returnValue: true},
  })
}
