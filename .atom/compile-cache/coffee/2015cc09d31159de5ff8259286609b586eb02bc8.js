(function() {
  var GrammarUtils, args, babel, bin, coffee, command, path;

  path = require('path');

  command = (GrammarUtils = require('../grammar-utils')).command;

  bin = path.join(__dirname, '../..', 'node_modules', '.bin');

  coffee = path.join(bin, 'coffee');

  babel = path.join(bin, 'babel');

  args = function(arg) {
    var cmd, filepath;
    filepath = arg.filepath;
    cmd = "'" + coffee + "' -p '" + filepath + "'|'" + babel + "' --filename '" + bin + "'| node";
    return GrammarUtils.formatArgs(cmd);
  };

  exports.CoffeeScript = {
    'Selection Based': {
      command: command,
      args: function(context) {
        var code, filepath, lit, ref, scopeName;
        scopeName = (ref = atom.workspace.getActiveTextEditor()) != null ? ref.getGrammar().scopeName : void 0;
        lit = (scopeName != null ? scopeName.includes('lit') : void 0) ? 'lit' : '';
        code = context.getCode();
        filepath = GrammarUtils.createTempFileWithCode(code, "." + lit + "coffee");
        return args({
          filepath: filepath
        });
      }
    },
    'File Based': {
      command: command,
      args: args
    }
  };

  exports['CoffeeScript (Literate)'] = exports.CoffeeScript;

  exports.IcedCoffeeScript = {
    'Selection Based': {
      command: 'iced',
      args: function(context) {
        return ['-e', context.getCode()];
      }
    },
    'File Based': {
      command: 'iced',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvY29mZmVlc2NyaXB0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLFVBQVcsQ0FBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSLENBQWY7O0VBRVosR0FBQSxHQUFNLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixPQUFyQixFQUE4QixjQUE5QixFQUE4QyxNQUE5Qzs7RUFDTixNQUFBLEdBQVMsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLEVBQWUsUUFBZjs7RUFDVCxLQUFBLEdBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLEVBQWUsT0FBZjs7RUFFUixJQUFBLEdBQU8sU0FBQyxHQUFEO0FBQ0wsUUFBQTtJQURPLFdBQUQ7SUFDTixHQUFBLEdBQU0sR0FBQSxHQUFJLE1BQUosR0FBVyxRQUFYLEdBQW1CLFFBQW5CLEdBQTRCLEtBQTVCLEdBQWlDLEtBQWpDLEdBQXVDLGdCQUF2QyxHQUF1RCxHQUF2RCxHQUEyRDtBQUNqRSxXQUFPLFlBQVksQ0FBQyxVQUFiLENBQXdCLEdBQXhCO0VBRkY7O0VBSVAsT0FBTyxDQUFDLFlBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQW1CO01BQ2pCLFNBQUEsT0FEaUI7TUFFakIsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLFlBQUE7UUFBQyxzRUFBaUQsQ0FBRSxVQUF0QyxDQUFBO1FBQ2QsR0FBQSx3QkFBUyxTQUFTLENBQUUsUUFBWCxDQUFvQixLQUFwQixXQUFILEdBQWtDLEtBQWxDLEdBQTZDO1FBQ25ELElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1FBQ1AsUUFBQSxHQUFXLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQyxFQUEwQyxHQUFBLEdBQUksR0FBSixHQUFRLFFBQWxEO0FBQ1gsZUFBTyxJQUFBLENBQUs7VUFBQyxVQUFBLFFBQUQ7U0FBTDtNQUxILENBRlc7S0FBbkI7SUFTQSxZQUFBLEVBQWM7TUFBRSxTQUFBLE9BQUY7TUFBVyxNQUFBLElBQVg7S0FUZDs7O0VBV0YsT0FBUSxDQUFBLHlCQUFBLENBQVIsR0FBcUMsT0FBTyxDQUFDOztFQUU3QyxPQUFPLENBQUMsZ0JBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsTUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7ZUFBYSxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVA7TUFBYixDQUROO0tBREY7SUFJQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsTUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLFFBQUQ7TUFBaEIsQ0FETjtLQUxGOztBQTFCRiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xue2NvbW1hbmR9ID0gR3JhbW1hclV0aWxzID0gcmVxdWlyZSAnLi4vZ3JhbW1hci11dGlscydcblxuYmluID0gcGF0aC5qb2luIF9fZGlybmFtZSwgJy4uLy4uJywgJ25vZGVfbW9kdWxlcycsICcuYmluJ1xuY29mZmVlID0gcGF0aC5qb2luIGJpbiwgJ2NvZmZlZSdcbmJhYmVsID0gcGF0aC5qb2luIGJpbiwgJ2JhYmVsJ1xuXG5hcmdzID0gKHtmaWxlcGF0aH0pIC0+XG4gIGNtZCA9IFwiJyN7Y29mZmVlfScgLXAgJyN7ZmlsZXBhdGh9J3wnI3tiYWJlbH0nIC0tZmlsZW5hbWUgJyN7YmlufSd8IG5vZGVcIlxuICByZXR1cm4gR3JhbW1hclV0aWxzLmZvcm1hdEFyZ3MoY21kKVxuXG5leHBvcnRzLkNvZmZlZVNjcmlwdCA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOiB7XG4gICAgY29tbWFuZFxuICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAge3Njb3BlTmFtZX0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldEdyYW1tYXIoKVxuICAgICAgbGl0ID0gaWYgc2NvcGVOYW1lPy5pbmNsdWRlcyAnbGl0JyB0aGVuICdsaXQnIGVsc2UgJydcbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgZmlsZXBhdGggPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCBcIi4je2xpdH1jb2ZmZWVcIilcbiAgICAgIHJldHVybiBhcmdzKHtmaWxlcGF0aH0pXG4gIH1cbiAgJ0ZpbGUgQmFzZWQnOiB7IGNvbW1hbmQsIGFyZ3MgfVxuXG5leHBvcnRzWydDb2ZmZWVTY3JpcHQgKExpdGVyYXRlKSddID0gZXhwb3J0cy5Db2ZmZWVTY3JpcHRcblxuZXhwb3J0cy5JY2VkQ29mZmVlU2NyaXB0ID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2ljZWQnXG4gICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2ljZWQnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cbiJdfQ==
