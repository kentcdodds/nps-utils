const commonTags = require('common-tags')

const oneLine = commonTags.oneLine

module.exports = {
  scripts: {
    commit: {
      description: oneLine`
        This uses commitizen to help us generate
        well formatted commit messages
      `,
      script: 'git-cz',
    },
    test: {
      default: `jest --coverage`,
      watch: 'jest --watch',
    },
    build: {
      description: 'delete the dist directory and run babel to build the files',
      script: oneLine`
        rimraf dist && babel --copy-files
        --out-dir dist --ignore *.test.js src
      `,
    },
    lint: {
      description: 'lint the entire project',
      script: 'eslint .',
    },
    reportCoverage: {
      description: oneLine`
        Report coverage stats to codecov.
        This should be run after the \`test\` script
      `,
      script: 'codecov',
    },
    release: {
      description: oneLine`
        We automate releases with semantic-release.
        This should only be run on travis
      `,
      script: 'semantic-release pre && npm publish && semantic-release post',
    },
    validate: {
      description: oneLine`
        This runs several scripts to make sure things look
        good before committing or on clean install
      `,
      script: 'nps lint build test',
    },
    addContributor: {
      description: 'When new people contribute to the project, run this',
      script: 'all-contributors add',
    },
    generateContributors: {
      description: 'Update the badge and contributors table',
      script: 'all-contributors generate',
    },
  },
  options: {
    silent: false,
  },
}
