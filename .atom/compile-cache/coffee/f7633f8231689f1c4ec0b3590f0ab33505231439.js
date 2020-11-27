(function() {
  var GrammarUtils;

  GrammarUtils = require('../grammar-utils');

  exports.Perl = {
    'Selection Based': {
      command: 'perl',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code);
        return [tmpFile];
      }
    },
    'File Based': {
      command: 'perl',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports['Perl 6'] = {
    'Selection Based': {
      command: 'perl6',
      args: function(context) {
        return ['-e', context.getCode()];
      }
    },
    'File Based': {
      command: 'perl6',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports['Perl 6 FE'] = exports['Perl 6'];

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvcGVybC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBRWYsT0FBTyxDQUFDLElBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsTUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixZQUFBO1FBQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUE7UUFDUCxPQUFBLEdBQVUsWUFBWSxDQUFDLHNCQUFiLENBQW9DLElBQXBDO0FBQ1YsZUFBTyxDQUFDLE9BQUQ7TUFISCxDQUROO0tBREY7SUFPQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsTUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLFFBQUQ7TUFBaEIsQ0FETjtLQVJGOzs7RUFXRixPQUFRLENBQUEsUUFBQSxDQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE9BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2VBQWEsQ0FBQyxJQUFELEVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQO01BQWIsQ0FETjtLQURGO0lBSUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE9BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxRQUFEO01BQWhCLENBRE47S0FMRjs7O0VBUUYsT0FBUSxDQUFBLFdBQUEsQ0FBUixHQUF1QixPQUFRLENBQUEsUUFBQTtBQXZCL0IiLCJzb3VyY2VzQ29udGVudCI6WyJHcmFtbWFyVXRpbHMgPSByZXF1aXJlICcuLi9ncmFtbWFyLXV0aWxzJ1xuXG5leHBvcnRzLlBlcmwgPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAncGVybCdcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICByZXR1cm4gW3RtcEZpbGVdXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdwZXJsJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbmV4cG9ydHNbJ1BlcmwgNiddID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3Blcmw2J1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdwZXJsNidcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG5leHBvcnRzWydQZXJsIDYgRkUnXSA9IGV4cG9ydHNbJ1BlcmwgNiddXG4iXX0=
