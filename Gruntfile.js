/**
 * Grunt tasks for building/minifying css/js.
 */

module.exports = function(grunt) {

  // Project Config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: false
      },
      lib_files: {
        src: 'public/js/lib/*.js',
        dest: 'public/js/lib/dest/compressed.min.js'
      },
      custom_files: {
        src: 'public/js/*.js',
        dest: 'public/js/dest/compressed.min.js'
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default tasks
  grunt.registerTask('default', ['uglify']);

}
