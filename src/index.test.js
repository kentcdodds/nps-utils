import path from 'path'
import {concurrent, series, runInNewWindow} from '.'

test('series', () => {
  expect(
    series('echo hey', null, 'echo hi', undefined, 'echo there', false),
  ).toMatchSnapshot()
})

test('series.nps', () => {
  expect(
    series.nps(
      'test',
      false,
      'lint.src',
      null,
      'lint.scripts --cache',
      undefined,
      ' ',
      'build --fast',
    ),
  ).toMatchSnapshot()
})

test('concurrent', () => {
  expect(
    concurrent({
      test: 'echo test',
      validate: {
        script: false,
      },
      lint: {script: 'echo lint', color: 'bgWhite.black.dim'},
      build: false,
      cover: undefined,
    }),
  ).toMatchSnapshot()
})

test('concurrent.nps', () => {
  expect(
    concurrent.nps(
      null,
      'test',
      undefined,
      'lint',
      {script: 'build.app --silent'},
      false,
      {script: 'validate', color: 'bgGreen.dim'},
    ),
  ).toMatchSnapshot()
})

test('runInNewWindow', () => {
  expect(relativeizePath(runInNewWindow('echo hi'))).toMatchSnapshot()
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
