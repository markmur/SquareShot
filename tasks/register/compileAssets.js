'use strict';

var compileAssets = [
    'clean:dev',
    'jst:dev',
    'copy:dev',
];

if (process.env.NODE_ENV === 'development') {
  compileAssets[compileAssets.length] = 'exec:webpackDevServer';
}

// else {
//   compileAssets[compileAssets.length] = 'exec:webpackBuild';
// }

module.exports = function (grunt) {
  grunt.registerTask('compileAssets', compileAssets);
};
