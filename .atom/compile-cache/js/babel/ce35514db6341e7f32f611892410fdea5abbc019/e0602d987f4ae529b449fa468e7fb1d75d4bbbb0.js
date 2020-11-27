var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _statusBar = require('./status-bar');

var _statusBar2 = _interopRequireDefault(_statusBar);

var _busySignal = require('./busy-signal');

var _busySignal2 = _interopRequireDefault(_busySignal);

var _intentions = require('./intentions');

var _intentions2 = _interopRequireDefault(_intentions);

var Editors = undefined;
var TreeView = undefined;

var LinterUI = (function () {
  function LinterUI() {
    _classCallCheck(this, LinterUI);

    this.name = 'Linter';
    this.idleCallbacks = new Set();
    this.signal = new _busySignal2['default']();
    this.commands = new _commands2['default']();
    this.messages = [];
    this.statusBar = new _statusBar2['default']();
    this.intentions = new _intentions2['default']();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.signal);
    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.statusBar);

    var obsShowPanelCB = window.requestIdleCallback((function observeShowPanel() {
      this.idleCallbacks['delete'](obsShowPanelCB);
      this.panel = new _panel2['default']();
      this.panel.update(this.messages);
    }).bind(this));
    this.idleCallbacks.add(obsShowPanelCB);

    var obsShowDecorationsCB = window.requestIdleCallback((function observeShowDecorations() {
      var _this = this;

      this.idleCallbacks['delete'](obsShowDecorationsCB);
      if (!Editors) {
        Editors = require('./editors');
      }
      this.subscriptions.add(atom.config.observe('linter-ui-default.showDecorations', function (showDecorations) {
        if (showDecorations && !_this.editors) {
          _this.editors = new Editors();
          _this.editors.update({
            added: _this.messages,
            removed: [],
            messages: _this.messages
          });
        } else if (!showDecorations && _this.editors) {
          _this.editors.dispose();
          _this.editors = null;
        }
      }));
    }).bind(this));
    this.idleCallbacks.add(obsShowDecorationsCB);
  }

  _createClass(LinterUI, [{
    key: 'render',
    value: function render(difference) {
      var editors = this.editors;

      this.messages = difference.messages;
      if (editors) {
        if (editors.isFirstRender()) {
          editors.update({
            added: difference.messages,
            removed: [],
            messages: difference.messages
          });
        } else {
          editors.update(difference);
        }
      }
      // Initialize the TreeView subscription if necessary
      if (!this.treeview) {
        if (!TreeView) {
          TreeView = require('./tree-view');
        }
        this.treeview = new TreeView();
        this.subscriptions.add(this.treeview);
      }
      this.treeview.update(difference.messages);

      if (this.panel) {
        this.panel.update(difference.messages);
      }
      this.commands.update(difference.messages);
      this.intentions.update(difference.messages);
      this.statusBar.update(difference.messages);
    }
  }, {
    key: 'didBeginLinting',
    value: function didBeginLinting(linter, filePath) {
      this.signal.didBeginLinting(linter, filePath);
    }
  }, {
    key: 'didFinishLinting',
    value: function didFinishLinting(linter, filePath) {
      this.signal.didFinishLinting(linter, filePath);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.idleCallbacks.forEach(function (callbackID) {
        return window.cancelIdleCallback(callbackID);
      });
      this.idleCallbacks.clear();
      this.subscriptions.dispose();
      if (this.panel) {
        this.panel.dispose();
      }
      if (this.editors) {
        this.editors.dispose();
      }
    }
  }]);

  return LinterUI;
})();

module.exports = LinterUI;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRW9DLE1BQU07O3FCQUN4QixTQUFTOzs7O3dCQUNOLFlBQVk7Ozs7eUJBQ1gsY0FBYzs7OzswQkFDYixlQUFlOzs7OzBCQUNmLGNBQWM7Ozs7QUFHckMsSUFBSSxPQUFPLFlBQUEsQ0FBQTtBQUNYLElBQUksUUFBUSxZQUFBLENBQUE7O0lBRU4sUUFBUTtBQWFELFdBYlAsUUFBUSxHQWFFOzBCQWJWLFFBQVE7O0FBY1YsUUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUE7QUFDcEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzlCLFFBQUksQ0FBQyxNQUFNLEdBQUcsNkJBQWdCLENBQUE7QUFDOUIsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxTQUFTLEdBQUcsNEJBQWUsQ0FBQTtBQUNoQyxRQUFJLENBQUMsVUFBVSxHQUFHLDZCQUFnQixDQUFBO0FBQ2xDLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNuQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDckMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBOztBQUV0QyxRQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQy9DLENBQUEsU0FBUyxnQkFBZ0IsR0FBRztBQUMxQixVQUFJLENBQUMsYUFBYSxVQUFPLENBQUMsY0FBYyxDQUFDLENB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QUMzQyxVQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDM0M7OztXQUNjLHlCQUFDLE1BQWMsRUFBRSxRQUFnQixFQUFFO0FBQ2hELFVBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM5Qzs7O1dBQ2UsMEJBQUMsTUFBYyxFQUFFLFFBQWdCLEVBQUU7QUFDakQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDL0M7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQSxVQUFVO2VBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQztPQUFBLENBQUMsQ0FBQTtBQUMvRSxVQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQzFCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNyQjtBQUNELFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3ZCO0tBQ0Y7OztTQTdHRyxRQUFROzs7QUFnSGQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUEiLCJmaWxlIjoiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgUGFuZWwgZnJvbSAnLi9wYW5lbCdcbmltcG9ydCBDb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzJ1xuaW1wb3J0IFN0YXR1c0JhciBmcm9tICcuL3N0YXR1cy1iYXInXG5pbXBvcnQgQnVzeVNpZ25hbCBmcm9tICcuL2J1c3ktc2lnbmFsJ1xuaW1wb3J0IEludGVudGlvbnMgZnJvbSAnLi9pbnRlbnRpb25zJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIsIExpbnRlck1lc3NhZ2UsIE1lc3NhZ2VzUGF0Y2ggfSBmcm9tICcuL3R5cGVzJ1xuXG5sZXQgRWRpdG9yc1xubGV0IFRyZWVWaWV3XG5cbmNsYXNzIExpbnRlclVJIHtcbiAgbmFtZTogc3RyaW5nXG4gIHBhbmVsOiBQYW5lbFxuICBzaWduYWw6IEJ1c3lTaWduYWxcbiAgZWRpdG9yczogP0VkaXRvcnNcbiAgdHJlZXZpZXc6IFRyZWVWaWV3XG4gIGNvbW1hbmRzOiBDb21tYW5kc1xuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT5cbiAgc3RhdHVzQmFyOiBTdGF0dXNCYXJcbiAgaW50ZW50aW9uczogSW50ZW50aW9uc1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIGlkbGVDYWxsYmFja3M6IFNldDxudW1iZXI+XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5uYW1lID0gJ0xpbnRlcidcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MgPSBuZXcgU2V0KClcbiAgICB0aGlzLnNpZ25hbCA9IG5ldyBCdXN5U2lnbmFsKClcbiAgICB0aGlzLmNvbW1hbmRzID0gbmV3IENvbW1hbmRzKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN0YXR1c0JhciA9IG5ldyBTdGF0dXNCYXIoKVxuICAgIHRoaXMuaW50ZW50aW9ucyA9IG5ldyBJbnRlbnRpb25zKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuc2lnbmFsKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb21tYW5kcylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuc3RhdHVzQmFyKVxuXG4gICAgY29uc3Qgb2JzU2hvd1BhbmVsQ0IgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhcbiAgICAgIGZ1bmN0aW9uIG9ic2VydmVTaG93UGFuZWwoKSB7XG4gICAgICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5kZWxldGUob2JzU2hvd1BhbmVsQ0IpXG4gICAgICAgIHRoaXMucGFuZWwgPSBuZXcgUGFuZWwoKVxuICAgICAgICB0aGlzLnBhbmVsLnVwZGF0ZSh0aGlzLm1lc3NhZ2VzKVxuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgIClcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKG9ic1Nob3dQYW5lbENCKVxuXG4gICAgY29uc3Qgb2JzU2hvd0RlY29yYXRpb25zQ0IgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhcbiAgICAgIGZ1bmN0aW9uIG9ic2VydmVTaG93RGVjb3JhdGlvbnMoKSB7XG4gICAgICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5kZWxldGUob2JzU2hvd0RlY29yYXRpb25zQ0IpXG4gICAgICAgIGlmICghRWRpdG9ycykge1xuICAgICAgICAgIEVkaXRvcnMgPSByZXF1aXJlKCcuL2VkaXRvcnMnKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd0RlY29yYXRpb25zJywgc2hvd0RlY29yYXRpb25zID0+IHtcbiAgICAgICAgICAgIGlmIChzaG93RGVjb3JhdGlvbnMgJiYgIXRoaXMuZWRpdG9ycykge1xuICAgICAgICAgICAgICB0aGlzLmVkaXRvcnMgPSBuZXcgRWRpdG9ycygpXG4gICAgICAgICAgICAgIHRoaXMuZWRpdG9ycy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGFkZGVkOiB0aGlzLm1lc3NhZ2VzLFxuICAgICAgICAgICAgICAgIHJlbW92ZWQ6IFtdLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiB0aGlzLm1lc3NhZ2VzLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIGlmICghc2hvd0RlY29yYXRpb25zICYmIHRoaXMuZWRpdG9ycykge1xuICAgICAgICAgICAgICB0aGlzLmVkaXRvcnMuZGlzcG9zZSgpXG4gICAgICAgICAgICAgIHRoaXMuZWRpdG9ycyA9IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgIClcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKG9ic1Nob3dEZWNvcmF0aW9uc0NCKVxuICB9XG4gIHJlbmRlcihkaWZmZXJlbmNlOiBNZXNzYWdlc1BhdGNoKSB7XG4gICAgY29uc3QgZWRpdG9ycyA9IHRoaXMuZWRpdG9yc1xuXG4gICAgdGhpcy5tZXNzYWdlcyA9IGRpZmZlcmVuY2UubWVzc2FnZXNcbiAgICBpZiAoZWRpdG9ycykge1xuICAgICAgaWYgKGVkaXRvcnMuaXNGaXJzdFJlbmRlcigpKSB7XG4gICAgICAgIGVkaXRvcnMudXBkYXRlKHtcbiAgICAgICAgICBhZGRlZDogZGlmZmVyZW5jZS5tZXNzYWdlcyxcbiAgICAgICAgICByZW1vdmVkOiBbXSxcbiAgICAgICAgICBtZXNzYWdlczogZGlmZmVyZW5jZS5tZXNzYWdlcyxcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVkaXRvcnMudXBkYXRlKGRpZmZlcmVuY2UpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIEluaXRpYWxpemUgdGhlIFRyZWVWaWV3IHN1YnNjcmlwdGlvbiBpZiBuZWNlc3NhcnlcbiAgICBpZiAoIXRoaXMudHJlZXZpZXcpIHtcbiAgICAgIGlmICghVHJlZVZpZXcpIHtcbiAgICAgICAgVHJlZVZpZXcgPSByZXF1aXJlKCcuL3RyZWUtdmlldycpXG4gICAgICB9XG4gICAgICB0aGlzLnRyZWV2aWV3ID0gbmV3IFRyZWVWaWV3KClcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy50cmVldmlldylcbiAgICB9XG4gICAgdGhpcy50cmVldmlldy51cGRhdGUoZGlmZmVyZW5jZS5tZXNzYWdlcylcblxuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuICAgIH1cbiAgICB0aGlzLmNvbW1hbmRzLnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuICAgIHRoaXMuaW50ZW50aW9ucy51cGRhdGUoZGlmZmVyZW5jZS5tZXNzYWdlcylcbiAgICB0aGlzLnN0YXR1c0Jhci51cGRhdGUoZGlmZmVyZW5jZS5tZXNzYWdlcylcbiAgfVxuICBkaWRCZWdpbkxpbnRpbmcobGludGVyOiBMaW50ZXIsIGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyLCBmaWxlUGF0aClcbiAgfVxuICBkaWRGaW5pc2hMaW50aW5nKGxpbnRlcjogTGludGVyLCBmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5zaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2tJRCA9PiB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrKGNhbGxiYWNrSUQpKVxuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5jbGVhcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRpc3Bvc2UoKVxuICAgIH1cbiAgICBpZiAodGhpcy5lZGl0b3JzKSB7XG4gICAgICB0aGlzLmVkaXRvcnMuZGlzcG9zZSgpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGludGVyVUlcbiJdfQ==