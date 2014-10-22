module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      // uglify task configuration (the property must be named as the task to which is relative)
    },
    connect: {
      server: {
        options: {
          port: 8000,
		  keepalive:true,
          base: '.'
        }
      }
    }
  });

  // load the plugin that provides the 'uglify' task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // log something
  grunt.log.write('Hello world!\n');

  // define default task(s).
  grunt.registerTask('default', ['uglify']);

  // define an alias for common tasks
  // grunt.registerTask('myTasks', ['task1', 'task2:target', 'task3']);

};
