module.exports = function (grunt) {
    'use strict';

    require('time-grunt')(grunt);

    grunt.initConfig({

        pkg:             grunt.file.readJSON('package.json'),
        license:         grunt.file.read('LICENSE'),

        banner:          "/*\n<%= license %>*/\n",

        bower_path:      "bower_components",
        dist_path:       "public/assets",
        src_path:        "frontend",
        test_path:       "test",

        js_path:         "js",
        css_path:        "css",
        font_path:       "fonts",
        img_path:        "images",
        tpl_path:        "templates",

        dist_js_path:    "<%= dist_path %>/<%= js_path %>",
        dist_css_path:   "<%= dist_path %>/<%= css_path %>",
        dist_font_path:  "<%= dist_path %>/<%= font_path %>",
        dist_img_path:   "<%= dist_path %>/<%= img_path %>",
        dist_tpl_path:   "<%= dist_path %>/<%= tpl_path %>",

        src_app_path:    "<%= src_path %>",
        src_less_path:   "<%= src_app_path %>/less",

        jshint: {
            files: ['Gruntfile.js', '<%= src_path %>/**/*.js', '<%= test_path %>/**/*.js'],
            options: {
                globals: {
                    console: true
                }
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= dist_path %>/css/',
                        '<%= dist_path %>/images/',
                        '<%= dist_path %>/fonts/',
                        '<%= dist_path %>/js/'
                    ]
                }]
            }
        },

        concat: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: [
                    '<%= bower_path %>/angular/angular.js',
                    '<%= bower_path %>/angular-route/angular-route.js',
                    '<%= bower_path %>/angular-animate/angular-animate.js',
                    '<%= bower_path %>/angular-sanitize/angular-sanitize.js',
                    '<%= bower_path %>/ngtoast/dist/ngToast.min.js',
                    '<%= bower_path %>/angular-loading-bar/build/loading-bar.min.js',
                    '<%= bower_path %>/angular-tooltips/dist/angular-tooltips.min.js',

                    '<%= src_app_path %>/app.js',
                    '<%= src_app_path %>/modules/**/module.js',
                    '<%= src_app_path %>/modules/**/services/*.js',
                    '<%= src_app_path %>/modules/**/directives/*.js',
                    '<%= src_app_path %>/modules/**/resources/*.js',
                    '<%= src_app_path %>/modules/**/controllers/*.js'
                ],
                dest: '<%= dist_js_path %>/<%= pkg.name %>.js'
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= bower_path %>/fontawesome/fonts/',
                        src: ['**/*'],
                        dest: '<%= dist_font_path %>/'
                    },
                    {
                        expand: true,
                        cwd: '<%= src_app_path %>/images/',
                        src: ['**/*'],
                        dest: '<%= dist_img_path %>/'
                    },
                    {
                        expand: true,
                        cwd: '<%= src_app_path %>/modules/',
                        src: ['**/partials/**/*'],
                        dest: '<%= dist_tpl_path %>/'
                    }
                ]
            }
        },

        less: {
            dist: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    '<%= dist_css_path %>/<%= pkg.name %>.css': '<%= src_less_path %>/<%= pkg.name %>.less'
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= dist_tpl_path %>/',
                        src: ['**/*.tpl.html'],
                        dest: '<%= dist_tpl_path %>/'
                    }
                ]
            }
        },

        cssmin: {
            dist: {
                files: {
                    '<%= dist_css_path %>/<%= pkg.name %>.min.css': [
                        '<%= dist_css_path %>/<%= pkg.name %>.css',
                    ]
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    '<%= dist_js_path %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        notify_hooks: {
            options: {
                enabled: true,
                max_jshint_notifications: 5,
                title: "<%= pkg.name %>",
                success: true,
                duration: 2
            }
        },

        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: '<%= dist_path %>',
                    livereload: true,
                    keepalive: true
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= dist_path %>',
                    livereload: false,
                    keepalive: true
                }
            }
        },

        watch: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            files: ['<%= src_path %>/**/*'],
            tasks: ['default']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('main', [
        'jshint',
        'clean',
        'concat',
        'copy',
        'less',
    ]);

    grunt.registerTask('default', [
        'main',
        'notify_hooks'
    ]);

    grunt.registerTask('production', [
        'main',
        'htmlmin',
        'cssmin',
        'uglify',
        'notify_hooks'
    ]);
};
