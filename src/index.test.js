import path from 'path'
import {concurrent, series, runInNewWindow, rimraf} from '.'

const snapshotTests = {
  series: series('echo hey', null, 'echo hi', undefined, 'echo there', false),
  'series.nps': series.nps(
    'test',
    false,
    'lint.src',
    null,
    'lint.scripts --cache',
    undefined,
    ' ',
    'build --fast',
  ),
  concurrent: concurrent({
    test: 'echo test',
    validate: {
      script: false,
    },
    lint: {script: 'echo lint', color: 'bgWhite.black.dim'},
    build: false,
    cover: undefined,
  }),
  'concurrent.nps': concurrent.nps(
    null,
    'test',
    undefined,
    'lint',
    {script: 'build.app --silent'},
    false,
    {script: 'validate', color: 'bgGreen.dim'},
  ),
  runInNewWindow: runInNewWindow('echo hi'),
  'runInNewWindow.nps': runInNewWindow.nps('lint --cache'),
  rimraf: rimraf('build'),
}

Object.keys(snapshotTests).forEach(testName => {
  test(testName, () => {
    const result = snapshotTests[testName]
    expect(relativeizePath(result)).toMatchSnapshot()
  })
})

test('runInNewWindow.nps as windows', () => {
  const originalPlatform = process.platform
  process.platform = 'win32'
  jest.resetModules()
  const freshUtils = require('.')
  expect(
    relativeizePath(freshUtils.runInNewWindow.nps('initiate database')),
  ).toMatchSnapshot()
  process.platform = originalPlatform
})

function relativeizePath(stringWithAbsolutePaths) {
  return stringWithAbsolutePaths.replace(
    new RegExp(path.resolve(__dirname, '../'), 'g'),
    '<projectRootDir>',
  )
}

/*
  eslint
    global-require:0,
    import/no-dynamic-require:0
*/
