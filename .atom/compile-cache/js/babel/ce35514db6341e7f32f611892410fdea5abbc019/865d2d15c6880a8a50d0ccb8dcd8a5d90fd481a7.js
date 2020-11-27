Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Require some libs used for creating temporary files

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

// Public: GrammarUtils - utilities for determining how to run code
'use babel';exports['default'] = {
  tempFilesDir: _path2['default'].join(_os2['default'].tmpdir(), 'atom_script_tempfiles'),

  // Public: Create a temporary file with the provided code
  //
  // * `code`    A {String} containing some code
  //
  // Returns the {String} filepath of the new file
  createTempFileWithCode: function createTempFileWithCode(code) {
    var extension = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    try {
      if (!_fs2['default'].existsSync(this.tempFilesDir)) {
        _fs2['default'].mkdirSync(this.tempFilesDir);
      }

      var tempFilePath = this.tempFilesDir + _path2['default'].sep + _uuid2['default'].v1() + extension;

      var file = _fs2['default'].openSync(tempFilePath, 'w');
      _fs2['default'].writeSync(file, code);
      _fs2['default'].closeSync(file);

      return tempFilePath;
    } catch (error) {
      throw new Error('Error while creating temporary file (' + error + ')');
    }
  },

  // Public: Delete all temporary files and the directory created by
  // {GrammarUtils::createTempFileWithCode}
  deleteTempFiles: function deleteTempFiles() {
    var _this = this;

    try {
      if (_fs2['default'].existsSync(this.tempFilesDir)) {
        var files = _fs2['default'].readdirSync(this.tempFilesDir);
        if (files.length) {
          files.forEach(function (file) {
            return _fs2['default'].unlinkSync(_this.tempFilesDir + _path2['default'].sep + file);
          });
        }
        return _fs2['default'].rmdirSync(this.tempFilesDir);
      }
      return null;
    } catch (error) {
      throw new Error('Error while deleting temporary files (' + error + ')');
    }
  },

  // Public: Returns cmd or bash, depending on the current OS
  command: _os2['default'].platform() === 'win32' ? 'cmd' : 'bash',

  // Public: Format args for cmd or bash, depending on the current OS
  formatArgs: function formatArgs(command) {
    if (_os2['default'].platform() === 'win32') {
      return ['/c ' + command.replace(/['"]/g, '')];
    }
    return ['-c', command];
  },

  /* eslint-disable global-require */
  // Public: Get the Java helper object
  //
  // Returns an {Object} which assists in preparing java + javac statements
  Java: require('./grammar-utils/java'),

  // Public: Get the Lisp helper object
  //
  // Returns an {Object} which assists in splitting Lisp statements.
  Lisp: require('./grammar-utils/lisp'),

  // Public: Get the MATLAB helper object
  //
  // Returns an {Object} which assists in splitting MATLAB statements.
  MATLAB: require('./grammar-utils/matlab'),

  // Public: Get the OperatingSystem helper object
  //
  // Returns an {Object} which assists in writing OS dependent code.
  OperatingSystem: require('./grammar-utils/operating-system'),

  // Public: Get the R helper object
  //
  // Returns an {Object} which assists in creating temp files containing R code
  R: require('./grammar-utils/R'),

  // Public: Get the Perl helper object
  //
  // Returns an {Object} which assists in creating temp files containing Perl code
  Perl: require('./grammar-utils/perl'),

  // Public: Get the PHP helper object
  //
  // Returns an {Object} which assists in creating temp files containing PHP code
  PHP: require('./grammar-utils/php'),

  // Public: Get the Nim helper object
  //
  // Returns an {Object} which assists in selecting the right project file for Nim code
  Nim: require('./grammar-utils/nim'),

  // Public: Get the D helper object
  //
  // Returns an {Object} which assists in creating temp files containing D code
  D: require('./grammar-utils/d')
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7a0JBR2UsSUFBSTs7OztrQkFDSixJQUFJOzs7O29CQUNGLE1BQU07Ozs7b0JBQ04sTUFBTTs7Ozs7QUFOdkIsV0FBVyxDQUFDLHFCQVNHO0FBQ2IsY0FBWSxFQUFFLGtCQUFLLElBQUksQ0FBQyxnQkFBRyxNQUFNLEVBQUUsRUFBRSx1QkFBdUIsQ0FBQzs7Ozs7OztBQU83RCx3QkFBc0IsRUFBQSxnQ0FBQyxJQUFJLEVBQWtCO1FBQWhCLFNBQVMseURBQUcsRUFBRTs7QUFDekMsUUFBSTtBQUNGLFVBQUksQ0FBQyxnQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQ3JDLHdCQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDakM7O0FBRUQsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxrQkFBSyxHQUFHLEdBQUcsa0JBQUssRUFBRSxFQUFFLEdBQUcsU0FBUyxDQUFDOztBQUUxRSxVQUFNLElBQUksR0FBRyxnQkFBRyxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLHNCQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekIsc0JBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVuQixhQUFPLFlBQVksQ0FBQztLQUNyQixDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsWUFBTSxJQUFJLEtBQUssMkNBQXlDLEtBQUssT0FBSSxDQUFDO0tBQ25FO0dBQ0Y7Ozs7QUFJRCxpQkFBZSxFQUFBLDJCQUFHOzs7QUFDaEIsUUFBSTtBQUNGLFVBQUksZ0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNwQyxZQUFNLEtBQUssR0FBRyxnQkFBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2hELFlBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUNoQixlQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTttQkFBSSxnQkFBRyxVQUFVLENBQUMsTUFBSyxZQUFZLEdBQUcsa0JBQUssR0FBRyxHQUFHLElBQUksQ0FBQztXQUFBLENBQUMsQ0FBQztTQUMzRTtBQUNELGVBQU8sZ0JBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUN4QztBQUNELGFBQU8sSUFBSSxDQUFDO0tBQ2IsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFlBQU0sSUFBSSxLQUFLLDRDQUEwQyxLQUFLLE9BQUksQ0FBQztLQUNwRTtHQUNGOzs7QUFHRCxTQUFPLEVBQUUsZ0JBQUcsUUFBUSxFQUFFLEtBQUssT0FBTyxHQUFHLEtBQUssR0FBRyxNQUFNOzs7QUFHbkQsWUFBVSxFQUFBLG9CQUFDLE9BQU8sRUFBRTtBQUNsQixRQUFJLGdCQUFHLFFBQVEsRUFBRSxLQUFLLE9BQU8sRUFBRTtBQUM3QixhQUFPLFNBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUcsQ0FBQztLQUMvQztBQUNELFdBQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDeEI7Ozs7OztBQU1ELE1BQUksRUFBRSxPQUFPLENBQUMsc0JBQXNCLENBQUM7Ozs7O0FBS3JDLE1BQUksRUFBRSxPQUFPLENBQUMsc0JBQXNCLENBQUM7Ozs7O0FBS3JDLFFBQU0sRUFBRSxPQUFPLENBQUMsd0JBQXdCLENBQUM7Ozs7O0FBS3pDLGlCQUFlLEVBQUUsT0FBTyxDQUFDLGtDQUFrQyxDQUFDOzs7OztBQUs1RCxHQUFDLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixDQUFDOzs7OztBQUsvQixNQUFJLEVBQUUsT0FBTyxDQUFDLHNCQUFzQixDQUFDOzs7OztBQUtyQyxLQUFHLEVBQUUsT0FBTyxDQUFDLHFCQUFxQixDQUFDOzs7OztBQUtuQyxLQUFHLEVBQUUsT0FBTyxDQUFDLHFCQUFxQixDQUFDOzs7OztBQUtuQyxHQUFDLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixDQUFDO0NBQ2hDIiwiZmlsZSI6ImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gUmVxdWlyZSBzb21lIGxpYnMgdXNlZCBmb3IgY3JlYXRpbmcgdGVtcG9yYXJ5IGZpbGVzXG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCc7XG5cbi8vIFB1YmxpYzogR3JhbW1hclV0aWxzIC0gdXRpbGl0aWVzIGZvciBkZXRlcm1pbmluZyBob3cgdG8gcnVuIGNvZGVcbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGVtcEZpbGVzRGlyOiBwYXRoLmpvaW4ob3MudG1wZGlyKCksICdhdG9tX3NjcmlwdF90ZW1wZmlsZXMnKSxcblxuICAvLyBQdWJsaWM6IENyZWF0ZSBhIHRlbXBvcmFyeSBmaWxlIHdpdGggdGhlIHByb3ZpZGVkIGNvZGVcbiAgLy9cbiAgLy8gKiBgY29kZWAgICAgQSB7U3RyaW5nfSBjb250YWluaW5nIHNvbWUgY29kZVxuICAvL1xuICAvLyBSZXR1cm5zIHRoZSB7U3RyaW5nfSBmaWxlcGF0aCBvZiB0aGUgbmV3IGZpbGVcbiAgY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCBleHRlbnNpb24gPSAnJykge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmModGhpcy50ZW1wRmlsZXNEaXIpKSB7XG4gICAgICAgIGZzLm1rZGlyU3luYyh0aGlzLnRlbXBGaWxlc0Rpcik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRlbXBGaWxlUGF0aCA9IHRoaXMudGVtcEZpbGVzRGlyICsgcGF0aC5zZXAgKyB1dWlkLnYxKCkgKyBleHRlbnNpb247XG5cbiAgICAgIGNvbnN0IGZpbGUgPSBmcy5vcGVuU3luYyh0ZW1wRmlsZVBhdGgsICd3Jyk7XG4gICAgICBmcy53cml0ZVN5bmMoZmlsZSwgY29kZSk7XG4gICAgICBmcy5jbG9zZVN5bmMoZmlsZSk7XG5cbiAgICAgIHJldHVybiB0ZW1wRmlsZVBhdGg7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igd2hpbGUgY3JlYXRpbmcgdGVtcG9yYXJ5IGZpbGUgKCR7ZXJyb3J9KWApO1xuICAgIH1cbiAgfSxcblxuICAvLyBQdWJsaWM6IERlbGV0ZSBhbGwgdGVtcG9yYXJ5IGZpbGVzIGFuZCB0aGUgZGlyZWN0b3J5IGNyZWF0ZWQgYnlcbiAgLy8ge0dyYW1tYXJVdGlsczo6Y3JlYXRlVGVtcEZpbGVXaXRoQ29kZX1cbiAgZGVsZXRlVGVtcEZpbGVzKCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyh0aGlzLnRlbXBGaWxlc0RpcikpIHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyh0aGlzLnRlbXBGaWxlc0Rpcik7XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4gZnMudW5saW5rU3luYyh0aGlzLnRlbXBGaWxlc0RpciArIHBhdGguc2VwICsgZmlsZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmcy5ybWRpclN5bmModGhpcy50ZW1wRmlsZXNEaXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igd2hpbGUgZGVsZXRpbmcgdGVtcG9yYXJ5IGZpbGVzICgke2Vycm9yfSlgKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gUHVibGljOiBSZXR1cm5zIGNtZCBvciBiYXNoLCBkZXBlbmRpbmcgb24gdGhlIGN1cnJlbnQgT1NcbiAgY29tbWFuZDogb3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJyA/ICdjbWQnIDogJ2Jhc2gnLFxuXG4gIC8vIFB1YmxpYzogRm9ybWF0IGFyZ3MgZm9yIGNtZCBvciBiYXNoLCBkZXBlbmRpbmcgb24gdGhlIGN1cnJlbnQgT1NcbiAgZm9ybWF0QXJncyhjb21tYW5kKSB7XG4gICAgaWYgKG9zLnBsYXRmb3JtKCkgPT09ICd3aW4zMicpIHtcbiAgICAgIHJldHVybiBbYC9jICR7Y29tbWFuZC5yZXBsYWNlKC9bJ1wiXS9nLCAnJyl9YF07XG4gICAgfVxuICAgIHJldHVybiBbJy1jJywgY29tbWFuZF07XG4gIH0sXG5cbiAgLyogZXNsaW50LWRpc2FibGUgZ2xvYmFsLXJlcXVpcmUgKi9cbiAgLy8gUHVibGljOiBHZXQgdGhlIEphdmEgaGVscGVyIG9iamVjdFxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGFzc2lzdHMgaW4gcHJlcGFyaW5nIGphdmEgKyBqYXZhYyBzdGF0ZW1lbnRzXG4gIEphdmE6IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9qYXZhJyksXG5cbiAgLy8gUHVibGljOiBHZXQgdGhlIExpc3AgaGVscGVyIG9iamVjdFxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGFzc2lzdHMgaW4gc3BsaXR0aW5nIExpc3Agc3RhdGVtZW50cy5cbiAgTGlzcDogcmVxdWlyZSgnLi9ncmFtbWFyLXV0aWxzL2xpc3AnKSxcblxuICAvLyBQdWJsaWM6IEdldCB0aGUgTUFUTEFCIGhlbHBlciBvYmplY3RcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGljaCBhc3Npc3RzIGluIHNwbGl0dGluZyBNQVRMQUIgc3RhdGVtZW50cy5cbiAgTUFUTEFCOiByZXF1aXJlKCcuL2dyYW1tYXItdXRpbHMvbWF0bGFiJyksXG5cbiAgLy8gUHVibGljOiBHZXQgdGhlIE9wZXJhdGluZ1N5c3RlbSBoZWxwZXIgb2JqZWN0XG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge09iamVjdH0gd2hpY2ggYXNzaXN0cyBpbiB3cml0aW5nIE9TIGRlcGVuZGVudCBjb2RlLlxuICBPcGVyYXRpbmdTeXN0ZW06IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9vcGVyYXRpbmctc3lzdGVtJyksXG5cbiAgLy8gUHVibGljOiBHZXQgdGhlIFIgaGVscGVyIG9iamVjdFxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGFzc2lzdHMgaW4gY3JlYXRpbmcgdGVtcCBmaWxlcyBjb250YWluaW5nIFIgY29kZVxuICBSOiByZXF1aXJlKCcuL2dyYW1tYXItdXRpbHMvUicpLFxuXG4gIC8vIFB1YmxpYzogR2V0IHRoZSBQZXJsIGhlbHBlciBvYmplY3RcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGljaCBhc3Npc3RzIGluIGNyZWF0aW5nIHRlbXAgZmlsZXMgY29udGFpbmluZyBQZXJsIGNvZGVcbiAgUGVybDogcmVxdWlyZSgnLi9ncmFtbWFyLXV0aWxzL3BlcmwnKSxcblxuICAvLyBQdWJsaWM6IEdldCB0aGUgUEhQIGhlbHBlciBvYmplY3RcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGljaCBhc3Npc3RzIGluIGNyZWF0aW5nIHRlbXAgZmlsZXMgY29udGFpbmluZyBQSFAgY29kZVxuICBQSFA6IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9waHAnKSxcblxuICAvLyBQdWJsaWM6IEdldCB0aGUgTmltIGhlbHBlciBvYmplY3RcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGljaCBhc3Npc3RzIGluIHNlbGVjdGluZyB0aGUgcmlnaHQgcHJvamVjdCBmaWxlIGZvciBOaW0gY29kZVxuICBOaW06IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9uaW0nKSxcblxuICAvLyBQdWJsaWM6IEdldCB0aGUgRCBoZWxwZXIgb2JqZWN0XG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge09iamVjdH0gd2hpY2ggYXNzaXN0cyBpbiBjcmVhdGluZyB0ZW1wIGZpbGVzIGNvbnRhaW5pbmcgRCBjb2RlXG4gIEQ6IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9kJyksXG59O1xuIl19