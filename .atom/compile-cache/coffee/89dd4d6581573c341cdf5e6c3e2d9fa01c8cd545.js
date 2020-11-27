(function() {
  var GrammarUtils;

  GrammarUtils = require('../grammar-utils');

  exports['Bash Automated Test System (Bats)'] = {
    'Selection Based': {
      command: 'bats',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code);
        return [tmpFile];
      }
    },
    'File Based': {
      command: 'bats',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports.Bash = {
    'Selection Based': {
      command: process.env.SHELL,
      args: function(context) {
        return ['-c', context.getCode()];
      }
    },
    'File Based': {
      command: process.env.SHELL,
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports['Shell Script'] = exports.Bash;

  exports['Shell Script (Fish)'] = {
    'Selection Based': {
      command: 'fish',
      args: function(context) {
        return ['-c', context.getCode()];
      }
    },
    'File Based': {
      command: 'fish',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports.Tcl = {
    'Selection Based': {
      command: 'tclsh',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code);
        return [tmpFile];
      }
    },
    'File Based': {
      command: 'tclsh',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvc2hlbGwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSOztFQUVmLE9BQVEsQ0FBQSxtQ0FBQSxDQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osWUFBQTtRQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1FBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQztBQUNWLGVBQU8sQ0FBQyxPQUFEO01BSEgsQ0FETjtLQURGO0lBT0EsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxRQUFEO01BQWhCLENBRE47S0FSRjs7O0VBV0YsT0FBTyxDQUFDLElBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFyQjtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7ZUFBYSxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVA7TUFBYixDQUROO0tBREY7SUFJQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFyQjtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLFFBQUQ7TUFBaEIsQ0FETjtLQUxGOzs7RUFRRixPQUFRLENBQUEsY0FBQSxDQUFSLEdBQTBCLE9BQU8sQ0FBQzs7RUFFbEMsT0FBUSxDQUFBLHFCQUFBLENBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsTUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7ZUFBYSxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVA7TUFBYixDQUROO0tBREY7SUFJQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsTUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLFFBQUQ7TUFBaEIsQ0FETjtLQUxGOzs7RUFRRixPQUFPLENBQUMsR0FBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxPQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLFlBQUE7UUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtRQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEM7QUFDVixlQUFPLENBQUMsT0FBRDtNQUhILENBRE47S0FERjtJQU9BLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxPQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsUUFBRDtNQUFoQixDQUROO0tBUkY7O0FBbkNGIiwic291cmNlc0NvbnRlbnQiOlsiR3JhbW1hclV0aWxzID0gcmVxdWlyZSAnLi4vZ3JhbW1hci11dGlscydcblxuZXhwb3J0c1snQmFzaCBBdXRvbWF0ZWQgVGVzdCBTeXN0ZW0gKEJhdHMpJ10gPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnYmF0cydcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICByZXR1cm4gW3RtcEZpbGVdXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdiYXRzJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbmV4cG9ydHMuQmFzaCA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6IHByb2Nlc3MuZW52LlNIRUxMXG4gICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWMnLCBjb250ZXh0LmdldENvZGUoKV1cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogcHJvY2Vzcy5lbnYuU0hFTExcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG5leHBvcnRzWydTaGVsbCBTY3JpcHQnXSA9IGV4cG9ydHMuQmFzaFxuXG5leHBvcnRzWydTaGVsbCBTY3JpcHQgKEZpc2gpJ10gPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnZmlzaCdcbiAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnZmlzaCdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG5leHBvcnRzLlRjbCA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICd0Y2xzaCdcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICByZXR1cm4gW3RtcEZpbGVdXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICd0Y2xzaCdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuIl19
