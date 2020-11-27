(function() {
  var CSON, filter;

  CSON = require('season');

  filter = require('fuzzaldrin').filter;

  module.exports = {
    selector: '.text.html.basic, .source.gfm',
    getSuggestions: function(arg) {
      var bufferPosition, editor, prefix;
      editor = arg.editor, bufferPosition = arg.bufferPosition;
      prefix = this.getPrefix(editor, bufferPosition);
      if (!(prefix.length > 0)) {
        return [];
      }
      return new Promise((function(_this) {
        return function(resolve) {
          return resolve(_this.buildSuggestions(prefix));
        };
      })(this));
    },
    loadCompletions: function() {
      var path;
      this.completions = [];
      path = CSON.resolve(__dirname + "/../data/completions");
      return CSON.readFile(path, (function(_this) {
        return function(error, object) {
          var completions, description, entity;
          if (error != null) {
            return;
          }
          completions = object.completions;
          return _this.completions = (function() {
            var results;
            results = [];
            for (description in completions) {
              entity = completions[description];
              results.push({
                text: entity,
                rightLabelHTML: entity,
                description: description,
                type: 'constant'
              });
            }
            return results;
          })();
        };
      })(this));
    },
    buildSuggestions: function(prefix) {
      var completion, i, len, ref, suggestions;
      suggestions = [];
      ref = this.completions;
      for (i = 0, len = ref.length; i < len; i++) {
        completion = ref[i];
        completion.replacementPrefix = prefix;
        suggestions.push(completion);
      }
      return filter(suggestions, prefix, {
        key: 'text'
      });
    },
    getPrefix: function(editor, bufferPosition) {
      var line, ref;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((ref = line.match(/&[A-Za-z0-9]+$/)) != null ? ref[0] : void 0) || '';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1odG1sLWVudGl0aWVzL2xpYi9wcm92aWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7RUFDTixTQUFVLE9BQUEsQ0FBUSxZQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsK0JBQVY7SUFhQSxjQUFBLEVBQWdCLFNBQUMsR0FBRDtBQUNkLFVBQUE7TUFEZ0IscUJBQVE7TUFDeEIsTUFBQSxHQUFTLElBQUMsQ0FBQSxTQUFELENBQVcsTUFBWCxFQUFtQixjQUFuQjtNQUNULElBQUEsQ0FBQSxDQUFpQixNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFqQyxDQUFBO0FBQUEsZUFBTyxHQUFQOzthQUVBLElBQUksT0FBSixDQUFZLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO2lCQUNWLE9BQUEsQ0FBUSxLQUFDLENBQUEsZ0JBQUQsQ0FBa0IsTUFBbEIsQ0FBUjtRQURVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0lBSmMsQ0FiaEI7SUFxQkEsZUFBQSxFQUFpQixTQUFBO0FBQ2YsVUFBQTtNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBZ0IsU0FBRCxHQUFXLHNCQUExQjthQUNQLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZCxFQUFvQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLE1BQVI7QUFDbEIsY0FBQTtVQUFBLElBQVUsYUFBVjtBQUFBLG1CQUFBOztVQUVDLGNBQWU7aUJBQ2hCLEtBQUMsQ0FBQSxXQUFEOztBQUFlO2lCQUFBLDBCQUFBOzsyQkFDYjtnQkFDRSxJQUFBLEVBQU0sTUFEUjtnQkFFRSxjQUFBLEVBQWdCLE1BRmxCO2dCQUdFLFdBQUEsRUFBYSxXQUhmO2dCQUlFLElBQUEsRUFBTSxVQUpSOztBQURhOzs7UUFKRztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEI7SUFIZSxDQXJCakI7SUEyQ0EsZ0JBQUEsRUFBa0IsU0FBQyxNQUFEO0FBQ2hCLFVBQUE7TUFBQSxXQUFBLEdBQWM7QUFDZDtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsVUFBVSxDQUFDLGlCQUFYLEdBQStCO1FBQy9CLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFVBQWpCO0FBRkY7YUFJQSxNQUFBLENBQU8sV0FBUCxFQUFvQixNQUFwQixFQUE0QjtRQUFBLEdBQUEsRUFBSyxNQUFMO09BQTVCO0lBTmdCLENBM0NsQjtJQXlEQSxTQUFBLEVBQVcsU0FBQyxNQUFELEVBQVMsY0FBVDtBQUNULFVBQUE7TUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLGNBQVAsQ0FBc0IsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFoQixFQUFxQixDQUFyQixDQUFELEVBQTBCLGNBQTFCLENBQXRCO2dFQUV1QixDQUFBLENBQUEsV0FBOUIsSUFBb0M7SUFIM0IsQ0F6RFg7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJDU09OID0gcmVxdWlyZSAnc2Vhc29uJ1xue2ZpbHRlcn0gPSByZXF1aXJlICdmdXp6YWxkcmluJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHNlbGVjdG9yOiAnLnRleHQuaHRtbC5iYXNpYywgLnNvdXJjZS5nZm0nXG5cbiAgIyBQdWJsaWM6IEdldHMgdGhlIGN1cnJlbnQgc2V0IG9mIHN1Z2dlc3Rpb25zLlxuICAjXG4gICMgKiBgcmVxdWVzdGAgUmVsZXZhbnQgZWRpdG9yIHN0YXRlIHRvIGluZm9ybSB0aGUgbGlzdCBvZiBzdWdnZXN0aW9ucyByZXR1cm5lZC4gSXQgY29uc2lzdHMgb2Y6XG4gICMgICAqIGBlZGl0b3JgIHtUZXh0RWRpdG9yfSB0aGUgc3VnZ2VzdGlvbnMgYXJlIGJlaW5nIHJlcXVlc3RlZCBmb3IuXG4gICMgICAqIGBidWZmZXJQb3NpdGlvbmAgUG9zaXRpb24ge1BvaW50fSBvZiB0aGUgY3Vyc29yIGluIHRoZSBmaWxlLlxuICAjICAgKiBgc2NvcGVEZXNjcmlwdG9yYCBUaGUgW3Njb3BlIGRlc2NyaXB0b3JdKGh0dHBzOi8vYXRvbS5pby9kb2NzL2xhdGVzdC9iZWhpbmQtYXRvbS1zY29wZWQtc2V0dGluZ3Mtc2NvcGVzLWFuZC1zY29wZS1kZXNjcmlwdG9ycyNzY29wZS1kZXNjcmlwdG9ycylcbiAgIyAgICAgZm9yIHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvbi5cbiAgIyAgICogYHByZWZpeGAgUHJlZml4IHRoYXQgdHJpZ2dlcmVkIHRoZSByZXF1ZXN0IGZvciBzdWdnZXN0aW9ucy5cbiAgI1xuICAjIFJldHVybnMgYSB7UHJvbWlzZX0gdGhhdCByZXNvbHZlcyB0byB0aGUgbGlzdCBvZiBzdWdnZXN0aW9ucyBvciByZXR1cm5zIGFuIGVtcHR5IGxpc3RcbiAgIyBpbW1lZGlhdGVseS5cbiAgZ2V0U3VnZ2VzdGlvbnM6ICh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbn0pIC0+XG4gICAgcHJlZml4ID0gQGdldFByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgIHJldHVybiBbXSB1bmxlc3MgcHJlZml4Lmxlbmd0aCA+IDBcblxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgcmVzb2x2ZShAYnVpbGRTdWdnZXN0aW9ucyhwcmVmaXgpKVxuXG4gICMgUHVibGljOiBMb2FkcyB0aGUgZnVsbCBzZXQgb2YgY29tcGxldGlvbnMuXG4gIGxvYWRDb21wbGV0aW9uczogLT5cbiAgICBAY29tcGxldGlvbnMgPSBbXVxuICAgIHBhdGggPSBDU09OLnJlc29sdmUoXCIje19fZGlybmFtZX0vLi4vZGF0YS9jb21wbGV0aW9uc1wiKVxuICAgIENTT04ucmVhZEZpbGUgcGF0aCwgKGVycm9yLCBvYmplY3QpID0+XG4gICAgICByZXR1cm4gaWYgZXJyb3I/XG5cbiAgICAgIHtjb21wbGV0aW9uc30gPSBvYmplY3RcbiAgICAgIEBjb21wbGV0aW9ucyA9IGZvciBkZXNjcmlwdGlvbiwgZW50aXR5IG9mIGNvbXBsZXRpb25zXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBlbnRpdHlcbiAgICAgICAgICByaWdodExhYmVsSFRNTDogZW50aXR5XG4gICAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uXG4gICAgICAgICAgdHlwZTogJ2NvbnN0YW50J1xuICAgICAgICB9XG5cbiAgIyBQcml2YXRlOiBCdWlsZHMgdGhlIGxpc3Qgb2Ygc3VnZ2VzdGlvbnMgZnJvbSB0aGUgY3VycmVudCBzZXQgb2YgY29tcGxldGlvbnMgYW5kIHRoZSBgcHJlZml4YC5cbiAgI1xuICAjIE9uY2UgdGhlIGxpc3Qgb2Ygc3VnZ2VzdGlvbnMgaXMgYnVpbHQsIGl0IGlzIHJhbmtlZCBhbmQgZmlsdGVyZWQgdXNpbmcgdGhlIGZ1enphbGRyaW4gbGlicmFyeS5cbiAgI1xuICAjICogYHByZWZpeGAge1N0cmluZ30gY29udGFpbmluZyB0aGUgdGV4dCB0byBtYXRjaCBhbmQgcmVwbGFjZS5cbiAgI1xuICAjIFJldHVybnMgYSBsaXN0IG9mIGFwcGxpY2FibGUgc3VnZ2VzdGlvbnMuXG4gIGJ1aWxkU3VnZ2VzdGlvbnM6IChwcmVmaXgpIC0+XG4gICAgc3VnZ2VzdGlvbnMgPSBbXVxuICAgIGZvciBjb21wbGV0aW9uIGluIEBjb21wbGV0aW9uc1xuICAgICAgY29tcGxldGlvbi5yZXBsYWNlbWVudFByZWZpeCA9IHByZWZpeFxuICAgICAgc3VnZ2VzdGlvbnMucHVzaChjb21wbGV0aW9uKVxuXG4gICAgZmlsdGVyKHN1Z2dlc3Rpb25zLCBwcmVmaXgsIGtleTogJ3RleHQnKVxuXG4gICMgUHJpdmF0ZTogR2V0cyB0aGUgYXBwcm9wcmlhdGUgcHJlZml4IHRleHQgdG8gc2VhcmNoIGZvci5cbiAgI1xuICAjICogYGVkaXRvcmAge1RleHRFZGl0b3J9IHdoZXJlIHRoZSBhdXRvY29tcGxldGlvbiB3YXMgcmVxdWVzdGVkLlxuICAjICogYGJ1ZmZlclBvc2l0aW9uYCBBIHtQb2ludH0gb3IgcG9pbnQtY29tcGF0aWJsZSB7QXJyYXl9IGluZGljYXRpbmcgd2hlcmUgdGhlIGN1cnNvciBpcyBsb2NhdGVkLlxuICAjXG4gICMgUmV0dXJucyBhIHtTdHJpbmd9IGNvbnRhaW5pbmcgdGhlIHByZWZpeCB0ZXh0LlxuICBnZXRQcmVmaXg6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG5cbiAgICBsaW5lLm1hdGNoKC8mW0EtWmEtejAtOV0rJC8pP1swXSBvciAnJ1xuIl19
