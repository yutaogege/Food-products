'use strict';
module.exports = function(grunt) {
    // 加载任务
    require('jit-grunt')(grunt);
    // 计算任务所需时间
    require('time-grunt')(grunt);
    // 配置项目路经
    var config = {
        app: 'app',
        dist: 'dist'
    }

    // 配置任务
    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('package.json'),

        // copy
        copy: {
            build: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: [
                    '{,*/}*.html',
                    '**/*.js'
                ]
            }
        },

        // clean
        clean: {
            build: {
                src: ['<%= config.dist %>']
            },
            server: {
                src: [
                    '<%= config.app %>/{,*/}*.html',
                    '<%= config.dist %>/css',
                    '<%= config.dist %>/images',
                    '<%= config.dist %>/*.{gif,jpeg,jpg,png}',
                ]
            },
            scripts: {
                src: ['<%= config.dist %>/**/*.js']
            },
        },

        // compass
        compass: {
            development: {
                options: {
                    importPath: '<%= config.app %>/_source/_function/',
                    sassDir: '<%= config.app %>/_source/sass/',
                    cssDir: '<%= config.app %>/css/',
                    imagesDir: '<%= config.app %>/images/',
                    relativeAssets: true,
                    outputStyle: 'expanded',
                    sourcemap: true,
                    noLineComments: true,
                }
            }
        },

        // postcss
        postcss: {
            options: {
                map: true,
                processors: [
                    // Add vendor prefixed styles
                    require('autoprefixer')({
                        browsers: ['> 0.5%', 'last 2 versions', 'Firefox < 20']
                    })
                ]
            },

            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/css/',
                    src: '{,*/}*.css',
                    dest: '<%= config.app %>/css/'
                }]
            }
        },

        // jade
        jade: {
            compile: {
                options: {
                    pretty: true,
                    data: function(dest, src) {
                        return require('./app/_source/jade/data/data.json');
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/_source/jade/',
                    src: ['**/*.jade', '!components/*', '!layout/*', '!data/*'],
                    dest: '<%= config.app %>/',
                    ext: '.html'
                }]
            }
        },

        // cssmin
        cssmin: {
            options: {
                compatibility : 'ie8',
                noAdvanced : true
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/css',
                    src: ['{,*/}*.css'],
                    dest: '<%= config.dist %>/css'
                }]
            }
        },

        // imagemin
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images/',
                    src: '**/*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images/'
                }, {
                    expand: true,
                    cwd: '<%= config.app %>',
                    src: '*.{ico,png}',
                    dest: '<%= config.dist %>'
                }, {
                    expand: true,
                    cwd: '<%= config.app %>/pic/',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/pic/'
                }]
            }
        },

        // uglify
        uglify: {
            options: {
                banner: '/*! 项目名称：<%= pkg.name %> 版本：<%= pkg.version %> */\n'
            },
            build: {
                files: {
                    '<%= config.dist %>/js/scroll.js': ['<%= config.dist %>/js/scroll.js'],
                    '<%= config.dist %>/js/slideFocus.js': ['<%= config.dist %>/js/slideFocus.js'],
                },
            }
        },

        // watch
        watch: {
            compass: {
                files: '<%= config.app %>/_source/sass/**/*.scss',
                tasks: ['compass', 'newer:postcss']
            },
            jade: {
                files: '<%= config.app %>/**/*.jade',
                tasks: ['jade']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            }
        },

        browserSync: {
            options: {
                notify: false,
                background: true,
                watchOptions: {
                    ignored: ''
                }
            },
            livereload: {
                options: {
                    files: [
                        '<%= config.app %>/{,*/}*.html',
                        '<%= config.app %>/**/*.css',
                        '<%= config.app %>/images/{,*/}*',
                        '<%= config.app %>/**/*.js'
                    ],
                    port: 9000,
                    server: {
                        baseDir: ['<%= config.app %>'],
                        index:"zhuanti-details.html"
                    },
                    open: "external"
                }
            }
        },
    });


    // 组合任务
    grunt.registerTask('server', '开启开发模式', function(target) {
        grunt.log.warn('开启开发模式');
        grunt.task.run([
            'clean:server',
            'compass',
            'postcss',
            'cssmin',
            'imagemin',
            'jade',
            'copy',
            'browserSync:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', '开启生产模式', [
        'clean:build',
        'compass',
        'postcss',
        'cssmin',
        'imagemin',
        'jade',
        'copy',
        'uglify',
    ]);

    grunt.registerTask('default', '默认任务', [
        'build'
    ]);
}
