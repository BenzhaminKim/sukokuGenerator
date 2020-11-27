var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var NEWLINE = /\r\n|\n/;
var MESSAGE_NUMBER = 0;

var MessageElement = (function (_React$Component) {
  _inherits(MessageElement, _React$Component);

  function MessageElement() {
    _classCallCheck(this, MessageElement);

    _get(Object.getPrototypeOf(MessageElement.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      multiLineShow: false
    };
  }

  _createClass(MessageElement, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      this.props.delegate.onShouldUpdate(function () {
        _this.setState({});
      });
      this.props.delegate.onShouldExpand(function () {
        _this.setState({ multiLineShow: true });
      });
      this.props.delegate.onShouldCollapse(function () {
        _this.setState({ multiLineShow: false });
      });
    }
  }, {
    key: 'renderSingleLine',
    value: function renderSingleLine() {
      var _props = this.props;
      var message = _props.message;
      var delegate = _props.delegate;

      var number = ++MESSAGE_NUMBER;
      var elementID = 'linter-message-' + number;
      var isElement = message.html && typeof message.html === 'object';
      if (isElement) {
        setImmediate(function () {
          var element = document.getElementById(elementID);
          if (element) {
            // $FlowIgnore: This is an HTML Element :\
            element.appendChild(message.html.cloneNode(true));
          } else {
            console.warn('[Linter] Unable to get element for mounted message', number, message);
          }
        });
      }

      return _react2['default'].createElement(
        'linter-message',
        { 'class': message.severity },
        delegate.showProviderName ? message.linterName + ': ' : '',
        _react2['default'].createElement(
          'span',
          { id: elementID, dangerouslySetInnerHTML: !isElement && message.html ? { __html: message.html } : null },
          message.text
        ),
        ' '
      );
    }
  }, {
    key: 'renderMultiLine',
    value: function renderMultiLine() {
      var _this2 = this;

      var _props2 = this.props;
      var message = _props2.message;
      var delegate = _props2.delegate;

      var text = message.text ? message.text.split(NEWLINE) : [];
      var chunks = text.map(function (entry) {
        return entry.trim();
      }).map(function (entry, index) {
        return entry.length && _react2['default'].createElement(
          'span',
          { className: index !== 0 && 'linter-line' },
          entry
        );
      }).filter(function (e) {
        return e;
      });

      return _react2['default'].createElement(
        'linter-message',
        { 'class': message.severity },
        _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return _this2.setState({ multiLineShow: !_this2.state.multiLineShow });
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-' + (this.state.multiLineShow ? 'chevron-down' : 'chevron-right') })
        ),
        delegate.showProviderName ? message.linterName + ': ' : '',
        chunks[0],
        ' ',
        this.state.multiLineShow && chunks.slice(1)
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return NEWLINE.test(this.props.message.text || '') ? this.renderMultiLine() : this.renderSingleLine();
    }
  }]);

  return MessageElement;
})(_react2['default'].Component);

module.exports = MessageElement;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9tZXNzYWdlLWxlZ2FjeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7O0FBSXpCLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQTtBQUN6QixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUE7O0lBV2hCLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7U0FDbEIsS0FBSyxHQUFVO0FBQ2IsbUJBQWEsRUFBRSxLQUFLO0tBQ3JCOzs7ZUFIRyxjQUFjOztXQUlELDZCQUFHOzs7QUFDbEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQU07QUFDdkMsY0FBSyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDbEIsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQU07QUFDdkMsY0FBSyxRQUFRLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtPQUN2QyxDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFNO0FBQ3pDLGNBQUssUUFBUSxDQUFDLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7T0FDeEMsQ0FBQyxDQUFBO0tBQ0g7OztXQUVlLDRCQUFHO21CQUNhLElBQUksQ0FBQyxLQUFLO1VBQWhDLE9BQU8sVUFBUCxPQUFPO1VBQUUsUUFBUSxVQUFSLFFBQVE7O0FBRXpCLFVBQU0sTUFBTSxHQUFHLEVBQUUsY0FBYyxDQUFBO0FBQy9CLFVBQU0sU0FBUyx1QkFBcUIsTUFBTSxBQUFFLENBQUE7QUFDNUMsVUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFBO0FBQ2xFLFVBQUksU0FBUyxFQUFFO0FBQ2Isb0JBQVksQ0FBQyxZQUFXO0FBQ3RCLGNBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbEQsY0FBSSxPQUFPLEVBQUU7O0FBRVgsbUJBQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtXQUNsRCxNQUFNO0FBQ0wsbUJBQU8sQ0FBQyxJQUFJLENBQUMsb0RBQW9ELEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1dBQ3BGO1NBQ0YsQ0FBQyxDQUFBO09BQ0g7O0FBRUQsYUFDRTs7VUFBZ0IsU0FBTyxPQUFPLENBQUMsUUFBUSxBQUFDO1FBQ3JDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBTSxPQUFPLENBQUMsVUFBVSxVQUFPLEVBQUU7UUFDM0Q7O1lBQU0sRUFBRSxFQUFFLFNBQVMsQUFBQyxFQUFDLHVCQUF1QixFQUFFLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQUFBQztVQUN4RyxPQUFPLENBQUMsSUFBSTtTQUNSO1FBQUMsR0FBRztPQUNJLENBQ2xCO0tBQ0Y7OztXQUVjLDJCQUFHOzs7b0JBQ2MsSUFBSSxDQUFDLEtBQUs7VUFBaEMsT0FBTyxXQUFQLE9BQU87VUFBRSxRQUFRLFdBQVIsUUFBUTs7QUFFekIsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDNUQsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUNoQixHQUFHLENBQUMsVUFBQSxLQUFLO2VBQUksS0FBSyxDQUFDLElBQUksRUFBRTtPQUFBLENBQUMsQ0FDMUIsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUs7ZUFBSyxLQUFLLENBQUMsTUFBTSxJQUFJOztZQUFNLFNBQVMsRUFBRSxLQUFLLEtBQUssQ0FBQyxJQUFJLGFBQWEsQUFBQztVQUFFLEtBQUs7U0FBUTtPQUFBLENBQUMsQ0FDcEcsTUFBTSxDQUFDLFVBQUEsQ0FBQztlQUFJLENBQUM7T0FBQSxDQUFDLENBQUE7O0FBRWpCLGFBQ0U7O1VBQWdCLFNBQU8sT0FBTyxDQUFDLFFBQVEsQUFBQztRQUN0Qzs7WUFBRyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRTtxQkFBTSxPQUFLLFFBQVEsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLE9BQUssS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQUEsQUFBQztVQUNyRiwyQ0FBTSxTQUFTLDhCQUEyQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxjQUFjLEdBQUcsZUFBZSxDQUFBLEFBQUcsR0FBRztTQUN6RztRQUNILFFBQVEsQ0FBQyxnQkFBZ0IsR0FBTSxPQUFPLENBQUMsVUFBVSxVQUFPLEVBQUU7UUFDMUQsTUFBTSxDQUFDLENBQUMsQ0FBQzs7UUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztPQUN6QyxDQUNsQjtLQUNGOzs7V0FFSyxrQkFBRztBQUNQLGFBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0tBQ3RHOzs7U0FsRUcsY0FBYztHQUFTLG1CQUFNLFNBQVM7O0FBcUU1QyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQSIsImZpbGUiOiJmaWxlOi8vL0M6L1VzZXJzL3VzZXIvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3Rvb2x0aXAvbWVzc2FnZS1sZWdhY3kuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSBUb29sdGlwRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCB0eXBlIHsgTWVzc2FnZUxlZ2FjeSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jb25zdCBORVdMSU5FID0gL1xcclxcbnxcXG4vXG5sZXQgTUVTU0FHRV9OVU1CRVIgPSAwXG5cbnR5cGUgUHJvcHMgPSB7XG4gIG1lc3NhZ2U6IE1lc3NhZ2VMZWdhY3ksXG4gIGRlbGVnYXRlOiBUb29sdGlwRGVsZWdhdGUsXG59XG5cbnR5cGUgU3RhdGUgPSB7XG4gIG11bHRpTGluZVNob3c6IGJvb2xlYW4sXG59XG5cbmNsYXNzIE1lc3NhZ2VFbGVtZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzLCBTdGF0ZT4ge1xuICBzdGF0ZTogU3RhdGUgPSB7XG4gICAgbXVsdGlMaW5lU2hvdzogZmFsc2UsXG4gIH1cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZFVwZGF0ZSgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHt9KVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZEV4cGFuZCgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgbXVsdGlMaW5lU2hvdzogdHJ1ZSB9KVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZENvbGxhcHNlKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBtdWx0aUxpbmVTaG93OiBmYWxzZSB9KVxuICAgIH0pXG4gIH1cbiAgcHJvcHM6IFByb3BzXG4gIHJlbmRlclNpbmdsZUxpbmUoKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlLCBkZWxlZ2F0ZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgY29uc3QgbnVtYmVyID0gKytNRVNTQUdFX05VTUJFUlxuICAgIGNvbnN0IGVsZW1lbnRJRCA9IGBsaW50ZXItbWVzc2FnZS0ke251bWJlcn1gXG4gICAgY29uc3QgaXNFbGVtZW50ID0gbWVzc2FnZS5odG1sICYmIHR5cGVvZiBtZXNzYWdlLmh0bWwgPT09ICdvYmplY3QnXG4gICAgaWYgKGlzRWxlbWVudCkge1xuICAgICAgc2V0SW1tZWRpYXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElEKVxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIC8vICRGbG93SWdub3JlOiBUaGlzIGlzIGFuIEhUTUwgRWxlbWVudCA6XFxcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2UuaHRtbC5jbG9uZU5vZGUodHJ1ZSkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdbTGludGVyXSBVbmFibGUgdG8gZ2V0IGVsZW1lbnQgZm9yIG1vdW50ZWQgbWVzc2FnZScsIG51bWJlciwgbWVzc2FnZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGxpbnRlci1tZXNzYWdlIGNsYXNzPXttZXNzYWdlLnNldmVyaXR5fT5cbiAgICAgICAge2RlbGVnYXRlLnNob3dQcm92aWRlck5hbWUgPyBgJHttZXNzYWdlLmxpbnRlck5hbWV9OiBgIDogJyd9XG4gICAgICAgIDxzcGFuIGlkPXtlbGVtZW50SUR9IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXshaXNFbGVtZW50ICYmIG1lc3NhZ2UuaHRtbCA/IHsgX19odG1sOiBtZXNzYWdlLmh0bWwgfSA6IG51bGx9PlxuICAgICAgICAgIHttZXNzYWdlLnRleHR9XG4gICAgICAgIDwvc3Bhbj57JyAnfVxuICAgICAgPC9saW50ZXItbWVzc2FnZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJNdWx0aUxpbmUoKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlLCBkZWxlZ2F0ZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgY29uc3QgdGV4dCA9IG1lc3NhZ2UudGV4dCA/IG1lc3NhZ2UudGV4dC5zcGxpdChORVdMSU5FKSA6IFtdXG4gICAgY29uc3QgY2h1bmtzID0gdGV4dFxuICAgICAgLm1hcChlbnRyeSA9PiBlbnRyeS50cmltKCkpXG4gICAgICAubWFwKChlbnRyeSwgaW5kZXgpID0+IGVudHJ5Lmxlbmd0aCAmJiA8c3BhbiBjbGFzc05hbWU9e2luZGV4ICE9PSAwICYmICdsaW50ZXItbGluZSd9PntlbnRyeX08L3NwYW4+KVxuICAgICAgLmZpbHRlcihlID0+IGUpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGxpbnRlci1tZXNzYWdlIGNsYXNzPXttZXNzYWdlLnNldmVyaXR5fT5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgbXVsdGlMaW5lU2hvdzogIXRoaXMuc3RhdGUubXVsdGlMaW5lU2hvdyB9KX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBsaW50ZXItaWNvbiBpY29uLSR7dGhpcy5zdGF0ZS5tdWx0aUxpbmVTaG93ID8gJ2NoZXZyb24tZG93bicgOiAnY2hldnJvbi1yaWdodCd9YH0gLz5cbiAgICAgICAgPC9hPlxuICAgICAgICB7ZGVsZWdhdGUuc2hvd1Byb3ZpZGVyTmFtZSA/IGAke21lc3NhZ2UubGludGVyTmFtZX06IGAgOiAnJ31cbiAgICAgICAge2NodW5rc1swXX0ge3RoaXMuc3RhdGUubXVsdGlMaW5lU2hvdyAmJiBjaHVua3Muc2xpY2UoMSl9XG4gICAgICA8L2xpbnRlci1tZXNzYWdlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gTkVXTElORS50ZXN0KHRoaXMucHJvcHMubWVzc2FnZS50ZXh0IHx8ICcnKSA/IHRoaXMucmVuZGVyTXVsdGlMaW5lKCkgOiB0aGlzLnJlbmRlclNpbmdsZUxpbmUoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZUVsZW1lbnRcbiJdfQ==