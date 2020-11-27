var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var TooltipDelegate = (function () {
  function TooltipDelegate() {
    var _this = this;

    _classCallCheck(this, TooltipDelegate);

    this.emitter = new _atom.Emitter();
    this.expanded = false;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter-ui-default.showProviderName', function (showProviderName) {
      var shouldUpdate = typeof _this.showProviderName !== 'undefined';
      _this.showProviderName = showProviderName;
      if (shouldUpdate) {
        _this.emitter.emit('should-update');
      }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter-ui-default:expand-tooltip': function linterUiDefaultExpandTooltip(event) {
        if (_this.expanded) {
          return;
        }
        _this.expanded = true;
        _this.emitter.emit('should-expand');

        // If bound to a key, collapse when that key is released, just like old times
        if (event.originalEvent && event.originalEvent.isTrusted) {
          // $FlowIgnore: document.body is never null
          document.body.addEventListener('keyup', function eventListener() {
            // $FlowIgnore: document.body is never null
            document.body.removeEventListener('keyup', eventListener);
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'linter-ui-default:collapse-tooltip');
          });
        }
      },
      'linter-ui-default:collapse-tooltip': function linterUiDefaultCollapseTooltip() {
        _this.expanded = false;
        _this.emitter.emit('should-collapse');
      }
    }));
  }

  _createClass(TooltipDelegate, [{
    key: 'onShouldUpdate',
    value: function onShouldUpdate(callback) {
      return this.emitter.on('should-update', callback);
    }
  }, {
    key: 'onShouldExpand',
    value: function onShouldExpand(callback) {
      return this.emitter.on('should-expand', callback);
    }
  }, {
    key: 'onShouldCollapse',
    value: function onShouldCollapse(callback) {
      return this.emitter.on('should-collapse', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.dispose();
    }
  }]);

  return TooltipDelegate;
})();

module.exports = TooltipDelegate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9kZWxlZ2F0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUU2QyxNQUFNOztJQUc3QyxlQUFlO0FBTVIsV0FOUCxlQUFlLEdBTUw7OzswQkFOVixlQUFlOztBQU9qQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDckIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxvQ0FBb0MsRUFBRSxVQUFBLGdCQUFnQixFQUFJO0FBQzVFLFVBQU0sWUFBWSxHQUFHLE9BQU8sTUFBSyxnQkFBZ0IsS0FBSyxXQUFXLENBQUE7QUFDakUsWUFBSyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQTtBQUN4QyxVQUFJLFlBQVksRUFBRTtBQUNoQixjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7T0FDbkM7S0FDRixDQUFDLENBQ0gsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUNsQyx3Q0FBa0MsRUFBRSxzQ0FBQSxLQUFLLEVBQUk7QUFDM0MsWUFBSSxNQUFLLFFBQVEsRUFBRTtBQUNqQixpQkFBTTtTQUNQO0FBQ0QsY0FBSyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTs7O0FBR2xDLFlBQUksS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRTs7QUFFeEQsa0JBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQVMsYUFBYSxHQUFHOztBQUUvRCxvQkFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUE7QUFDekQsZ0JBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFBO1dBQ2pHLENBQUMsQ0FBQTtTQUNIO09BQ0Y7QUFDRCwwQ0FBb0MsRUFBRSwwQ0FBTTtBQUMxQyxjQUFLLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDckIsY0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7T0FDckM7S0FDRixDQUFDLENBQ0gsQ0FBQTtHQUNGOztlQTlDRyxlQUFlOztXQStDTCx3QkFBQyxRQUFtQixFQUFjO0FBQzlDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2xEOzs7V0FDYSx3QkFBQyxRQUFtQixFQUFjO0FBQzlDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2xEOzs7V0FDZSwwQkFBQyxRQUFtQixFQUFjO0FBQ2hELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDcEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUN2Qjs7O1NBMURHLGVBQWU7OztBQTZEckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUEiLCJmaWxlIjoiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90b29sdGlwL2RlbGVnYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5jbGFzcyBUb29sdGlwRGVsZWdhdGUge1xuICBlbWl0dGVyOiBFbWl0dGVyXG4gIGV4cGFuZGVkOiBib29sZWFuXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgc2hvd1Byb3ZpZGVyTmFtZTogYm9vbGVhblxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmV4cGFuZGVkID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1Byb3ZpZGVyTmFtZScsIHNob3dQcm92aWRlck5hbWUgPT4ge1xuICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSB0eXBlb2YgdGhpcy5zaG93UHJvdmlkZXJOYW1lICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICB0aGlzLnNob3dQcm92aWRlck5hbWUgPSBzaG93UHJvdmlkZXJOYW1lXG4gICAgICAgIGlmIChzaG91bGRVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLXVwZGF0ZScpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6ZXhwYW5kLXRvb2x0aXAnOiBldmVudCA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuZXhwYW5kZWQpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmV4cGFuZGVkID0gdHJ1ZVxuICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtZXhwYW5kJylcblxuICAgICAgICAgIC8vIElmIGJvdW5kIHRvIGEga2V5LCBjb2xsYXBzZSB3aGVuIHRoYXQga2V5IGlzIHJlbGVhc2VkLCBqdXN0IGxpa2Ugb2xkIHRpbWVzXG4gICAgICAgICAgaWYgKGV2ZW50Lm9yaWdpbmFsRXZlbnQgJiYgZXZlbnQub3JpZ2luYWxFdmVudC5pc1RydXN0ZWQpIHtcbiAgICAgICAgICAgIC8vICRGbG93SWdub3JlOiBkb2N1bWVudC5ib2R5IGlzIG5ldmVyIG51bGxcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiBldmVudExpc3RlbmVyKCkge1xuICAgICAgICAgICAgICAvLyAkRmxvd0lnbm9yZTogZG9jdW1lbnQuYm9keSBpcyBuZXZlciBudWxsXG4gICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBldmVudExpc3RlbmVyKVxuICAgICAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksICdsaW50ZXItdWktZGVmYXVsdDpjb2xsYXBzZS10b29sdGlwJylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6Y29sbGFwc2UtdG9vbHRpcCc6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmV4cGFuZGVkID0gZmFsc2VcbiAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLWNvbGxhcHNlJylcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIClcbiAgfVxuICBvblNob3VsZFVwZGF0ZShjYWxsYmFjazogKCkgPT4gYW55KTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLXVwZGF0ZScsIGNhbGxiYWNrKVxuICB9XG4gIG9uU2hvdWxkRXhwYW5kKGNhbGxiYWNrOiAoKSA9PiBhbnkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtZXhwYW5kJywgY2FsbGJhY2spXG4gIH1cbiAgb25TaG91bGRDb2xsYXBzZShjYWxsYmFjazogKCkgPT4gYW55KTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLWNvbGxhcHNlJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUb29sdGlwRGVsZWdhdGVcbiJdfQ==