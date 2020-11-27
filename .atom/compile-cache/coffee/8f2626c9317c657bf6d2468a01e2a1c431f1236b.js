(function() {
  var CompositeDisposable, actionDecorator, atomActionName, editorProxy, emmet, emmetActions, fs, getUserHome, isValidTabContext, k, loadExtensions, multiSelectionActionDecorator, path, ref, registerInteractiveActions, resources, runAction, singleSelectionActions, toggleCommentSyntaxes, v;

  path = require('path');

  fs = require('fs');

  CompositeDisposable = require('atom').CompositeDisposable;

  emmet = require('emmet');

  emmetActions = require('emmet/lib/action/main');

  resources = require('emmet/lib/assets/resources');

  editorProxy = require('./editor-proxy');

  singleSelectionActions = ['prev_edit_point', 'next_edit_point', 'merge_lines', 'reflect_css_value', 'select_next_item', 'select_previous_item', 'wrap_with_abbreviation', 'update_tag'];

  toggleCommentSyntaxes = ['html', 'css', 'less', 'scss'];

  ref = atom.config.get('emmet.stylus');
  for (k in ref) {
    v = ref[k];
    emmet.preferences.set('stylus.' + k, v);
  }

  getUserHome = function() {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE;
    }
    return process.env.HOME;
  };

  isValidTabContext = function() {
    var contains, scopes;
    if (editorProxy.getGrammar() === 'html') {
      scopes = editorProxy.getCurrentScope();
      contains = function(regexp) {
        return scopes.filter(function(s) {
          return regexp.test(s);
        }).length;
      };
      if (contains(/\.js\.embedded\./)) {
        return contains(/^string\./);
      }
    }
    return true;
  };

  actionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return runAction(action, evt);
        };
      })(this));
    };
  };

  multiSelectionActionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return editorProxy.exec(function(i) {
            runAction(action, evt);
            if (evt.keyBindingAborted) {
              return false;
            }
          });
        };
      })(this));
    };
  };

  runAction = function(action, evt) {
    var activeEditor, result, se, syntax;
    syntax = editorProxy.getSyntax();
    if (action === 'expand_abbreviation_with_tab') {
      activeEditor = editorProxy.editor;
      if (!isValidTabContext() || !activeEditor.getLastSelection().isEmpty()) {
        return evt.abortKeyBinding();
      }
      if (activeEditor.snippetExpansion) {
        se = activeEditor.snippetExpansion;
        if (se.tabStopIndex + 1 >= se.tabStopMarkers.length) {
          se.destroy();
        } else {
          return evt.abortKeyBinding();
        }
      }
    }
    if (action === 'toggle_comment' && (toggleCommentSyntaxes.indexOf(syntax) === -1 || !atom.config.get('emmet.useEmmetComments'))) {
      return evt.abortKeyBinding();
    }
    if (action === 'insert_formatted_line_break_only') {
      if (!atom.config.get('emmet.formatLineBreaks')) {
        return evt.abortKeyBinding();
      }
      result = emmet.run(action, editorProxy);
      if (!result) {
        return evt.abortKeyBinding();
      } else {
        return true;
      }
    }
    return emmet.run(action, editorProxy);
  };

  atomActionName = function(name) {
    return 'emmet:' + name.replace(/_/g, '-');
  };

  registerInteractiveActions = function(actions) {
    var j, len, name, ref1, results;
    ref1 = ['wrap_with_abbreviation', 'update_tag', 'interactive_expand_abbreviation'];
    results = [];
    for (j = 0, len = ref1.length; j < len; j++) {
      name = ref1[j];
      results.push((function(name) {
        var atomAction;
        atomAction = atomActionName(name);
        return actions[atomAction] = function(evt) {
          var interactive;
          editorProxy.setup(this.getModel());
          interactive = require('./interactive');
          return interactive.run(name, editorProxy);
        };
      })(name));
    }
    return results;
  };

  loadExtensions = function() {
    var extPath, files;
    extPath = atom.config.get('emmet.extensionsPath');
    console.log('Loading Emmet extensions from', extPath);
    if (!extPath) {
      return;
    }
    if (extPath[0] === '~') {
      extPath = getUserHome() + extPath.substr(1);
    }
    if (fs.existsSync(extPath)) {
      emmet.resetUserData();
      files = fs.readdirSync(extPath);
      files = files.map(function(item) {
        return path.join(extPath, item);
      }).filter(function(file) {
        return !fs.statSync(file).isDirectory();
      });
      return emmet.loadExtensions(files);
    } else {
      return console.warn('Emmet: no such extension folder:', extPath);
    }
  };

  module.exports = {
    config: {
      extensionsPath: {
        type: 'string',
        "default": '~/emmet'
      },
      formatLineBreaks: {
        type: 'boolean',
        "default": true
      },
      useEmmetComments: {
        type: 'boolean',
        "default": false,
        description: 'disable to use atom native commenting system'
      }
    },
    activate: function(state) {
      var action, atomAction, cmd, j, len, ref1;
      this.state = state;
      this.subscriptions = new CompositeDisposable;
      if (!this.actions) {
        this.subscriptions.add(atom.config.observe('emmet.extensionsPath', loadExtensions));
        this.actions = {};
        registerInteractiveActions(this.actions);
        ref1 = emmetActions.getList();
        for (j = 0, len = ref1.length; j < len; j++) {
          action = ref1[j];
          atomAction = atomActionName(action.name);
          if (this.actions[atomAction] != null) {
            continue;
          }
          cmd = singleSelectionActions.indexOf(action.name) !== -1 ? actionDecorator(action.name) : multiSelectionActionDecorator(action.name);
          this.actions[atomAction] = cmd;
        }
      }
      return this.subscriptions.add(atom.commands.add('atom-text-editor', this.actions));
    },
    deactivate: function() {
      return atom.config.transact((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2VtbWV0L2xpYi9lbW1ldC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0osc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0VBQ1IsWUFBQSxHQUFlLE9BQUEsQ0FBUSx1QkFBUjs7RUFDZixTQUFBLEdBQVksT0FBQSxDQUFRLDRCQUFSOztFQUVaLFdBQUEsR0FBZSxPQUFBLENBQVEsZ0JBQVI7O0VBR2Ysc0JBQUEsR0FBeUIsQ0FDdkIsaUJBRHVCLEVBQ0osaUJBREksRUFDZSxhQURmLEVBRXZCLG1CQUZ1QixFQUVGLGtCQUZFLEVBRWtCLHNCQUZsQixFQUd2Qix3QkFIdUIsRUFHRyxZQUhIOztFQU16QixxQkFBQSxHQUF3QixDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCLE1BQXhCOztBQUV4QjtBQUFBLE9BQUEsUUFBQTs7SUFDSSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQWxCLENBQXNCLFNBQUEsR0FBWSxDQUFsQyxFQUFxQyxDQUFyQztBQURKOztFQUdBLFdBQUEsR0FBYyxTQUFBO0lBQ1osSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QjtBQUNFLGFBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQURyQjs7V0FHQSxPQUFPLENBQUMsR0FBRyxDQUFDO0VBSkE7O0VBTWQsaUJBQUEsR0FBb0IsU0FBQTtBQUNsQixRQUFBO0lBQUEsSUFBRyxXQUFXLENBQUMsVUFBWixDQUFBLENBQUEsS0FBNEIsTUFBL0I7TUFFRSxNQUFBLEdBQVMsV0FBVyxDQUFDLGVBQVosQ0FBQTtNQUNULFFBQUEsR0FBVyxTQUFDLE1B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Q3BHLElBQUMsQ0FBQSxPQUFRLENBQUEsVUFBQSxDQUFULEdBQXVCO0FBTHpCLFNBSkY7O2FBV0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsSUFBQyxDQUFBLE9BQXZDLENBQW5CO0lBYlEsQ0FaVjtJQTJCQSxVQUFBLEVBQVksU0FBQTthQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBWixDQUFxQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7SUFEVSxDQTNCWjs7QUEvSEYiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5lbW1ldCA9IHJlcXVpcmUgJ2VtbWV0J1xuZW1tZXRBY3Rpb25zID0gcmVxdWlyZSAnZW1tZXQvbGliL2FjdGlvbi9tYWluJ1xucmVzb3VyY2VzID0gcmVxdWlyZSAnZW1tZXQvbGliL2Fzc2V0cy9yZXNvdXJjZXMnXG5cbmVkaXRvclByb3h5ICA9IHJlcXVpcmUgJy4vZWRpdG9yLXByb3h5J1xuIyBpbnRlcmFjdGl2ZSAgPSByZXF1aXJlICcuL2ludGVyYWN0aXZlJ1xuXG5zaW5nbGVTZWxlY3Rpb25BY3Rpb25zID0gW1xuICAncHJldl9lZGl0X3BvaW50JywgJ25leHRfZWRpdF9wb2ludCcsICdtZXJnZV9saW5lcycsXG4gICdyZWZsZWN0X2Nzc192YWx1ZScsICdzZWxlY3RfbmV4dF9pdGVtJywgJ3NlbGVjdF9wcmV2aW91c19pdGVtJyxcbiAgJ3dyYXBfd2l0aF9hYmJyZXZpYXRpb24nLCAndXBkYXRlX3RhZydcbl1cblxudG9nZ2xlQ29tbWVudFN5bnRheGVzID0gWydodG1sJywgJ2NzcycsICdsZXNzJywgJ3Njc3MnXVxuXG5mb3IgaywgdiBvZiAgYXRvbS5jb25maWcuZ2V0ICdlbW1ldC5zdHlsdXMnXG4gICAgZW1tZXQucHJlZmVyZW5jZXMuc2V0KCdzdHlsdXMuJyArIGssIHYpO1xuXG5nZXRVc2VySG9tZSA9ICgpIC0+XG4gIGlmIHByb2Nlc3MucGxhdGZvcm0gaXMgJ3dpbjMyJ1xuICAgIHJldHVybiBwcm9jZXNzLmVudi5VU0VSUFJPRklMRVxuXG4gIHByb2Nlc3MuZW52LkhPTUVcblxuaXNWYWxpZFRhYkNvbnRleHQgPSAoKSAtPlxuICBpZiBlZGl0b3JQcm94eS5nZXRHcmFtbWFyKCkgaXMgJ2h0bWwnXG4gICAgIyBIVE1MIG1heSBjb250YWluIGVtYmVkZGVkIGdyYW1tYXJzXG4gICAgc2NvcGVzID0gZWRpdG9yUHJveHkuZ2V0Q3VycmVudFNjb3BlKClcbiAgICBjb250YWlucyA9IChyZWdleHApIC0+IHNjb3Blcy5maWx0ZXIoKHMpIC0+IHJlZ2V4cC50ZXN0IHMpLmxlbmd0aFxuXG4gICAgaWYgY29udGFpbnMgL1xcLmpzXFwuZW1iZWRkZWRcXC4vXG4gICAgICAjIGluIEpTLCBhbGxvdyBUYWIgZXhwYW5kZXIgb25seSBpbnNpZGUgc3RyaW5nXG4gICAgICByZXR1cm4gY29udGFpbnMgL15zdHJpbmdcXC4vXG5cbiAgcmV0dXJuIHRydWVcblxuXG4jIEVtbWV0IGFjdGlvbiBkZWNvcmF0b3I6IGNyZWF0ZXMgYSBjb21tYW5kIGZ1bmN0aW9uXG4jIGZvciBBdG9tIGFuZCBleGVjdXRlcyBFbW1ldCBhY3Rpb24gYXMgc2luZ2xlXG4jIHVuZG8gY29tbWFuZFxuIyBAcGFyYW0gIHtPYmplY3R9IGFjdGlvbiBBY3Rpb24gdG8gcGVyZm9ybVxuIyBAcmV0dXJuIHtGdW5jdGlvbn1cbmFjdGlvbkRlY29yYXRvciA9IChhY3Rpb24pIC0+XG4gIChldnQpIC0+XG4gICAgZWRpdG9yUHJveHkuc2V0dXAgQGdldE1vZGVsKClcbiAgICBlZGl0b3JQcm94eS5lZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIHJ1bkFjdGlvbiBhY3Rpb24sIGV2dFxuXG4jIFNhbWUgYXMgYGFjdGlvbkRlY29yYXRvcigpYCBidXQgZXhlY3V0ZXMgYWN0aW9uXG4jIHdpdGggbXVsdGlwbGUgc2VsZWN0aW9uc1xuIyBAcGFyYW0gIHtPYmplY3R9IGFjdGlvbiBBY3Rpb24gdG8gcGVyZm9ybVxuIyBAcmV0dXJuIHtGdW5jdGlvbn1cbm11bHRpU2VsZWN0aW9uQWN0aW9uRGVjb3JhdG9yID0gKGFjdGlvbikgLT5cbiAgKGV2dCkgLT5cbiAgICBlZGl0b3JQcm94eS5zZXR1cChAZ2V0TW9kZWwoKSlcbiAgICBlZGl0b3JQcm94eS5lZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIGVkaXRvclByb3h5LmV4ZWMgKGkpIC0+XG4gICAgICAgIHJ1bkFjdGlvbiBhY3Rpb24sIGV2dFxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgZXZ0LmtleUJpbmRpbmdBYm9ydGVkXG5cbnJ1bkFjdGlvbiA9IChhY3Rpb24sIGV2dCkgLT5cbiAgc3ludGF4ID0gZWRpdG9yUHJveHkuZ2V0U3ludGF4KClcbiAgaWYgYWN0aW9uIGlzICdleHBhbmRfYWJicmV2aWF0aW9uX3dpdGhfdGFiJ1xuICAgICMgZG8gbm90IGhhbmRsZSBUYWIga2V5IGlmOlxuICAgICMgLTEuIHN5bnRheCBpcyB1bmtub3duLSAobm8gbG9uZ2VyIHZhbGlkLCBkZWZpbmVkIGJ5IGtleW1hcCBzZWxlY3RvcilcbiAgICAjIDIuIHRoZXJl4oCZcyBhIHNlbGVjdGlvbiAodXNlciB3YW50cyB0byBpbmRlbnQgaXQpXG4gICAgIyAzLiBoYXMgZXhwYW5kZWQgc25pcHBldCAoZS5nLiBoYXMgdGFic3RvcHMpXG4gICAgYWN0aXZlRWRpdG9yID0gZWRpdG9yUHJveHkuZWRpdG9yO1xuICAgIGlmIG5vdCBpc1ZhbGlkVGFiQ29udGV4dCgpIG9yIG5vdCBhY3RpdmVFZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmlzRW1wdHkoKVxuICAgICAgcmV0dXJuIGV2dC5hYm9ydEtleUJpbmRpbmcoKVxuICAgIGlmIGFjdGl2ZUVkaXRvci5zbmlwcGV0RXhwYW5zaW9uXG4gICAgICAjIGluIGNhc2Ugb2Ygc25pcHBldCBleHBhbnNpb246IGV4cGFuZCBhYmJyZXZpYXRpb24gaWYgd2UgY3VycmVudGx5IG9uIGxhc3RcbiAgICAgICMgdGFic3RvcFxuICAgICAgc2UgPSBhY3RpdmVFZGl0b3Iuc25pcHBldEV4cGFuc2lvblxuICAgICAgaWYgc2UudGFiU3RvcEluZGV4ICsgMSA+PSBzZS50YWJTdG9wTWFya2Vycy5sZW5ndGhcbiAgICAgICAgc2UuZGVzdHJveSgpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBldnQuYWJvcnRLZXlCaW5kaW5nKClcblxuICBpZiBhY3Rpb24gaXMgJ3RvZ2dsZV9jb21tZW50JyBhbmQgKHRvZ2dsZUNvbW1lbnRTeW50YXhlcy5pbmRleE9mKHN5bnRheCkgaXMgLTEgb3Igbm90IGF0b20uY29uZmlnLmdldCAnZW1tZXQudXNlRW1tZXRDb21tZW50cycpXG4gICAgcmV0dXJuIGV2dC5hYm9ydEtleUJpbmRpbmcoKVxuXG4gIGlmIGFjdGlvbiBpcyAnaW5zZXJ0X2Zvcm1hdHRlZF9saW5lX2JyZWFrX29ubHknXG4gICAgaWYgbm90IGF0b20uY29uZmlnLmdldCAnZW1tZXQuZm9ybWF0TGluZUJyZWFrcydcbiAgICAgIHJldHVybiBldnQuYWJvcnRLZXlCaW5kaW5nKClcblxuICAgIHJlc3VsdCA9IGVtbWV0LnJ1biBhY3Rpb24sIGVkaXRvclByb3h5XG4gICAgcmV0dXJuIGlmIG5vdCByZXN1bHQgdGhlbiBldnQuYWJvcnRLZXlCaW5kaW5nKCkgZWxzZSB0cnVlXG5cbiAgZW1tZXQucnVuIGFjdGlvbiwgZWRpdG9yUHJveHlcblxuYXRvbUFjdGlvbk5hbWUgPSAobmFtZSkgLT5cbiAgJ2VtbWV0OicgKyBuYW1lLnJlcGxhY2UoL18vZywgJy0nKVxuXG5yZWdpc3RlckludGVyYWN0aXZlQWN0aW9ucyA9IChhY3Rpb25zKSAtPlxuICBmb3IgbmFtZSBpbiBbJ3dyYXBfd2l0aF9hYmJyZXZpYXRpb24nLCAndXBkYXRlX3RhZycsICdpbnRlcmFjdGl2ZV9leHBhbmRfYWJicmV2aWF0aW9uJ11cbiAgICBkbyAobmFtZSkgLT5cbiAgICAgIGF0b21BY3Rpb24gPSBhdG9tQWN0aW9uTmFtZSBuYW1lXG4gICAgICBhY3Rpb25zW2F0b21BY3Rpb25dID0gKGV2dCkgLT5cbiAgICAgICAgZWRpdG9yUHJveHkuc2V0dXAoQGdldE1vZGVsKCkpXG4gICAgICAgIGludGVyYWN0aXZlID0gcmVxdWlyZSAnLi9pbnRlcmFjdGl2ZSdcbiAgICAgICAgaW50ZXJhY3RpdmUucnVuKG5hbWUsIGVkaXRvclByb3h5KVxuXG5sb2FkRXh0ZW5zaW9ucyA9ICgpIC0+XG4gIGV4dFBhdGggPSBhdG9tLmNvbmZpZy5nZXQgJ2VtbWV0LmV4dGVuc2lvbnNQYXRoJ1xuICBjb25zb2xlLmxvZyAnTG9hZGluZyBFbW1ldCBleHRlbnNpb25zIGZyb20nLCBleHRQYXRoXG4gIHJldHVybiB1bmxlc3MgZXh0UGF0aFxuXG4gIGlmIGV4dFBhdGhbMF0gaXMgJ34nXG4gICAgZXh0UGF0aCA9IGdldFVzZXJIb21lKCkgKyBleHRQYXRoLnN1YnN0ciAxXG5cbiAgaWYgZnMuZXhpc3RzU3luYyBleHRQYXRoXG4gICAgZW1tZXQucmVzZXRVc2VyRGF0YSgpXG4gICAgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyBleHRQYXRoXG4gICAgZmlsZXMgPSBmaWxlc1xuICAgICAgLm1hcCgoaXRlbSkgLT4gcGF0aC5qb2luIGV4dFBhdGgsIGl0ZW0pXG4gICAgICAuZmlsdGVyKChmaWxlKSAtPiBub3QgZnMuc3RhdFN5bmMoZmlsZSkuaXNEaXJlY3RvcnkoKSlcblxuICAgIGVtbWV0LmxvYWRFeHRlbnNpb25zKGZpbGVzKVxuICBlbHNlXG4gICAgY29uc29sZS53YXJuICdFbW1ldDogbm8gc3VjaCBleHRlbnNpb24gZm9sZGVyOicsIGV4dFBhdGhcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgZXh0ZW5zaW9uc1BhdGg6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ34vZW1tZXQnXG4gICAgZm9ybWF0TGluZUJyZWFrczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIHVzZUVtbWV0Q29tbWVudHM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogJ2Rpc2FibGUgdG8gdXNlIGF0b20gbmF0aXZlIGNvbW1lbnRpbmcgc3lzdGVtJ1xuXG4gIGFjdGl2YXRlOiAoQHN0YXRlKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB1bmxlc3MgQGFjdGlvbnNcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdlbW1ldC5leHRlbnNpb25zUGF0aCcsIGxvYWRFeHRlbnNpb25zXG4gICAgICBAYWN0aW9ucyA9IHt9XG4gICAgICByZWdpc3RlckludGVyYWN0aXZlQWN0aW9ucyBAYWN0aW9uc1xuICAgICAgZm9yIGFjdGlvbiBpbiBlbW1ldEFjdGlvbnMuZ2V0TGlzdCgpXG4gICAgICAgIGF0b21BY3Rpb24gPSBhdG9tQWN0aW9uTmFtZSBhY3Rpb24ubmFtZVxuICAgICAgICBpZiBAYWN0aW9uc1thdG9tQWN0aW9uXT9cbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICBjbWQgPSBpZiBzaW5nbGVTZWxlY3Rpb25BY3Rpb25zLmluZGV4T2YoYWN0aW9uLm5hbWUpIGlzbnQgLTEgdGhlbiBhY3Rpb25EZWNvcmF0b3IoYWN0aW9uLm5hbWUpIGVsc2UgbXVsdGlTZWxlY3Rpb25BY3Rpb25EZWNvcmF0b3IoYWN0aW9uLm5hbWUpXG4gICAgICAgIEBhY3Rpb25zW2F0b21BY3Rpb25dID0gY21kXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCBAYWN0aW9uc1xuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgYXRvbS5jb25maWcudHJhbnNhY3QgPT4gQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4iXX0=
