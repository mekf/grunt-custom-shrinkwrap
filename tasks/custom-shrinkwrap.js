/*
 Copyright 2016 Skyscanner

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
'use strict';

var exec = require('child_process').exec,
    chalk = require('chalk');

module.exports = function (grunt) {
    var captureOutput = function (child, output) {
        if (grunt.option('color') === false) {
            child.on('data', function (data) {
                output.write(chalk.stripColor(data));
            });
        } else {
            child.pipe(output);
        }
    };

    grunt.registerMultiTask('customShrinkwrap', 'Enhances the npm shrinkwrap capability', function () {
        var done = this.async(),
            options = this.options({
                devDependencies: false,
                excludeDependencies: []
            }),
            command = 'npm shrinkwrap' + (options.devDependencies ? ' --dev' : '');

        var processOutput = function () {
            var shrinkwrappedJson = grunt.file.readJSON('./npm-shrinkwrap.json');

            options.excludeDependencies.forEach(function(excludedDependency) {
                delete shrinkwrappedJson.dependencies[excludedDependency];
            });

            grunt.file.write('./npm-shrinkwrap.json', JSON.stringify(shrinkwrappedJson));

            grunt.verbose.writeln(
                'removed',
                chalk.yellow(options.excludeDependencies),
                'from npm-shrinkwrap.json'
            );

            done();
        };

        var childProcess = exec(command, function (err) {
            if (err) { grunt.warn(err); }

            if (options.excludeDependencies) {
                processOutput();
            } else {
                done();
            }
        });

        if (grunt.option('verbose')) {
            captureOutput(childProcess.stdout, process.stdout);
        }

        if (grunt.option('verbose')) {
            captureOutput(childProcess.stderr, process.stderr);
        }
    });
};