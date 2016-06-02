var fs = require('fs');
var resolve = require('path').resolve;

var importer = function(sassPath) {
  return function (path, prev, done) {
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
        return done();
      }
    }
    
    if (stat.isFile()) {
      done({
        file: resolve(sassPath + '/sass/' + path)
      });
    }
  }
}

module.exports = function(dirname) {
  return importer(dirname);
};