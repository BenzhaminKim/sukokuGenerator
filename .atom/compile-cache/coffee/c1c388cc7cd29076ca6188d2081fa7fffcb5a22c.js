(function() {
  exports.Python = {
    'Selection Based': {
      command: 'python',
      args: function(context) {
        return ['-u', '-c', context.getCode()];
      }
    },
    'File Based': {
      command: 'python',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-u', filepath];
      }
    }
  };

  exports.MagicPython = exports.Python;

  exports.Sage = {
    'Selection Based': {
      command: 'sage',
      args: function(context) {
        return ['-c', context.getCode()];
      }
    },
    'File Based': {
      command: 'sage',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvcHl0aG9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE9BQU8sQ0FBQyxNQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFFBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2VBQWEsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBYjtNQUFiLENBRE47S0FERjtJQUlBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxRQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsSUFBRCxFQUFPLFFBQVA7TUFBaEIsQ0FETjtLQUxGOzs7RUFRRixPQUFPLENBQUMsV0FBUixHQUFzQixPQUFPLENBQUM7O0VBRTlCLE9BQU8sQ0FBQyxJQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2VBQWEsQ0FBQyxJQUFELEVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQO01BQWIsQ0FETjtLQURGO0lBSUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxRQUFEO01BQWhCLENBRE47S0FMRjs7QUFaRiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMuUHl0aG9uID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3B5dGhvbidcbiAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctdScsICctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAncHl0aG9uJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy11JywgZmlsZXBhdGhdXG5cbmV4cG9ydHMuTWFnaWNQeXRob24gPSBleHBvcnRzLlB5dGhvblxuXG5leHBvcnRzLlNhZ2UgPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnc2FnZSdcbiAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnc2FnZSdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuIl19
