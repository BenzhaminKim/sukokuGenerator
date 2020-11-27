Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var Runner = (function () {

  // Public: Creates a Runner instance
  //
  // * `scriptOptions` a {ScriptOptions} object instance
  // * `emitter` Atom's {Emitter} instance. You probably don't need to overwrite it

  function Runner(scriptOptions) {
    _classCallCheck(this, Runner);

    this.bufferedProcess = null;
    this.stdoutFunc = this.stdoutFunc.bind(this);
    this.stderrFunc = this.stderrFunc.bind(this);
    this.onExit = this.onExit.bind(this);
    this.createOnErrorFunc = this.createOnErrorFunc.bind(this);
    this.scriptOptions = scriptOptions;
    this.emitter = new _atom.Emitter();
  }

  _createClass(Runner, [{
    key: 'run',
    value: function run(command, extraArgs, codeContext) {
      var inputString = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      this.startTime = new Date();

      var args = this.args(codeContext, extraArgs);
      var options = this.options();
      var stdout = this.stdoutFunc;
      var stderr = this.stderrFunc;
      var exit = this.onExit;

      this.bufferedProcess = new _atom.BufferedProcess({
        command: command, args: args, options: options, stdout: stdout, stderr: stderr, exit: exit
      });

      if (inputString) {
        this.bufferedProcess.process.stdin.write(inputString);
        this.bufferedProcess.process.stdin.end();
      }

      this.bufferedProcess.onWillThrowError(this.createOnErrorFunc(command));
    }
  }, {
    key: 'stdoutFunc',
    value: function stdoutFunc(output) {
      this.emitter.emit('did-write-to-stdout', { message: output });
    }
  }, {
    key: 'onDidWriteToStdout',
    value: function onDidWriteToStdout(callback) {
      return this.emitter.on('did-write-to-stdout', callback);
    }
  }, {
    key: 'stderrFunc',
    value: function stderrFunc(output) {
      this.emitter.emit('did-write-to-stderr', { message: output });
    }
  }, {
    key: 'onDidWriteToStderr',
    value: function onDidWriteToStderr(callback) {
      return this.emitter.on('did-write-to-stderr', callback);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.emitter.dispose();
    }
  }, {
    key: 'getCwd',
    value: function getCwd() {
      var cwd = this.scriptOptions.workingDirectory;

      if (!cwd) {
        switch (atom.config.get('script.cwdBehavior')) {
          case 'First project directory':
            {
              var paths = atom.project.getPaths();
              if (paths && paths.length > 0) {
                try {
                  cwd = _fs2['default'].statSync(paths[0]).isDirectory() ? paths[0] : _path2['default'].join(paths[0], '..');
                } catch (error) {/* Don't throw */}
              }
              break;
            }
          case 'Project directory of the script':
            {
              cwd = this.getProjectPath();
              break;
            }
          case 'Directory of the script':
            {
              var pane = atom.workspace.getActivePaneItem();
              cwd = pane && pane.buffer && pane.buffer.file && pane.buffer.file.getParent && pane.buffer.file.getParent() && pane.buffer.file.getParent().getPath && pane.buffer.file.getParent().getPath() || '';
              break;
            }
        }
      }
      return cwd;
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.bufferedProcess) {
        this.bufferedProcess.kill();
        this.bufferedProcess = null;
      }
    }
  }, {
    key: 'onExit',
    value: function onExit(returnCode) {
      this.bufferedProcess = null;
      var executionTime = undefined;

      if (atom.config.get('script.enableExecTime') === true && this.startTime) {
        executionTime = (new Date().getTime() - this.startTime.getTime()) / 1000;
      }

      this.emitter.emit('did-exit', { executionTime: executionTime, returnCode: returnCode });
    }
  }, {
    key: 'onDidExit',
    value: function onDidExit(callback) {
      return this.emitter.on('did-exit', callback);
    }
  }, {
    key: 'createOnErrorFunc',
    value: function createOnErrorFunc(command) {
      var _this = this;

      return function (nodeError) {
        _this.bufferedProcess = null;
        _this.emitter.emit('did-not-run', { command: command });
        nodeError.handle();
      };
    }
  }, {
    key: 'onDidNotRun',
    value: function onDidNotRun(callback) {
      return this.emitter.on('did-not-run', callback);
    }
  }, {
    key: 'options',
    value: function options() {
      return {
        cwd: this.getCwd(),
        env: this.scriptOptions.mergedEnv(process.env)
      };
    }
  }, {
    key: 'fillVarsInArg',
    value: function fillVarsInArg(arg, codeContext, projectPath) {
      if (codeContext.filepath) {
        arg = arg.replace(/{FILE_ACTIVE}/g, codeContext.filepath);
        arg = arg.replace(/{FILE_ACTIVE_PATH}/g, _path2['default'].join(codeContext.filepath, '..'));
      }
      if (codeContext.filename) {
        arg = arg.replace(/{FILE_ACTIVE_NAME}/g, codeContext.filename);
        arg = arg.replace(/{FILE_ACTIVE_NAME_BASE}/g, _path2['default'].basename(codeContext.filename, _path2['default'].extname(codeContext.filename)));
      }
      if (projectPath) {
        arg = arg.replace(/{PROJECT_PATH}/g, projectPath);
      }

      return arg;
    }
  }, {
    key: 'args',
    value: function args(codeContext, extraArgs) {
      var _this2 = this;

      // extraArgs = default command args from:
      // - the grammars/<grammar>.coffee file

      // cmdArgs = customed command args from:
      // - a user's profil
      // - the 'Configure Run Options' panel
      var cmdArgs = this.scriptOptions.cmdArgs;

      // Let's overdrive the default args with the customed ones
      var args = cmdArgs.length ? cmdArgs : extraArgs;

      // Do not forget to concat the script args after the command args
      var scriptArgs = this.scriptOptions.scriptArgs;
      args = args.concat(scriptArgs);

      var projectPath = this.getProjectPath || '';
      args = args.map(function (arg) {
        return _this2.fillVarsInArg(arg, codeContext, projectPath);
      });

      if (!this.scriptOptions.cmd) {
        args = codeContext.shebangCommandArgs().concat(args);
      }
      return args;
    }
  }, {
    key: 'getProjectPath',
    value: function getProjectPath() {
      var filePath = atom.workspace.getActiveTextEditor().getPath();
      var projectPaths = atom.project.getPaths();
      for (var projectPath of projectPaths) {
        if (filePath.indexOf(projectPath) > -1) {
          if (_fs2['default'].statSync(projectPath).isDirectory()) {
            return projectPath;
          }
          return _path2['default'].join(projectPath, '..');
        }
      }
      return null;
    }
  }]);

  return Runner;
})();

exports['default'] = Runner;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3J1bm5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUV5QyxNQUFNOztrQkFDaEMsSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBSnZCLFdBQVcsQ0FBQzs7SUFNUyxNQUFNOzs7Ozs7O0FBTWQsV0FOUSxNQUFNLENBTWIsYUFBYSxFQUFFOzBCQU5SLE1BQU07O0FBT3ZCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNELFFBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0FBQ25DLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQztHQUM5Qjs7ZUFka0IsTUFBTTs7V0FnQnRCLGFBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDckQsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDOztBQUU1QixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMvQyxVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDL0IsVUFBTSxNQUFNLEdBQUcsSUFB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LENBQUMsQ0FBQyxFQUFFO0FBQ3RDLGNBQUksZ0JBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQzFDLG1CQUFPLFdBQVcsQ0FBQztXQUNwQjtBQUNELGlCQUFPLGtCQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDckM7T0FDRjtBQUNELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztTQXJMa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvcnVubmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IEVtaXR0ZXIsIEJ1ZmZlcmVkUHJvY2VzcyB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSdW5uZXIge1xuXG4gIC8vIFB1YmxpYzogQ3JlYXRlcyBhIFJ1bm5lciBpbnN0YW5jZVxuICAvL1xuICAvLyAqIGBzY3JpcHRPcHRpb25zYCBhIHtTY3JpcHRPcHRpb25zfSBvYmplY3QgaW5zdGFuY2VcbiAgLy8gKiBgZW1pdHRlcmAgQXRvbSdzIHtFbWl0dGVyfSBpbnN0YW5jZS4gWW91IHByb2JhYmx5IGRvbid0IG5lZWQgdG8gb3ZlcndyaXRlIGl0XG4gIGNvbnN0cnVjdG9yKHNjcmlwdE9wdGlvbnMpIHtcbiAgICB0aGlzLmJ1ZmZlcmVkUHJvY2VzcyA9IG51bGw7XG4gICAgdGhpcy5zdGRvdXRGdW5jID0gdGhpcy5zdGRvdXRGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGRlcnJGdW5jID0gdGhpcy5zdGRlcnJGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbkV4aXQgPSB0aGlzLm9uRXhpdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY3JlYXRlT25FcnJvckZ1bmMgPSB0aGlzLmNyZWF0ZU9uRXJyb3JGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zY3JpcHRPcHRpb25zID0gc2NyaXB0T3B0aW9ucztcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICB9XG5cbiAgcnVuKGNvbW1hbmQsIGV4dHJhQXJncywgY29kZUNvbnRleHQsIGlucHV0U3RyaW5nID0gbnVsbCkge1xuICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcblxuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmFyZ3MoY29kZUNvbnRleHQsIGV4dHJhQXJncyk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucygpO1xuICAgIGNvbnN0IHN0ZG91dCA9IHRoaXMuc3Rkb3V0RnVuYztcbiAgICBjb25zdCBzdGRlcnIgPSB0aGlzLnN0ZGVyckZ1bmM7XG4gICAgY29uc3QgZXhpdCA9IHRoaXMub25FeGl0O1xuXG4gICAgdGhpcy5idWZmZXJlZFByb2Nlc3MgPSBuZXcgQnVmZmVyZWRQcm9jZXNzKHtcbiAgICAgIGNvbW1hbmQsIGFyZ3MsIG9wdGlvbnMsIHN0ZG91dCwgc3RkZXJyLCBleGl0LFxuICAgIH0pO1xuXG4gICAgaWYgKGlucHV0U3RyaW5nKSB7XG4gICAgICB0aGlzLmJ1ZmZlcmVkUHJvY2Vzcy5wcm9jZXNzLnN0ZGluLndyaXRlKGlucHV0U3RyaW5nKTtcbiAgICAgIHRoaXMuYnVmZmVyZWRQcm9jZXNzLnByb2Nlc3Muc3RkaW4uZW5kKCk7XG4gICAgfVxuXG4gICAgdGhpcy5idWZmZXJlZFByb2Nlc3Mub25XaWxsVGhyb3dFcnJvcih0aGlzLmNyZWF0ZU9uRXJyb3JGdW5jKGNvbW1hbmQpKTtcbiAgfVxuXG4gIHN0ZG91dEZ1bmMob3V0cHV0KSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC13cml0ZS10by1zdGRvdXQnLCB7IG1lc3NhZ2U6IG91dHB1dCB9KTtcbiAgfVxuXG4gIG9uRGlkV3JpdGVUb1N0ZG91dChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC13cml0ZS10by1zdGRvdXQnLCBjYWxsYmFjayk7XG4gIH1cblxuICBzdGRlcnJGdW5jKG91dHB1dCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtd3JpdGUtdG8tc3RkZXJyJywgeyBtZXNzYWdlOiBvdXRwdXQgfSk7XG4gIH1cblxuICBvbkRpZFdyaXRlVG9TdGRlcnIoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtd3JpdGUtdG8tc3RkZXJyJywgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgZ2V0Q3dkKCkge1xuICAgIGxldCBjd2QgPSB0aGlzLnNjcmlwdE9wdGlvbnMud29ya2luZ0RpcmVjdG9yeTtcblxuICAgIGlmICghY3dkKSB7XG4gICAgICBzd2l0Y2ggKGF0b20uY29uZmlnLmdldCgnc2NyaXB0LmN3ZEJlaGF2aW9yJykpIHtcbiAgICAgICAgY2FzZSAnRmlyc3QgcHJvamVjdCBkaXJlY3RvcnknOiB7XG4gICAgICAgICAgY29uc3QgcGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICAgICAgICBpZiAocGF0aHMgJiYgcGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY3dkID0gZnMuc3RhdFN5bmMocGF0aHNbMF0pLmlzRGlyZWN0b3J5KCkgPyBwYXRoc1swXSA6IHBhdGguam9pbihwYXRoc1swXSwgJy4uJyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikgeyAvKiBEb24ndCB0aHJvdyAqLyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ1Byb2plY3QgZGlyZWN0b3J5IG9mIHRoZSBzY3JpcHQnOiB7XG4gICAgICAgICAgY3dkID0gdGhpcy5nZXRQcm9qZWN0UGF0aCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ0RpcmVjdG9yeSBvZiB0aGUgc2NyaXB0Jzoge1xuICAgICAgICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuICAgICAgICAgIGN3ZCA9IChwYW5lICYmIHBhbmUuYnVmZmVyICYmIHBhbmUuYnVmZmVyLmZpbGUgJiYgcGFuZS5idWZmZXIuZmlsZS5nZXRQYXJlbnQgJiZcbiAgICAgICAgICAgICAgICAgcGFuZS5idWZmZXIuZmlsZS5nZXRQYXJlbnQoKSAmJiBwYW5lLmJ1ZmZlci5maWxlLmdldFBhcmVudCgpLmdldFBhdGggJiZcbiAgICAgICAgICAgICAgICAgcGFuZS5idWZmZXIuZmlsZS5nZXRQYXJlbnQoKS5nZXRQYXRoKCkpIHx8ICcnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjd2Q7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLmJ1ZmZlcmVkUHJvY2Vzcykge1xuICAgICAgdGhpcy5idWZmZXJlZFByb2Nlc3Mua2lsbCgpO1xuICAgICAgdGhpcy5idWZmZXJlZFByb2Nlc3MgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIG9uRXhpdChyZXR1cm5Db2RlKSB7XG4gICAgdGhpcy5idWZmZXJlZFByb2Nlc3MgPSBudWxsO1xuICAgIGxldCBleGVjdXRpb25UaW1lO1xuXG4gICAgaWYgKChhdG9tLmNvbmZpZy5nZXQoJ3NjcmlwdC5lbmFibGVFeGVjVGltZScpID09PSB0cnVlKSAmJiB0aGlzLnN0YXJ0VGltZSkge1xuICAgICAgZXhlY3V0aW9uVGltZSA9IChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMuc3RhcnRUaW1lLmdldFRpbWUoKSkgLyAxMDAwO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZXhpdCcsIHsgZXhlY3V0aW9uVGltZSwgcmV0dXJuQ29kZSB9KTtcbiAgfVxuXG4gIG9uRGlkRXhpdChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1leGl0JywgY2FsbGJhY2spO1xuICB9XG5cbiAgY3JlYXRlT25FcnJvckZ1bmMoY29tbWFuZCkge1xuICAgIHJldHVybiAobm9kZUVycm9yKSA9PiB7XG4gICAgICB0aGlzLmJ1ZmZlcmVkUHJvY2VzcyA9IG51bGw7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW5vdC1ydW4nLCB7IGNvbW1hbmQgfSk7XG4gICAgICBub2RlRXJyb3IuaGFuZGxlKCk7XG4gICAgfTtcbiAgfVxuXG4gIG9uRGlkTm90UnVuKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLW5vdC1ydW4nLCBjYWxsYmFjayk7XG4gIH1cblxuICBvcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjd2Q6IHRoaXMuZ2V0Q3dkKCksXG4gICAgICBlbnY6IHRoaXMuc2NyaXB0T3B0aW9ucy5tZXJnZWRFbnYocHJvY2Vzcy5lbnYpLFxuICAgIH07XG4gIH1cblxuICBmaWxsVmFyc0luQXJnKGFyZywgY29kZUNvbnRleHQsIHByb2plY3RQYXRoKSB7XG4gICAgaWYgKGNvZGVDb250ZXh0LmZpbGVwYXRoKSB7XG4gICAgICBhcmcgPSBhcmcucmVwbGFjZSgve0ZJTEVfQUNUSVZFfS9nLCBjb2RlQ29udGV4dC5maWxlcGF0aCk7XG4gICAgICBhcmcgPSBhcmcucmVwbGFjZSgve0ZJTEVfQUNUSVZFX1BBVEh9L2csIHBhdGguam9pbihjb2RlQ29udGV4dC5maWxlcGF0aCwgJy4uJykpO1xuICAgIH1cbiAgICBpZiAoY29kZUNvbnRleHQuZmlsZW5hbWUpIHtcbiAgICAgIGFyZyA9IGFyZy5yZXBsYWNlKC97RklMRV9BQ1RJVkVfTkFNRX0vZywgY29kZUNvbnRleHQuZmlsZW5hbWUpO1xuICAgICAgYXJnID0gYXJnLnJlcGxhY2UoL3tGSUxFX0FDVElWRV9OQU1FX0JBU0V9L2csIHBhdGguYmFzZW5hbWUoY29kZUNvbnRleHQuZmlsZW5hbWUsIHBhdGguZXh0bmFtZShjb2RlQ29udGV4dC5maWxlbmFtZSkpKTtcbiAgICB9XG4gICAgaWYgKHByb2plY3RQYXRoKSB7XG4gICAgICBhcmcgPSBhcmcucmVwbGFjZSgve1BST0pFQ1RfUEFUSH0vZywgcHJvamVjdFBhdGgpO1xuICAgIH1cblxuICAgIHJldHVybiBhcmc7XG4gIH1cblxuICBhcmdzKGNvZGVDb250ZXh0LCBleHRyYUFyZ3MpIHtcbiAgICAvLyBleHRyYUFyZ3MgPSBkZWZhdWx0IGNvbW1hbmQgYXJncyBmcm9tOlxuICAgIC8vIC0gdGhlIGdyYW1tYXJzLzxncmFtbWFyPi5jb2ZmZWUgZmlsZVxuXG4gICAgLy8gY21kQXJncyA9IGN1c3RvbWVkIGNvbW1hbmQgYXJncyBmcm9tOlxuICAgIC8vIC0gYSB1c2VyJ3MgcHJvZmlsXG4gICAgLy8gLSB0aGUgJ0NvbmZpZ3VyZSBSdW4gT3B0aW9ucycgcGFuZWxcbiAgICBjb25zdCBjbWRBcmdzID0gdGhpcy5zY3JpcHRPcHRpb25zLmNtZEFyZ3M7XG5cbiAgICAvLyBMZXQncyBvdmVyZHJpdmUgdGhlIGRlZmF1bHQgYXJncyB3aXRoIHRoZSBjdXN0b21lZCBvbmVzXG4gICAgbGV0IGFyZ3MgPSAoY21kQXJncy5sZW5ndGgpID8gY21kQXJncyA6IGV4dHJhQXJncztcblxuICAgIC8vIERvIG5vdCBmb3JnZXQgdG8gY29uY2F0IHRoZSBzY3JpcHQgYXJncyBhZnRlciB0aGUgY29tbWFuZCBhcmdzXG4gICAgY29uc3Qgc2NyaXB0QXJncyA9IHRoaXMuc2NyaXB0T3B0aW9ucy5zY3JpcHRBcmdzO1xuICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChzY3JpcHRBcmdzKTtcblxuICAgIGNvbnN0IHByb2plY3RQYXRoID0gdGhpcy5nZXRQcm9qZWN0UGF0aCB8fCAnJztcbiAgICBhcmdzID0gKGFyZ3MubWFwKGFyZyA9PiB0aGlzLmZpbGxWYXJzSW5BcmcoYXJnLCBjb2RlQ29udGV4dCwgcHJvamVjdFBhdGgpKSk7XG5cbiAgICBpZiAoIXRoaXMuc2NyaXB0T3B0aW9ucy5jbWQpIHtcbiAgICAgIGFyZ3MgPSBjb2RlQ29udGV4dC5zaGViYW5nQ29tbWFuZEFyZ3MoKS5jb25jYXQoYXJncyk7XG4gICAgfVxuICAgIHJldHVybiBhcmdzO1xuICB9XG5cbiAgZ2V0UHJvamVjdFBhdGgoKSB7XG4gICAgY29uc3QgZmlsZVBhdGggPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0UGF0aCgpO1xuICAgIGNvbnN0IHByb2plY3RQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgIGZvciAoY29uc3QgcHJvamVjdFBhdGggb2YgcHJvamVjdFBhdGhzKSB7XG4gICAgICBpZiAoZmlsZVBhdGguaW5kZXhPZihwcm9qZWN0UGF0aCkgPiAtMSkge1xuICAgICAgICBpZiAoZnMuc3RhdFN5bmMocHJvamVjdFBhdGgpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvamVjdFBhdGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGguam9pbihwcm9qZWN0UGF0aCwgJy4uJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=