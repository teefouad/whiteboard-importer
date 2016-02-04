var fs = require('fs');
var resolve = require('path').resolve;

function importer(path, prev, done) {
  var stat, isPartial = true;
  
  try {
    var pathArray = path.split('/');
    var file = '_' + pathArray.pop();
    stat = fs.lstatSync(__dirname + '/sass/' + pathArray.join('/') + '/' + file + '.scss');
  } catch (e) {
    isPartial = false;
  }
  
  if (!isPartial) {
    try {
      stat = fs.lstatSync(__dirname + '/sass/' + path + '.scss');
    } catch (e) {
      return done(null);
    }
  }
  
  if (stat.isFile()) {
    done({
      file: resolve(__dirname + '/sass/' + path)
    });
  }
}

module.exports = importer;