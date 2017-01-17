var fs = require('fs');
var resolve = require('path').resolve;

function log(msg, logPad) {
  if (process.env.WB_DEBUG) {
    var pad = Array(logPad || 1);
    console.log('[Whiteboard Importer]', pad.join(' '), msg);
  }
}

module.exports = function(sassPath, importers) {
  return (function(sassPath, importers) {
    return function (path, prev, done, logPad) {
      log('Looking for path: ' + sassPath + '/' + path, logPad);
      log('Checking if file exists...', logPad);

      var stat;
      var pathArray = path.split('/');
      var fileName = pathArray.pop();

      if (fs.existsSync(sassPath + '/' + pathArray.join('/') + '/_' + fileName + '.scss') || fs.existsSync(sassPath + '/' + pathArray.join('/') + '/' + fileName + '.scss')) {
        log('File exists', logPad);
        log('Done: ' + sassPath, logPad);

        done({
          file: resolve(sassPath + '/' + path)
        });
      } else {
        log('File not found, resorting to importers...', logPad);

        if (importers && importers.length > 0) {
          for (var i = 0, n = importers.length; i < n; i++) {
            log('Trying importer: ' + i, logPad);
            importers[i](path, prev, function(obj) {
              log('Done: ' + sassPath, logPad);
              done(obj);
            }, (logPad || 1) + 4);
          }
        } else {
          log('No importers', logPad);
          done();
        }
      }
    };
  }(sassPath, importers));
}
