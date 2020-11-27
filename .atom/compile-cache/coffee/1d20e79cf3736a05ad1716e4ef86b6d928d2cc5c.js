(function() {
  var GrammarUtils;

  GrammarUtils = require('../grammar-utils');

  module.exports = {
    'Behat Feature': {
      'File Based': {
        command: 'behat',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      },
      'Line Number Based': {
        command: 'behat',
        args: function(context) {
          return [context.fileColonLine()];
        }
      }
    },
    PHP: {
      'Selection Based': {
        command: 'php',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.PHP.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'php',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvcGhwLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUjs7RUFFZixNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsZUFBQSxFQUVFO01BQUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE9BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsUUFBRDtRQUFoQixDQUROO09BREY7TUFJQSxtQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE9BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsT0FBTyxDQUFDLGFBQVIsQ0FBQSxDQUFEO1FBQWIsQ0FETjtPQUxGO0tBRkY7SUFVQSxHQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLEtBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osY0FBQTtVQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1VBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxHQUFHLENBQUMsc0JBQWpCLENBQXdDLElBQXhDO0FBQ1YsaUJBQU8sQ0FBQyxPQUFEO1FBSEgsQ0FETjtPQURGO01BT0EsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLEtBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsUUFBRDtRQUFoQixDQUROO09BUkY7S0FYRjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIkdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICAnQmVoYXQgRmVhdHVyZSc6XG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnYmVoYXQnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gICAgJ0xpbmUgTnVtYmVyIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdiZWhhdCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbY29udGV4dC5maWxlQ29sb25MaW5lKCldXG5cbiAgUEhQOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3BocCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5QSFAuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICByZXR1cm4gW3RtcEZpbGVdXG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncGhwJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cbiJdfQ==
