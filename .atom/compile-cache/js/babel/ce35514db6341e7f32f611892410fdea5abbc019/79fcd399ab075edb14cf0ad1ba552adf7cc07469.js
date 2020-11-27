var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _dock = require('./dock');

var _dock2 = _interopRequireDefault(_dock);

var Panel = (function () {
  function Panel() {
    var _this = this;

    _classCallCheck(this, Panel);

    this.panel = null;
    this.element = document.createElement('div');
    this.delegate = new _delegate2['default']();
    this.messages = [];
    this.deactivating = false;
    this.subscriptions = new _atom.CompositeDisposable();
    this.showPanelStateMessages = false;

    this.subscriptions.add(this.delegate);
    this.subscriptions.add(atom.config.observe('linter-ui-default.hidePanelWhenEmpty', function (hidePanelWhenEmpty) {
      _this.hidePanelWhenEmpty = hidePanelWhenEmpty;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(function (_ref) {
      var paneItem = _ref.item;

      if (paneItem instanceof _dock2['default'] && !_this.deactivating) {
        _this.panel = null;
        atom.config.set('linter-ui-default.showPanel', false);
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showPanel', function (showPanel) {
      _this.showPanelConfig = showPanel;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.getCenter().observeActivePaneItem(function () {
      _this.showPanelStateMessages = !!_this.delegate.filteredMessages.length;
      _this.refresh();
    }));
    this.activationTimer = window.requestIdleCallback(function () {
      _this.activate();
    });
  }

  _createClass(Panel, [{
    key: 'activate',
    value: _asyncToGenerator(function* () {
      if (this.panel) {
        return;
      }
      this.panel = new _dock2['default'](this.delegate);
      yield atom.workspace.open(this.panel, {
        activatePane: false,
        activateItem: false,
        searchAllPanes: true
      });
      this.update();
      this.refresh();
    })
  }, {
    key: 'update',
    value: function update() {
      var newMessages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (newMessages) {
        this.messages = newMessages;
      }
      this.delegate.update(this.messages);
      this.showPanelStateMessages = !!this.delegate.filteredMessages.length;
      this.refresh();
    }
  }, {
    key: 'refresh',
    value: _asyncToGenerator(function* () {
      var panel = this.panel;
      if (panel === null) {
        if (this.showPanelConfig) {
          yield this.activate();
        }
        return;
      }
      var paneContainer = atom.workspace.paneContainerForItem(panel);
      if (!paneContainer || paneContainer.location !== 'bottom' || paneContainer.getActivePaneItem() !== panel) {
        return;
      }
      var visibilityAllowed1 = this.showPanelConfig;
      var visibilityAllowed2 = this.hidePanelWhenEmpty ? this.showPanelStateMessages : true;
      if (visibilityAllowed1 && visibilityAllowed2) {
        paneContainer.show();
        panel.doPanelResize();
      } else {
        paneContainer.hide();
      }
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      this.deactivating = true;
      if (this.panel) {
        this.panel.dispose();
      }
      this.subscriptions.dispose();
      window.cancelIdleCallback(this.activationTimer);
    }
  }]);

  return Panel;
})();

module.exports = Panel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O3dCQUNyQixZQUFZOzs7O29CQUNYLFFBQVE7Ozs7SUFHeEIsS0FBSztBQVdFLFdBWFAsS0FBSyxHQVdLOzs7MEJBWFYsS0FBSzs7QUFZUCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtBQUNqQixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQTs7QUFFbkMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0MsRUFBRSxVQUFBLGtCQUFrQixFQUFJO0FBQ2hGLFlBQUssa0JBQWtCLEdBQUcsa0JBQWtCLENBQUE7QUFDNUMsWUFBSyxPQUFPLEVBQUUsQ0FBQTtLQUNmLENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsVUFBQyxJQUFrQixFQUFLO1VBQWYsUUFBUSxHQUFoQixJQUFrQixDQUFoQixJQUFJOztBQUN6QyxVQUFJLFFBQVEsNkJBQXFCLElBQUksQ0FBQyxNQUFLLFlBQVks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LElBQUksRUFBRSxDQUFBO09BQ3JCO0tBQ0Y7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUE7QUFDeEIsVUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNyQjtBQUNELFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsWUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtLQUNoRDs7O1NBcEdHLEtBQUs7OztBQXVHWCxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQSIsImZpbGUiOiJmaWxlOi8vL0M6L1VzZXJzL3VzZXIvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCBQYW5lbERvY2sgZnJvbSAnLi9kb2NrJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIFBhbmVsIHtcbiAgcGFuZWw6IFBhbmVsRG9jayB8IG51bGxcbiAgZWxlbWVudDogSFRNTEVsZW1lbnRcbiAgZGVsZWdhdGU6IERlbGVnYXRlXG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPlxuICBkZWFjdGl2YXRpbmc6IGJvb2xlYW5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBzaG93UGFuZWxDb25maWc6IGJvb2xlYW5cbiAgaGlkZVBhbmVsV2hlbkVtcHR5OiBib29sZWFuXG4gIHNob3dQYW5lbFN0YXRlTWVzc2FnZXM6IGJvb2xlYW5cbiAgYWN0aXZhdGlvblRpbWVyOiBudW1iZXJcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wYW5lbCA9IG51bGxcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZGVsZWdhdGUgPSBuZXcgRGVsZWdhdGUoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuZGVhY3RpdmF0aW5nID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzID0gZmFsc2VcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5kZWxlZ2F0ZSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuaGlkZVBhbmVsV2hlbkVtcHR5JywgaGlkZVBhbmVsV2hlbkVtcHR5ID0+IHtcbiAgICAgICAgdGhpcy5oaWRlUGFuZWxXaGVuRW1wdHkgPSBoaWRlUGFuZWxXaGVuRW1wdHlcbiAgICAgICAgdGhpcy5yZWZyZXNoKClcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0oKHsgaXRlbTogcGFuZUl0ZW0gfSkgPT4ge1xuICAgICAgICBpZiAocGFuZUl0ZW0gaW5zdGFuY2VvZiBQYW5lbERvY2sgJiYgIXRoaXMuZGVhY3RpdmF0aW5nKSB7XG4gICAgICAgICAgdGhpcy5wYW5lbCA9IG51bGxcbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQYW5lbCcsIGZhbHNlKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQYW5lbCcsIHNob3dQYW5lbCA9PiB7XG4gICAgICAgIHRoaXMuc2hvd1BhbmVsQ29uZmlnID0gc2hvd1BhbmVsXG4gICAgICAgIHRoaXMucmVmcmVzaCgpXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLm9ic2VydmVBY3RpdmVQYW5lSXRlbSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcyA9ICEhdGhpcy5kZWxlZ2F0ZS5maWx0ZXJlZE1lc3NhZ2VzLmxlbmd0aFxuICAgICAgICB0aGlzLnJlZnJlc2goKVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuYWN0aXZhdGlvblRpbWVyID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgdGhpcy5hY3RpdmF0ZSgpXG4gICAgfSlcbiAgfVxuICBhc3luYyBhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMucGFuZWwgPSBuZXcgUGFuZWxEb2NrKHRoaXMuZGVsZWdhdGUpXG4gICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3Blbih0aGlzLnBhbmVsLCB7XG4gICAgICBhY3RpdmF0ZVBhbmU6IGZhbHNlLFxuICAgICAgYWN0aXZhdGVJdGVtOiBmYWxzZSxcbiAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlLFxuICAgIH0pXG4gICAgdGhpcy51cGRhdGUoKVxuICAgIHRoaXMucmVmcmVzaCgpXG4gIH1cbiAgdXBkYXRlKG5ld01lc3NhZ2VzOiA/QXJyYXk8TGludGVyTWVzc2FnZT4gPSBudWxsKTogdm9pZCB7XG4gICAgaWYgKG5ld01lc3NhZ2VzKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gbmV3TWVzc2FnZXNcbiAgICB9XG4gICAgdGhpcy5kZWxlZ2F0ZS51cGRhdGUodGhpcy5tZXNzYWdlcylcbiAgICB0aGlzLnNob3dQYW5lbFN0YXRlTWVzc2FnZXMgPSAhIXRoaXMuZGVsZWdhdGUuZmlsdGVyZWRNZXNzYWdlcy5sZW5ndGhcbiAgICB0aGlzLnJlZnJlc2goKVxuICB9XG4gIGFzeW5jIHJlZnJlc2goKSB7XG4gICAgY29uc3QgcGFuZWwgPSB0aGlzLnBhbmVsXG4gICAgaWYgKHBhbmVsID09PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5zaG93UGFuZWxDb25maWcpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hY3RpdmF0ZSgpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgcGFuZUNvbnRhaW5lciA9IGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JJdGVtKHBhbmVsKVxuICAgIGlmICghcGFuZUNvbnRhaW5lciB8fCBwYW5lQ29udGFpbmVyLmxvY2F0aW9uICE9PSAnYm90dG9tJyB8fCBwYW5lQ29udGFpbmVyLmdldEFjdGl2ZVBhbmVJdGVtKCkgIT09IHBhbmVsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgdmlzaWJpbGl0eUFsbG93ZWQxID0gdGhpcy5zaG93UGFuZWxDb25maWdcbiAgICBjb25zdCB2aXNpYmlsaXR5QWxsb3dlZDIgPSB0aGlzLmhpZGVQYW5lbFdoZW5FbXB0eSA/IHRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcyA6IHRydWVcbiAgICBpZiAodmlzaWJpbGl0eUFsbG93ZWQxICYmIHZpc2liaWxpdHlBbGxvd2VkMikge1xuICAgICAgcGFuZUNvbnRhaW5lci5zaG93KClcbiAgICAgIHBhbmVsLmRvUGFuZWxSZXNpemUoKVxuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lQ29udGFpbmVyLmhpZGUoKVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZGVhY3RpdmF0aW5nID0gdHJ1ZVxuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayh0aGlzLmFjdGl2YXRpb25UaW1lcilcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsXG4iXX0=