(function() {
  var CompositeDisposable, opn;

  CompositeDisposable = require('atom').CompositeDisposable;

  opn = require('opn');

  module.exports = {
    subscriptions: null,
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-text-editor', 'open-in-browser:open', this.openEditor.bind(this)));
      return this.subscriptions.add(atom.commands.add('.tree-view .file', 'open-in-browser:open-tree-view', this.openTreeView.bind(this)));
    },
    getFilePath: function() {
      return atom.workspace.getActiveTextEditor().getPath();
    },
    openEditor: function() {
      return this.open(this.getFilePath());
    },
    openTreeView: function(arg) {
      var target;
      target = arg.target;
      return this.open(target.dataset.path);
    },
    open: function(filePath) {
      return opn(filePath)["catch"](function(error) {
        atom.notifications.addError(error.toString(), {
          detail: error.stack || '',
          dismissable: true
        });
        return console.error(error);
      });
    },
    deactivate: function() {
      var ref;
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL29wZW4taW4tYnJvd3Nlci9saWIvb3Blbi1pbi1icm93c2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7O0VBRU4sTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBRUEsUUFBQSxFQUFVLFNBQUE7TUFDUixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ2pCLHNCQURpQixFQUNPLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFpQixJQUFqQixDQURQLENBQW5CO2FBRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFDakIsZ0NBRGlCLEVBQ2lCLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFtQixJQUFuQixDQURqQixDQUFuQjtJQUpRLENBRlY7SUFTQSxXQUFBLEVBQWEsU0FBQTthQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLE9BQXJDLENBQUE7SUFBSCxDQVRiO0lBV0EsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsSUFBRCxDQUFNLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBTjtJQURVLENBWFo7SUFjQSxZQUFBLEVBQWMsU0FBQyxHQUFEO0FBQ1osVUFBQTtNQURjLFNBQUQ7YUFDYixJQUFDLENBQUEsSUFBRCxDQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBckI7SUFEWSxDQWRkO0lBaUJBLElBQUEsRUFBTSxTQUFDLFFBQUQ7YUFDSixHQUFBLENBQUksUUFBSixDQUFhLEVBQUMsS0FBRCxFQUFiLENBQW9CLFNBQUMsS0FBRDtRQUNsQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBNUIsRUFBOEM7VUFBQSxNQUFBLEVBQVEsS0FBSyxDQUFDLEtBQU4sSUFBZSxFQUF2QjtVQUEyQixXQUFBLEVBQWEsSUFBeEM7U0FBOUM7ZUFDQSxPQUFPLENBQUMsS0FBUixDQUFjLEtBQWQ7TUFGa0IsQ0FBcEI7SUFESSxDQWpCTjtJQXNCQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7cURBQWMsQ0FBRSxPQUFoQixDQUFBO0lBRFUsQ0F0Qlo7O0FBTEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xub3BuID0gcmVxdWlyZSAnb3BuJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLFxuICAgICAgJ29wZW4taW4tYnJvd3NlcjpvcGVuJywgQG9wZW5FZGl0b3IuYmluZCh0aGlzKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnLnRyZWUtdmlldyAuZmlsZScsXG4gICAgICAnb3Blbi1pbi1icm93c2VyOm9wZW4tdHJlZS12aWV3JywgQG9wZW5UcmVlVmlldy5iaW5kKHRoaXMpXG5cbiAgZ2V0RmlsZVBhdGg6IC0+IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRQYXRoKClcblxuICBvcGVuRWRpdG9yOiAtPlxuICAgIEBvcGVuIEBnZXRGaWxlUGF0aCgpXG5cbiAgb3BlblRyZWVWaWV3OiAoe3RhcmdldH0pIC0+XG4gICAgQG9wZW4gdGFyZ2V0LmRhdGFzZXQucGF0aFxuXG4gIG9wZW46IChmaWxlUGF0aCkgLT5cbiAgICBvcG4oZmlsZVBhdGgpLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBlcnJvci50b1N0cmluZygpLCBkZXRhaWw6IGVycm9yLnN0YWNrIG9yICcnLCBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgY29uc29sZS5lcnJvciBlcnJvclxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuIl19
