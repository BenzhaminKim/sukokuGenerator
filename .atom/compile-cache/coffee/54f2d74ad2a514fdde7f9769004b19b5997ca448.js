(function() {
  var provider;

  provider = require('./provider');

  module.exports = {
    activate: function() {
      return provider.loadCompletions();
    },
    getProvider: function() {
      return provider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1odG1sLWVudGl0aWVzL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQTthQUFHLFFBQVEsQ0FBQyxlQUFULENBQUE7SUFBSCxDQUFWO0lBRUEsV0FBQSxFQUFhLFNBQUE7YUFBRztJQUFILENBRmI7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJwcm92aWRlciA9IHJlcXVpcmUgJy4vcHJvdmlkZXInXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IC0+IHByb3ZpZGVyLmxvYWRDb21wbGV0aW9ucygpXG5cbiAgZ2V0UHJvdmlkZXI6IC0+IHByb3ZpZGVyXG4iXX0=
