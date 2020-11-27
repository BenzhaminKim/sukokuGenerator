(function() {
  var CompositeDisposable, Emitter, HighlightedAreaView, MarkerLayer, Range, StatusBarView, escapeRegExp, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter, MarkerLayer = ref.MarkerLayer;

  StatusBarView = require('./status-bar-view');

  escapeRegExp = require('./escape-reg-exp');

  module.exports = HighlightedAreaView = (function() {
    function HighlightedAreaView() {
      this.destroyScrollMarkers = bind(this.destroyScrollMarkers, this);
      this.setScrollMarkerView = bind(this.setScrollMarkerView, this);
      this.setupMarkerLayers = bind(this.setupMarkerLayers, this);
      this.setScrollMarker = bind(this.setScrollMarker, this);
      this.selectAll = bind(this.selectAll, this);
      this.listenForStatusBarChange = bind(this.listenForStatusBarChange, this);
      this.removeStatusBar = bind(this.removeStatusBar, this);
      this.setupStatusBar = bind(this.setupStatusBar, this);
      this.removeMarkers = bind(this.removeMarkers, this);
      this.removeAllMarkers = bind(this.removeAllMarkers, this);
      this.handleSelection = bind(this.handleSelection, this);
      this.debouncedHandleSelection = bind(this.debouncedHandleSelection, this);
      this.setStatusBar = bind(this.setStatusBar, this);
      this.enable = bind(this.enable, this);
      this.disable = bind(this.disable, this);
      this.onDidRemoveAllMarkers = bind(this.onDidRemoveAllMarkers, this);
      this.onDidAddSelectedMarkerForEditor = bind(this.onDidAddSelectedMarkerForEditor, this);
      this.onDidAddMarkerForEditor = bind(this.onDidAddMarkerForEditor, this);
      this.onDidAddSelectedMarker = bind(this.onDidAddSelectedMarker, this);
      this.onDidAddMarker = bind(this.onDidAddMarker, this);
      this.destroy = bind(this.destroy, this);
      this.emitter = new Emitter;
      this.editorToMarkerLayerMap = {};
      this.markerLayers = [];
      this.resultCount = 0;
      this.editorSubscriptions = new CompositeDisposable();
      this.editorSubscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this.setupMarkerLayers(editor);
          return _this.setScrollMarkerView(editor);
        };
      })(this)));
      this.editorSubscriptions.add(atom.workspace.onWillDestroyPaneItem((function(_this) {
        return function(item) {
          var editor;
          if (item.item.constructor.name !== 'TextEditor') {
            return;
          }
          editor = item.item;
          _this.removeMarkers(editor.id);
          delete _this.editorToMarkerLayerMap[editor.id];
          return _this.destroyScrollMarkers(editor);
        };
      })(this)));
      this.enable();
      this.listenForTimeoutChange();
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.debouncedHandleSelection();
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.subscribeToActiveTextEditor();
      this.listenForStatusBarChange();
      this.enableScrollViewObserveSubscription = atom.config.observe('highlight-selected.showResultsOnScrollBar', (function(_this) {
        return function(enabled) {
          if (enabled) {
            _this.ensureScrollViewInstalled();
            return atom.workspace.getTextEditors().forEach(_this.setScrollMarkerView);
          } else {
            return atom.workspace.getTextEditors().forEach(_this.destroyScrollMarkers);
          }
        };
      })(this));
    }

    HighlightedAreaView.prototype.destroy = function() {
      var ref1, ref2, ref3, ref4, ref5;
      clearTimeout(this.handleSelectionTimeout);
      this.activeItemSubscription.dispose();
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.enableScrollViewObserveSubscription) != null) {
        ref2.dispose();
      }
      if ((ref3 = this.editorSubscriptions) != null) {
        ref3.dispose();
      }
      if ((ref4 = this.statusBarView) != null) {
        ref4.removeElement();
      }
      if ((ref5 = this.statusBarTile) != null) {
        ref5.destroy();
      }
      return this.statusBarTile = null;
    };

    HighlightedAreaView.prototype.onDidAddMarker = function(callback) {
      var Grim;
      Grim = require('grim');
      Grim.deprecate("Please do not use. This method will be removed.");
      return this.emitter.on('did-add-marker', callback);
    };

    HighlightedAreaView.prototype.onDidAddSelectedMarker = function(callback) {
      var Grim;
      Grim = require('grim');
      Grim.deprecate("Please do not use. This method will be removed.");
      return this.emitter.on('did-add-selected-marker', callback);
    };

    HighlightedAreaView.prototype.onDidAddMarkerForEditor = function(callback) {
      return this.emitter.on('did-add-marker-for-editor', callback);
    };

    HighlightedAreaView.prototype.onDidAddSelectedMarkerForEditor = function(callback) {
      return this.emitter.on('did-add-selected-marker-for-editor', callback);
    };

    HighlightedAreaView.prototype.onDidRemoveAllMarkers = function(callback) {
      return this.emitter.on('did-remove-marker-layer', callback);
    };

    HighlightedAreaView.prototype.disable = function() {
      this.disabled = true;
      return this.removeAllMarkers();
    };

    HighlightedAreaView.prototype.enable = function() {
      this.disabled = false;
      return this.debouncedHandleSelection();
    };

    HighlightedAreaView.prototype.setStatusBar = function(statusBar) {
      this.statusBar = statusBar;
      return this.setupStatusBar();
    };

    HighlightedAreaView.prototype.debouncedHandleSelection = function() {
      clearTimeout(this.handleSelectionTimeout);
      return this.handleSelectionTimeout = setTimeout((function(_this) {
        return function() {
          return _this.handleSelection();
        };
      })(this), atom.config.get('highlight-selected.timeout'));
    };

    HighlightedAreaView.prototype.listenForTimeoutChange = function() {
      return atom.config.onDidChange('highlight-selected.timeout', (function(_this) {
        return function() {
          return _this.debouncedHandleSelection();
        };
      })(this));
    };

    HighlightedAreaView.prototype.subscribeToActiveTextEditor = function() {
      var editor, ref1;
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.selectionSubscription = new CompositeDisposable;
      this.selectionSubscription.add(editor.onDidAddSelection(this.debouncedHandleSelection));
      this.selectionSubscription.add(editor.onDidChangeSelectionRange(this.debouncedHandleSelection));
      return this.handleSelection();
    };

    HighlightedAreaView.prototype.getActiveEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightedAreaView.prototype.getActiveEditors = function() {
      return atom.workspace.getPanes().map(function(pane) {
        var activeItem;
        activeItem = pane.activeItem;
        if (activeItem && activeItem.constructor.name === 'TextEditor') {
          return activeItem;
        }
      });
    };

    HighlightedAreaView.prototype.handleSelection = function() {
      var allowedCharactersToSelect, editor, lastSelection, nonWordCharacters, nonWordCharactersToStrip, originalEditor, ref1, regex, regexFlags, regexForWholeWord, regexSearch, text;
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.removeAllMarkers();
      if (this.disabled) {
        return;
      }
      if (editor.getLastSelection().isEmpty()) {
        return;
      }
      this.selections = editor.getSelections();
      lastSelection = editor.getLastSelection();
      text = lastSelection.getText();
      if (text.length < atom.config.get('highlight-selected.minimumLength')) {
        return;
      }
      regex = new RegExp("\\n");
      if (regex.exec(text)) {
        return;
      }
      regexFlags = 'g';
      if (atom.config.get('highlight-selected.ignoreCase')) {
        regexFlags = 'gi';
      }
      regexSearch = escapeRegExp(text);
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        if (!this.isWordSelected(lastSelection)) {
          return;
        }
        nonWordCharacters = atom.config.get('editor.nonWordCharacters');
        allowedCharactersToSelect = atom.config.get('highlight-selected.allowedCharactersToSelect');
        nonWordCharactersToStrip = nonWordCharacters.replace(new RegExp("[" + allowedCharactersToSelect + "]", 'g'), '');
        regexForWholeWord = new RegExp("[ \\t" + (escapeRegExp(nonWordCharactersToStrip)) + "]", regexFlags);
        if (regexForWholeWord.test(text)) {
          return;
        }
        regexSearch = ("(?:[ \\t" + (escapeRegExp(nonWordCharacters)) + "]|^)(") + regexSearch + (")(?:[ \\t" + (escapeRegExp(nonWordCharacters)) + "]|$)");
      }
      this.resultCount = 0;
      if (atom.config.get('highlight-selected.highlightInPanes')) {
        originalEditor = editor;
        this.getActiveEditors().forEach((function(_this) {
          return function(editor) {
            return _this.highlightSelectionInEditor(editor, regexSearch, regexFlags, originalEditor);
          };
        })(this));
      } else {
        this.highlightSelectionInEditor(editor, regexSearch, regexFlags);
      }
      return (ref1 = this.statusBarElement) != null ? ref1.updateCount(this.resultCount) : void 0;
    };

    HighlightedAreaView.prototype.highlightSelectionInEditor = function(editor, regexSearch, regexFlags, originalEditor) {
      var markerLayer, markerLayerForHiddenMarkers, markerLayers;
      if (editor == null) {
        return;
      }
      markerLayers = this.editorToMarkerLayerMap[editor.id];
      if (markerLayers == null) {
        return;
      }
      markerLayer = markerLayers['visibleMarkerLayer'];
      markerLayerForHiddenMarkers = markerLayers['selectedMarkerLayer'];
      editor.scan(new RegExp(regexSearch, regexFlags), (function(_this) {
        return function(result) {
          var marker, newResult;
          newResult = result;
          if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
            editor.scanInBufferRange(new RegExp(escapeRegExp(result.match[1])), result.range, function(e) {
              return newResult = e;
            });
          }
          if (newResult == null) {
            return;
          }
          _this.resultCount += 1;
          if (_this.showHighlightOnSelectedWord(newResult.range, _this.selections) && (originalEditor != null ? originalEditor.id : void 0) === editor.id) {
            marker = markerLayerForHiddenMarkers.markBufferRange(newResult.range);
            _this.emitter.emit('did-add-selected-marker', marker);
            return _this.emitter.emit('did-add-selected-marker-for-editor', {
              marker: marker,
              editor: editor
            });
          } else {
            marker = markerLayer.markBufferRange(newResult.range);
            _this.emitter.emit('did-add-marker', marker);
            return _this.emitter.emit('did-add-marker-for-editor', {
              marker: marker,
              editor: editor
            });
          }
        };
      })(this));
      return editor.decorateMarkerLayer(markerLayer, {
        type: 'highlight',
        "class": this.makeClasses()
      });
    };

    HighlightedAreaView.prototype.makeClasses = function() {
      var className;
      className = 'highlight-selected';
      if (atom.config.get('highlight-selected.lightTheme')) {
        className += ' light-theme';
      }
      if (atom.config.get('highlight-selected.highlightBackground')) {
        className += ' background';
      }
      return className;
    };

    HighlightedAreaView.prototype.showHighlightOnSelectedWord = function(range, selections) {
      var i, len, outcome, selection, selectionRange;
      if (!atom.config.get('highlight-selected.hideHighlightOnSelectedWord')) {
        return false;
      }
      outcome = false;
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        selectionRange = selection.getBufferRange();
        outcome = (range.start.column === selectionRange.start.column) && (range.start.row === selectionRange.start.row) && (range.end.column === selectionRange.end.column) && (range.end.row === selectionRange.end.row);
        if (outcome) {
          break;
        }
      }
      return outcome;
    };

    HighlightedAreaView.prototype.removeAllMarkers = function() {
      return Object.keys(this.editorToMarkerLayerMap).forEach(this.removeMarkers);
    };

    HighlightedAreaView.prototype.removeMarkers = function(editorId) {
      var markerLayer, ref1, selectedMarkerLayer;
      if (this.editorToMarkerLayerMap[editorId] == null) {
        return;
      }
      markerLayer = this.editorToMarkerLayerMap[editorId]['visibleMarkerLayer'];
      selectedMarkerLayer = this.editorToMarkerLayerMap[editorId]['selectedMarkerLayer'];
      markerLayer.clear();
      selectedMarkerLayer.clear();
      if ((ref1 = this.statusBarElement) != null) {
        ref1.updateCount(0);
      }
      return this.emitter.emit('did-remove-marker-layer');
    };

    HighlightedAreaView.prototype.isWordSelected = function(selection) {
      var lineRange, nonWordCharacterToTheLeft, nonWordCharacterToTheRight, selectionRange;
      if (selection.getBufferRange().isSingleLine()) {
        selectionRange = selection.getBufferRange();
        lineRange = this.getActiveEditor().bufferRangeForBufferRow(selectionRange.start.row);
        nonWordCharacterToTheLeft = selectionRange.start.isEqual(lineRange.start) || this.isNonWordCharacterToTheLeft(selection);
        nonWordCharacterToTheRight = selectionRange.end.isEqual(lineRange.end) || this.isNonWordCharacterToTheRight(selection);
        return nonWordCharacterToTheLeft && nonWordCharacterToTheRight;
      } else {
        return false;
      }
    };

    HighlightedAreaView.prototype.isNonWordCharacter = function(character) {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp("[ \t" + (escapeRegExp(nonWordCharacters)) + "]").test(character);
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheLeft = function(selection) {
      var range, selectionStart;
      selectionStart = selection.getBufferRange().start;
      range = Range.fromPointWithDelta(selectionStart, 0, -1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheRight = function(selection) {
      var range, selectionEnd;
      selectionEnd = selection.getBufferRange().end;
      range = Range.fromPointWithDelta(selectionEnd, 0, 1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.setupStatusBar = function() {
      if (this.statusBarElement != null) {
        return;
      }
      if (!atom.config.get('highlight-selected.showInStatusBar')) {
        return;
      }
      this.statusBarElement = new StatusBarView();
      return this.statusBarTile = this.statusBar.addLeftTile({
        item: this.statusBarElement.getElement(),
        priority: 100
      });
    };

    HighlightedAreaView.prototype.removeStatusBar = function() {
      var ref1;
      if (this.statusBarElement == null) {
        return;
      }
      if ((ref1 = this.statusBarTile) != null) {
        ref1.destroy();
      }
      this.statusBarTile = null;
      return this.statusBarElement = null;
    };

    HighlightedAreaView.prototype.listenForStatusBarChange = function() {
      return atom.config.onDidChange('highlight-selected.showInStatusBar', (function(_this) {
        return function(changed) {
          if (changed.newValue) {
            return _this.setupStatusBar();
          } else {
            return _this.removeStatusBar();
          }
        };
      })(this));
    };

    HighlightedAreaView.prototype.selectAll = function() {
      var editor, i, j, len, len1, marker, markerLayer, markerLayers, ranges, ref1, ref2;
      editor = this.getActiveEditor();
      markerLayers = this.editorToMarkerLayerMap[editor.id];
      if (markerLayers == null) {
        return;
      }
      ranges = [];
      ref1 = [markerLayers['visibleMarkerLayer'], markerLayers['selectedMarkerLayer']];
      for (i = 0, len = ref1.length; i < len; i++) {
        markerLayer = ref1[i];
        ref2 = markerLayer.getMarkers();
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          marker = ref2[j];
          ranges.push(marker.getBufferRange());
        }
      }
      if (ranges.length > 0) {
        return editor.setSelectedBufferRanges(ranges, {
          flash: true
        });
      }
    };

    HighlightedAreaView.prototype.setScrollMarker = function(scrollMarkerAPI) {
      this.scrollMarker = scrollMarkerAPI;
      if (atom.config.get('highlight-selected.showResultsOnScrollBar')) {
        this.ensureScrollViewInstalled();
        return atom.workspace.getTextEditors().forEach(this.setScrollMarkerView);
      }
    };

    HighlightedAreaView.prototype.ensureScrollViewInstalled = function() {
      if (!atom.inSpecMode()) {
        return require('atom-package-deps').install('highlight-selected', true);
      }
    };

    HighlightedAreaView.prototype.setupMarkerLayers = function(editor) {
      var markerLayer, markerLayerForHiddenMarkers;
      if (this.editorToMarkerLayerMap[editor.id] != null) {
        markerLayer = this.editorToMarkerLayerMap[editor.id]['visibleMarkerLayer'];
        return markerLayerForHiddenMarkers = this.editorToMarkerLayerMap[editor.id]['selectedMarkerLayer'];
      } else {
        markerLayer = editor.addMarkerLayer();
        markerLayerForHiddenMarkers = editor.addMarkerLayer();
        return this.editorToMarkerLayerMap[editor.id] = {
          visibleMarkerLayer: markerLayer,
          selectedMarkerLayer: markerLayerForHiddenMarkers
        };
      }
    };

    HighlightedAreaView.prototype.setScrollMarkerView = function(editor) {
      var markerLayer, scrollMarkerView, selectedMarkerLayer;
      if (!atom.config.get('highlight-selected.showResultsOnScrollBar')) {
        return;
      }
      if (this.scrollMarker == null) {
        return;
      }
      scrollMarkerView = this.scrollMarker.scrollMarkerViewForEditor(editor);
      markerLayer = this.editorToMarkerLayerMap[editor.id]['visibleMarkerLayer'];
      selectedMarkerLayer = this.editorToMarkerLayerMap[editor.id]['selectedMarkerLayer'];
      scrollMarkerView.getLayer("highlight-selected-marker-layer").syncToMarkerLayer(markerLayer);
      return scrollMarkerView.getLayer("highlight-selected-selected-marker-layer").syncToMarkerLayer(selectedMarkerLayer);
    };

    HighlightedAreaView.prototype.destroyScrollMarkers = function(editor) {
      var scrollMarkerView;
      if (this.scrollMarker == null) {
        return;
      }
      scrollMarkerView = this.scrollMarker.scrollMarkerViewForEditor(editor);
      return scrollMarkerView.destroy();
    };

    return HighlightedAreaView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1zZWxlY3RlZC9saWIvaGlnaGxpZ2h0ZWQtYXJlYS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsdUdBQUE7SUFBQTs7RUFBQSxNQUFxRCxPQUFBLENBQVEsTUFBUixDQUFyRCxFQUFDLGlCQUFELEVBQVEsNkNBQVIsRUFBNkIscUJBQTdCLEVBQXNDOztFQUN0QyxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUjs7RUFDaEIsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUjs7RUFFZixNQUFNLENBQUMsT0FBUCxHQUNNO0lBRVMsNkJBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFDZixJQUFDLENBQUEsc0JBQUQsR0FBMEI7TUFDMUIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUVmLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJLG1CQUFKLENBQUE7TUFDdkIsSUFBQyxDQUFBLG1CQUFtQixDQUFDLEdBQXJCLENBQXlCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7VUFDekQsS0FBQyxDQUFBLGlCQUFELENBQW1CLE1BQW5CO2lCQUNBLEtBQUMsQ0FBQSxtQkFBRCxDQUFxQixNQUFyQjtRQUZ5RDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBekI7TUFLQSxJQUFDLENBQUEsbUJBQW1CLENBQUMsR0FBckIsQ0FBeUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBZixDQUFxQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtBQUM1RCxjQUFBO1VBQUEsSUFBYyxJQUFJLENBQUMsSUFBSSxDQUFDLFdB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QUFDLE9BQWpCLENBQUE7SUFKb0I7Ozs7O0FBaFZ4QiIsInNvdXJjZXNDb250ZW50IjpbIntSYW5nZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciwgTWFya2VyTGF5ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcblN0YXR1c0JhclZpZXcgPSByZXF1aXJlICcuL3N0YXR1cy1iYXItdmlldydcbmVzY2FwZVJlZ0V4cCA9IHJlcXVpcmUgJy4vZXNjYXBlLXJlZy1leHAnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEhpZ2hsaWdodGVkQXJlYVZpZXdcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQGVkaXRvclRvTWFya2VyTGF5ZXJNYXAgPSB7fVxuICAgIEBtYXJrZXJMYXllcnMgPSBbXVxuICAgIEByZXN1bHRDb3VudCA9IDBcblxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT5cbiAgICAgIEBzZXR1cE1hcmtlckxheWVycyhlZGl0b3IpXG4gICAgICBAc2V0U2Nyb2xsTWFya2VyVmlldyhlZGl0b3IpXG4gICAgKSlcblxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vbldpbGxEZXN0cm95UGFuZUl0ZW0oKGl0ZW0pID0+XG4gICAgICByZXR1cm4gdW5sZXNzIGl0ZW0uaXRlbS5jb25zdHJ1Y3Rvci5uYW1lID09ICdUZXh0RWRpdG9yJ1xuICAgICAgZWRpdG9yID0gaXRlbS5pdGVtXG4gICAgICBAcmVtb3ZlTWFya2VycyhlZGl0b3IuaWQpXG4gICAgICBkZWxldGUgQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXVxuICAgICAgQGRlc3Ryb3lTY3JvbGxNYXJrZXJzKGVkaXRvcilcbiAgICApKVxuXG4gICAgQGVuYWJsZSgpXG4gICAgQGxpc3RlbkZvclRpbWVvdXRDaGFuZ2UoKVxuICAgIEBhY3RpdmVJdGVtU3Vic2NyaXB0aW9uID0gYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSA9PlxuICAgICAgQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvbigpXG4gICAgICBAc3Vic2NyaWJlVG9BY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAc3Vic2NyaWJlVG9BY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAbGlzdGVuRm9yU3RhdHVzQmFyQ2hhbmdlKClcblxuICAgIEBlbmFibGVTY3JvbGxWaWV3T2JzZXJ2ZVN1YnNjcmlwdGlvbiA9XG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICdoaWdobGlnaHQtc2VsZWN0ZWQuc2hvd1Jlc3VsdHNPblNjcm9sbEJhcicsIChlbmFibGVkKSA9PlxuICAgICAgICBpZiBlbmFibGVkXG4gICAgICAgICAgQGVuc3VyZVNjcm9sbFZpZXdJbnN0YWxsZWQoKVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaChAc2V0U2Nyb2xsTWFya2VyVmlldylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaChAZGVzdHJveVNjcm9sbE1hcmtlcnMpXG5cbiAgZGVzdHJveTogPT5cbiAgICBjbGVhclRpbWVvdXQoQGhhbmRsZVNlbGVjdGlvblRpbWVvdXQpXG4gICAgQGFjdGl2ZUl0ZW1TdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQGVuYWJsZVNjcm9sbFZpZXdPYnNlcnZlU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQHN0YXR1c0JhclZpZXc/LnJlbW92ZUVsZW1lbnQoKVxuICAgIEBzdGF0dXNCYXJUaWxlPy5kZXN0cm95KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9IG51bGxcblxuICBvbkRpZEFkZE1hcmtlcjogKGNhbGxiYWNrKSA9PlxuICAgIEdyaW0gPSByZXF1aXJlICdncmltJ1xuICAgIEdyaW0uZGVwcmVjYXRlKFwiUGxlYXNlIGRvIG5vdCB1c2UuIFRoaXMgbWV0aG9kIHdpbGwgYmUgcmVtb3ZlZC5cIilcbiAgICBAZW1pdHRlci5vbiAnZGlkLWFkZC1tYXJrZXInLCBjYWxsYmFja1xuXG4gIG9uRGlkQWRkU2VsZWN0ZWRNYXJrZXI6IChjYWxsYmFjaykgPT5cbiAgICBHcmltID0gcmVxdWlyZSAnZ3JpbSdcbiAgICBHcmltLmRlcHJlY2F0ZShcIlBsZWFzZSBkbyBub3QgdXNlLiBUaGlzIG1ldGhvZCB3aWxsIGJlIHJlbW92ZWQuXCIpXG4gICAgQGVtaXR0ZXIub24gJ2RpZC1hZGQtc2VsZWN0ZWQtbWFya2VyJywgY2FsbGJhY2tcblxuICBvbkRpZEFkZE1hcmtlckZvckVkaXRvcjogKGNhbGxiYWNrKSA9PlxuICAgIEBlbWl0dGVyLm9uICdkaWQtYWRkLW1hcmtlci1mb3ItZWRpdG9yJywgY2FsbGJhY2tcblxuICBvbkRpZEFkZFNlbGVjdGVkTWFya2VyRm9yRWRpdG9yOiAoY2FsbGJhY2spID0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1hZGQtc2VsZWN0ZWQtbWFya2VyLWZvci1lZGl0b3InLCBjYWxsYmFja1xuXG4gIG9uRGlkUmVtb3ZlQWxsTWFya2VyczogKGNhbGxiYWNrKSA9PlxuICAgIEBlbWl0dGVyLm9uICdkaWQtcmVtb3ZlLW1hcmtlci1sYXllcicsIGNhbGxiYWNrXG5cbiAgZGlzYWJsZTogPT5cbiAgICBAZGlzYWJsZWQgPSB0cnVlXG4gICAgQHJlbW92ZUFsbE1hcmtlcnMoKVxuXG4gIGVuYWJsZTogPT5cbiAgICBAZGlzYWJsZWQgPSBmYWxzZVxuICAgIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb24oKVxuXG4gIHNldFN0YXR1c0JhcjogKHN0YXR1c0JhcikgPT5cbiAgICBAc3RhdHVzQmFyID0gc3RhdHVzQmFyXG4gICAgQHNldHVwU3RhdHVzQmFyKClcblxuICBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb246ID0+XG4gICAgY2xlYXJUaW1lb3V0KEBoYW5kbGVTZWxlY3Rpb25UaW1lb3V0KVxuICAgIEBoYW5kbGVTZWxlY3Rpb25UaW1lb3V0ID0gc2V0VGltZW91dCA9PlxuICAgICAgQGhhbmRsZVNlbGVjdGlvbigpXG4gICAgLCBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC50aW1lb3V0JylcblxuICBsaXN0ZW5Gb3JUaW1lb3V0Q2hhbmdlOiAtPlxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdoaWdobGlnaHQtc2VsZWN0ZWQudGltZW91dCcsID0+XG4gICAgICBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uKClcblxuICBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3I6IC0+XG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG5cbiAgICBlZGl0b3IgPSBAZ2V0QWN0aXZlRWRpdG9yKClcbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvclxuXG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uLmFkZChcbiAgICAgIGVkaXRvci5vbkRpZEFkZFNlbGVjdGlvbiBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uXG4gICAgKVxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24uYWRkKFxuICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UgQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvblxuICAgIClcbiAgICBAaGFuZGxlU2VsZWN0aW9uKClcblxuICBnZXRBY3RpdmVFZGl0b3I6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgZ2V0QWN0aXZlRWRpdG9yczogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpLm1hcCAocGFuZSkgLT5cbiAgICAgIGFjdGl2ZUl0ZW0gPSBwYW5lLmFjdGl2ZUl0ZW1cbiAgICAgIGFjdGl2ZUl0ZW0gaWYgYWN0aXZlSXRlbSBhbmQgYWN0aXZlSXRlbS5jb25zdHJ1Y3Rvci5uYW1lID09ICdUZXh0RWRpdG9yJ1xuXG4gIGhhbmRsZVNlbGVjdGlvbjogPT5cbiAgICBlZGl0b3IgPSBAZ2V0QWN0aXZlRWRpdG9yKClcbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvclxuXG4gICAgQHJlbW92ZUFsbE1hcmtlcnMoKVxuXG4gICAgcmV0dXJuIGlmIEBkaXNhYmxlZFxuICAgIHJldHVybiBpZiBlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmlzRW1wdHkoKVxuXG4gICAgQHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgbGFzdFNlbGVjdGlvbiA9IGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKClcbiAgICB0ZXh0ID0gbGFzdFNlbGVjdGlvbi5nZXRUZXh0KClcblxuICAgIHJldHVybiBpZiB0ZXh0Lmxlbmd0aCA8IGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLm1pbmltdW1MZW5ndGgnKVxuICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIlxcXFxuXCIpXG4gICAgcmV0dXJuIGlmIHJlZ2V4LmV4ZWModGV4dClcblxuICAgIHJlZ2V4RmxhZ3MgPSAnZydcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5pZ25vcmVDYXNlJylcbiAgICAgIHJlZ2V4RmxhZ3MgPSAnZ2knXG5cbiAgICByZWdleFNlYXJjaCA9IGVzY2FwZVJlZ0V4cCh0ZXh0KVxuXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQub25seUhpZ2hsaWdodFdob2xlV29yZHMnKVxuICAgICAgcmV0dXJuIHVubGVzcyBAaXNXb3JkU2VsZWN0ZWQobGFzdFNlbGVjdGlvbilcbiAgICAgIG5vbldvcmRDaGFyYWN0ZXJzID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Iubm9uV29yZENoYXJhY3RlcnMnKVxuICAgICAgYWxsb3dlZENoYXJhY3RlcnNUb1NlbGVjdCA9IGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmFsbG93ZWRDaGFyYWN0ZXJzVG9TZWxlY3QnKVxuICAgICAgbm9uV29yZENoYXJhY3RlcnNUb1N0cmlwID0gbm9uV29yZENoYXJhY3RlcnMucmVwbGFjZShcbiAgICAgICAgbmV3IFJlZ0V4cChcIlsje2FsbG93ZWRDaGFyYWN0ZXJzVG9TZWxlY3R9XVwiLCAnZycpLCAnJylcbiAgICAgIHJlZ2V4Rm9yV2hvbGVXb3JkID0gbmV3IFJlZ0V4cChcIlsgXFxcXHQje2VzY2FwZVJlZ0V4cChub25Xb3JkQ2hhcmFjdGVyc1RvU3RyaXApfV1cIiwgcmVnZXhGbGFncylcbiAgICAgIHJldHVybiBpZiByZWdleEZvcldob2xlV29yZC50ZXN0KHRleHQpXG4gICAgICByZWdleFNlYXJjaCA9XG4gICAgICAgIFwiKD86WyBcXFxcdCN7ZXNjYXBlUmVnRXhwKG5vbldvcmRDaGFyYWN0ZXJzKX1dfF4pKFwiICtcbiAgICAgICAgcmVnZXhTZWFyY2ggK1xuICAgICAgICBcIikoPzpbIFxcXFx0I3tlc2NhcGVSZWdFeHAobm9uV29yZENoYXJhY3RlcnMpfV18JClcIlxuXG4gICAgQHJlc3VsdENvdW50ID0gMFxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmhpZ2hsaWdodEluUGFuZXMnKVxuICAgICAgb3JpZ2luYWxFZGl0b3IgPSBlZGl0b3JcbiAgICAgIEBnZXRBY3RpdmVFZGl0b3JzKCkuZm9yRWFjaCAoZWRpdG9yKSA9PlxuICAgICAgICBAaGlnaGxpZ2h0U2VsZWN0aW9uSW5FZGl0b3IoZWRpdG9yLCByZWdleFNlYXJjaCwgcmVnZXhGbGFncywgb3JpZ2luYWxFZGl0b3IpXG4gICAgZWxzZVxuICAgICAgQGhpZ2hsaWdodFNlbGVjdGlvbkluRWRpdG9yKGVkaXRvciwgcmVnZXhTZWFyY2gsIHJlZ2V4RmxhZ3MpXG5cbiAgICBAc3RhdHVzQmFyRWxlbWVudD8udXBkYXRlQ291bnQoQHJlc3VsdENvdW50KVxuXG4gIGhpZ2hsaWdodFNlbGVjdGlvbkluRWRpdG9yOiAoZWRpdG9yLCByZWdleFNlYXJjaCwgcmVnZXhGbGFncywgb3JpZ2luYWxFZGl0b3IpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG4gICAgbWFya2VyTGF5ZXJzID0gIEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF1cbiAgICByZXR1cm4gdW5sZXNzIG1hcmtlckxheWVycz9cbiAgICBtYXJrZXJMYXllciA9IG1hcmtlckxheWVyc1sndmlzaWJsZU1hcmtlckxheWVyJ11cbiAgICBtYXJrZXJMYXllckZvckhpZGRlbk1hcmtlcnMgPSBtYXJrZXJMYXllcnNbJ3NlbGVjdGVkTWFya2VyTGF5ZXInXVxuXG4gICAgZWRpdG9yLnNjYW4gbmV3IFJlZ0V4cChyZWdleFNlYXJjaCwgcmVnZXhGbGFncyksXG4gICAgICAocmVzdWx0KSA9PlxuICAgICAgICBuZXdSZXN1bHQgPSByZXN1bHRcbiAgICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQub25seUhpZ2hsaWdodFdob2xlV29yZHMnKVxuICAgICAgICAgIGVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZShcbiAgICAgICAgICAgIG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKHJlc3VsdC5tYXRjaFsxXSkpLFxuICAgICAgICAgICAgcmVzdWx0LnJhbmdlLFxuICAgICAgICAgICAgKGUpIC0+IG5ld1Jlc3VsdCA9IGVcbiAgICAgICAgICApXG5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBuZXdSZXN1bHQ/XG4gICAgICAgIEByZXN1bHRDb3VudCArPSAxXG5cbiAgICAgICAgaWYgQHNob3dIaWdobGlnaHRPblNlbGVjdGVkV29yZChuZXdSZXN1bHQucmFuZ2UsIEBzZWxlY3Rpb25zKSAmJlxuICAgICAgICAgICBvcmlnaW5hbEVkaXRvcj8uaWQgPT0gZWRpdG9yLmlkXG4gICAgICAgICAgbWFya2VyID0gbWFya2VyTGF5ZXJGb3JIaWRkZW5NYXJrZXJzLm1hcmtCdWZmZXJSYW5nZShuZXdSZXN1bHQucmFuZ2UpXG4gICAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1zZWxlY3RlZC1tYXJrZXInLCBtYXJrZXJcbiAgICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLXNlbGVjdGVkLW1hcmtlci1mb3ItZWRpdG9yJyxcbiAgICAgICAgICAgIG1hcmtlcjogbWFya2VyXG4gICAgICAgICAgICBlZGl0b3I6IGVkaXRvclxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWFya2VyID0gbWFya2VyTGF5ZXIubWFya0J1ZmZlclJhbmdlKG5ld1Jlc3VsdC5yYW5nZSlcbiAgICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLW1hcmtlcicsIG1hcmtlclxuICAgICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1hZGQtbWFya2VyLWZvci1lZGl0b3InLFxuICAgICAgICAgICAgbWFya2VyOiBtYXJrZXJcbiAgICAgICAgICAgIGVkaXRvcjogZWRpdG9yXG4gICAgZWRpdG9yLmRlY29yYXRlTWFya2VyTGF5ZXIobWFya2VyTGF5ZXIsIHtcbiAgICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgICAgY2xhc3M6IEBtYWtlQ2xhc3NlcygpXG4gICAgfSlcblxuICBtYWtlQ2xhc3NlczogLT5cbiAgICBjbGFzc05hbWUgPSAnaGlnaGxpZ2h0LXNlbGVjdGVkJ1xuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmxpZ2h0VGhlbWUnKVxuICAgICAgY2xhc3NOYW1lICs9ICcgbGlnaHQtdGhlbWUnXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5oaWdobGlnaHRCYWNrZ3JvdW5kJylcbiAgICAgIGNsYXNzTmFtZSArPSAnIGJhY2tncm91bmQnXG4gICAgY2xhc3NOYW1lXG5cbiAgc2hvd0hpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkOiAocmFuZ2UsIHNlbGVjdGlvbnMpIC0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAnaGlnaGxpZ2h0LXNlbGVjdGVkLmhpZGVIaWdobGlnaHRPblNlbGVjdGVkV29yZCcpXG4gICAgb3V0Y29tZSA9IGZhbHNlXG4gICAgZm9yIHNlbGVjdGlvbiBpbiBzZWxlY3Rpb25zXG4gICAgICBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBvdXRjb21lID0gKHJhbmdlLnN0YXJ0LmNvbHVtbiBpcyBzZWxlY3Rpb25SYW5nZS5zdGFydC5jb2x1bW4pIGFuZFxuICAgICAgICAgICAgICAgIChyYW5nZS5zdGFydC5yb3cgaXMgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQucm93KSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2UuZW5kLmNvbHVtbiBpcyBzZWxlY3Rpb25SYW5nZS5lbmQuY29sdW1uKSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2UuZW5kLnJvdyBpcyBzZWxlY3Rpb25SYW5nZS5lbmQucm93KVxuICAgICAgYnJlYWsgaWYgb3V0Y29tZVxuICAgIG91dGNvbWVcblxuICByZW1vdmVBbGxNYXJrZXJzOiA9PlxuICAgIE9iamVjdC5rZXlzKEBlZGl0b3JUb01hcmtlckxheWVyTWFwKS5mb3JFYWNoKEByZW1vdmVNYXJrZXJzKVxuXG4gIHJlbW92ZU1hcmtlcnM6IChlZGl0b3JJZCkgPT5cbiAgICByZXR1cm4gdW5sZXNzIEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvcklkXT9cblxuICAgIG1hcmtlckxheWVyID0gQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9ySWRdWyd2aXNpYmxlTWFya2VyTGF5ZXInXVxuICAgIHNlbGVjdGVkTWFya2VyTGF5ZXIgPSBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3JJZF1bJ3NlbGVjdGVkTWFya2VyTGF5ZXInXVxuXG4gICAgbWFya2VyTGF5ZXIuY2xlYXIoKVxuICAgIHNlbGVjdGVkTWFya2VyTGF5ZXIuY2xlYXIoKVxuXG4gICAgQHN0YXR1c0JhckVsZW1lbnQ/LnVwZGF0ZUNvdW50KDApXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXJlbW92ZS1tYXJrZXItbGF5ZXInXG5cbiAgaXNXb3JkU2VsZWN0ZWQ6IChzZWxlY3Rpb24pIC0+XG4gICAgaWYgc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuaXNTaW5nbGVMaW5lKClcbiAgICAgIHNlbGVjdGlvblJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIGxpbmVSYW5nZSA9IEBnZXRBY3RpdmVFZGl0b3IoKS5idWZmZXJSYW5nZUZvckJ1ZmZlclJvdyhcbiAgICAgICAgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQucm93KVxuICAgICAgbm9uV29yZENoYXJhY3RlclRvVGhlTGVmdCA9XG4gICAgICAgIHNlbGVjdGlvblJhbmdlLnN0YXJ0LmlzRXF1YWwobGluZVJhbmdlLnN0YXJ0KSBvclxuICAgICAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0KHNlbGVjdGlvbilcbiAgICAgIG5vbldvcmRDaGFyYWN0ZXJUb1RoZVJpZ2h0ID1cbiAgICAgICAgc2VsZWN0aW9uUmFuZ2UuZW5kLmlzRXF1YWwobGluZVJhbmdlLmVuZCkgb3JcbiAgICAgICAgQGlzTm9uV29yZENoYXJhY3RlclRvVGhlUmlnaHQoc2VsZWN0aW9uKVxuXG4gICAgICBub25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0IGFuZCBub25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodFxuICAgIGVsc2VcbiAgICAgIGZhbHNlXG5cbiAgaXNOb25Xb3JkQ2hhcmFjdGVyOiAoY2hhcmFjdGVyKSAtPlxuICAgIG5vbldvcmRDaGFyYWN0ZXJzID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Iubm9uV29yZENoYXJhY3RlcnMnKVxuICAgIG5ldyBSZWdFeHAoXCJbIFxcdCN7ZXNjYXBlUmVnRXhwKG5vbldvcmRDaGFyYWN0ZXJzKX1dXCIpLnRlc3QoY2hhcmFjdGVyKVxuXG4gIGlzTm9uV29yZENoYXJhY3RlclRvVGhlTGVmdDogKHNlbGVjdGlvbikgLT5cbiAgICBzZWxlY3Rpb25TdGFydCA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLnN0YXJ0XG4gICAgcmFuZ2UgPSBSYW5nZS5mcm9tUG9pbnRXaXRoRGVsdGEoc2VsZWN0aW9uU3RhcnQsIDAsIC0xKVxuICAgIEBpc05vbldvcmRDaGFyYWN0ZXIoQGdldEFjdGl2ZUVkaXRvcigpLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKSlcblxuICBpc05vbldvcmRDaGFyYWN0ZXJUb1RoZVJpZ2h0OiAoc2VsZWN0aW9uKSAtPlxuICAgIHNlbGVjdGlvbkVuZCA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLmVuZFxuICAgIHJhbmdlID0gUmFuZ2UuZnJvbVBvaW50V2l0aERlbHRhKHNlbGVjdGlvbkVuZCwgMCwgMSlcbiAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyKEBnZXRBY3RpdmVFZGl0b3IoKS5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSkpXG5cbiAgc2V0dXBTdGF0dXNCYXI6ID0+XG4gICAgcmV0dXJuIGlmIEBzdGF0dXNCYXJFbGVtZW50P1xuICAgIHJldHVybiB1bmxlc3MgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuc2hvd0luU3RhdHVzQmFyJylcbiAgICBAc3RhdHVzQmFyRWxlbWVudCA9IG5ldyBTdGF0dXNCYXJWaWV3KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9IEBzdGF0dXNCYXIuYWRkTGVmdFRpbGUoXG4gICAgICBpdGVtOiBAc3RhdHVzQmFyRWxlbWVudC5nZXRFbGVtZW50KCksIHByaW9yaXR5OiAxMDApXG5cbiAgcmVtb3ZlU3RhdHVzQmFyOiA9PlxuICAgIHJldHVybiB1bmxlc3MgQHN0YXR1c0JhckVsZW1lbnQ/XG4gICAgQHN0YXR1c0JhclRpbGU/LmRlc3Ryb3koKVxuICAgIEBzdGF0dXNCYXJUaWxlID0gbnVsbFxuICAgIEBzdGF0dXNCYXJFbGVtZW50ID0gbnVsbFxuXG4gIGxpc3RlbkZvclN0YXR1c0JhckNoYW5nZTogPT5cbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnaGlnaGxpZ2h0LXNlbGVjdGVkLnNob3dJblN0YXR1c0JhcicsIChjaGFuZ2VkKSA9PlxuICAgICAgaWYgY2hhbmdlZC5uZXdWYWx1ZVxuICAgICAgICBAc2V0dXBTdGF0dXNCYXIoKVxuICAgICAgZWxzZVxuICAgICAgICBAcmVtb3ZlU3RhdHVzQmFyKClcblxuICBzZWxlY3RBbGw6ID0+XG4gICAgZWRpdG9yID0gQGdldEFjdGl2ZUVkaXRvcigpXG4gICAgbWFya2VyTGF5ZXJzID0gQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXVxuICAgIHJldHVybiB1bmxlc3MgbWFya2VyTGF5ZXJzP1xuICAgIHJhbmdlcyA9IFtdXG4gICAgZm9yIG1hcmtlckxheWVyIGluIFttYXJrZXJMYXllcnNbJ3Zpc2libGVNYXJrZXJMYXllciddLCBtYXJrZXJMYXllcnNbJ3NlbGVjdGVkTWFya2VyTGF5ZXInXV1cbiAgICAgIGZvciBtYXJrZXIgaW4gbWFya2VyTGF5ZXIuZ2V0TWFya2VycygpXG4gICAgICAgIHJhbmdlcy5wdXNoIG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpXG5cbiAgICBpZiByYW5nZXMubGVuZ3RoID4gMFxuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKHJhbmdlcywgZmxhc2g6IHRydWUpXG5cbiAgc2V0U2Nyb2xsTWFya2VyOiAoc2Nyb2xsTWFya2VyQVBJKSA9PlxuICAgIEBzY3JvbGxNYXJrZXIgPSBzY3JvbGxNYXJrZXJBUElcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5zaG93UmVzdWx0c09uU2Nyb2xsQmFyJylcbiAgICAgIEBlbnN1cmVTY3JvbGxWaWV3SW5zdGFsbGVkKClcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaChAc2V0U2Nyb2xsTWFya2VyVmlldylcblxuICBlbnN1cmVTY3JvbGxWaWV3SW5zdGFsbGVkOiAtPlxuICAgIHVubGVzcyBhdG9tLmluU3BlY01vZGUoKVxuICAgICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsICdoaWdobGlnaHQtc2VsZWN0ZWQnLCB0cnVlXG5cbiAgc2V0dXBNYXJrZXJMYXllcnM6IChlZGl0b3IpID0+XG4gICAgaWYgQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXT9cbiAgICAgIG1hcmtlckxheWVyID0gQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXVsndmlzaWJsZU1hcmtlckxheWVyJ11cbiAgICAgIG1hcmtlckxheWVyRm9ySGlkZGVuTWFya2VycyAgPSBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3IuaWRdWydzZWxlY3RlZE1hcmtlckxheWVyJ11cbiAgICBlbHNlXG4gICAgICBtYXJrZXJMYXllciA9IGVkaXRvci5hZGRNYXJrZXJMYXllcigpXG4gICAgICBtYXJrZXJMYXllckZvckhpZGRlbk1hcmtlcnMgPSBlZGl0b3IuYWRkTWFya2VyTGF5ZXIoKVxuICAgICAgQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXSA9XG4gICAgICAgIHZpc2libGVNYXJrZXJMYXllcjogbWFya2VyTGF5ZXJcbiAgICAgICAgc2VsZWN0ZWRNYXJrZXJMYXllcjogbWFya2VyTGF5ZXJGb3JIaWRkZW5NYXJrZXJzXG5cbiAgc2V0U2Nyb2xsTWFya2VyVmlldzogKGVkaXRvcikgPT5cbiAgICByZXR1cm4gdW5sZXNzIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLnNob3dSZXN1bHRzT25TY3JvbGxCYXInKVxuICAgIHJldHVybiB1bmxlc3MgQHNjcm9sbE1hcmtlcj9cblxuICAgIHNjcm9sbE1hcmtlclZpZXcgPSBAc2Nyb2xsTWFya2VyLnNjcm9sbE1hcmtlclZpZXdGb3JFZGl0b3IoZWRpdG9yKVxuXG4gICAgbWFya2VyTGF5ZXIgPSBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3IuaWRdWyd2aXNpYmxlTWFya2VyTGF5ZXInXVxuICAgIHNlbGVjdGVkTWFya2VyTGF5ZXIgPSBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3IuaWRdWydzZWxlY3RlZE1hcmtlckxheWVyJ11cblxuICAgIHNjcm9sbE1hcmtlclZpZXcuZ2V0TGF5ZXIoXCJoaWdobGlnaHQtc2VsZWN0ZWQtbWFya2VyLWxheWVyXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zeW5jVG9NYXJrZXJMYXllcihtYXJrZXJMYXllcilcbiAgICBzY3JvbGxNYXJrZXJWaWV3LmdldExheWVyKFwiaGlnaGxpZ2h0LXNlbGVjdGVkLXNlbGVjdGVkLW1hcmtlci1sYXllclwiKVxuICAgICAgICAgICAgICAgICAgICAuc3luY1RvTWFya2VyTGF5ZXIoc2VsZWN0ZWRNYXJrZXJMYXllcilcblxuICBkZXN0cm95U2Nyb2xsTWFya2VyczogKGVkaXRvcikgPT5cbiAgICByZXR1cm4gdW5sZXNzIEBzY3JvbGxNYXJrZXI/XG5cbiAgICBzY3JvbGxNYXJrZXJWaWV3ID0gQHNjcm9sbE1hcmtlci5zY3JvbGxNYXJrZXJWaWV3Rm9yRWRpdG9yKGVkaXRvcilcbiAgICBzY3JvbGxNYXJrZXJWaWV3LmRlc3Ryb3koKVxuIl19
