import path from 'path'

// all of these tests are run both as darwin and win32
// you provide the key (test name) and the value is a
// function that accepts npsUtils which you can use to
// create the result.
const snapshotTests = {
  series: ({series}) =>
    series('echo hey', null, 'echo hi', undefined, 'echo there', false),
  'series.nps': ({series}) =>
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
  concurrent: ({concurrent}) => concurrent({
    test: 'echo test',
    validate: {
      script: false,
    },
    lint: {script: 'echo lint', color: 'bgWhite.black.dim'},
    build: false,
    cover: undefined,
  }),
  'concurrent.nps': ({concurrent}) =>
    concurrent.nps(
      null,
      'test',
      undefined,
      'lint',
      {script: 'build.app --silent'},
      false,
      {script: 'validate', color: 'bgGreen.dim'},
    ),
  runInNewWindow: ({runInNewWindow}) => runInNewWindow('echo hi'),
  'runInNewWindow.nps': ({runInNewWindow}) =>
    runInNewWindow.nps('lint --cache'),
  rimraf: ({rimraf}) => rimraf('build'),
  ifWindows: ({ifWindows}) => ifWindows('echo main', 'echo alternate'),
  ifNotWindows: ({ifNotWindows}) =>
    ifNotWindows('echo main', 'echo alternate'),
  copy: ({copy}) => copy('"**/*.html" "../dist/" --cwd=src --parents'),
  ncp: ({ncp}) => ncp('src dist'),
  mkdirp: ({mkdirp}) => mkdirp('/tmp/foo/bar/baz'),
  open: ({open}) =>
    open('http://kentcdodds.com -- "google chrome" --incognito'),
  crossEnv: ({crossEnv}) => crossEnv('NODE_ENV=test jest'),
  commonTags: ({commonTags}) =>
    commonTags.oneLine`  helpful\n  stuff\n  my good\n  friend`,
  setColors: ({concurrent, setColors}) => {
    setColors(['white.bgBlue.bold', 'black.bgYellow.dim'])
    return concurrent.nps('lint', 'build')
  },
  shellEscape: ({shellEscape}) =>
    shellEscape(`testing $:{}()[]ą^ęńł'÷/\\'\`" `),
  getBin: ({getBin}) => getBin('rimraf'),
}

Object.keys(snapshotTests).forEach(testName => {
  test(`${testName} as darwin`, () => {
    const result = withPlatform('darwin', snapshotTests[testName])
    expect(relativeizePath(result)).toMatchSnapshot()
  })
  test(`${testName} as win32`, () => {
    const result = withPlatform('win32', snapshotTests[testName])
    expect(relativeizePath(result)).toMatchSnapshot()
  })
})

function withPlatform(platform, getResult) {
  const originalPlatform = process.platform
  process.platform = platform
  jest.resetModules()
  const freshUtils = require('.')
  const result = getResult(freshUtils)
  process.platform = originalPlatform
  return result
}

function relativeizePath(stringWithAbsolutePaths) {
  // escape string for regexp generation
  const escapedPath = path
    .resolve(__dirname, '../')
    .replace(
      new RegExp('[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\^\\$\\|]', 'g'),
      '\\$&',
    )

  const relativePath = stringWithAbsolutePaths.replace(
    new RegExp(escapedPath, 'g'),
    '<projectRootDir>',
  )

  return relativePath.replace(/\\/g, '/')
}

/*
  eslint
    global-require:0,
    import/no-dynamic-require:0
*/
