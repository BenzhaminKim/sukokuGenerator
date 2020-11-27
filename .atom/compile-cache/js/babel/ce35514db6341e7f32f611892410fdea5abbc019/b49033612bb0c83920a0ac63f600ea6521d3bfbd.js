var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sbReactTable = require('sb-react-table');

var _sbReactTable2 = _interopRequireDefault(_sbReactTable);

var _helpers = require('../helpers');

var PanelComponent = (function (_React$Component) {
  _inherits(PanelComponent, _React$Component);

  _createClass(PanelComponent, null, [{
    key: 'renderRowColumn',
    value: function renderRowColumn(row, column) {
      var range = (0, _helpers.$range)(row);

      switch (column) {
        case 'file':
          return (0, _helpers.getPathOfMessage)(row);
        case 'line':
          return range ? range.start.row + 1 + ':' + (range.start.column + 1) : '';
        case 'excerpt':
          if (row.version === 1) {
            if (row.html) {
              return _react2['default'].createElement('span', { dangerouslySetInnerHTML: { __html: row.html } });
            }
            return row.text || '';
          }
          return row.excerpt;
        case 'severity':
          return _helpers.severityNames[row.severity];
        default:
          return row[column];
      }
    }
  }]);

  function PanelComponent(props, context) {
    _classCallCheck(this, PanelComponent);

    _get(Object.getPrototypeOf(PanelComponent.prototype), 'constructor', this).call(this, props, context);

    this.onClick = function (e, row) {
      if (e.target.tagName === 'A') {
        return;
      }
      if (process.platform === 'darwin' ? e.metaKey : e.ctrlKey) {
        if (e.shiftKey) {
          (0, _helpers.openExternally)(row);
        } else {
          (0, _helpers.visitMessage)(row, true);
        }
      } else {
        (0, _helpers.visitMessage)(row);
      }
    };

    this.state = {
      messages: this.props.delegate.filteredMessages
    };
  }

  _createClass(PanelComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      this.props.delegate.onDidChangeMessages(function (messages) {
        _this.setState({ messages: messages });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var delegate = this.props.delegate;

      var columns = [{ key: 'severity', label: 'Severity', sortable: true }, { key: 'linterName', label: 'Provider', sortable: true }, { key: 'excerpt', label: 'Description', onClick: this.onClick }, { key: 'line', label: 'Line', sortable: true, onClick: this.onClick }];
      if (delegate.panelRepresents === 'Entire Project') {
        columns.push({
          key: 'file',
          label: 'File',
          sortable: true,
          onClick: this.onClick
        });
      }

      var customStyle = { overflowY: 'scroll', height: '100%' };

      return _react2['default'].createElement(
        'div',
        { id: 'linter-panel', tabIndex: '-1', style: customStyle },
        _react2['default'].createElement(_sbReactTable2['default'], {
          rows: this.state.messages,
          columns: columns,
          initialSort: [{ column: 'severity', type: 'desc' }, { column: 'file', type: 'asc' }, { column: 'line', type: 'asc' }],
          sort: _helpers.sortMessages,
          rowKey: function (i) {
            return i.key;
          },
          renderHeaderColumn: function (i) {
            return i.label;
          },
          renderBodyColumn: PanelComponent.renderRowColumn,
          style: { width: '100%' },
          className: 'linter'
        })
      );
    }
  }]);

  return PanelComponent;
})(_react2['default'].Component);

module.exports = PanelComponent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7NEJBQ0YsZ0JBQWdCOzs7O3VCQUM2RCxZQUFZOztJQVkxRyxjQUFjO1lBQWQsY0FBYzs7ZUFBZCxjQUFjOztXQUNJLHlCQUFDLEdBQWtCLEVBQUUsTUFBYyxFQUFtQjtBQUMxRSxVQUFNLEtBQUssR0FBRyxxQkFBTyxHQUFHLENBQUMsQ0FBQTs7QUFFekIsY0FBUSxNQUFNO0FBQ1osYUFBSyxNQUFNO0FBQ1QsaUJBQU8sK0JBQWlCLEdBQUcsQ0FBQyxDQUFBO0FBQUEsQUFDOUIsYUFBSyxNQUFNO0FBQ1QsaUJBQU8sS0FBSyxHQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUEsR0FBSyxFQUFFLENBQUE7QUFBQSxBQUN4RSxhQUFLLFNBQVM7QUFDWixjQUFJLEdBQUcsQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFO0FBQ3JCLGdCQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7QUFDWixxQkFBTywyQ0FBTSx1QkFBdUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEFBQUMsR0FBRyxDQUFBO2FBQy9EO0FBQ0QsbUJBQU8sR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUE7V0FDdEI7QUFDRCxpQkFBTyxHQUFHLENBQUMsT0FBTyxDQUFBO0FBQUEsQUFDcEIsYUFBSyxVQUFVO0FBQ2IsaUJBQU8sdUJBQWMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQUEsQUFDcEM7QUFDRSxpQkFBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7QUFBQSxPQUNyQjtLQUNGOzs7QUFFVSxXQXhCUCxjQUFjLENBd0JOLEtB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LENBQUMsS0FBSztXQUFBLEFBQUM7QUFDakMsMEJBQWdCLEVBQUUsY0FBYyxDQUFDLGVBQWUsQUFBQztBQUNqRCxlQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEFBQUM7QUFDekIsbUJBQVMsRUFBQyxRQUFRO1VBQ2xCO09BQ0UsQ0FDUDtLQUNGOzs7U0E3RkcsY0FBYztHQUFTLG1CQUFNLFNBQVM7O0FBZ0c1QyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQSIsImZpbGUiOiJmaWxlOi8vL0M6L1VzZXJzL3VzZXIvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2NvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdFRhYmxlIGZyb20gJ3NiLXJlYWN0LXRhYmxlJ1xuaW1wb3J0IHsgJHJhbmdlLCBzZXZlcml0eU5hbWVzLCBzb3J0TWVzc2FnZXMsIHZpc2l0TWVzc2FnZSwgb3BlbkV4dGVybmFsbHksIGdldFBhdGhPZk1lc3NhZ2UgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG50eXBlIFByb3BzID0ge1xuICBkZWxlZ2F0ZTogRGVsZWdhdGUsXG59XG5cbnR5cGUgU3RhdGUgPSB7XG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPixcbn1cblxuY2xhc3MgUGFuZWxDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHMsIFN0YXRlPiB7XG4gIHN0YXRpYyByZW5kZXJSb3dDb2x1bW4ocm93OiBMaW50ZXJNZXNzYWdlLCBjb2x1bW46IHN0cmluZyk6IHN0cmluZyB8IE9iamVjdCB7XG4gICAgY29uc3QgcmFuZ2UgPSAkcmFuZ2Uocm93KVxuXG4gICAgc3dpdGNoIChjb2x1bW4pIHtcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICByZXR1cm4gZ2V0UGF0aE9mTWVzc2FnZShyb3cpXG4gICAgICBjYXNlICdsaW5lJzpcbiAgICAgICAgcmV0dXJuIHJhbmdlID8gYCR7cmFuZ2Uuc3RhcnQucm93ICsgMX06JHtyYW5nZS5zdGFydC5jb2x1bW4gKyAxfWAgOiAnJ1xuICAgICAgY2FzZSAnZXhjZXJwdCc6XG4gICAgICAgIGlmIChyb3cudmVyc2lvbiA9PT0gMSkge1xuICAgICAgICAgIGlmIChyb3cuaHRtbCkge1xuICAgICAgICAgICAgcmV0dXJuIDxzcGFuIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogcm93Lmh0bWwgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvdy50ZXh0IHx8ICcnXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvdy5leGNlcnB0XG4gICAgICBjYXNlICdzZXZlcml0eSc6XG4gICAgICAgIHJldHVybiBzZXZlcml0eU5hbWVzW3Jvdy5zZXZlcml0eV1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiByb3dbY29sdW1uXVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBPYmplY3QsIGNvbnRleHQ6ID9PYmplY3QpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dClcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbWVzc2FnZXM6IHRoaXMucHJvcHMuZGVsZWdhdGUuZmlsdGVyZWRNZXNzYWdlcyxcbiAgICB9XG4gIH1cbiAgc3RhdGU6IFN0YXRlXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vbkRpZENoYW5nZU1lc3NhZ2VzKG1lc3NhZ2VzID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBtZXNzYWdlcyB9KVxuICAgIH0pXG4gIH1cblxuICBvbkNsaWNrID0gKGU6IE1vdXNlRXZlbnQsIHJvdzogTGludGVyTWVzc2FnZSkgPT4ge1xuICAgIGlmIChlLnRhcmdldC50YWdOYW1lID09PSAnQScpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicgPyBlLm1ldGFLZXkgOiBlLmN0cmxLZXkpIHtcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgIG9wZW5FeHRlcm5hbGx5KHJvdylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpc2l0TWVzc2FnZShyb3csIHRydWUpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpc2l0TWVzc2FnZShyb3cpXG4gICAgfVxuICB9XG5cbiAgcHJvcHM6IFByb3BzXG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZGVsZWdhdGUgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBjb2x1bW5zID0gW1xuICAgICAgeyBrZXk6ICdzZXZlcml0eScsIGxhYmVsOiAnU2V2ZXJpdHknLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgeyBrZXk6ICdsaW50ZXJOYW1lJywgbGFiZWw6ICdQcm92aWRlcicsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICB7IGtleTogJ2V4Y2VycHQnLCBsYWJlbDogJ0Rlc2NyaXB0aW9uJywgb25DbGljazogdGhpcy5vbkNsaWNrIH0sXG4gICAgICB7IGtleTogJ2xpbmUnLCBsYWJlbDogJ0xpbmUnLCBzb3J0YWJsZTogdHJ1ZSwgb25DbGljazogdGhpcy5vbkNsaWNrIH0sXG4gICAgXVxuICAgIGlmIChkZWxlZ2F0ZS5wYW5lbFJlcHJlc2VudHMgPT09ICdFbnRpcmUgUHJvamVjdCcpIHtcbiAgICAgIGNvbHVtbnMucHVzaCh7XG4gICAgICAgIGtleTogJ2ZpbGUnLFxuICAgICAgICBsYWJlbDogJ0ZpbGUnLFxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcbiAgICAgICAgb25DbGljazogdGhpcy5vbkNsaWNrLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBjdXN0b21TdHlsZTogT2JqZWN0ID0geyBvdmVyZmxvd1k6ICdzY3JvbGwnLCBoZWlnaHQ6ICcxMDAlJyB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cImxpbnRlci1wYW5lbFwiIHRhYkluZGV4PVwiLTFcIiBzdHlsZT17Y3VzdG9tU3R5bGV9PlxuICAgICAgICA8UmVhY3RUYWJsZVxuICAgICAgICAgIHJvd3M9e3RoaXMuc3RhdGUubWVzc2FnZXN9XG4gICAgICAgICAgY29sdW1ucz17Y29sdW1uc31cbiAgICAgICAgICBpbml0aWFsU29ydD17W1xuICAgICAgICAgICAgeyBjb2x1bW46ICdzZXZlcml0eScsIHR5cGU6ICdkZXNjJyB9LFxuICAgICAgICAgICAgeyBjb2x1bW46ICdmaWxlJywgdHlwZTogJ2FzYycgfSxcbiAgICAgICAgICAgIHsgY29sdW1uOiAnbGluZScsIHR5cGU6ICdhc2MnIH0sXG4gICAgICAgICAgXX1cbiAgICAgICAgICBzb3J0PXtzb3J0TWVzc2FnZXN9XG4gICAgICAgICAgcm93S2V5PXtpID0+IGkua2V5fVxuICAgICAgICAgIHJlbmRlckhlYWRlckNvbHVtbj17aSA9PiBpLmxhYmVsfVxuICAgICAgICAgIHJlbmRlckJvZHlDb2x1bW49e1BhbmVsQ29tcG9uZW50LnJlbmRlclJvd0NvbHVtbn1cbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnIH19XG4gICAgICAgICAgY2xhc3NOYW1lPVwibGludGVyXCJcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsQ29tcG9uZW50XG4iXX0=