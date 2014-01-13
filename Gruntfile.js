'use strict';

var SRC_PATH = 'test/';

module.exports = function(grunt) {
    grunt.initConfig({
        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['clean', 'nodeunit']);
};
