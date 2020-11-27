function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _grammarUtils = require('../grammar-utils');

var _grammarUtils2 = _interopRequireDefault(_grammarUtils);

'use babel';

var babel = _path2['default'].join(__dirname, '../..', 'node_modules', '.bin', 'babel');

var _args = function _args(_ref) {
  var filepath = _ref.filepath;

  var cmd = '\'' + babel + '\' --filename \'' + babel + '\' < \'' + filepath + '\'| node';
  return _grammarUtils2['default'].formatArgs(cmd);
};
exports.Dart = {
  'Selection Based': {
    command: 'dart',
    args: function args(context) {
      var code = context.getCode();
      var tmpFile = _grammarUtils2['default'].createTempFileWithCode(code, '.dart');
      return [tmpFile];
    }
  },
  'File Based': {
    command: 'dart',
    args: function args(_ref2) {
      var filepath = _ref2.filepath;
      return [filepath];
    }
  }
};
exports.JavaScript = {
  'Selection Based': {
    command: _grammarUtils.command,
    args: function args(context) {
      var code = context.getCode();
      var filepath = _grammarUtils2['default'].createTempFileWithCode(code, '.js');
      return _args({ filepath: filepath });
    }
  },
  'File Based': { command: _grammarUtils.command, args: _args }
};
exports['Babel ES6 JavaScript'] = exports.JavaScript;
exports['JavaScript with JSX'] = exports.JavaScript;

exports['JavaScript for Automation (JXA)'] = {
  'Selection Based': {
    command: 'osascript',
    args: function args(context) {
      return ['-l', 'JavaScript', '-e', context.getCode()];
    }
  },
  'File Based': {
    command: 'osascript',
    args: function args(_ref3) {
      var filepath = _ref3.filepath;
      return ['-l', 'JavaScript', filepath];
    }
  }
};
exports.TypeScript = {
  'Selection Based': {
    command: 'ts-node',
    args: function args(context) {
      return ['-e', context.getCode()];
    }
  },
  'File Based': {
    command: 'ts-node',
    args: function args(_ref4) {
      var filepath = _ref4.filepath;
      return [filepath];
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXJzL2phdmFzY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7b0JBRWlCLE1BQU07Ozs7NEJBQ2Usa0JBQWtCOzs7O0FBSHhELFdBQVcsQ0FBQzs7QUFLWixJQUFNLEtBQUssR0FBRyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUU3RSxJQUFNLEtBQUksR0FBRyxTQUFQLEtBQUksQ0FBSSxJQUFZLEVBQUs7TUFBZixRQUFRLEdBQVYsSUFBWSxDQUFWLFFBQVE7O0FBQ3RCLE1BQU0sR0FBRyxVQUFPLEtBQUssd0JBQWlCLEtBQUssZUFBUSxRQUFRLGFBQVMsQ0FBQztBQUNyRSxTQUFPLDBCQUFhLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNyQyxDQUFDO0FBQ0YsT0FBTyxDQUFDLElBQUksR0FBRztBQUNiLG1CQUFpQixFQUFFO0FBQ2pCLFdBQU8sRUFBRSxNQUFNO0FBQ2YsUUFBSSxFQUFFLGNBQUMsT0FBTyxFQUFLO0FBQ2pCLFVBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMvQixVQUFNLE9BQU8sR0FBRywwQkFBYSxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbkUsYUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2xCO0dBQ0Y7QUFDRCxjQUFZLEVBQUU7QUFDWixXQUFPLEVBQUUsTUFBTTtBQUNmLFFBQUksRUFBRSxjQUFDLEtBQVk7VUFBVixRQUFRLEdBQVYsS0FBWSxDQUFWLFFBQVE7YUFBTyxDQUFDLFFBQVEsQ0FBQztLQUFBO0dBQ25DO0NBQ0YsQ0FBQztBQUNGLE9BQU8sQ0FBQyxVQUFVLEdBQUc7QUFDbkIsbUJBQWlCLEVBQUU7QUFDakIsV0FBTyx1QkFBQTtBQUNQLFFBQUksRUFBRSxjQUFDLE9BQU8sRUFBSztBQUNqQixVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDL0IsVUFBTSxRQUFRLEdBQUcsMEJBQWEsc0JBQXNCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xFLGFBQU8sS0FBSSxDQUFDLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDM0I7R0FDRjtBQUNELGNBQVksRUFBRSxFQUFFLE9BQU8sdUJBQUEsRUFBRSxJQUFJLEVBQUosS0FBSSxFQUFFO0NBQ2hDLENBQUM7QUFDRixPQUFPLENBQUMsc0JBQXNCLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQ3JELE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7O0FBRXBELE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxHQUFHO0FBQzNDLG1CQUFpQixFQUFFO0FBQ2pCLFdBQU8sRUFBRSxXQUFXO0FBQ3BCLFFBQUksRUFBRSxjQUFBLE9BQU87YUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUFBO0dBQy9EO0FBQ0QsY0FBWSxFQUFFO0FBQ1osV0FBTyxFQUFFLFdBQVc7QUFDcEIsUUFBSSxFQUFFLGNBQUMsS0FBWTtVQUFWLFFBQVEsR0FBVixLQUFZLENBQVYsUUFBUTthQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUM7S0FBQTtHQUN2RDtDQUNGLENBQUM7QUFDRixPQUFPLENBQUMsVUFBVSxHQUFHO0FBQ25CLG1CQUFpQixFQUFFO0FBQ2pCLFdBQU8sRUFBRSxTQUFTO0FBQ2xCLFFBQUksRUFBRSxjQUFBLE9BQU87YUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7S0FBQTtHQUMzQztBQUNELGNBQVksRUFBRTtBQUNaLFdBQU8sRUFBRSxTQUFTO0FBQ2xCLFFBQUksRUFBRSxjQUFDLEtBQVk7VUFBVixRQUFRLEdBQVYsS0FBWSxDQUFWLFFBQVE7YUFBTyxDQUFDLFFBQVEsQ0FBQztLQUFBO0dBQ25DO0NBQ0YsQ0FBQyIsImZpbGUiOiJmaWxlOi8vL0M6L1VzZXJzL3VzZXIvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9qYXZhc2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEdyYW1tYXJVdGlscywgeyBjb21tYW5kIH0gZnJvbSAnLi4vZ3JhbW1hci11dGlscyc7XG5cbmNvbnN0IGJhYmVsID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uJywgJ25vZGVfbW9kdWxlcycsICcuYmluJywgJ2JhYmVsJyk7XG5cbmNvbnN0IGFyZ3MgPSAoeyBmaWxlcGF0aCB9KSA9PiB7XG4gIGNvbnN0IGNtZCA9IGAnJHtiYWJlbH0nIC0tZmlsZW5hbWUgJyR7YmFiZWx9JyA8ICcke2ZpbGVwYXRofSd8IG5vZGVgO1xuICByZXR1cm4gR3JhbW1hclV0aWxzLmZvcm1hdEFyZ3MoY21kKTtcbn07XG5leHBvcnRzLkRhcnQgPSB7XG4gICdTZWxlY3Rpb24gQmFzZWQnOiB7XG4gICAgY29tbWFuZDogJ2RhcnQnLFxuICAgIGFyZ3M6IChjb250ZXh0KSA9PiB7XG4gICAgICBjb25zdCBjb2RlID0gY29udGV4dC5nZXRDb2RlKCk7XG4gICAgICBjb25zdCB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy5kYXJ0Jyk7XG4gICAgICByZXR1cm4gW3RtcEZpbGVdO1xuICAgIH0sXG4gIH0sXG4gICdGaWxlIEJhc2VkJzoge1xuICAgIGNvbW1hbmQ6ICdkYXJ0JyxcbiAgICBhcmdzOiAoeyBmaWxlcGF0aCB9KSA9PiBbZmlsZXBhdGhdLFxuICB9LFxufTtcbmV4cG9ydHMuSmF2YVNjcmlwdCA9IHtcbiAgJ1NlbGVjdGlvbiBCYXNlZCc6IHtcbiAgICBjb21tYW5kLFxuICAgIGFyZ3M6IChjb250ZXh0KSA9PiB7XG4gICAgICBjb25zdCBjb2RlID0gY29udGV4dC5nZXRDb2RlKCk7XG4gICAgICBjb25zdCBmaWxlcGF0aCA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcuanMnKTtcbiAgICAgIHJldHVybiBhcmdzKHsgZmlsZXBhdGggfSk7XG4gICAgfSxcbiAgfSxcbiAgJ0ZpbGUgQmFzZWQnOiB7IGNvbW1hbmQsIGFyZ3MgfSxcbn07XG5leHBvcnRzWydCYWJlbCBFUzYgSmF2YVNjcmlwdCddID0gZXhwb3J0cy5KYXZhU2NyaXB0O1xuZXhwb3J0c1snSmF2YVNjcmlwdCB3aXRoIEpTWCddID0gZXhwb3J0cy5KYXZhU2NyaXB0O1xuXG5leHBvcnRzWydKYXZhU2NyaXB0IGZvciBBdXRvbWF0aW9uIChKWEEpJ10gPSB7XG4gICdTZWxlY3Rpb24gQmFzZWQnOiB7XG4gICAgY29tbWFuZDogJ29zYXNjcmlwdCcsXG4gICAgYXJnczogY29udGV4dCA9PiBbJy1sJywgJ0phdmFTY3JpcHQnLCAnLWUnLCBjb250ZXh0LmdldENvZGUoKV0sXG4gIH0sXG4gICdGaWxlIEJhc2VkJzoge1xuICAgIGNvbW1hbmQ6ICdvc2FzY3JpcHQnLFxuICAgIGFyZ3M6ICh7IGZpbGVwYXRoIH0pID0+IFsnLWwnLCAnSmF2YVNjcmlwdCcsIGZpbGVwYXRoXSxcbiAgfSxcbn07XG5leHBvcnRzLlR5cGVTY3JpcHQgPSB7XG4gICdTZWxlY3Rpb24gQmFzZWQnOiB7XG4gICAgY29tbWFuZDogJ3RzLW5vZGUnLFxuICAgIGFyZ3M6IGNvbnRleHQgPT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXSxcbiAgfSxcbiAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgY29tbWFuZDogJ3RzLW5vZGUnLFxuICAgIGFyZ3M6ICh7IGZpbGVwYXRoIH0pID0+IFtmaWxlcGF0aF0sXG4gIH0sXG59O1xuIl19