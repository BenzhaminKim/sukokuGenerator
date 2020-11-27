(function() {
  var GrammarUtils, base, ref, ref1, ref2, shell;

  shell = require('electron').shell;

  GrammarUtils = require('../grammar-utils');

  exports.DOT = {
    'Selection Based': {
      command: 'dot',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.dot');
        return ['-Tpng', tmpFile, '-o', tmpFile + '.png'];
      }
    },
    'File Based': {
      command: 'dot',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-Tpng', filepath, '-o', filepath + '.png'];
      }
    }
  };

  exports.gnuplot = {
    'File Based': {
      command: 'gnuplot',
      workingDirectory: (ref = atom.workspace.getActivePaneItem()) != null ? (ref1 = ref.buffer) != null ? (ref2 = ref1.file) != null ? typeof ref2.getParent === "function" ? typeof (base = ref2.getParent()).getPath === "function" ? base.getPath() : void 0 : void 0 : void 0 : void 0 : void 0,
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-p', filepath];
      }
    }
  };

  exports['Graphviz (DOT)'] = {
    'Selection Based': {
      command: 'dot',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.dot');
        return ['-Tpng', tmpFile, '-o', tmpFile + '.png'];
      }
    },
    'File Based': {
      command: 'dot',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-Tpng', filepath, '-o', filepath + '.png'];
      }
    }
  };

  exports.HTML = {
    'File Based': {
      command: 'echo',
      args: function(arg) {
        var filepath, uri;
        filepath = arg.filepath;
        uri = 'file://' + filepath;
        shell.openExternal(uri);
        return ['HTML file opened at:', uri];
      }
    }
  };

  exports.LaTeX = {
    'File Based': {
      command: 'latexmk',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-cd', '-quiet', '-pdf', '-pv', '-shell-escape', filepath];
      }
    }
  };

  exports['LaTeX Beamer'] = exports.LaTeX;

  exports['Pandoc Markdown'] = {
    'File Based': {
      command: 'panzer',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath, "--output='" + filepath + ".pdf'"];
      }
    }
  };

  exports.Sass = {
    'File Based': {
      command: 'sass',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports.SCSS = exports.Sass;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvZG9jLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsUUFBUyxPQUFBLENBQVEsVUFBUjs7RUFDVixZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSOztFQUVmLE9BQU8sQ0FBQyxHQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLEtBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osWUFBQTtRQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1FBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQyxFQUEwQyxNQUExQztlQUNWLENBQUMsT0FBRCxFQUFVLE9BQVYsRUFBbUIsSUFBbkIsRUFBeUIsT0FBQSxHQUFVLE1BQW5DO01BSEksQ0FETjtLQURGO0lBT0EsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLEtBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixJQUFwQixFQUEwQixRQUFBLEdBQVcsTUFBckM7TUFBaEIsQ0FETjtLQVJGOzs7RUFXRixPQUFPLENBQUMsT0FBUixHQUNFO0lBQUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFNBQVQ7TUFDQSxnQkFBQSx1TkFBZ0YsQ0FBQyxzREFEakY7TUFFQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxJQUFELEVBQU8sUUFBUDtNQUFoQixDQUZOO0tBREY7OztFQUtGLE9BQVEsQ0FBQSxnQkFBQSxDQUFSLEdBRUU7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLEtBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osWUFBQTtRQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1FBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQyxFQUEwQyxNQUExQztBQUNWLGVBQU8sQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixJQUFuQixFQUF5QixPQUFBLEdBQVUsTUFBbkM7TUFISCxDQUROO0tBREY7SUFPQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsS0FBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLE9BQUQsRUFBVSxRQUFWLEVBQW9CLElBQXBCLEVBQTBCLFFBQUEsR0FBVyxNQUFyQztNQUFoQixDQUROO0tBUkY7OztFQVdGLE9BQU8sQ0FBQyxJQUFSLEdBQ0U7SUFBQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsTUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFDSixZQUFBO1FBRE0sV0FBRDtRQUNMLEdBQUEsR0FBTSxTQUFBLEdBQVk7UUFDbEIsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsR0FBbkI7QUFDQSxlQUFPLENBQUMsc0JBQUQsRUFBeUIsR0FBekI7TUFISCxDQUROO0tBREY7OztFQU9GLE9BQU8sQ0FBQyxLQUFSLEdBQ0U7SUFBQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsU0FBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLE1BQWxCLEVBQTBCLEtBQTFCLEVBQWlDLGVBQWpDLEVBQWtELFFBQWxEO01BQWhCLENBRE47S0FERjs7O0VBSUYsT0FBUSxDQUFBLGNBQUEsQ0FBUixHQUEwQixPQUFPLENBQUM7O0VBRWxDLE9BQVEsQ0FBQSxpQkFBQSxDQUFSLEdBQ0U7SUFBQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsUUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLFFBQUQsRUFBVyxZQUFBLEdBQWEsUUFBYixHQUFzQixPQUFqQztNQUFoQixDQUROO0tBREY7OztFQUlGLE9BQU8sQ0FBQyxJQUFSLEdBQ0U7SUFBQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsTUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLFFBQUQ7TUFBaEIsQ0FETjtLQURGOzs7RUFJRixPQUFPLENBQUMsSUFBUixHQUFlLE9BQU8sQ0FBQztBQTNEdkIiLCJzb3VyY2VzQ29udGVudCI6WyJ7c2hlbGx9ID0gcmVxdWlyZSAnZWxlY3Ryb24nXG5HcmFtbWFyVXRpbHMgPSByZXF1aXJlICcuLi9ncmFtbWFyLXV0aWxzJ1xuXG5leHBvcnRzLkRPVCA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdkb3QnXG4gICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCAnLmRvdCcpXG4gICAgICBbJy1UcG5nJywgdG1wRmlsZSwgJy1vJywgdG1wRmlsZSArICcucG5nJ11cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2RvdCdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctVHBuZycsIGZpbGVwYXRoLCAnLW8nLCBmaWxlcGF0aCArICcucG5nJ11cblxuZXhwb3J0cy5nbnVwbG90ID1cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdnbnVwbG90J1xuICAgIHdvcmtpbmdEaXJlY3Rvcnk6IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk/LmJ1ZmZlcj8uZmlsZT8uZ2V0UGFyZW50PygpLmdldFBhdGg/KClcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctcCcsIGZpbGVwYXRoXVxuXG5leHBvcnRzWydHcmFwaHZpeiAoRE9UKSddID1cblxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnZG90J1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy5kb3QnKVxuICAgICAgcmV0dXJuIFsnLVRwbmcnLCB0bXBGaWxlLCAnLW8nLCB0bXBGaWxlICsgJy5wbmcnXVxuXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnZG90J1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1UcG5nJywgZmlsZXBhdGgsICctbycsIGZpbGVwYXRoICsgJy5wbmcnXVxuXG5leHBvcnRzLkhUTUwgPVxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2VjaG8nXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+XG4gICAgICB1cmkgPSAnZmlsZTovLycgKyBmaWxlcGF0aFxuICAgICAgc2hlbGwub3BlbkV4dGVybmFsKHVyaSlcbiAgICAgIHJldHVybiBbJ0hUTUwgZmlsZSBvcGVuZWQgYXQ6JywgdXJpXVxuXG5leHBvcnRzLkxhVGVYID1cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdsYXRleG1rJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1jZCcsICctcXVpZXQnLCAnLXBkZicsICctcHYnLCAnLXNoZWxsLWVzY2FwZScsIGZpbGVwYXRoXVxuXG5leHBvcnRzWydMYVRlWCBCZWFtZXInXSA9IGV4cG9ydHMuTGFUZVhcblxuZXhwb3J0c1snUGFuZG9jIE1hcmtkb3duJ10gPVxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3BhbnplcidcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoLCBcIi0tb3V0cHV0PScje2ZpbGVwYXRofS5wZGYnXCJdXG5cbmV4cG9ydHMuU2FzcyA9XG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnc2FzcydcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG5leHBvcnRzLlNDU1MgPSBleHBvcnRzLlNhc3NcbiJdfQ==
