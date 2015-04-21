'use strict';

module.exports = function(grunt) {

    var pngquant = require('imagemin-pngquant'),
        jpegRecompress = require('imagemin-jpeg-recompress');

    var appConfig = {
        app: 'app',
        dist: 'dist'
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scripts: {
                files: [appConfig.app + '/css/scss/**/*.scss'],
                tasks: ['watchscss']
            },
            options: {
                atBegin: true
            }
        },
        copy: {
            dist: {
                files: [
                    {expand: true, cwd: appConfig.app + '/', src: ['./*.php', '!./index.php','./*.html', './*.png', './*.ico'], dest: appConfig.dist + '/', filter: 'isFile'},
                    {expand: true, cwd: appConfig.app, src: ['php/**','slides/**','json/**'], dest: appConfig.dist + '/'}, // includes files in path and its subdirs
               ]
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/js/modernizr.js': [
                        appConfig.app + '/bower_components/modernizr/modernizr.js', 
                        appConfig.app + '/bower_components/modernizr/feature-detects/css-mask.js', 
                        appConfig.app + '/bower_components/modernizr/feature-detects/fullscreen-api.js'
                    ],
                    'dist/js/selectivizr.js': [
                        appConfig.app + '/bower_components/selectivizr/selectivizr.js'
                    ]
                }
            }
        },
        processhtml: {
            options: {
                // Task-specific options go here.
            },
            dist: {
                files: {
                    'dist/index.php': ['app/index.php'],
                    'dist/master.php': ['app/master.php']
                }
            }
        },
        requirejs: {
            dist: {
                options: {
                    baseUrl: appConfig.app + '/js',
                    mainConfigFile: appConfig.app + '/js/main.js',
                    name: '../bower_components/almond/almond',
                    include: ['main'],
                    insertRequire: ['main'],
                    out: appConfig.dist + '/js/main.js'
                }
            },
            master: {
                options: {
                    baseUrl: appConfig.app + '/js',
                    mainConfigFile: appConfig.app + '/js/master.js',
                    name: '../bower_components/almond/almond',
                    include: ['master'],
                    insertRequire: ['master'],
                    out: appConfig.dist + '/js/master.js'
                }
            }
        },
        imagemin: {
            dynamic: {
                options: {                       // Target options
                    optimizationLevel: 0,
                    use: [
                            pngquant()
                        ]
                },
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'app/images/',            // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif,ico}'],   // Actual patterns to match
                    dest: 'dist/images/'           // Destination path prefix
                },
                {
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'app/css/images/',            // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'dist/css/images/'           // Destination path prefix
                }]
            }
        },
        /**
        * This requires that you install ffmpeg
        * I got it working with 'brew install ffmpeg --with-libvorbis' 
        */
        audiosprite : {
            all : {
                // The path to save the output file
                output: appConfig.app + '/audio/audiosprite',

                // The uncompressed audio input
                files: appConfig.app + '/audiosprite/*.{wav,mp3}',

                // The export filetypes
                export: 'm4a,ogg,mp3',

                // The export bitrate
                bitrate: 48,

                // Include silence sprite of 5 seconds
                silence: 5
            }
        },
        compass: {                  // Task
            dist: {                   // Target
                options: {              // Target options
                    sassDir: appConfig.app + '/css/scss',
                    cssDir: appConfig.dist + '/css',
                    outputStyle: 'compressed'
                }
            },
            dev: {                   // Target
                options: {              // Target options
                    sassDir: appConfig.app + '/css/scss',
                    cssDir: appConfig.app + '/css'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-audiosprite');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('build', ['requirejs:dist', 'requirejs:master', 'imagemin', 'compass:dist', 'uglify:dist', 'copy:dist', 'processhtml:dist']);
    grunt.registerTask('watchscss', ['compass:dev']);
    grunt.registerTask('compileaudiosprite', ['audiosprite:all']);

};