var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _atom = require('atom');

var _helpers = require('./helpers');

var Commands = (function () {
  function Commands() {
    var _this = this;

    _classCallCheck(this, Commands);

    this.messages = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter-ui-default:next': function linterUiDefaultNext() {
        return _this.move(true, true);
      },
      'linter-ui-default:previous': function linterUiDefaultPrevious() {
        return _this.move(false, true);
      },
      'linter-ui-default:next-error': function linterUiDefaultNextError() {
        return _this.move(true, true, 'error');
      },
      'linter-ui-default:previous-error': function linterUiDefaultPreviousError() {
        return _this.move(false, true, 'error');
      },
      'linter-ui-default:next-warning': function linterUiDefaultNextWarning() {
        return _this.move(true, true, 'warning');
      },
      'linter-ui-default:previous-warning': function linterUiDefaultPreviousWarning() {
        return _this.move(false, true, 'warning');
      },
      'linter-ui-default:next-info': function linterUiDefaultNextInfo() {
        return _this.move(true, true, 'info');
      },
      'linter-ui-default:previous-info': function linterUiDefaultPreviousInfo() {
        return _this.move(false, true, 'info');
      },

      'linter-ui-default:next-in-current-file': function linterUiDefaultNextInCurrentFile() {
        return _this.move(true, false);
      },
      'linter-ui-default:previous-in-current-file': function linterUiDefaultPreviousInCurrentFile() {
        return _this.move(false, false);
      },
      'linter-ui-default:next-error-in-current-file': function linterUiDefaultNextErrorInCurrentFile() {
        return _this.move(true, false, 'error');
      },
      'linter-ui-default:previous-error-in-current-file': function linterUiDefaultPreviousErrorInCurrentFile() {
        return _this.move(false, false, 'error');
      },
      'linter-ui-default:next-warning-in-current-file': function linterUiDefaultNextWarningInCurrentFile() {
        return _this.move(true, false, 'warning');
      },
      'linter-ui-default:previous-warning-in-current-file': function linterUiDefaultPreviousWarningInCurrentFile() {
        return _this.move(false, false, 'warning');
      },
      'linter-ui-default:next-info-in-current-file': function linterUiDefaultNextInfoInCurrentFile() {
        return _this.move(true, false, 'info');
      },
      'linter-ui-default:previous-info-in-current-file': function linterUiDefaultPreviousInfoInCurrentFile() {
        return _this.move(false, false, 'info');
      },

      'linter-ui-default:toggle-panel': function linterUiDefaultTogglePanel() {
        return _this.togglePanel();
      },

      // NOTE: Add no-ops here so they are recognized by commands registry
      // Real commands are registered when tooltip is shown inside tooltip's delegate
      'linter-ui-default:expand-tooltip': function linterUiDefaultExpandTooltip() {},
      'linter-ui-default:collapse-tooltip': function linterUiDefaultCollapseTooltip() {}
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'linter-ui-default:apply-all-solutions': function linterUiDefaultApplyAllSolutions() {
        return _this.applyAllSolutions();
      }
    }));
    this.subscriptions.add(atom.commands.add('#linter-panel', {
      'core:copy': function coreCopy() {
        var selection = document.getSelection();
        if (selection) {
          atom.clipboard.write(selection.toString());
        }
      }
    }));
  }

  _createClass(Commands, [{
    key: 'togglePanel',
    value: function togglePanel() {
      atom.config.set('linter-ui-default.showPanel', !atom.config.get('linter-ui-default.showPanel'));
    }

    // NOTE: Apply solutions from bottom to top, so they don't invalidate each other
  }, {
    key: 'applyAllSolutions',
    value: function applyAllSolutions() {
      var textEditor = (0, _helpers.getActiveTextEditor)();
      (0, _assert2['default'])(textEditor, 'textEditor was null on a command supposed to run on text-editors only');
      var messages = (0, _helpers.sortMessages)([{ column: 'line', type: 'desc' }], (0, _helpers.filterMessages)(this.messages, textEditor.getPath()));
      messages.forEach(function (message) {
        if (message.version === 1 && message.fix) {
          (0, _helpers.applySolution)(textEditor, 1, message.fix);
        } else if (message.version === 2 && message.solutions && message.solutions.length) {
          (0, _helpers.applySolution)(textEditor, 2, (0, _helpers.sortSolutions)(message.solutions)[0]);
        }
      });
    }
  }, {
    key: 'move',
    value: function move(forward, globally) {
      var severity = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var currentEditor = (0, _helpers.getActiveTextEditor)();
      var currentFile = currentEditor && currentEditor.getPath() || NaN;
      // NOTE: ^ Setting default to NaN so it won't match empty file paths in messages
      var messages = (0, _helpers.sortMessages)([{ column: 'file', type: 'asc' }, { column: 'line', type: 'asc' }], (0, _helpers.filterMessages)(this.messages, globally ? null : currentFile, severity));
      var expectedValue = forward ? -1 : 1;

      if (!currentEditor) {
        var message = forward ? messages[0] : messages[messages.length - 1];
        if (message) {
          (0, _helpers.visitMessage)(message);
        }
        return;
      }
      var currentPosition = currentEditor.getCursorBufferPosition();

      // NOTE: Iterate bottom to top to find the previous message
      // Because if we search top to bottom when sorted, first item will always
      // be the smallest
      if (!forward) {
        messages.reverse();
      }

      var found = undefined;
      var currentFileEncountered = false;
      for (var i = 0, _length = messages.length; i < _length; i++) {
        var message = messages[i];
        var messageFile = (0, _helpers.$file)(message);
        var messageRange = (0, _helpers.$range)(message);

        if (!currentFileEncountered && messageFile === currentFile) {
          currentFileEncountered = true;
        }
        if (messageFile && messageRange) {
          if (currentFileEncountered && messageFile !== currentFile) {
            found = message;
            break;
          } else if (messageFile === currentFile && currentPosition.compare(messageRange.start) === expectedValue) {
            found = message;
            break;
          }
        }
      }

      if (!found && messages.length) {
        // Reset back to first or last depending on direction
        found = messages[0];
      }

      if (found) {
        (0, _helpers.visitMessage)(found);
      }
    }
  }, {
    key: 'update',
    value: function update(messages) {
      this.messages = messages;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Commands;
})();

module.exports = Commands;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvY29tbWFuZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3NCQUVzQixRQUFROzs7O29CQUNNLE1BQU07O3VCQVduQyxXQUFXOztJQUdaLFFBQVE7QUFJRCxXQUpQLFFBQVEsR0FJRTs7OzBCQUpWLFFBQVE7O0FBS1YsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ2xDLDhCQUF3QixFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztPQUFBO0FBQ3JELGtDQUE0QixFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztPQUFBO0FBQzFELG9DQUE4QixFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7T0FBQTtBQUNwRSx3Q0FBa0MsRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO09BQUE7QUFDekUsc0NBQWdDLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQztPQUFBO0FBQ3hFLDBDQUFvQyxFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUM7T0FBQTtBQUM3RSxtQ0FBNkIsRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDO09BQUE7QUFDbEUsdUNBQWlDLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxLQUFLLEVB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bS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvY29tbWFuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2Fzc2VydCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQge1xuICAkZmlsZSxcbiAgJHJhbmdlLFxuICBnZXRBY3RpdmVUZXh0RWRpdG9yLFxuICB2aXNpdE1lc3NhZ2UsXG4gIHNvcnRNZXNzYWdlcyxcbiAgc29ydFNvbHV0aW9ucyxcbiAgZmlsdGVyTWVzc2FnZXMsXG4gIGFwcGx5U29sdXRpb24sXG59IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4vdHlwZXMnXG5cbmNsYXNzIENvbW1hbmRzIHtcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6bmV4dCc6ICgpID0+IHRoaXMubW92ZSh0cnVlLCB0cnVlKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCB0cnVlKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0Om5leHQtZXJyb3InOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgdHJ1ZSwgJ2Vycm9yJyksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpwcmV2aW91cy1lcnJvcic6ICgpID0+IHRoaXMubW92ZShmYWxzZSwgdHJ1ZSwgJ2Vycm9yJyksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0LXdhcm5pbmcnOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgdHJ1ZSwgJ3dhcm5pbmcnKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLXdhcm5pbmcnOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIHRydWUsICd3YXJuaW5nJyksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0LWluZm8nOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgdHJ1ZSwgJ2luZm8nKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLWluZm8nOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIHRydWUsICdpbmZvJyksXG5cbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0Om5leHQtaW4tY3VycmVudC1maWxlJzogKCkgPT4gdGhpcy5tb3ZlKHRydWUsIGZhbHNlKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLWluLWN1cnJlbnQtZmlsZSc6ICgpID0+IHRoaXMubW92ZShmYWxzZSwgZmFsc2UpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6bmV4dC1lcnJvci1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgZmFsc2UsICdlcnJvcicpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMtZXJyb3ItaW4tY3VycmVudC1maWxlJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCBmYWxzZSwgJ2Vycm9yJyksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0LXdhcm5pbmctaW4tY3VycmVudC1maWxlJzogKCkgPT4gdGhpcy5tb3ZlKHRydWUsIGZhbHNlLCAnd2FybmluZycpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMtd2FybmluZy1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIGZhbHNlLCAnd2FybmluZycpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6bmV4dC1pbmZvLWluLWN1cnJlbnQtZmlsZSc6ICgpID0+IHRoaXMubW92ZSh0cnVlLCBmYWxzZSwgJ2luZm8nKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLWluZm8taW4tY3VycmVudC1maWxlJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCBmYWxzZSwgJ2luZm8nKSxcblxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6dG9nZ2xlLXBhbmVsJzogKCkgPT4gdGhpcy50b2dnbGVQYW5lbCgpLFxuXG4gICAgICAgIC8vIE5PVEU6IEFkZCBuby1vcHMgaGVyZSBzbyB0aGV5IGFyZSByZWNvZ25pemVkIGJ5IGNvbW1hbmRzIHJlZ2lzdHJ5XG4gICAgICAgIC8vIFJlYWwgY29tbWFuZHMgYXJlIHJlZ2lzdGVyZWQgd2hlbiB0b29sdGlwIGlzIHNob3duIGluc2lkZSB0b29sdGlwJ3MgZGVsZWdhdGVcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OmV4cGFuZC10b29sdGlwJzogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OmNvbGxhcHNlLXRvb2x0aXAnOiBmdW5jdGlvbigpIHt9LFxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKScsIHtcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OmFwcGx5LWFsbC1zb2x1dGlvbnMnOiAoKSA9PiB0aGlzLmFwcGx5QWxsU29sdXRpb25zKCksXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCcjbGludGVyLXBhbmVsJywge1xuICAgICAgICAnY29yZTpjb3B5JzogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGRvY3VtZW50LmdldFNlbGVjdGlvbigpXG4gICAgICAgICAgaWYgKHNlbGVjdGlvbikge1xuICAgICAgICAgICAgYXRvbS5jbGlwYm9hcmQud3JpdGUoc2VsZWN0aW9uLnRvU3RyaW5nKCkpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgKVxuICB9XG4gIHRvZ2dsZVBhbmVsKCk6IHZvaWQge1xuICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgIWF0b20uY29uZmlnLmdldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJykpXG4gIH1cbiAgLy8gTk9URTogQXBwbHkgc29sdXRpb25zIGZyb20gYm90dG9tIHRvIHRvcCwgc28gdGhleSBkb24ndCBpbnZhbGlkYXRlIGVhY2ggb3RoZXJcbiAgYXBwbHlBbGxTb2x1dGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgdGV4dEVkaXRvciA9IGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGludmFyaWFudCh0ZXh0RWRpdG9yLCAndGV4dEVkaXRvciB3YXMgbnVsbCBvbiBhIGNvbW1hbmQgc3VwcG9zZWQgdG8gcnVuIG9uIHRleHQtZWRpdG9ycyBvbmx5JylcbiAgICBjb25zdCBtZXNzYWdlcyA9IHNvcnRNZXNzYWdlcyhbeyBjb2x1bW46ICdsaW5lJywgdHlwZTogJ2Rlc2MnIH1dLCBmaWx0ZXJNZXNzYWdlcyh0aGlzLm1lc3NhZ2VzLCB0ZXh0RWRpdG9yLmdldFBhdGgoKSkpXG4gICAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAxICYmIG1lc3NhZ2UuZml4KSB7XG4gICAgICAgIGFwcGx5U29sdXRpb24odGV4dEVkaXRvciwgMSwgbWVzc2FnZS5maXgpXG4gICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMiAmJiBtZXNzYWdlLnNvbHV0aW9ucyAmJiBtZXNzYWdlLnNvbHV0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgYXBwbHlTb2x1dGlvbih0ZXh0RWRpdG9yLCAyLCBzb3J0U29sdXRpb25zKG1lc3NhZ2Uuc29sdXRpb25zKVswXSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIG1vdmUoZm9yd2FyZDogYm9vbGVhbiwgZ2xvYmFsbHk6IGJvb2xlYW4sIHNldmVyaXR5OiA/c3RyaW5nID0gbnVsbCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRFZGl0b3IgPSBnZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBjb25zdCBjdXJyZW50RmlsZTogYW55ID0gKGN1cnJlbnRFZGl0b3IgJiYgY3VycmVudEVkaXRvci5nZXRQYXRoKCkpIHx8IE5hTlxuICAgIC8vIE5PVEU6IF4gU2V0dGluZyBkZWZhdWx0IHRvIE5hTiBzbyBpdCB3b24ndCBtYXRjaCBlbXB0eSBmaWxlIHBhdGhzIGluIG1lc3NhZ2VzXG4gICAgY29uc3QgbWVzc2FnZXMgPSBzb3J0TWVzc2FnZXMoXG4gICAgICBbeyBjb2x1bW46ICdmaWxlJywgdHlwZTogJ2FzYycgfSwgeyBjb2x1bW46ICdsaW5lJywgdHlwZTogJ2FzYycgfV0sXG4gICAgICBmaWx0ZXJNZXNzYWdlcyh0aGlzLm1lc3NhZ2VzLCBnbG9iYWxseSA/IG51bGwgOiBjdXJyZW50RmlsZSwgc2V2ZXJpdHkpLFxuICAgIClcbiAgICBjb25zdCBleHBlY3RlZFZhbHVlID0gZm9yd2FyZCA/IC0xIDogMVxuXG4gICAgaWYgKCFjdXJyZW50RWRpdG9yKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZm9yd2FyZCA/IG1lc3NhZ2VzWzBdIDogbWVzc2FnZXNbbWVzc2FnZXMubGVuZ3RoIC0gMV1cbiAgICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICAgIHZpc2l0TWVzc2FnZShtZXNzYWdlKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGN1cnJlbnRQb3NpdGlvbiA9IGN1cnJlbnRFZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuXG4gICAgLy8gTk9URTogSXRlcmF0ZSBib3R0b20gdG8gdG9wIHRvIGZpbmQgdGhlIHByZXZpb3VzIG1lc3NhZ2VcbiAgICAvLyBCZWNhdXNlIGlmIHdlIHNlYXJjaCB0b3AgdG8gYm90dG9tIHdoZW4gc29ydGVkLCBmaXJzdCBpdGVtIHdpbGwgYWx3YXlzXG4gICAgLy8gYmUgdGhlIHNtYWxsZXN0XG4gICAgaWYgKCFmb3J3YXJkKSB7XG4gICAgICBtZXNzYWdlcy5yZXZlcnNlKClcbiAgICB9XG5cbiAgICBsZXQgZm91bmRcbiAgICBsZXQgY3VycmVudEZpbGVFbmNvdW50ZXJlZCA9IGZhbHNlXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IG1lc3NhZ2VzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gbWVzc2FnZXNbaV1cbiAgICAgIGNvbnN0IG1lc3NhZ2VGaWxlID0gJGZpbGUobWVzc2FnZSlcbiAgICAgIGNvbnN0IG1lc3NhZ2VSYW5nZSA9ICRyYW5nZShtZXNzYWdlKVxuXG4gICAgICBpZiAoIWN1cnJlbnRGaWxlRW5jb3VudGVyZWQgJiYgbWVzc2FnZUZpbGUgPT09IGN1cnJlbnRGaWxlKSB7XG4gICAgICAgIGN1cnJlbnRGaWxlRW5jb3VudGVyZWQgPSB0cnVlXG4gICAgICB9XG4gICAgICBpZiAobWVzc2FnZUZpbGUgJiYgbWVzc2FnZVJhbmdlKSB7XG4gICAgICAgIGlmIChjdXJyZW50RmlsZUVuY291bnRlcmVkICYmIG1lc3NhZ2VGaWxlICE9PSBjdXJyZW50RmlsZSkge1xuICAgICAgICAgIGZvdW5kID0gbWVzc2FnZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZUZpbGUgPT09IGN1cnJlbnRGaWxlICYmIGN1cnJlbnRQb3NpdGlvbi5jb21wYXJlKG1lc3NhZ2VSYW5nZS5zdGFydCkgPT09IGV4cGVjdGVkVmFsdWUpIHtcbiAgICAgICAgICBmb3VuZCA9IG1lc3NhZ2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFmb3VuZCAmJiBtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIC8vIFJlc2V0IGJhY2sgdG8gZmlyc3Qgb3IgbGFzdCBkZXBlbmRpbmcgb24gZGlyZWN0aW9uXG4gICAgICBmb3VuZCA9IG1lc3NhZ2VzWzBdXG4gICAgfVxuXG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICB2aXNpdE1lc3NhZ2UoZm91bmQpXG4gICAgfVxuICB9XG4gIHVwZGF0ZShtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4pIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgfVxuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1hbmRzXG4iXX0=