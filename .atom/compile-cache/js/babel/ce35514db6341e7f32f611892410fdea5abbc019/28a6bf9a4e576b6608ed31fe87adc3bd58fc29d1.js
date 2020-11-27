Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _grammars = require('./grammars');

var _grammars2 = _interopRequireDefault(_grammars);

'use babel';

var CommandContext = (function () {
  function CommandContext() {
    _classCallCheck(this, CommandContext);

    this.command = null;
    this.workingDirectory = null;
    this.args = [];
    this.options = {};
  }

  _createClass(CommandContext, [{
    key: 'quoteArguments',
    value: function quoteArguments(args) {
      return args.map(function (arg) {
        return arg.trim().indexOf(' ') === -1 ? arg.trim() : '\'' + arg + '\'';
      });
    }
  }, {
    key: 'getRepresentation',
    value: function getRepresentation() {
      if (!this.command || !this.args.length) return '';

      // command arguments
      var commandArgs = this.options.cmdArgs ? this.quoteArguments(this.options.cmdArgs).join(' ') : '';

      // script arguments
      var args = this.args.length ? this.quoteArguments(this.args).join(' ') : '';
      var scriptArgs = this.options.scriptArgs ? this.quoteArguments(this.options.scriptArgs).join(' ') : '';

      return this.command.trim() + (commandArgs ? ' ' + commandArgs : '') + (args ? ' ' + args : '') + (scriptArgs ? ' ' + scriptArgs : '');
    }
  }], [{
    key: 'build',
    value: function build(runtime, runOptions, codeContext) {
      var commandContext = new CommandContext();
      commandContext.options = runOptions;
      var buildArgsArray = undefined;

      try {
        if (!runOptions.cmd) {
          // Precondition: lang? and lang of grammarMap
          commandContext.command = codeContext.shebangCommand() || _grammars2['default'][codeContext.lang][codeContext.argType].command;
        } else {
          commandContext.command = runOptions.cmd;
        }

        buildArgsArray = _grammars2['default'][codeContext.lang][codeContext.argType].args;
      } catch (error) {
        runtime.modeNotSupported(codeContext.argType, codeContext.lang);
        return false;
      }

      try {
        commandContext.args = buildArgsArray(codeContext);
      } catch (errorSendByArgs) {
        runtime.didNotBuildArgs(errorSendByArgs);
        return false;
      }

      if (!runOptions.workingDirectory) {
        // Precondition: lang? and lang of grammarMap
        commandContext.workingDirectory = _grammars2['default'][codeContext.lang][codeContext.argType].workingDirectory || '';
      } else {
        commandContext.workingDirectory = runOptions.workingDirectory;
      }

      // Return setup information
      return commandContext;
    }
  }]);

  return CommandContext;
})();

exports['default'] = CommandContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2NvbW1hbmQtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3dCQUV1QixZQUFZOzs7O0FBRm5DLFdBQVcsQ0FBQzs7SUFJUyxjQUFjO0FBQ3RCLFdBRFEsY0FBYyxHQUNuQjswQkFESyxjQUFjOztBQUUvQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7R0FDbkI7O2VBTmtCLGNBQWM7O1dBOENuQix3QkFBQyxJQUFJLEVBQUU7QUFDbkIsYUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRztlQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFPLEdBQUcsT0FBRztPQUFDLENBQUMsQ0FBQztLQUNwRjs7O1dBRWdCLDZCQUFHO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUM7OztBQUdsRCxVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7O0FBR3BHLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDOUUsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRXpHLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFDdkIsV0FBVyxTQUFPLFdBQVcsR0FBSyxFQUFFLENBQUEsQUFBQyxJQUNyQyxJQUFJLFNBQU8sSUFBSSxHQUFLLEVBQUUsQ0FBQSxBQUFDLElBQ3ZCLFVBQVUsU0FBTyxVQUFVLEdBQUssRUFBRSxDQUFBLEFBQUMsQ0FBQztLQUN4Qzs7O1dBeERXLGVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUU7QUFDN0MsVUFBTSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztBQUM1QyxvQkFBYyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7QUFDcEMsVUFBSSxjQUFjLFlBQUEsQ0FBQzs7QUFFbkIsVUFBSTtBQUNGLFlBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFOztBQUVuQix3QkFBYyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsY0FBYyxFQUFFLElBQ25ELHNCQUFXLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO1NBQzdELE1BQU07QUFDTCx3QkFBYyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDO1NBQ3pDOztBQUVELHNCQUFjLEdBQUcsc0JBQVcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7T0FDekUsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLGVBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRSxlQUFPLEtBQUssQ0FBQztPQUNkOztBQUVELFVBQUk7QUFDRixzQkFBYyxDQUFDLElBQUksR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDbkQsQ0FBQyxPQUFPLGVBQWUsRUFBRTtBQUN4QixlQUFPLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pDLGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBRUQsVUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRTs7QUFFaEMsc0JBQWMsQ0FBQyxnQkFBZ0IsR0FBRyxzQkFBVyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixJQUFJLEVBQUUsQ0FBQztPQUM1RyxNQUFNO0FBQ0wsc0JBQWMsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7T0FDL0Q7OztBQUdELGFBQU8sY0FBYyxDQUFDO0tBQ3ZCOzs7U0E1Q2tCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6ImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2NvbW1hbmQtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgZ3JhbW1hck1hcCBmcm9tICcuL2dyYW1tYXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWFuZENvbnRleHQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbW1hbmQgPSBudWxsO1xuICAgIHRoaXMud29ya2luZ0RpcmVjdG9yeSA9IG51bGw7XG4gICAgdGhpcy5hcmdzID0gW107XG4gICAgdGhpcy5vcHRpb25zID0ge307XG4gIH1cblxuICBzdGF0aWMgYnVpbGQocnVudGltZSwgcnVuT3B0aW9ucywgY29kZUNvbnRleHQpIHtcbiAgICBjb25zdCBjb21tYW5kQ29udGV4dCA9IG5ldyBDb21tYW5kQ29udGV4dCgpO1xuICAgIGNvbW1hbmRDb250ZXh0Lm9wdGlvbnMgPSBydW5PcHRpb25zO1xuICAgIGxldCBidWlsZEFyZ3NBcnJheTtcblxuICAgIHRyeSB7XG4gICAgICBpZiAoIXJ1bk9wdGlvbnMuY21kKSB7XG4gICAgICAgIC8vIFByZWNvbmRpdGlvbjogbGFuZz8gYW5kIGxhbmcgb2YgZ3JhbW1hck1hcFxuICAgICAgICBjb21tYW5kQ29udGV4dC5jb21tYW5kID0gY29kZUNvbnRleHQuc2hlYmFuZ0NvbW1hbmQoKSB8fFxuICAgICAgICAgIGdyYW1tYXJNYXBbY29kZUNvbnRleHQubGFuZ11bY29kZUNvbnRleHQuYXJnVHlwZV0uY29tbWFuZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbW1hbmRDb250ZXh0LmNvbW1hbmQgPSBydW5PcHRpb25zLmNtZDtcbiAgICAgIH1cblxuICAgICAgYnVpbGRBcmdzQXJyYXkgPSBncmFtbWFyTWFwW2NvZGVDb250ZXh0LmxhbmddW2NvZGVDb250ZXh0LmFyZ1R5cGVdLmFyZ3M7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJ1bnRpbWUubW9kZU5vdFN1cHBvcnRlZChjb2RlQ29udGV4dC5hcmdUeXBlLCBjb2RlQ29udGV4dC5sYW5nKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29tbWFuZENvbnRleHQuYXJncyA9IGJ1aWxkQXJnc0FycmF5KGNvZGVDb250ZXh0KTtcbiAgICB9IGNhdGNoIChlcnJvclNlbmRCeUFyZ3MpIHtcbiAgICAgIHJ1bnRpbWUuZGlkTm90QnVpbGRBcmdzKGVycm9yU2VuZEJ5QXJncyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFydW5PcHRpb25zLndvcmtpbmdEaXJlY3RvcnkpIHtcbiAgICAgIC8vIFByZWNvbmRpdGlvbjogbGFuZz8gYW5kIGxhbmcgb2YgZ3JhbW1hck1hcFxuICAgICAgY29tbWFuZENvbnRleHQud29ya2luZ0RpcmVjdG9yeSA9IGdyYW1tYXJNYXBbY29kZUNvbnRleHQubGFuZ11bY29kZUNvbnRleHQuYXJnVHlwZV0ud29ya2luZ0RpcmVjdG9yeSB8fCAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgY29tbWFuZENvbnRleHQud29ya2luZ0RpcmVjdG9yeSA9IHJ1bk9wdGlvbnMud29ya2luZ0RpcmVjdG9yeTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gc2V0dXAgaW5mb3JtYXRpb25cbiAgICByZXR1cm4gY29tbWFuZENvbnRleHQ7XG4gIH1cblxuICBxdW90ZUFyZ3VtZW50cyhhcmdzKSB7XG4gICAgcmV0dXJuIGFyZ3MubWFwKGFyZyA9PiAoYXJnLnRyaW0oKS5pbmRleE9mKCcgJykgPT09IC0xID8gYXJnLnRyaW0oKSA6IGAnJHthcmd9J2ApKTtcbiAgfVxuXG4gIGdldFJlcHJlc2VudGF0aW9uKCkge1xuICAgIGlmICghdGhpcy5jb21tYW5kIHx8ICF0aGlzLmFyZ3MubGVuZ3RoKSByZXR1cm4gJyc7XG5cbiAgICAvLyBjb21tYW5kIGFyZ3VtZW50c1xuICAgIGNvbnN0IGNvbW1hbmRBcmdzID0gdGhpcy5vcHRpb25zLmNtZEFyZ3MgPyB0aGlzLnF1b3RlQXJndW1lbnRzKHRoaXMub3B0aW9ucy5jbWRBcmdzKS5qb2luKCcgJykgOiAnJztcblxuICAgIC8vIHNjcmlwdCBhcmd1bWVudHNcbiAgICBjb25zdCBhcmdzID0gdGhpcy5hcmdzLmxlbmd0aCA/IHRoaXMucXVvdGVBcmd1bWVudHModGhpcy5hcmdzKS5qb2luKCcgJykgOiAnJztcbiAgICBjb25zdCBzY3JpcHRBcmdzID0gdGhpcy5vcHRpb25zLnNjcmlwdEFyZ3MgPyB0aGlzLnF1b3RlQXJndW1lbnRzKHRoaXMub3B0aW9ucy5zY3JpcHRBcmdzKS5qb2luKCcgJykgOiAnJztcblxuICAgIHJldHVybiB0aGlzLmNvbW1hbmQudHJpbSgpICtcbiAgICAgIChjb21tYW5kQXJncyA/IGAgJHtjb21tYW5kQXJnc31gIDogJycpICtcbiAgICAgIChhcmdzID8gYCAke2FyZ3N9YCA6ICcnKSArXG4gICAgICAoc2NyaXB0QXJncyA/IGAgJHtzY3JpcHRBcmdzfWAgOiAnJyk7XG4gIH1cbn1cbiJdfQ==