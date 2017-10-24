import {includePackage, commonTags} from './index'

test('given just a string, it looks for scripts at a default location', () => {

  jest.mock(`./packages/foo/package-scripts.js`, () => ({
    scripts: {
      default: 'echo foo',
    },
  }), {virtual: true})

  jest.mock(`./packages/bar/package-scripts.js`, () => ({
    scripts: {
      default: 'echo bar',
    },
  }), {virtual: true})

  expect(includePackage('foo'))
    .toEqual({default: 'cd packages/foo && npm start default'})

  expect(includePackage('bar'))
    .toEqual({default: 'cd packages/bar && npm start default'})

})

test(commonTags.oneLine`given just a string, if that package doesnt exist,
  it thows a helpful error`, () => {
  
  expect(() => includePackage('doesnt-exist'))
    .toThrowError(/Couldnt include the package/)
  
})

test('given an explicit path, it uses that', () => {
  
  jest.mock(`./hello/explicit-foo.js`, () => ({
    scripts: {
      default: 'echo foo',
    },
  }), {virtual: true})

  jest.mock(`./explicit-bar.js`, () => ({
    scripts: {
      default: 'echo bar',
    },
  }), {virtual: true})

  expect(includePackage({path: `./hello/explicit-foo.js`}))
    .toEqual({default: 'cd hello && npm start default'})

  expect(includePackage({path: `./explicit-bar.js`}))
    .toEqual({default: 'cd  && npm start default'})

})

test(commonTags.oneLine`given an explicit path, if that package doesnt exist,
  it thows a helpful error`, () => {

  expect(() => includePackage({path: 'it-doesnt-exist.js'}))
    .toThrowError(/Couldnt include the package/)

})

test('given complex package, correct includes all scripts', () => {
  
  jest.mock(`./scripts/complex-package.js`, () => ({
    scripts: {
      default: 'nps foo',
      foo: 'echo foo',
      bar: 'echo foo',
      nested: {
        default: 'nps nested.bbb',
        aaa: 'echo aaa',
        bbb: 'echo bbb',
      },
    },
  }), {virtual: true})

  expect(includePackage({path: `./scripts/complex-package.js`}))
    .toMatchSnapshot()

})

test('description nodes respected', () => {
  
  jest.mock(`./scripts/complex-package-description.js`, () => ({
    scripts: {
      foo: 'echo foo',
      nested: {
        script: 'echo hia',
        description: 'this is nested',
      },
    },
  }), {virtual: true})

  
  expect(includePackage({path: './scripts/' +
    'complex-package-description.js'}))
    .toMatchSnapshot()

})

