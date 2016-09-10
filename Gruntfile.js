module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: ['app/_scripts/compiled/*.js', '!**/*.min.js'],
				dest: 'app/_scripts/script.min.js'
			}
		},
		watch : {
			scripts: {
				files: ['app/_scripts/src/**/*.js',  '!**/*.min.js'],
				tasks: ['jshint', 'babel', 'uglify'],
				options: {

				}
			},
			styles : {
				files: ['app/_css/src/*.scss'],
				tasks: ['sass', 'cssmin'],
				options: {

				}
			}
		},
		sass : {
			development: {
				options : {

				},
				files : {
					'app/_css/styles.css': 'app/_css/src/*.scss'
				}
			}
		},
		cssmin : {
			options : {

			},
			target: {
				files : [{
					expand: true,
					cwd: 'app/_css',
					src: ['*.css', '!*.min.css'],
					dest: 'app/_css',
					ext: '.min.css'
				}]
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'app/_scripts/*.js',
				'app/_tests/*.js',
				'!app/_scripts/*.min.js'
			]
		},
		babel: {
			options: {
				sourceMap: true,
				presets: ['es2015']
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'app/_scripts/src/',
					src: ['**/*.es6.js'],
					dest: 'app/_scripts/compiled/',
					ext: '.js'
				}]
			}
		},
		jasmine : {
			src : 'app/_scripts/*.js',
			options : {
				specs : 'app/_tests/*.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-notify');
	grunt.registerTask('default', ['watch']);

};