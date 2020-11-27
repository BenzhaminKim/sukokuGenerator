(function() {
  var AtomReact, CompositeDisposable, Disposable, autoCompleteTagCloseRegex, autoCompleteTagStartRegex, contentCheckRegex, decreaseIndentForNextLinePattern, defaultDetectReactFilePattern, jsxComplexAttributePattern, jsxTagStartPattern, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  contentCheckRegex = null;

  defaultDetectReactFilePattern = '/((require\\([\'"]react(?:(-native|\\/addons))?[\'"]\\)))|(import\\s+[\\w{},\\s]+\\s+from\\s+[\'"]react(?:(-native|\\/addons))?[\'"])/';

  autoCompleteTagStartRegex = /(<)([a-zA-Z0-9\.:$_]+)/g;

  autoCompleteTagCloseRegex = /(<\/)([^>]+)(>)/g;

  jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';

  jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';

  decreaseIndentForNextLinePattern = '(?x) />\\s*(,|;)?\\s*$ | ^(?!\\s*\\?)\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$';

  AtomReact = (function() {
    AtomReact.prototype.config = {
      enabledForAllJavascriptFiles: {
        type: 'boolean',
        "default": false,
        description: 'Enable grammar, snippets and other features automatically for all .js files.'
      },
      disableAutoClose: {
        type: 'boolean',
        "default": false,
        description: 'Disabled tag autocompletion'
      },
      skipUndoStackForAutoCloseInsertion: {
        type: 'boolean',
        "default": true,
        description: 'When enabled, auto insert/remove closing tag mutation is skipped from normal undo/redo operation'
      },
      detectReactFilePattern: {
        type: 'string',
        "default": defaultDetectReactFilePattern
      },
      jsxTagStartPattern: {
        type: 'string',
        "default": jsxTagStartPattern
      },
      jsxComplexAttributePattern: {
        type: 'string',
        "default": jsxComplexAttributePattern
      },
      decreaseIndentForNextLinePattern: {
        type: 'string',
        "default": decreaseIndentForNextLinePattern
      }
    };

    function AtomReact() {}

    AtomReact.prototype.patchEditorLangModeAutoDecreaseIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.autoDecreaseIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.autoDecreaseIndentForBufferRow = function(bufferRow, options) {
        var currentIndentLevel, decreaseIndentRegex, decreaseNextLineIndentRegex, desiredIndentLevel, increaseIndentRegex, line, precedingLine, precedingRow, scopeDescriptor;
        if (editor.getGrammar().scopeName !== "source.js.jsx") {
          return fn.call(editor, bufferRow, options);
        }
        scopeDescriptor = this.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.tokenizedBuffer.regexForPattern(atom.config.get('react.decreaseIndentForNextLinePattern') || decreaseIndentForNextLinePattern);
        decreaseIndentRegex = this.tokenizedBuffer.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        increaseIndentRegex = this.tokenizedBuffer.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        precedingRow = this.tokenizedBuffer.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return;
        }
        precedingLine = this.tokenizedBuffer.buffer.lineForRow(precedingRow);
        line = this.tokenizedBuffer.buffer.lineForRow(bufferRow);
        if (precedingLine && decreaseNextLineIndentRegex.testSync(precedingLine) && !(increaseIndentRegex && increaseIndentRegex.testSync(precedingLine)) && !this.isBufferRowCommented(precedingRow)) {
          currentIndentLevel = this.indentationForBufferRow(precedingRow);
          if (decreaseIndentRegex && decreaseIndentRegex.testSync(line)) {
            currentIndentLevel -= 1;
          }
          desiredIndentLevel = currentIndentLevel - 1;
          if (desiredIndentLevel >= 0 && desiredIndentLevel < currentIndentLevel) {
            return this.setIndentationForBufferRow(bufferRow, desiredIndentLevel);
          }
        } else if (!this.isBufferRowCommented(bufferRow)) {
          return fn.call(editor, bufferRow, options);
        }
      };
    };

    AtomReact.prototype.patchEditorLangModeSuggestedIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.suggestedIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.suggestedIndentForBufferRow = function(bufferRow, options) {
        var complexAttributeRegex, decreaseIndentRegex, decreaseIndentTest, decreaseNextLineIndentRegex, increaseIndentRegex, indent, precedingLine, precedingRow, scopeDescriptor, tagStartRegex, tagStartTest;
        indent = fn.call(editor, bufferRow, options);
        if (!(editor.getGrammar().scopeName === "source.js.jsx" && bufferRow > 1)) {
          return indent;
        }
        scopeDescriptor = this.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.tokenizedBuffer.regexForPattern(atom.config.get('react.decreaseIndentForNextLinePattern') || decreaseIndentForNextLinePattern);
        increaseIndentRegex = this.tokenizedBuffer.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        decreaseIndentRegex = this.tokenizedBuffer.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        tagStartRegex = this.tokenizedBuffer.regexForPattern(atom.config.get('react.jsxTagStartPattern') || jsxTagStartPattern);
        complexAttributeRegex = this.tokenizedBuffer.regexForPattern(atom.config.get('react.jsxComplexAttributePattern') || jsxComplexAttributePattern);
        precedingRow = this.tokenizedBuffer.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return indent;
        }
        precedingLine = this.tokenizedBuffer.buffer.lineForRow(precedingRow);
        if (precedingLine == null) {
          return indent;
        }
        if (this.isBufferRowCommented(bufferRow) && this.isBufferRowCommented(precedingRow)) {
          return this.indentationForBufferRow(precedingRow);
        }
        tagStartTest = tagStartRegex.testSync(precedingLine);
        decreaseIndentTest = decreaseIndentRegex.testSync(precedingLine);
        if (tagStartTest && complexAttributeRegex.testSync(precedingLine) && !this.isBufferRowCommented(precedingRow)) {
          indent += 1;
        }
        if (precedingLine && !decreaseIndentTest && decreaseNextLineIndentRegex.testSync(precedingLine) && !this.isBufferRowCommented(precedingRow)) {
          indent -= 1;
        }
        return Math.max(indent, 0);
      };
    };

    AtomReact.prototype.patchEditorLangMode = function(editor) {
      var ref1, ref2;
      if ((ref1 = this.patchEditorLangModeSuggestedIndentForBufferRow(editor)) != null) {
        ref1.jsxPatch = true;
      }
      return (ref2 = this.patchEditorLangModeAutoDecreaseIndentForBufferRow(editor)) != null ? ref2.jsxPatch = true : void 0;
    };

    AtomReact.prototype.isReact = function(text) {
      var match;
      if (atom.config.get('react.enabledForAllJavascriptFiles')) {
        return true;
      }
      if (contentCheckRegex == null) {
        match = (atom.config.get('react.detectReactFilePattern') || defaultDetectReactFilePattern).match(new RegExp('^/(.*?)/([gimy]*)$'));
        contentCheckRegex = new RegExp(match[1], match[2]);
      }
      return text.match(contentCheckRegex) != null;
    };

    AtomReact.prototype.isReactEnabledForEditor = function(editor) {
      var ref1;
      return (editor != null) && ((ref1 = editor.getGrammar().scopeName) === "source.js.jsx" || ref1 === "source.coffee.jsx");
    };

    AtomReact.prototype.autoSetGrammar = function(editor) {
      var extName, jsxGrammar, path;
      if (this.isReactEnabledForEditor(editor)) {
        return;
      }
      path = require('path');
      extName = path.extname(editor.getPath() || '');
      if (extName === ".jsx" || ((extName === ".js" || extName === ".es6") && this.isReact(editor.getText()))) {
        jsxGrammar = atom.grammars.grammarForScopeName("source.js.jsx");
        if (jsxGrammar) {
          return editor.setGrammar(jsxGrammar);
        }
      }
    };

    AtomReact.prototype.onHTMLToJSX = function() {
      var HTMLtoJSX, converter, editor, jsxformat, selections;
      jsxformat = require('jsxformat');
      HTMLtoJSX = require('./htmltojsx');
      converter = new HTMLtoJSX({
        createClass: false
      });
      editor = atom.workspace.getActiveTextEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var i, jsxOutput, len, range, results, selection, selectionText;
          results = [];
          for (i = 0, len = selections.length; i < len; i++) {
            selection = selections[i];
            try {
              selectionText = selection.getText();
              jsxOutput = converter.convert(selectionText);
              try {
                jsxformat.setOptions({});
                jsxOutput = jsxformat.format(jsxOutput);
              } catch (error) {}
              selection.insertText(jsxOutput);
              range = selection.getBufferRange();
              results.push(editor.autoIndentBufferRows(range.start.row, range.end.row));
            } catch (error) {}
          }
          return results;
        };
      })(this));
    };

    AtomReact.prototype.onReformat = function() {
      var _, editor, jsxformat, selections;
      jsxformat = require('jsxformat');
      _ = require('lodash');
      editor = atom.workspace.getActiveTextEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var bufEnd, bufStart, err, firstChangedLine, i, lastChangedLine, len, newLineCount, original, originalLineCount, range, result, results, selection, serializedRange;
          results = [];
          for (i = 0, len = selections.length; i < len; i++) {
            selection = selections[i];
            try {
              range = selection.getBufferRange();
              serializedRange = range.serialize();
              bufStart = serializedRange[0];
              bufEnd = serializedRange[1];
              jsxformat.setOptions({});
              result = jsxformat.format(selection.getText());
              originalLineCount = editor.getLineCount();
              selection.insertText(result);
              newLineCount = editor.getLineCount();
              editor.autoIndentBufferRows(bufStart[0], bufEnd[0] + (newLineCount - originalLineCount));
              results.push(editor.setCursorBufferPosition(bufStart));
            } catch (error) {
              err = error;
              range = selection.getBufferRange().serialize();
              range[0][0]++;
              range[1][0]++;
              jsxformat.setOptions({
                range: range
              });
              original = editor.getText();
              try {
                result = jsxformat.format(original);
                selection.clear();
                originalLineCount = editor.getLineCount();
                editor.setText(result);
                newLineCount = editor.getLineCount();
                firstChangedLine = range[0][0] - 1;
                lastChangedLine = range[1][0] - 1 + (newLineCount - originalLineCount);
                editor.autoIndentBufferRows(firstChangedLine, lastChangedLine);
                results.push(editor.setCursorBufferPosition([firstChangedLine, range[0][1]]));
              } catch (error) {}
            }
          }
          return results;
        };
      })(this));
    };

    AtomReact.prototype.autoCloseTag = function(eventObj, editor) {
      var fullLine, lastLine, lastLineSpaces, line, lines, match, options, ref1, ref2, rest, row, serializedEndPoint, tagName, token, tokenizedLine;
      if (atom.config.get('react.disableAutoClose')) {
        return;
      }
      if (!this.isReactEnabledForEditor(editor) || editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if ((eventObj != null ? eventObj.newText : void 0) === '>' && !eventObj.oldText) {
        if (editor.getCursorBufferPositions().length > 1) {
          return;
        }
        tokenizedLine = (ref1 = editor.tokenizedBuffer) != null ? ref1.tokenizedLineForRow(eventObj.newRange.end.row) : void 0;
        if (tokenizedLine == null) {
          return;
        }
        token = tokenizedLine.tokenAtBufferColumn(eventObj.newRange.end.column - 1);
        if ((token == null) || token.scopes.indexOf('tag.open.js') === -1 || token.scopes.indexOf('punctuation.definition.tag.end.js') === -1) {
          return;
        }
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        line = lines[row];
        line = line.substr(0, eventObj.newRange.end.column);
        if (line.substr(line.length - 2, 1) === '/') {
          return;
        }
        tagName = null;
        while ((line != null) && (tagName == null)) {
          match = line.match(autoCompleteTagStartRegex);
          if ((match != null) && match.length > 0) {
            tagName = match.pop().substr(1);
          }
          row--;
          line = lines[row];
        }
        if (tagName != null) {
          if (atom.config.get('react.skipUndoStackForAutoCloseInsertion')) {
            options = {
              undo: 'skip'
            };
          } else {
            options = {};
          }
          editor.insertText('</' + tagName + '>', options);
          return editor.setCursorBufferPosition(eventObj.newRange.end);
        }
      } else if ((eventObj != null ? eventObj.oldText : void 0) === '>' && (eventObj != null ? eventObj.newText : void 0) === '') {
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        fullLine = lines[row];
        tokenizedLine = (ref2 = editor.tokenizedBuffer) != null ? ref2.tokenizedLineForRow(eventObj.newRange.end.row) : void 0;
        if (tokenizedLine == null) {
          return;
        }
        token = tokenizedLine.tokenAtBufferColumn(eventObj.newRange.end.column - 1);
        if ((token == null) || token.scopes.indexOf('tag.open.js') === -1) {
          return;
        }
        line = fullLine.substr(0, eventObj.newRange.end.column);
        if (line.substr(line.length - 1, 1) === '/') {
          return;
        }
        tagName = null;
        while ((line != null) && (tagName == null)) {
          match = line.match(autoCompleteTagStartRegex);
          if ((match != null) && match.length > 0) {
            tagName = match.pop().substr(1);
          }
          row--;
          line = lines[row];
        }
        if (tagName != null) {
          rest = fullLine.substr(eventObj.newRange.end.column);
          if (rest.indexOf('</' + tagName + '>') === 0) {
            if (atom.config.get('react.skipUndoStackForAutoCloseInsertion')) {
              options = {
                undo: 'skip'
              };
            } else {
              options = {};
            }
            serializedEndPoint = [eventObj.newRange.end.row, eventObj.newRange.end.column];
            return editor.setTextInBufferRange([serializedEndPoint, [serializedEndPoint[0], serializedEndPoint[1] + tagName.length + 3]], '', options);
          }
        }
      } else if ((eventObj != null) && eventObj.newText.match(/\r?\n/)) {
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        lastLine = lines[row - 1];
        fullLine = lines[row];
        if (/>$/.test(lastLine) && fullLine.search(autoCompleteTagCloseRegex) === 0) {
          while (lastLine != null) {
            match = lastLine.match(autoCompleteTagStartRegex);
            if ((match != null) && match.length > 0) {
              break;
            }
            row--;
            lastLine = lines[row];
          }
          lastLineSpaces = lastLine.match(/^\s*/);
          lastLineSpaces = lastLineSpaces != null ? lastLineSpaces[0] : '';
          editor.insertText('\n' + lastLineSpaces);
          return editor.setCursorBufferPosition(eventObj.newRange.end);
        }
      }
    };

    AtomReact.prototype.processEditor = function(editor) {
      var disposableBufferEvent;
      this.patchEditorLangMode(editor);
      this.autoSetGrammar(editor);
      disposableBufferEvent = editor.buffer.onDidChange((function(_this) {
        return function(e) {
          return _this.autoCloseTag(e, editor);
        };
      })(this));
      this.disposables.add(editor.onDidDestroy((function(_this) {
        return function() {
          return disposableBufferEvent.dispose();
        };
      })(this)));
      return this.disposables.add(disposableBufferEvent);
    };

    AtomReact.prototype.deactivate = function() {
      return this.disposables.dispose();
    };

    AtomReact.prototype.activate = function() {
      var disposableConfigListener, disposableHTMLTOJSX, disposableProcessEditor, disposableReformat;
      this.disposables = new CompositeDisposable();
      disposableConfigListener = atom.config.observe('react.detectReactFilePattern', function(newValue) {
        return contentCheckRegex = null;
      });
      disposableReformat = atom.commands.add('atom-workspace', 'react:reformat-JSX', (function(_this) {
        return function() {
          return _this.onReformat();
        };
      })(this));
      disposableHTMLTOJSX = atom.commands.add('atom-workspace', 'react:HTML-to-JSX', (function(_this) {
        return function() {
          return _this.onHTMLToJSX();
        };
      })(this));
      disposableProcessEditor = atom.workspace.observeTextEditors(this.processEditor.bind(this));
      this.disposables.add(disposableConfigListener);
      this.disposables.add(disposableReformat);
      this.disposables.add(disposableHTMLTOJSX);
      return this.disposables.add(disposableProcessEditor);
    };

    return AtomReact;

  })();

  module.exports = AtomReact;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3JlYWN0L2xpYi9hdG9tLXJlYWN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFFdEIsaUJBQUEsR0FBb0I7O0VBQ3BCLDZCQUFBLEdBQWdDOztFQUNoQyx5QkFBQSxHQUE0Qjs7RUFDNUIseUJBQUEsR0FBNEI7O0VBRTVCLGtCQUFBLEdBQXFCOztFQUNyQiwwQkFBQSxHQUE2Qjs7RUFDN0IsZ0NBQUEsR0FBbUM7O0VBSTdCO3dCQUNKLE1BQUEsR0FDRTtNQUFBLDRCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSw4RUFGYjtPQURGO01BSUEsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDZCQUZiO09BTEY7TUFRQSxrQ0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsa0dBRmI7T0FURjtNQVlBLHNCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsNkJBRFQ7T0FiRjtNQWVBLGtCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsa0JBRFQ7T0FoQkY7TUFrQkEsMEJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUywwQkFEVDtPQW5CRjtNQXFCQSxnQ0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGdDQURUO09BdEJGOzs7SUF5QlcsbUJBQUEsR0FBQTs7d0JBQ2IsaURBQUEsR0FBbUQsU0FBQyxNQUFEO0FBQ2pELFVBQUE7TUFBQSxJQUFBLEdBQU87TUFDUCxFQUFBLEdBQUssTUFBTSxDQUFDO01BQ1osSUFBVSxFQUFFLENBQUMsUUFBYjtBQUFBLGVBQUE7O2FBRUEsTUFBTSxDQUFDLDhCQUFQLEdBQXdDLFNBQUMsU0FBRCxFQUFZLE9BQVo7QUFDdEMsWUFBQTtRQUFBLElBQWtELE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUFwQixLQUFpQyxlQUFuRjtBQUFBLGlCQUFPLEVBQUUsQ0FBQyxJQUFILENBQVEsTUFBUixFQUFnQixTQUFoQixFQUEyQixPQUEzQixFQUFQOztRQUVBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLGdDQUFELENBQWtDLENBQUMsU0FBRCxFQUFZLENBQVosQ0FBbEM7UUFDbEIsMkJBQUEsR0FBOEIsSUFBQyxDQUFBLGVBQWUsQ0FBQyxlQUFqQixDQUFpQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLENBQUEsSUFBNkQsZ0NBQTlGO1FBQzlCLG1CQUFBLEdBQXNCLElBQUMsQ0FBQSxlQUFlLENBQUMscUNBQWpCLENBQXVELGVBQXZEO1FBQ3RCLG1CQUFBLEdBQXNCLElBQUMsQ0FBQSxlQUFlLENBQUMscUNBQWpCLENBQXVELGVBQXZEO1FBRXRCLFlBQUEsR0FBZSxJQUFDLENBQUEsZUFBZSxDQUFDLE1BQU0sQ0FBQyxtQkFBeEIsQ0FBNEMsU0FBNUM7UUFFZixJQUFVLFlBQUEsR0FBZSxDQUF6QjtBQUFBLGlCQUFBOztRQUVBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLGVBQWUsQ0FBQyxNQUFNLENBQUMsVUFBeEIsQ0FBbUMsWUFBbkM7UUFDaEIsSUFBQSxHQUFPLElBQUMsQ0FBQSxlQUFlLENBQUMsTUFBTSxDQUFDLFVBQXhCLENBQW1DLFNBQW5DO1FBRVAsSUFBRyxhQUFBLElBQWtCLDJCQUEyQixDQUFDLFFBQTVCLENBQXFDLGFBQXJDLENBQWxCLElBQ0EsQ0FBSSxDQUFDLG1CQUFBLElBQXdCLG1CQUFtQixDQUFDLFFBQXBCLENBQTZCLGFBQTdCLENBQXpCLENBREosSUFFQSxDQUFJLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixZQUF0QixDQUZQO1VBR0Usa0JBQUEsR0FBcUIsSUFBQyxDQUFBLHVCQUFELENBQXlCLFlBQXpCO1VBQ3JCLElBQTJCLG1CQUFBLElBQXdCLG1CQUFtQixDQUFDLFFBQXBCLENBQTZCLElBQTdCLENBQW5EO1lBQUEsa0JBQUEsSUFBc0IsRUFBdEI7O1VBQ0Esa0JBQUEsR0FBcUIsa0JBQUEsR0FBcUI7VUFDMUMsSUFBRyxrQkFBQSxJQUFzQixDQUF0QixJQUE0QixrQkFBQSxHQUFxQixrQkFBcEQ7bUJBQ0UsSUFBQyxDQUFBLDBCQUFELENBQTRCLFNBQTVCLEVBQXVDLGtCQUF2QyxFQURGO1dBTkY7U0FBQSxNQVFLLElBQUcsQ0FBSSxJQUFDLENBQUEsb0JBQUQsQ0FBc0IsU0FBdEIsQ0FBUDtpQkFDSCxFQUFFLENBQUMsSUFBSCxDQUFRLE1BQVIsRUFBZ0IsU0FBaEIsRUFBMkIsT0FBM0IsRUFERzs7TUF2QmlDO0lBTFM7O3dCQStCbkQsOENBQUEsR0FBZ0QsU0FBQyxNQUFEO0FBQzlDLFVBQUE7TUFBQSxJQUFBLEdBQU87TUFDUCxFQUFBLEdBQUssTUFBTSxDQUFDO01BQ1osSUFBVSxFQUFFLENBQUMsUUFBYjtBQUFBLGVBQUE7O2FBRUEsTUFBTSxDQUFDLDJCQUFQLEdBQXFDLFNBQUMsU0FBRCxFQUFZLE9BQVo7QUFDbkMsWUFBQTtRQUFBLE1BQUEsR0FBUyxFQUFFLENBQUMsSUFBSCxDQUFRLE1BQVIsRUFBZ0IsU0FBaEIsRUFBMkIsT0FBM0I7UUFDVCxJQUFBLENBQUEsQ0FBcUIsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXBCLEtBQWlDLGVBQWpDLElBQXFELFNBQUEsR0FBWSxDQUF0RixDQUFBO0FBQUEsaUJBQU8sT0FBUDs7UUFFQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxnQ0FBRCxDQUFrQyxDQUFDLFNBQUQsRUFBWSxDQUFaLENBQWxDO1FBRWxCLDJCQUFBLEdBQThCLElBQUMsQ0FBQSxlQUFlLENBQUMsZUFBakIsQ0FBaUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixDQUFBLElBQTZELGdDQUE5RjtRQUM5QixtQkFBQSxHQUFzQixJQUFDLENBQUEsZUFBZSxDQUFDLHFDQUFqQixDQUF1RCxlQUF2RDtRQUV0QixtQkFBQSxHQUFzQixJQUFDLENBQUEsZUFBZSxDQUFDLHFDQUFqQixDQUF1RCxlQUF2RDtRQUN0QixhQUFBLEdBQWdCLElBQUMsQ0FBQSxlQUFlLENBQUMsZUFBakIsQ0FBaUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixDQUFBLElBQStDLGtCQUFoRjtRQUNoQixxQkFBQSxHQUF3QixJQUFDLENBQUEsZUFBZSxDQUFDLGVBQWpCLENBQWlDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQ0FBaEIsQ0FBQSxJQUF1RCwwQkFBeEY7UUFFeEIsWUFBQSxHQUFlLElBQUMsQ0FBQSxlQUFlLENBQUMsTUFBTSxDQUFDLG1CQUF4QixDQUE0QyxTQUE1QztRQUVmLElBQWlCLFlBQUEsR0FBZSxDQUFoQztBQUFBLGlCQUFPLE9BQVA7O1FBRUEsYUFBQSxHQUFnQixJQUFDLENBQUEsZUFBZSxDQUFDLE1BQU0sQ0FBQyxVQUF4QixDQUFtQyxZQUFuQztRQUVoQixJQUFxQixxQkFBckI7QUFBQSxpQkFBTyxPQUFQOztRQUVBLElBQUcsSUFBQyxDQUFBLG9CQUFELENBQXNCLFNBQXRCLENBQUEsSUFBcUMsSUFBQyxDQUFBLG9CQUFELENBQXNCLFlBQXRCLENBQXhDO0FBQ0UsaUJBQU8sSUFBQyxDQUFBLHVCQUFELENBQXlCLFlBQXpCLEVBRFQ7O1FBR0EsWUFBQSxHQUFlLGFBQWEsQ0FBQyxRQUFkLENBQXVCLGFBQXZCO1FBQ2Ysa0JBQUEsR0FBcUIsbUJBQW1CLENBQUMsUUFBcEIsQ0FBNkIsYUFBN0I7UUFFckIsSUFBZSxZQUFBLElBQWlCLHFCQUFxQixDQUFDLFFBQXRCLENBQStCLGFBQS9CLENBQWpCLElBQW1FLENBQUksSUFBQyxDQUFBLG9CQUFELENBQXNCLFlBQXRCLENBQXRGO1VBQUEsTUFBQSxJQUFVLEVBQVY7O1FBQ0EsSUFBZSxhQUFBLElBQWtCLENBQUksa0JBQXRCLElBQTZDLDJCQUEyQixDQUFDLFFBQTVCLENBQXFDLGFBQXJDLENBQTdDLElBQXFHLENBQUksSUFBQyxDQUFBLG9CQUFELENBQXNCLFlBQXRCLENBQXhIO1VBQUEsTUFBQSxJQUFVLEVBQVY7O0FBRUEsZUFBTyxJQUFJLENBQUMsR0FBTCxDQUFTLE1BQVQsRUFBaUIsQ0FBakI7TUE5QjRCO0lBTFM7O3dCQXFDaEQsbUJBQUEsR0FBcUIsU0FBQyxNQUFEO0FBQ25CLFVBQUE7O1lBQXVELENBQUUsUUFBekQsR0FBb0U7O21HQUNWLENBQUUsUUFBNUQsR0FBdUU7SUFGcEQ7O3dCQUlyQixPQUFBLEdBQVMsU0FBQyxJQUFEO0FBQ1AsVUFBQTtNQUFBLElBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQUFmO0FBQUEsZUFBTyxLQUFQOztNQUdBLElBQU8seUJBQVA7UUFDRSxLQUFBLEdBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLENBQUEsSUFBbUQsNkJBQXBELENBQWtGLENBQUMsS0FBbkYsQ0FBeUYsSUFBSSxNQUFKLENBQVcsb0JBQVgsQ0FBekY7UUFDUixpQkFBQSxHQUFvQixJQUFJLE1BQUosQ0FBVyxLQUFNLENBQUEsQ0FBQSxDQUFqQixFQUFxQixLQUFNLENBQUEsQ0FBQSxDQUEzQixFQUZ0Qjs7QUFHQSxhQUFPO0lBUEE7O3dCQVNULHVCQUFBLEdBQXlCLFNBQUMsTUFBRDtBQUN2QixVQUFBO0FBQUEsYUFBTyxnQkFBQSxJQUFXLFNBQUEsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFVBQXBCLEtBQWtDLGVBQWxDLElBQUEsSUFBQSxLQUFtRCxtQkFBbkQ7SUFESzs7d0JBR3pCLGNBQUEsR0FBZ0IsU0FBQyxNQUFEO0FBQ2QsVUFBQTtNQUFBLElBQVUsSUFBQyxDQUFBLHVCQUFELENBQXlCLE1BQXpCLENBQVY7QUFBQSxlQUFBOztNQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjtNQUdQLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBQSxJQUFvQixFQUFqQztNQUNWLElBQUcsT0FBQSxLQUFXLE1BQVgsSUFBcUIsQ0FBQyxDQUFDLE9BQUEsS0FBVyxLQUFYLElBQW9CLE9BQUEsS0FBVyxNQUFoQyxDQUFBLElBQTRDLElBQUMsQ0FBQSxPQUFELENBQVMsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFULENBQTdDLENBQXhCO1FBQ0UsVUFBQSxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0MsZUFBbEM7UUFDYixJQUFnQyxVQUFoQztpQkFBQSxNQUFNLENBQUMsVUFBUCxDQUFrQixVQUFsQixFQUFBO1NBRkY7O0lBUGM7O3dCQVdoQixXQUFBLEdBQWEsU0FBQTtBQUNYLFVBQUE7TUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLFdBQVI7TUFDWixTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVI7TUFDWixTQUFBLEdBQVksSUFBSSxTQUFKLENBQWM7UUFBQSxXQUFBLEVBQWEsS0FBYjtPQUFkO01BRVosTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUVULElBQVUsQ0FBSSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsTUFBekIsQ0FBZDtBQUFBLGVBQUE7O01BRUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxhQUFQLENBQUE7YUFFYixNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDZCxjQUFBO0FBQUE7ZUFBQSw0Q0FBQTs7QUFDRTtjQUNFLGFBQUEsR0FBZ0IsU0FBUyxDQUFDLE9BQVYsQ0FBQTtjQUNoQixTQUFBLEdBQVksU0FBUyxDQUFDLE9BQVYsQ0FBa0IsYUFBbEI7QUFFWjtnQkFDRSxTQUFTLENBQUMsVUFBVixDQUFxQixFQUFyQjtnQkFDQSxTQUFBLEdBQVksU0FBUyxDQUFDLE1BQVYsQ0FBaUIsU0FBakIsRUFGZDtlQUFBO2NBSUEsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsU0FBckI7Y0FDQSxLQUFBLEdBQVEsU0FBUyxDQUFDLGNBQVYsQ0FBQTsyQkFDUixNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUF4QyxFQUE2QyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQXZELEdBVkY7YUFBQTtBQURGOztRQURjO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtJQVhXOzt3QkF5QmIsVUFBQSxHQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSO01BQ1osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSO01BRUosTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUVULElBQVUsQ0FBSSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsTUFBekIsQ0FBZDtBQUFBLGVBQUE7O01BRUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxhQUFQLENBQUE7YUFDYixNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDZCxjQUFBO0FBQUE7ZUFBQSw0Q0FBQTs7QUFDRTtjQUNFLEtBQUEsR0FBUSxTQUFTLENBQUMsY0FBVixDQUFBO2NBQ1IsZUFBQSxHQUFrQixLQUFLLENBQUMsU0FBTixDQUFBO2NBQ2xCLFFBQUEsR0FBVyxlQUFnQixDQUFBLENBQUE7Y0FDM0IsTUFBQSxHQUFTLGVBQWdCLENBQUEsQ0FBQTtjQUV6QixTQUFTLENBQUMsVUFBVixDQUFxQixFQUFyQjtjQUNBLE1BQUEsR0FBUyxTQUFTLENBQUMsTUFBVixDQUFpQixTQUFTLENBQUMsT0FBVixDQUFBLENBQWpCO2NBRVQsaUJBQUEsR0FBb0IsTUFBTSxDQUFDLFlBQVAsQ0FBQTtjQUNwQixTQUFTLENBQUMsVUFBVixDQUFxQixNQUFyQjtjQUNBLFlBQUEsR0FBZSxNQUFNLENBQUMsWUFBUCxDQUFBO2NBRWYsTUFBTSxDQUFDLG9CQUFQLENBQTRCLFFBQVMsQ0FBQSxDQUFBLENBQXJDLEVBQXlDLE1BQU8sQ0FBQSxDQUFBLENBQVAsR0FBWSxDQUFDLFlBQUEsR0FBZSxpQkFBaEIsQ0FBckQ7MkJBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLFFBQS9CLEdBZEY7YUFBQSxhQUFBO2NBZU07Y0FFSixLQUFBLEdBQVEsU0FBUyxDQUFDLGNBQVYsQ0FBQSxDQUEwQixDQUFDLFNBQTNCLENBQUE7Y0FFUixLQUFNLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFUO2NBQ0EsS0FBTSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBVDtjQUVBLFNBQVMsQ0FBQyxVQUFWLENBQXFCO2dCQUFDLEtBQUEsRUFBTyxLQUFSO2VBQXJCO2NBR0EsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUE7QUFFWDtnQkFDRSxNQUFBLEdBQVMsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsUUFBakI7Z0JBQ1QsU0FBUyxDQUFDLEtBQVYsQ0FBQTtnQkFFQSxpQkFBQSxHQUFvQixNQUFNLENBQUMsWUFBUCxDQUFBO2dCQUNwQixNQUFNLENBQUMsT0FBUCxDQUFlLE1BQWY7Z0JBQ0EsWUFBQSxHQUFlLE1BQU0sQ0FBQyxZQUFQLENBQUE7Z0JBRWYsZ0JBQUEsR0FBbUIsS0FBTSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBVCxHQUFjO2dCQUNqQyxlQUFBLEdBQWtCLEtBQU0sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQVQsR0FBYyxDQUFkLEdBQWtCLENBQUMsWUFBQSxHQUFlLGlCQUFoQjtnQkFFcEMsTUFBTSxDQUFDLG9CQUFQLENBQTRCLGdCQUE1QixFQUE4QyxlQUE5Qzs2QkFHQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxnQkFBRCxFQUFtQixLQUFNLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUE1QixDQUEvQixHQWRGO2VBQUEsaUJBM0JGOztBQURGOztRQURjO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtJQVRVOzt3QkFzRFosWUFBQSxHQUFjLFNBQUMsUUFBRCxFQUFXLE1BQVg7QUFDWixVQUFBO01BQUEsSUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBQVY7QUFBQSxlQUFBOztNQUVBLElBQVUsQ0FBSSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsTUFBekIsQ0FBSixJQUF3QyxNQUFBLEtBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQTVEO0FBQUEsZUFBQTs7TUFFQSx3QkFBRyxRQUFRLENBQUUsaUJBQVYsS0FBcUIsR0FBckIsSUFBNkIsQ0FBQyxRQUFRLENBQUMsT0FBMUM7UUFFRSxJQUFVLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQWlDLENBQUMsTUFBbEMsR0FBMkMsQ0FBckQ7QUFBQSxpQkFBQTs7UUFFQSxhQUFBLGlEQUFzQyxDQUFFLG1CQUF4QixDQUE0QyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFsRTtRQUNoQixJQUFjLHFCQUFkO0FBQUEsaUJBQUE7O1FBRUEsS0FBQSxHQUFRLGFBQWEsQ0FBQyxtQkFBZCxDQUFrQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUF0QixHQUErQixDQUFqRTtRQUVSLElBQU8sZUFBSixJQUFjLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBYixDQUFxQixhQUFyQixDQUFBLEtBQXVDLENBQUMsQ0FBdEQsSUFBMkQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFiLENBQXFCLG1DQUFyQixDQUFBLEtBQTZELENBQUMsQ0FBNUg7QUFDRSxpQkFERjs7UUFHQSxLQUFBLEdBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFkLENBQUE7UUFDUixHQUFBLEdBQU0sUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDNUIsSUFBQSxHQUFPLEtBQU0sQ0FBQSxHQUFBO1FBQ2IsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBWixFQUFlLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQXJDO1FBR1AsSUFBVSxJQUFJLENBQUMsTUFBTCxDQUFZLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBMUIsRUFBNkIsQ0FBN0IsQ0FBQSxLQUFtQyxHQUE3QztBQUFBLGlCQUFBOztRQUVBLE9BQUEsR0FBVTtBQUVWLGVBQU0sY0FBQSxJQUFjLGlCQUFwQjtVQUNFLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLHlCQUFYO1VBQ1IsSUFBRyxlQUFBLElBQVUsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUE1QjtZQUNFLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBTixDQUFBLENBQVcsQ0FBQyxNQUFaLENBQW1CLENBQW5CLEVBRFo7O1VBRUEsR0FBQTtVQUNBLElBQUEsR0FBTyxLQUFNLENBQUEsR0FBQTtRQUxmO1FBT0EsSUFBRyxlQUFIO1VBQ0UsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMENBQWhCLENBQUg7WUFDRSxPQUFBLEdBQVU7Y0FBQyxJQUFBLEVBQU0sTUFBUDtjQURaO1dBQUEsTUFBQTtZQUdFLE9BQUEsR0FBVSxHQUhaOztVQUtBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQUEsR0FBTyxPQUFQLEdBQWlCLEdBQW5DLEVBQXdDLE9BQXhDO2lCQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixRQUFRLENBQUMsUUFBUSxDQUFDLEdBQWpELEVBUEY7U0E3QkY7T0FBQSxNQXNDSyx3QkFBRyxRQUFRLENBQUUsaUJBQVYsS0FBcUIsR0FBckIsd0JBQTZCLFFBQVEsQ0FBRSxpQkFBVixLQUFxQixFQUFyRDtRQUVILEtBQUEsR0FBUSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQWQsQ0FBQTtRQUNSLEdBQUEsR0FBTSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztRQUM1QixRQUFBLEdBQVcsS0FBTSxDQUFBLEdBQUE7UUFFakIsYUFBQSxpREFBc0MsQ0FBRSxtQkFBeEIsQ0FBNEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBbEU7UUFDaEIsSUFBYyxxQkFBZDtBQUFBLGlCQUFBOztRQUVBLEtBQUEsR0FBUSxhQUFhLENBQUMsbUJBQWQsQ0FBa0MsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBdEIsR0FBK0IsQ0FBakU7UUFDUixJQUFPLGVBQUosSUFBYyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQWIsQ0FBcUIsYUFBckIsQ0FBQSxLQUF1QyxDQUFDLENBQXpEO0FBQ0UsaUJBREY7O1FBRUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxNQUFULENBQWdCLENBQWhCLEVBQW1CLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQXpDO1FBR1AsSUFBVSxJQUFJLENBQUMsTUFBTCxDQUFZLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBMUIsRUFBNkIsQ0FBN0IsQ0FBQSxLQUFtQyxHQUE3QztBQUFBLGlCQUFBOztRQUVBLE9BQUEsR0FBVTtBQUVWLGVBQU0sY0FBQSxJQUFjLGlCQUFwQjtVQUNFLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLHlCQUFYO1VBQ1IsSUFBRyxlQUFBLElBQVUsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUE1QjtZQUNFLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBTixDQUFBLENBQVcsQ0FBQyxNQUFaLENBQW1CLENBQW5CLEVBRFo7O1VBRUEsR0FBQTtVQUNBLElBQUEsR0FBTyxLQUFNLENBQUEsR0FBQTtRQUxmO1FBT0EsSUFBRyxlQUFIO1VBQ0UsSUFBQSxHQUFPLFFBQVEsQ0FBQyxNQUFULENBQWdCLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQXRDO1VBQ1AsSUFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUEsR0FBTyxPQUFQLEdBQWlCLEdBQTlCLENBQUEsS0FBc0MsQ0FBekM7WUFFRSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQ0FBaEIsQ0FBSDtjQUNFLE9BQUEsR0FBVTtnQkFBQyxJQUFBLEVBQU0sTUFBUDtnQkFEWjthQUFBLE1BQUE7Y0FHRSxPQUFBLEdBQVUsR0FIWjs7WUFJQSxrQkFBQSxHQUFxQixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQXZCLEVBQTRCLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQWxEO21CQUNyQixNQUFNLENBQUMsb0JBQVAsQ0FDRSxDQUNFLGtCQURGLEVBRUUsQ0FBQyxrQkFBbUIsQ0FBQSxDQUFBLENBQXBCLEVBQXdCLGtCQUFtQixDQUFBLENBQUEsQ0FBbkIsR0FBd0IsT0FBTyxDQUFDLE1BQWhDLEdBQXlDLENBQWpFLENBRkYsQ0FERixFQUtFLEVBTEYsRUFLTSxPQUxOLEVBUEY7V0FGRjtTQTFCRztPQUFBLE1BMENBLElBQUcsa0JBQUEsSUFBYyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQWpCLENBQXVCLE9BQXZCLENBQWpCO1FBQ0gsS0FBQSxHQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBZCxDQUFBO1FBQ1IsR0FBQSxHQUFNLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQzVCLFFBQUEsR0FBVyxLQUFNLENBQUEsR0FBQSxHQUFNLENBQU47UUFDakIsUUFBQSxHQUFXLEtBQU0sQ0FBQSxHQUFBO1FBRWpCLElBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxRQUFWLENBQUEsSUFBd0IsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IseUJBQWhCLENBQUEsS0FBOEMsQ0FBekU7QUFDRSxpQkFBTSxnQkFBTjtZQUNFLEtBQUEsR0FBUSxRQUFRLENBQUMsS0FBVCxDQUFlLHlCQUFmO1lBQ1IsSUFBRyxlQUFBLElBQVUsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUE1QjtBQUNFLG9CQURGOztZQUVBLEdBQUE7WUFDQSxRQUFBLEdBQVcsS0FBTSxDQUFBLEdBQUE7VUFMbkI7VUFPQSxjQUFBLEdBQWlCLFFBQVEsQ0FBQyxLQUFULENBQWUsTUFBZjtVQUNqQixjQUFBLEdBQW9CLHNCQUFILEdBQXdCLGNBQWUsQ0FBQSxDQUFBLENBQXZDLEdBQStDO1VBQ2hFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQUEsR0FBTyxjQUF6QjtpQkFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFqRCxFQVhGO1NBTkc7O0lBckZPOzt3QkF3R2QsYUFBQSxHQUFlLFNBQUMsTUFBRDtBQUNiLFVBQUE7TUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsTUFBckI7TUFDQSxJQUFDLENBQUEsY0FBRCxDQUFnQixNQUFoQjtNQUNBLHFCQUFBLEdBQXdCLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBZCxDQUEwQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFDOUIsS0FBQyxDQUFBLFlBQUQsQ0FBYyxDQUFkLEVBQWlCLE1BQWpCO1FBRDhCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQjtNQUd4QixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLHFCQUFxQixDQUFDLE9BQXRCLENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEIsQ0FBakI7YUFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIscUJBQWpCO0lBUmE7O3dCQVVmLFVBQUEsR0FBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7SUFEVTs7d0JBRVosUUFBQSxHQUFVLFNBQUE7QUFFUixVQUFBO01BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLG1CQUFKLENBQUE7TUFJZix3QkFBQSxHQUEyQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsOEJBQXBCLEVBQW9ELFNBQUMsUUFBRDtlQUM3RSxpQkFBQSxHQUFvQjtNQUR5RCxDQUFwRDtNQUczQixrQkFBQSxHQUFxQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLG9CQUFwQyxFQUEwRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLFVBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExRDtNQUNyQixtQkFBQSxHQUFzQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLG1CQUFwQyxFQUF5RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLFdBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6RDtNQUN0Qix1QkFBQSxHQUEwQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixJQUFwQixDQUFsQztNQUUxQixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsd0JBQWpCO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLGtCQUFqQjtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixtQkFBakI7YUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsdUJBQWpCO0lBaEJROzs7Ozs7RUFtQlosTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUE5VmpCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuY29udGVudENoZWNrUmVnZXggPSBudWxsXG5kZWZhdWx0RGV0ZWN0UmVhY3RGaWxlUGF0dGVybiA9ICcvKChyZXF1aXJlXFxcXChbXFwnXCJdcmVhY3QoPzooLW5hdGl2ZXxcXFxcL2FkZG9ucykpP1tcXCdcIl1cXFxcKSkpfChpbXBvcnRcXFxccytbXFxcXHd7fSxcXFxcc10rXFxcXHMrZnJvbVxcXFxzK1tcXCdcIl1yZWFjdCg/OigtbmF0aXZlfFxcXFwvYWRkb25zKSk/W1xcJ1wiXSkvJ1xuYXV0b0NvbXBsZXRlVGFnU3RhcnRSZWdleCA9IC8oPCkoW2EtekEtWjAtOVxcLjokX10rKS9nXG5hdXRvQ29tcGxldGVUYWdDbG9zZVJlZ2V4ID0gLyg8XFwvKShbXj5dKykoPikvZ1xuXG5qc3hUYWdTdGFydFBhdHRlcm4gPSAnKD94KSgoXnw9fHJldHVybilcXFxccyo8KFteIS8/XSg/IS4rPyg8Ly4rPz4pKSkpJ1xuanN4Q29tcGxleEF0dHJpYnV0ZVBhdHRlcm4gPSAnKD94KVxcXFx7IFtefVwiXFwnXSogJHxcXFxcKCBbXilcIlxcJ10qICQnXG5kZWNyZWFzZUluZGVudEZvck5leHRMaW5lUGF0dGVybiA9ICcoP3gpXG4vPlxcXFxzKigsfDspP1xcXFxzKiRcbnwgXig/IVxcXFxzKlxcXFw/KVxcXFxzKlxcXFxTKy4qPC9bLV9cXFxcLkEtWmEtejAtOV0rPiQnXG5cbmNsYXNzIEF0b21SZWFjdFxuICBjb25maWc6XG4gICAgZW5hYmxlZEZvckFsbEphdmFzY3JpcHRGaWxlczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5hYmxlIGdyYW1tYXIsIHNuaXBwZXRzIGFuZCBvdGhlciBmZWF0dXJlcyBhdXRvbWF0aWNhbGx5IGZvciBhbGwgLmpzIGZpbGVzLidcbiAgICBkaXNhYmxlQXV0b0Nsb3NlOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246ICdEaXNhYmxlZCB0YWcgYXV0b2NvbXBsZXRpb24nXG4gICAgc2tpcFVuZG9TdGFja0ZvckF1dG9DbG9zZUluc2VydGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246ICdXaGVuIGVuYWJsZWQsIGF1dG8gaW5zZXJ0L3JlbW92ZSBjbG9zaW5nIHRhZyBtdXRhdGlvbiBpcyBza2lwcGVkIGZyb20gbm9ybWFsIHVuZG8vcmVkbyBvcGVyYXRpb24nXG4gICAgZGV0ZWN0UmVhY3RGaWxlUGF0dGVybjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0RGV0ZWN0UmVhY3RGaWxlUGF0dGVyblxuICAgIGpzeFRhZ1N0YXJ0UGF0dGVybjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBqc3hUYWdTdGFydFBhdHRlcm5cbiAgICBqc3hDb21wbGV4QXR0cmlidXRlUGF0dGVybjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBqc3hDb21wbGV4QXR0cmlidXRlUGF0dGVyblxuICAgIGRlY3JlYXNlSW5kZW50Rm9yTmV4dExpbmVQYXR0ZXJuOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IGRlY3JlYXNlSW5kZW50Rm9yTmV4dExpbmVQYXR0ZXJuXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gIHBhdGNoRWRpdG9yTGFuZ01vZGVBdXRvRGVjcmVhc2VJbmRlbnRGb3JCdWZmZXJSb3c6IChlZGl0b3IpIC0+XG4gICAgc2VsZiA9IHRoaXNcbiAgICBmbiA9IGVkaXRvci5hdXRvRGVjcmVhc2VJbmRlbnRGb3JCdWZmZXJSb3dcbiAgICByZXR1cm4gaWYgZm4uanN4UGF0Y2hcblxuICAgIGVkaXRvci5hdXRvRGVjcmVhc2VJbmRlbnRGb3JCdWZmZXJSb3cgPSAoYnVmZmVyUm93LCBvcHRpb25zKSAtPlxuICAgICAgcmV0dXJuIGZuLmNhbGwoZWRpdG9yLCBidWZmZXJSb3csIG9wdGlvbnMpIHVubGVzcyBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSA9PSBcInNvdXJjZS5qcy5qc3hcIlxuXG4gICAgICBzY29wZURlc2NyaXB0b3IgPSBAc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW2J1ZmZlclJvdywgMF0pXG4gICAgICBkZWNyZWFzZU5leHRMaW5lSW5kZW50UmVnZXggPSBAdG9rZW5pemVkQnVmZmVyLnJlZ2V4Rm9yUGF0dGVybihhdG9tLmNvbmZpZy5nZXQoJ3JlYWN0LmRlY3JlYXNlSW5kZW50Rm9yTmV4dExpbmVQYXR0ZXJuJykgfHzCoGRlY3JlYXNlSW5kZW50Rm9yTmV4dExpbmVQYXR0ZXJuKVxuICAgICAgZGVjcmVhc2VJbmRlbnRSZWdleCA9IEB0b2tlbml6ZWRCdWZmZXIuZGVjcmVhc2VJbmRlbnRSZWdleEZvclNjb3BlRGVzY3JpcHRvcihzY29wZURlc2NyaXB0b3IpXG4gICAgICBpbmNyZWFzZUluZGVudFJlZ2V4ID0gQHRva2VuaXplZEJ1ZmZlci5pbmNyZWFzZUluZGVudFJlZ2V4Rm9yU2NvcGVEZXNjcmlwdG9yKHNjb3BlRGVzY3JpcHRvcilcblxuICAgICAgcHJlY2VkaW5nUm93ID0gQHRva2VuaXplZEJ1ZmZlci5idWZmZXIucHJldmlvdXNOb25CbGFua1JvdyhidWZmZXJSb3cpXG5cbiAgICAgIHJldHVybiBpZiBwcmVjZWRpbmdSb3cgPCAwXG5cbiAgICAgIHByZWNlZGluZ0xpbmUgPSBAdG9rZW5pemVkQnVmZmVyLmJ1ZmZlci5saW5lRm9yUm93KHByZWNlZGluZ1JvdylcbiAgICAgIGxpbmUgPSBAdG9rZW5pemVkQnVmZmVyLmJ1ZmZlci5saW5lRm9yUm93KGJ1ZmZlclJvdylcblxuICAgICAgaWYgcHJlY2VkaW5nTGluZSBhbmQgZGVjcmVhc2VOZXh0TGluZUluZGVudFJlZ2V4LnRlc3RTeW5jKHByZWNlZGluZ0xpbmUpIGFuZFxuICAgICAgICAgbm90IChpbmNyZWFzZUluZGVudFJlZ2V4IGFuZCBpbmNyZWFzZUluZGVudFJlZ2V4LnRlc3RTeW5jKHByZWNlZGluZ0xpbmUpKSBhbmRcbiAgICAgICAgIG5vdCBAaXNCdWZmZXJSb3dDb21tZW50ZWQocHJlY2VkaW5nUm93KVxuICAgICAgICBjdXJyZW50SW5kZW50TGV2ZWwgPSBAaW5kZW50YXRpb25Gb3JCdWZmZXJSb3cocHJlY2VkaW5nUm93KVxuICAgICAgICBjdXJyZW50SW5kZW50TGV2ZWwgLT0gMSBpZiBkZWNyZWFzZUluZGVudFJlZ2V4IGFuZCBkZWNyZWFzZUluZGVudFJlZ2V4LnRlc3RTeW5jKGxpbmUpXG4gICAgICAgIGRlc2lyZWRJbmRlbnRMZXZlbCA9IGN1cnJlbnRJbmRlbnRMZXZlbCAtIDFcbiAgICAgICAgaWYgZGVzaXJlZEluZGVudExldmVsID49IDAgYW5kIGRlc2lyZWRJbmRlbnRMZXZlbCA8IGN1cnJlbnRJbmRlbnRMZXZlbFxuICAgICAgICAgIEBzZXRJbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhidWZmZXJSb3csIGRlc2lyZWRJbmRlbnRMZXZlbClcbiAgICAgIGVsc2UgaWYgbm90IEBpc0J1ZmZlclJvd0NvbW1lbnRlZChidWZmZXJSb3cpXG4gICAgICAgIGZuLmNhbGwoZWRpdG9yLCBidWZmZXJSb3csIG9wdGlvbnMpXG5cbiAgcGF0Y2hFZGl0b3JMYW5nTW9kZVN1Z2dlc3RlZEluZGVudEZvckJ1ZmZlclJvdzogKGVkaXRvcikgLT5cbiAgICBzZWxmID0gdGhpc1xuICAgIGZuID0gZWRpdG9yLnN1Z2dlc3RlZEluZGVudEZvckJ1ZmZlclJvd1xuICAgIHJldHVybiBpZiBmbi5qc3hQYXRjaFxuXG4gICAgZWRpdG9yLnN1Z2dlc3RlZEluZGVudEZvckJ1ZmZlclJvdyA9IChidWZmZXJSb3csIG9wdGlvbnMpIC0+XG4gICAgICBpbmRlbnQgPSBmbi5jYWxsKGVkaXRvciwgYnVmZmVyUm93LCBvcHRpb25zKVxuICAgICAgcmV0dXJuIGluZGVudCB1bmxlc3MgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUgPT0gXCJzb3VyY2UuanMuanN4XCIgYW5kIGJ1ZmZlclJvdyA+IDFcblxuICAgICAgc2NvcGVEZXNjcmlwdG9yID0gQHNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFtidWZmZXJSb3csIDBdKVxuXG4gICAgICBkZWNyZWFzZU5leHRMaW5lSW5kZW50UmVnZXggPSBAdG9rZW5pemVkQnVmZmVyLnJlZ2V4Rm9yUGF0dGVybihhdG9tLmNvbmZpZy5nZXQoJ3JlYWN0LmRlY3JlYXNlSW5kZW50Rm9yTmV4dExpbmVQYXR0ZXJuJykgfHzCoGRlY3JlYXNlSW5kZW50Rm9yTmV4dExpbmVQYXR0ZXJuKVxuICAgICAgaW5jcmVhc2VJbmRlbnRSZWdleCA9IEB0b2tlbml6ZWRCdWZmZXIuaW5jcmVhc2VJbmRlbnRSZWdleEZvclNjb3BlRGVzY3JpcHRvcihzY29wZURlc2NyaXB0b3IpXG5cbiAgICAgIGRlY3JlYXNlSW5kZW50UmVnZXggPSBAdG9rZW5pemVkQnVmZmVyLmRlY3JlYXNlSW5kZW50UmVnZXhGb3JTY29wZURlc2NyaXB0b3Ioc2NvcGVEZXNjcmlwdG9yKVxuICAgICAgdGFnU3RhcnRSZWdleCA9IEB0b2tlbml6ZWRCdWZmZXIucmVnZXhGb3JQYXR0ZXJuKGF0b20uY29uZmlnLmdldCgncmVhY3QuanN4VGFnU3RhcnRQYXR0ZXJuJykgfHzCoGpzeFRhZ1N0YXJ0UGF0dGVybilcbiAgICAgIGNvbXBsZXhBdHRyaWJ1dGVSZWdleCA9IEB0b2tlbml6ZWRCdWZmZXIucmVnZXhGb3JQYXR0ZXJuKGF0b20uY29uZmlnLmdldCgncmVhY3QuanN4Q29tcGxleEF0dHJpYnV0ZVBhdHRlcm4nKSB8fMKganN4Q29tcGxleEF0dHJpYnV0ZVBhdHRlcm4pXG5cbiAgICAgIHByZWNlZGluZ1JvdyA9IEB0b2tlbml6ZWRCdWZmZXIuYnVmZmVyLnByZXZpb3VzTm9uQmxhbmtSb3coYnVmZmVyUm93KVxuXG4gICAgICByZXR1cm4gaW5kZW50IGlmIHByZWNlZGluZ1JvdyA8IDBcblxuICAgICAgcHJlY2VkaW5nTGluZSA9IEB0b2tlbml6ZWRCdWZmZXIuYnVmZmVyLmxpbmVGb3JSb3cocHJlY2VkaW5nUm93KVxuXG4gICAgICByZXR1cm4gaW5kZW50IGlmIG5vdCBwcmVjZWRpbmdMaW5lP1xuXG4gICAgICBpZiBAaXNCdWZmZXJSb3dDb21tZW50ZWQoYnVmZmVyUm93KSBhbmQgQGlzQnVmZmVyUm93Q29tbWVudGVkKHByZWNlZGluZ1JvdylcbiAgICAgICAgcmV0dXJuIEBpbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhwcmVjZWRpbmdSb3cpXG5cbiAgICAgIHRhZ1N0YXJ0VGVzdCA9IHRhZ1N0YXJ0UmVnZXgudGVzdFN5bmMocHJlY2VkaW5nTGluZSlcbiAgICAgIGRlY3JlYXNlSW5kZW50VGVzdCA9IGRlY3JlYXNlSW5kZW50UmVnZXgudGVzdFN5bmMocHJlY2VkaW5nTGluZSlcblxuICAgICAgaW5kZW50ICs9IDEgaWYgdGFnU3RhcnRUZXN0IGFuZCBjb21wbGV4QXR0cmlidXRlUmVnZXgudGVzdFN5bmMocHJlY2VkaW5nTGluZSkgYW5kIG5vdCBAaXNCdWZmZXJSb3dDb21tZW50ZWQocHJlY2VkaW5nUm93KVxuICAgICAgaW5kZW50IC09IDEgaWYgcHJlY2VkaW5nTGluZSBhbmQgbm90IGRlY3JlYXNlSW5kZW50VGVzdCBhbmQgZGVjcmVhc2VOZXh0TGluZUluZGVudFJlZ2V4LnRlc3RTeW5jKHByZWNlZGluZ0xpbmUpIGFuZCBub3QgQGlzQnVmZmVyUm93Q29tbWVudGVkKHByZWNlZGluZ1JvdylcblxuICAgICAgcmV0dXJuIE1hdGgubWF4KGluZGVudCwgMClcblxuICBwYXRjaEVkaXRvckxhbmdNb2RlOiAoZWRpdG9yKSAtPlxuICAgIEBwYXRjaEVkaXRvckxhbmdNb2RlU3VnZ2VzdGVkSW5kZW50Rm9yQnVmZmVyUm93KGVkaXRvcik/LmpzeFBhdGNoID0gdHJ1ZVxuICAgIEBwYXRjaEVkaXRvckxhbmdNb2RlQXV0b0RlY3JlYXNlSW5kZW50Rm9yQnVmZmVyUm93KGVkaXRvcik/LmpzeFBhdGNoID0gdHJ1ZVxuXG4gIGlzUmVhY3Q6ICh0ZXh0KSAtPlxuICAgIHJldHVybiB0cnVlIGlmIGF0b20uY29uZmlnLmdldCgncmVhY3QuZW5hYmxlZEZvckFsbEphdmFzY3JpcHRGaWxlcycpXG5cblxuICAgIGlmIG5vdCBjb250ZW50Q2hlY2tSZWdleD9cbiAgICAgIG1hdGNoID0gKGF0b20uY29uZmlnLmdldCgncmVhY3QuZGV0ZWN0UmVhY3RGaWxlUGF0dGVybicpIHx8IGRlZmF1bHREZXRlY3RSZWFjdEZpbGVQYXR0ZXJuKS5tYXRjaChuZXcgUmVnRXhwKCdeLyguKj8pLyhbZ2lteV0qKSQnKSk7XG4gICAgICBjb250ZW50Q2hlY2tSZWdleCA9IG5ldyBSZWdFeHAobWF0Y2hbMV0sIG1hdGNoWzJdKVxuICAgIHJldHVybiB0ZXh0Lm1hdGNoKGNvbnRlbnRDaGVja1JlZ2V4KT9cblxuICBpc1JlYWN0RW5hYmxlZEZvckVkaXRvcjogKGVkaXRvcikgLT5cbiAgICByZXR1cm4gZWRpdG9yPyAmJiBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSBpbiBbXCJzb3VyY2UuanMuanN4XCIsIFwic291cmNlLmNvZmZlZS5qc3hcIl1cblxuICBhdXRvU2V0R3JhbW1hcjogKGVkaXRvcikgLT5cbiAgICByZXR1cm4gaWYgQGlzUmVhY3RFbmFibGVkRm9yRWRpdG9yIGVkaXRvclxuXG4gICAgcGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbiAgICAjIENoZWNrIGlmIGZpbGUgZXh0ZW5zaW9uIGlzIC5qc3ggb3IgdGhlIGZpbGUgcmVxdWlyZXMgUmVhY3RcbiAgICBleHROYW1lID0gcGF0aC5leHRuYW1lKGVkaXRvci5nZXRQYXRoKCkgb3IgJycpXG4gICAgaWYgZXh0TmFtZSBpcyBcIi5qc3hcIiBvciAoKGV4dE5hbWUgaXMgXCIuanNcIiBvciBleHROYW1lIGlzIFwiLmVzNlwiKSBhbmQgQGlzUmVhY3QoZWRpdG9yLmdldFRleHQoKSkpXG4gICAgICBqc3hHcmFtbWFyID0gYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKFwic291cmNlLmpzLmpzeFwiKVxuICAgICAgZWRpdG9yLnNldEdyYW1tYXIganN4R3JhbW1hciBpZiBqc3hHcmFtbWFyXG5cbiAgb25IVE1MVG9KU1g6IC0+XG4gICAganN4Zm9ybWF0ID0gcmVxdWlyZSAnanN4Zm9ybWF0J1xuICAgIEhUTUx0b0pTWCA9IHJlcXVpcmUgJy4vaHRtbHRvanN4J1xuICAgIGNvbnZlcnRlciA9IG5ldyBIVE1MdG9KU1goY3JlYXRlQ2xhc3M6IGZhbHNlKVxuXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICByZXR1cm4gaWYgbm90IEBpc1JlYWN0RW5hYmxlZEZvckVkaXRvciBlZGl0b3JcblxuICAgIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG5cbiAgICBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIGZvciBzZWxlY3Rpb24gaW4gc2VsZWN0aW9uc1xuICAgICAgICB0cnlcbiAgICAgICAgICBzZWxlY3Rpb25UZXh0ID0gc2VsZWN0aW9uLmdldFRleHQoKVxuICAgICAgICAgIGpzeE91dHB1dCA9IGNvbnZlcnRlci5jb252ZXJ0KHNlbGVjdGlvblRleHQpXG5cbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIGpzeGZvcm1hdC5zZXRPcHRpb25zKHt9KTtcbiAgICAgICAgICAgIGpzeE91dHB1dCA9IGpzeGZvcm1hdC5mb3JtYXQoanN4T3V0cHV0KVxuXG4gICAgICAgICAgc2VsZWN0aW9uLmluc2VydFRleHQoanN4T3V0cHV0KTtcbiAgICAgICAgICByYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpO1xuICAgICAgICAgIGVkaXRvci5hdXRvSW5kZW50QnVmZmVyUm93cyhyYW5nZS5zdGFydC5yb3csIHJhbmdlLmVuZC5yb3cpXG5cbiAgb25SZWZvcm1hdDogLT5cbiAgICBqc3hmb3JtYXQgPSByZXF1aXJlICdqc3hmb3JtYXQnXG4gICAgXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgcmV0dXJuIGlmIG5vdCBAaXNSZWFjdEVuYWJsZWRGb3JFZGl0b3IgZWRpdG9yXG5cbiAgICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgIGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgZm9yIHNlbGVjdGlvbiBpbiBzZWxlY3Rpb25zXG4gICAgICAgIHRyeVxuICAgICAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCk7XG4gICAgICAgICAgc2VyaWFsaXplZFJhbmdlID0gcmFuZ2Uuc2VyaWFsaXplKClcbiAgICAgICAgICBidWZTdGFydCA9IHNlcmlhbGl6ZWRSYW5nZVswXVxuICAgICAgICAgIGJ1ZkVuZCA9IHNlcmlhbGl6ZWRSYW5nZVsxXVxuXG4gICAgICAgICAganN4Zm9ybWF0LnNldE9wdGlvbnMoe30pO1xuICAgICAgICAgIHJlc3VsdCA9IGpzeGZvcm1hdC5mb3JtYXQoc2VsZWN0aW9uLmdldFRleHQoKSlcblxuICAgICAgICAgIG9yaWdpbmFsTGluZUNvdW50ID0gZWRpdG9yLmdldExpbmVDb3VudCgpXG4gICAgICAgICAgc2VsZWN0aW9uLmluc2VydFRleHQocmVzdWx0KVxuICAgICAgICAgIG5ld0xpbmVDb3VudCA9IGVkaXRvci5nZXRMaW5lQ291bnQoKVxuXG4gICAgICAgICAgZWRpdG9yLmF1dG9JbmRlbnRCdWZmZXJSb3dzKGJ1ZlN0YXJ0WzBdLCBidWZFbmRbMF0gKyAobmV3TGluZUNvdW50IC0gb3JpZ2luYWxMaW5lQ291bnQpKVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihidWZTdGFydClcbiAgICAgICAgY2F0Y2ggZXJyXG4gICAgICAgICAgIyBQYXJzaW5nL2Zvcm1hdHRpbmcgdGhlIHNlbGVjdGlvbiBmYWlsZWQgbGV0cyB0cnkgdG8gcGFyc2UgdGhlIHdob2xlIGZpbGUgYnV0IGZvcm1hdCB0aGUgc2VsZWN0aW9uIG9ubHlcbiAgICAgICAgICByYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLnNlcmlhbGl6ZSgpXG4gICAgICAgICAgIyBlc3ByaW1hIGFzdCBsaW5lIGNvdW50IHN0YXJ0cyBmb3IgMVxuICAgICAgICAgIHJhbmdlWzBdWzBdKytcbiAgICAgICAgICByYW5nZVsxXVswXSsrXG5cbiAgICAgICAgICBqc3hmb3JtYXQuc2V0T3B0aW9ucyh7cmFuZ2U6IHJhbmdlfSk7XG5cbiAgICAgICAgICAjIFRPRE86IHVzZSBmb2xkXG4gICAgICAgICAgb3JpZ2luYWwgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuXG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICByZXN1bHQgPSBqc3hmb3JtYXQuZm9ybWF0KG9yaWdpbmFsKVxuICAgICAgICAgICAgc2VsZWN0aW9uLmNsZWFyKClcblxuICAgICAgICAgICAgb3JpZ2luYWxMaW5lQ291bnQgPSBlZGl0b3IuZ2V0TGluZUNvdW50KClcbiAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0KHJlc3VsdClcbiAgICAgICAgICAgIG5ld0xpbmVDb3VudCA9IGVkaXRvci5nZXRMaW5lQ291bnQoKVxuXG4gICAgICAgICAgICBmaXJzdENoYW5nZWRMaW5lID0gcmFuZ2VbMF1bMF0gLSAxXG4gICAgICAgICAgICBsYXN0Q2hhbmdlZExpbmUgPSByYW5nZVsxXVswXSAtIDEgKyAobmV3TGluZUNvdW50IC0gb3JpZ2luYWxMaW5lQ291bnQpXG5cbiAgICAgICAgICAgIGVkaXRvci5hdXRvSW5kZW50QnVmZmVyUm93cyhmaXJzdENoYW5nZWRMaW5lLCBsYXN0Q2hhbmdlZExpbmUpXG5cbiAgICAgICAgICAgICMgcmV0dXJuIGJhY2tcbiAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbZmlyc3RDaGFuZ2VkTGluZSwgcmFuZ2VbMF1bMV1dKVxuXG4gIGF1dG9DbG9zZVRhZzogKGV2ZW50T2JqLCBlZGl0b3IpIC0+XG4gICAgcmV0dXJuIGlmIGF0b20uY29uZmlnLmdldCgncmVhY3QuZGlzYWJsZUF1dG9DbG9zZScpXG5cbiAgICByZXR1cm4gaWYgbm90IEBpc1JlYWN0RW5hYmxlZEZvckVkaXRvcihlZGl0b3IpIG9yIGVkaXRvciAhPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIGlmIGV2ZW50T2JqPy5uZXdUZXh0IGlzICc+JyBhbmQgIWV2ZW50T2JqLm9sZFRleHRcbiAgICAgICMgYXV0byBjbG9zaW5nIG11bHRpcGxlIGN1cnNvcnMgaXMgYSBsaXR0bGUgYml0IHRyaWNreSBzbyBsZXRzIGRpc2FibGUgaXQgZm9yIG5vd1xuICAgICAgcmV0dXJuIGlmIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKS5sZW5ndGggPiAxO1xuXG4gICAgICB0b2tlbml6ZWRMaW5lID0gZWRpdG9yLnRva2VuaXplZEJ1ZmZlcj8udG9rZW5pemVkTGluZUZvclJvdyhldmVudE9iai5uZXdSYW5nZS5lbmQucm93KVxuICAgICAgcmV0dXJuIGlmIG5vdCB0b2tlbml6ZWRMaW5lP1xuXG4gICAgICB0b2tlbiA9IHRva2VuaXplZExpbmUudG9rZW5BdEJ1ZmZlckNvbHVtbihldmVudE9iai5uZXdSYW5nZS5lbmQuY29sdW1uIC0gMSlcblxuICAgICAgaWYgbm90IHRva2VuPyBvciB0b2tlbi5zY29wZXMuaW5kZXhPZigndGFnLm9wZW4uanMnKSA9PSAtMSBvciB0b2tlbi5zY29wZXMuaW5kZXhPZigncHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzJykgPT0gLTFcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGxpbmVzID0gZWRpdG9yLmJ1ZmZlci5nZXRMaW5lcygpXG4gICAgICByb3cgPSBldmVudE9iai5uZXdSYW5nZS5lbmQucm93XG4gICAgICBsaW5lID0gbGluZXNbcm93XVxuICAgICAgbGluZSA9IGxpbmUuc3Vic3RyIDAsIGV2ZW50T2JqLm5ld1JhbmdlLmVuZC5jb2x1bW5cblxuICAgICAgIyBUYWcgaXMgc2VsZiBjbG9zaW5nXG4gICAgICByZXR1cm4gaWYgbGluZS5zdWJzdHIobGluZS5sZW5ndGggLSAyLCAxKSBpcyAnLydcblxuICAgICAgdGFnTmFtZSA9IG51bGxcblxuICAgICAgd2hpbGUgbGluZT8gYW5kIG5vdCB0YWdOYW1lP1xuICAgICAgICBtYXRjaCA9IGxpbmUubWF0Y2ggYXV0b0NvbXBsZXRlVGFnU3RhcnRSZWdleFxuICAgICAgICBpZiBtYXRjaD8gJiYgbWF0Y2gubGVuZ3RoID4gMFxuICAgICAgICAgIHRhZ05hbWUgPSBtYXRjaC5wb3AoKS5zdWJzdHIoMSlcbiAgICAgICAgcm93LS1cbiAgICAgICAgbGluZSA9IGxpbmVzW3Jvd11cblxuICAgICAgaWYgdGFnTmFtZT9cbiAgICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdyZWFjdC5za2lwVW5kb1N0YWNrRm9yQXV0b0Nsb3NlSW5zZXJ0aW9uJylcbiAgICAgICAgICBvcHRpb25zID0ge3VuZG86ICdza2lwJ31cbiAgICAgICAgZWxzZVxuICAgICAgICAgIG9wdGlvbnMgPSB7fVxuICAgICAgICAgIFxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnPC8nICsgdGFnTmFtZSArICc+Jywgb3B0aW9ucylcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKGV2ZW50T2JqLm5ld1JhbmdlLmVuZClcblxuICAgIGVsc2UgaWYgZXZlbnRPYmo/Lm9sZFRleHQgaXMgJz4nIGFuZCBldmVudE9iaj8ubmV3VGV4dCBpcyAnJ1xuXG4gICAgICBsaW5lcyA9IGVkaXRvci5idWZmZXIuZ2V0TGluZXMoKVxuICAgICAgcm93ID0gZXZlbnRPYmoubmV3UmFuZ2UuZW5kLnJvd1xuICAgICAgZnVsbExpbmUgPSBsaW5lc1tyb3ddXG5cbiAgICAgIHRva2VuaXplZExpbmUgPSBlZGl0b3IudG9rZW5pemVkQnVmZmVyPy50b2tlbml6ZWRMaW5lRm9yUm93KGV2ZW50T2JqLm5ld1JhbmdlLmVuZC5yb3cpXG4gICAgICByZXR1cm4gaWYgbm90IHRva2VuaXplZExpbmU/XG5cbiAgICAgIHRva2VuID0gdG9rZW5pemVkTGluZS50b2tlbkF0QnVmZmVyQ29sdW1uKGV2ZW50T2JqLm5ld1JhbmdlLmVuZC5jb2x1bW4gLSAxKVxuICAgICAgaWYgbm90IHRva2VuPyBvciB0b2tlbi5zY29wZXMuaW5kZXhPZigndGFnLm9wZW4uanMnKSA9PSAtMVxuICAgICAgICByZXR1cm5cbiAgICAgIGxpbmUgPSBmdWxsTGluZS5zdWJzdHIgMCwgZXZlbnRPYmoubmV3UmFuZ2UuZW5kLmNvbHVtblxuXG4gICAgICAjIFRhZyBpcyBzZWxmIGNsb3NpbmdcbiAgICAgIHJldHVybiBpZiBsaW5lLnN1YnN0cihsaW5lLmxlbmd0aCAtIDEsIDEpIGlzICcvJ1xuXG4gICAgICB0YWdOYW1lID0gbnVsbFxuXG4gICAgICB3aGlsZSBsaW5lPyBhbmQgbm90IHRhZ05hbWU/XG4gICAgICAgIG1hdGNoID0gbGluZS5tYXRjaCBhdXRvQ29tcGxldGVUYWdTdGFydFJlZ2V4XG4gICAgICAgIGlmIG1hdGNoPyAmJiBtYXRjaC5sZW5ndGggPiAwXG4gICAgICAgICAgdGFnTmFtZSA9IG1hdGNoLnBvcCgpLnN1YnN0cigxKVxuICAgICAgICByb3ctLVxuICAgICAgICBsaW5lID0gbGluZXNbcm93XVxuXG4gICAgICBpZiB0YWdOYW1lP1xuICAgICAgICByZXN0ID0gZnVsbExpbmUuc3Vic3RyKGV2ZW50T2JqLm5ld1JhbmdlLmVuZC5jb2x1bW4pXG4gICAgICAgIGlmIHJlc3QuaW5kZXhPZignPC8nICsgdGFnTmFtZSArICc+JykgPT0gMFxuICAgICAgICAgICMgcmVzdCBpcyBjbG9zaW5nIHRhZ1xuICAgICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgncmVhY3Quc2tpcFVuZG9TdGFja0ZvckF1dG9DbG9zZUluc2VydGlvbicpXG4gICAgICAgICAgICBvcHRpb25zID0ge3VuZG86ICdza2lwJ31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBvcHRpb25zID0ge31cbiAgICAgICAgICBzZXJpYWxpemVkRW5kUG9pbnQgPSBbZXZlbnRPYmoubmV3UmFuZ2UuZW5kLnJvdywgZXZlbnRPYmoubmV3UmFuZ2UuZW5kLmNvbHVtbl07XG4gICAgICAgICAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBzZXJpYWxpemVkRW5kUG9pbnQsXG4gICAgICAgICAgICAgIFtzZXJpYWxpemVkRW5kUG9pbnRbMF0sIHNlcmlhbGl6ZWRFbmRQb2ludFsxXSArIHRhZ05hbWUubGVuZ3RoICsgM11cbiAgICAgICAgICAgIF1cbiAgICAgICAgICAsICcnLCBvcHRpb25zKVxuXG4gICAgZWxzZSBpZiBldmVudE9iaj8gYW5kIGV2ZW50T2JqLm5ld1RleHQubWF0Y2ggL1xccj9cXG4vXG4gICAgICBsaW5lcyA9IGVkaXRvci5idWZmZXIuZ2V0TGluZXMoKVxuICAgICAgcm93ID0gZXZlbnRPYmoubmV3UmFuZ2UuZW5kLnJvd1xuICAgICAgbGFzdExpbmUgPSBsaW5lc1tyb3cgLSAxXVxuICAgICAgZnVsbExpbmUgPSBsaW5lc1tyb3ddXG5cbiAgICAgIGlmIC8+JC8udGVzdChsYXN0TGluZSkgYW5kIGZ1bGxMaW5lLnNlYXJjaChhdXRvQ29tcGxldGVUYWdDbG9zZVJlZ2V4KSA9PSAwXG4gICAgICAgIHdoaWxlIGxhc3RMaW5lP1xuICAgICAgICAgIG1hdGNoID0gbGFzdExpbmUubWF0Y2ggYXV0b0NvbXBsZXRlVGFnU3RhcnRSZWdleFxuICAgICAgICAgIGlmIG1hdGNoPyAmJiBtYXRjaC5sZW5ndGggPiAwXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIHJvdy0tXG4gICAgICAgICAgbGFzdExpbmUgPSBsaW5lc1tyb3ddXG5cbiAgICAgICAgbGFzdExpbmVTcGFjZXMgPSBsYXN0TGluZS5tYXRjaCgvXlxccyovKVxuICAgICAgICBsYXN0TGluZVNwYWNlcyA9IGlmIGxhc3RMaW5lU3BhY2VzPyB0aGVuIGxhc3RMaW5lU3BhY2VzWzBdIGVsc2UgJydcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ1xcbicgKyBsYXN0TGluZVNwYWNlcylcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKGV2ZW50T2JqLm5ld1JhbmdlLmVuZClcblxuICBwcm9jZXNzRWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgIEBwYXRjaEVkaXRvckxhbmdNb2RlKGVkaXRvcilcbiAgICBAYXV0b1NldEdyYW1tYXIoZWRpdG9yKVxuICAgIGRpc3Bvc2FibGVCdWZmZXJFdmVudCA9IGVkaXRvci5idWZmZXIub25EaWRDaGFuZ2UgKGUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBAYXV0b0Nsb3NlVGFnIGUsIGVkaXRvclxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBlZGl0b3Iub25EaWREZXN0cm95ID0+IGRpc3Bvc2FibGVCdWZmZXJFdmVudC5kaXNwb3NlKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQoZGlzcG9zYWJsZUJ1ZmZlckV2ZW50KTtcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgYWN0aXZhdGU6IC0+XG5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG5cbiAgICAjIEJpbmQgZXZlbnRzXG4gICAgZGlzcG9zYWJsZUNvbmZpZ0xpc3RlbmVyID0gYXRvbS5jb25maWcub2JzZXJ2ZSAncmVhY3QuZGV0ZWN0UmVhY3RGaWxlUGF0dGVybicsIChuZXdWYWx1ZSkgLT5cbiAgICAgIGNvbnRlbnRDaGVja1JlZ2V4ID0gbnVsbFxuXG4gICAgZGlzcG9zYWJsZVJlZm9ybWF0ID0gYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3JlYWN0OnJlZm9ybWF0LUpTWCcsID0+IEBvblJlZm9ybWF0KClcbiAgICBkaXNwb3NhYmxlSFRNTFRPSlNYID0gYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3JlYWN0OkhUTUwtdG8tSlNYJywgPT4gQG9uSFRNTFRvSlNYKClcbiAgICBkaXNwb3NhYmxlUHJvY2Vzc0VkaXRvciA9IGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyBAcHJvY2Vzc0VkaXRvci5iaW5kKHRoaXMpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGRpc3Bvc2FibGVDb25maWdMaXN0ZW5lclxuICAgIEBkaXNwb3NhYmxlcy5hZGQgZGlzcG9zYWJsZVJlZm9ybWF0XG4gICAgQGRpc3Bvc2FibGVzLmFkZCBkaXNwb3NhYmxlSFRNTFRPSlNYXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBkaXNwb3NhYmxlUHJvY2Vzc0VkaXRvclxuXG5cbm1vZHVsZS5leHBvcnRzID0gQXRvbVJlYWN0XG4iXX0=
