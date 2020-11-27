(function() {
  module.exports = {
    AppleScript: {
      'Selection Based': {
        command: 'osascript',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'osascript',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Swift: {
      'File Based': {
        command: 'swift',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvYXBwbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLFdBQUEsRUFDRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsV0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7aUJBQWEsQ0FBQyxJQUFELEVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQO1FBQWIsQ0FETjtPQURGO01BSUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLFdBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsUUFBRDtRQUFoQixDQUROO09BTEY7S0FERjtJQVNBLEtBQUEsRUFDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLFFBQUQ7UUFBaEIsQ0FETjtPQURGO0tBVkY7O0FBRkYiLCJzb3VyY2VzQ29udGVudCI6WyIje09wZXJhdGluZ1N5c3RlbX0gPSByZXF1aXJlICcuLi9ncmFtbWFyLXV0aWxzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9ICNpZiBPcGVyYXRpbmdTeXN0ZW0uaXNEYXJ3aW4oKVxuXG4gIEFwcGxlU2NyaXB0OlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ29zYXNjcmlwdCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnb3Nhc2NyaXB0J1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBTd2lmdDpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnc3dpZnQnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuIl19
