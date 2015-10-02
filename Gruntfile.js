'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        tpl: 'app/templates',
        app: 'app',
        mobile: 'smartphone',
        dist: 'static'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // secret: grunt.file.readJSON('config/secret.json'),
        app: grunt.file.readJSON('config/app.json'),
        yeoman: yeomanConfig,
        /*sshexec: {
            api: {
                command: '<%= secret.api.command %> <%= app.name %>',
                options: {
                    host: '<%= secret.api.url %>',
                    username: '<%= secret.api.username %>',
                    password: '<%= secret.api.password %>'
                }
            },
            pull: {
                command: 'cd <%= app.path %> && git status',
                options: {
                    host: '<%= secret.host %>',
                    username: '<%= secret.username %>',
                    password: '<%= secret.password %>'
                }
            }
        },*/
        livereload: {
            port: 35728
        },
        watch: {
            livereload: {
                files: [
                    '{.tmp,<%= yeoman.app %>}/*.{html,htm}',
                    '{.tmp,<%= yeoman.app %>}/*.css',
                    '{.tmp,<%= yeoman.app %>}/*.js',
                    '<%= yeoman.app %>/*.{png,jpg,jpeg,gif,webp}'
                ],
                tasks: ['livereload']
            },
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '<%= app.dev.host %>'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [lrSnippet, mountFolder(connect, '.tmp'), mountFolder(connect, 'app')];
                    }
                }
            },
            test: {
                options: {
                    middleware: function(connect) {
                        return [mountFolder(connect, '.tmp'), mountFolder(connect, 'test')];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function(connect) {
                        return [mountFolder(connect, 'static')];
                    }
                }
            }
        },
        manifest: {
            generate: {
                options: {
                    basePath: 'public',
                    cache: ['js/app.js', 'css/style.css'],
                    network: ['http://*', 'https://*'],
                    fallback: ['/ /offline.html'],
                    //exclude: ['js/jquery.min.js'],
                    preferOnline: true,
                    verbose: true,
                    timestamp: true
                },
                src: [
                    'some_files/*.html',
                    'static/js/*.min.js',
                    'static/css/*.css'
                ],
                dest: 'manifest.appcache'
            }
        },
        open: {
            server: {
                path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>'
            }
        },
        clean: {
            tmp: ['.tmp'],
            // tmp: ['.tmp/*.html', '.tmp/tpl', '.tmp/<%= yeoman.mobile %>'],
            dist: ['.tmp', 'dist'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            dev: [
                'Gruntfile.js',
                './tmp/static/js/{,*/}*.js'
            ],
            all: [
                'Gruntfile.js',
                './tmp/static/js/{,*/}*.js',
                '<%= yeoman.app %>/static/js/{,*/}*.js',
                '!<%= yeoman.app %>/static/js/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/js/main.js': [
                        //'<%= yeoman.app %>/static/js/{,*/}*.js',
                        //'.tmp/static/js/templates.js'
                        '<%= yeoman.app %>/static/js/*.js',
                        '.tmp/static/js/*.js'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '.tmp/base.html',
            options: {
                //basedir: 'static',
                //basedir: '<%= yeoman.app %>',
                dest: '.'
            }
        },
        usemin: {
            html: ['.tmp/{,*/}*.html'],
            //css: ['<%= yeoman.dist %>/css/{,*/}*.css'],
            options: {
                dirs: ['dist']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/static/img',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/img'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/css/aplication.css': [
                        '.tmp/static/css/{,*/}*.css'
                        //'<%= yeoman.app %>/static/css/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    //removeComments: true
                    //collapseWhitespace: true
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '.tmp',
                    src: '*.html',
                    dest: 'dist'
                },
                {
                    expand: true,
                    cwd: '.tmp/<%= yeoman.mobile %>',
                    src: 'base.html',
                    dest: 'dist/<%= yeoman.mobile %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: 'dist',
                    src: [
                        '*.{ico,htm}',
                        '*.{css,js}',
                        '.htaccess',
                        '*.{png,jpg,jpeg,gif,webp}'
                    ]
                }]
            },
            css: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.',
                    src: 'static/css/*.css'
                }]
            },
            vendor: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.',
                    src: 'static/js/vendor/*.js'
                }]
            },
            templates: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.',
                    src: 'templates/base/*.html'
                }]
            },
            img: {
                files: [{
                    dot: true,
                    expand: true,
                    cwd: '<%= yeoman.app %>/static/img',
                    src: '{,*/}*.{png,jpg,jpeg,webp,gif}',
                    dest: '<%= yeoman.dist %>/img'
                },
                {
                    dot: true,
                    expand: true,
                    cwd: '<%= yeoman.app %>/static/images',
                    src: '{,**/}*.{png,jpg,jpeg,webp,gif}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            },
            dev: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.tmp',
                    src: [
                        '*.ico',
                        '*.{css,js}',
                        '*.{png,jpg,jpeg,gif,webp}'
                    ]
                // }, {
                //     expand: true,
                //     dot: true,
                //     cwd: '<%= yeoman.app %>/templates',
                //     dest: '.tmp/tpl',
                //     src: '*.htm'
                }]
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= yeoman.app %>/static/js/main.js'
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: 'JST'
                },
                files: {
                    '.tmp/static/js/templates.js': ['<%= yeoman.app %>/static/tpl/*.hbs']
                }
            }
        },
        pull: {
            options: {
                flow: false,
                submodule: false
            }
        },
        release: {
            options: {
                // bump: false, //default: true
                // file: '.', //default: package.json
                // add: false, //default: true
                // commit: false, //default: true
                // tag: false, //default: true
                push: false, //default: true
                pushTags: false, //default: true
                flow: true, //default: false
                // folder: '.', //default project root
                // tagName: 'v<%= version %>', //default: '<%= version %>'
                commitMessage: 'check out my release <%= version %>', //default: 'release <%= version %>'
                // tagMessage: 'tagging version <%= version %>' //default: 'Version <%= version %>'
                npm: false //default: true
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('createDefaultTemplate', function() {
        grunt.file.write('.tmp/static/js/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }
        grunt.task.run([
            'clean:server',
            // 'coffee:dist',
            // 'createDefaultTemplate',
            // 'handlebars',
            // 'less:dev',
            'copy:dev',
            // 'jshint:all',
            // 'string-replace:dev',
            // 'preprocess:dev',
            'livereload-start',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'coffee:dist',
        'createDefaultTemplate',
        'handlebars',
        'less:dist',
        'copy:dev',
        'string-replace:dist',
        'string-replace:mobile',
        'preprocess:dist',
        'preprocess:mobile',
        'useminPrepare',
        'copy:img',
        //'imagemin',
        'htmlmin:dist',
        'concat',
        'cssmin',
        'uglify:dist',
        // ,'clean:tmp'
        'preprocess:imagestore',
        'copy:dist',
        'usemin',
        'string-replace:django',
        'copy:css',
        'copy:vendor',
        'copy:templates',
        'clean:dist'
    ]);

    grunt.registerTask('run', [
        'shell:syncdb',
        'shell:collectstatic',
        'shell:compress',
        'shell:runserver'
    ]);

    grunt.registerTask('django', [
        'shell:syncdb',
        'shell:collectstatic',
        'shell:compress'
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'coffee:dist',
        'createDefaultTemplate',
        'handlebars',
        'less:dev',
        'copy:dev',
        'string-replace:dev',
        'preprocess:dev',
        'jshint:all',
        'string-replace:dev',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('trans', [
        // 'clean:server',
        'shell:trans'
        // 'copy:dev',
        // 'string-replace:dev',
        // 'preprocess:dev'
    ]);

    grunt.registerTask('ssh', [
        'sshexec:pull'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);

    grunt.registerTask('deploy', function(target) {
        if (target === 'prod') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            // 'test',
            // 'build',
            // 'release',
            'sshexec:api'
        ]);

    });
};