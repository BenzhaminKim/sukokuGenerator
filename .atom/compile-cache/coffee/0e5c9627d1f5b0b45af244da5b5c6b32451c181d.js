(function() {
  var CompositeDisposable, OpenInBrowsersView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  OpenInBrowsersView = (function(superClass) {
    extend(OpenInBrowsersView, superClass);

    function OpenInBrowsersView() {
      this.subscriptions = new CompositeDisposable;
      OpenInBrowsersView.__super__.constructor.apply(this, arguments);
    }

    OpenInBrowsersView.prototype.initialize = function() {
      var browser, browserList, i, len, ref, results, title;
      this.browsers = require('./config.coffee').browser[process.platform];
      browserList = atom.config.get('open-in-browsers.browsers');
      results = [];
      for (i = 0, len = browserList.length; i < len; i++) {
        browser = browserList[i];
        title = (ref = this[browser]) != null ? typeof ref.attr === "function" ? ref.attr('title') : void 0 : void 0;
        if (title) {
          results.push(this.subscriptions.add(atom.tooltips.add(this[browser], {
            title: title
          })));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    OpenInBrowsersView.content = function(browsers) {
      var browserClass, pkgs;
      if (browsers == null) {
        browsers = atom.config.get('open-in-browsers.browsers');
      }
      browserClass = '';
      pkgs = atom.packages.getAvailablePackageNames();
      this.pp = !!~pkgs.indexOf('pp');
      this.bp = !!~pkgs.indexOf('browser-plus');
      return this.span({
        "class": 'open-in-browsers'
      }, (function(_this) {
        return function() {
          var browser, color, i, len, results, style, title;
          results = [];
          for (i = 0, len = browsers.length; i < len; i++) {
            browser = browsers[i];
            if (atom.config.get("open-in-browsers." + browser)) {
              if (browser === 'BrowserPlus' && !_this.bp) {
                continue;
              }
              if (browser === 'BrowserPlus' && _this.pp && browsers.length > 1) {
                continue;
              }
              if (browser === 'BrowserPlus') {
                browserClass = "browser-plus-icon";
              } else {
                browserClass = "fa " + browser;
              }
              if (_this.curBrowser === browser) {
                browserClass = +" selected ";
              }
              if (typeof atom.config.get("open-in-browsers." + browser) === "object") {
                if (atom.config.get("open-in-browsers." + browser + ".path").trim() === '') {
                  results.push(browserClass += " hide ");
                } else {
                  color = atom.config.get("open-in-browsers." + browser + ".color");
                  style = "color: rgb(" + color.red + ", " + color.green + ", " + color.blue + ");";
                  title = atom.config.get("open-in-browsers." + browser + ".tooltip");
                  results.push(_this.span({
                    style: "" + style,
                    title: "" + title,
                    "class": browserClass,
                    'data-browser': "" + browser,
                    mousedown: 'openBrowser'
                  }));
                }
              } else {
                title = browser;
                results.push(_this.span({
                  title: "" + browser,
                  "class": browserClass,
                  'data-browser': "" + browser,
                  mousedown: 'openBrowser',
                  outlet: "" + browser
                }));
              }
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
      })(this));
    };

    OpenInBrowsersView.prototype.openBrowser = function(evt, target, browser) {
      var ref;
      if (browser) {
        this.currBrowser = browser;
      } else {
        if (target != null ? typeof target.data === "function" ? target.data('browser') : void 0 : void 0) {
          this.currBrowser = target.data('browser');
        }
      }
      if (!this.currBrowser) {
        this.currBrowser = atom.config.get('open-in-browsers.defBrowser') || 'Chrome';
      }
      this.curBrowserCmd = (ref = this.browsers["" + this.currBrowser]) != null ? ref.cmd : void 0;
      if (typeof this.children === "function") {
        this.children().removeClass("selected");
      }
      if (typeof this.children === "function") {
        this.children("." + this.currBrowser).addClass('selected');
      }
      if (!this.pp) {
        this.open(this.curBrowserCmd, evt, target);
        return;
      }
      if (!evt) {
        this.open(this.curBrowserCmd, evt, target);
      }
    };

    OpenInBrowsersView.prototype.getFilePath = function(target) {
      var editor, fpath, ref;
      if (this.htmlURL) {
        return this.htmlURL;
      }
      if (target) {
        fpath = typeof target.closest === "function" ? (ref = target.closest('.entry')) != null ? typeof ref.getPath === "function" ? ref.getPath() : void 0 : void 0 : void 0;
      }
      if (!fpath) {
        if (!this.fileName) {
          editor = atom.workspace.getActiveTextEditor();
          if (!editor) {
            return;
          }
          fpath = editor.getPath();
        } else {
          fpath = this.fileName;
        }
      }
      return OpenInBrowsersView.getFilePath(fpath);
    };

    OpenInBrowsersView.prototype.open = function(cmd, evt, target) {
      var exec, fpath, ref;
      if (cmd == null) {
        cmd = this.curBrowserCmd;
      }
      exec = require('child_process').exec;
      if (this.currBrowser === 'BrowserPlus') {
        fpath = this.getFilePath(target);
        atom.workspace.open(fpath);
        return false;
      }
      if (!cmd) {
        this.openBrowser();
        return false;
      }
      fpath = this.getFilePath(target);
      cmd = cmd + "\"" + fpath + "\"";
      if (fpath) {
        exec(cmd);
      }
      if ((ref = this.selectList) != null) {
        ref.cancel();
      }
      return false;
    };

    OpenInBrowsersView.prototype.serialize = function() {};

    OpenInBrowsersView.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    OpenInBrowsersView.prototype.getElement = function() {};

    OpenInBrowsersView.getFilePath = function(fpath) {
      var e, folder, loadJson, proj, projFile, projectPath, ref, ref1, url;
      projectPath = (ref = atom.project.getPaths()[0]) != null ? ref.replace(/\\/g, '/') : void 0;
      fpath = fpath.replace(/\\/g, '/');
      loadJson = require('load-json-file');
      try {
        projFile = atom.config.get("open-in-browsers.project") || "proj.json";
        proj = loadJson.sync(projectPath + "/" + projFile);
        if (proj) {
          url = proj.localhost.url;
          folder = (ref1 = proj.localhost.folder) != null ? ref1.replace(/\\/g, '/') : void 0;
          if (folder && fpath.startsWith(folder) && fpath.indexOf(folder) >= 0) {
            return fpath = fpath.replace(folder, url);
          } else {
            if (url) {
              return fpath = url + "/" + fpath;
            }
          }
        } else {
          return fpath = "file:///" + fpath;
        }
      } catch (error) {
        e = error;
        return fpath = "file:///" + fpath;
      }
    };

    return OpenInBrowsersView;

  })(View);

  module.exports = {
    OpenInBrowsersView: OpenInBrowsersView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL29wZW4taW4tYnJvd3NlcnMvbGliL29wZW4taW4tYnJvd3NlcnMtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUE7OztFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSOztFQUNSLHNCQUF3QixPQUFBLENBQVEsTUFBUjs7RUFFbkI7OztJQUNTLDRCQUFBO01BQ1gsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixxREFBQSxTQUFBO0lBRlc7O2lDQUliLFVBQUEsR0FBWSxTQUFBO0FBQ1YsVUFBQTtNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksT0FBQSxDQUFRLGlCQUFSLENBQTBCLENBQUMsT0FBUSxDQUFBLE9BQU8sQ0FBQyxRQUFSO01BQy9DLFdBQUEsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCO0FBQ2Q7V0FBQSw2Q0FBQTs7UUFDRSxLQUFBLHVFQUFrQixDQUFFLEtBQU07UUFDMUIsSUFBa0UsS0FBbEU7dUJBQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFFLENBQUEsT0FBQSxDQUFwQixFQUE2QjtZQUFDLEtBQUEsRUFBTSxLQUFQO1dBQTdCLENBQW5CLEdBQUE7U0FBQSxNQUFBOytCQUFBOztBQUZGOztJQUhVOztJQU9aLGtCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsUUFBRDtBQUNSLFVBQUE7O1FBRFMsV0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCOztNQUNwQixZQUFBLEdBQWU7TUFDZixJQUFBLEdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBZCxDQUFBO01BQ1AsSUFBQyxDQUFBLEVBQUQsR0FBTSxDQUFDLENBQUMsQ0FB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QSxnREFBZ0MsQ0FBRSxPQUF6QixDQUFpQyxLQUFqQyxFQUF1QyxHQUF2QztVQUNULElBQUcsTUFBQSxJQUFXLEtBQUssQ0FBQyxVQUFOLENBQWlCLE1BQWpCLENBQVgsSUFBd0MsS0FBSyxDQUFDLE9BQU4sQ0FBYyxNQUFkLENBQUEsSUFBeUIsQ0FBcEU7bUJBQ0UsS0FBQSxHQUFRLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBZCxFQUFxQixHQUFyQixFQURWO1dBQUEsTUFBQTtZQUdFLElBQTZCLEdBQTdCO3FCQUFBLEtBQUEsR0FBVyxHQUFELEdBQUssR0FBTCxHQUFRLE1BQWxCO2FBSEY7V0FIRjtTQUFBLE1BQUE7aUJBUUUsS0FBQSxHQUFRLFVBQUEsR0FBVyxNQVJyQjtTQUhGO09BQUEsYUFBQTtRQVlNO2VBQ0osS0FBQSxHQUFRLFVBQUEsR0FBVyxNQWJyQjs7SUFUWTs7OztLQXRHaUI7O0VBNkhqQyxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUFFLG9CQUFBLGtCQUFGOztBQWhJakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbntDb21wb3NpdGVEaXNwb3NhYmxlfSAgPSByZXF1aXJlICdhdG9tJ1xuXG5jbGFzcyBPcGVuSW5Ccm93c2Vyc1ZpZXcgZXh0ZW5kcyBWaWV3XG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBzdXBlclxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQGJyb3dzZXJzID0gcmVxdWlyZSgnLi9jb25maWcuY29mZmVlJykuYnJvd3Nlcltwcm9jZXNzLnBsYXRmb3JtXVxuICAgIGJyb3dzZXJMaXN0ID0gYXRvbS5jb25maWcuZ2V0KCdvcGVuLWluLWJyb3dzZXJzLmJyb3dzZXJzJylcbiAgICBmb3IgYnJvd3NlciBpbiBicm93c2VyTGlzdFxuICAgICAgdGl0bGUgPSBAW2Jyb3dzZXJdPy5hdHRyPygndGl0bGUnKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20udG9vbHRpcHMuYWRkKEBbYnJvd3Nlcl0se3RpdGxlOnRpdGxlfSkgaWYgdGl0bGVcblxuICBAY29udGVudDogKGJyb3dzZXJzID0gYXRvbS5jb25maWcuZ2V0KCdvcGVuLWluLWJyb3dzZXJzLmJyb3dzZXJzJykpLT5cbiAgICBicm93c2VyQ2xhc3MgPSAnJ1xuICAgIHBrZ3MgPSBhdG9tLnBhY2thZ2VzLmdldEF2YWlsYWJsZVBhY2thZ2VOYW1lcygpXG4gICAgQHBwID0gISF+cGtncy5pbmRleE9mKCdwcCcpXG4gICAgQGJwID0gISF+cGtncy5pbmRleE9mKCdicm93c2VyLXBsdXMnKVxuICAgIEBzcGFuIGNsYXNzOiAnb3Blbi1pbi1icm93c2VycycsID0+XG4gICAgICBmb3IgYnJvd3NlciBpbiBicm93c2Vyc1xuICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoXCJvcGVuLWluLWJyb3dzZXJzLiN7YnJvd3Nlcn1cIilcbiAgICAgICAgICBjb250aW51ZSBpZiBicm93c2VyIGlzICdCcm93c2VyUGx1cycgYW5kIG5vdCBAYnBcbiAgICAgICAgICBjb250aW51ZSBpZiBicm93c2VyIGlzICdCcm93c2VyUGx1cycgYW5kIEBwcCBhbmQgYnJvd3NlcnMubGVuZ3RoID4gMVxuICAgICAgICAgIGlmIGJyb3dzZXIgaXMgJ0Jyb3dzZXJQbHVzJ1xuICAgICAgICAgICAgYnJvd3NlckNsYXNzID0gXCJicm93c2VyLXBsdXMtaWNvblwiXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYnJvd3NlckNsYXNzID0gXCJmYSAje2Jyb3dzZXJ9XCJcbiAgICAgICAgICBpZiBAY3VyQnJvd3NlciBpcyBicm93c2VyXG4gICAgICAgICAgICBicm93c2VyQ2xhc3MgID0rIFwiIHNlbGVjdGVkIFwiXG5cbiAgICAgICAgICBpZiB0eXBlb2YgYXRvbS5jb25maWcuZ2V0KFwib3Blbi1pbi1icm93c2Vycy4je2Jyb3dzZXJ9XCIpIGlzIFwib2JqZWN0XCJcbiAgICAgICAgICAgIGlmIGF0b20uY29uZmlnLmdldChcIm9wZW4taW4tYnJvd3NlcnMuI3ticm93c2VyfS5wYXRoXCIpLnRyaW0oKSBpcyAnJ1xuICAgICAgICAgICAgICBicm93c2VyQ2xhc3MgKz0gXCIgaGlkZSBcIlxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBjb2xvciA9IGF0b20uY29uZmlnLmdldChcIm9wZW4taW4tYnJvd3NlcnMuI3ticm93c2VyfS5jb2xvclwiKVxuICAgICAgICAgICAgICBzdHlsZSA9IFwiY29sb3I6IHJnYigje2NvbG9yLnJlZH0sICN7Y29sb3IuZ3JlZW59LCAje2NvbG9yLmJsdWV9KTtcIlxuICAgICAgICAgICAgICB0aXRsZSA9IGF0b20uY29uZmlnLmdldChcIm9wZW4taW4tYnJvd3NlcnMuI3ticm93c2VyfS50b29sdGlwXCIpXG4gICAgICAgICAgICAgIEBzcGFuIHN0eWxlOlwiI3tzdHlsZX1cIiwgdGl0bGU6XCIje3RpdGxlfVwiLCBjbGFzczpicm93c2VyQ2xhc3MsJ2RhdGEtYnJvd3Nlcic6XCIje2Jyb3dzZXJ9XCIsIG1vdXNlZG93bjonb3BlbkJyb3dzZXInXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGl0bGUgPSBicm93c2VyXG4gICAgICAgICAgICBAc3BhbiB0aXRsZTpcIiN7YnJvd3Nlcn1cIiwgY2xhc3M6YnJvd3NlckNsYXNzLCdkYXRhLWJyb3dzZXInOlwiI3ticm93c2VyfVwiLCBtb3VzZWRvd246J29wZW5Ccm93c2VyJyxvdXRsZXQ6XCIje2Jyb3dzZXJ9XCJcblxuXG4gIG9wZW5Ccm93c2VyOiAoZXZ0LHRhcmdldCxicm93c2VyKS0+XG4gICAgaWYgYnJvd3NlclxuICAgICAgQGN1cnJCcm93c2VyID0gYnJvd3NlclxuICAgIGVsc2VcbiAgICAgIEBjdXJyQnJvd3NlciA9IHRhcmdldC5kYXRhKCdicm93c2VyJykgaWYgdGFyZ2V0Py5kYXRhPygnYnJvd3NlcicpXG5cbiAgICB1bmxlc3MgQGN1cnJCcm93c2VyXG4gICAgICBAY3VyckJyb3dzZXIgPSBhdG9tLmNvbmZpZy5nZXQoJ29wZW4taW4tYnJvd3NlcnMuZGVmQnJvd3NlcicpIG9yICdDaHJvbWUnXG5cbiAgICBAY3VyQnJvd3NlckNtZCA9IEBicm93c2Vyc1tcIiN7QGN1cnJCcm93c2VyfVwiXT8uY21kXG5cbiAgICBAY2hpbGRyZW4/KCkucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZFwiKVxuICAgIEBjaGlsZHJlbj8oXCIuI3tAY3VyckJyb3dzZXJ9XCIpLmFkZENsYXNzKCdzZWxlY3RlZCcpXG4gICAgdW5sZXNzIEBwcFxuICAgICAgQG9wZW4oQGN1ckJyb3dzZXJDbWQsZXZ0LHRhcmdldClcbiAgICAgIHJldHVyblxuICAgIHVubGVzcyBldnRcbiAgICAgIEBvcGVuKEBjdXJCcm93c2VyQ21kLGV2dCx0YXJnZXQpXG4gICAgICByZXR1cm5cblxuICBnZXRGaWxlUGF0aDogKHRhcmdldCktPlxuICAgIHJldHVybiBAaHRtbFVSTCBpZiBAaHRtbFVSTFxuICAgIGlmIHRhcmdldFxuICAgICAgIGZwYXRoID0gdGFyZ2V0LmNsb3Nlc3Q/KCcuZW50cnknKT8uZ2V0UGF0aD8oKVxuICAgIHVubGVzcyBmcGF0aFxuICAgICAgdW5sZXNzIEBmaWxlTmFtZVxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgcmV0dXJuIHVubGVzcyBlZGl0b3JcbiAgICAgICAgZnBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBlbHNlXG4gICAgICAgIGZwYXRoID0gQGZpbGVOYW1lXG4gICAgT3BlbkluQnJvd3NlcnNWaWV3LmdldEZpbGVQYXRoKGZwYXRoKVxuXG4gIG9wZW46IChjbWQgPSBAY3VyQnJvd3NlckNtZCxldnQsdGFyZ2V0KS0+XG4gICAgZXhlYyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXG4gICAgaWYgQGN1cnJCcm93c2VyIGlzICdCcm93c2VyUGx1cydcbiAgICAgIGZwYXRoID0gQGdldEZpbGVQYXRoKHRhcmdldClcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZnBhdGgpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB1bmxlc3MgY21kXG4gICAgICBAb3BlbkJyb3dzZXIoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgZnBhdGggPSBAZ2V0RmlsZVBhdGgodGFyZ2V0KVxuICAgIGNtZCA9IFwiI3tjbWR9XFxcIiN7ZnBhdGh9XFxcIlwiXG4gICAgI2NtZCA9IGNtZC5yZXBsYWNlIFwiL1xcXFwvZ1wiLCAnLydcbiAgICBleGVjICBjbWQgaWYgZnBhdGhcbiAgICBAc2VsZWN0TGlzdD8uY2FuY2VsKClcblxuICAgIHJldHVybiBmYWxzZVxuXG4gICMgUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgcmV0cmlldmVkIHdoZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWRcbiAgc2VyaWFsaXplOiAtPlxuXG4gICMgVGVhciBkb3duIGFueSBzdGF0ZSBhbmQgZGV0YWNoXG4gIGRlc3Ryb3k6IC0+XG4gICAgIyBAZWxlbWVudC5yZW1vdmUoKVxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICBnZXRFbGVtZW50OiAtPlxuICAgICMgQGVsZW1lbnRcblxuICBAZ2V0RmlsZVBhdGg6IChmcGF0aCktPlxuICAgICMgb3JkZXIgb2YgdGhlIGFjY2VwdGFuY2VcbiAgICAjIDEuIHNldHRpbmcgZm9yIGxvY2FsaG9zdFxuICAgICMgMi4gcHJvamVjdFxuICAgICMgMy4gZmlsZXBhdGggLSB3aGF0IGV2ZXIgaXMgcGFzc2VkXG4gICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXT8ucmVwbGFjZSgvXFxcXC9nLCcvJylcbiAgICBmcGF0aCA9IGZwYXRoLnJlcGxhY2UoL1xcXFwvZywnLycpXG5cbiAgICBsb2FkSnNvbiA9IHJlcXVpcmUoJ2xvYWQtanNvbi1maWxlJylcbiAgICB0cnlcbiAgICAgIHByb2pGaWxlID0gYXRvbS5jb25maWcuZ2V0KFwib3Blbi1pbi1icm93c2Vycy5wcm9qZWN0XCIpIG9yIFwicHJvai5qc29uXCJcbiAgICAgIHByb2ogPSBsb2FkSnNvbi5zeW5jKFwiI3twcm9qZWN0UGF0aH0vI3twcm9qRmlsZX1cIilcbiAgICAgIGlmKHByb2opXG4gICAgICAgIHVybCA9IHByb2oubG9jYWxob3N0LnVybFxuICAgICAgICBmb2xkZXIgPSAocHJvai5sb2NhbGhvc3QuZm9sZGVyKT8ucmVwbGFjZSgvXFxcXC9nLCcvJylcbiAgICAgICAgaWYgZm9sZGVyIGFuZCBmcGF0aC5zdGFydHNXaXRoKGZvbGRlcikgYW5kIGZwYXRoLmluZGV4T2YoZm9sZGVyKSA+PSAwXG4gICAgICAgICAgZnBhdGggPSBmcGF0aC5yZXBsYWNlKGZvbGRlcix1cmwpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBmcGF0aCA9IFwiI3t1cmx9LyN7ZnBhdGh9XCIgaWYgdXJsXG4gICAgICBlbHNlXG4gICAgICAgIGZwYXRoID0gXCJmaWxlOi8vLyN7ZnBhdGh9XCJcbiAgICBjYXRjaCBlXG4gICAgICBmcGF0aCA9IFwiZmlsZTovLy8je2ZwYXRofVwiXG5tb2R1bGUuZXhwb3J0cyA9IHsgT3BlbkluQnJvd3NlcnNWaWV3fVxuIl19
