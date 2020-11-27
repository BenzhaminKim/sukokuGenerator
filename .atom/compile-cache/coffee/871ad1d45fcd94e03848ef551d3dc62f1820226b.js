(function() {
  var CompositeDisposable, HtmlPreviewView, url;

  url = require('url');

  CompositeDisposable = require('atom').CompositeDisposable;

  HtmlPreviewView = require('./atom-html-preview-view');

  module.exports = {
    config: {
      triggerOnSave: {
        type: 'boolean',
        description: 'Watch will trigger on save.',
        "default": false
      },
      preserveWhiteSpaces: {
        type: 'boolean',
        description: 'Preserve white spaces and line endings.',
        "default": false
      },
      fileEndings: {
        type: 'array',
        title: 'Preserve file endings',
        description: 'File endings to preserve',
        "default": ["c", "h"],
        items: {
          type: 'string'
        }
      },
      scrollToCursor: {
        type: 'boolean',
        description: 'Attempts to scroll the webview to the section of your HTML you are editing based on your cursor\'s position.',
        "default": false
      },
      enableMathJax: {
        type: 'boolean',
        description: 'Enable MathJax inline rendering \\f$ \\pi \\f$',
        "default": false
      }
    },
    htmlPreviewView: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.subscriptions.add(editor.onDidSave(function() {
            if ((typeof htmlPreviewView !== "undefined" && htmlPreviewView !== null) && htmlPreviewView instanceof HtmlPreviewView) {
              return htmlPreviewView.renderHTML();
            }
          }));
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-html-preview:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      return atom.workspace.addOpener(function(uriToOpen) {
        var error, host, pathname, protocol, ref;
        try {
          ref = url.parse(uriToOpen), protocol = ref.protocol, host = ref.host, pathname = ref.pathname;
        } catch (error1) {
          error = error1;
          return;
        }
        if (protocol !== 'html-preview:') {
          return;
        }
        try {
          if (pathname) {
            pathname = decodeURI(pathname);
          }
        } catch (error1) {
          error = error1;
          return;
        }
        if (host === 'editor') {
          this.htmlPreviewView = new HtmlPreviewView({
            editorId: pathname.substring(1)
          });
        } else {
          this.htmlPreviewView = new HtmlPreviewView({
            filePath: pathname
          });
        }
        return htmlPreviewView;
      });
    },
    toggle: function() {
      var editor, previewPane, previousActivePane, uri;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      uri = "html-preview://editor/" + editor.id;
      previewPane = atom.workspace.paneForURI(uri);
      if (previewPane) {
        previewPane.destroyItem(previewPane.itemForURI(uri));
        return;
      }
      previousActivePane = atom.workspace.getActivePane();
      return atom.workspace.open(uri, {
        split: 'right',
        searchAllPanes: true
      }).then(function(htmlPreviewView) {
        if (htmlPreviewView instanceof HtmlPreviewView) {
          htmlPreviewView.renderHTML();
          return previousActivePane.activate();
        }
      });
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F0b20taHRtbC1wcmV2aWV3L2xpYi9hdG9tLWh0bWwtcHJldmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBd0IsT0FBQSxDQUFRLEtBQVI7O0VBQ3ZCLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsZUFBQSxHQUF3QixPQUFBLENBQVEsMEJBQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxhQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLFdBQUEsRUFBYSw2QkFEYjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtPQURGO01BSUEsbUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsV0FBQSxFQUFhLHlDQURiO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUZUO09BTEY7TUFRQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sT0FBTjtRQUNBLEtBQUEsRUFBTyx1QkFEUDtRQUVBLFdBQUEsRUFBYSwwQkFGYjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBQyxHQUFELEVBQU0sR0FBTixDQUhUO1FBSUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FMRjtPQVRGO01BZUEsY0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxXQUFBLEVBQWEsOEdBRGI7UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRlQ7T0FoQkY7TUFtQkEsYUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxXQUFBLEVBQWEsZ0RBRGI7UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRlQ7T0FwQkY7S0FERjtJQXlCQSxlQUFBLEVBQWlCLElBekJqQjtJQTJCQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BRVIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUVyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtpQkFDbkQsS0FBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQUE7WUFDbEMsSUFBRyxvRUFBQSxJQUFxQixlQUFBLFlBQTJCLGVBQW5EO3FCQUNFLGVBQWUsQ0FBQyxVQUFoQixDQUFBLEVBREY7O1VBRGtDLENBQWpCLENBQW5CO1FBRG1EO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFuQjtNQU1BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQUEsMEJBQUEsRUFBNEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCO09BQXBDLENBQW5CO2FBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQXlCLFNBQUMsU0FBRDtBQUN2QixZQUFBO0FBQUE7VUFDRSxNQUE2QixHQUFHLENBQUMsS0FBSixDQUFVLFNBQVYsQ0FBN0IsRUFBQyx1QkFBRCxFQUFXLGVBQVgsRUFBaUIsd0JBRG5CO1NBQUEsY0FBQTtVQUVNO0FBQ0osaUJBSEY7O1FBS0EsSUFBYyxRQUFBLEtBQVksZUFBMUI7QUFBQSxpQkFBQTs7QUFFQTtVQUNFLElBQWtDLFFBQWxDO1lBQUEsUUFBQSxHQUFXLFNBQUEsQ0FBVSxRQUFWLEVBQVg7V0FERjtTQUFBLGNBQUE7VUFFTTtBQUNKLGlCQUhGOztRQUtBLElBQUcsSUFBQSxLQUFRLFFBQVg7VUFDRSxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFJLGVBQUosQ0FBb0I7WUFBQSxRQUFBLEVBQVUsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsQ0FBbkIsQ0FBVjtXQUFwQixFQURyQjtTQUFBLE1BQUE7VUFHRSxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFJLGVBQUosQ0FBb0I7WUFBQSxRQUFBLEVBQVUsUUFBVjtXQUFwQixFQUhyQjs7QUFLQSxlQUFPO01BbEJnQixDQUF6QjtJQVpRLENBM0JWO0lBMkRBLE1BQUEsRUFBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxJQUFjLGNBQWQ7QUFBQSxlQUFBOztNQUVBLEdBQUEsR0FBTSx3QkFBQSxHQUF5QixNQUFNLENBQUM7TUFFdEMsV0FBQSxHQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBZixDQUEwQixHQUExQjtNQUNkLElBQUcsV0FBSDtRQUNFLFdBQVcsQ0FBQyxXQUFaLENBQXdCLFdBQVcsQ0FBQyxVQUFaLENBQXVCLEdBQXZCLENBQXhCO0FBQ0EsZUFGRjs7TUFJQSxrQkFBQSxHQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTthQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsR0FBcEIsRUFBeUI7UUFBQSxLQUFBLEVBQU8sT0FBUDtRQUFnQixjQUFBLEVBQWdCLElBQWhDO09BQXpCLENBQThELENBQUMsSUFBL0QsQ0FBb0UsU0FBQyxlQUFEO1FBQ2xFLElBQUcsZUFBQSxZQUEyQixlQUE5QjtVQUNFLGVBQWUsQ0FBQyxVQUFoQixDQUFBO2lCQUNBLGtCQUFrQixDQUFDLFFBQW5CLENBQUEsRUFGRjs7TUFEa0UsQ0FBcEU7SUFaTSxDQTNEUjtJQTRFQSxVQUFBLEVBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBRFUsQ0E1RVo7O0FBTkYiLCJzb3VyY2VzQ29udGVudCI6WyJ1cmwgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICd1cmwnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5IdG1sUHJldmlld1ZpZXcgICAgICAgPSByZXF1aXJlICcuL2F0b20taHRtbC1wcmV2aWV3LXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIHRyaWdnZXJPblNhdmU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2F0Y2ggd2lsbCB0cmlnZ2VyIG9uIHNhdmUuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBwcmVzZXJ2ZVdoaXRlU3BhY2VzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZXNjcmlwdGlvbjogJ1ByZXNlcnZlIHdoaXRlIHNwYWNlcyBhbmQgbGluZSBlbmRpbmdzLidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgZmlsZUVuZGluZ3M6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICB0aXRsZTogJ1ByZXNlcnZlIGZpbGUgZW5kaW5ncydcbiAgICAgIGRlc2NyaXB0aW9uOiAnRmlsZSBlbmRpbmdzIHRvIHByZXNlcnZlJ1xuICAgICAgZGVmYXVsdDogW1wiY1wiLCBcImhcIl1cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIHNjcm9sbFRvQ3Vyc29yOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZXNjcmlwdGlvbjogJ0F0dGVtcHRzIHRvIHNjcm9sbCB0aGUgd2VidmlldyB0byB0aGUgc2VjdGlvbiBvZiB5b3VyIEhUTUwgeW91IGFyZSBlZGl0aW5nIGJhc2VkIG9uIHlvdXIgY3Vyc29yXFwncyBwb3NpdGlvbi4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGVuYWJsZU1hdGhKYXg6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5hYmxlIE1hdGhKYXggaW5saW5lIHJlbmRlcmluZyBcXFxcZiQgXFxcXHBpIFxcXFxmJCdcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG5cbiAgaHRtbFByZXZpZXdWaWV3OiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZFNhdmUgPT5cbiAgICAgICAgaWYgaHRtbFByZXZpZXdWaWV3PyBhbmQgaHRtbFByZXZpZXdWaWV3IGluc3RhbmNlb2YgSHRtbFByZXZpZXdWaWV3XG4gICAgICAgICAgaHRtbFByZXZpZXdWaWV3LnJlbmRlckhUTUwoKVxuXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2F0b20taHRtbC1wcmV2aWV3OnRvZ2dsZSc6ID0+IEB0b2dnbGUoKVxuXG4gICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyICh1cmlUb09wZW4pIC0+XG4gICAgICB0cnlcbiAgICAgICAge3Byb3RvY29sLCBob3N0LCBwYXRobmFtZX0gPSB1cmwucGFyc2UodXJpVG9PcGVuKVxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHJldHVybiB1bmxlc3MgcHJvdG9jb2wgaXMgJ2h0bWwtcHJldmlldzonXG5cbiAgICAgIHRyeVxuICAgICAgICBwYXRobmFtZSA9IGRlY29kZVVSSShwYXRobmFtZSkgaWYgcGF0aG5hbWVcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIHJldHVyblxuXG4gICAgICBpZiBob3N0IGlzICdlZGl0b3InXG4gICAgICAgIEBodG1sUHJldmlld1ZpZXcgPSBuZXcgSHRtbFByZXZpZXdWaWV3KGVkaXRvcklkOiBwYXRobmFtZS5zdWJzdHJpbmcoMSkpXG4gICAgICBlbHNlXG4gICAgICAgIEBodG1sUHJldmlld1ZpZXcgPSBuZXcgSHRtbFByZXZpZXdWaWV3KGZpbGVQYXRoOiBwYXRobmFtZSlcblxuICAgICAgcmV0dXJuIGh0bWxQcmV2aWV3Vmlld1xuXG4gIHRvZ2dsZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvcj9cblxuICAgIHVyaSA9IFwiaHRtbC1wcmV2aWV3Oi8vZWRpdG9yLyN7ZWRpdG9yLmlkfVwiXG5cbiAgICBwcmV2aWV3UGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkodXJpKVxuICAgIGlmIHByZXZpZXdQYW5lXG4gICAgICBwcmV2aWV3UGFuZS5kZXN0cm95SXRlbShwcmV2aWV3UGFuZS5pdGVtRm9yVVJJKHVyaSkpXG4gICAgICByZXR1cm5cblxuICAgIHByZXZpb3VzQWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4odXJpLCBzcGxpdDogJ3JpZ2h0Jywgc2VhcmNoQWxsUGFuZXM6IHRydWUpLnRoZW4gKGh0bWxQcmV2aWV3VmlldykgLT5cbiAgICAgIGlmIGh0bWxQcmV2aWV3VmlldyBpbnN0YW5jZW9mIEh0bWxQcmV2aWV3Vmlld1xuICAgICAgICBodG1sUHJldmlld1ZpZXcucmVuZGVySFRNTCgpXG4gICAgICAgIHByZXZpb3VzQWN0aXZlUGFuZS5hY3RpdmF0ZSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiJdfQ==
