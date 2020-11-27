var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _messageLegacy = require('./message-legacy');

var _messageLegacy2 = _interopRequireDefault(_messageLegacy);

var _helpers = require('../helpers');

var TooltipElement = (function () {
  function TooltipElement(messages, position, textEditor) {
    var _this = this;

    _classCallCheck(this, TooltipElement);

    this.emitter = new _atom.Emitter();
    this.element = document.createElement('div');
    this.messages = messages;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.marker = textEditor.markBufferRange([position, position]);
    this.marker.onDidDestroy(function () {
      return _this.emitter.emit('did-destroy');
    });

    var delegate = new _delegate2['default']();
    this.element.id = 'linter-tooltip';
    textEditor.decorateMarker(this.marker, {
      type: 'overlay',
      item: this.element
    });
    this.subscriptions.add(delegate);

    var children = [];
    messages.forEach(function (message) {
      if (message.version === 2) {
        children.push(_react2['default'].createElement(_message2['default'], { key: message.key, delegate: delegate, message: message }));
        return;
      }
      children.push(_react2['default'].createElement(_messageLegacy2['default'], { key: message.key, delegate: delegate, message: message }));
      if (message.trace && message.trace.length) {
        children.push.apply(children, _toConsumableArray(message.trace.map(function (trace) {
          return _react2['default'].createElement(_messageLegacy2['default'], { key: message.key + ':trace:' + trace.key, delegate: delegate, message: trace });
        })));
      }
    });
    _reactDom2['default'].render(_react2['default'].createElement(
      'linter-messages',
      null,
      children
    ), this.element);
  }

  _createClass(TooltipElement, [{
    key: 'isValid',
    value: function isValid(position, messages) {
      var range = (0, _helpers.$range)(this.messages[0]);
      return !!(this.messages.length === 1 && messages.has(this.messages[0]) && range && range.containsPoint(position));
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
    }
  }]);

  return TooltipElement;
})();

module.exports = TooltipElement;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztxQkFFa0IsT0FBTzs7Ozt3QkFDSixXQUFXOzs7O29CQUNhLE1BQU07O3dCQUc5QixZQUFZOzs7O3VCQUNOLFdBQVc7Ozs7NkJBQ0wsa0JBQWtCOzs7O3VCQUM1QixZQUFZOztJQUc3QixjQUFjO0FBT1AsV0FQUCxjQUFjLENBT04sUUFBOEIsRUFBRSxRQUFlLEVBQUUsVUFBc0IsRUFBRTs7OzBCQVBqRixjQUFjOztBQVFoQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVDLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtBQUM5RCxRQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQzthQUFNLE1BQUssT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7S0FBQSxDQUFDLENBQUE7O0FBRWhFLFFBQU0sUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDL0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsZ0JBQWdCLENBQUE7QUFDbEMsY0FBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3JDLFVBQUksRUFBRSxTQUFTO0FBQ2YsVUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO0tBQ25CLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUVoQyxRQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbkIsWUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUMxQixVQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLGdCQUFRLENBQUMsSUFBSSxDQUFDLHlEQUFnQixHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQUFBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEFBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxBQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3pGLGVBQU07T0FDUDtBQUNELGNBQVEsQ0FBQyxJQUFJLENBQUMsK0RBQXNCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxBQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsQUFBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEFBQUMsR0FBRyxDQUFDLENBQUE7QUFDL0YsVUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ3pDLGdCQUFRLENBQUMsSUFBSSxNQUFBLENBQWIsUUFBUSxxQkFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7aUJBQ3hCLCtEQUFzQixHQUFHLEVBQUssT0FBTyxDQUFDLEdBQUcsZUFBVSxLQUFLLENBQUMsR0FBRyxBQUFHLEVBQUMsUUFBUSxFQUFFLFFBQVEsQUFBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLEFBQUMsR0FBRztTQUN2RyxDQUFDLEVBQ0gsQ0FBQTtPQUNGO0tBQ0YsQ0FBQyxDQUFBO0FBQ0YsMEJBQVMsTUFBTSxDQUFDOzs7TUFBa0IsUUFBUTtLQUFtQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUM3RTs7ZUF6Q0csY0FBYzs7V0EwQ1gsaUJBQUMsUUFBZSxFQUFFLFFBQTRCLEVBQVc7QUFDOUQsVUFBTSxLQUFLLEdBQUcscUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RDLGFBQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQSxBQUFDLENBQUE7S0FDbEg7OztXQUNXLHNCQUFDLFFBQW1CLEVBQWM7QUFDNUMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3pDOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXBERyxjQUFjOzs7QUF1RHBCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFBIiwiZmlsZSI6ImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSwgUG9pbnQsIFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCBNZXNzYWdlRWxlbWVudCBmcm9tICcuL21lc3NhZ2UnXG5pbXBvcnQgTWVzc2FnZUVsZW1lbnRMZWdhY3kgZnJvbSAnLi9tZXNzYWdlLWxlZ2FjeSdcbmltcG9ydCB7ICRyYW5nZSB9IGZyb20gJy4uL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuLi90eXBlcydcblxuY2xhc3MgVG9vbHRpcEVsZW1lbnQge1xuICBtYXJrZXI6IE9iamVjdFxuICBlbGVtZW50OiBIVE1MRWxlbWVudFxuICBlbWl0dGVyOiBFbWl0dGVyXG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPlxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgY29uc3RydWN0b3IobWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+LCBwb3NpdGlvbjogUG9pbnQsIHRleHRFZGl0b3I6IFRleHRFZGl0b3IpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLm1hcmtlciA9IHRleHRFZGl0b3IubWFya0J1ZmZlclJhbmdlKFtwb3NpdGlvbiwgcG9zaXRpb25dKVxuICAgIHRoaXMubWFya2VyLm9uRGlkRGVzdHJveSgoKSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKSlcblxuICAgIGNvbnN0IGRlbGVnYXRlID0gbmV3IERlbGVnYXRlKClcbiAgICB0aGlzLmVsZW1lbnQuaWQgPSAnbGludGVyLXRvb2x0aXAnXG4gICAgdGV4dEVkaXRvci5kZWNvcmF0ZU1hcmtlcih0aGlzLm1hcmtlciwge1xuICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgaXRlbTogdGhpcy5lbGVtZW50LFxuICAgIH0pXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChkZWxlZ2F0ZSlcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gW11cbiAgICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMikge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKDxNZXNzYWdlRWxlbWVudCBrZXk9e21lc3NhZ2Uua2V5fSBkZWxlZ2F0ZT17ZGVsZWdhdGV9IG1lc3NhZ2U9e21lc3NhZ2V9IC8+KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnB1c2goPE1lc3NhZ2VFbGVtZW50TGVnYWN5IGtleT17bWVzc2FnZS5rZXl9IGRlbGVnYXRlPXtkZWxlZ2F0ZX0gbWVzc2FnZT17bWVzc2FnZX0gLz4pXG4gICAgICBpZiAobWVzc2FnZS50cmFjZSAmJiBtZXNzYWdlLnRyYWNlLmxlbmd0aCkge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKFxuICAgICAgICAgIC4uLm1lc3NhZ2UudHJhY2UubWFwKHRyYWNlID0+IChcbiAgICAgICAgICAgIDxNZXNzYWdlRWxlbWVudExlZ2FjeSBrZXk9e2Ake21lc3NhZ2Uua2V5fTp0cmFjZToke3RyYWNlLmtleX1gfSBkZWxlZ2F0ZT17ZGVsZWdhdGV9IG1lc3NhZ2U9e3RyYWNlfSAvPlxuICAgICAgICAgICkpLFxuICAgICAgICApXG4gICAgICB9XG4gICAgfSlcbiAgICBSZWFjdERPTS5yZW5kZXIoPGxpbnRlci1tZXNzYWdlcz57Y2hpbGRyZW59PC9saW50ZXItbWVzc2FnZXM+LCB0aGlzLmVsZW1lbnQpXG4gIH1cbiAgaXNWYWxpZChwb3NpdGlvbjogUG9pbnQsIG1lc3NhZ2VzOiBTZXQ8TGludGVyTWVzc2FnZT4pOiBib29sZWFuIHtcbiAgICBjb25zdCByYW5nZSA9ICRyYW5nZSh0aGlzLm1lc3NhZ2VzWzBdKVxuICAgIHJldHVybiAhISh0aGlzLm1lc3NhZ2VzLmxlbmd0aCA9PT0gMSAmJiBtZXNzYWdlcy5oYXModGhpcy5tZXNzYWdlc1swXSkgJiYgcmFuZ2UgJiYgcmFuZ2UuY29udGFpbnNQb2ludChwb3NpdGlvbikpXG4gIH1cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrOiAoKSA9PiBhbnkpOiBEaXNwb3NhYmxlIHtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRvb2x0aXBFbGVtZW50XG4iXX0=