/* jshint camelcase: false */
module.exports = function (grunt) {
    var jsFiles = ['*.js', 'src/**/*.js', 'tests/*.js', 'tests/spec/*.js'];

    grunt.initConfig({
        connect: {
            uses_defaults: {}
        },
        jasmine: {
            main: {
                options: {
                    specs: ['tests/spec/**/*.js'],
                    vendor: ['tests/testConfig.js', 'tests/libs/dojo/dojo.js'],
                    host: 'http://localhost:8000'
                }
            }
        },
        jshint: {
            files: jsFiles,
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            files: jsFiles,
            tasks: ['jshint', 'jasmine:main:build'],
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jasmine:main:build', 'jshint', 'connect', 'watch']);
    grunt.registerTask('travis', ['jshint', 'connect', 'jasmine']);
};