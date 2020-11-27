(function() {
  var CompositeDisposable, Emitter, Logger, Metrics, os, path, ref, ref1,
    slice = [].slice;

  os = require('os');

  path = require('path');

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  ref1 = [], Metrics = ref1[0], Logger = ref1[1];

  window.DEBUG = false;

  module.exports = {
    config: {
      useKite: {
        type: 'boolean',
        "default": true,
        order: 0,
        title: 'Use Kite-powered Completions (macOS & Windows only)',
        description: 'Kite is a cloud powered autocomplete engine. Choosing\nthis option will allow you to get cloud powered completions and other\nfeatures in addition to the completions provided by Jedi.'
      },
      showDescriptions: {
        type: 'boolean',
        "default": true,
        order: 1,
        title: 'Show Descriptions',
        description: 'Show doc strings from functions, classes, etc.'
      },
      useSnippets: {
        type: 'string',
        "default": 'none',
        order: 2,
        "enum": ['none', 'all', 'required'],
        title: 'Autocomplete Function Parameters',
        description: 'Automatically complete function arguments after typing\nleft parenthesis character. Use completion key to jump between\narguments. See `autocomplete-python:complete-arguments` command if you\nwant to trigger argument completions manually. See README if it does not\nwork for you.'
      },
      pythonPaths: {
        type: 'string',
        "default": '',
        order: 3,
        title: 'Python Executable Paths',
        description: 'Optional semicolon separated list of paths to python\nexecutables (including executable names), where the first one will take\nhigher priority over the last one. By default autocomplete-python will\nautomatically look for virtual environments inside of your project and\ntry to use them as well as try to find global python executable. If you\nuse this config, automatic lookup will have lowest priority.\nUse `$PROJECT` or `$PROJECT_NAME` substitution for project-specific\npaths to point on executables in virtual environments.\nFor example:\n`/Users/name/.virtualenvs/$PROJECT_NAME/bin/python;$PROJECT/venv/bin/python3;/usr/bin/python`.\nSuch config will fall back on `/usr/bin/python` for projects not presented\nwith same name in `.virtualenvs` and without `venv` folder inside of one\nof project folders.\nIf you are using python3 executable while coding for python2 you will get\npython2 completions for some built-ins.'
      },
      extraPaths: {
        type: 'string',
        "default": '',
        order: 4,
        title: 'Extra Paths For Packages',
        description: 'Semicolon separated list of modules to additionally\ninclude for autocomplete. You can use same substitutions as in\n`Python Executable Paths`.\nNote that it still should be valid python package.\nFor example:\n`$PROJECT/env/lib/python2.7/site-packages`\nor\n`/User/name/.virtualenvs/$PROJECT_NAME/lib/python2.7/site-packages`.\nYou don\'t need to specify extra paths for libraries installed with python\nexecutable you use.'
      },
      caseInsensitiveCompletion: {
        type: 'boolean',
        "default": true,
        order: 5,
        title: 'Case Insensitive Completion',
        description: 'The completion is by default case insensitive.'
      },
      triggerCompletionRegex: {
        type: 'string',
        "default": '([\.\ (]|[a-zA-Z_][a-zA-Z0-9_]*)',
        order: 6,
        title: 'Regex To Trigger Autocompletions',
        description: 'By default completions triggered after words, dots, spaces\nand left parenthesis. You will need to restart your editor after changing\nthis.'
      },
      fuzzyMatcher: {
        type: 'boolean',
        "default": true,
        order: 7,
        title: 'Use Fuzzy Matcher For Completions.',
        description: 'Typing `stdr` will match `stderr`.\nFirst character should always match. Uses additional caching thus\ncompletions should be faster. Note that this setting does not affect\nbuilt-in autocomplete-plus provider.'
      },
      outputProviderErrors: {
        type: 'boolean',
        "default": false,
        order: 8,
        title: 'Output Provider Errors',
        description: 'Select if you would like to see the provider errors when\nthey happen. By default they are hidden. Note that critical errors are\nalways shown.'
      },
      outputDebug: {
        type: 'boolean',
        "default": false,
        order: 9,
        title: 'Output Debug Logs',
        description: 'Select if you would like to see debug information in\ndeveloper tools logs. May slow down your editor.'
      },
      showTooltips: {
        type: 'boolean',
        "default": false,
        order: 10,
        title: 'Show Tooltips with information about the object under the cursor',
        description: 'EXPERIMENTAL FEATURE WHICH IS NOT FINISHED YET.\nFeedback and ideas are welcome on github.'
      },
      suggestionPriority: {
        type: 'integer',
        "default": 3,
        minimum: 0,
        maximum: 99,
        order: 11,
        title: 'Suggestion Priority',
        description: 'You can use this to set the priority for autocomplete-python\nsuggestions. For example, you can use lower value to give higher priority\nfor snippets completions which has priority of 2.'
      },
      enableTouchBar: {
        type: 'boolean',
        "default": false,
        order: 12,
        title: 'Enable Touch Bar support',
        description: 'Proof of concept for now, requires tooltips to be enabled and Atom >=1.19.0.'
      }
    },
    installation: null,
    _handleGrammarChangeEvent: function(grammar) {
      var ref2;
      if ((ref2 = grammar.packageName) === 'language-python' || ref2 === 'MagicPython' || ref2 === 'atom-django') {
        this.provider.load();
        this.emitter.emit('did-load-provider');
        return this.disposables.dispose();
      }
    },
    _loadKite: function() {
      var AccountManager, AtomHelper, NodeClient, StateController, checkKiteInstallation, editorCfg, event, firstInstall, install, longRunning, pluginCfg, ref2;
      firstInstall = localStorage.getItem('autocomplete-python.installed') === null;
      localStorage.setItem('autocomplete-python.installed', true);
      longRunning = require('process').uptime() > 10;
      if (firstInstall && longRunning) {
        event = "installed";
      } else if (firstInstall) {
        event = "upgraded";
      } else {
        event = "restarted";
      }
      ref2 = require('kite-installer'), AccountManager = ref2.AccountManager, AtomHelper = ref2.AtomHelper, Metrics = ref2.Metrics, Logger = ref2.Logger, StateController = ref2.StateController, NodeClient = ref2.NodeClient, install = ref2.install;
      if (atom.config.get('kite.loggingLevel')) {
        Logger.LEVEL = Logger.LEVELS[atom.config.get('kite.loggingLevel').toUpperCase()];
      }
      editorCfg = {
        UUID: localStorage.getItem('metrics.userId'),
        name: 'atom'
      };
      pluginCfg = {
        name: 'autocomplete-python'
      };
      Metrics.Tracker.source = 'autocomplete-python';
      Metrics.enabled = atom.config.get('core.telemetryConsent') === 'limited';
      atom.packages.onDidActivatePackage((function(_this) {
        return function(pkg) {
          if (pkg.name === 'kite') {
            return _this.patchKiteCompletions(pkg);
          }
        };
      })(this));
      checkKiteInstallation = (function(_this) {
        return function() {
          if (!atom.config.get('autocomplete-python.useKite')) {
            return;
          }
          if (atom.config.get('autocomplete-python.useKite')) {
            return StateController.canInstallKite().then(function() {
              var Install, initialClient, installed, installer;
              Install = install.Install;
              installer = new Install(install.atom().autocompletePythonFlow(), {
                path: atom.project.getPaths()[0] || os.homedir()
              }, {
                failureStep: 'termination',
                title: 'Choose your autocomplete-python engine'
              });
              initialClient = AccountManager.client;
              AccountManager.client = new NodeClient('alpha.kite.com', -1, '', true);
              atom.workspace.getActivePane().addItem(installer);
              atom.workspace.getActivePane().activateItem(installer);
              installed = false;
              installer.onDidDestroy(function() {
                atom.config.set('autocomplete-python.useKite', installed);
                return AccountManager.client = initialClient;
              });
              installer.onDidUdpdateState(function(state) {
                if (typeof state.install !== 'undefined') {
                  return installed = state.install.done || false;
                }
              });
              installer.on('did-skip-install', function() {
                installed = false;
                return atom.config.set('autocomplete-python.useKite', installed);
              });
              return installer.start();
            }, function(err) {
              if (typeof err !== 'undefined' && err.type === 'denied') {
                return atom.config.set('autocomplete-python.useKite', false);
              }
            });
          }
        };
      })(this);
      checkKiteInstallation();
      return atom.config.onDidChange('autocomplete-python.useKite', function(arg) {
        var newValue, oldValue;
        newValue = arg.newValue, oldValue = arg.oldValue;
        if (newValue) {
          checkKiteInstallation();
          return AtomHelper.enablePackage();
        } else {
          return AtomHelper.disablePackage();
        }
      });
    },
    load: function() {
      var disposable;
      this.disposables = new CompositeDisposable;
      disposable = atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this._handleGrammarChangeEvent(editor.getGrammar());
          disposable = editor.onDidChangeGrammar(function(grammar) {
            return _this._handleGrammarChangeEvent(grammar);
          });
          return _this.disposables.add(disposable);
        };
      })(this));
      this.disposables.add(disposable);
      return this._loadKite();
    },
    activate: function(state) {
      var disposable;
      this.emitter = new Emitter;
      this.provider = require('./provider');
      if (typeof atom.packages.hasActivatedInitialPackages === 'function' && atom.packages.hasActivatedInitialPackages()) {
        return this.load();
      } else {
        return disposable = atom.packages.onDidActivateInitialPackages((function(_this) {
          return function() {
            _this.load();
            return disposable.dispose();
          };
        })(this));
      }
    },
    deactivate: function() {
      if (this.provider) {
        this.provider.dispose();
      }
      if (this.installation) {
        return this.installation.destroy();
      }
    },
    getProvider: function() {
      return this.provider;
    },
    getHyperclickProvider: function() {
      return require('./hyperclick-provider');
    },
    consumeSnippets: function(snippetsManager) {
      var disposable;
      return disposable = this.emitter.on('did-load-provider', (function(_this) {
        return function() {
          _this.provider.setSnippetsManager(snippetsManager);
          return disposable.dispose();
        };
      })(this));
    },
    patchKiteCompletions: function(kite) {
      var getSuggestions;
      if (this.kitePackage != null) {
        return;
      }
      this.kitePackage = kite.mainModule;
      this.kiteProvider = this.kitePackage.completions();
      getSuggestions = this.kiteProvider.getSuggestions;
      return this.kiteProvider.getSuggestions = (function(_this) {
        return function() {
          var args, ref2, ref3;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return getSuggestions != null ? (ref2 = getSuggestions.apply(_this.kiteProvider, args)) != null ? (ref3 = ref2.then(function(suggestions) {
            _this.lastKiteSuggestions = suggestions;
            _this.kiteSuggested = suggestions != null;
            return suggestions;
          })) != null ? ref3["catch"](function(err) {
            _this.lastKiteSuggestions = [];
            _this.kiteSuggested = false;
            throw err;
          }) : void 0 : void 0 : void 0;
        };
      })(this);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1weXRob24vbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrRUFBQTtJQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFFdEIsT0FBb0IsRUFBcEIsRUFBQyxpQkFBRCxFQUFVOztFQUVWLE1BQU0sQ0FBQyxLQUFQLEdBQWU7O0VBQ2YsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLE9BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsS0FBQSxFQUFPLENBRlA7UUFHQSxLQUFBLEVBQU8scURBSFA7UUFJQSxXQUFBLEVBQWEseUxBSmI7T0FERjtNQVFBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLEtBQUEsRUFBTyxDQUZQO1FBR0EsS0FBQSxFQUFPLG1CQUhQO1FBSUEsV0FBQSxFQUFhLGdEQUpiO09BVEY7TUFjQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFEVDtRQUVBLEtBQUEsRUFBTyxDQUZQO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLFVBQWhCLENBSE47UUFJQSxLQUFBLEVBQU8sa0NBSlA7UUFLQSxXQUFBLEVBQWEseVJBTGI7T0FmRjtNQXlCQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxD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QUFEO0FBQ2YsVUFBQTthQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxtQkFBWixFQUFpQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDNUMsS0FBQyxDQUFBLFFBQVEsQ0FBQyxrQkFBVixDQUE2QixlQUE3QjtpQkFDQSxVQUFVLENBQUMsT0FBWCxDQUFBO1FBRjRDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQztJQURFLENBMVBqQjtJQStQQSxvQkFBQSxFQUFzQixTQUFDLElBQUQ7QUFDcEIsVUFBQTtNQUFBLElBQVUsd0JBQVY7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDO01BQ3BCLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUMsQ0FBQSxXQUFXLENBQUMsV0FBYixDQUFBO01BQ2hCLGNBQUEsR0FBaUIsSUFBQyxDQUFBLFlBQVksQ0FBQzthQUMvQixJQUFDLENBQUEsWUFBWSxDQUFDLGNBQWQsR0FBK0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQzdCLGNBQUE7VUFEOEI7Ozs7OzRCQU05QixFQUFFLEtBQUYsRUFMQSxDQUtRLFNBQUMsR0FBRDtZQUNOLEtBQUMsQ0FBQSxtQkFBRCxHQUF1QjtZQUN2QixLQUFDLENBQUEsYUFBRCxHQUFpQjtBQUNqQixrQkFBTTtVQUhBLENBTFI7UUFENkI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0lBTlgsQ0EvUHRCOztBQVJGIiwic291cmNlc0NvbnRlbnQiOlsib3MgPSByZXF1aXJlICdvcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcblxuW01ldHJpY3MsIExvZ2dlcl0gPSBbXVxuXG53aW5kb3cuREVCVUcgPSBmYWxzZVxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgdXNlS2l0ZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDBcbiAgICAgIHRpdGxlOiAnVXNlIEtpdGUtcG93ZXJlZCBDb21wbGV0aW9ucyAobWFjT1MgJiBXaW5kb3dzIG9ubHkpJ1xuICAgICAgZGVzY3JpcHRpb246ICcnJ0tpdGUgaXMgYSBjbG91ZCBwb3dlcmVkIGF1dG9jb21wbGV0ZSBlbmdpbmUuIENob29zaW5nXG4gICAgICB0aGlzIG9wdGlvbiB3aWxsIGFsbG93IHlvdSB0byBnZXQgY2xvdWQgcG93ZXJlZCBjb21wbGV0aW9ucyBhbmQgb3RoZXJcbiAgICAgIGZlYXR1cmVzIGluIGFkZGl0aW9uIHRvIHRoZSBjb21wbGV0aW9ucyBwcm92aWRlZCBieSBKZWRpLicnJ1xuICAgIHNob3dEZXNjcmlwdGlvbnM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiAxXG4gICAgICB0aXRsZTogJ1Nob3cgRGVzY3JpcHRpb25zJ1xuICAgICAgZGVzY3JpcHRpb246ICdTaG93IGRvYyBzdHJpbmdzIGZyb20gZnVuY3Rpb25zLCBjbGFzc2VzLCBldGMuJ1xuICAgIHVzZVNuaXBwZXRzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdub25lJ1xuICAgICAgb3JkZXI6IDJcbiAgICAgIGVudW06IFsnbm9uZScsICdhbGwnLCAncmVxdWlyZWQnXVxuICAgICAgdGl0bGU6ICdBdXRvY29tcGxldGUgRnVuY3Rpb24gUGFyYW1ldGVycydcbiAgICAgIGRlc2NyaXB0aW9uOiAnJydBdXRvbWF0aWNhbGx5IGNvbXBsZXRlIGZ1bmN0aW9uIGFyZ3VtZW50cyBhZnRlciB0eXBpbmdcbiAgICAgIGxlZnQgcGFyZW50aGVzaXMgY2hhcmFjdGVyLiBVc2UgY29tcGxldGlvbiBrZXkgdG8ganVtcCBiZXR3ZWVuXG4gICAgICBhcmd1bWVudHMuIFNlZSBgYXV0b2NvbXBsZXRlLXB5dGhvbjpjb21wbGV0ZS1hcmd1bWVudHNgIGNvbW1hbmQgaWYgeW91XG4gICAgICB3YW50IHRvIHRyaWdnZXIgYXJndW1lbnQgY29tcGxldGlvbnMgbWFudWFsbHkuIFNlZSBSRUFETUUgaWYgaXQgZG9lcyBub3RcbiAgICAgIHdvcmsgZm9yIHlvdS4nJydcbiAgICBweXRob25QYXRoczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgICAgb3JkZXI6IDNcbiAgICAgIHRpdGxlOiAnUHl0aG9uIEV4ZWN1dGFibGUgUGF0aHMnXG4gICAgICBkZXNjcmlwdGlvbjogJycnT3B0aW9uYWwgc2VtaWNvbG9uIHNlcGFyYXRlZCBsaXN0IG9mIHBhdGhzIHRvIHB5dGhvblxuICAgICAgZXhlY3V0YWJsZXMgKGluY2x1ZGluZyBleGVjdXRhYmxlIG5hbWVzKSwgd2hlcmUgdGhlIGZpcnN0IG9uZSB3aWxsIHRha2VcbiAgICAgIGhpZ2hlciBwcmlvcml0eSBvdmVyIHRoZSBsYXN0IG9uZS4gQnkgZGVmYXVsdCBhdXRvY29tcGxldGUtcHl0aG9uIHdpbGxcbiAgICAgIGF1dG9tYXRpY2FsbHkgbG9vayBmb3IgdmlydHVhbCBlbnZpcm9ubWVudHMgaW5zaWRlIG9mIHlvdXIgcHJvamVjdCBhbmRcbiAgICAgIHRyeSB0byB1c2UgdGhlbSBhcyB3ZWxsIGFzIHRyeSB0byBmaW5kIGdsb2JhbCBweXRob24gZXhlY3V0YWJsZS4gSWYgeW91XG4gICAgICB1c2UgdGhpcyBjb25maWcsIGF1dG9tYXRpYyBsb29rdXAgd2lsbCBoYXZlIGxvd2VzdCBwcmlvcml0eS5cbiAgICAgIFVzZSBgJFBST0pFQ1RgIG9yIGAkUFJPSkVDVF9OQU1FYCBzdWJzdGl0dXRpb24gZm9yIHByb2plY3Qtc3BlY2lmaWNcbiAgICAgIHBhdGhzIHRvIHBvaW50IG9uIGV4ZWN1dGFibGVzIGluIHZpcnR1YWwgZW52aXJvbm1lbnRzLlxuICAgICAgRm9yIGV4YW1wbGU6XG4gICAgICBgL1VzZXJzL25hbWUvLnZpcnR1YWxlbnZzLyRQUk9KRUNUX05BTUUvYmluL3B5dGhvbjskUFJPSkVDVC92ZW52L2Jpbi9weXRob24zOy91c3IvYmluL3B5dGhvbmAuXG4gICAgICBTdWNoIGNvbmZpZyB3aWxsIGZhbGwgYmFjayBvbiBgL3Vzci9iaW4vcHl0aG9uYCBmb3IgcHJvamVjdHMgbm90IHByZXNlbnRlZFxuICAgICAgd2l0aCBzYW1lIG5hbWUgaW4gYC52aXJ0dWFsZW52c2AgYW5kIHdpdGhvdXQgYHZlbnZgIGZvbGRlciBpbnNpZGUgb2Ygb25lXG4gICAgICBvZiBwcm9qZWN0IGZvbGRlcnMuXG4gICAgICBJZiB5b3UgYXJlIHVzaW5nIHB5dGhvbjMgZXhlY3V0YWJsZSB3aGlsZSBjb2RpbmcgZm9yIHB5dGhvbjIgeW91IHdpbGwgZ2V0XG4gICAgICBweXRob24yIGNvbXBsZXRpb25zIGZvciBzb21lIGJ1aWx0LWlucy4nJydcbiAgICBleHRyYVBhdGhzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICBvcmRlcjogNFxuICAgICAgdGl0bGU6ICdFeHRyYSBQYXRocyBGb3IgUGFja2FnZXMnXG4gICAgICBkZXNjcmlwdGlvbjogJycnU2VtaWNvbG9uIHNlcGFyYXRlZCBsaXN0IG9mIG1vZHVsZXMgdG8gYWRkaXRpb25hbGx5XG4gICAgICBpbmNsdWRlIGZvciBhdXRvY29tcGxldGUuIFlvdSBjYW4gdXNlIHNhbWUgc3Vic3RpdHV0aW9ucyBhcyBpblxuICAgICAgYFB5dGhvbiBFeGVjdXRhYmxlIFBhdGhzYC5cbiAgICAgIE5vdGUgdGhhdCBpdCBzdGlsbCBzaG91bGQgYmUgdmFsaWQgcHl0aG9uIHBhY2thZ2UuXG4gICAgICBGb3IgZXhhbXBsZTpcbiAgICAgIGAkUFJPSkVDVC9lbnYvbGliL3B5dGhvbjIuNy9zaXRlLXBhY2thZ2VzYFxuICAgICAgb3JcbiAgICAgIGAvVXNlci9uYW1lLy52aXJ0dWFsZW52cy8kUFJPSkVDVF9OQU1FL2xpYi9weXRob24yLjcvc2l0ZS1wYWNrYWdlc2AuXG4gICAgICBZb3UgZG9uJ3QgbmVlZCB0byBzcGVjaWZ5IGV4dHJhIHBhdGhzIGZvciBsaWJyYXJpZXMgaW5zdGFsbGVkIHdpdGggcHl0aG9uXG4gICAgICBleGVjdXRhYmxlIHlvdSB1c2UuJycnXG4gICAgY2FzZUluc2Vuc2l0aXZlQ29tcGxldGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDVcbiAgICAgIHRpdGxlOiAnQ2FzZSBJbnNlbnNpdGl2ZSBDb21wbGV0aW9uJ1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgY29tcGxldGlvbiBpcyBieSBkZWZhdWx0IGNhc2UgaW5zZW5zaXRpdmUuJ1xuICAgIHRyaWdnZXJDb21wbGV0aW9uUmVnZXg6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJyhbXFwuXFwgKF18W2EtekEtWl9dW2EtekEtWjAtOV9dKiknXG4gICAgICBvcmRlcjogNlxuICAgICAgdGl0bGU6ICdSZWdleCBUbyBUcmlnZ2VyIEF1dG9jb21wbGV0aW9ucydcbiAgICAgIGRlc2NyaXB0aW9uOiAnJydCeSBkZWZhdWx0IGNvbXBsZXRpb25zIHRyaWdnZXJlZCBhZnRlciB3b3JkcywgZG90cywgc3BhY2VzXG4gICAgICBhbmQgbGVmdCBwYXJlbnRoZXNpcy4gWW91IHdpbGwgbmVlZCB0byByZXN0YXJ0IHlvdXIgZWRpdG9yIGFmdGVyIGNoYW5naW5nXG4gICAgICB0aGlzLicnJ1xuICAgIGZ1enp5TWF0Y2hlcjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDdcbiAgICAgIHRpdGxlOiAnVXNlIEZ1enp5IE1hdGNoZXIgRm9yIENvbXBsZXRpb25zLidcbiAgICAgIGRlc2NyaXB0aW9uOiAnJydUeXBpbmcgYHN0ZHJgIHdpbGwgbWF0Y2ggYHN0ZGVycmAuXG4gICAgICBGaXJzdCBjaGFyYWN0ZXIgc2hvdWxkIGFsd2F5cyBtYXRjaC4gVXNlcyBhZGRpdGlvbmFsIGNhY2hpbmcgdGh1c1xuICAgICAgY29tcGxldGlvbnMgc2hvdWxkIGJlIGZhc3Rlci4gTm90ZSB0aGF0IHRoaXMgc2V0dGluZyBkb2VzIG5vdCBhZmZlY3RcbiAgICAgIGJ1aWx0LWluIGF1dG9jb21wbGV0ZS1wbHVzIHByb3ZpZGVyLicnJ1xuICAgIG91dHB1dFByb3ZpZGVyRXJyb3JzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgb3JkZXI6IDhcbiAgICAgIHRpdGxlOiAnT3V0cHV0IFByb3ZpZGVyIEVycm9ycydcbiAgICAgIGRlc2NyaXB0aW9uOiAnJydTZWxlY3QgaWYgeW91IHdvdWxkIGxpa2UgdG8gc2VlIHRoZSBwcm92aWRlciBlcnJvcnMgd2hlblxuICAgICAgdGhleSBoYXBwZW4uIEJ5IGRlZmF1bHQgdGhleSBhcmUgaGlkZGVuLiBOb3RlIHRoYXQgY3JpdGljYWwgZXJyb3JzIGFyZVxuICAgICAgYWx3YXlzIHNob3duLicnJ1xuICAgIG91dHB1dERlYnVnOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgb3JkZXI6IDlcbiAgICAgIHRpdGxlOiAnT3V0cHV0IERlYnVnIExvZ3MnXG4gICAgICBkZXNjcmlwdGlvbjogJycnU2VsZWN0IGlmIHlvdSB3b3VsZCBsaWtlIHRvIHNlZSBkZWJ1ZyBpbmZvcm1hdGlvbiBpblxuICAgICAgZGV2ZWxvcGVyIHRvb2xzIGxvZ3MuIE1heSBzbG93IGRvd24geW91ciBlZGl0b3IuJycnXG4gICAgc2hvd1Rvb2x0aXBzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgb3JkZXI6IDEwXG4gICAgICB0aXRsZTogJ1Nob3cgVG9vbHRpcHMgd2l0aCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgb2JqZWN0IHVuZGVyIHRoZSBjdXJzb3InXG4gICAgICBkZXNjcmlwdGlvbjogJycnRVhQRVJJTUVOVEFMIEZFQVRVUkUgV0hJQ0ggSVMgTk9UIEZJTklTSEVEIFlFVC5cbiAgICAgIEZlZWRiYWNrIGFuZCBpZGVhcyBhcmUgd2VsY29tZSBvbiBnaXRodWIuJycnXG4gICAgc3VnZ2VzdGlvblByaW9yaXR5OlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAzXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBtYXhpbXVtOiA5OVxuICAgICAgb3JkZXI6IDExXG4gICAgICB0aXRsZTogJ1N1Z2dlc3Rpb24gUHJpb3JpdHknXG4gICAgICBkZXNjcmlwdGlvbjogJycnWW91IGNhbiB1c2UgdGhpcyB0byBzZXQgdGhlIHByaW9yaXR5IGZvciBhdXRvY29tcGxldGUtcHl0aG9uXG4gICAgICBzdWdnZXN0aW9ucy4gRm9yIGV4YW1wbGUsIHlvdSBjYW4gdXNlIGxvd2VyIHZhbHVlIHRvIGdpdmUgaGlnaGVyIHByaW9yaXR5XG4gICAgICBmb3Igc25pcHBldHMgY29tcGxldGlvbnMgd2hpY2ggaGFzIHByaW9yaXR5IG9mIDIuJycnXG4gICAgZW5hYmxlVG91Y2hCYXI6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBvcmRlcjogMTJcbiAgICAgIHRpdGxlOiAnRW5hYmxlIFRvdWNoIEJhciBzdXBwb3J0J1xuICAgICAgZGVzY3JpcHRpb246ICcnJ1Byb29mIG9mIGNvbmNlcHQgZm9yIG5vdywgcmVxdWlyZXMgdG9vbHRpcHMgdG8gYmUgZW5hYmxlZCBhbmQgQXRvbSA+PTEuMTkuMC4nJydcblxuICBpbnN0YWxsYXRpb246IG51bGxcblxuICBfaGFuZGxlR3JhbW1hckNoYW5nZUV2ZW50OiAoZ3JhbW1hcikgLT5cbiAgICAjIHRoaXMgc2hvdWxkIGJlIHNhbWUgd2l0aCBhY3RpdmF0aW9uSG9va3MgbmFtZXNcbiAgICBpZiBncmFtbWFyLnBhY2thZ2VOYW1lIGluIFsnbGFuZ3VhZ2UtcHl0aG9uJywgJ01hZ2ljUHl0aG9uJywgJ2F0b20tZGphbmdvJ11cbiAgICAgIEBwcm92aWRlci5sb2FkKClcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1sb2FkLXByb3ZpZGVyJ1xuICAgICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuXG4gIF9sb2FkS2l0ZTogLT5cbiAgICBmaXJzdEluc3RhbGwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0b2NvbXBsZXRlLXB5dGhvbi5pbnN0YWxsZWQnKSA9PSBudWxsXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2F1dG9jb21wbGV0ZS1weXRob24uaW5zdGFsbGVkJywgdHJ1ZSlcbiAgICBsb25nUnVubmluZyA9IHJlcXVpcmUoJ3Byb2Nlc3MnKS51cHRpbWUoKSA+IDEwXG4gICAgaWYgZmlyc3RJbnN0YWxsIGFuZCBsb25nUnVubmluZ1xuICAgICAgZXZlbnQgPSBcImluc3RhbGxlZFwiXG4gICAgZWxzZSBpZiBmaXJzdEluc3RhbGxcbiAgICAgIGV2ZW50ID0gXCJ1cGdyYWRlZFwiXG4gICAgZWxzZVxuICAgICAgZXZlbnQgPSBcInJlc3RhcnRlZFwiXG5cbiAgICB7XG4gICAgICBBY2NvdW50TWFuYWdlcixcbiAgICAgIEF0b21IZWxwZXIsXG4gICAgICBNZXRyaWNzLFxuICAgICAgTG9nZ2VyLFxuICAgICAgU3RhdGVDb250cm9sbGVyLFxuICAgICAgTm9kZUNsaWVudCxcbiAgICAgIGluc3RhbGxcbiAgICB9ID0gcmVxdWlyZSAna2l0ZS1pbnN0YWxsZXInXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2tpdGUubG9nZ2luZ0xldmVsJylcbiAgICAgIExvZ2dlci5MRVZFTCA9IExvZ2dlci5MRVZFTFNbYXRvbS5jb25maWcuZ2V0KCdraXRlLmxvZ2dpbmdMZXZlbCcpLnRvVXBwZXJDYXNlKCldXG5cbiAgICBlZGl0b3JDZmcgPVxuICAgICAgVVVJRDogbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21ldHJpY3MudXNlcklkJylcbiAgICAgIG5hbWU6ICdhdG9tJ1xuICAgIHBsdWdpbkNmZyA9XG4gICAgICBuYW1lOiAnYXV0b2NvbXBsZXRlLXB5dGhvbidcblxuICAgIE1ldHJpY3MuVHJhY2tlci5zb3VyY2UgPSAnYXV0b2NvbXBsZXRlLXB5dGhvbidcbiAgICBNZXRyaWNzLmVuYWJsZWQgPSBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUudGVsZW1ldHJ5Q29uc2VudCcpIGlzICdsaW1pdGVkJ1xuXG4gICAgYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlUGFja2FnZSAocGtnKSA9PlxuICAgICAgaWYgcGtnLm5hbWUgaXMgJ2tpdGUnXG4gICAgICAgIEBwYXRjaEtpdGVDb21wbGV0aW9ucyhwa2cpXG5cbiAgICBjaGVja0tpdGVJbnN0YWxsYXRpb24gPSAoKSA9PlxuICAgICAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQgJ2F1dG9jb21wbGV0ZS1weXRob24udXNlS2l0ZSdcblxuICAgICAgU3RhdGVDb250cm9sbGVyLmNhbkluc3RhbGxLaXRlKCkudGhlbigoKSAtPlxuICAgICAgICBJbnN0YWxsID0gaW5zdGFsbC5JbnN0YWxsXG4gICAgICAgIGluc3RhbGxlciA9IG5ldyBJbnN0YWxsKGluc3RhbGwuYXRvbSgpLmF1dG9jb21wbGV0ZVB5dGhvbkZsb3coKSwge1xuICAgICAgICAgIHBhdGg6IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdIHx8IG9zLmhvbWVkaXIoKSxcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZhaWx1cmVTdGVwOiAndGVybWluYXRpb24nLFxuICAgICAgICAgIHRpdGxlOiAnQ2hvb3NlIHlvdXIgYXV0b2NvbXBsZXRlLXB5dGhvbiBlbmdpbmUnLFxuICAgICAgICB9KVxuXG4gICAgICAgIGluaXRpYWxDbGllbnQgPSBBY2NvdW50TWFuYWdlci5jbGllbnRcbiAgICAgICAgQWNjb3VudE1hbmFnZXIuY2xpZW50ID0gbmV3IE5vZGVDbGllbnQoJ2FscGhhLmtpdGUuY29tJywgLTEsICcnLCB0cnVlKVxuXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hZGRJdGVtKGluc3RhbGxlcilcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2YXRlSXRlbShpbnN0YWxsZXIpXG5cbiAgICAgICAgaW5zdGFsbGVkID0gZmFsc2VcblxuICAgICAgICBpbnN0YWxsZXIub25EaWREZXN0cm95KC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLnVzZUtpdGUnLCBpbnN0YWxsZWQpXG4gICAgICAgICAgQWNjb3VudE1hbmFnZXIuY2xpZW50ID0gaW5pdGlhbENsaWVudFxuICAgICAgICApXG5cbiAgICAgICAgaW5zdGFsbGVyLm9uRGlkVWRwZGF0ZVN0YXRlKChzdGF0ZSkgLT5cbiAgICAgICAgICBpZiB0eXBlb2Ygc3RhdGUuaW5zdGFsbCAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgaW5zdGFsbGVkID0gc3RhdGUuaW5zdGFsbC5kb25lIHx8IGZhbHNlXG4gICAgICAgIClcblxuICAgICAgICBpbnN0YWxsZXIub24oJ2RpZC1za2lwLWluc3RhbGwnLCAoKSAtPlxuICAgICAgICAgIGluc3RhbGxlZCA9IGZhbHNlXG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLnVzZUtpdGUnLCBpbnN0YWxsZWQpXG4gICAgICAgIClcblxuICAgICAgICBpbnN0YWxsZXIuc3RhcnQoKVxuICAgICAgLCAoZXJyKSA9PlxuICAgICAgICBpZiB0eXBlb2YgZXJyICE9ICd1bmRlZmluZWQnIGFuZCBlcnIudHlwZSA9PSAnZGVuaWVkJ1xuICAgICAgICAgIGF0b20uY29uZmlnLnNldCAnYXV0b2NvbXBsZXRlLXB5dGhvbi51c2VLaXRlJywgZmFsc2VcbiAgICAgICkgaWYgYXRvbS5jb25maWcuZ2V0ICdhdXRvY29tcGxldGUtcHl0aG9uLnVzZUtpdGUnXG5cbiAgICBjaGVja0tpdGVJbnN0YWxsYXRpb24oKVxuXG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2F1dG9jb21wbGV0ZS1weXRob24udXNlS2l0ZScsICh7IG5ld1ZhbHVlLCBvbGRWYWx1ZSB9KSAtPlxuICAgICAgaWYgbmV3VmFsdWVcbiAgICAgICAgY2hlY2tLaXRlSW5zdGFsbGF0aW9uKClcbiAgICAgICAgQXRvbUhlbHBlci5lbmFibGVQYWNrYWdlKClcbiAgICAgIGVsc2VcbiAgICAgICAgQXRvbUhlbHBlci5kaXNhYmxlUGFja2FnZSgpXG5cbiAgbG9hZDogLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIGRpc3Bvc2FibGUgPSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIEBfaGFuZGxlR3JhbW1hckNoYW5nZUV2ZW50KGVkaXRvci5nZXRHcmFtbWFyKCkpXG4gICAgICBkaXNwb3NhYmxlID0gZWRpdG9yLm9uRGlkQ2hhbmdlR3JhbW1hciAoZ3JhbW1hcikgPT5cbiAgICAgICAgQF9oYW5kbGVHcmFtbWFyQ2hhbmdlRXZlbnQoZ3JhbW1hcilcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgZGlzcG9zYWJsZVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgZGlzcG9zYWJsZVxuICAgIEBfbG9hZEtpdGUoKVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEBwcm92aWRlciA9IHJlcXVpcmUoJy4vcHJvdmlkZXInKVxuICAgIGlmIHR5cGVvZiBhdG9tLnBhY2thZ2VzLmhhc0FjdGl2YXRlZEluaXRpYWxQYWNrYWdlcyA9PSAnZnVuY3Rpb24nIGFuZFxuICAgICAgICBhdG9tLnBhY2thZ2VzLmhhc0FjdGl2YXRlZEluaXRpYWxQYWNrYWdlcygpXG4gICAgICBAbG9hZCgpXG4gICAgZWxzZVxuICAgICAgZGlzcG9zYWJsZSA9IGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZUluaXRpYWxQYWNrYWdlcyA9PlxuICAgICAgICBAbG9hZCgpXG4gICAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAcHJvdmlkZXIuZGlzcG9zZSgpIGlmIEBwcm92aWRlclxuICAgIEBpbnN0YWxsYXRpb24uZGVzdHJveSgpIGlmIEBpbnN0YWxsYXRpb25cblxuICBnZXRQcm92aWRlcjogLT5cbiAgICByZXR1cm4gQHByb3ZpZGVyXG5cbiAgZ2V0SHlwZXJjbGlja1Byb3ZpZGVyOiAtPlxuICAgIHJldHVybiByZXF1aXJlKCcuL2h5cGVyY2xpY2stcHJvdmlkZXInKVxuXG4gIGNvbnN1bWVTbmlwcGV0czogKHNuaXBwZXRzTWFuYWdlcikgLT5cbiAgICBkaXNwb3NhYmxlID0gQGVtaXR0ZXIub24gJ2RpZC1sb2FkLXByb3ZpZGVyJywgPT5cbiAgICAgIEBwcm92aWRlci5zZXRTbmlwcGV0c01hbmFnZXIgc25pcHBldHNNYW5hZ2VyXG4gICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKVxuXG4gIHBhdGNoS2l0ZUNvbXBsZXRpb25zOiAoa2l0ZSkgLT5cbiAgICByZXR1cm4gaWYgQGtpdGVQYWNrYWdlP1xuXG4gICAgQGtpdGVQYWNrYWdlID0ga2l0ZS5tYWluTW9kdWxlXG4gICAgQGtpdGVQcm92aWRlciA9IEBraXRlUGFja2FnZS5jb21wbGV0aW9ucygpXG4gICAgZ2V0U3VnZ2VzdGlvbnMgPSBAa2l0ZVByb3ZpZGVyLmdldFN1Z2dlc3Rpb25zXG4gICAgQGtpdGVQcm92aWRlci5nZXRTdWdnZXN0aW9ucyA9IChhcmdzLi4uKSA9PlxuICAgICAgZ2V0U3VnZ2VzdGlvbnM/LmFwcGx5KEBraXRlUHJvdmlkZXIsIGFyZ3MpXG4gICAgICA/LnRoZW4gKHN1Z2dlc3Rpb25zKSA9PlxuICAgICAgICBAbGFzdEtpdGVTdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25zXG4gICAgICAgIEBraXRlU3VnZ2VzdGVkID0gc3VnZ2VzdGlvbnM/XG4gICAgICAgIHN1Z2dlc3Rpb25zXG4gICAgICA/LmNhdGNoIChlcnIpID0+XG4gICAgICAgIEBsYXN0S2l0ZVN1Z2dlc3Rpb25zID0gW11cbiAgICAgICAgQGtpdGVTdWdnZXN0ZWQgPSBmYWxzZVxuICAgICAgICB0aHJvdyBlcnJcbiJdfQ==
