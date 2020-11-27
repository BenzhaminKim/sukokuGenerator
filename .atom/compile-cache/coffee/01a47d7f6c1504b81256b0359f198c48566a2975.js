(function() {
  var GrammarUtils, _;

  _ = require('underscore');

  GrammarUtils = require('../grammar-utils');

  module.exports = {
    'Common Lisp': {
      'File Based': {
        command: 'clisp',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Lisp: {
      'Selection Based': {
        command: 'sbcl',
        args: function(context) {
          var statements;
          statements = _.flatten(_.map(GrammarUtils.Lisp.splitStatements(context.getCode()), function(statement) {
            return ['--eval', statement];
          }));
          return _.union(['--noinform', '--disable-debugger', '--non-interactive', '--quit'], statements);
        }
      },
      'File Based': {
        command: 'sbcl',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['--noinform', '--script', filepath];
        }
      }
    },
    newLISP: {
      'Selection Based': {
        command: 'newlisp',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'newlisp',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Scheme: {
      'Selection Based': {
        command: 'guile',
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      'File Based': {
        command: 'guile',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvbGlzcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUjs7RUFDSixZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSOztFQUVmLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxhQUFBLEVBQ0U7TUFBQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxRQUFEO1FBQWhCLENBRE47T0FERjtLQURGO0lBS0EsSUFBQSxFQUNFO01BQUEsaUJBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLGNBQUE7VUFBQSxVQUFBLEdBQWEsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxDQUFDLENBQUMsR0FBRixDQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBbEIsQ0FBa0MsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFsQyxDQUFOLEVBQTRELFNBQUMsU0FBRDttQkFBZSxDQUFDLFFBQUQsRUFBVyxTQUFYO1VBQWYsQ0FBNUQsQ0FBVjtBQUNiLGlCQUFPLENBQUMsQ0FBQyxLQUFGLENBQVEsQ0FBQyxZQUFELEVBQWUsb0JBQWYsRUFBcUMsbUJBQXJDLEVBQTBELFFBQTFELENBQVIsRUFBNkUsVUFBN0U7UUFGSCxDQUROO09BREY7TUFNQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsTUFBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxZQUFELEVBQWUsVUFBZixFQUEyQixRQUEzQjtRQUFoQixDQUROO09BUEY7S0FORjtJQWdCQSxPQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLFNBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUDtRQUFiLENBRE47T0FERjtNQUdBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxTQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLFFBQUQ7UUFBaEIsQ0FETjtPQUpGO0tBakJGO0lBd0JBLE1BQUEsRUFDRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7aUJBQWEsQ0FBQyxJQUFELEVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQO1FBQWIsQ0FETjtPQURGO01BR0EsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE9BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsUUFBRDtRQUFoQixDQUROO09BSkY7S0F6QkY7O0FBTEYiLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSAndW5kZXJzY29yZSdcbkdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICAnQ29tbW9uIExpc3AnOlxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdjbGlzcCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgTGlzcDpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdzYmNsJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIHN0YXRlbWVudHMgPSBfLmZsYXR0ZW4oXy5tYXAoR3JhbW1hclV0aWxzLkxpc3Auc3BsaXRTdGF0ZW1lbnRzKGNvbnRleHQuZ2V0Q29kZSgpKSwgKHN0YXRlbWVudCkgLT4gWyctLWV2YWwnLCBzdGF0ZW1lbnRdKSlcbiAgICAgICAgcmV0dXJuIF8udW5pb24gWyctLW5vaW5mb3JtJywgJy0tZGlzYWJsZS1kZWJ1Z2dlcicsICctLW5vbi1pbnRlcmFjdGl2ZScsICctLXF1aXQnXSwgc3RhdGVtZW50c1xuXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3NiY2wnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctLW5vaW5mb3JtJywgJy0tc2NyaXB0JywgZmlsZXBhdGhdXG5cbiAgbmV3TElTUDpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICduZXdsaXNwJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnbmV3bGlzcCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgU2NoZW1lOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2d1aWxlJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWMnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnZ3VpbGUnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuIl19
