(function() {
  module.exports = {
    RSpec: {
      'Selection Based': {
        command: 'ruby',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'rspec',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['--tty', '--color', filepath];
        }
      },
      'Line Number Based': {
        command: 'rspec',
        args: function(context) {
          return ['--tty', '--color', context.fileColonLine()];
        }
      }
    },
    Ruby: {
      'Selection Based': {
        command: 'ruby',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'ruby',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    'Ruby on Rails': {
      'Selection Based': {
        command: 'rails',
        args: function(context) {
          return ['runner', context.getCode()];
        }
      },
      'File Based': {
        command: 'rails',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['runner', filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvcnVieS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsS0FBQSxFQUNFO01BQUEsaUJBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVA7UUFBYixDQUROO09BREY7TUFJQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxPQUFELEVBQVUsU0FBVixFQUFxQixRQUFyQjtRQUFoQixDQUROO09BTEY7TUFRQSxtQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE9BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsT0FBRCxFQUFVLFNBQVYsRUFBcUIsT0FBTyxDQUFDLGFBQVIsQ0FBQSxDQUFyQjtRQUFiLENBRE47T0FURjtLQURGO0lBYUEsSUFBQSxFQUNFO01BQUEsaUJBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVA7UUFBYixDQUROO09BREY7TUFJQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsTUFBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxRQUFEO1FBQWhCLENBRE47T0FMRjtLQWRGO0lBc0JBLGVBQUEsRUFFRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7aUJBQWEsQ0FBQyxRQUFELEVBQVcsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFYO1FBQWIsQ0FETjtPQURGO01BSUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE9BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsUUFBRCxFQUFXLFFBQVg7UUFBaEIsQ0FETjtPQUxGO0tBeEJGOztBQUZGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuXG4gIFJTcGVjOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3J1YnknXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3JzcGVjJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLS10dHknLCAnLS1jb2xvcicsIGZpbGVwYXRoXVxuXG4gICAgJ0xpbmUgTnVtYmVyIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdyc3BlYydcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy0tdHR5JywgJy0tY29sb3InLCBjb250ZXh0LmZpbGVDb2xvbkxpbmUoKV1cblxuICBSdWJ5OlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3J1YnknXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3J1YnknXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gICdSdWJ5IG9uIFJhaWxzJzpcblxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3JhaWxzJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsncnVubmVyJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncmFpbHMnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWydydW5uZXInLCBmaWxlcGF0aF1cbiJdfQ==
