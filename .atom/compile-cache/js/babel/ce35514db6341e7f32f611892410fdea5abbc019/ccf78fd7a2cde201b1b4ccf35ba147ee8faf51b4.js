var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _url = require('url');

var url = _interopRequireWildcard(_url);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _helpers = require('../helpers');

var _fixButton = require('./fix-button');

var _fixButton2 = _interopRequireDefault(_fixButton);

function findHref(el) {
  while (el && !el.classList.contains('linter-line')) {
    if (el instanceof HTMLAnchorElement) {
      return el.href;
    }
    el = el.parentElement;
  }
  return null;
}

var MessageElement = (function (_React$Component) {
  _inherits(MessageElement, _React$Component);

  function MessageElement() {
    _classCallCheck(this, MessageElement);

    _get(Object.getPrototypeOf(MessageElement.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      description: '',
      descriptionShow: false
    };

    this.openFile = function (ev) {
      if (!(ev.target instanceof HTMLElement)) {
        return;
      }
      var href = findHref(ev.target);
      if (!href) {
        return;
      }
      // parse the link. e.g. atom://linter?file=<path>&row=<number>&column=<number>

      var _url$parse = url.parse(href, true);

      var protocol = _url$parse.protocol;
      var hostname = _url$parse.hostname;
      var query = _url$parse.query;

      var file = query && query.file;
      if (protocol !== 'atom:' || hostname !== 'linter' || !file) {
        return;
      }
      var row = query && query.row ? parseInt(query.row, 10) : 0;
      var column = query && query.column ? parseInt(query.column, 10) : 0;
      (0, _helpers.openFile)(file, { row: row, column: column });
    };

    this.descriptionLoading = false;
  }

  _createClass(MessageElement, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      this.props.delegate.onShouldUpdate(function () {
        _this.setState({});
      });
      this.props.delegate.onShouldExpand(function () {
        if (!_this.state.descriptionShow) {
          _this.toggleDescription();
        }
      });
      this.props.delegate.onShouldCollapse(function () {
        if (_this.state.descriptionShow) {
          _this.toggleDescription();
        }
      });
    }

    // NOTE: Only handling messages v2 because v1 would be handled by message-legacy component
  }, {
    key: 'onFixClick',
    value: function onFixClick() {
      var message = this.props.message;
      var textEditor = (0, _helpers.getActiveTextEditor)();
      if (message.version === 2 && message.solutions && message.solutions.length) {
        (0, _helpers.applySolution)(textEditor, message.version, (0, _helpers.sortSolutions)(message.solutions)[0]);
      }
    }
  }, {
    key: 'canBeFixed',
    value: function canBeFixed(message) {
      if (message.version === 1 && message.fix) {
        return true;
      } else if (message.version === 2 && message.solutions && message.solutions.length) {
        return true;
      }
      return false;
    }
  }, {
    key: 'toggleDescription',
    value: function toggleDescription() {
      var _this2 = this;

      var result = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var newStatus = !this.state.descriptionShow;
      var description = this.state.description || this.props.message.description;

      if (!newStatus && !result) {
        this.setState({ descriptionShow: false });
        return;
      }
      if (typeof description === 'string' || result) {
        var descriptionToUse = (0, _marked2['default'])(result || description);
        this.setState({ descriptionShow: true, description: descriptionToUse });
      } else if (typeof description === 'function') {
        this.setState({ descriptionShow: true });
        if (this.descriptionLoading) {
          return;
        }
        this.descriptionLoading = true;
        new Promise(function (resolve) {
          resolve(description());
        }).then(function (response) {
          if (typeof response !== 'string') {
            throw new Error('Expected result to be string, got: ' + typeof response);
          }
          _this2.toggleDescription(response);
        })['catch'](function (error) {
          console.log('[Linter] Error getting descriptions', error);
          _this2.descriptionLoading = false;
          if (_this2.state.descriptionShow) {
            _this2.toggleDescription();
          }
        });
      } else {
        console.error('[Linter] Invalid description detected, expected string or function but got:', typeof description);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props;
      var message = _props.message;
      var delegate = _props.delegate;

      return _react2['default'].createElement(
        'linter-message',
        { 'class': message.severity, onClick: this.openFile },
        message.description && _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return _this3.toggleDescription();
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-' + (this.state.descriptionShow ? 'chevron-down' : 'chevron-right') })
        ),
        _react2['default'].createElement(
          'linter-excerpt',
          null,
          this.canBeFixed(message) && _react2['default'].createElement(_fixButton2['default'], { onClick: function () {
              return _this3.onFixClick();
            } }),
          delegate.showProviderName ? message.linterName + ': ' : '',
          message.excerpt
        ),
        ' ',
        message.reference && message.reference.file && _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return (0, _helpers.visitMessage)(message, true);
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-alignment-aligned-to' })
        ),
        message.url && _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return (0, _helpers.openExternally)(message);
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-link' })
        ),
        this.state.descriptionShow && _react2['default'].createElement('div', {
          dangerouslySetInnerHTML: {
            __html: this.state.description || 'Loading...'
          },
          className: 'linter-line'
        })
      );
    }
  }]);

  return MessageElement;
})(_react2['default'].Component);

module.exports = MessageElement;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9tZXNzYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzttQkFFcUIsS0FBSzs7SUFBZCxHQUFHOztxQkFDRyxPQUFPOzs7O3NCQUNOLFFBQVE7Ozs7dUJBRStFLFlBQVk7O3lCQUdoRyxjQUFjOzs7O0FBRXBDLFNBQVMsUUFBUSxDQUFDLEVBQVksRUFBVztBQUN2QyxTQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO0FBQ2xELFFBQUksRUFBRSxZQUFZLGlCQUFpQixFQUFFO0FBQ25DLGFBQU8sRUFBRSxDQUFDLElBQUksQ0FBQTtLQUNmO0FBQ0QsTUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUE7R0FDdEI7QUFDRCxTQUFPLElBQUksQ0FBQTtDQUNaOztJQVlLLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7U0FDbEIsS0FBSyxHQUFVO0FBQ2IsaUJBQVcsRUFBRSxFQUFFO0FBQ2YscUJBQWUsRUFBRSxLQUFLO0tBQ3ZCOztTQTJCRCxRQUFRLEdBQUcsVUFBQyxFQUFFLEVBQVk7QUFDeEIsVUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLFlBQVksV0FBVyxDQUFBLEFBQUMsRUFBRTtBQUN2QyxlQUFNO09BQ1A7QUFDRCxVQUFNLElBQUksR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxJQUFJLEVBQUU7QUFDVCxlQUFNO09BQ1A7Ozt1QkFFcUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDOztVQUFuRCxRQUFRLGNBQVIsUUFBUTtVQUFFLFFBQVEsY0FBUixRQUFRO1VBQUUsS0FBSyxjQUFMLEtBQUs7O0FBQ2pDLFVBQU0sSUFBSSxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFBO0FBQ2hDLFVBQUksUUFBUSxLQUFLLE9BQU8sSUFBSSxRQUFRLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQzFELGVBQU07T0FDUDtBQUNELFVBQU0sR0FBRyxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUM1RCxVQUFNLE1BQU0sR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDckUsNkJBQVMsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQTtLQUNoQzs7U0FrREQsa0JBQWtCLEdBQVksS0FBSzs7O2VBbEcvQixjQUFjOztXQU1ELDZCQUFHOzs7QUFDbEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQU07QUFDdkMsY0FBSyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDbEIsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQU07QUFDdkMsWUFBSSxDQUFDLE1BQUssS0FBSyxDQUFDLGVBQWUsRUFBRTtBQUMvQixnQkFBSyxpQkFBaUIsRUFBRSxDQUFBO1NBQ3pCO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBTTtBQUN6QyxZQUFJLE1BQUssS0FBSyxDQUFDLGVBQWUsRUFBRTtBQUM5QixnQkFBSyxpQkFBaUIsRUFBRSxDQUFBO1NBQ3pCO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7Ozs7O1dBR1Msc0JBQVM7QUFDakIsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUE7QUFDbEMsVUFBTSxVQUFVLEdBQUcsbUNBQXFCLENBQUE7QUFDeEMsVUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzFFLG9DQUFjLFVBQVUsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLDRCQUFjLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQ2hGO0tBQ0Y7OztXQXFCUyxvQkFBQyxPQUFzQixFQUFXO0FBQzFDLFVBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUN4QyxlQUFPLElBQUksQ0FBQTtPQUNaLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ2pGLGVBQU8sSUFBSSxDQUFBO09BQ1o7QUFDRCxhQUFPLEtBQUssQ0FBQTtLQUNiOzs7V0FFZ0IsNkJBQXlCOzs7VUFBeEIsTUFBZSx5REFBRyxJQUFJOztBQUN0QyxVQUFNLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFBO0FBQzdDLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQTs7QUFFNUUsVUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUN6QixZQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7QUFDekMsZUFBTTtPQUNQO0FBQ0QsVUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLElBQUksTUFBTSxFQUFFO0FBQzdDLFlBQU0sZ0JBQWdCLEdBQUcseUJBQU8sTUFBTSxJQUFJLFdBQVcsQ0FBQyxDQUFBO0FBQ3RELFlBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUE7T0FDeEUsTUFBTSxJQUFJLE9BQU8sV0FBVyxLQUFLLFVBQVUsRUFBRTtBQUM1QyxZQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7QUFDeEMsWUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7QUFDM0IsaUJBQU07U0FDUDtBQUNELFlBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUE7QUFDOUIsWUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUU7QUFDNUIsaUJBQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO1NBQ3ZCLENBQUMsQ0FDQyxJQUFJLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDaEIsY0FBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7QUFDaEMsa0JBQU0sSUFBSSxLQUFLLHlDQUF1QyxPQUFPLFFBQVEsQ0FBRyxDQUFBO1dBQ3pFO0FBQ0QsaUJBQUssaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUE7U0FDakMsQ0FBQyxTQUNJLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDZCxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUN6RCxpQkFBSyxrQkFBa0IsR0FBRyxLQUFLLENBQUE7QUFDL0IsY0FBSSxPQUFLLEtBQUssQ0FBQyxlQUFlLEVBQUU7QUFDOUIsbUJBQUssaUJBQWlCLEVBQUUsQ0FBQTtXQUN6QjtTQUNGLENBQUMsQ0FBQTtPQUNMLE1BQU07QUFDTCxlQUFPLENBQUMsS0FBSyxDQUFDLDZFQUE2RSxFQUFFLE9BQU8sV0FBVyxDQUFDLENBQUE7T0FDakg7S0FDRjs7O1dBS0ssa0JBQUc7OzttQkFDdUIsSUFBSSxDQUFDLEtBQUs7VUFBaEMsT0FBTyxVQUFQLE9BQU87VUFBRSxRQUFRLFVBQVIsUUFBUTs7QUFFekIsYUFDRTs7VUFBZ0IsU0FBTyxPQUFPLENBQUMsUUFBUSxBQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEFBQUM7UUFDN0QsT0FBTyxDQUFDLFdBQVcsSUFDbEI7O1lBQUcsSUFBSSxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUU7cUJBQU0sT0FBSyxpQkFBaUIsRUFBRTthQUFBLEFBQUM7VUFDbEQsMkNBQU0sU0FBUyw4QkFBMkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsY0FBYyxHQUFHLGVBQWUsQ0FBQSxBQUFHLEdBQUc7U0FDM0csQUFDTDtRQUNEOzs7VUFDRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLDJEQUFXLE9BQU8sRUFBRTtxQkFBTSxPQUFLLFVBQVUsRUFBRTthQUFBLEFBQUMsR0FBRztVQUMzRSxRQUFRLENBQUMsZ0JBQWdCLEdBQU0sT0FBTyxDQUFDLFVBQVUsVUFBTyxFQUFFO1VBQzFELE9BQU8sQ0FBQyxPQUFPO1NBQ0Q7UUFBQyxHQUFHO1FBQ3BCLE9BQU8sQ0FBQyxTQUFTLElBQ2hCLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUNwQjs7WUFBRyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRTtxQkFBTSwyQkFBYSxPQUFPLEVBQUUsSUFBSSxDQUFDO2FBQUEsQUFBQztVQUNyRCwyQ0FBTSxTQUFTLEVBQUMsNENBQTRDLEdBQUc7U0FDN0QsQUFDTDtRQUNGLE9BQU8sQ0FBQyxHQUFHLElBQ1Y7O1lBQUcsSUFBSSxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUU7cUJBQU0sNkJBQWUsT0FBTyxDQUFDO2FBQUEsQUFBQztVQUNqRCwyQ0FBTSxTQUFTLEVBQUMsNEJBQTRCLEdBQUc7U0FDN0MsQUFDTDtRQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxJQUN6QjtBQUNFLGlDQUF1QixFQUFFO0FBQ3ZCLGtCQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksWUFBWTtXQUMvQyxBQUFDO0FBQ0YsbUJBQVMsRUFBQyxhQUFhO1VBQ3ZCLEFBQ0g7T0FDYyxDQUNsQjtLQUNGOzs7U0F4SUcsY0FBYztHQUFTLG1CQUFNLFNBQVM7O0FBMkk1QyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQSIsImZpbGUiOiJmaWxlOi8vL0M6L1VzZXJzL3VzZXIvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3Rvb2x0aXAvbWVzc2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgbWFya2VkIGZyb20gJ21hcmtlZCdcblxuaW1wb3J0IHsgdmlzaXRNZXNzYWdlLCBvcGVuRXh0ZXJuYWxseSwgb3BlbkZpbGUsIGFwcGx5U29sdXRpb24sIGdldEFjdGl2ZVRleHRFZGl0b3IsIHNvcnRTb2x1dGlvbnMgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgVG9vbHRpcERlbGVnYXRlIGZyb20gJy4vZGVsZWdhdGUnXG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2UsIExpbnRlck1lc3NhZ2UgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCBGaXhCdXR0b24gZnJvbSAnLi9maXgtYnV0dG9uJ1xuXG5mdW5jdGlvbiBmaW5kSHJlZihlbDogP0VsZW1lbnQpOiA/c3RyaW5nIHtcbiAgd2hpbGUgKGVsICYmICFlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbnRlci1saW5lJykpIHtcbiAgICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCkge1xuICAgICAgcmV0dXJuIGVsLmhyZWZcbiAgICB9XG4gICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50XG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxudHlwZSBQcm9wcyA9IHtcbiAgbWVzc2FnZTogTWVzc2FnZSxcbiAgZGVsZWdhdGU6IFRvb2x0aXBEZWxlZ2F0ZSxcbn1cblxudHlwZSBTdGF0ZSA9IHtcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmcsXG4gIGRlc2NyaXB0aW9uU2hvdz86IGJvb2xlYW4sXG59XG5cbmNsYXNzIE1lc3NhZ2VFbGVtZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzLCBTdGF0ZT4ge1xuICBzdGF0ZTogU3RhdGUgPSB7XG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGRlc2NyaXB0aW9uU2hvdzogZmFsc2UsXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkVXBkYXRlKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe30pXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkRXhwYW5kKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5kZXNjcmlwdGlvblNob3cpIHtcbiAgICAgICAgdGhpcy50b2dnbGVEZXNjcmlwdGlvbigpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkQ29sbGFwc2UoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZGVzY3JpcHRpb25TaG93KSB7XG4gICAgICAgIHRoaXMudG9nZ2xlRGVzY3JpcHRpb24oKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBOT1RFOiBPbmx5IGhhbmRsaW5nIG1lc3NhZ2VzIHYyIGJlY2F1c2UgdjEgd291bGQgYmUgaGFuZGxlZCBieSBtZXNzYWdlLWxlZ2FjeSBjb21wb25lbnRcbiAgb25GaXhDbGljaygpOiB2b2lkIHtcbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5wcm9wcy5tZXNzYWdlXG4gICAgY29uc3QgdGV4dEVkaXRvciA9IGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDIgJiYgbWVzc2FnZS5zb2x1dGlvbnMgJiYgbWVzc2FnZS5zb2x1dGlvbnMubGVuZ3RoKSB7XG4gICAgICBhcHBseVNvbHV0aW9uKHRleHRFZGl0b3IsIG1lc3NhZ2UudmVyc2lvbiwgc29ydFNvbHV0aW9ucyhtZXNzYWdlLnNvbHV0aW9ucylbMF0pXG4gICAgfVxuICB9XG5cbiAgb3BlbkZpbGUgPSAoZXY6IEV2ZW50KSA9PiB7XG4gICAgaWYgKCEoZXYudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgaHJlZiA9IGZpbmRIcmVmKGV2LnRhcmdldClcbiAgICBpZiAoIWhyZWYpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyBwYXJzZSB0aGUgbGluay4gZS5nLiBhdG9tOi8vbGludGVyP2ZpbGU9PHBhdGg+JnJvdz08bnVtYmVyPiZjb2x1bW49PG51bWJlcj5cbiAgICBjb25zdCB7IHByb3RvY29sLCBob3N0bmFtZSwgcXVlcnkgfSA9IHVybC5wYXJzZShocmVmLCB0cnVlKVxuICAgIGNvbnN0IGZpbGUgPSBxdWVyeSAmJiBxdWVyeS5maWxlXG4gICAgaWYgKHByb3RvY29sICE9PSAnYXRvbTonIHx8IGhvc3RuYW1lICE9PSAnbGludGVyJyB8fCAhZmlsZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHJvdyA9IHF1ZXJ5ICYmIHF1ZXJ5LnJvdyA/IHBhcnNlSW50KHF1ZXJ5LnJvdywgMTApIDogMFxuICAgIGNvbnN0IGNvbHVtbiA9IHF1ZXJ5ICYmIHF1ZXJ5LmNvbHVtbiA/IHBhcnNlSW50KHF1ZXJ5LmNvbHVtbiwgMTApIDogMFxuICAgIG9wZW5GaWxlKGZpbGUsIHsgcm93LCBjb2x1bW4gfSlcbiAgfVxuXG4gIGNhbkJlRml4ZWQobWVzc2FnZTogTGludGVyTWVzc2FnZSk6IGJvb2xlYW4ge1xuICAgIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDEgJiYgbWVzc2FnZS5maXgpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDIgJiYgbWVzc2FnZS5zb2x1dGlvbnMgJiYgbWVzc2FnZS5zb2x1dGlvbnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHRvZ2dsZURlc2NyaXB0aW9uKHJlc3VsdDogP3N0cmluZyA9IG51bGwpIHtcbiAgICBjb25zdCBuZXdTdGF0dXMgPSAhdGhpcy5zdGF0ZS5kZXNjcmlwdGlvblNob3dcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuc3RhdGUuZGVzY3JpcHRpb24gfHwgdGhpcy5wcm9wcy5tZXNzYWdlLmRlc2NyaXB0aW9uXG5cbiAgICBpZiAoIW5ld1N0YXR1cyAmJiAhcmVzdWx0KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgZGVzY3JpcHRpb25TaG93OiBmYWxzZSB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0eXBlb2YgZGVzY3JpcHRpb24gPT09ICdzdHJpbmcnIHx8IHJlc3VsdCkge1xuICAgICAgY29uc3QgZGVzY3JpcHRpb25Ub1VzZSA9IG1hcmtlZChyZXN1bHQgfHwgZGVzY3JpcHRpb24pXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZGVzY3JpcHRpb25TaG93OiB0cnVlLCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25Ub1VzZSB9KVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlc2NyaXB0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgZGVzY3JpcHRpb25TaG93OiB0cnVlIH0pXG4gICAgICBpZiAodGhpcy5kZXNjcmlwdGlvbkxvYWRpbmcpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uTG9hZGluZyA9IHRydWVcbiAgICAgIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgcmVzb2x2ZShkZXNjcmlwdGlvbigpKVxuICAgICAgfSlcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgcmVzcG9uc2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHJlc3VsdCB0byBiZSBzdHJpbmcsIGdvdDogJHt0eXBlb2YgcmVzcG9uc2V9YClcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy50b2dnbGVEZXNjcmlwdGlvbihyZXNwb25zZSlcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW0xpbnRlcl0gRXJyb3IgZ2V0dGluZyBkZXNjcmlwdGlvbnMnLCBlcnJvcilcbiAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uTG9hZGluZyA9IGZhbHNlXG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZGVzY3JpcHRpb25TaG93KSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZURlc2NyaXB0aW9uKClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMaW50ZXJdIEludmFsaWQgZGVzY3JpcHRpb24gZGV0ZWN0ZWQsIGV4cGVjdGVkIHN0cmluZyBvciBmdW5jdGlvbiBidXQgZ290OicsIHR5cGVvZiBkZXNjcmlwdGlvbilcbiAgICB9XG4gIH1cblxuICBwcm9wczogUHJvcHNcbiAgZGVzY3JpcHRpb25Mb2FkaW5nOiBib29sZWFuID0gZmFsc2VcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlLCBkZWxlZ2F0ZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxsaW50ZXItbWVzc2FnZSBjbGFzcz17bWVzc2FnZS5zZXZlcml0eX0gb25DbGljaz17dGhpcy5vcGVuRmlsZX0+XG4gICAgICAgIHttZXNzYWdlLmRlc2NyaXB0aW9uICYmIChcbiAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9eygpID0+IHRoaXMudG9nZ2xlRGVzY3JpcHRpb24oKX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGxpbnRlci1pY29uIGljb24tJHt0aGlzLnN0YXRlLmRlc2NyaXB0aW9uU2hvdyA/ICdjaGV2cm9uLWRvd24nIDogJ2NoZXZyb24tcmlnaHQnfWB9IC8+XG4gICAgICAgICAgPC9hPlxuICAgICAgICApfVxuICAgICAgICA8bGludGVyLWV4Y2VycHQ+XG4gICAgICAgICAge3RoaXMuY2FuQmVGaXhlZChtZXNzYWdlKSAmJiA8Rml4QnV0dG9uIG9uQ2xpY2s9eygpID0+IHRoaXMub25GaXhDbGljaygpfSAvPn1cbiAgICAgICAgICB7ZGVsZWdhdGUuc2hvd1Byb3ZpZGVyTmFtZSA/IGAke21lc3NhZ2UubGludGVyTmFtZX06IGAgOiAnJ31cbiAgICAgICAgICB7bWVzc2FnZS5leGNlcnB0fVxuICAgICAgICA8L2xpbnRlci1leGNlcnB0PnsnICd9XG4gICAgICAgIHttZXNzYWdlLnJlZmVyZW5jZSAmJlxuICAgICAgICAgIG1lc3NhZ2UucmVmZXJlbmNlLmZpbGUgJiYgKFxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKSA9PiB2aXNpdE1lc3NhZ2UobWVzc2FnZSwgdHJ1ZSl9PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGxpbnRlci1pY29uIGljb24tYWxpZ25tZW50LWFsaWduZWQtdG9cIiAvPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICl9XG4gICAgICAgIHttZXNzYWdlLnVybCAmJiAoXG4gICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKSA9PiBvcGVuRXh0ZXJuYWxseShtZXNzYWdlKX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGxpbnRlci1pY29uIGljb24tbGlua1wiIC8+XG4gICAgICAgICAgPC9hPlxuICAgICAgICApfVxuICAgICAgICB7dGhpcy5zdGF0ZS5kZXNjcmlwdGlvblNob3cgJiYgKFxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7XG4gICAgICAgICAgICAgIF9faHRtbDogdGhpcy5zdGF0ZS5kZXNjcmlwdGlvbiB8fCAnTG9hZGluZy4uLicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwibGludGVyLWxpbmVcIlxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L2xpbnRlci1tZXNzYWdlPlxuICAgIClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VFbGVtZW50XG4iXX0=