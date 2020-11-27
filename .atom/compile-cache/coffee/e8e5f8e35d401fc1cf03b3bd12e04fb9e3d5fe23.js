(function() {
  var $, $$$, AtomHtmlPreviewView, CompositeDisposable, Disposable, ScrollView, fs, os, path, ref, ref1, scrollInjectScript,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  ref1 = require('atom-space-pen-views'), $ = ref1.$, $$$ = ref1.$$$, ScrollView = ref1.ScrollView;

  path = require('path');

  os = require('os');

  scrollInjectScript = "<script>\n(function () {\n  var scriptTag = document.scripts[document.scripts.length - 1];\n  document.addEventListener('DOMContentLoaded',()=>{\n    var elem = document.createElement(\"span\")\n    try {\n      // Scroll to this current script tag\n      elem.style.width = 100\n      // Center the scrollY\n      elem.style.height = \"20vh\"\n      elem.style.marginTop = \"-20vh\"\n      elem.style.marginLeft = -100\n      elem.style.display = \"block\"\n      var par = scriptTag.parentNode\n      par.insertBefore(elem, scriptTag)\n      elem.scrollIntoView()\n    } catch (error) {}\n    try { elem.remove() } catch (error) {}\n    try { scriptTag.remove() } catch (error) {}\n  }, false)\n})();\n</script>";

  module.exports = AtomHtmlPreviewView = (function(superClass) {
    extend(AtomHtmlPreviewView, superClass);

    atom.deserializers.add(AtomHtmlPreviewView);

    AtomHtmlPreviewView.prototype.editorSub = null;

    AtomHtmlPreviewView.prototype.onDidChangeTitle = function() {
      return new Disposable();
    };

    AtomHtmlPreviewView.prototype.onDidChangeModified = function() {
      return new Disposable();
    };

    AtomHtmlPreviewView.prototype.webviewElementLoaded = false;

    AtomHtmlPreviewView.prototype.renderLater = true;

    AtomHtmlPreviewView.deserialize = function(state) {
      return new AtomHtmlPreviewView(state);
    };

    AtomHtmlPreviewView.content = function() {
      return this.div({
        "class": 'atom-html-preview native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          var style;
          style = 'z-index: 2; padding: 2em;';
          _this.div({
            "class": 'show-error',
            style: style
          });
          return _this.tag('webview', {
            src: path.resolve(__dirname, '../html/loading.html'),
            outlet: 'htmlview',
            disablewebsecurity: 'on',
            allowfileaccessfromfiles: 'on',
            allowPointerLock: 'on'
          });
        };
      })(this));
    };

    function AtomHtmlPreviewView(arg) {
      var filePath, handles;
      this.editorId = arg.editorId, filePath = arg.filePath;
      this.handleEvents = bind(this.handleEvents, this);
      AtomHtmlPreviewView.__super__.constructor.apply(this, arguments);
      if (this.editorId != null) {
        this.resolveEditor(this.editorId);
        this.tmpPath = this.getPath();
      } else {
        if (atom.workspace != null) {
          this.subscribeToFilePath(filePath);
        } else {
          atom.packages.onDidActivatePackage((function(_this) {
            return function() {
              return _this.subscribeToFilePath(filePath);
            };
          })(this));
        }
      }
      handles = $("atom-pane-resize-handle");
      handles.on('mousedown', (function(_this) {
        return function() {
          return _this.onStartedResize();
        };
      })(this));
      this.find('.show-error').hide();
      this.webview = this.htmlview[0];
      this.webview.addEventListener('dom-ready', (function(_this) {
        return function() {
          _this.webviewElementLoaded = true;
          if (_this.renderLater) {
            _this.renderLater = false;
            return _this.renderHTMLCode();
          }
        };
      })(this));
    }

    AtomHtmlPreviewView.prototype.onStartedResize = function() {
      this.css({
        'pointer-events': 'none'
      });
      return document.addEventListener('mouseup', this.onStoppedResizing.bind(this));
    };

    AtomHtmlPreviewView.prototype.onStoppedResizing = function() {
      this.css({
        'pointer-events': 'all'
      });
      return document.removeEventListener('mouseup', this.onStoppedResizing);
    };

    AtomHtmlPreviewView.prototype.serialize = function() {
      return {
        deserializer: 'AtomHtmlPreviewView',
        filePath: this.getPath(),
        editorId: this.editorId
      };
    };

    AtomHtmlPreviewView.prototype.destroy = function() {
      if (this.editorSub != null) {
        return this.editorSub.dispose();
      }
    };

    AtomHtmlPreviewView.prototype.subscribeToFilePath = function(filePath) {
      this.trigger('title-changed');
      this.handleEvents();
      return this.renderHTML();
    };

    AtomHtmlPreviewView.prototype.resolveEditor = function(editorId) {
      var resolve;
      resolve = (function(_this) {
        return function() {
          var ref2, ref3;
          _this.editor = _this.editorForId(editorId);
          if (_this.editor != null) {
            if (_this.editor != null) {
              _this.trigger('title-changed');
            }
            return _this.handleEvents();
          } else {
            return (ref2 = atom.workspace) != null ? (ref3 = ref2.paneForItem(_this)) != null ? ref3.destroyItem(_this) : void 0 : void 0;
          }
        };
      })(this);
      if (atom.workspace != null) {
        return resolve();
      } else {
        return atom.packages.onDidActivatePackage((function(_this) {
          return function() {
            resolve();
            return _this.renderHTML();
          };
        })(this));
      }
    };

    AtomHtmlPreviewView.prototype.editorForId = function(editorId) {
      var editor, i, len, ref2, ref3;
      ref2 = atom.workspace.getTextEditors();
      for (i = 0, len = ref2.length; i < len; i++) {
        editor = ref2[i];
        if (((ref3 = editor.id) != null ? ref3.toString() : void 0) === editorId.toString()) {
          return editor;
        }
      }
      return null;
    };

    AtomHtmlPreviewView.prototype.handleEvents = function() {
      var changeHandler, contextMenuClientX, contextMenuClientY;
      contextMenuClientX = 0;
      contextMenuClientY = 0;
      this.on('contextmenu', function(event) {
        contextMenuClientY = event.clientY;
        return contextMenuClientX = event.clientX;
      });
      atom.commands.add(this.element, {
        'atom-html-preview:open-devtools': (function(_this) {
          return function() {
            return _this.webview.openDevTools();
          };
        })(this),
        'atom-html-preview:inspect': (function(_this) {
          return function() {
            return _this.webview.inspectElement(contextMenuClientX, contextMenuClientY);
          };
        })(this),
        'atom-html-preview:print': (function(_this) {
          return function() {
            return _this.webview.print();
          };
        })(this)
      });
      changeHandler = (function(_this) {
        return function() {
          var pane;
          _this.renderHTML();
          pane = atom.workspace.paneForURI(_this.getURI());
          if ((pane != null) && pane !== atom.workspace.getActivePane()) {
            return pane.activateItem(_this);
          }
        };
      })(this);
      this.editorSub = new CompositeDisposable;
      if (this.editor != null) {
        if (atom.config.get("atom-html-preview.triggerOnSave")) {
          this.editorSub.add(this.editor.onDidSave(changeHandler));
        } else {
          this.editorSub.add(this.editor.onDidStopChanging(changeHandler));
        }
        return this.editorSub.add(this.editor.onDidChangePath((function(_this) {
          return function() {
            return _this.trigger('title-changed');
          };
        })(this)));
      }
    };

    AtomHtmlPreviewView.prototype.renderHTML = function() {
      if (this.editor != null) {
        if (!atom.config.get("atom-html-preview.triggerOnSave") && (this.editor.getPath() != null)) {
          return this.save(this.renderHTMLCode);
        } else {
          return this.renderHTMLCode();
        }
      }
    };

    AtomHtmlPreviewView.prototype.save = function(callback) {
      var column, editorText, error, fileEnding, findTagBefore, firstSelection, lastTagRE, offset, out, outPath, ref2, row, tagIndex, tagRE;
      outPath = path.resolve(path.join(os.tmpdir(), this.editor.getTitle() + ".html"));
      out = "";
      fileEnding = this.editor.getTitle().split(".").pop();
      if (atom.config.get("atom-html-preview.enableMathJax")) {
        out += "<script type=\"text/x-mathjax-config\">\nMathJax.Hub.Config({\ntex2jax: {inlineMath: [['\\\\f$','\\\\f$']]},\nmenuSettings: {zoom: 'Click'}\n});\n</script>\n<script type=\"text/javascript\"\nsrc=\"http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML\">\n</script>";
      }
      if (atom.config.get("atom-html-preview.preserveWhiteSpaces") && indexOf.call(atom.config.get("atom-html-preview.fileEndings"), fileEnding) >= 0) {
        out += "<style type=\"text/css\">\nbody { white-space: pre; }\n</style>";
      } else {
        out += "<base href=\"" + this.getPath() + "\">";
      }
      editorText = this.editor.getText();
      firstSelection = this.editor.getSelections()[0];
      ref2 = firstSelection.getBufferRange().start, row = ref2.row, column = ref2.column;
      if (atom.config.get("atom-html-preview.scrollToCursor")) {
        try {
          offset = this._getOffset(editorText, row, column);
          tagRE = /<((\/[\$\w\-])|br|input|link)\/?>/.source;
          lastTagRE = RegExp(tagRE + "(?![\\s\\S]*" + tagRE + ")", "i");
          findTagBefore = function(beforeIndex) {
            var matchedClosingTag;
            matchedClosingTag = editorText.slice(0, beforeIndex).match(lastTagRE);
            if (matchedClosingTag) {
              return matchedClosingTag.index + matchedClosingTag[0].length;
            } else {
              return -1;
            }
          };
          tagIndex = findTagBefore(offset);
          if (tagIndex > -1) {
            editorText = (editorText.slice(0, tagIndex)) + "\n" + scrollInjectScript + "\n" + (editorText.slice(tagIndex));
          }
        } catch (error1) {
          error = error1;
          return -1;
        }
      }
      out += editorText;
      this.tmpPath = outPath;
      return fs.writeFile(outPath, out, (function(_this) {
        return function() {
          try {
            return _this.renderHTMLCode();
          } catch (error1) {
            error = error1;
            return _this.showError(error);
          }
        };
      })(this));
    };

    AtomHtmlPreviewView.prototype.renderHTMLCode = function() {
      this.find('.show-error').hide();
      this.htmlview.show();
      if (this.webviewElementLoaded) {
        this.webview.loadURL("file://" + this.tmpPath);
        return atom.commands.dispatch('atom-html-preview', 'html-changed');
      } else {
        return this.renderLater = true;
      }
    };

    AtomHtmlPreviewView.prototype._getOffset = function(text, row, column) {
      var line_re, match, match_index, offset;
      if (column == null) {
        column = 0;
      }
      line_re = /\n/g;
      match_index = null;
      while (row--) {
        if (match = line_re.exec(text)) {
          match_index = match.index;
        } else {
          return -1;
        }
      }
      offset = match_index + column;
      if (offset < text.length) {
        return offset;
      } else {
        return -1;
      }
    };

    AtomHtmlPreviewView.prototype.getTitle = function() {
      if (this.editor != null) {
        return (this.editor.getTitle()) + " Preview";
      } else {
        return "HTML Preview";
      }
    };

    AtomHtmlPreviewView.prototype.getURI = function() {
      return "html-preview://editor/" + this.editorId;
    };

    AtomHtmlPreviewView.prototype.getPath = function() {
      if (this.editor != null) {
        return this.editor.getPath();
      }
    };

    AtomHtmlPreviewView.prototype.showError = function(result) {
      var failureMessage;
      failureMessage = result != null ? result.message : void 0;
      this.htmlview.hide();
      return this.find('.show-error').html($$$(function() {
        this.h2('Previewing HTML Failed');
        if (failureMessage != null) {
          return this.h3(failureMessage);
        }
      })).show();
    };

    return AtomHtmlPreviewView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F0b20taHRtbC1wcmV2aWV3L2xpYi9hdG9tLWh0bWwtcHJldmlldy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEscUhBQUE7SUFBQTs7Ozs7RUFBQSxFQUFBLEdBQXdCLE9BQUEsQ0FBUSxJQUFSOztFQUN4QixNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUN0QixPQUF3QixPQUFBLENBQVEsc0JBQVIsQ0FBeEIsRUFBQyxVQUFELEVBQUksY0FBSixFQUFTOztFQUNULElBQUEsR0FBd0IsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLEVBQUEsR0FBd0IsT0FBQSxDQUFRLElBQVI7O0VBRXhCLGtCQUFBLEdBQXFCOztFQXlCckIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QixtQkFBdkI7O2tDQUVBLFNBQUEsR0FBc0I7O2tDQUN0QixnQkFBQSxHQUFzQixTQUFBO2FBQUcsSUFBSSxVQUFKLENBQUE7SUFBSDs7a0NBQ3RCLG1CQUFBLEdBQXNCLFNBQUE7YUFBRyxJQUFJLFVBQUosQ0FBQTtJQUFIOztrQ0FFdEIsb0JBQUEsR0FBdUI7O2tDQUN2QixXQUFBLEdBQWM7O0lBRWQsbUJBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxLQUFEO2FBQ1osSUFBSSxtQkFBSixDQUF3QixLQUF4QjtJQURZOztJQUdkLG1CQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx1Q0FBUDtRQUFnRCxRQUFBLEVBQVUsQ0FBQyxDQUEzRDtPQUFMLEVBQW1FLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNqRSxjQUFBO1VBQUEsS0FBQSxHQUFRO1VB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U0FBQSxNQUFBO0FBR0UsaUJBQU8sQ0FBQyxFQUhWOztNQURGO01BS0EsTUFBQSxHQUFTLFdBQUEsR0FBYztNQUNoQixJQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsTUFBakI7ZUFBNkIsT0FBN0I7T0FBQSxNQUFBO2VBQXlDLENBQUMsRUFBMUM7O0lBVEc7O2tDQVlaLFFBQUEsR0FBVSxTQUFBO01BQ1IsSUFBRyxtQkFBSDtlQUNJLENBQUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQUEsQ0FBRCxDQUFBLEdBQW9CLFdBRHhCO09BQUEsTUFBQTtlQUdFLGVBSEY7O0lBRFE7O2tDQU1WLE1BQUEsR0FBUSxTQUFBO2FBQ04sd0JBQUEsR0FBeUIsSUFBQyxDQUFBO0lBRHBCOztrQ0FHUixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUcsbUJBQUg7ZUFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxFQURGOztJQURPOztrQ0FJVCxTQUFBLEdBQVcsU0FBQyxNQUFEO0FBQ1QsVUFBQTtNQUFBLGNBQUEsb0JBQWlCLE1BQU0sQ0FBRTtNQUV6QixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBQTthQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sYUFBTixDQUNBLENBQUMsSUFERCxDQUNNLEdBQUEsQ0FBSSxTQUFBO1FBQ1IsSUFBQyxDQUFBLEVBQUQsQ0FBSSx3QkFBSjtRQUNBLElBQXNCLHNCQUF0QjtpQkFBQSxJQUFDLENBQUEsRUFBRCxDQUFJLGNBQUosRUFBQTs7TUFGUSxDQUFKLENBRE4sQ0FJQSxDQUFDLElBSkQsQ0FBQTtJQUpTOzs7O0tBaFBxQjtBQWhDbEMiLCJzb3VyY2VzQ29udGVudCI6WyJmcyAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdmcydcbntDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgJCQkLCBTY3JvbGxWaWV3fSAgPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbnBhdGggICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ3BhdGgnXG5vcyAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdvcydcblxuc2Nyb2xsSW5qZWN0U2NyaXB0ID0gXCJcIlwiXG48c2NyaXB0PlxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNjcmlwdFRhZyA9IGRvY3VtZW50LnNjcmlwdHNbZG9jdW1lbnQuc2NyaXB0cy5sZW5ndGggLSAxXTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsKCk9PntcbiAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpXG4gICAgdHJ5IHtcbiAgICAgIC8vIFNjcm9sbCB0byB0aGlzIGN1cnJlbnQgc2NyaXB0IHRhZ1xuICAgICAgZWxlbS5zdHlsZS53aWR0aCA9IDEwMFxuICAgICAgLy8gQ2VudGVyIHRoZSBzY3JvbGxZXG4gICAgICBlbGVtLnN0eWxlLmhlaWdodCA9IFwiMjB2aFwiXG4gICAgICBlbGVtLnN0eWxlLm1hcmdpblRvcCA9IFwiLTIwdmhcIlxuICAgICAgZWxlbS5zdHlsZS5tYXJnaW5MZWZ0ID0gLTEwMFxuICAgICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiXG4gICAgICB2YXIgcGFyID0gc2NyaXB0VGFnLnBhcmVudE5vZGVcbiAgICAgIHBhci5pbnNlcnRCZWZvcmUoZWxlbSwgc2NyaXB0VGFnKVxuICAgICAgZWxlbS5zY3JvbGxJbnRvVmlldygpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgdHJ5IHsgZWxlbS5yZW1vdmUoKSB9IGNhdGNoIChlcnJvcikge31cbiAgICB0cnkgeyBzY3JpcHRUYWcucmVtb3ZlKCkgfSBjYXRjaCAoZXJyb3IpIHt9XG4gIH0sIGZhbHNlKVxufSkoKTtcbjwvc2NyaXB0PlxuXCJcIlwiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEF0b21IdG1sUHJldmlld1ZpZXcgZXh0ZW5kcyBTY3JvbGxWaWV3XG4gIGF0b20uZGVzZXJpYWxpemVycy5hZGQodGhpcylcblxuICBlZGl0b3JTdWIgICAgICAgICAgIDogbnVsbFxuICBvbkRpZENoYW5nZVRpdGxlICAgIDogLT4gbmV3IERpc3Bvc2FibGUoKVxuICBvbkRpZENoYW5nZU1vZGlmaWVkIDogLT4gbmV3IERpc3Bvc2FibGUoKVxuXG4gIHdlYnZpZXdFbGVtZW50TG9hZGVkIDogZmFsc2VcbiAgcmVuZGVyTGF0ZXIgOiB0cnVlXG5cbiAgQGRlc2VyaWFsaXplOiAoc3RhdGUpIC0+XG4gICAgbmV3IEF0b21IdG1sUHJldmlld1ZpZXcoc3RhdGUpXG5cbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ2F0b20taHRtbC1wcmV2aWV3IG5hdGl2ZS1rZXktYmluZGluZ3MnLCB0YWJpbmRleDogLTEsID0+XG4gICAgICBzdHlsZSA9ICd6LWluZGV4OiAyOyBwYWRkaW5nOiAyZW07J1xuICAgICAgQGRpdiBjbGFzczogJ3Nob3ctZXJyb3InLCBzdHlsZTogc3R5bGVcbiAgICAgIEB0YWcgJ3dlYnZpZXcnLCBzcmM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9odG1sL2xvYWRpbmcuaHRtbCcpLCBvdXRsZXQ6ICdodG1sdmlldycsIGRpc2FibGV3ZWJzZWN1cml0eTonb24nLCBhbGxvd2ZpbGVhY2Nlc3Nmcm9tZmlsZXM6J29uJywgYWxsb3dQb2ludGVyTG9jazonb24nXG5cbiAgY29uc3RydWN0b3I6ICh7QGVkaXRvcklkLCBmaWxlUGF0aH0pIC0+XG4gICAgc3VwZXJcblxuICAgIGlmIEBlZGl0b3JJZD9cbiAgICAgIEByZXNvbHZlRWRpdG9yKEBlZGl0b3JJZClcbiAgICAgIEB0bXBQYXRoID0gQGdldFBhdGgoKSAjIGFmdGVyIHJlc29sdmVFZGl0b3JcbiAgICBlbHNlXG4gICAgICBpZiBhdG9tLndvcmtzcGFjZT9cbiAgICAgICAgQHN1YnNjcmliZVRvRmlsZVBhdGgoZmlsZVBhdGgpXG4gICAgICBlbHNlXG4gICAgICAgICMgQHN1YnNjcmliZSBhdG9tLnBhY2thZ2VzLm9uY2UgJ2FjdGl2YXRlZCcsID0+XG4gICAgICAgIGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZVBhY2thZ2UgPT5cbiAgICAgICAgICBAc3Vic2NyaWJlVG9GaWxlUGF0aChmaWxlUGF0aClcblxuICAgICMgRGlzYWJsZSBwb2ludGVyLWV2ZW50cyB3aGlsZSByZXNpemluZ1xuICAgIGhhbmRsZXMgPSAkKFwiYXRvbS1wYW5lLXJlc2l6ZS1oYW5kbGVcIilcbiAgICBoYW5kbGVzLm9uICdtb3VzZWRvd24nLCA9PiBAb25TdGFydGVkUmVzaXplKClcblxuICAgIEBmaW5kKCcuc2hvdy1lcnJvcicpLmhpZGUoKVxuICAgIEB3ZWJ2aWV3ID0gQGh0bWx2aWV3WzBdXG5cbiAgICBAd2Vidmlldy5hZGRFdmVudExpc3RlbmVyICdkb20tcmVhZHknLCA9PlxuICAgICAgQHdlYnZpZXdFbGVtZW50TG9hZGVkID0gdHJ1ZVxuICAgICAgaWYgQHJlbmRlckxhdGVyXG4gICAgICAgIEByZW5kZXJMYXRlciA9IGZhbHNlXG4gICAgICAgIEByZW5kZXJIVE1MQ29kZSgpXG5cblxuICBvblN0YXJ0ZWRSZXNpemU6IC0+XG4gICAgQGNzcyAncG9pbnRlci1ldmVudHMnOiAnbm9uZSdcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyICdtb3VzZXVwJywgQG9uU3RvcHBlZFJlc2l6aW5nLmJpbmQgdGhpc1xuXG4gIG9uU3RvcHBlZFJlc2l6aW5nOiAtPlxuICAgIEBjc3MgJ3BvaW50ZXItZXZlbnRzJzogJ2FsbCdcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyICdtb3VzZXVwJywgQG9uU3RvcHBlZFJlc2l6aW5nXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIGRlc2VyaWFsaXplciA6ICdBdG9tSHRtbFByZXZpZXdWaWV3J1xuICAgIGZpbGVQYXRoICAgICA6IEBnZXRQYXRoKClcbiAgICBlZGl0b3JJZCAgICAgOiBAZWRpdG9ySWRcblxuICBkZXN0cm95OiAtPlxuICAgIGlmIEBlZGl0b3JTdWI/XG4gICAgICBAZWRpdG9yU3ViLmRpc3Bvc2UoKVxuXG4gIHN1YnNjcmliZVRvRmlsZVBhdGg6IChmaWxlUGF0aCkgLT5cbiAgICBAdHJpZ2dlciAndGl0bGUtY2hhbmdlZCdcbiAgICBAaGFuZGxlRXZlbnRzKClcbiAgICBAcmVuZGVySFRNTCgpXG5cbiAgcmVzb2x2ZUVkaXRvcjogKGVkaXRvcklkKSAtPlxuICAgIHJlc29sdmUgPSA9PlxuICAgICAgQGVkaXRvciA9IEBlZGl0b3JGb3JJZChlZGl0b3JJZClcblxuICAgICAgaWYgQGVkaXRvcj9cbiAgICAgICAgQHRyaWdnZXIgJ3RpdGxlLWNoYW5nZWQnIGlmIEBlZGl0b3I/XG4gICAgICAgIEBoYW5kbGVFdmVudHMoKVxuICAgICAgZWxzZVxuICAgICAgICAjIFRoZSBlZGl0b3IgdGhpcyBwcmV2aWV3IHdhcyBjcmVhdGVkIGZvciBoYXMgYmVlbiBjbG9zZWQgc28gY2xvc2VcbiAgICAgICAgIyB0aGlzIHByZXZpZXcgc2luY2UgYSBwcmV2aWV3IGNhbm5vdCBiZSByZW5kZXJlZCB3aXRob3V0IGFuIGVkaXRvclxuICAgICAgICBhdG9tLndvcmtzcGFjZT8ucGFuZUZvckl0ZW0odGhpcyk/LmRlc3Ryb3lJdGVtKHRoaXMpXG5cbiAgICBpZiBhdG9tLndvcmtzcGFjZT9cbiAgICAgIHJlc29sdmUoKVxuICAgIGVsc2VcbiAgICAgICMgQHN1YnNjcmliZSBhdG9tLnBhY2thZ2VzLm9uY2UgJ2FjdGl2YXRlZCcsID0+XG4gICAgICBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVQYWNrYWdlID0+XG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgICBAcmVuZGVySFRNTCgpXG5cbiAgZWRpdG9yRm9ySWQ6IChlZGl0b3JJZCkgLT5cbiAgICBmb3IgZWRpdG9yIGluIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICAgIHJldHVybiBlZGl0b3IgaWYgZWRpdG9yLmlkPy50b1N0cmluZygpIGlzIGVkaXRvcklkLnRvU3RyaW5nKClcbiAgICBudWxsXG5cbiAgaGFuZGxlRXZlbnRzOiA9PlxuICAgIGNvbnRleHRNZW51Q2xpZW50WCA9IDBcbiAgICBjb250ZXh0TWVudUNsaWVudFkgPSAwXG5cbiAgICBAb24gJ2NvbnRleHRtZW51JywgKGV2ZW50KSAtPlxuICAgICAgY29udGV4dE1lbnVDbGllbnRZID0gZXZlbnQuY2xpZW50WVxuICAgICAgY29udGV4dE1lbnVDbGllbnRYID0gZXZlbnQuY2xpZW50WFxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgQGVsZW1lbnQsXG4gICAgICAnYXRvbS1odG1sLXByZXZpZXc6b3Blbi1kZXZ0b29scyc6ID0+XG4gICAgICAgIEB3ZWJ2aWV3Lm9wZW5EZXZUb29scygpXG4gICAgICAnYXRvbS1odG1sLXByZXZpZXc6aW5zcGVjdCc6ID0+XG4gICAgICAgIEB3ZWJ2aWV3Lmluc3BlY3RFbGVtZW50KGNvbnRleHRNZW51Q2xpZW50WCwgY29udGV4dE1lbnVDbGllbnRZKVxuICAgICAgJ2F0b20taHRtbC1wcmV2aWV3OnByaW50JzogPT5cbiAgICAgICAgQHdlYnZpZXcucHJpbnQoKVxuXG5cbiAgICBjaGFuZ2VIYW5kbGVyID0gPT5cbiAgICAgIEByZW5kZXJIVE1MKClcbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKEBnZXRVUkkoKSlcbiAgICAgIGlmIHBhbmU/IGFuZCBwYW5lIGlzbnQgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKHRoaXMpXG5cbiAgICBAZWRpdG9yU3ViID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIGlmIEBlZGl0b3I/XG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWh0bWwtcHJldmlldy50cmlnZ2VyT25TYXZlXCIpXG4gICAgICAgIEBlZGl0b3JTdWIuYWRkIEBlZGl0b3Iub25EaWRTYXZlIGNoYW5nZUhhbmRsZXJcbiAgICAgIGVsc2VcbiAgICAgICAgQGVkaXRvclN1Yi5hZGQgQGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZyBjaGFuZ2VIYW5kbGVyXG4gICAgICBAZWRpdG9yU3ViLmFkZCBAZWRpdG9yLm9uRGlkQ2hhbmdlUGF0aCA9PiBAdHJpZ2dlciAndGl0bGUtY2hhbmdlZCdcblxuICByZW5kZXJIVE1MOiAtPlxuICAgIGlmIEBlZGl0b3I/XG4gICAgICBpZiBub3QgYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1odG1sLXByZXZpZXcudHJpZ2dlck9uU2F2ZVwiKSAmJiBAZWRpdG9yLmdldFBhdGgoKT9cbiAgICAgICAgQHNhdmUoQHJlbmRlckhUTUxDb2RlKVxuICAgICAgZWxzZVxuICAgICAgICBAcmVuZGVySFRNTENvZGUoKVxuXG4gIHNhdmU6IChjYWxsYmFjaykgLT5cbiAgICAjIFRlbXAgZmlsZSBwYXRoXG4gICAgb3V0UGF0aCA9IHBhdGgucmVzb2x2ZSBwYXRoLmpvaW4ob3MudG1wZGlyKCksIEBlZGl0b3IuZ2V0VGl0bGUoKSArIFwiLmh0bWxcIilcbiAgICBvdXQgPSBcIlwiXG4gICAgZmlsZUVuZGluZyA9IEBlZGl0b3IuZ2V0VGl0bGUoKS5zcGxpdChcIi5cIikucG9wKClcblxuICAgIGlmIGF0b20uY29uZmlnLmdldChcImF0b20taHRtbC1wcmV2aWV3LmVuYWJsZU1hdGhKYXhcIilcbiAgICAgIG91dCArPSBcIlwiXCJcbiAgICAgIDxzY3JpcHQgdHlwZT1cInRleHQveC1tYXRoamF4LWNvbmZpZ1wiPlxuICAgICAgTWF0aEpheC5IdWIuQ29uZmlnKHtcbiAgICAgIHRleDJqYXg6IHtpbmxpbmVNYXRoOiBbWydcXFxcXFxcXGYkJywnXFxcXFxcXFxmJCddXX0sXG4gICAgICBtZW51U2V0dGluZ3M6IHt6b29tOiAnQ2xpY2snfVxuICAgICAgfSk7XG4gICAgICA8L3NjcmlwdD5cbiAgICAgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiXG4gICAgICBzcmM9XCJodHRwOi8vY2RuLm1hdGhqYXgub3JnL21hdGhqYXgvbGF0ZXN0L01hdGhKYXguanM/Y29uZmlnPVRlWC1BTVMtTU1MX0hUTUxvck1NTFwiPlxuICAgICAgPC9zY3JpcHQ+XG4gICAgICBcIlwiXCJcblxuICAgIGlmIGF0b20uY29uZmlnLmdldChcImF0b20taHRtbC1wcmV2aWV3LnByZXNlcnZlV2hpdGVTcGFjZXNcIikgYW5kIGZpbGVFbmRpbmcgaW4gYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1odG1sLXByZXZpZXcuZmlsZUVuZGluZ3NcIilcbiAgICAgICMgRW5jbG9zZSBpbiA8cHJlPiBzdGF0ZW1lbnQgdG8gcHJlc2VydmUgd2hpdGVzcGFjZXNcbiAgICAgIG91dCArPSBcIlwiXCJcbiAgICAgIDxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj5cbiAgICAgIGJvZHkgeyB3aGl0ZS1zcGFjZTogcHJlOyB9XG4gICAgICA8L3N0eWxlPlxuICAgICAgXCJcIlwiXG4gICAgZWxzZVxuICAgICAgIyBBZGQgYmFzZSB0YWc7IGFsbG93IHJlbGF0aXZlIGxpbmtzIHRvIHdvcmsgZGVzcGl0ZSBiZWluZyBsb2FkZWRcbiAgICAgICMgYXMgdGhlIHNyYyBvZiBhbiB3ZWJ2aWV3XG4gICAgICBvdXQgKz0gXCI8YmFzZSBocmVmPVxcXCJcIiArIEBnZXRQYXRoKCkgKyBcIlxcXCI+XCJcblxuICAgICMgU2Nyb2xsIGludG8gdmlld1xuICAgIGVkaXRvclRleHQgPSBAZWRpdG9yLmdldFRleHQoKVxuICAgIGZpcnN0U2VsZWN0aW9uID0gdGhpcy5lZGl0b3IuZ2V0U2VsZWN0aW9ucygpWzBdXG4gICAgeyByb3csIGNvbHVtbiB9ID0gZmlyc3RTZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5zdGFydFxuXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1odG1sLXByZXZpZXcuc2Nyb2xsVG9DdXJzb3JcIilcbiAgICAgIHRyeVxuICAgICAgICBvZmZzZXQgPSBAX2dldE9mZnNldChlZGl0b3JUZXh0LCByb3csIGNvbHVtbilcblxuICAgICAgICB0YWdSRSA9IC88KChcXC9bXFwkXFx3XFwtXSl8YnJ8aW5wdXR8bGluaylcXC8/Pi8uc291cmNlXG4gICAgICAgIGxhc3RUYWdSRT0gLy8vI3t0YWdSRX0oPyFbXFxzXFxTXSoje3RhZ1JFfSkvLy9pXG4gICAgICAgIGZpbmRUYWdCZWZvcmUgPSAoYmVmb3JlSW5kZXgpIC0+XG4gICAgICAgICAgI3NhbXBsZSA9IGVkaXRvclRleHQuc2xpY2Uoc3RhcnRJbmRleCwgc3RhcnRJbmRleCArIDMwMClcbiAgICAgICAgICBtYXRjaGVkQ2xvc2luZ1RhZyA9IGVkaXRvclRleHQuc2xpY2UoMCwgYmVmb3JlSW5kZXgpLm1hdGNoKGxhc3RUYWdSRSlcbiAgICAgICAgICBpZiBtYXRjaGVkQ2xvc2luZ1RhZ1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoZWRDbG9zaW5nVGFnLmluZGV4ICsgbWF0Y2hlZENsb3NpbmdUYWdbMF0ubGVuZ3RoXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIC0xXG5cbiAgICAgICAgdGFnSW5kZXggPSBmaW5kVGFnQmVmb3JlKG9mZnNldClcbiAgICAgICAgaWYgdGFnSW5kZXggPiAtMVxuICAgICAgICAgIGVkaXRvclRleHQgPSBcIlwiXCJcbiAgICAgICAgICAje2VkaXRvclRleHQuc2xpY2UoMCwgdGFnSW5kZXgpfVxuICAgICAgICAgICN7c2Nyb2xsSW5qZWN0U2NyaXB0fVxuICAgICAgICAgICN7ZWRpdG9yVGV4dC5zbGljZSh0YWdJbmRleCl9XG4gICAgICAgICAgXCJcIlwiXG5cbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIHJldHVybiAtMVxuXG4gICAgb3V0ICs9IGVkaXRvclRleHRcblxuICAgIEB0bXBQYXRoID0gb3V0UGF0aFxuICAgIGZzLndyaXRlRmlsZSBvdXRQYXRoLCBvdXQsID0+XG4gICAgICB0cnlcbiAgICAgICAgQHJlbmRlckhUTUxDb2RlKClcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIEBzaG93RXJyb3IgZXJyb3JcblxuICByZW5kZXJIVE1MQ29kZTogKCkgLT5cbiAgICBAZmluZCgnLnNob3ctZXJyb3InKS5oaWRlKClcbiAgICBAaHRtbHZpZXcuc2hvdygpXG5cbiAgICBpZiBAd2Vidmlld0VsZW1lbnRMb2FkZWRcbiAgICAgIEB3ZWJ2aWV3LmxvYWRVUkwoXCJmaWxlOi8vXCIgKyBAdG1wUGF0aClcblxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCAnYXRvbS1odG1sLXByZXZpZXcnLCAnaHRtbC1jaGFuZ2VkJ1xuICAgIGVsc2VcbiAgICAgIEByZW5kZXJMYXRlciA9IHRydWVcblxuICAjIEdldCB0aGUgb2Zmc2V0IG9mIGEgZmlsZSBhdCBhIHNwZWNpZmljIFBvaW50IGluIHRoZSBmaWxlXG4gIF9nZXRPZmZzZXQ6ICh0ZXh0LCByb3csIGNvbHVtbj0wKSAtPlxuICAgIGxpbmVfcmUgPSAvXFxuL2dcbiAgICBtYXRjaF9pbmRleCA9IG51bGxcbiAgICB3aGlsZSByb3ctLVxuICAgICAgaWYgbWF0Y2ggPSBsaW5lX3JlLmV4ZWModGV4dClcbiAgICAgICAgbWF0Y2hfaW5kZXggPSBtYXRjaC5pbmRleFxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gLTFcbiAgICBvZmZzZXQgPSBtYXRjaF9pbmRleCArIGNvbHVtblxuICAgIHJldHVybiBpZiBvZmZzZXQgPCB0ZXh0Lmxlbmd0aCB0aGVuIG9mZnNldCBlbHNlIC0xXG5cblxuICBnZXRUaXRsZTogLT5cbiAgICBpZiBAZWRpdG9yP1xuICAgICAgXCIje0BlZGl0b3IuZ2V0VGl0bGUoKX0gUHJldmlld1wiXG4gICAgZWxzZVxuICAgICAgXCJIVE1MIFByZXZpZXdcIlxuXG4gIGdldFVSSTogLT5cbiAgICBcImh0bWwtcHJldmlldzovL2VkaXRvci8je0BlZGl0b3JJZH1cIlxuXG4gIGdldFBhdGg6IC0+XG4gICAgaWYgQGVkaXRvcj9cbiAgICAgIEBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgc2hvd0Vycm9yOiAocmVzdWx0KSAtPlxuICAgIGZhaWx1cmVNZXNzYWdlID0gcmVzdWx0Py5tZXNzYWdlXG5cbiAgICBAaHRtbHZpZXcuaGlkZSgpXG4gICAgQGZpbmQoJy5zaG93LWVycm9yJylcbiAgICAuaHRtbCAkJCQgLT5cbiAgICAgIEBoMiAnUHJldmlld2luZyBIVE1MIEZhaWxlZCdcbiAgICAgIEBoMyBmYWlsdXJlTWVzc2FnZSBpZiBmYWlsdXJlTWVzc2FnZT9cbiAgICAuc2hvdygpXG4iXX0=
