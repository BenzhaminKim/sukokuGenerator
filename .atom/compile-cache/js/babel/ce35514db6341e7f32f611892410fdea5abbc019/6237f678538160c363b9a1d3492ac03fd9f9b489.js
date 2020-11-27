var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _element = require('./element');

var _element2 = _interopRequireDefault(_element);

var _helpers = require('../helpers');

var StatusBar = (function () {
  function StatusBar() {
    var _this = this;

    _classCallCheck(this, StatusBar);

    this.element = new _element2['default']();
    this.messages = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.element);
    this.subscriptions.add(atom.config.observe('linter-ui-default.statusBarRepresents', function (statusBarRepresents) {
      var notInitial = typeof _this.statusBarRepresents !== 'undefined';
      _this.statusBarRepresents = statusBarRepresents;
      if (notInitial) {
        _this.update();
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.statusBarClickBehavior', function (statusBarClickBehavior) {
      var notInitial = typeof _this.statusBarClickBehavior !== 'undefined';
      _this.statusBarClickBehavior = statusBarClickBehavior;
      if (notInitial) {
        _this.update();
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showStatusBar', function (showStatusBar) {
      _this.element.setVisibility('config', showStatusBar);
    }));
    this.subscriptions.add(atom.workspace.getCenter().observeActivePaneItem(function (paneItem) {
      var isTextEditor = atom.workspace.isTextEditor(paneItem);
      _this.element.setVisibility('pane', isTextEditor);
      if (isTextEditor && _this.statusBarRepresents === 'Current File') {
        _this.update();
      }
    }));

    this.element.onDidClick(function (type) {
      var workspaceView = atom.views.getView(atom.workspace);
      if (_this.statusBarClickBehavior === 'Toggle Panel') {
        atom.commands.dispatch(workspaceView, 'linter-ui-default:toggle-panel');
      } else if (_this.statusBarClickBehavior === 'Toggle Status Bar Scope') {
        atom.config.set('linter-ui-default.statusBarRepresents', _this.statusBarRepresents === 'Entire Project' ? 'Current File' : 'Entire Project');
      } else {
        var postfix = _this.statusBarRepresents === 'Current File' ? '-in-current-file' : '';
        atom.commands.dispatch(workspaceView, 'linter-ui-default:next-' + type + postfix);
      }
    });
  }

  _createClass(StatusBar, [{
    key: 'update',
    value: function update() {
      var _this2 = this;

      var messages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (messages) {
        this.messages = messages;
      } else {
        messages = this.messages;
      }

      var count = { error: 0, warning: 0, info: 0 };
      var currentTextEditor = (0, _helpers.getActiveTextEditor)();
      var currentPath = currentTextEditor && currentTextEditor.getPath() || NaN;
      // NOTE: ^ Setting default to NaN so it won't match empty file paths in messages

      messages.forEach(function (message) {
        if (_this2.statusBarRepresents === 'Entire Project' || (0, _helpers.$file)(message) === currentPath) {
          if (message.severity === 'error') {
            count.error++;
          } else if (message.severity === 'warning') {
            count.warning++;
          } else {
            count.info++;
          }
        }
      });
      this.element.update(count.error, count.warning, count.info);
    }
  }, {
    key: 'attach',
    value: function attach(statusBarRegistry) {
      var _this3 = this;

      var statusBar = null;

      this.subscriptions.add(atom.config.observe('linter-ui-default.statusBarPosition', function (statusBarPosition) {
        if (statusBar) {
          statusBar.destroy();
        }
        statusBar = statusBarRegistry['add' + statusBarPosition + 'Tile']({
          item: _this3.element.item,
          priority: statusBarPosition === 'Left' ? 0 : 1000
        });
      }));
      this.subscriptions.add(new _atom.Disposable(function () {
        if (statusBar) {
          statusBar.destroy();
        }
      }));
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return StatusBar;
})();

module.exports = StatusBar;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvc3RhdHVzLWJhci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRWdELE1BQU07O3VCQUNsQyxXQUFXOzs7O3VCQUNZLFlBQVk7O0lBR2pELFNBQVM7QUFPRixXQVBQLFNBQVMsR0FPQzs7OzBCQVBWLFNBQVM7O0FBUVgsUUFBSSxDQUFDLE9BQU8sR0FBRywwQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsdUNBQXVDLEVBQUUsVUFBQSxtQkFBbUIsRUFBSTtBQUNsRixVQUFNLFVBQVUsR0FBRyxPQUFPLE1BQUssbUJBQW1CLEtBQUssV0FBVyxDQUFBO0FBQ2xFLFlBQUssbUJBQW1CLEdBQUcsbUJBQW1CLENBQUE7QUFDOUMsVUFBSSxVQUFVLEVBQUU7QUFDZCxjQUFLLE1BQU0sRUFBRSxDQUFBO09BQ2Q7S0FDRixDQUFDLENBQ0gsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywwQ0FBMEMsRUFBRSxVQUFBLHNCQUFzQixFQUFJO0FBQ3hGLFVBQU0sVUFBVSxHQUFHLE9BQU8sTUFBSyxzQkFBc0IsS0FBSyxXQUFXLENBQUE7QUFDckUsWUFBSyxzQkFBc0IsR0FBRyxzQkFBc0IsQ0FBQTtBQUNwRCxVQUFJLFVBQVUsRUFBRTtBQUNkLGNBQUssTUFBTSxFQUFFLENBQUE7T0FDZDtLQUNGLENBQUMsQ0FDSCxDQUFB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Q0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQzVEOzs7V0FDSyxnQkFBQyxpQkFBeUIsRUFBRTs7O0FBQ2hDLFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQTs7QUFFcEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHFDQUFxQyxFQUFFLFVBQUEsaUJBQWlCLEVBQUk7QUFDOUUsWUFBSSxTQUFTLEVBQUU7QUFDYixtQkFBUyxDQUFDLE9BQU8sRUFBRSxDQUFBO1NBQ3BCO0FBQ0QsaUJBQVMsR0FBRyxpQkFBaUIsU0FBTyxpQkFBaUIsVUFBTyxDQUFDO0FBQzNELGNBQUksRUFBRSxPQUFLLE9BQU8sQ0FBQyxJQUFJO0FBQ3ZCLGtCQUFRLEVBQUUsaUJBQWlCLEtBQUssTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJO1NBQ2xELENBQUMsQ0FBQTtPQUNILENBQUMsQ0FDSCxDQUFBO0FBQ0QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLHFCQUFlLFlBQVc7QUFDeEIsWUFBSSxTQUFTLEVBQUU7QUFDYixtQkFBUyxDQUFDLE9BQU8sRUFBRSxDQUFBO1NBQ3BCO09BQ0YsQ0FBQyxDQUNILENBQUE7S0FDRjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0E5R0csU0FBUzs7O0FBaUhmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBIiwiZmlsZSI6ImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvc3RhdHVzLWJhci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50J1xuaW1wb3J0IHsgJGZpbGUsIGdldEFjdGl2ZVRleHRFZGl0b3IgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIFN0YXR1c0JhciB7XG4gIGVsZW1lbnQ6IEVsZW1lbnRcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgc3RhdHVzQmFyUmVwcmVzZW50czogJ0VudGlyZSBQcm9qZWN0JyB8ICdDdXJyZW50IEZpbGUnXG4gIHN0YXR1c0JhckNsaWNrQmVoYXZpb3I6ICdUb2dnbGUgUGFuZWwnIHwgJ0p1bXAgdG8gbmV4dCBpc3N1ZScgfCAnVG9nZ2xlIFN0YXR1cyBCYXIgU2NvcGUnXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gbmV3IEVsZW1lbnQoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbGVtZW50KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zdGF0dXNCYXJSZXByZXNlbnRzJywgc3RhdHVzQmFyUmVwcmVzZW50cyA9PiB7XG4gICAgICAgIGNvbnN0IG5vdEluaXRpYWwgPSB0eXBlb2YgdGhpcy5zdGF0dXNCYXJSZXByZXNlbnRzICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICB0aGlzLnN0YXR1c0JhclJlcHJlc2VudHMgPSBzdGF0dXNCYXJSZXByZXNlbnRzXG4gICAgICAgIGlmIChub3RJbml0aWFsKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnN0YXR1c0JhckNsaWNrQmVoYXZpb3InLCBzdGF0dXNCYXJDbGlja0JlaGF2aW9yID0+IHtcbiAgICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLnN0YXR1c0JhckNsaWNrQmVoYXZpb3IgIT09ICd1bmRlZmluZWQnXG4gICAgICAgIHRoaXMuc3RhdHVzQmFyQ2xpY2tCZWhhdmlvciA9IHN0YXR1c0JhckNsaWNrQmVoYXZpb3JcbiAgICAgICAgaWYgKG5vdEluaXRpYWwpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1N0YXR1c0JhcicsIHNob3dTdGF0dXNCYXIgPT4ge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0VmlzaWJpbGl0eSgnY29uZmlnJywgc2hvd1N0YXR1c0JhcilcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtKHBhbmVJdGVtID0+IHtcbiAgICAgICAgY29uc3QgaXNUZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yKHBhbmVJdGVtKVxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0VmlzaWJpbGl0eSgncGFuZScsIGlzVGV4dEVkaXRvcilcbiAgICAgICAgaWYgKGlzVGV4dEVkaXRvciAmJiB0aGlzLnN0YXR1c0JhclJlcHJlc2VudHMgPT09ICdDdXJyZW50IEZpbGUnKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG5cbiAgICB0aGlzLmVsZW1lbnQub25EaWRDbGljayh0eXBlID0+IHtcbiAgICAgIGNvbnN0IHdvcmtzcGFjZVZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgICBpZiAodGhpcy5zdGF0dXNCYXJDbGlja0JlaGF2aW9yID09PSAnVG9nZ2xlIFBhbmVsJykge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZVZpZXcsICdsaW50ZXItdWktZGVmYXVsdDp0b2dnbGUtcGFuZWwnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1c0JhckNsaWNrQmVoYXZpb3IgPT09ICdUb2dnbGUgU3RhdHVzIEJhciBTY29wZScpIHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFxuICAgICAgICAgICdsaW50ZXItdWktZGVmYXVsdC5zdGF0dXNCYXJSZXByZXNlbnRzJyxcbiAgICAgICAgICB0aGlzLnN0YXR1c0JhclJlcHJlc2VudHMgPT09ICdFbnRpcmUgUHJvamVjdCcgPyAnQ3VycmVudCBGaWxlJyA6ICdFbnRpcmUgUHJvamVjdCcsXG4gICAgICAgIClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHBvc3RmaXggPSB0aGlzLnN0YXR1c0JhclJlcHJlc2VudHMgPT09ICdDdXJyZW50IEZpbGUnID8gJy1pbi1jdXJyZW50LWZpbGUnIDogJydcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VWaWV3LCBgbGludGVyLXVpLWRlZmF1bHQ6bmV4dC0ke3R5cGV9JHtwb3N0Zml4fWApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICB1cGRhdGUobWVzc2FnZXM6ID9BcnJheTxMaW50ZXJNZXNzYWdlPiA9IG51bGwpOiB2b2lkIHtcbiAgICBpZiAobWVzc2FnZXMpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlcyA9IHRoaXMubWVzc2FnZXNcbiAgICB9XG5cbiAgICBjb25zdCBjb3VudCA9IHsgZXJyb3I6IDAsIHdhcm5pbmc6IDAsIGluZm86IDAgfVxuICAgIGNvbnN0IGN1cnJlbnRUZXh0RWRpdG9yID0gZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgY29uc3QgY3VycmVudFBhdGggPSAoY3VycmVudFRleHRFZGl0b3IgJiYgY3VycmVudFRleHRFZGl0b3IuZ2V0UGF0aCgpKSB8fCBOYU5cbiAgICAvLyBOT1RFOiBeIFNldHRpbmcgZGVmYXVsdCB0byBOYU4gc28gaXQgd29uJ3QgbWF0Y2ggZW1wdHkgZmlsZSBwYXRocyBpbiBtZXNzYWdlc1xuXG4gICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXR1c0JhclJlcHJlc2VudHMgPT09ICdFbnRpcmUgUHJvamVjdCcgfHwgJGZpbGUobWVzc2FnZSkgPT09IGN1cnJlbnRQYXRoKSB7XG4gICAgICAgIGlmIChtZXNzYWdlLnNldmVyaXR5ID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgY291bnQuZXJyb3IrK1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2Uuc2V2ZXJpdHkgPT09ICd3YXJuaW5nJykge1xuICAgICAgICAgIGNvdW50Lndhcm5pbmcrK1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvdW50LmluZm8rK1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmVsZW1lbnQudXBkYXRlKGNvdW50LmVycm9yLCBjb3VudC53YXJuaW5nLCBjb3VudC5pbmZvKVxuICB9XG4gIGF0dGFjaChzdGF0dXNCYXJSZWdpc3RyeTogT2JqZWN0KSB7XG4gICAgbGV0IHN0YXR1c0JhciA9IG51bGxcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zdGF0dXNCYXJQb3NpdGlvbicsIHN0YXR1c0JhclBvc2l0aW9uID0+IHtcbiAgICAgICAgaWYgKHN0YXR1c0Jhcikge1xuICAgICAgICAgIHN0YXR1c0Jhci5kZXN0cm95KClcbiAgICAgICAgfVxuICAgICAgICBzdGF0dXNCYXIgPSBzdGF0dXNCYXJSZWdpc3RyeVtgYWRkJHtzdGF0dXNCYXJQb3NpdGlvbn1UaWxlYF0oe1xuICAgICAgICAgIGl0ZW06IHRoaXMuZWxlbWVudC5pdGVtLFxuICAgICAgICAgIHByaW9yaXR5OiBzdGF0dXNCYXJQb3NpdGlvbiA9PT0gJ0xlZnQnID8gMCA6IDEwMDAsXG4gICAgICAgIH0pXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoc3RhdHVzQmFyKSB7XG4gICAgICAgICAgc3RhdHVzQmFyLmRlc3Ryb3koKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0dXNCYXJcbiJdfQ==