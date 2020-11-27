var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _atom = require('atom');

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _helpers = require('../helpers');

var _helpers2 = require('./helpers');

var Editor = (function () {
  function Editor(textEditor) {
    var _this = this;

    _classCallCheck(this, Editor);

    this.tooltip = null;
    this.emitter = new _atom.Emitter();
    this.markers = new Map();
    this.messages = new Set();
    this.textEditor = textEditor;
    this.subscriptions = new _atom.CompositeDisposable();
    this.ignoreTooltipInvocation = false;

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter-ui-default.showTooltip', function (showTooltip) {
      _this.showTooltip = showTooltip;
      if (!_this.showTooltip && _this.tooltip) {
        _this.removeTooltip();
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showProviderName', function (showProviderName) {
      _this.showProviderName = showProviderName;
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showDecorations', function (showDecorations) {
      var notInitial = typeof _this.showDecorations !== 'undefined';
      _this.showDecorations = showDecorations;
      if (notInitial) {
        _this.updateGutter();
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.gutterPosition', function (gutterPosition) {
      var notInitial = typeof _this.gutterPosition !== 'undefined';
      _this.gutterPosition = gutterPosition;
      if (notInitial) {
        _this.updateGutter();
      }
    }));
    this.subscriptions.add(textEditor.onDidDestroy(function () {
      _this.dispose();
    }));

    var tooltipSubscription = undefined;
    this.subscriptions.add(atom.config.observe('linter-ui-default.tooltipFollows', function (tooltipFollows) {
      _this.tooltipFollows = tooltipFollows;
      if (tooltipSubscription) {
        tooltipSubscription.dispose();
      }
      tooltipSubscription = new _atom.CompositeDisposable();
      if (tooltipFollows === 'Mouse' || tooltipFollows === 'Both') {
        tooltipSubscription.add(_this.listenForMouseMovement());
      }
      if (tooltipFollows === 'Keyboard' || tooltipFollows === 'Both') {
        tooltipSubscription.add(_this.listenForKeyboardMovement());
      }
      _this.removeTooltip();
    }));
    this.subscriptions.add(new _atom.Disposable(function () {
      tooltipSubscription.dispose();
    }));

    var lastCursorPositions = new WeakMap();
    this.subscriptions.add(textEditor.onDidChangeCursorPosition(function (_ref) {
      var cursor = _ref.cursor;
      var newBufferPosition = _ref.newBufferPosition;

      var lastBufferPosition = lastCursorPositions.get(cursor);
      if (!lastBufferPosition || !lastBufferPosition.isEqual(newBufferPosition)) {
        lastCursorPositions.set(cursor, newBufferPosition);
        _this.ignoreTooltipInvocation = false;
      }
      if (_this.tooltipFollows === 'Mouse') {
        _this.removeTooltip();
      }
    }));
    this.subscriptions.add(textEditor.getBuffer().onDidChangeText(function () {
      var cursors = textEditor.getCursors();
      cursors.forEach(function (cursor) {
        lastCursorPositions.set(cursor, cursor.getBufferPosition());
      });
      if (_this.tooltipFollows !== 'Mouse') {
        _this.ignoreTooltipInvocation = true;
        _this.removeTooltip();
      }
    }));
    this.updateGutter();
    this.listenForCurrentLine();
  }

  _createClass(Editor, [{
    key: 'listenForCurrentLine',
    value: function listenForCurrentLine() {
      var _this2 = this;

      this.subscriptions.add(this.textEditor.observeCursors(function (cursor) {
        var marker = undefined;
        var lastRange = undefined;
        var lastEmpty = undefined;
        var handlePositionChange = function handlePositionChange(_ref2) {
          var start = _ref2.start;
          var end = _ref2.end;

          var gutter = _this2.gutter;
          if (!gutter || _this2.subscriptions.disposed) return;
          // We need that Range.fromObject hack below because when we focus index 0 on multi-line selection
          // end.column is the column of the last line but making a range out of two and then accesing
          // the end seems to fix it (black magic?)
          var currentRange = _atom.Range.fromObject([start, end]);
          var linesRange = _atom.Range.fromObject([[start.row, 0], [end.row, Infinity]]);
          var currentEmpty = currentRange.isEmpty();

          // NOTE: Atom does not paint gutter if multi-line and last line has zero index
          if (start.row !== end.row && currentRange.end.column === 0) {
            linesRange.end.row--;
          }
          if (lastRange && lastRange.isEqual(linesRange) && currentEmpty === lastEmpty) return;
          if (marker) marker.destroy();
          lastRange = linesRange;
          lastEmpty = currentEmpty;

          marker = _this2.textEditor.markScreenRange(linesRange, {
            invalidate: 'never'
          });
          var item = document.createElement('span');
          item.className = 'line-number cursor-line linter-cursor-line ' + (currentEmpty ? 'cursor-line-no-selection' : '');
          gutter.decorateMarker(marker, {
            item: item,
            'class': 'linter-row'
          });
        };

        var cursorMarker = cursor.getMarker();
        var subscriptions = new _atom.CompositeDisposable();
        subscriptions.add(cursorMarker.onDidChange(function (_ref3) {
          var newHeadScreenPosition = _ref3.newHeadScreenPosition;
          var newTailScreenPosition = _ref3.newTailScreenPosition;

          handlePositionChange({
            start: newHeadScreenPosition,
            end: newTailScreenPosition
          });
        }));
        subscriptions.add(cursor.onDidDestroy(function () {
          _this2.subscriptions.remove(subscriptions);
          subscriptions.dispose();
        }));
        subscriptions.add(new _atom.Disposable(function () {
          if (marker) marker.destroy();
        }));
        _this2.subscriptions.add(subscriptions);
        handlePositionChange(cursorMarker.getScreenRange());
      }));
    }
  }, {
    key: 'listenForMouseMovement',
    value: function listenForMouseMovement() {
      var _this3 = this;

      var editorElement = atom.views.getView(this.textEditor);

      return (0, _disposableEvent2['default'])(editorElement, 'mousemove', (0, _sbDebounce2['default'])(function (event) {
        if (!editorElement.component || _this3.subscriptions.disposed || !(0, _helpers2.hasParent)(event.target, 'div.scroll-view')) {
          return;
        }
        var tooltip = _this3.tooltip;
        if (tooltip && (0, _helpers2.mouseEventNearPosition)({
          event: event,
          editor: _this3.textEditor,
          editorElement: editorElement,
          tooltipElement: tooltip.element,
          screenPosition: tooltip.marker.getStartScreenPosition()
        })) {
          return;
        }

        _this3.cursorPosition = (0, _helpers2.getBufferPositionFromMouseEvent)(event, _this3.textEditor, editorElement);
        _this3.ignoreTooltipInvocation = false;
        if (_this3.textEditor.largeFileMode) {
          // NOTE: Ignore if file is too large
          _this3.cursorPosition = null;
        }
        if (_this3.cursorPosition) {
          _this3.updateTooltip(_this3.cursorPosition);
        } else {
          _this3.removeTooltip();
        }
      }, 300, true));
    }
  }, {
    key: 'listenForKeyboardMovement',
    value: function listenForKeyboardMovement() {
      var _this4 = this;

      return this.textEditor.onDidChangeCursorPosition((0, _sbDebounce2['default'])(function (_ref4) {
        var newBufferPosition = _ref4.newBufferPosition;

        _this4.cursorPosition = newBufferPosition;
        _this4.updateTooltip(newBufferPosition);
      }, 16));
    }
  }, {
    key: 'updateGutter',
    value: function updateGutter() {
      var _this5 = this;

      this.removeGutter();
      if (!this.showDecorations) {
        this.gutter = null;
        return;
      }
      var priority = this.gutterPosition === 'Left' ? -100 : 100;
      this.gutter = this.textEditor.addGutter({
        name: 'linter-ui-default',
        priority: priority
      });
      this.markers.forEach(function (marker, message) {
        _this5.decorateMarker(message, marker, 'gutter');
      });
    }
  }, {
    key: 'removeGutter',
    value: function removeGutter() {
      if (this.gutter) {
        try {
          this.gutter.destroy();
        } catch (_) {
          /* This throws when the text editor is disposed */
        }
      }
    }
  }, {
    key: 'updateTooltip',
    value: function updateTooltip(position) {
      var _this6 = this;

      if (!position || this.tooltip && this.tooltip.isValid(position, this.messages)) {
        return;
      }
      this.removeTooltip();
      if (!this.showTooltip) {
        return;
      }
      if (this.ignoreTooltipInvocation) {
        return;
      }

      var messages = (0, _helpers.filterMessagesByRangeOrPoint)(this.messages, this.textEditor.getPath(), position);
      if (!messages.length) {
        return;
      }

      this.tooltip = new _tooltip2['default'](messages, position, this.textEditor);
      this.tooltip.onDidDestroy(function () {
        _this6.tooltip = null;
      });
    }
  }, {
    key: 'removeTooltip',
    value: function removeTooltip() {
      if (this.tooltip) {
        this.tooltip.marker.destroy();
      }
    }
  }, {
    key: 'apply',
    value: function apply(added, removed) {
      var _this7 = this;

      var textBuffer = this.textEditor.getBuffer();

      for (var i = 0, _length = removed.length; i < _length; i++) {
        var message = removed[i];
        var marker = this.markers.get(message);
        if (marker) {
          marker.destroy();
        }
        this.messages['delete'](message);
        this.markers['delete'](message);
      }

      var _loop = function (i, _length2) {
        var message = added[i];
        var markerRange = (0, _helpers.$range)(message);
        if (!markerRange) {
          // Only for backward compatibility
          return 'continue';
        }
        var marker = textBuffer.markRange(markerRange, {
          invalidate: 'never'
        });
        _this7.markers.set(message, marker);
        _this7.messages.add(message);
        _this7.decorateMarker(message, marker);
        marker.onDidChange(function (_ref5) {
          var oldHeadPosition = _ref5.oldHeadPosition;
          var newHeadPosition = _ref5.newHeadPosition;
          var isValid = _ref5.isValid;

          if (!isValid || newHeadPosition.row === 0 && oldHeadPosition.row !== 0) {
            return;
          }
          if (message.version === 1) {
            message.range = marker.previousEventState.range;
          } else {
            message.location.position = marker.previousEventState.range;
          }
        });
      };

      for (var i = 0, _length2 = added.length; i < _length2; i++) {
        var _ret = _loop(i, _length2);

        if (_ret === 'continue') continue;
      }

      this.updateTooltip(this.cursorPosition);
    }
  }, {
    key: 'decorateMarker',
    value: function decorateMarker(message, marker) {
      var paint = arguments.length <= 2 || arguments[2] === undefined ? 'both' : arguments[2];

      if (paint === 'both' || paint === 'editor') {
        this.textEditor.decorateMarker(marker, {
          type: 'text',
          'class': 'linter-highlight linter-' + message.severity
        });
      }

      var gutter = this.gutter;
      if (gutter && (paint === 'both' || paint === 'gutter')) {
        var element = document.createElement('span');
        element.className = 'linter-gutter linter-gutter-' + message.severity + ' icon icon-' + (message.icon || 'primitive-dot');
        gutter.decorateMarker(marker, {
          'class': 'linter-row',
          item: element
        });
      }
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      this.removeGutter();
      this.removeTooltip();
    }
  }]);

  return Editor;
})();

module.exports = Editor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvZWRpdG9yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OzswQkFFcUIsYUFBYTs7OzsrQkFDTixrQkFBa0I7Ozs7b0JBQ2tCLE1BQU07O3VCQUdsRCxZQUFZOzs7O3VCQUNxQixZQUFZOzt3QkFDa0IsV0FBVzs7SUFHeEYsTUFBTTtBQWdCQyxXQWhCUCxNQUFNLENBZ0JFLFVBQXNCLEVBQUU7OzswQkFoQmhDLE1BQU07O0FBaUJSLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO0FBQ25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDeEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQTs7QUFFcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsRUFBRSxVQUFBLFdBQVcsRUFBSTtBQUNsRSxZQUFLLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsVUFBSSxDQUFDLE1BQUssV0FBVyxJQUFJLE1BQUssT0FBTyxFQUFFO0FBQ3JDLGNBQUssYUFBYSxFQUFFLENBQUE7T0FDckI7S0FDRixDQUFDLENBQ0gsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8s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QUFNLENBQUEiLCJmaWxlIjoiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9lZGl0b3IvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnc2ItZGVib3VuY2UnXG5pbXBvcnQgZGlzcG9zYWJsZUV2ZW50IGZyb20gJ2Rpc3Bvc2FibGUtZXZlbnQnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlLCBFbWl0dGVyLCBSYW5nZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IsIEJ1ZmZlck1hcmtlciwgVGV4dEVkaXRvckd1dHRlciwgUG9pbnQgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuLi90b29sdGlwJ1xuaW1wb3J0IHsgJHJhbmdlLCBmaWx0ZXJNZXNzYWdlc0J5UmFuZ2VPclBvaW50IH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB7IGhhc1BhcmVudCwgbW91c2VFdmVudE5lYXJQb3NpdGlvbiwgZ2V0QnVmZmVyUG9zaXRpb25Gcm9tTW91c2VFdmVudCB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jbGFzcyBFZGl0b3Ige1xuICBndXR0ZXI6ID9UZXh0RWRpdG9yR3V0dGVyXG4gIHRvb2x0aXA6ID9Ub29sdGlwXG4gIGVtaXR0ZXI6IEVtaXR0ZXJcbiAgbWFya2VyczogTWFwPExpbnRlck1lc3NhZ2UsIEJ1ZmZlck1hcmtlcj5cbiAgbWVzc2FnZXM6IFNldDxMaW50ZXJNZXNzYWdlPlxuICB0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yXG4gIHNob3dUb29sdGlwOiBib29sZWFuXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgY3Vyc29yUG9zaXRpb246ID9Qb2ludFxuICBndXR0ZXJQb3NpdGlvbjogYm9vbGVhblxuICB0b29sdGlwRm9sbG93czogc3RyaW5nXG4gIHNob3dEZWNvcmF0aW9uczogYm9vbGVhblxuICBzaG93UHJvdmlkZXJOYW1lOiBib29sZWFuXG4gIGlnbm9yZVRvb2x0aXBJbnZvY2F0aW9uOiBib29sZWFuXG5cbiAgY29uc3RydWN0b3IodGV4dEVkaXRvcjogVGV4dEVkaXRvcikge1xuICAgIHRoaXMudG9vbHRpcCA9IG51bGxcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tYXJrZXJzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMudGV4dEVkaXRvciA9IHRleHRFZGl0b3JcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5pZ25vcmVUb29sdGlwSW52b2NhdGlvbiA9IGZhbHNlXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1Rvb2x0aXAnLCBzaG93VG9vbHRpcCA9PiB7XG4gICAgICAgIHRoaXMuc2hvd1Rvb2x0aXAgPSBzaG93VG9vbHRpcFxuICAgICAgICBpZiAoIXRoaXMuc2hvd1Rvb2x0aXAgJiYgdGhpcy50b29sdGlwKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93UHJvdmlkZXJOYW1lJywgc2hvd1Byb3ZpZGVyTmFtZSA9PiB7XG4gICAgICAgIHRoaXMuc2hvd1Byb3ZpZGVyTmFtZSA9IHNob3dQcm92aWRlck5hbWVcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd0RlY29yYXRpb25zJywgc2hvd0RlY29yYXRpb25zID0+IHtcbiAgICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLnNob3dEZWNvcmF0aW9ucyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgdGhpcy5zaG93RGVjb3JhdGlvbnMgPSBzaG93RGVjb3JhdGlvbnNcbiAgICAgICAgaWYgKG5vdEluaXRpYWwpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuZ3V0dGVyUG9zaXRpb24nLCBndXR0ZXJQb3NpdGlvbiA9PiB7XG4gICAgICAgIGNvbnN0IG5vdEluaXRpYWwgPSB0eXBlb2YgdGhpcy5ndXR0ZXJQb3NpdGlvbiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgdGhpcy5ndXR0ZXJQb3NpdGlvbiA9IGd1dHRlclBvc2l0aW9uXG4gICAgICAgIGlmIChub3RJbml0aWFsKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVHdXR0ZXIoKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRleHRFZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgdGhpcy5kaXNwb3NlKClcbiAgICAgIH0pLFxuICAgIClcblxuICAgIGxldCB0b29sdGlwU3Vic2NyaXB0aW9uXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnRvb2x0aXBGb2xsb3dzJywgdG9vbHRpcEZvbGxvd3MgPT4ge1xuICAgICAgICB0aGlzLnRvb2x0aXBGb2xsb3dzID0gdG9vbHRpcEZvbGxvd3NcbiAgICAgICAgaWYgKHRvb2x0aXBTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICB0b29sdGlwU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgICB9XG4gICAgICAgIHRvb2x0aXBTdWJzY3JpcHRpb24gPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICAgIGlmICh0b29sdGlwRm9sbG93cyA9PT0gJ01vdXNlJyB8fCB0b29sdGlwRm9sbG93cyA9PT0gJ0JvdGgnKSB7XG4gICAgICAgICAgdG9vbHRpcFN1YnNjcmlwdGlvbi5hZGQodGhpcy5saXN0ZW5Gb3JNb3VzZU1vdmVtZW50KCkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvb2x0aXBGb2xsb3dzID09PSAnS2V5Ym9hcmQnIHx8IHRvb2x0aXBGb2xsb3dzID09PSAnQm90aCcpIHtcbiAgICAgICAgICB0b29sdGlwU3Vic2NyaXB0aW9uLmFkZCh0aGlzLmxpc3RlbkZvcktleWJvYXJkTW92ZW1lbnQoKSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZShmdW5jdGlvbigpIHtcbiAgICAgICAgdG9vbHRpcFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIH0pLFxuICAgIClcblxuICAgIGNvbnN0IGxhc3RDdXJzb3JQb3NpdGlvbnMgPSBuZXcgV2Vha01hcCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRleHRFZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoeyBjdXJzb3IsIG5ld0J1ZmZlclBvc2l0aW9uIH0pID0+IHtcbiAgICAgICAgY29uc3QgbGFzdEJ1ZmZlclBvc2l0aW9uID0gbGFzdEN1cnNvclBvc2l0aW9ucy5nZXQoY3Vyc29yKVxuICAgICAgICBpZiAoIWxhc3RCdWZmZXJQb3NpdGlvbiB8fCAhbGFzdEJ1ZmZlclBvc2l0aW9uLmlzRXF1YWwobmV3QnVmZmVyUG9zaXRpb24pKSB7XG4gICAgICAgICAgbGFzdEN1cnNvclBvc2l0aW9ucy5zZXQoY3Vyc29yLCBuZXdCdWZmZXJQb3NpdGlvbilcbiAgICAgICAgICB0aGlzLmlnbm9yZVRvb2x0aXBJbnZvY2F0aW9uID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50b29sdGlwRm9sbG93cyA9PT0gJ01vdXNlJykge1xuICAgICAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGV4dEVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZENoYW5nZVRleHQoKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJzb3JzID0gdGV4dEVkaXRvci5nZXRDdXJzb3JzKClcbiAgICAgICAgY3Vyc29ycy5mb3JFYWNoKGN1cnNvciA9PiB7XG4gICAgICAgICAgbGFzdEN1cnNvclBvc2l0aW9ucy5zZXQoY3Vyc29yLCBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHRoaXMudG9vbHRpcEZvbGxvd3MgIT09ICdNb3VzZScpIHtcbiAgICAgICAgICB0aGlzLmlnbm9yZVRvb2x0aXBJbnZvY2F0aW9uID0gdHJ1ZVxuICAgICAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgdGhpcy5saXN0ZW5Gb3JDdXJyZW50TGluZSgpXG4gIH1cbiAgbGlzdGVuRm9yQ3VycmVudExpbmUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMudGV4dEVkaXRvci5vYnNlcnZlQ3Vyc29ycyhjdXJzb3IgPT4ge1xuICAgICAgICBsZXQgbWFya2VyXG4gICAgICAgIGxldCBsYXN0UmFuZ2VcbiAgICAgICAgbGV0IGxhc3RFbXB0eVxuICAgICAgICBjb25zdCBoYW5kbGVQb3NpdGlvbkNoYW5nZSA9ICh7IHN0YXJ0LCBlbmQgfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGd1dHRlciA9IHRoaXMuZ3V0dGVyXG4gICAgICAgICAgaWYgKCFndXR0ZXIgfHwgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2VkKSByZXR1cm5cbiAgICAgICAgICAvLyBXZSBuZWVkIHRoYXQgUmFuZ2UuZnJvbU9iamVjdCBoYWNrIGJlbG93IGJlY2F1c2Ugd2hlbiB3ZSBmb2N1cyBpbmRleCAwIG9uIG11bHRpLWxpbmUgc2VsZWN0aW9uXG4gICAgICAgICAgLy8gZW5kLmNvbHVtbiBpcyB0aGUgY29sdW1uIG9mIHRoZSBsYXN0IGxpbmUgYnV0IG1ha2luZyBhIHJhbmdlIG91dCBvZiB0d28gYW5kIHRoZW4gYWNjZXNpbmdcbiAgICAgICAgICAvLyB0aGUgZW5kIHNlZW1zIHRvIGZpeCBpdCAoYmxhY2sgbWFnaWM/KVxuICAgICAgICAgIGNvbnN0IGN1cnJlbnRSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW3N0YXJ0LCBlbmRdKVxuICAgICAgICAgIGNvbnN0IGxpbmVzUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbc3RhcnQucm93LCAwXSwgW2VuZC5yb3csIEluZmluaXR5XV0pXG4gICAgICAgICAgY29uc3QgY3VycmVudEVtcHR5ID0gY3VycmVudFJhbmdlLmlzRW1wdHkoKVxuXG4gICAgICAgICAgLy8gTk9URTogQXRvbSBkb2VzIG5vdCBwYWludCBndXR0ZXIgaWYgbXVsdGktbGluZSBhbmQgbGFzdCBsaW5lIGhhcyB6ZXJvIGluZGV4XG4gICAgICAgICAgaWYgKHN0YXJ0LnJvdyAhPT0gZW5kLnJvdyAmJiBjdXJyZW50UmFuZ2UuZW5kLmNvbHVtbiA9PT0gMCkge1xuICAgICAgICAgICAgbGluZXNSYW5nZS5lbmQucm93LS1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGxhc3RSYW5nZSAmJiBsYXN0UmFuZ2UuaXNFcXVhbChsaW5lc1JhbmdlKSAmJiBjdXJyZW50RW1wdHkgPT09IGxhc3RFbXB0eSkgcmV0dXJuXG4gICAgICAgICAgaWYgKG1hcmtlcikgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgICAgIGxhc3RSYW5nZSA9IGxpbmVzUmFuZ2VcbiAgICAgICAgICBsYXN0RW1wdHkgPSBjdXJyZW50RW1wdHlcblxuICAgICAgICAgIG1hcmtlciA9IHRoaXMudGV4dEVkaXRvci5tYXJrU2NyZWVuUmFuZ2UobGluZXNSYW5nZSwge1xuICAgICAgICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgICBpdGVtLmNsYXNzTmFtZSA9IGBsaW5lLW51bWJlciBjdXJzb3ItbGluZSBsaW50ZXItY3Vyc29yLWxpbmUgJHtjdXJyZW50RW1wdHkgPyAnY3Vyc29yLWxpbmUtbm8tc2VsZWN0aW9uJyA6ICcnfWBcbiAgICAgICAgICBndXR0ZXIuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgY2xhc3M6ICdsaW50ZXItcm93JyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3Vyc29yTWFya2VyID0gY3Vyc29yLmdldE1hcmtlcigpXG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICAgIGN1cnNvck1hcmtlci5vbkRpZENoYW5nZSgoeyBuZXdIZWFkU2NyZWVuUG9zaXRpb24sIG5ld1RhaWxTY3JlZW5Qb3NpdGlvbiB9KSA9PiB7XG4gICAgICAgICAgICBoYW5kbGVQb3NpdGlvbkNoYW5nZSh7XG4gICAgICAgICAgICAgIHN0YXJ0OiBuZXdIZWFkU2NyZWVuUG9zaXRpb24sXG4gICAgICAgICAgICAgIGVuZDogbmV3VGFpbFNjcmVlblBvc2l0aW9uLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgICBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgICBjdXJzb3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUoc3Vic2NyaXB0aW9ucylcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgICAgbmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAobWFya2VyKSBtYXJrZXIuZGVzdHJveSgpXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChzdWJzY3JpcHRpb25zKVxuICAgICAgICBoYW5kbGVQb3NpdGlvbkNoYW5nZShjdXJzb3JNYXJrZXIuZ2V0U2NyZWVuUmFuZ2UoKSlcbiAgICAgIH0pLFxuICAgIClcbiAgfVxuICBsaXN0ZW5Gb3JNb3VzZU1vdmVtZW50KCkge1xuICAgIGNvbnN0IGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy50ZXh0RWRpdG9yKVxuXG4gICAgcmV0dXJuIGRpc3Bvc2FibGVFdmVudChcbiAgICAgIGVkaXRvckVsZW1lbnQsXG4gICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgIGRlYm91bmNlKFxuICAgICAgICBldmVudCA9PiB7XG4gICAgICAgICAgaWYgKCFlZGl0b3JFbGVtZW50LmNvbXBvbmVudCB8fCB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZWQgfHwgIWhhc1BhcmVudChldmVudC50YXJnZXQsICdkaXYuc2Nyb2xsLXZpZXcnKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHRvb2x0aXAgPSB0aGlzLnRvb2x0aXBcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0b29sdGlwICYmXG4gICAgICAgICAgICBtb3VzZUV2ZW50TmVhclBvc2l0aW9uKHtcbiAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgIGVkaXRvcjogdGhpcy50ZXh0RWRpdG9yLFxuICAgICAgICAgICAgICBlZGl0b3JFbGVtZW50LFxuICAgICAgICAgICAgICB0b29sdGlwRWxlbWVudDogdG9vbHRpcC5lbGVtZW50LFxuICAgICAgICAgICAgICBzY3JlZW5Qb3NpdGlvbjogdG9vbHRpcC5tYXJrZXIuZ2V0U3RhcnRTY3JlZW5Qb3NpdGlvbigpLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBnZXRCdWZmZXJQb3NpdGlvbkZyb21Nb3VzZUV2ZW50KGV2ZW50LCB0aGlzLnRleHRFZGl0b3IsIGVkaXRvckVsZW1lbnQpXG4gICAgICAgICAgdGhpcy5pZ25vcmVUb29sdGlwSW52b2NhdGlvbiA9IGZhbHNlXG4gICAgICAgICAgaWYgKHRoaXMudGV4dEVkaXRvci5sYXJnZUZpbGVNb2RlKSB7XG4gICAgICAgICAgICAvLyBOT1RFOiBJZ25vcmUgaWYgZmlsZSBpcyB0b28gbGFyZ2VcbiAgICAgICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBudWxsXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmN1cnNvclBvc2l0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRvb2x0aXAodGhpcy5jdXJzb3JQb3NpdGlvbilcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIDMwMCxcbiAgICAgICAgdHJ1ZSxcbiAgICAgICksXG4gICAgKVxuICB9XG4gIGxpc3RlbkZvcktleWJvYXJkTW92ZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKFxuICAgICAgZGVib3VuY2UoKHsgbmV3QnVmZmVyUG9zaXRpb24gfSkgPT4ge1xuICAgICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gbmV3QnVmZmVyUG9zaXRpb25cbiAgICAgICAgdGhpcy51cGRhdGVUb29sdGlwKG5ld0J1ZmZlclBvc2l0aW9uKVxuICAgICAgfSwgMTYpLFxuICAgIClcbiAgfVxuICB1cGRhdGVHdXR0ZXIoKSB7XG4gICAgdGhpcy5yZW1vdmVHdXR0ZXIoKVxuICAgIGlmICghdGhpcy5zaG93RGVjb3JhdGlvbnMpIHtcbiAgICAgIHRoaXMuZ3V0dGVyID0gbnVsbFxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHByaW9yaXR5ID0gdGhpcy5ndXR0ZXJQb3NpdGlvbiA9PT0gJ0xlZnQnID8gLTEwMCA6IDEwMFxuICAgIHRoaXMuZ3V0dGVyID0gdGhpcy50ZXh0RWRpdG9yLmFkZEd1dHRlcih7XG4gICAgICBuYW1lOiAnbGludGVyLXVpLWRlZmF1bHQnLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSlcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaCgobWFya2VyLCBtZXNzYWdlKSA9PiB7XG4gICAgICB0aGlzLmRlY29yYXRlTWFya2VyKG1lc3NhZ2UsIG1hcmtlciwgJ2d1dHRlcicpXG4gICAgfSlcbiAgfVxuICByZW1vdmVHdXR0ZXIoKSB7XG4gICAgaWYgKHRoaXMuZ3V0dGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmd1dHRlci5kZXN0cm95KClcbiAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgLyogVGhpcyB0aHJvd3Mgd2hlbiB0aGUgdGV4dCBlZGl0b3IgaXMgZGlzcG9zZWQgKi9cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdXBkYXRlVG9vbHRpcChwb3NpdGlvbjogP1BvaW50KSB7XG4gICAgaWYgKCFwb3NpdGlvbiB8fCAodGhpcy50b29sdGlwICYmIHRoaXMudG9vbHRpcC5pc1ZhbGlkKHBvc2l0aW9uLCB0aGlzLm1lc3NhZ2VzKSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKVxuICAgIGlmICghdGhpcy5zaG93VG9vbHRpcCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLmlnbm9yZVRvb2x0aXBJbnZvY2F0aW9uKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQodGhpcy5tZXNzYWdlcywgdGhpcy50ZXh0RWRpdG9yLmdldFBhdGgoKSwgcG9zaXRpb24pXG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcCA9IG5ldyBUb29sdGlwKG1lc3NhZ2VzLCBwb3NpdGlvbiwgdGhpcy50ZXh0RWRpdG9yKVxuICAgIHRoaXMudG9vbHRpcC5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy50b29sdGlwID0gbnVsbFxuICAgIH0pXG4gIH1cbiAgcmVtb3ZlVG9vbHRpcCgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAubWFya2VyLmRlc3Ryb3koKVxuICAgIH1cbiAgfVxuICBhcHBseShhZGRlZDogQXJyYXk8TGludGVyTWVzc2FnZT4sIHJlbW92ZWQ6IEFycmF5PExpbnRlck1lc3NhZ2U+KSB7XG4gICAgY29uc3QgdGV4dEJ1ZmZlciA9IHRoaXMudGV4dEVkaXRvci5nZXRCdWZmZXIoKVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHJlbW92ZWQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSByZW1vdmVkW2ldXG4gICAgICBjb25zdCBtYXJrZXIgPSB0aGlzLm1hcmtlcnMuZ2V0KG1lc3NhZ2UpXG4gICAgICBpZiAobWFya2VyKSB7XG4gICAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICAgIH1cbiAgICAgIHRoaXMubWVzc2FnZXMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgICB0aGlzLm1hcmtlcnMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IGFkZGVkLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYWRkZWRbaV1cbiAgICAgIGNvbnN0IG1hcmtlclJhbmdlID0gJHJhbmdlKG1lc3NhZ2UpXG4gICAgICBpZiAoIW1hcmtlclJhbmdlKSB7XG4gICAgICAgIC8vIE9ubHkgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1hcmtlciA9IHRleHRCdWZmZXIubWFya1JhbmdlKG1hcmtlclJhbmdlLCB7XG4gICAgICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgICB9KVxuICAgICAgdGhpcy5tYXJrZXJzLnNldChtZXNzYWdlLCBtYXJrZXIpXG4gICAgICB0aGlzLm1lc3NhZ2VzLmFkZChtZXNzYWdlKVxuICAgICAgdGhpcy5kZWNvcmF0ZU1hcmtlcihtZXNzYWdlLCBtYXJrZXIpXG4gICAgICBtYXJrZXIub25EaWRDaGFuZ2UoKHsgb2xkSGVhZFBvc2l0aW9uLCBuZXdIZWFkUG9zaXRpb24sIGlzVmFsaWQgfSkgPT4ge1xuICAgICAgICBpZiAoIWlzVmFsaWQgfHwgKG5ld0hlYWRQb3NpdGlvbi5yb3cgPT09IDAgJiYgb2xkSGVhZFBvc2l0aW9uLnJvdyAhPT0gMCkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAxKSB7XG4gICAgICAgICAgbWVzc2FnZS5yYW5nZSA9IG1hcmtlci5wcmV2aW91c0V2ZW50U3RhdGUucmFuZ2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uID0gbWFya2VyLnByZXZpb3VzRXZlbnRTdGF0ZS5yYW5nZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlVG9vbHRpcCh0aGlzLmN1cnNvclBvc2l0aW9uKVxuICB9XG4gIGRlY29yYXRlTWFya2VyKG1lc3NhZ2U6IExpbnRlck1lc3NhZ2UsIG1hcmtlcjogT2JqZWN0LCBwYWludDogJ2d1dHRlcicgfCAnZWRpdG9yJyB8ICdib3RoJyA9ICdib3RoJykge1xuICAgIGlmIChwYWludCA9PT0gJ2JvdGgnIHx8IHBhaW50ID09PSAnZWRpdG9yJykge1xuICAgICAgdGhpcy50ZXh0RWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIGNsYXNzOiBgbGludGVyLWhpZ2hsaWdodCBsaW50ZXItJHttZXNzYWdlLnNldmVyaXR5fWAsXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IGd1dHRlciA9IHRoaXMuZ3V0dGVyXG4gICAgaWYgKGd1dHRlciAmJiAocGFpbnQgPT09ICdib3RoJyB8fCBwYWludCA9PT0gJ2d1dHRlcicpKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGBsaW50ZXItZ3V0dGVyIGxpbnRlci1ndXR0ZXItJHttZXNzYWdlLnNldmVyaXR5fSBpY29uIGljb24tJHttZXNzYWdlLmljb24gfHwgJ3ByaW1pdGl2ZS1kb3QnfWBcbiAgICAgIGd1dHRlci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgY2xhc3M6ICdsaW50ZXItcm93JyxcbiAgICAgICAgaXRlbTogZWxlbWVudCxcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIG9uRGlkRGVzdHJveShjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5yZW1vdmVHdXR0ZXIoKVxuICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3JcbiJdfQ==