# grunt-custom-shrinkwrap [![Build Status](https://travis-ci.org/Skyscanner/grunt-custom-shrinkwrap.svg?branch=master)](https://travis-ci.org/Skyscanner/grunt-custom-shrinkwrap)

> Run `npm shrinkwrap` and customise the output file

When deploying to a production environment it is often wise to ensure that, when installing dependencies, you'll get the exact version numbers that were known to be working in your development environment.

`npm` offers a command to this purpose, `npm shrinkwrap`. However, there's a problem there: it doesn't take into account `optionalDependencies`, i.e. they are treated like all others and added to the final list of "frozen" dependencies. This does not make sense if the optional dependencies are, for example, platform-specific (e.g. `fsevents`). This module allows a developer to generated a "shrinkwrapped" file and specify which dependencies should be taken out of it.

Hopefully, `npm` will fix this at some point (you can follow the relevant [GitHub issue](https://github.com/npm/npm/issues/2679)).

But, well, itches must be scratched.


## Install

```
$ npm install --save-dev grunt-custom-shrinkwrap
```


## Usage

```js
require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

grunt.initConfig({
    customShrinkwrap: {
        defaultTarget: {
            options: {
                devDependencies: true,
                excludeDependencies: [ 'fsevents' ]
            },
        }
    }
});

grunt.registerTask('default', ['customShrinkwrap']);
```

## Examples

### Create a shrinkwrap file without customisation

```js
grunt.initConfig({
    customShrinkwrap: {
        defaultTarget: {
        }
    }
});
```

### Create a shrinkwrap file which includes your devDependencies

```js
grunt.initConfig({
    customShrinkwrap: {
        defaultTarget: {
            devDependencies: true
        }
    }
});
```

### Create a shrinkwrap file which excludes one or more specified dependencies

```js
grunt.initConfig({
    customShrinkwrap: {
        defaultTarget: {
            excludeDependencies: [ 'dep1', 'dep2' ]
        }
    }
});
```


## Options

### devDependencies

*Optional*<br>
Type: `Boolean`

Set or clear the `--dev` flag for the `npm shrinkwrap` command, to determine whether the `devDependencies` in your `package.json` must be included in the shrinkwrap file. Default is `false`.

### excludeDependencies

*Optional*<br>
Type: `Array`

The dependency names specified with this parameter will be removed from the shrinkwrap file's `dependencies` array after its generation. Default is an empty array.

## License

[Apache License 2.0](./LICENSE)
