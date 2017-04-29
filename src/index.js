import path from 'path'
import * as commonTags from 'common-tags'

const defaultColors = [
  'bgBlue.bold',
  'bgMagenta.bold',
  'bgGreen.bold',
  'bgBlack.bold',
  'bgCyan.bold',
  'bgRed.bold',
  'bgWhite.bold',
  'bgYellow.bold',
  // TODO: add more colors that look good?
]

export {
  concurrent,
  series,
  runInNewWindow,
  rimraf,
  ifWindows,
  ifNotWindows,
  copy,
  mkdirp,
  open,
  crossEnv,
  commonTags,
}

/**
 * Accepts any number of scripts, filters out any
 * falsy ones and joins them with ' && '
 * @param {...string} scripts - Any number of strings representing commands
 * @example
 * // returns 'eslint && jest && webpack --env.production'
 * series('eslint', 'jest', 'webpack --env.production')
 * @return {string} - the command that will execute the given scripts in series
 */
function series(...scripts) {
  return scripts.filter(Boolean).join(' && ')
}

/**
 * Accepts any number of nps script names, filters out
 * any falsy ones, prepends `nps` to them, and passes
 * the that to `series`
 * @param {...string} scriptNames - the script names to run
 * // returns 'nps lint && nps "test --coverage" && nps build'
 * series.nps('lint', 'test --coverage', 'build')
 * @return {string} - the command that will execute the nps scripts in series
 */
series.nps = function seriesNPS(...scriptNames) {
  return series(
    ...scriptNames
      .filter(Boolean)
      .map(scriptName => scriptName.trim())
      .filter(Boolean)
      .map(scriptName => `nps ${quoteScript(scriptName)}`),
  )
}

/**
 * A concurrent script object
 * @typedef {Object|string} ConcurrentScript
 * @property {string} script - the command to run
 * @property {string} color - the color to use
 *   (see concurrently's docs for valid values)
 */
/**
 * An object of concurrent script objects
 * @typedef {Object.<ConcurrentScript>} ConcurrentScripts
 */

/**
 * Generates a command that uses `concurrently` to run
 * scripts concurrently. Adds a few flags to make it
 * behave as you probably want (like --kill-others-on-fail).
 * In addition, it adds color and labels where the color
 * can be specified or is defaulted and the label is based
 * on the key for the script.
 * @param {ConcurrentScripts} scripts - the scripts to run
 *   note: this function filters out falsy values :)
 * @example
 * // returns a bit of a long script that can vary slightly
 * // based on your environment... :)
 * concurrent({
 *   lint: {
 *     script: 'eslint .',
 *     color: 'bgGreen.white.dim',
 *   },
 *   test: 'jest',
 *   build: {
 *     script: 'webpack'
 *   }
 * })
 * @return {string} - the command to run
 */
function concurrent(scripts) {
  const {
    colors,
    scripts: quotedScripts,
    names,
  } = Object.keys(scripts).reduce(reduceScripts, {
    colors: [],
    scripts: [],
    names: [],
  })
  const flags = [
    '--kill-others',
    `--prefix-colors "${colors.join(',')}"`,
    '--prefix "[{name}]"',
    `--names "${names.join(',')}"`,
    shellEscape(quotedScripts),
  ]
  const concurrently = getBin('concurrently')
  return `${concurrently} ${flags.join(' ')}`

  function reduceScripts(accumulator, scriptName, index) {
    let scriptObj = scripts[scriptName]
    if (!scriptObj) {
      return accumulator
    } else if (typeof scriptObj === 'string') {
      scriptObj = {script: scriptObj}
    }
    const {
      script,
      color = defaultColors[index % defaultColors.length],
    } = scriptObj
    if (!script) {
      return accumulator
    }
    accumulator.names.push(scriptName)
    accumulator.colors.push(color)
    accumulator.scripts.push(script)
    return accumulator
  }
}

/**
 * Accepts any number of nps script names, filters out
 * any falsy ones, prepends `nps` to them, and passes
 * the that to `concurrent`
 * @param {...string} scriptNames - the script names to run
 * @example
 * // will basically return `nps lint & nps "test --coverage" & nps build`
 * // but with the concurrently command and relevant flags to make
 * // it super awesome with colors and whatnot. :)
 * concurrent.nps('lint', 'test --coverage', 'build')
 * @return {string} the command to run
 */
concurrent.nps = function concurrentNPS(...scriptNames) {
  return concurrent(
    scriptNames.map(mapNPSScripts).reduce(reduceNPSScripts, {}),
  )

  function mapNPSScripts(scriptName, index) {
    const color = defaultColors[index]
    if (!Boolean(scriptName)) {
      return undefined
    } else if (typeof scriptName === 'string') {
      return {script: scriptName, color}
    } else {
      return Object.assign({color}, scriptName)
    }
  }

  function reduceNPSScripts(scripts, scriptObj) {
    if (!scriptObj) {
      return scripts
    }
    const {color, script} = scriptObj
    const [name] = script.split(' ')
    scripts[name] = {
      script: `nps ${quoteScript(script.trim())}`,
      color,
    }
    return scripts
  }
}

/**
 * EXPERIMENTAL: THIS DOES NOT CURRENTLY WORK FOR ALL TERMINALS
 * Takes a command and returns a version that should run in
 * another tab/window of your terminal. Currently only supports
 * Windows cmd (new window) and Terminal.app (new tab)
 * @param {string} command - the command to run in a new tab/window
 * @example
 * // returns some voodoo magic to make the terminal do what you want
 * runInNewWindow('echo hello')
 * @return {string} - the command to run
 */
function runInNewWindow(command) {
  return isWindows() ?
    `start cmd /k "cd ${process.cwd()} && ${command}"` :
    commonTags.oneLine`
      osascript
      -e 'tell application "Terminal"'
      -e 'tell application "System Events"
      to keystroke "t" using {command down}'
      -e 'do script "cd ${process.cwd()} && ${command}" in front window'
      -e 'end tell'
    `
}

/**
 * EXPERIMENTAL: THIS DOES NOT CURRENTLY WORK FOR ALL TERMINALS
 * Takes an nps script name and prepends it with a call to nps
 * then forwards that to `runInNewWindow` properly escaped.
 * @param {string} scriptName - the name of the nps script to run
 * @example
 * // returns a script that runs
 * // `node node_modules/.bin/nps "lint --cache"`
 * // in a new tab/window
 * runInNewWindow.nps('lint --cache')
 * @return {string} - the command to run
 */
runInNewWindow.nps = function runInNewWindowNPS(scriptName) {
  const escaped = true
  return runInNewWindow(
    `node node_modules/.bin/nps ${quoteScript(scriptName, escaped)}`,
  )
}

/**
 * Gets a script that uses the rimraf binary. rimraf
 * is a dependency of nps-utils, so you don't need to
 * install it yourself.
 * @param {string} args - args to pass to rimraf
 *   learn more from http://npm.im/rimraf
 * @return {string} - the command with the rimraf binary
 */
function rimraf(args) {
  return `${getBin('rimraf')} ${args}`
}

/**
 * Takes two scripts and returns the first if the
 * current environment is windows, and the second
 * if the current environment is not windows
 * @param {string} script - the script to use for windows
 * @param {string} altScript - the script to use for non-windows
 * @return {string} - the command to run
 */
function ifWindows(script, altScript) {
  return isWindows() ? script : altScript
}

/**
 * Simply calls ifWindows(altScript, script)
 * @param {string} script - the script to use for non-windows
 * @param {string} altScript - the script to use for windows
 * @return {string} - the command to run
 */
function ifNotWindows(script, altScript) {
  return ifWindows(altScript, script)
}

/**
 * Gets a script that uses the cpy-cli binary. cpy-cli
 * is a dependency of nps-utils, so you don't need to
 * install it yourself.
 * @param {string} args - args to pass to cpy-cli
 *   learn more from http://npm.im/cpy-cli
 * @return {string} - the command with the cpy-cli binary
 */
function copy(args) {
  return `${getBin('cpy-cli', 'cpy')} ${args}`
}

/**
 * Gets a script that uses the mkdirp binary. mkdirp
 * is a dependency of nps-utils, so you don't need to
 * install it yourself.
 * @param {string} args - args to pass to mkdirp
 *   learn more from http://npm.im/mkdirp
 * @return {string} - the command with the mkdirp binary
 */
function mkdirp(args) {
  return `${getBin('mkdirp')} ${args}`
}

/**
 * Gets a script that uses the opn-cli binary. opn-cli
 * is a dependency of nps-utils, so you don't need to
 * install it yourself.
 * @param {string} args - args to pass to opn-cli
 *   learn more from http://npm.im/opn-cli
 * @return {string} - the command with the opn-cli binary
 */
function open(args) {
  return `${getBin('opn-cli', 'opn')} ${args}`
}

/**
 * Gets a script that uses the cross-env binary. cross-env
 * is a dependency of nps-utils, so you don't need to
 * install it yourself.
 * @param {string} args - args to pass to cross-env
 *   learn more from http://npm.im/cross-env
 * @return {string} - the command with the cross-env binary
 */
function crossEnv(args) {
  return `${getBin('cross-env')} ${args}`
}

// utils

function quoteScript(script, escaped) {
  const quote = escaped ? '\\"' : '"'
  const shouldQuote = script.indexOf(' ') !== -1
  return shouldQuote ? `${quote}${script}${quote}` : script
}

function getBin(packageName, binName = packageName) {
  const packagePath = require.resolve(`${packageName}/package.json`)
  const concurrentlyDir = path.dirname(packagePath)
  let {bin: binRelativeToPackage} = require(packagePath)
  if (typeof binRelativeToPackage === 'object') {
    binRelativeToPackage = binRelativeToPackage[binName]
  }
  const fullBinPath = path.join(concurrentlyDir, binRelativeToPackage)
  const relativeBinPath = path.relative(process.cwd(), fullBinPath)
  return `node ${relativeBinPath}`
}

function isWindows() {
  // lazily require for perf :)
  return require('is-windows')()
}

function shellEscape(...args) {
  // lazily require for perf :)
  return require('any-shell-escape')(...args)
}

/*
  eslint
    func-name-matching:0,
    global-require:0,
    import/no-dynamic-require:0
*/
