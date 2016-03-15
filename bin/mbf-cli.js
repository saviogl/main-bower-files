#! /usr/bin/env node

var resolve = require('path').resolve;
var mbf = require(resolve(__dirname, '..'));
require('shelljs/global');
var args = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var minimatch = require('minimatch');


var dest = defineDestPath(args._);
var opts = defineOptions(args);

var files = mbf(opts);

files.forEach(function(file) {
  cp(file, dest);
});

function defineDestPath(args) {
  if (!args.length || args.length > 1) {
    console.log('RangeError:: Invalid number of arguments [' + args.length + ']');
    console.log('RangeError:: \'mbfiles [options] [destination]\'');
    console.log('RangeError:: \'mbfiles src/js\'');
    process.exit(1);
  }

  var path = args[0];

  try {
    var stats = fs.statSync(path);
    if (!stats.isDirectory()) {
      console.log('TypeError:: \'' + path + '\' must be a directory not a file');
      process.exit(1);
    }
  } catch (e) {
    mkdir('-p', path);
  }

  return path;
}

function defineOptions(args) {
  var options = {};

  if (args.debug || args.d) options.debugging = args.debug || args.d;
  if (args.path || args.p) options.paths = args.path || args.p;
  if (args.checkExistence || args.c) options.checkExistence = args.checkExistence || args.c;
  if (args.filter || args.f) options.filter = args.filter || args.f;

  return options;
}
