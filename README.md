# nps-utils

Utilities for [nps][nps] (npm-package-scripts)

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][LICENSE]

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Donate][donate-badge]][donate]
[![Code of Conduct][coc-badge]][coc]
[![Roadmap][roadmap-badge]][roadmap]
[![Examples][examples-badge]][examples]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

[nps][nps] is a great package to empower your scripts and there are some common
things you wind up doing to keep your `package-scripts.js` file clean, useful,
and maintainable. So you wind up duplicating utility functions across projects.

## This solution

This has several utility functions you'll often want when using `nps`.

Check out what the `concurrent` and `runInNewWindow` methods can do:

<a href="https://github.com/kentcdodds/nps-utils/raw/master/other/nps-utils-demo.gif" title="Pull out npm scripts into another file with nps">
  <img src="https://github.com/kentcdodds/nps-utils/raw/master/other/nps-utils-demo.gif" alt="concurrent gif" title="concurrent gif" width="700" />
</a>

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev nps-utils
```

## Usage

You'll most likely use this in your `package-scripts.js` file:

```javascript
const npsUtils = require('npsUtils')

module.exports = {
  scripts: {
    validate: npsUtils.concurrent.nps('lint', 'build', 'test --coverage'),
    lint: 'eslint .',
    build: 'webpack --env.production',
    test: 'jest'
  }
}
```

### Available methods:

API docs can be found [here][doclet]

- [concurrent](https://doclets.io/kentcdodds/nps-utils/master#dl-concurrent)
- [concurrent.nps](https://doclets.io/kentcdodds/nps-utils/master#dl-concurrent.nps)
- [series](https://doclets.io/kentcdodds/nps-utils/master#dl-series)
- [series.nps](https://doclets.io/kentcdodds/nps-utils/master#dl-series.nps)
- [runInNewWindow](https://doclets.io/kentcdodds/nps-utils/master#dl-runInNewWindow)
- [runInNewWindow.nps](https://doclets.io/kentcdodds/nps-utils/master#dl-runInNewWindow.nps)
- [rimraf](https://doclets.io/kentcdodds/nps-utils/master#dl-rimraf)
- [ifWindows](https://doclets.io/kentcdodds/nps-utils/master#dl-ifWindows)
- [ifNotWindows](https://doclets.io/kentcdodds/nps-utils/master#dl-ifNotWindows)
- [copy](https://doclets.io/kentcdodds/nps-utils/master#dl-copy)
- [mkdirp](https://doclets.io/kentcdodds/nps-utils/master#dl-mkdirp)
- [open](https://doclets.io/kentcdodds/nps-utils/master#dl-open)
- [crossEnv](https://doclets.io/kentcdodds/nps-utils/master#dl-crossEnv)

`nps` also exports [`common-tags`][common-tags] as `commonTags` which can be
really helpful for long scripts or descriptions.

Or, see the JSDoc right in
[the source code](https://github.com/kentcdodds/nps-utils/blob/master/src/index.js) 😎

## Inspiration

This package was inspired by the removal of `--parallel` from `p-s`
[here](https://github.com/kentcdodds/p-s/pull/94).

## Other Solutions

I am unaware of other solutions, but if you come across any, please add a PR to
list them here!

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub>Kent C. Dodds</sub>](https://kentcdodds.com)<br />[💻](https://github.com/kentcdodds/nps-utils/commits?author=kentcdodds) [📖](https://github.com/kentcdodds/nps-utils/commits?author=kentcdodds) 🚇 [⚠️](https://github.com/kentcdodds/nps-utils/commits?author=kentcdodds) |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification. Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/kentcdodds/nps-utils.svg?style=flat-square
[build]: https://travis-ci.org/kentcdodds/nps-utils
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/nps-utils.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/nps-utils
[dependencyci-badge]: https://dependencyci.com/github/kentcdodds/nps-utils/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/kentcdodds/nps-utils
[version-badge]: https://img.shields.io/npm/v/nps-utils.svg?style=flat-square
[package]: https://www.npmjs.com/package/nps-utils
[downloads-badge]: https://img.shields.io/npm/dm/nps-utils.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=nps-utils&from=2016-04-01
[license-badge]: https://img.shields.io/npm/l/nps-utils.svg?style=flat-square
[license]: https://github.com/kentcdodds/nps-utils/blob/master/other/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[donate]: http://kcd.im/donate
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/nps-utils/blob/master/other/CODE_OF_CONDUCT.md
[roadmap-badge]: https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg?style=flat-square
[roadmap]: https://github.com/kentcdodds/nps-utils/blob/master/other/ROADMAP.md
[examples-badge]: https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square
[examples]: https://github.com/kentcdodds/nps-utils/blob/master/other/EXAMPLES.md
[github-watch-badge]: https://img.shields.io/github/watchers/kentcdodds/nps-utils.svg?style=social
[github-watch]: https://github.com/kentcdodds/nps-utils/watchers
[github-star-badge]: https://img.shields.io/github/stars/kentcdodds/nps-utils.svg?style=social
[github-star]: https://github.com/kentcdodds/nps-utils/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20nps-utils!%20https://github.com/kentcdodds/nps-utils%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/kentcdodds/nps-utils.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[nps]: https://npmjs.com/package/nps
[doclet]: https://doclets.io/kentcdodds/nps-utils/master
[common-tags]: https://npmjs.com/package/common-tags
