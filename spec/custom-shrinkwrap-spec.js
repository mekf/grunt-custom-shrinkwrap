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

var grunt = require('grunt');

var initGrunt = function (target) {
    grunt.task.init = function() {};

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        customShrinkwrap: target
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', [
        'customShrinkwrap'
    ]);
};


describe('The grunt-custom-shrinkwrap task', function () {
    var shrinkwrapFilePath = 'npm-shrinkwrap.json';

    afterEach(function () {
        if (grunt.file.exists(shrinkwrapFilePath)) {
            grunt.file.delete(shrinkwrapFilePath);
        }
    });

    it('should create the output file using default options', function (done) {
        initGrunt({ defaultOptions: { options: {} } });

        grunt.tasks('default', {}, function () {
            var shrinkwrapFileAsJSON = grunt.file.readJSON(shrinkwrapFilePath),
                standardDependencies = grunt.config('pkg.dependencies'),
                devDependencies = grunt.config('pkg.devDependencies'),
                shrinkwrappedDependencies = Object.keys(shrinkwrapFileAsJSON.dependencies);

            for (var dependency in standardDependencies) {
                expect(shrinkwrappedDependencies).toContain(dependency);
            }

            for (var devDependency in devDependencies) {
                expect(shrinkwrappedDependencies).not.toContain(devDependency);
            }

            done();
        });
    });

    it('should create the output file including development dependencies', function (done) {
        initGrunt({ includeDevDependencies: { options: { devDependencies: true } } });

        grunt.tasks('default', {}, function () {
            var shrinkwrapFileAsJSON = grunt.file.readJSON(shrinkwrapFilePath),
                standardDependencies = grunt.config('pkg.dependencies'),
                devDependencies = grunt.config('pkg.devDependencies'),
                shrinkwrappedDependencies = Object.keys(shrinkwrapFileAsJSON.dependencies);

            for (var dependency in standardDependencies) {
                expect(shrinkwrappedDependencies).toContain(dependency);
            }

            for (var devDependency in devDependencies) {
                expect(shrinkwrappedDependencies).toContain(devDependency);
            }

            done();
        });
    });

    it('should create the output file excluding specified dependencies', function (done) {
        var excludeDependencies = [ 'chalk', 'grunt' ];

        initGrunt({ excludeCustomDependencies: { options: {
            devDependencies: true,
            excludeDependencies: excludeDependencies
        } } });

        grunt.tasks('default', {}, function () {
            var shrinkwrapFileAsJSON = grunt.file.readJSON(shrinkwrapFilePath),
                standardDependencies = grunt.config('pkg.dependencies'),
                devDependencies = grunt.config('pkg.devDependencies'),
                shrinkwrappedDependencies = Object.keys(shrinkwrapFileAsJSON.dependencies);

            for (var dependency in standardDependencies) {
                if (excludeDependencies.indexOf(dependency) !== -1) {
                    expect(shrinkwrappedDependencies).not.toContain(dependency);
                } else {
                    expect(shrinkwrappedDependencies).toContain(dependency);
                }
            }

            for (var devDependency in devDependencies) {
                if (excludeDependencies.indexOf(devDependency) !== -1) {
                    expect(shrinkwrappedDependencies).not.toContain(devDependency);
                } else {
                    expect(shrinkwrappedDependencies).toContain(devDependency);
                }
            }

            done();
        });
    });
});
