var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('../helpers');

var PanelDelegate = (function () {
  function PanelDelegate() {
    var _this = this;

    _classCallCheck(this, PanelDelegate);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.filteredMessages = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-ui-default.panelRepresents', function (panelRepresents) {
      var notInitial = typeof _this.panelRepresents !== 'undefined';
      _this.panelRepresents = panelRepresents;
      if (notInitial) {
        _this.update();
      }
    }));
    var changeSubscription = undefined;
    this.subscriptions.add(atom.workspace.getCenter().observeActivePaneItem(function () {
      if (changeSubscription) {
        changeSubscription.dispose();
        changeSubscription = null;
      }
      var textEditor = (0, _helpers.getActiveTextEditor)();
      if (textEditor) {
        (function () {
          if (_this.panelRepresents !== 'Entire Project') {
            _this.update();
          }
          var oldRow = -1;
          changeSubscription = textEditor.onDidChangeCursorPosition(function (_ref) {
            var newBufferPosition = _ref.newBufferPosition;

            if (oldRow !== newBufferPosition.row && _this.panelRepresents === 'Current Line') {
              oldRow = newBufferPosition.row;
              _this.update();
            }
          });
        })();
      }

      if (_this.panelRepresents !== 'Entire Project' || textEditor) {
        _this.update();
      }
    }));
    this.subscriptions.add(new _atom.Disposable(function () {
      if (changeSubscription) {
        changeSubscription.dispose();
      }
    }));
  }

  _createClass(PanelDelegate, [{
    key: 'getFilteredMessages',
    value: function getFilteredMessages() {
      var filteredMessages = [];
      if (this.panelRepresents === 'Entire Project') {
        filteredMessages = this.messages;
      } else if (this.panelRepresents === 'Current File') {
        var activeEditor = (0, _helpers.getActiveTextEditor)();
        if (!activeEditor) return [];
        filteredMessages = (0, _helpers.filterMessages)(this.messages, activeEditor.getPath());
      } else if (this.panelRepresents === 'Current Line') {
        var activeEditor = (0, _helpers.getActiveTextEditor)();
        if (!activeEditor) return [];
        var activeLine = activeEditor.getCursors()[0].getBufferRow();
        filteredMessages = (0, _helpers.filterMessagesByRangeOrPoint)(this.messages, activeEditor.getPath(), _atom.Range.fromObject([[activeLine, 0], [activeLine, Infinity]]));
      }
      return filteredMessages;
    }
  }, {
    key: 'update',
    value: function update() {
      var messages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (Array.isArray(messages)) {
        this.messages = messages;
      }
      this.filteredMessages = this.getFilteredMessages();
      this.emitter.emit('observe-messages', this.filteredMessages);
    }
  }, {
    key: 'onDidChangeMessages',
    value: function onDidChangeMessages(callback) {
      return this.emitter.on('observe-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return PanelDelegate;
})();

module.exports = PanelDelegate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvZGVsZWdhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFZ0UsTUFBTTs7dUJBQ1ksWUFBWTs7SUFHeEYsYUFBYTtBQU9OLFdBUFAsYUFBYSxHQU9IOzs7MEJBUFYsYUFBYTs7QUFRZixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUNBQW1DLEVBQUUsVUFBQSxlQUFlLEVBQUk7QUFDMUUsVUFBTSxVQUFVLEdBQUcsT0FBTyxNQUFLLGVBQWUsS0FBSyxXQUFXLENBQUE7QUFDOUQsWUFBSyxlQUFlLEdBQUcsZUFBZSxDQUFBO0FBQ3RDLFVBQUksVUFBVSxFQUFFO0FBQ2QsY0FBSyxNQUFNLEVBQUUsQ0FBQTtPQUNkO0tBQ0YsQ0FBQyxDQUNILENBQUE7QUFDRCxRQUFJLGtCQUFrQixZQUFBLENBQUE7QUFDdEIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMscUJBQXFCLENBQUMsWUFBTTtBQUNyRCxVQUFJLGtCQUFrQixFQUFFO0FBQ3RCLDBCQUFrQixDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLDBCQUFrQixHQUFHLElBQUksQ0FBQTtPQUMxQjtBQUNELFVBQU0sVUFBVSxHQUFHLG1DQUFxQixDQUFBO0FBQ3hDLFVBQUksVUFBVSxFQUFFOztBQUNkLGNBQUksTUFBSyxlQUFlLEtBQUssZ0JBQWdCLEVBQUU7QUFDN0Ms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dGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2RlbGVnYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSwgRW1pdHRlciwgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgZ2V0QWN0aXZlVGV4dEVkaXRvciwgZmlsdGVyTWVzc2FnZXMsIGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIFBhbmVsRGVsZWdhdGUge1xuICBlbWl0dGVyOiBFbWl0dGVyXG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPlxuICBmaWx0ZXJlZE1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPlxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIHBhbmVsUmVwcmVzZW50czogJ0VudGlyZSBQcm9qZWN0JyB8ICdDdXJyZW50IEZpbGUnIHwgJ0N1cnJlbnQgTGluZSdcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5maWx0ZXJlZE1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQucGFuZWxSZXByZXNlbnRzJywgcGFuZWxSZXByZXNlbnRzID0+IHtcbiAgICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLnBhbmVsUmVwcmVzZW50cyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgdGhpcy5wYW5lbFJlcHJlc2VudHMgPSBwYW5lbFJlcHJlc2VudHNcbiAgICAgICAgaWYgKG5vdEluaXRpYWwpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICBsZXQgY2hhbmdlU3Vic2NyaXB0aW9uXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLm9ic2VydmVBY3RpdmVQYW5lSXRlbSgoKSA9PiB7XG4gICAgICAgIGlmIChjaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICBjaGFuZ2VTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICAgICAgY2hhbmdlU3Vic2NyaXB0aW9uID0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRleHRFZGl0b3IgPSBnZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgaWYgKHRleHRFZGl0b3IpIHtcbiAgICAgICAgICBpZiAodGhpcy5wYW5lbFJlcHJlc2VudHMgIT09ICdFbnRpcmUgUHJvamVjdCcpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IG9sZFJvdyA9IC0xXG4gICAgICAgICAgY2hhbmdlU3Vic2NyaXB0aW9uID0gdGV4dEVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKCh7IG5ld0J1ZmZlclBvc2l0aW9uIH0pID0+IHtcbiAgICAgICAgICAgIGlmIChvbGRSb3cgIT09IG5ld0J1ZmZlclBvc2l0aW9uLnJvdyAmJiB0aGlzLnBhbmVsUmVwcmVzZW50cyA9PT0gJ0N1cnJlbnQgTGluZScpIHtcbiAgICAgICAgICAgICAgb2xkUm93ID0gbmV3QnVmZmVyUG9zaXRpb24ucm93XG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucGFuZWxSZXByZXNlbnRzICE9PSAnRW50aXJlIFByb2plY3QnIHx8IHRleHRFZGl0b3IpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgbmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChjaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICBjaGFuZ2VTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgfVxuICBnZXRGaWx0ZXJlZE1lc3NhZ2VzKCk6IEFycmF5PExpbnRlck1lc3NhZ2U+IHtcbiAgICBsZXQgZmlsdGVyZWRNZXNzYWdlcyA9IFtdXG4gICAgaWYgKHRoaXMucGFuZWxSZXByZXNlbnRzID09PSAnRW50aXJlIFByb2plY3QnKSB7XG4gICAgICBmaWx0ZXJlZE1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlc1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbFJlcHJlc2VudHMgPT09ICdDdXJyZW50IEZpbGUnKSB7XG4gICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBnZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGlmICghYWN0aXZlRWRpdG9yKSByZXR1cm4gW11cbiAgICAgIGZpbHRlcmVkTWVzc2FnZXMgPSBmaWx0ZXJNZXNzYWdlcyh0aGlzLm1lc3NhZ2VzLCBhY3RpdmVFZGl0b3IuZ2V0UGF0aCgpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbFJlcHJlc2VudHMgPT09ICdDdXJyZW50IExpbmUnKSB7XG4gICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBnZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGlmICghYWN0aXZlRWRpdG9yKSByZXR1cm4gW11cbiAgICAgIGNvbnN0IGFjdGl2ZUxpbmUgPSBhY3RpdmVFZGl0b3IuZ2V0Q3Vyc29ycygpWzBdLmdldEJ1ZmZlclJvdygpXG4gICAgICBmaWx0ZXJlZE1lc3NhZ2VzID0gZmlsdGVyTWVzc2FnZXNCeVJhbmdlT3JQb2ludChcbiAgICAgICAgdGhpcy5tZXNzYWdlcyxcbiAgICAgICAgYWN0aXZlRWRpdG9yLmdldFBhdGgoKSxcbiAgICAgICAgUmFuZ2UuZnJvbU9iamVjdChbW2FjdGl2ZUxpbmUsIDBdLCBbYWN0aXZlTGluZSwgSW5maW5pdHldXSksXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBmaWx0ZXJlZE1lc3NhZ2VzXG4gIH1cbiAgdXBkYXRlKG1lc3NhZ2VzOiA/QXJyYXk8TGludGVyTWVzc2FnZT4gPSBudWxsKTogdm9pZCB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgICB9XG4gICAgdGhpcy5maWx0ZXJlZE1lc3NhZ2VzID0gdGhpcy5nZXRGaWx0ZXJlZE1lc3NhZ2VzKClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb2JzZXJ2ZS1tZXNzYWdlcycsIHRoaXMuZmlsdGVyZWRNZXNzYWdlcylcbiAgfVxuICBvbkRpZENoYW5nZU1lc3NhZ2VzKGNhbGxiYWNrOiAobWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+KSA9PiBhbnkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdvYnNlcnZlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbERlbGVnYXRlXG4iXX0=