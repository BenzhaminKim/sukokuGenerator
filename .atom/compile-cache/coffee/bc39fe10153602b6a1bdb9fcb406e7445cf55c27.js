(function() {
  var GrammarUtils;

  GrammarUtils = require('../grammar-utils');

  exports.Lua = {
    'Selection Based': {
      command: 'lua',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code);
        return [tmpFile];
      }
    },
    'File Based': {
      command: 'lua',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports['Lua (WoW)'] = exports.Lua;

  exports.MoonScript = {
    'Selection Based': {
      command: 'moon',
      args: function(context) {
        return ['-e', context.getCode()];
      }
    },
    'File Based': {
      command: 'moon',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvbHVhLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUjs7RUFFZixPQUFPLENBQUMsR0FBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxLQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLFlBQUE7UUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtRQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEM7QUFDVixlQUFPLENBQUMsT0FBRDtNQUhILENBRE47S0FERjtJQU9BLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxLQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsUUFBRDtNQUFoQixDQUROO0tBUkY7OztFQVdGLE9BQVEsQ0FBQSxXQUFBLENBQVIsR0FBdUIsT0FBTyxDQUFDOztFQUUvQixPQUFPLENBQUMsVUFBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtlQUFhLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUDtNQUFiLENBRE47S0FERjtJQUlBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsUUFBRDtNQUFoQixDQUROO0tBTEY7O0FBakJGIiwic291cmNlc0NvbnRlbnQiOlsiR3JhbW1hclV0aWxzID0gcmVxdWlyZSAnLi4vZ3JhbW1hci11dGlscydcblxuZXhwb3J0cy5MdWEgPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnbHVhJ1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgIHJldHVybiBbdG1wRmlsZV1cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2x1YSdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG5leHBvcnRzWydMdWEgKFdvVyknXSA9IGV4cG9ydHMuTHVhXG5cbmV4cG9ydHMuTW9vblNjcmlwdCA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdtb29uJ1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdtb29uJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG4iXX0=
