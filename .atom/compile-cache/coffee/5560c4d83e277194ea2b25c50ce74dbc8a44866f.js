(function() {
  var message;

  message = "SQL requires setting 'Script: Run Options' directly. See https://github.com/rgbkrk/atom-script/tree/master/examples/hello.sql for further information.";

  module.exports = {
    'mongoDB (JavaScript)': {
      'Selection Based': {
        command: 'mongo',
        args: function(context) {
          return ['--eval', context.getCode()];
        }
      },
      'File Based': {
        command: 'mongo',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    SQL: {
      'Selection Based': {
        command: 'echo',
        args: function() {
          return [message];
        }
      },
      'File Based': {
        command: 'echo',
        args: function() {
          return [message];
        }
      }
    },
    'SQL (PostgreSQL)': {
      'Selection Based': {
        command: 'psql',
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      'File Based': {
        command: 'psql',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-f', filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvZGF0YWJhc2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVU7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLHNCQUFBLEVBRUU7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE9BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsUUFBRCxFQUFXLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBWDtRQUFiLENBRE47T0FERjtNQUlBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBVSxPQUFWO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLFFBQUQ7UUFBaEIsQ0FETjtPQUxGO0tBRkY7SUFVQSxHQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE1BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQTtpQkFBRyxDQUFDLE9BQUQ7UUFBSCxDQUROO09BREY7TUFJQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsTUFBVDtRQUNBLElBQUEsRUFBTSxTQUFBO2lCQUFHLENBQUMsT0FBRDtRQUFILENBRE47T0FMRjtLQVhGO0lBbUJBLGtCQUFBLEVBRUU7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE1BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUDtRQUFiLENBRE47T0FERjtNQUlBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLElBQUQsRUFBTyxRQUFQO1FBQWhCLENBRE47T0FMRjtLQXJCRjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIm1lc3NhZ2UgPSBcIlNRTCByZXF1aXJlcyBzZXR0aW5nICdTY3JpcHQ6IFJ1biBPcHRpb25zJyBkaXJlY3RseS4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZ2JrcmsvYXRvbS1zY3JpcHQvdHJlZS9tYXN0ZXIvZXhhbXBsZXMvaGVsbG8uc3FsIGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLlwiXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICAnbW9uZ29EQiAoSmF2YVNjcmlwdCknOlxuXG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnbW9uZ28nXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctLWV2YWwnLCBjb250ZXh0LmdldENvZGUoKV1cblxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICAnbW9uZ28nXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIFNRTDpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdlY2hvJ1xuICAgICAgYXJnczogLT4gW21lc3NhZ2VdXG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnZWNobydcbiAgICAgIGFyZ3M6IC0+IFttZXNzYWdlXVxuXG4gICdTUUwgKFBvc3RncmVTUUwpJzpcblxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3BzcWwnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3BzcWwnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctZicsIGZpbGVwYXRoXVxuIl19
