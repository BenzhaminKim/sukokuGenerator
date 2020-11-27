(function() {
  var CompositeDisposable, HighlightedAreaView;

  CompositeDisposable = require("atom").CompositeDisposable;

  HighlightedAreaView = require('./highlighted-area-view');

  module.exports = {
    config: {
      onlyHighlightWholeWords: {
        type: 'boolean',
        "default": true
      },
      hideHighlightOnSelectedWord: {
        type: 'boolean',
        "default": false
      },
      ignoreCase: {
        type: 'boolean',
        "default": false
      },
      lightTheme: {
        type: 'boolean',
        "default": false
      },
      highlightBackground: {
        type: 'boolean',
        "default": false
      },
      minimumLength: {
        type: 'integer',
        "default": 2
      },
      timeout: {
        type: 'integer',
        "default": 20,
        description: 'Defers searching for matching strings for X ms'
      },
      showInStatusBar: {
        type: 'boolean',
        "default": true,
        description: 'Show how many matches there are'
      },
      highlightInPanes: {
        type: 'boolean',
        "default": true,
        description: 'Highlight selection in another panes'
      },
      statusBarString: {
        type: 'string',
        "default": 'Highlighted: %c',
        description: 'The text to show in the status bar. %c = number of occurrences'
      },
      allowedCharactersToSelect: {
        type: 'string',
        "default": '$@%-',
        description: 'Non Word Characters that are allowed to be selected'
      },
      showResultsOnScrollBar: {
        type: 'boolean',
        "default": false,
        description: 'Show highlight on the scroll bar'
      }
    },
    areaView: null,
    activate: function(state) {
      this.areaView = new HighlightedAreaView();
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-selected:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'highlight-selected:select-all': (function(_this) {
          return function() {
            return _this.selectAll();
          };
        })(this)
      }));
    },
    deactivate: function() {
      var ref, ref1;
      if ((ref = this.areaView) != null) {
        ref.destroy();
      }
      this.areaView = null;
      if ((ref1 = this.subscriptions) != null) {
        ref1.dispose();
      }
      return this.subscriptions = null;
    },
    provideHighlightSelectedV1Deprecated: function() {
      return this.areaView;
    },
    provideHighlightSelectedV2: function() {
      return this.areaView;
    },
    consumeStatusBar: function(statusBar) {
      return this.areaView.setStatusBar(statusBar);
    },
    toggle: function() {
      if (this.areaView.disabled) {
        return this.areaView.enable();
      } else {
        return this.areaView.disable();
      }
    },
    selectAll: function() {
      return this.areaView.selectAll();
    },
    consumeScrollMarker: function(scrollMarkerAPI) {
      return this.areaView.setScrollMarker(scrollMarkerAPI);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1zZWxlY3RlZC9saWIvaGlnaGxpZ2h0LXNlbGVjdGVkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVI7O0VBRXRCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSx1QkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7T0FERjtNQUdBLDJCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQUpGO01BTUEsVUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FQRjtNQVNBLFVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BVkY7TUFZQSxtQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FiRjtNQWVBLGFBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQURUO09BaEJGO01Ba0JBLE9BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO1FBRUEsV0FBQSxFQUFhLGdEQUZiO09BbkJGO01Bc0JBLGVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLGlDQUZiO09BdkJGO01BMEJBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxzQ0FGYjtPQTNCRjtNQThCQSxlQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsaUJBRFQ7UUFFQSxXQUFBLEVBQWEsZ0VBRmI7T0EvQkY7TUFrQ0EseUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQURUO1FBRUEsV0FBQSxFQUFhLHFEQUZiO09BbkNGO01Bc0NBLHNCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxrQ0FGYjtPQXZDRjtLQURGO0lBNENBLFFBQUEsRUFBVSxJQTVDVjtJQThDQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLG1CQUFKLENBQUE7TUFDWixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO2FBRXJCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2Y7UUFBQSwyQkFBQSxFQUE2QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0I7UUFDQSwrQkFBQSxFQUFpQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEakM7T0FEZSxDQUFuQjtJQUpRLENBOUNWO0lBc0RBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsVUFBQTs7V0FBUyxDQUFFLE9BQVgsQ0FBQTs7TUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZOztZQUNFLENBQUUsT0FBaEIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUpQLENBdERaO0lBNERBLG9DQUFBLEVBQXNDLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQTVEdEM7SUE4REEsMEJBQUEsRUFBNEIsU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKLENBOUQ1QjtJQWdFQSxnQkFBQSxFQUFrQixTQUFDLFNBQUQ7YUFDaEIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxZQUFWLENBQXVCLFNBQXZCO0lBRGdCLENBaEVsQjtJQW1FQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFiO2VBQ0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQSxFQUhGOztJQURNLENBbkVSO0lBeUVBLFNBQUEsRUFBVyxTQUFBO2FBQ1QsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLENBQUE7SUFEUyxDQXpFWDtJQTRFQSxtQkFBQSxFQUFxQixTQUFDLGVBQUQ7YUFDbkIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxlQUFWLENBQTBCLGVBQTFCO0lBRG1CLENBNUVyQjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgXCJhdG9tXCJcbkhpZ2hsaWdodGVkQXJlYVZpZXcgPSByZXF1aXJlICcuL2hpZ2hsaWdodGVkLWFyZWEtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgb25seUhpZ2hsaWdodFdob2xlV29yZHM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBoaWRlSGlnaGxpZ2h0T25TZWxlY3RlZFdvcmQ6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgaWdub3JlQ2FzZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBsaWdodFRoZW1lOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGhpZ2hsaWdodEJhY2tncm91bmQ6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgbWluaW11bUxlbmd0aDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMlxuICAgIHRpbWVvdXQ6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDIwXG4gICAgICBkZXNjcmlwdGlvbjogJ0RlZmVycyBzZWFyY2hpbmcgZm9yIG1hdGNoaW5nIHN0cmluZ3MgZm9yIFggbXMnXG4gICAgc2hvd0luU3RhdHVzQmFyOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogJ1Nob3cgaG93IG1hbnkgbWF0Y2hlcyB0aGVyZSBhcmUnXG4gICAgaGlnaGxpZ2h0SW5QYW5lczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246ICdIaWdobGlnaHQgc2VsZWN0aW9uIGluIGFub3RoZXIgcGFuZXMnXG4gICAgc3RhdHVzQmFyU3RyaW5nOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdIaWdobGlnaHRlZDogJWMnXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSB0ZXh0IHRvIHNob3cgaW4gdGhlIHN0YXR1cyBiYXIuICVjID0gbnVtYmVyIG9mIG9jY3VycmVuY2VzJ1xuICAgIGFsbG93ZWRDaGFyYWN0ZXJzVG9TZWxlY3Q6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJyRAJS0nXG4gICAgICBkZXNjcmlwdGlvbjogJ05vbiBXb3JkIENoYXJhY3RlcnMgdGhhdCBhcmUgYWxsb3dlZCB0byBiZSBzZWxlY3RlZCdcbiAgICBzaG93UmVzdWx0c09uU2Nyb2xsQmFyOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246ICdTaG93IGhpZ2hsaWdodCBvbiB0aGUgc2Nyb2xsIGJhcidcblxuICBhcmVhVmlldzogbnVsbFxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQGFyZWFWaWV3ID0gbmV3IEhpZ2hsaWdodGVkQXJlYVZpZXcoKVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsXG4gICAgICAgICdoaWdobGlnaHQtc2VsZWN0ZWQ6dG9nZ2xlJzogPT4gQHRvZ2dsZSgpXG4gICAgICAgICdoaWdobGlnaHQtc2VsZWN0ZWQ6c2VsZWN0LWFsbCc6ID0+IEBzZWxlY3RBbGwoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGFyZWFWaWV3Py5kZXN0cm95KClcbiAgICBAYXJlYVZpZXcgPSBudWxsXG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEBzdWJzY3JpcHRpb25zID0gbnVsbFxuXG4gIHByb3ZpZGVIaWdobGlnaHRTZWxlY3RlZFYxRGVwcmVjYXRlZDogLT4gQGFyZWFWaWV3XG5cbiAgcHJvdmlkZUhpZ2hsaWdodFNlbGVjdGVkVjI6IC0+IEBhcmVhVmlld1xuXG4gIGNvbnN1bWVTdGF0dXNCYXI6IChzdGF0dXNCYXIpIC0+XG4gICAgQGFyZWFWaWV3LnNldFN0YXR1c0JhciBzdGF0dXNCYXJcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQGFyZWFWaWV3LmRpc2FibGVkXG4gICAgICBAYXJlYVZpZXcuZW5hYmxlKClcbiAgICBlbHNlXG4gICAgICBAYXJlYVZpZXcuZGlzYWJsZSgpXG5cbiAgc2VsZWN0QWxsOiAtPlxuICAgIEBhcmVhVmlldy5zZWxlY3RBbGwoKVxuXG4gIGNvbnN1bWVTY3JvbGxNYXJrZXI6IChzY3JvbGxNYXJrZXJBUEkpIC0+XG4gICAgQGFyZWFWaWV3LnNldFNjcm9sbE1hcmtlciBzY3JvbGxNYXJrZXJBUElcbiJdfQ==
