import path from 'path'
import hasbinMock from 'hasbin'
import {oneLine, oneLineTrim} from 'common-tags'
import {concurrent, series, runInNewWindow} from '.'

test('series', () => {
  expect(
    series('echo hey', null, 'echo hi', undefined, 'echo there', false),
  ).toBe('echo hey && echo hi && echo there')
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
  ).toBe(
    oneLine`
      nps test && nps lint.src &&
      nps "lint.scripts --cache" &&
      nps "build --fast"
    `,
  )
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
  ).toBe(
    oneLine`
      concurrently
      --kill-others-on-fail
      --prefix-colors "bgCyan.bold.dim,bgWhite.black.dim"
      --prefix "[{name}]"
      --names "test,lint"
      'echo test' 'echo lint'
    `,
  )
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
  ).toBe(
    oneLine`
      concurrently
      --kill-others-on-fail
      --prefix-colors
      ${oneLineTrim`
        "black.bgYellow.bold.dim,bgRed.bold.dim,
        bgBlack.bold.white.dim,bgGreen.dim"
      `}
      --prefix "[{name}]"
      --names "test,lint,build.app,validate"
      'nps test' 'nps lint' 'nps "build.app --silent"' 'nps validate'
    `,
  )
})

test('concurrent can find the relative path to the concurrently bin', () => {
  hasbinMock.__mock.sync.returnValue = false
  expect(
    concurrent({
      test: 'jest',
      lint: 'eslint',
    }),
  ).toBe(
    oneLine`
      node node_modules/concurrently/src/main.js
      --kill-others-on-fail
      --prefix-colors "bgCyan.bold.dim,black.bgYellow.bold.dim"
      --prefix "[{name}]"
      --names "test,lint"
      jest eslint
    `,
  )
  hasbinMock.__mock.reset()
})

test('runInNewWindow', () => {
  expect(relativeizePath(runInNewWindow('echo hi'))).toMatch(
    oneLine`
      osascript
      -e 'tell application "Terminal"'
      ${oneLine`
        -e 'tell application "System Events"
        to keystroke "t" using {command down}'
      `}
      -e 'do script "cd <projectRootDir> && echo hi" in front window'
      -e 'end tell'
    `,
  )
})

test('runInNewWindow.nps as windows', () => {
  const originalPlatform = process.platform
  process.platform = 'win32'
  jest.resetModules()
  const freshUtils = require('.')
  expect(
    relativeizePath(freshUtils.runInNewWindow.nps('initiate database')),
  ).toBe(
    oneLine`
      start cmd /k "cd <projectRootDir> &&
      node node_modules/.bin/nps \\"initiate database\\""
    `,
  )
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
