var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _editor = require('./editor');

var _editor2 = _interopRequireDefault(_editor);

var _helpers = require('./helpers');

var Editors = (function () {
  function Editors() {
    var _this = this;

    _classCallCheck(this, Editors);

    this.editors = new Set();
    this.messages = [];
    this.firstRender = true;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
      _this.getEditor(textEditor);
    }));
    this.subscriptions.add(atom.workspace.getCenter().observeActivePaneItem(function (paneItem) {
      _this.editors.forEach(function (editor) {
        if (editor.textEditor !== paneItem) {
          editor.removeTooltip();
        }
      });
    }));
  }

  _createClass(Editors, [{
    key: 'isFirstRender',
    value: function isFirstRender() {
      return this.firstRender;
    }
  }, {
    key: 'update',
    value: function update(_ref) {
      var messages = _ref.messages;
      var added = _ref.added;
      var removed = _ref.removed;

      this.messages = messages;
      this.firstRender = false;

      var _getEditorsMap = (0, _helpers.getEditorsMap)(this);

      var editorsMap = _getEditorsMap.editorsMap;
      var filePaths = _getEditorsMap.filePaths;

      added.forEach(function (message) {
        var filePath = (0, _helpers.$file)(message);
        if (filePath && editorsMap[filePath]) {
          editorsMap[filePath].added.push(message);
        }
      });
      removed.forEach(function (message) {
        var filePath = (0, _helpers.$file)(message);
        if (filePath && editorsMap[filePath]) {
          editorsMap[filePath].removed.push(message);
        }
      });

      filePaths.forEach(function (filePath) {
        var value = editorsMap[filePath];
        if (value.added.length || value.removed.length) {
          value.editors.forEach(function (editor) {
            return editor.apply(value.added, value.removed);
          });
        }
      });
    }
  }, {
    key: 'getEditor',
    value: function getEditor(textEditor) {
      var _this2 = this;

      for (var entry of this.editors) {
        if (entry.textEditor === textEditor) {
          return entry;
        }
      }
      var editor = new _editor2['default'](textEditor);
      this.editors.add(editor);
      editor.onDidDestroy(function () {
        _this2.editors['delete'](editor);
      });
      editor.subscriptions.add(textEditor.onDidChangePath(function () {
        editor.dispose();
        _this2.getEditor(textEditor);
      }));
      editor.subscriptions.add(textEditor.onDidChangeGrammar(function () {
        editor.dispose();
        _this2.getEditor(textEditor);
      }));
      editor.apply((0, _helpers.filterMessages)(this.messages, textEditor.getPath()), []);
      return editor;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      for (var entry of this.editors) {
        entry.dispose();
      }
      this.subscriptions.dispose();
    }
  }]);

  return Editors;
})();

module.exports = Editors;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvZWRpdG9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRW9DLE1BQU07O3NCQUV2QixVQUFVOzs7O3VCQUN3QixXQUFXOztJQUcxRCxPQUFPO0FBTUEsV0FOUCxPQUFPLEdBTUc7OzswQkFOVixPQUFPOztBQU9ULFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtBQUN2QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUM5QyxZQUFLLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUMzQixDQUFDLENBQ0gsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQzNELFlBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUM3QixZQUFJLE1BQU0sQ0FBQyxVQUFVLEtBQUssUUFBUSxFQUFFO0FBQ2xDLGdCQUFNLENBQUMsYUFBYSxFQUFFLENBQUE7U0FDdkI7T0FDRixDQUFDLENBQUE7S0FDSCxDQUFDLENBQ0gsQ0FBQTtHQUNGOztlQTFCRyxPQUFPOztXQTJCRSx5QkFBWTtBQUN2QixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUE7S0FDeEI7OztXQUNLLGdCQUFDLElBQTJDLEVBQUU7VUFBM0MsUUFBUSxHQUFWLElBQTJDLENBQXpDLFFBQVE7VUFBRSxLQUFL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QUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXRGRyxPQUFPOzs7QUF5RmIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUEiLCJmaWxlIjoiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9lZGl0b3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEVkaXRvciBmcm9tICcuL2VkaXRvcidcbmltcG9ydCB7ICRmaWxlLCBnZXRFZGl0b3JzTWFwLCBmaWx0ZXJNZXNzYWdlcyB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSwgTWVzc2FnZXNQYXRjaCB9IGZyb20gJy4vdHlwZXMnXG5cbmNsYXNzIEVkaXRvcnMge1xuICBlZGl0b3JzOiBTZXQ8RWRpdG9yPlxuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT5cbiAgZmlyc3RSZW5kZXI6IGJvb2xlYW5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZWRpdG9ycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuZmlyc3RSZW5kZXIgPSB0cnVlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyh0ZXh0RWRpdG9yID0+IHtcbiAgICAgICAgdGhpcy5nZXRFZGl0b3IodGV4dEVkaXRvcilcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtKHBhbmVJdGVtID0+IHtcbiAgICAgICAgdGhpcy5lZGl0b3JzLmZvckVhY2goZWRpdG9yID0+IHtcbiAgICAgICAgICBpZiAoZWRpdG9yLnRleHRFZGl0b3IgIT09IHBhbmVJdGVtKSB7XG4gICAgICAgICAgICBlZGl0b3IucmVtb3ZlVG9vbHRpcCgpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSksXG4gICAgKVxuICB9XG4gIGlzRmlyc3RSZW5kZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZmlyc3RSZW5kZXJcbiAgfVxuICB1cGRhdGUoeyBtZXNzYWdlcywgYWRkZWQsIHJlbW92ZWQgfTogTWVzc2FnZXNQYXRjaCkge1xuICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICAgIHRoaXMuZmlyc3RSZW5kZXIgPSBmYWxzZVxuXG4gICAgY29uc3QgeyBlZGl0b3JzTWFwLCBmaWxlUGF0aHMgfSA9IGdldEVkaXRvcnNNYXAodGhpcylcbiAgICBhZGRlZC5mb3JFYWNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gJGZpbGUobWVzc2FnZSlcbiAgICAgIGlmIChmaWxlUGF0aCAmJiBlZGl0b3JzTWFwW2ZpbGVQYXRoXSkge1xuICAgICAgICBlZGl0b3JzTWFwW2ZpbGVQYXRoXS5hZGRlZC5wdXNoKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSlcbiAgICByZW1vdmVkLmZvckVhY2goZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSAkZmlsZShtZXNzYWdlKVxuICAgICAgaWYgKGZpbGVQYXRoICYmIGVkaXRvcnNNYXBbZmlsZVBhdGhdKSB7XG4gICAgICAgIGVkaXRvcnNNYXBbZmlsZVBhdGhdLnJlbW92ZWQucHVzaChtZXNzYWdlKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBmaWxlUGF0aHMuZm9yRWFjaChmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgICAgY29uc3QgdmFsdWUgPSBlZGl0b3JzTWFwW2ZpbGVQYXRoXVxuICAgICAgaWYgKHZhbHVlLmFkZGVkLmxlbmd0aCB8fCB2YWx1ZS5yZW1vdmVkLmxlbmd0aCkge1xuICAgICAgICB2YWx1ZS5lZGl0b3JzLmZvckVhY2goZWRpdG9yID0+IGVkaXRvci5hcHBseSh2YWx1ZS5hZGRlZCwgdmFsdWUucmVtb3ZlZCkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBnZXRFZGl0b3IodGV4dEVkaXRvcjogVGV4dEVkaXRvcik6IEVkaXRvciB7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLmVkaXRvcnMpIHtcbiAgICAgIGlmIChlbnRyeS50ZXh0RWRpdG9yID09PSB0ZXh0RWRpdG9yKSB7XG4gICAgICAgIHJldHVybiBlbnRyeVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBlZGl0b3IgPSBuZXcgRWRpdG9yKHRleHRFZGl0b3IpXG4gICAgdGhpcy5lZGl0b3JzLmFkZChlZGl0b3IpXG4gICAgZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmVkaXRvcnMuZGVsZXRlKGVkaXRvcilcbiAgICB9KVxuICAgIGVkaXRvci5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRleHRFZGl0b3Iub25EaWRDaGFuZ2VQYXRoKCgpID0+IHtcbiAgICAgICAgZWRpdG9yLmRpc3Bvc2UoKVxuICAgICAgICB0aGlzLmdldEVkaXRvcih0ZXh0RWRpdG9yKVxuICAgICAgfSksXG4gICAgKVxuICAgIGVkaXRvci5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRleHRFZGl0b3Iub25EaWRDaGFuZ2VHcmFtbWFyKCgpID0+IHtcbiAgICAgICAgZWRpdG9yLmRpc3Bvc2UoKVxuICAgICAgICB0aGlzLmdldEVkaXRvcih0ZXh0RWRpdG9yKVxuICAgICAgfSksXG4gICAgKVxuICAgIGVkaXRvci5hcHBseShmaWx0ZXJNZXNzYWdlcyh0aGlzLm1lc3NhZ2VzLCB0ZXh0RWRpdG9yLmdldFBhdGgoKSksIFtdKVxuICAgIHJldHVybiBlZGl0b3JcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5lZGl0b3JzKSB7XG4gICAgICBlbnRyeS5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yc1xuIl19