(function() {
  var GrammarUtils;

  GrammarUtils = require('../grammar-utils');

  exports.AutoHotKey = {
    'Selection Based': {
      command: 'AutoHotKey',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code);
        return [tmpFile];
      }
    },
    'File Based': {
      command: 'AutoHotKey',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports.Batch = {
    'File Based': {
      command: 'cmd.exe',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['/q', '/c', filepath];
      }
    }
  };

  exports['Batch File'] = exports.Batch;

  exports.PowerShell = {
    'Selection Based': {
      command: 'powershell',
      args: function(context) {
        return [context.getCode()];
      }
    },
    'File Based': {
      command: 'powershell',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath.replace(/\ /g, '` ')];
      }
    }
  };

  exports.VBScript = {
    'Selection Based': {
      command: 'cscript',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.vbs');
        return ['//NOLOGO', tmpFile];
      }
    },
    'File Based': {
      command: 'cscript',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['//NOLOGO', filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvd2luZG93cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBSWYsT0FBTyxDQUFDLFVBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsWUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixZQUFBO1FBQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUE7UUFDUCxPQUFBLEdBQVUsWUFBWSxDQUFDLHNCQUFiLENBQW9DLElBQXBDO0FBQ1YsZUFBTyxDQUFDLE9BQUQ7TUFISCxDQUROO0tBREY7SUFPQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsWUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLFFBQUQ7TUFBaEIsQ0FETjtLQVJGOzs7RUFXRixPQUFPLENBQUMsS0FBUixHQUNFO0lBQUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFNBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLFFBQWI7TUFBaEIsQ0FETjtLQURGOzs7RUFJRixPQUFRLENBQUEsWUFBQSxDQUFSLEdBQXdCLE9BQU8sQ0FBQzs7RUFFaEMsT0FBTyxDQUFDLFVBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsWUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7ZUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBRDtNQUFiLENBRE47S0FERjtJQUlBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxZQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0IsSUFBeEIsQ0FBRDtNQUFoQixDQUROO0tBTEY7OztFQVFGLE9BQU8sQ0FBQyxRQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFNBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osWUFBQTtRQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1FBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQyxFQUEwQyxNQUExQztBQUNWLGVBQU8sQ0FBQyxVQUFELEVBQWEsT0FBYjtNQUhILENBRE47S0FERjtJQU9BLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxTQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsVUFBRCxFQUFhLFFBQWI7TUFBaEIsQ0FETjtLQVJGOztBQWpDRiIsInNvdXJjZXNDb250ZW50IjpbIkdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbiNpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpXG5cbmV4cG9ydHMuQXV0b0hvdEtleSA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdBdXRvSG90S2V5J1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgIHJldHVybiBbdG1wRmlsZV1cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ0F1dG9Ib3RLZXknXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuZXhwb3J0cy5CYXRjaCA9XG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnY21kLmV4ZSdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWycvcScsICcvYycsIGZpbGVwYXRoXVxuXG5leHBvcnRzWydCYXRjaCBGaWxlJ10gPSBleHBvcnRzLkJhdGNoXG5cbmV4cG9ydHMuUG93ZXJTaGVsbCA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdwb3dlcnNoZWxsJ1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5nZXRDb2RlKCldXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdwb3dlcnNoZWxsJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGgucmVwbGFjZSAvXFwgL2csICdgICddXG5cbmV4cG9ydHMuVkJTY3JpcHQgPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnY3NjcmlwdCdcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcudmJzJylcbiAgICAgIHJldHVybiBbJy8vTk9MT0dPJywgdG1wRmlsZV1cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2NzY3JpcHQnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLy9OT0xPR08nLCBmaWxlcGF0aF1cbiJdfQ==
