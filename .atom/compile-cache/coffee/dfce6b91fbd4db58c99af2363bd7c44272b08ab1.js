(function() {
  var CompositeDisposable, OpenInBrowsers, OpenInBrowsersView,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  OpenInBrowsersView = require('./open-in-browsers-view').OpenInBrowsersView;

  module.exports = OpenInBrowsers = {
    openInBrowsersView: null,
    subscriptions: null,
    config: {
      browsers: {
        title: 'List of Browsers',
        type: 'array',
        "default": ['IE', 'Edge', 'Chrome', 'ChromePortable', 'Firefox', 'FirefoxPortable', 'Opera', 'Safari', 'SafariPortable', 'BrowserPlus']
      },
      defBrowser: {
        title: 'Default Browser',
        type: 'string',
        "default": 'Chrome',
        "enum": ['IE', 'Edge', 'Chrome', 'ChromePortable', 'Firefox', 'FirefoxPortable', 'Opera', 'Safari', 'SafariPortable', 'BrowserPlus']
      },
      fileTypes: {
        title: 'HTML File Types',
        type: 'array',
        "default": ['html', 'htm', 'xhtml']
      },
      IE: {
        title: 'IE',
        type: 'boolean',
        "default": true
      },
      Edge: {
        title: 'Edge',
        type: 'boolean',
        "default": false
      },
      Chrome: {
        title: 'Chrome',
        type: 'boolean',
        "default": true
      },
      Firefox: {
        title: 'Firefox',
        type: 'boolean',
        "default": true
      },
      Opera: {
        title: 'Opera',
        type: 'boolean',
        "default": true
      },
      Safari: {
        title: 'Safari',
        type: 'boolean',
        "default": true
      },
      BrowserPlus: {
        title: 'Browser Plus',
        type: 'boolean',
        "default": true
      },
      ChromePortable: {
        title: 'Chrome Portable',
        type: 'object',
        properties: {
          path: {
            type: 'string',
            "default": '',
            description: 'eg. C:\\Users\\Admin\\AppData\\Local\\Google\\"Chrome SxS"\\Application\\chrome.exe'
          },
          tooltip: {
            type: 'string',
            "default": 'Chrome Canary'
          },
          color: {
            type: 'color',
            "default": 'red'
          }
        }
      },
      FirefoxPortable: {
        title: 'Firefox Portable',
        type: 'object',
        properties: {
          path: {
            type: 'string',
            "default": ''
          },
          tooltip: {
            type: 'string',
            "default": 'Firefox Developer'
          },
          color: {
            type: 'color',
            "default": 'blue'
          }
        }
      },
      SafariPortable: {
        title: 'Safari Portable',
        type: 'object',
        properties: {
          path: {
            type: 'string',
            "default": ''
          },
          tooltip: {
            type: 'string',
            "default": 'Safari Portable'
          },
          color: {
            type: 'color',
            "default": 'green'
          }
        }
      },
      project: {
        title: 'Project/Local Host Combination Config File',
        type: 'string',
        description: 'contains the url and home folder',
        "default": 'proj.json'
      }
    },
    getPosition: function() {
      var activePane, orientation, paneAxis, paneIndex, ref;
      activePane = atom.workspace.paneForItem(atom.workspace.getActiveTextEditor());
      if (!activePane) {
        return;
      }
      paneAxis = activePane.getParent();
      if (!paneAxis) {
        return;
      }
      paneIndex = paneAxis.getPanes().indexOf(activePane);
      orientation = (ref = paneAxis.orientation) != null ? ref : 'horizontal';
      if (orientation === 'horizontal') {
        if (paneIndex === 0) {
          return 'right';
        } else {
          return 'left';
        }
      } else {
        if (paneIndex === 0) {
          return 'down';
        } else {
          return 'up';
        }
      }
    },
    consumeAddPreview: function(addPreview) {
      var requires;
      this.addPreview = addPreview;
      requires = {
        pkgName: 'open-in-browsers',
        fileTypes: (function() {
          var types;
          return types = atom.config.get('open-in-browsers.fileTypes');
        })(),
        browser: {
          noPreview: true,
          hyperLive: function() {
            return true;
          },
          quickPreview: true,
          viewClass: OpenInBrowsersView,
          viewArgs: ['BrowserPlus'],
          exe: function(src, options, data, fileName, quickPreview, hyperLive, editor, view) {
            var fpath, pp, ref, ref1, ref2, ref3, ref4, split;
            if (!atom.packages.getActivePackage('browser-plus')) {
              atom.notifications.addSuccess('APM Install Browser-Plus to display in browser-plus');
              return;
            }
            if (!(pp = atom.packages.getLoadedPackage('pp'))) {
              atom.notifications.addSuccess('APM Install PP(Preview-Plus) to display in browser-plus');
              return;
            }
            split = module.exports.getPosition();
            if (options.url) {
              atom.workspace.open(options.url, {
                searchAllPanes: true,
                split: split
              });
              return false;
            } else {
              fpath = OpenInBrowsersView.getFilePath(fileName);
              editor = (ref = atom.workspace.paneForURI(fpath)) != null ? (ref1 = ref.getItems()) != null ? ref1.find(function(pane) {
                return pane.getURI() === fpath;
              }) : void 0 : void 0;
              if (!editor) {
                fpath = fpath.replace(/\\/g, "/");
                editor = (ref2 = atom.workspace.paneForURI(fpath)) != null ? (ref3 = ref2.getItems()) != null ? ref3.find(function(pane) {
                  return pane.getURI() === fpath;
                }) : void 0 : void 0;
              }
              if (quickPreview || hyperLive || fileName.indexOf("~pp~")) {
                if (editor) {
                  editor.setText(src);
                } else {
                  atom.workspace.open(fpath, {
                    src: src,
                    split: split
                  });
                }
              } else {
                if ((typeof target !== "undefined" && target !== null ? (ref4 = target.dataset) != null ? ref4.path : void 0 : void 0) != null) {
                  fpath = target.dataset.path;
                }
                if (editor) {
                  editor.setText('');
                  editor.refresh();
                } else {
                  atom.workspace.open(fpath, {
                    split: split
                  });
                }
              }
              return false;
            }
          }
        },
        browsers: {
          noPreview: true,
          hyperLive: false,
          quickPreview: false,
          viewClass: OpenInBrowsersView,
          exe: function(src, options, data, fileName, quickPreview, hyperLive, editor, view) {
            if (options['url']) {
              this.vw.htmlURL = options['url'];
            } else {
              this.vw.htmlURL = void 0;
            }
            this.vw.fileName = fileName;
            return this.vw.open();
          }
        }
      };
      return this.ids = this.addPreview(requires);
    },
    activate: function(state) {
      var browser, browsers, fileType, i, j, len, len1, pkgs, ref, sel, submenu, title;
      this.openInBrowsersView = new OpenInBrowsersView();
      this.subscriptions = new CompositeDisposable;
      submenu = [];
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'open-in-browsers:toggle': (function(_this) {
          return function(target) {
            return _this.openInBrowsersView.openBrowser(null, target);
          };
        })(this)
      }));
      browsers = atom.config.get('open-in-browsers.browsers');
      pkgs = atom.packages.getAvailablePackageNames();
      for (i = 0, len = browsers.length; i < len; i++) {
        browser = browsers[i];
        if (atom.config.get("open-in-browsers." + browser)) {
          if (!(typeof atom.config.get("open-in-browsers." + browser) === "object" && atom.config.get("open-in-browsers." + browser + ".path").trim() === '')) {
            if (browser === 'BrowserPlus' && pkgs.indexOf('browser-plus') === -1) {
              continue;
            }
            atom.commands.add('atom-workspace', "open-in-browsers:" + browser, (function(_this) {
              return function(browser) {
                return function(arg) {
                  var target;
                  target = arg.target;
                  return _this.openInBrowsersView.openBrowser(null, target, browser);
                };
              };
            })(this)(browser));
            title = atom.config.get("open-in-browsers." + browser).tooltip || browser;
            submenu.push({
              label: "Open in " + title,
              command: "open-in-browsers:" + browser
            });
          }
        }
      }
      ref = atom.config.get('open-in-browsers.fileTypes');
      for (j = 0, len1 = ref.length; j < len1; j++) {
        fileType = ref[j];
        sel = {};
        sel['.tree-view .file .name[data-name$=".' + fileType + '"]'] = [
          {
            label: 'Open in Browsers',
            submenu: submenu
          }
        ];
        atom.contextMenu.add(sel);
      }
      return atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(activePane) {
          if (_this.pp === void 0) {
            pkgs = atom.packages.getAvailablePackageNames();
            _this.pp = !!~pkgs.indexOf('pp');
          }
          if (!_this.pp) {
            _this.updateStatusBar(activePane);
            return activePane != null ? typeof activePane.onDidChangeTitle === "function" ? activePane.onDidChangeTitle(function() {
              return _this.updateStatusBar();
            }) : void 0 : void 0;
          }
        };
      })(this));
    },
    consumeStatusBar: function(statusBar) {
      var pkgs;
      this.statusBar = statusBar;
      if (this.pp === void 0) {
        pkgs = atom.packages.getAvailablePackageNames();
        this.pp = !!~pkgs.indexOf('pp');
      }
      if (this.pp) {
        return "</span>";
      } else {
        this.openInBrowsersView || (this.openInBrowsersView = new OpenInBrowsersView());
        return this.updateStatusBar();
      }
    },
    updateStatusBar: function(editor) {
      var filePath, path, ref, ref1, ref2, ref3;
      if (editor == null) {
        editor = atom.workspace.getActivePaneItem();
      }
      path = require('path');
      filePath = editor != null ? (ref = editor.buffer) != null ? (ref1 = ref.file) != null ? ref1.path : void 0 : void 0 : void 0;
      if (filePath && (ref2 = path.extname(filePath).substr(1), indexOf.call(atom.config.get('open-in-browsers.fileTypes'), ref2) >= 0)) {
        return this.browserBar = this.statusBar.addLeftTile({
          item: this.openInBrowsersView,
          priority: 100
        });
      } else {
        return (ref3 = this.browserBar) != null ? ref3.destroy() : void 0;
      }
    },
    deactivate: function() {
      return this.openInBrowsersView.destroy();
    },
    serialize: function() {
      return {
        openInBrowsersViewState: this.openInBrowsersView.serialize()
      };
    },
    toggle: function() {}
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL29wZW4taW4tYnJvd3NlcnMvbGliL29wZW4taW4tYnJvd3NlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx1REFBQTtJQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDdkIscUJBQXNCLE9BQUEsQ0FBUSx5QkFBUjs7RUFFdkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FBQSxHQUNmO0lBQUEsa0JBQUEsRUFBb0IsSUFBcEI7SUFDQSxhQUFBLEVBQWUsSUFEZjtJQUVBLE1BQUEsRUFFRTtNQUFBLFFBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxrQkFBUDtRQUNBLElBQUEsRUFBTSxPQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUFFLElBQUYsRUFBUSxNQUFSLEVBQWdCLFFBQWhCLEVBQTBCLGdCQUExQixFQUE0QyxTQUE1QyxFQUF1RCxpQkFBdkQsRUFBMEUsT0FBMUUsRUFBbUYsUUFBbkYsRUFBNkYsZ0JBQTdGLEVBQStHLGFBQS9HLENBRlQ7T0FERjtNQUtBLFVBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxpQkFBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxRQUZUO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFFLElBQUYsRUFBUSxNQUFSLEVBQWdCLFFBQWhCLEVBQTBCLGdCQUExQixFQUE0QyxTQUE1QyxFQUF1RCxpQkFBdkQsRUFBMEUsT0FBMUUsRUFBbUYsUUFBbkYsRUFBNkYsZ0JBQTdGLEVBQStHLGFBQS9HLENBSE47T0FORjtNQVdBLFNBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxpQkFBUDtRQUNBLElBQUEsRUFBTSxPQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUFDLE1BQUQsRUFBUSxLQUFSLEVBQWMsT0FBZCxDQUZUO09BWkY7TUFlQSxFQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sSUFBUDtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUZUO09BaEJGO01Bb0JBLElBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxNQUFQO1FBQ0EsSUFBQSxFQUFNLFNBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRlQ7T0FyQkY7TUF5QkEsTUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLFFBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFGVDtPQTFCRjtNQThCQSxPQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sU0FBUDtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUZUO09BL0JGO01BbUNBLEtBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxPQUFQO1FBQ0EsSUFBQSxFQUFNLFNBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRlQ7T0FwQ0Y7TUF3Q0EsTUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLFFBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFGVDtPQXpDRjtNQTZDQSxXQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sY0FBUDtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUZUO09BOUNGO01Ba0RBLGNBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxpQkFBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsVUFBQSxFQUNFO1VBQUEsSUFBQSxFQUNFO1lBQUEsSUFBQSxFQUFNLFFBQU47WUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRFQ7WUFFQSxXQUFBLEVBQWEscUZBRmI7V0FERjtVQUlBLE9BQUEsRUFDRTtZQUFBLElBQUEsRUFBTSxRQUFOO1lBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBVSxlQURWO1dBTEY7VUFPQSxLQUFBLEVBQ0U7WUFBQSxJQUFBLEVBQU0sT0FBTjtZQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtXQVJGO1NBSEY7T0FuREY7TUFpRUEsZUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGtCQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxVQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQ0U7WUFBQSxJQUFBLEVBQU0sUUFBTjtZQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtXQURGO1VBR0EsT0FBQSxFQUNFO1lBQUEsSUFBQSxFQUFNLFFBQU47WUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLG1CQURWO1dBSkY7VUFNQSxLQUFBLEVBQ0U7WUFBQSxJQUFBLEVBQU0sT0FBTjtZQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFEVDtXQVBGO1NBSEY7T0FsRUY7TUErRUEsY0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGlCQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxVQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQ0U7WUFBQSxJQUFBLEVBQU0sUUFBTjtZQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtXQURGO1VBR0EsT0FBQSxFQUNFO1lBQUEsSUFBQSxFQUFNLFFBQU47WUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLGlCQURWO1dBSkY7VUFNQSxLQUFBLEVBQ0U7WUFBQSxJQUFBLEVBQU0sT0FBTjtZQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FEVDtXQVBGO1NBSEY7T0FoRkY7TUE2RkEsT0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLDRDQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxXQUFBLEVBQWEsa0NBRmI7UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFdBSFQ7T0E5RkY7S0FKRjtJQXVHQSxXQUFBLEVBQWEsU0FBQTtBQUNYLFVBQUE7TUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFmLENBQTJCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUEzQjtNQUNiLElBQUEsQ0FBYyxVQUFkO0FBQUEsZUFBQTs7TUFDQSxRQUFBLEdBQVcsVUFBVSxDQUFDLFNBQVgsQ0FBQTtNQUNYLElBQUEsQ0FBYyxRQUFkO0FBQUEsZUFBQTs7TUFDQSxTQUFBLEdBQVksUUFBUSxDQUFDLFFBQVQsQ0FBQSxDQUFtQixDQUFDLE9BQXBCLENBQTRCLFVBQTVCO01BQ1osV0FBQSxnREFBcUM7TUFDckMsSUFBRyxXQUFBLEtBQWUsWUFBbEI7UUFDRSxJQUFJLFNBQUEsS0FBYSxDQUFqQjtpQkFBd0IsUUFBeEI7U0FBQSxNQUFBO2lCQUFxQyxPQUFyQztTQURGO09BQUEsTUFBQTtRQUdFLElBQUksU0FBQSxLQUFhLENBQWpCO2lCQUF3QixPQUF4QjtTQUFBLE1BQUE7aUJBQW9DLEtBQXBDO1NBSEY7O0lBUFcsQ0F2R2I7SUFtSEEsaUJBQUEsRUFBbUIsU0FBQyxVQUFEO0FBQ2pCLFVBQUE7TUFEa0IsSUFBQyxDQUFBLGFBQUQ7TUFDbEIsUUFBQSxHQUNFO1FBQUEsT0FBQSxFQUFTLGtCQUFUO1FBQ0EsU0FBQSxFQUFhLENBQUEsU0FBQTtBQUNYLGNBQUE7aUJBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEI7UUFERyxDQUFBLENBQUYsQ0FBQSxDQURYO1FBSUEsT0FBQSxFQUNFO1VBQUEsU0FBQSxFQUFXLElBQVg7VUFDQSxTQUFBLEVBQVcsU0FBQTtBQUlULG1CQUFPO1VBSkUsQ0FEWDtVQU1BLFlBQUEsRUFBYyxJQU5kO1VBT0EsU0FBQSxFQUFXLGtCQVBYO1VBUUEsUUFBQSxFQUFVLENBQUMsYUFBRCxDQVJWO1VBU0EsR0FBQSxFQUFLLFNBQUMsR0FBRCxFQUFLLE9BQUwsRUFBYSxJQUFiLEVBQWtCLFFBQWxCLEVBQTJCLFlBQTNCLEVBQXdDLFNBQXhDLEVBQWtELE1BQWxELEVBQXlELElBQXpEO0FBQ0gsZ0JBQUE7WUFBQSxJQUFBLENBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixjQUEvQixDQUFQO2NBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUE4QixxREFBOUI7QUFDQSxxQkFGRjs7WUFHQSxJQUFBLENBQVEsQ0FBQSxFQUFBLEdBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixJQUEvQixDQUFMLENBQVI7Y0FDRSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLHlEQUE5QjtBQUNBLHFCQUZGOztZQUdBLEtBQUEsR0FBUSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQWYsQ0FBQTtZQUNSLElBQUcsT0FBTyxDQUFDLEdBQVg7Y0FDRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsT0FBTyxDQUFDLEdBQTVCLEVBQWlDO2dCQUFDLGNBQUEsRUFBZSxJQUFoQjtnQkFBcUIsS0FBQSxFQUFNLEtBQTNCO2VBQWpDO0FBQ0EscUJBQU8sTUFGVDthQUFBLE1BQUE7Y0FJRSxLQUFBLEdBQVEsa0JBQWtCLENBQUMsV0FBbkIsQ0FBK0IsUUFBL0I7Y0FDUixNQUFBLDRGQUFxRCxDQUFFLElBQTlDLENBQW1ELFNBQUMsSUFBRDt1QkFBUyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsS0FBaUI7Y0FBMUIsQ0FBbkQ7Y0FDVCxJQUFBLENBQU8sTUFBUDtnQkFDRSxLQUFBLEdBQVEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFkLEVBQW9CLEdBQXBCO2dCQUNSLE1BQUEsOEZBQXFELENBQUUsSUFBOUMsQ0FBbUQsU0FBQyxJQUFEO3lCQUFTLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxLQUFpQjtnQkFBMUIsQ0FBbkQsb0JBRlg7O2NBR0EsSUFBRyxZQUFBLElBQWdCLFNBQWhCLElBQTZCLFFBQVEsQ0FBQyxPQUFULENBQWlCLE1BQWpCLENBQWhDO2dCQU9FLElBQUcsTUFBSDtrQkFDRSxNQUFNLENBQUMsT0FBUCxDQUFlLEdBQWYsRUFERjtpQkFBQSxNQUFBO2tCQUdFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixLQUFwQixFQUEyQjtvQkFBQyxLQUFBLEdBQUQ7b0JBQUssT0FBQSxLQUFMO21CQUEzQixFQUhGO2lCQVBGO2VBQUEsTUFBQTtnQkFZRSxJQUFHLDBIQUFIO2tCQUNFLEtBQUEsR0FBUSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBRHpCOztnQkFFQSxJQUFHLE1BQUg7a0JBQ0UsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmO2tCQUNBLE1BQU0sQ0FBQyxPQUFQLENBQUEsRUFGRjtpQkFBQSxNQUFBO2tCQUlFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixLQUFwQixFQUEwQjtvQkFBQyxPQUFBLEtBQUQ7bUJBQTFCLEVBSkY7aUJBZEY7O0FBbUJBLHFCQUFPLE1BNUJUOztVQVJHLENBVEw7U0FMRjtRQXNEQSxRQUFBLEVBQ0U7VUFBQSxTQUFBLEVBQVcsSUFBWDtVQUNBLFNBQUEsRUFBVyxLQURYO1VBRUEsWUFBQSxFQUFjLEtBRmQ7VUFHQSxTQUFBLEVBQVcsa0JBSFg7VUFJQSxHQUFBLEVBQUssU0FBQyxHQUFELEVBQUssT0FBTCxFQUFhLElBQWIsRUFBa0IsUUFBbEIsRUFBMkIsWUFBM0IsRUFBd0MsU0FBeEMsRUFBa0QsTUFBbEQsRUFBeUQsSUFBekQ7WUFDSCxJQUFHLE9BQVEsQ0FBQSxLQUFBLENBQVg7Y0FDRSxJQUFDLENBQUEsRUFBRSxDQUFDLE9BQUosR0FBYyxPQUFRLENBQUEsS0FBQSxFQUR4QjthQUFBLE1BQUE7Y0FHRSxJQUFDLENBQUEsRUFBRSxDQUFDLE9BQUosR0FBYyxPQUhoQjs7WUFJQSxJQUFDLENBQUEsRUFBRSxDQUFDLFFBQUosR0FBZTttQkFDZixJQUFDLENBQUEsRUFBRSxDQUFDLElBQUosQ0FBQTtVQU5HLENBSkw7U0F2REY7O2FBa0VGLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLFVBQUQsQ0FBWSxRQUFaO0lBcEVVLENBbkhuQjtJQXlMQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBY1IsVUFBQTtNQUFBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixJQUFJLGtCQUFKLENBQUE7TUFFdEIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixPQUFBLEdBQVU7TUFJVixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLHlCQUFBLEVBQTJCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsTUFBRDttQkFDaEYsS0FBQyxDQUFBLGtCQUFrQixDQUFDLFdBQXBCLENBQWdDLElBQWhDLEVBQXFDLE1BQXJDO1VBRGdGO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQjtPQUFwQyxDQUFuQjtNQUVBLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCO01BQ1gsSUFBQSxHQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsd0JBQWQsQ0FBQTtBQUNQLFdBQUEsMENBQUE7O1FBQ0UsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQUEsR0FBb0IsT0FBcEMsQ0FBSDtVQUNJLElBQUEsQ0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFBLEdBQW9CLE9BQXBDLENBQVAsS0FBeUQsUUFBekQsSUFBc0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFBLEdBQW9CLE9BQXBCLEdBQTRCLE9BQTVDLENBQW1ELENBQUMsSUFBcEQsQ0FBQSxDQUFBLEtBQThELEVBQXJJLENBQVA7WUFDRSxJQUFZLE9BQUEsS0FBVyxhQUFYLElBQTZCLElBQUksQ0FBQyxPQUFMLENBQWEsY0FBYixDQUFBLEtBQWdDLENBQUMsQ0FBMUU7QUFBQSx1QkFBQTs7WUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLG1CQUFBLEdBQW9CLE9BQXhELEVBQXFFLENBQUEsU0FBQSxLQUFBO3FCQUFBLFNBQUMsT0FBRDtBQUNuRSx1QkFBTyxTQUFDLEdBQUQ7QUFDTCxzQkFBQTtrQkFETyxTQUFEO3lCQUNOLEtBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxXQUFwQixDQUFnQyxJQUFoQyxFQUFxQyxNQUFyQyxFQUE0QyxPQUE1QztnQkFESztjQUQ0RDtZQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBRixDQUFHLE9BQUgsQ0FBbkU7WUFHQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFBLEdBQW9CLE9BQXBDLENBQThDLENBQUMsT0FBL0MsSUFBMEQ7WUFDbEUsT0FBTyxDQUFDLElBQVIsQ0FBYTtjQUFDLEtBQUEsRUFBTyxVQUFBLEdBQVcsS0FBbkI7Y0FBNEIsT0FBQSxFQUFVLG1CQUFBLEdBQW9CLE9BQTFEO2FBQWIsRUFORjtXQURKOztBQURGO0FBVUE7QUFBQSxXQUFBLHVDQUFBOztRQUNFLEdBQUEsR0FBTTtRQUNOLEdBQUksQ0FBQSxzQ0FBQSxHQUF1QyxRQUF2QyxHQUFnRCxJQUFoRCxDQUFKLEdBQ1c7VUFDRTtZQUNFLEtBQUEsRUFBTyxrQkFEVDtZQUVFLE9BQUEsRUFBUyxPQUZYO1dBREY7O1FBT1gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFqQixDQUFxQixHQUFyQjtBQVZGO2FBYUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBZixDQUF5QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsVUFBRDtVQUN2QyxJQUFHLEtBQUMsQ0FBQSxFQUFELEtBQU8sTUFBVjtZQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUFkLENBQUE7WUFDUCxLQUFDLENBQUEsRUFBRCxHQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixFQUZYOztVQUdBLElBQUEsQ0FBTyxLQUFDLENBQUEsRUFBUjtZQUNFLEtBQUMsQ0FBQSxlQUFELENBQWlCLFVBQWpCOzRGQUNBLFVBQVUsQ0FBRSxpQkFBbUIsU0FBQTtxQkFBRyxLQUFDLENBQUEsZUFBRCxDQUFBO1lBQUgscUJBRmpDOztRQUp1QztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekM7SUFoRFEsQ0F6TFY7SUFpUEEsZ0JBQUEsRUFBa0IsU0FBQyxTQUFEO0FBQ2QsVUFBQTtNQURlLElBQUMsQ0FBQSxZQUFEO01BQ2YsSUFBRyxJQUFDLENBQUEsRUFBRCxLQUFPLE1BQVY7UUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBZCxDQUFBO1FBQ1AsSUFBQyxDQUFBLEVBQUQsR0FBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsRUFGWDs7TUFHQSxJQUFHLElBQUMsQ0FBQSxFQUFKO0FBQ0UsZUFBTyxVQURUO09BQUEsTUFBQTtRQUdFLElBQUMsQ0FBQSx1QkFBRCxJQUFDLENBQUEscUJBQXVCLElBQUksa0JBQUosQ0FBQTtlQUN4QixJQUFDLENBQUEsZUFBRCxDQUFBLEVBSkY7O0lBSmMsQ0FqUGxCO0lBMlBBLGVBQUEsRUFBaUIsU0FBQyxNQUFEO0FBQ2YsVUFBQTs7UUFEZ0IsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUE7O01BQ3pCLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjtNQUNQLFFBQUEsb0ZBQStCLENBQUU7TUFDakMsSUFBRyxRQUFBLElBQWEsUUFBQSxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0FBc0IsQ0FBQyxNQUF2QixDQUE4QixDQUE5QixDQUFBLEVBQUEsYUFBb0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFwQyxFQUFBLElBQUEsTUFBQSxDQUFoQjtlQUNFLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxXQUFYLENBQXVCO1VBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxrQkFBUDtVQUEyQixRQUFBLEVBQVMsR0FBcEM7U0FBdkIsRUFEaEI7T0FBQSxNQUFBO3NEQUdhLENBQUUsT0FBYixDQUFBLFdBSEY7O0lBSGUsQ0EzUGpCO0lBbVFBLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLGtCQUFrQixDQUFDLE9BQXBCLENBQUE7SUFEVSxDQW5RWjtJQXNRQSxTQUFBLEVBQVcsU0FBQTthQUNUO1FBQUEsdUJBQUEsRUFBeUIsSUFBQyxDQUFBLGtCQUFrQixDQUFDLFNBQXBCLENBQUEsQ0FBekI7O0lBRFMsQ0F0UVg7SUF5UUEsTUFBQSxFQUFRLFNBQUEsR0FBQSxDQXpRUjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57T3BlbkluQnJvd3NlcnNWaWV3fSA9IHJlcXVpcmUgJy4vb3Blbi1pbi1icm93c2Vycy12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9wZW5JbkJyb3dzZXJzID1cbiAgb3BlbkluQnJvd3NlcnNWaWV3OiBudWxsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgY29uZmlnOlxuXG4gICAgYnJvd3NlcnM6XG4gICAgICB0aXRsZTogJ0xpc3Qgb2YgQnJvd3NlcnMnXG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbICdJRScsICdFZGdlJywgJ0Nocm9tZScsICdDaHJvbWVQb3J0YWJsZScsICdGaXJlZm94JywgJ0ZpcmVmb3hQb3J0YWJsZScsICdPcGVyYScsICdTYWZhcmknLCAnU2FmYXJpUG9ydGFibGUnLCAnQnJvd3NlclBsdXMnIF1cblxuICAgIGRlZkJyb3dzZXI6XG4gICAgICB0aXRsZTogJ0RlZmF1bHQgQnJvd3NlcidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnQ2hyb21lJ1xuICAgICAgZW51bTogWyAnSUUnLCAnRWRnZScsICdDaHJvbWUnLCAnQ2hyb21lUG9ydGFibGUnLCAnRmlyZWZveCcsICdGaXJlZm94UG9ydGFibGUnLCAnT3BlcmEnLCAnU2FmYXJpJywgJ1NhZmFyaVBvcnRhYmxlJywgJ0Jyb3dzZXJQbHVzJ11cblxuICAgIGZpbGVUeXBlczpcbiAgICAgIHRpdGxlOiAnSFRNTCBGaWxlIFR5cGVzJ1xuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogWydodG1sJywnaHRtJywneGh0bWwnXVxuICAgIElFOlxuICAgICAgdGl0bGU6ICdJRSdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuXG4gICAgRWRnZTpcbiAgICAgIHRpdGxlOiAnRWRnZSdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcblxuICAgIENocm9tZTpcbiAgICAgIHRpdGxlOiAnQ2hyb21lJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG5cbiAgICBGaXJlZm94OlxuICAgICAgdGl0bGU6ICdGaXJlZm94J1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG5cbiAgICBPcGVyYTpcbiAgICAgIHRpdGxlOiAnT3BlcmEnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcblxuICAgIFNhZmFyaTpcbiAgICAgIHRpdGxlOiAnU2FmYXJpJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG5cbiAgICBCcm93c2VyUGx1czpcbiAgICAgIHRpdGxlOiAnQnJvd3NlciBQbHVzJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG5cbiAgICBDaHJvbWVQb3J0YWJsZTpcbiAgICAgIHRpdGxlOiAnQ2hyb21lIFBvcnRhYmxlJ1xuICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgIHBhdGg6XG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZWcuIEM6XFxcXFVzZXJzXFxcXEFkbWluXFxcXEFwcERhdGFcXFxcTG9jYWxcXFxcR29vZ2xlXFxcXFwiQ2hyb21lIFN4U1wiXFxcXEFwcGxpY2F0aW9uXFxcXGNocm9tZS5leGUnXG4gICAgICAgIHRvb2x0aXA6XG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICBkZWZhdWx0IDogJ0Nocm9tZSBDYW5hcnknXG4gICAgICAgIGNvbG9yOlxuICAgICAgICAgIHR5cGU6ICdjb2xvcidcbiAgICAgICAgICBkZWZhdWx0OiAncmVkJ1xuXG4gICAgRmlyZWZveFBvcnRhYmxlOlxuICAgICAgdGl0bGU6ICdGaXJlZm94IFBvcnRhYmxlJ1xuICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgIHBhdGg6XG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICB0b29sdGlwOlxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgZGVmYXVsdCA6ICdGaXJlZm94IERldmVsb3BlcidcbiAgICAgICAgY29sb3I6XG4gICAgICAgICAgdHlwZTogJ2NvbG9yJ1xuICAgICAgICAgIGRlZmF1bHQ6ICdibHVlJ1xuXG4gICAgU2FmYXJpUG9ydGFibGU6XG4gICAgICB0aXRsZTogJ1NhZmFyaSBQb3J0YWJsZSdcbiAgICAgIHR5cGU6ICdvYmplY3QnXG4gICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICBwYXRoOlxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgdG9vbHRpcDpcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgIGRlZmF1bHQgOiAnU2FmYXJpIFBvcnRhYmxlJ1xuICAgICAgICBjb2xvcjpcbiAgICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgICAgZGVmYXVsdDogJ2dyZWVuJ1xuXG4gICAgcHJvamVjdDpcbiAgICAgIHRpdGxlOiAnUHJvamVjdC9Mb2NhbCBIb3N0IENvbWJpbmF0aW9uIENvbmZpZyBGaWxlJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlc2NyaXB0aW9uOiAnY29udGFpbnMgdGhlIHVybCBhbmQgaG9tZSBmb2xkZXInXG4gICAgICBkZWZhdWx0OiAncHJvai5qc29uJ1xuXG4gIGdldFBvc2l0aW9uOiAtPlxuICAgIGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICByZXR1cm4gdW5sZXNzIGFjdGl2ZVBhbmVcbiAgICBwYW5lQXhpcyA9IGFjdGl2ZVBhbmUuZ2V0UGFyZW50KClcbiAgICByZXR1cm4gdW5sZXNzIHBhbmVBeGlzXG4gICAgcGFuZUluZGV4ID0gcGFuZUF4aXMuZ2V0UGFuZXMoKS5pbmRleE9mKGFjdGl2ZVBhbmUpXG4gICAgb3JpZW50YXRpb24gPSBwYW5lQXhpcy5vcmllbnRhdGlvbiA/ICdob3Jpem9udGFsJ1xuICAgIGlmIG9yaWVudGF0aW9uIGlzICdob3Jpem9udGFsJ1xuICAgICAgaWYgIHBhbmVJbmRleCBpcyAwIHRoZW4gJ3JpZ2h0JyBlbHNlICdsZWZ0J1xuICAgIGVsc2VcbiAgICAgIGlmICBwYW5lSW5kZXggaXMgMCB0aGVuICdkb3duJyBlbHNlICd1cCdcblxuICBjb25zdW1lQWRkUHJldmlldzogKEBhZGRQcmV2aWV3KS0+XG4gICAgcmVxdWlyZXMgPVxuICAgICAgcGtnTmFtZTogJ29wZW4taW4tYnJvd3NlcnMnXG4gICAgICBmaWxlVHlwZXM6IGRvLT5cbiAgICAgICAgdHlwZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ29wZW4taW4tYnJvd3NlcnMuZmlsZVR5cGVzJylcbiAgICAgICAgIyB0eXBlcy5jb25jYXQgWydodG0nLCdodG1sJ10gI2ZpbGV0eXBlcyBhZ2FpbnN0IHdoaWNoIHRoaXMgY29tcGlsZVRvIE9wdGlvbiB3aWxsIHNob3dcbiAgICAgIGJyb3dzZXI6XG4gICAgICAgIG5vUHJldmlldzogdHJ1ZVxuICAgICAgICBoeXBlckxpdmU6IC0+XG4gICAgICAgICAgIyBpZiBmYWxzZVxuICAgICAgICAgICMgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnTGl2ZSBOb3QgQXZhaWxibGUnKVxuICAgICAgICAgICMgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBxdWlja1ByZXZpZXc6IHRydWVcbiAgICAgICAgdmlld0NsYXNzOiBPcGVuSW5Ccm93c2Vyc1ZpZXdcbiAgICAgICAgdmlld0FyZ3M6IFsnQnJvd3NlclBsdXMnXVxuICAgICAgICBleGU6IChzcmMsb3B0aW9ucyxkYXRhLGZpbGVOYW1lLHF1aWNrUHJldmlldyxoeXBlckxpdmUsZWRpdG9yLHZpZXcpLT5cbiAgICAgICAgICB1bmxlc3MgYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdicm93c2VyLXBsdXMnKVxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ0FQTSBJbnN0YWxsIEJyb3dzZXItUGx1cyB0byBkaXNwbGF5IGluIGJyb3dzZXItcGx1cycpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB1bmxlc3MgIHBwID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdwcCcpXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnQVBNIEluc3RhbGwgUFAoUHJldmlldy1QbHVzKSB0byBkaXNwbGF5IGluIGJyb3dzZXItcGx1cycpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBzcGxpdCA9IG1vZHVsZS5leHBvcnRzLmdldFBvc2l0aW9uKClcbiAgICAgICAgICBpZiBvcHRpb25zLnVybFxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBvcHRpb25zLnVybCwge3NlYXJjaEFsbFBhbmVzOnRydWUsc3BsaXQ6c3BsaXR9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBmcGF0aCA9IE9wZW5JbkJyb3dzZXJzVmlldy5nZXRGaWxlUGF0aChmaWxlTmFtZSlcbiAgICAgICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZnBhdGgpPy5nZXRJdGVtcygpPy5maW5kIChwYW5lKS0+IHBhbmUuZ2V0VVJJKCkgaXMgZnBhdGhcbiAgICAgICAgICAgIHVubGVzcyBlZGl0b3JcbiAgICAgICAgICAgICAgZnBhdGggPSBmcGF0aC5yZXBsYWNlKC9cXFxcL2csXCIvXCIpXG4gICAgICAgICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZnBhdGgpPy5nZXRJdGVtcygpPy5maW5kIChwYW5lKS0+IHBhbmUuZ2V0VVJJKCkgaXMgZnBhdGhcbiAgICAgICAgICAgIGlmIHF1aWNrUHJldmlldyBvciBoeXBlckxpdmUgb3IgZmlsZU5hbWUuaW5kZXhPZiBcIn5wcH5cIlxuICAgICAgICAgICAgICAjIHNyYyA9IHNyYy5zcGxpdCgnXFxuJykuam9pbignPGJyLz4nKVxuICAgICAgICAgICAgICAjIHNyYyA9IFwiXCJcIlxuICAgICAgICAgICAgICAjICAgPHByZSBzdHlsZT1cIndvcmQtd3JhcDogYnJlYWstd29yZDsgd2hpdGUtc3BhY2U6IHByZS13cmFwO1wiPlxuICAgICAgICAgICAgICAjICAgI3tzcmN9XG4gICAgICAgICAgICAgICMgICA8L3ByZT5cbiAgICAgICAgICAgICAgIyAgIFwiXCJcIlxuICAgICAgICAgICAgICBpZiBlZGl0b3JcbiAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChzcmMpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZwYXRoLCB7c3JjLHNwbGl0fVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBpZiB0YXJnZXQ/LmRhdGFzZXQ/LnBhdGg/XG4gICAgICAgICAgICAgICAgZnBhdGggPSB0YXJnZXQuZGF0YXNldC5wYXRoXG4gICAgICAgICAgICAgIGlmIGVkaXRvclxuICAgICAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0KCcnKVxuICAgICAgICAgICAgICAgIGVkaXRvci5yZWZyZXNoKClcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gZnBhdGgse3NwbGl0fVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICMgbG9jYWxob3N0OlxuICAgICAgI1xuICAgICAgYnJvd3NlcnM6XG4gICAgICAgIG5vUHJldmlldzogdHJ1ZVxuICAgICAgICBoeXBlckxpdmU6IGZhbHNlXG4gICAgICAgIHF1aWNrUHJldmlldzogZmFsc2VcbiAgICAgICAgdmlld0NsYXNzOiBPcGVuSW5Ccm93c2Vyc1ZpZXdcbiAgICAgICAgZXhlOiAoc3JjLG9wdGlvbnMsZGF0YSxmaWxlTmFtZSxxdWlja1ByZXZpZXcsaHlwZXJMaXZlLGVkaXRvcix2aWV3KS0+XG4gICAgICAgICAgaWYgb3B0aW9uc1sndXJsJ11cbiAgICAgICAgICAgIEB2dy5odG1sVVJMID0gb3B0aW9uc1sndXJsJ11cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAdncuaHRtbFVSTCA9IHVuZGVmaW5lZFxuICAgICAgICAgIEB2dy5maWxlTmFtZSA9IGZpbGVOYW1lXG4gICAgICAgICAgQHZ3Lm9wZW4oKVxuICAgIEBpZHMgPSBAYWRkUHJldmlldyByZXF1aXJlc1xuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgIyBicmluZyBiYWNrIHRvIGxpZmUgbmV3IGJyb3dzZXJzIGFkZGVkXG4gICAgIyBpZiBhdG9tLmNvbmZpZy5nZXQoJ29wZW4taW4tYnJvd3NlcnMucmVxdWlyZXMnKVxuICAgICAgIyByZXEgPSByZXF1aXJlIGF0b20uY29uZmlnLmdldCgnb3Blbi1pbi1icm93c2Vycy5yZXF1aXJlcycpXG4gICAgICAjIGZvciBrZXksdmFsIG9mIHJlcS5jb25maWdcbiAgICAgICMgICBwcm9wZXJ0aWVzID0gYXRvbS5jb25maWcuZ2V0U2NoZW1hKCdvcGVuLWluLWJyb3dzZXJzJykucHJvcGVydGllc1xuICAgICAgIyAgIGlmIHByb3BlcnRpZXNba2V5XVxuICAgICAgIyAgICAgcHJvcGVydGllcy5lbnVtLmNvbmNhdCB2YWxcbiAgICAgICMgICBlbHNlXG4gICAgICAjICAgICBwcm9wZXJ0aWVzW2tleV0gPSB7fVxuICAgICAgIyAgICAgcHJvcGVydGllc1trZXldWydkZWZhdWx0J10gPSB2YWxcbiAgICAgICMgICAgIHByb3BlcnRpZXNba2V5XVsndHlwZSddID0gJ3N0cmluZydcbiAgICAgICMgICAgIHByb3BlcnRpZXNba2V5XVsndGl0bGUnXSA9IGtleVxuXG4gICAgQG9wZW5JbkJyb3dzZXJzVmlldyA9IG5ldyBPcGVuSW5Ccm93c2Vyc1ZpZXcoKVxuICAgICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBzdWJtZW51ID0gW11cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgICMgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdvcGVuLWluLWJyb3dzZXJzOmFkZEJyb3dzZXInOiAodGFyZ2V0KT0+XG4gICAgICAjIG9wZW4gaW5wdXQgdmlldyBmb3IgYnJvd3NlciBuYW1lL2NvbW1hbmQvZGVmYXVsdFxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnb3Blbi1pbi1icm93c2Vyczp0b2dnbGUnOiAodGFyZ2V0KT0+XG4gICAgICBAb3BlbkluQnJvd3NlcnNWaWV3Lm9wZW5Ccm93c2VyKG51bGwsdGFyZ2V0KVxuICAgIGJyb3dzZXJzID0gYXRvbS5jb25maWcuZ2V0KCdvcGVuLWluLWJyb3dzZXJzLmJyb3dzZXJzJylcbiAgICBwa2dzID0gYXRvbS5wYWNrYWdlcy5nZXRBdmFpbGFibGVQYWNrYWdlTmFtZXMoKVxuICAgIGZvciBicm93c2VyIGluIGJyb3dzZXJzXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoXCJvcGVuLWluLWJyb3dzZXJzLiN7YnJvd3Nlcn1cIilcbiAgICAgICAgICB1bmxlc3MgKHR5cGVvZiBhdG9tLmNvbmZpZy5nZXQoXCJvcGVuLWluLWJyb3dzZXJzLiN7YnJvd3Nlcn1cIikgaXMgXCJvYmplY3RcIiBhbmQgYXRvbS5jb25maWcuZ2V0KFwib3Blbi1pbi1icm93c2Vycy4je2Jyb3dzZXJ9LnBhdGhcIikudHJpbSgpIGlzICcnKVxuICAgICAgICAgICAgY29udGludWUgaWYgYnJvd3NlciBpcyAnQnJvd3NlclBsdXMnIGFuZCBwa2dzLmluZGV4T2YoJ2Jyb3dzZXItcGx1cycpIGlzIC0xXG4gICAgICAgICAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCBcIm9wZW4taW4tYnJvd3NlcnM6I3ticm93c2VyfVwiLCBkbyhicm93c2VyKSA9PlxuICAgICAgICAgICAgICByZXR1cm4gKHt0YXJnZXR9KSA9PlxuICAgICAgICAgICAgICAgIEBvcGVuSW5Ccm93c2Vyc1ZpZXcub3BlbkJyb3dzZXIobnVsbCx0YXJnZXQsYnJvd3NlcilcbiAgICAgICAgICAgIHRpdGxlID0gYXRvbS5jb25maWcuZ2V0KFwib3Blbi1pbi1icm93c2Vycy4je2Jyb3dzZXJ9XCIpLnRvb2x0aXAgb3IgYnJvd3NlclxuICAgICAgICAgICAgc3VibWVudS5wdXNoIHtsYWJlbDogXCJPcGVuIGluICN7dGl0bGV9XCIsIGNvbW1hbmQ6ICBcIm9wZW4taW4tYnJvd3NlcnM6I3ticm93c2VyfVwifVxuXG4gICAgZm9yIGZpbGVUeXBlIGluIGF0b20uY29uZmlnLmdldCgnb3Blbi1pbi1icm93c2Vycy5maWxlVHlwZXMnKVxuICAgICAgc2VsID0ge31cbiAgICAgIHNlbFsnLnRyZWUtdmlldyAuZmlsZSAubmFtZVtkYXRhLW5hbWUkPVwiLicrZmlsZVR5cGUrJ1wiXSddID1cbiAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnT3BlbiBpbiBCcm93c2VycycsXG4gICAgICAgICAgICAgICAgICAgICBzdWJtZW51OiBzdWJtZW51XG4gICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBdXG5cbiAgICAgIGF0b20uY29udGV4dE1lbnUuYWRkIHNlbFxuXG5cbiAgICBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIChhY3RpdmVQYW5lKT0+XG4gICAgICBpZiBAcHAgaXMgdW5kZWZpbmVkXG4gICAgICAgIHBrZ3MgPSBhdG9tLnBhY2thZ2VzLmdldEF2YWlsYWJsZVBhY2thZ2VOYW1lcygpXG4gICAgICAgIEBwcCA9ICEhfnBrZ3MuaW5kZXhPZigncHAnKVxuICAgICAgdW5sZXNzIEBwcFxuICAgICAgICBAdXBkYXRlU3RhdHVzQmFyKGFjdGl2ZVBhbmUpXG4gICAgICAgIGFjdGl2ZVBhbmU/Lm9uRGlkQ2hhbmdlVGl0bGU/ICA9PiBAdXBkYXRlU3RhdHVzQmFyKClcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoQHN0YXR1c0JhciktPlxuICAgICAgaWYgQHBwIGlzIHVuZGVmaW5lZFxuICAgICAgICBwa2dzID0gYXRvbS5wYWNrYWdlcy5nZXRBdmFpbGFibGVQYWNrYWdlTmFtZXMoKVxuICAgICAgICBAcHAgPSAhIX5wa2dzLmluZGV4T2YoJ3BwJylcbiAgICAgIGlmIEBwcFxuICAgICAgICByZXR1cm4gXCI8L3NwYW4+XCJcbiAgICAgIGVsc2VcbiAgICAgICAgQG9wZW5JbkJyb3dzZXJzVmlldyBvcj0gbmV3IE9wZW5JbkJyb3dzZXJzVmlldygpXG4gICAgICAgIEB1cGRhdGVTdGF0dXNCYXIoKVxuXG4gIHVwZGF0ZVN0YXR1c0JhcjogKGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkpLT5cbiAgICBwYXRoID0gcmVxdWlyZSAncGF0aCdcbiAgICBmaWxlUGF0aCA9IGVkaXRvcj8uYnVmZmVyPy5maWxlPy5wYXRoXG4gICAgaWYgZmlsZVBhdGggYW5kIHBhdGguZXh0bmFtZShmaWxlUGF0aCkuc3Vic3RyKDEpIGluIGF0b20uY29uZmlnLmdldCgnb3Blbi1pbi1icm93c2Vycy5maWxlVHlwZXMnKVxuICAgICAgQGJyb3dzZXJCYXIgPSBAc3RhdHVzQmFyLmFkZExlZnRUaWxlIGl0ZW06IEBvcGVuSW5Ccm93c2Vyc1ZpZXcsIHByaW9yaXR5OjEwMFxuICAgIGVsc2VcbiAgICAgIEBicm93c2VyQmFyPy5kZXN0cm95KClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBvcGVuSW5Ccm93c2Vyc1ZpZXcuZGVzdHJveSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIG9wZW5JbkJyb3dzZXJzVmlld1N0YXRlOiBAb3BlbkluQnJvd3NlcnNWaWV3LnNlcmlhbGl6ZSgpXG5cbiAgdG9nZ2xlOiAtPlxuIl19
