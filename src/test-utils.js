import path from 'path'

export function withPlatform(platform, getResult) {
  const originalPlatform = process.platform
  process.platform = platform
  jest.resetModules()
  const freshUtils = require('.')
  const result = getResult(freshUtils)
  process.platform = originalPlatform
  return result
}

export function relativeizePath(stringWithAbsolutePaths) {
  // escape string for regexp generation
  const escapedPath = path.resolve(__dirname, '../').replace(
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
