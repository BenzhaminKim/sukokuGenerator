
/**
 * PHP import use statement
 */

(function() {
  module.exports = {

    /**
     * Import use statement for class under cursor
     * @param {TextEditor} editor
     */
    importUseStatement: function(editor) {
      var ClassListView, ClassProvider, provider, regex, suggestions, word;
      ClassProvider = require('../autocompletion/class-provider.coffee');
      provider = new ClassProvider();
      word = editor.getWordUnderCursor();
      regex = new RegExp('\\\\' + word + '$');
      suggestions = provider.fetchSuggestionsFromWord(word);
      if (!suggestions) {
        return;
      }
      suggestions = suggestions.filter(function(suggestion) {
        return suggestion.text === word || regex.test(suggestion.text);
      });
      if (!suggestions.length) {
        return;
      }
      if (suggestions.length < 2) {
        return provider.onSelectedClassSuggestion({
          editor: editor,
          suggestion: suggestions.shift()
        });
      }
      ClassListView = require('../views/class-list-view');
      return new ClassListView(suggestions, function(arg) {
        var name, suggestion;
        name = arg.name;
        suggestion = suggestions.filter(function(suggestion) {
          return suggestion.text === name;
        }).shift();
        return provider.onSelectedClassSuggestion({
          editor: editor,
          suggestion: suggestion
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F0b20tYXV0b2NvbXBsZXRlLXBocC9saWIvc2VydmljZXMvdXNlLXN0YXRlbWVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQSxNQUFNLENBQUMsT0FBUCxHQUVJOztBQUFBOzs7O0lBSUEsa0JBQUEsRUFBb0IsU0FBQyxNQUFEO0FBQ2hCLFVBQUE7TUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSx5Q0FBUjtNQUNoQixRQUFBLEdBQVcsSUFBSSxhQUFKLENBQUE7TUFDWCxJQUFBLEdBQU8sTUFBTSxDQUFDLGtCQUFQLENBQUE7TUFDUCxLQUFBLEdBQVEsSUFBSSxNQUFKLENBQVcsTUFBQSxHQUFTLElBQVQsR0FBZ0IsR0FBM0I7TUFFUixXQUFBLEdBQWMsUUFBUSxDQUFDLHdCQUFULENBQWtDLElBQWxDO01BQ2QsSUFBQSxDQUFjLFdBQWQ7QUFBQSxlQUFBOztNQUVBLFdBQUEsR0FBYyxXQUFXLENBQUMsTUFBWixDQUFtQixTQUFDLFVBQUQ7QUFDN0IsZUFBTyxVQUFVLENBQUMsSUFBWCxLQUFtQixJQUFuQixJQUEyQixLQUFLLENBQUMsSUFBTixDQUFXLFVBQVUsQ0FBQyxJQUF0QjtNQURMLENBQW5CO01BSWQsSUFBQSxDQUFjLFdBQVcsQ0FBQyxNQUExQjtBQUFBLGVBQUE7O01BRUEsSUFBRyxXQUFXLENBQUMsTUFBWixHQUFxQixDQUF4QjtBQUNJLGVBQU8sUUFBUSxDQUFDLHlCQUFULENBQW1DO1VBQUMsUUFBQSxNQUFEO1VBQVMsVUFBQSxFQUFZLFdBQVcsQ0FBQyxLQUFaLENBQUEsQ0FBckI7U0FBbkMsRUFEWDs7TUFHQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSwwQkFBUjtBQUVoQixhQUFPLElBQUksYUFBSixDQUFrQixXQUFsQixFQUErQixTQUFDLEdBQUQ7QUFDbEMsWUFBQTtRQURvQyxPQUFEO1FBQ25DLFVBQUEsR0FBYSxXQUFXLENBQUMsTUFBWixDQUFtQixTQUFDLFVBQUQ7QUFDNUIsaUJBQU8sVUFBVSxDQUFDLElBQVgsS0FBbUI7UUFERSxDQUFuQixDQUVaLENBQUMsS0FGVyxDQUFBO2VBR2IsUUFBUSxDQUFDLHlCQUFULENBQW1DO1VBQUMsUUFBQSxNQUFEO1VBQVMsWUFBQSxVQUFUO1NBQW5DO01BSmtDLENBQS9CO0lBcEJTLENBSnBCOztBQU5KIiwic291cmNlc0NvbnRlbnQiOlsiIyMjKlxuICogUEhQIGltcG9ydCB1c2Ugc3RhdGVtZW50XG4jIyNcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gICAgIyMjKlxuICAgICAqIEltcG9ydCB1c2Ugc3RhdGVtZW50IGZvciBjbGFzcyB1bmRlciBjdXJzb3JcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvclxuICAgICMjI1xuICAgIGltcG9ydFVzZVN0YXRlbWVudDogKGVkaXRvcikgLT5cbiAgICAgICAgQ2xhc3NQcm92aWRlciA9IHJlcXVpcmUgJy4uL2F1dG9jb21wbGV0aW9uL2NsYXNzLXByb3ZpZGVyLmNvZmZlZSdcbiAgICAgICAgcHJvdmlkZXIgPSBuZXcgQ2xhc3NQcm92aWRlcigpXG4gICAgICAgIHdvcmQgPSBlZGl0b3IuZ2V0V29yZFVuZGVyQ3Vyc29yKClcbiAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcXFxcXCcgKyB3b3JkICsgJyQnKTtcblxuICAgICAgICBzdWdnZXN0aW9ucyA9IHByb3ZpZGVyLmZldGNoU3VnZ2VzdGlvbnNGcm9tV29yZCh3b3JkKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHN1Z2dlc3Rpb25zXG5cbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9ucy5maWx0ZXIoKHN1Z2dlc3Rpb24pIC0+XG4gICAgICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbi50ZXh0ID09IHdvcmQgfHwgcmVnZXgudGVzdChzdWdnZXN0aW9uLnRleHQpXG4gICAgICAgIClcblxuICAgICAgICByZXR1cm4gdW5sZXNzIHN1Z2dlc3Rpb25zLmxlbmd0aFxuXG4gICAgICAgIGlmIHN1Z2dlc3Rpb25zLmxlbmd0aCA8IDJcbiAgICAgICAgICAgIHJldHVybiBwcm92aWRlci5vblNlbGVjdGVkQ2xhc3NTdWdnZXN0aW9uIHtlZGl0b3IsIHN1Z2dlc3Rpb246IHN1Z2dlc3Rpb25zLnNoaWZ0KCl9XG5cbiAgICAgICAgQ2xhc3NMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL2NsYXNzLWxpc3QtdmlldydcblxuICAgICAgICByZXR1cm4gbmV3IENsYXNzTGlzdFZpZXcoc3VnZ2VzdGlvbnMsICh7bmFtZX0pIC0+XG4gICAgICAgICAgICBzdWdnZXN0aW9uID0gc3VnZ2VzdGlvbnMuZmlsdGVyKChzdWdnZXN0aW9uKSAtPlxuICAgICAgICAgICAgICAgIHJldHVybiBzdWdnZXN0aW9uLnRleHQgPT0gbmFtZVxuICAgICAgICAgICAgKS5zaGlmdCgpXG4gICAgICAgICAgICBwcm92aWRlci5vblNlbGVjdGVkQ2xhc3NTdWdnZXN0aW9uIHtlZGl0b3IsIHN1Z2dlc3Rpb259XG4gICAgICAgIClcbiJdfQ==
