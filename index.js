var fs = require('fs');
var resolve = require('path').resolve;
var sassPath;

function importer(path, prev, done) {
  var stat, isPartial = true;
  
  try {
    var pathArray = path.split('/');
    var file = '_' + pathArray.pop();
    stat = fs.lstatSync(sassPath + '/sass/' + pathArray.join('/') + '/' + file + '.scss');
  } catch (e) {
    isPartial = false;
  }
  
  if (!isPartial) {
    try {
      stat = fs.lstatSync(sassPath + '/sass/' + path + '.scss');
    } catch (e) {
      return done && done(null);
    }
  }
  
  if (stat.isFile()) {
    done && done({
      file: resolve(sassPath + '/sass/' + path)
    });
  }
}

module.exports = function(dirname) {
  sassPath = dirname;
  return importer;
};