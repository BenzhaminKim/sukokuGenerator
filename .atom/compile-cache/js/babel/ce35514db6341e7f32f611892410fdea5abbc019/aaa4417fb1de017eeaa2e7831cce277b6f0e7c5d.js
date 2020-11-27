Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _codeContext = require('./code-context');

var _codeContext2 = _interopRequireDefault(_codeContext);

var _grammars = require('./grammars');

var _grammars2 = _interopRequireDefault(_grammars);

'use babel';

var CodeContextBuilder = (function () {
  function CodeContextBuilder() {
    var emitter = arguments.length <= 0 || arguments[0] === undefined ? new _atom.Emitter() : arguments[0];

    _classCallCheck(this, CodeContextBuilder);

    this.emitter = emitter;
  }

  _createClass(CodeContextBuilder, [{
    key: 'destroy',
    value: function destroy() {
      this.emitter.dispose();
    }

    // Public: Builds code context for specified argType
    //
    // editor - Atom's {TextEditor} instance
    // argType - {String} with one of the following values:
    //
    // * "Selection Based" (default)
    // * "Line Number Based",
    // * "File Based"
    //
    // returns a {CodeContext} object
  }, {
    key: 'buildCodeContext',
    value: function buildCodeContext(editor) {
      var argType = arguments.length <= 1 || arguments[1] === undefined ? 'Selection Based' : arguments[1];

      if (!editor) return null;

      var codeContext = this.initCodeContext(editor);

      codeContext.argType = argType;

      if (argType === 'Line Number Based') {
        editor.save();
      } else if (codeContext.selection.isEmpty() && codeContext.filepath) {
        codeContext.argType = 'File Based';
        if (editor && editor.isModified()) editor.save();
      }

      // Selection and Line Number Based runs both benefit from knowing the current line
      // number
      if (argType !== 'File Based') {
        var cursor = editor.getLastCursor();
        codeContext.lineNumber = cursor.getScreenRow() + 1;
      }

      return codeContext;
    }
  }, {
    key: 'initCodeContext',
    value: function initCodeContext(editor) {
      var filename = editor.getTitle();
      var filepath = editor.getPath();
      var selection = editor.getLastSelection();
      var ignoreSelection = atom.config.get('script.ignoreSelection');

      // If the selection was empty or if ignore selection is on, then "select" ALL
      // of the text
      // This allows us to run on new files
      var textSource = undefined;
      if (selection.isEmpty() || ignoreSelection) {
        textSource = editor;
      } else {
        textSource = selection;
      }

      var codeContext = new _codeContext2['default'](filename, filepath, textSource);
      codeContext.selection = selection;
      codeContext.shebang = this.getShebang(editor);

      var lang = this.getLang(editor);

      if (this.validateLang(lang)) {
        codeContext.lang = lang;
      }

      return codeContext;
    }
  }, {
    key: 'getShebang',
    value: function getShebang(editor) {
      if (process.platform === 'win32') return null;
      var text = editor.getText();
      var lines = text.split('\n');
      var firstLine = lines[0];
      if (!firstLine.match(/^#!/)) return null;

      return firstLine.replace(/^#!\s*/, '');
    }
  }, {
    key: 'getLang',
    value: function getLang(editor) {
      return editor.getGrammar().name;
    }
  }, {
    key: 'validateLang',
    value: function validateLang(lang) {
      var valid = true;

      // Determine if no language is selected.
      if (lang === 'Null Grammar' || lang === 'Plain Text') {
        this.emitter.emit('did-not-specify-language');
        valid = false;

        // Provide them a dialog to submit an issue on GH, prepopulated with their
        // language of choice.
      } else if (!(lang in _grammars2['default'])) {
          this.emitter.emit('did-not-support-language', { lang: lang });
          valid = false;
        }

      return valid;
    }
  }, {
    key: 'onDidNotSpecifyLanguage',
    value: function onDidNotSpecifyLanguage(callback) {
      return this.emitter.on('did-not-specify-language', callback);
    }
  }, {
    key: 'onDidNotSupportLanguage',
    value: function onDidNotSupportLanguage(callback) {
      return this.emitter.on('did-not-support-language', callback);
    }
  }]);

  return CodeContextBuilder;
})();

exports['default'] = CodeContextBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2NvZGUtY29udGV4dC1idWlsZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRXdCLE1BQU07OzJCQUVOLGdCQUFnQjs7Ozt3QkFDakIsWUFBWTs7OztBQUxuQyxXQUFXLENBQUM7O0lBT1Msa0JBQWtCO0FBQzFCLFdBRFEsa0JBQWtCLEdBQ0E7UUFBekIsT0FBTyx5REFBRyxtQkFBYTs7MEJBRGhCLGtCQUFrQjs7QUFFbkMsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7R0FDeEI7O2VBSGtCLGtCQUFrQjs7V0FLOUIsbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3hCOzs7Ozs7Ozs7Ozs7OztXQVllLDBCQUFDLE1BQU0sRUFBK0I7VUFBN0IsT0FBTyx5REFBRyxpQkFBaUI7O0FBQ2xELFVBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxJQUFJLENBQUM7O0FBRXpCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWpELGlCQUFXLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFOUIsVUFBSSxPQUFPLEtBQUssbUJBQW1CLEVBQUU7QUFDbkMsY0FBTSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2YsTUFBTSxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksV0FBVyxDQUFDLFFBQVEsRUFBRTtBQUNsRSxtQkFBVyxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7QUFDbkMsWUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNsRDs7OztBQUlELFVBQUksT0FBTyxLQUFLLFlBQVksRUFBRTtBQUM1QixZQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFF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QUM7S0FDOUQ7OztTQTlHa0Isa0JBQWtCOzs7cUJBQWxCLGtCQUFrQiIsImZpbGUiOiJmaWxlOi8vL0M6L1VzZXJzL3VzZXIvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9jb2RlLWNvbnRleHQtYnVpbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBFbWl0dGVyIH0gZnJvbSAnYXRvbSc7XG5cbmltcG9ydCBDb2RlQ29udGV4dCBmcm9tICcuL2NvZGUtY29udGV4dCc7XG5pbXBvcnQgZ3JhbW1hck1hcCBmcm9tICcuL2dyYW1tYXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29kZUNvbnRleHRCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoZW1pdHRlciA9IG5ldyBFbWl0dGVyKCkpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBlbWl0dGVyO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgLy8gUHVibGljOiBCdWlsZHMgY29kZSBjb250ZXh0IGZvciBzcGVjaWZpZWQgYXJnVHlwZVxuICAvL1xuICAvLyBlZGl0b3IgLSBBdG9tJ3Mge1RleHRFZGl0b3J9IGluc3RhbmNlXG4gIC8vIGFyZ1R5cGUgLSB7U3RyaW5nfSB3aXRoIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczpcbiAgLy9cbiAgLy8gKiBcIlNlbGVjdGlvbiBCYXNlZFwiIChkZWZhdWx0KVxuICAvLyAqIFwiTGluZSBOdW1iZXIgQmFzZWRcIixcbiAgLy8gKiBcIkZpbGUgQmFzZWRcIlxuICAvL1xuICAvLyByZXR1cm5zIGEge0NvZGVDb250ZXh0fSBvYmplY3RcbiAgYnVpbGRDb2RlQ29udGV4dChlZGl0b3IsIGFyZ1R5cGUgPSAnU2VsZWN0aW9uIEJhc2VkJykge1xuICAgIGlmICghZWRpdG9yKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGNvZGVDb250ZXh0ID0gdGhpcy5pbml0Q29kZUNvbnRleHQoZWRpdG9yKTtcblxuICAgIGNvZGVDb250ZXh0LmFyZ1R5cGUgPSBhcmdUeXBlO1xuXG4gICAgaWYgKGFyZ1R5cGUgPT09ICdMaW5lIE51bWJlciBCYXNlZCcpIHtcbiAgICAgIGVkaXRvci5zYXZlKCk7XG4gICAgfSBlbHNlIGlmIChjb2RlQ29udGV4dC5zZWxlY3Rpb24uaXNFbXB0eSgpICYmIGNvZGVDb250ZXh0LmZpbGVwYXRoKSB7XG4gICAgICBjb2RlQ29udGV4dC5hcmdUeXBlID0gJ0ZpbGUgQmFzZWQnO1xuICAgICAgaWYgKGVkaXRvciAmJiBlZGl0b3IuaXNNb2RpZmllZCgpKSBlZGl0b3Iuc2F2ZSgpO1xuICAgIH1cblxuICAgIC8vIFNlbGVjdGlvbiBhbmQgTGluZSBOdW1iZXIgQmFzZWQgcnVucyBib3RoIGJlbmVmaXQgZnJvbSBrbm93aW5nIHRoZSBjdXJyZW50IGxpbmVcbiAgICAvLyBudW1iZXJcbiAgICBpZiAoYXJnVHlwZSAhPT0gJ0ZpbGUgQmFzZWQnKSB7XG4gICAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuICAgICAgY29kZUNvbnRleHQubGluZU51bWJlciA9IGN1cnNvci5nZXRTY3JlZW5Sb3coKSArIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvZGVDb250ZXh0O1xuICB9XG5cbiAgaW5pdENvZGVDb250ZXh0KGVkaXRvcikge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZWRpdG9yLmdldFRpdGxlKCk7XG4gICAgY29uc3QgZmlsZXBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCk7XG4gICAgY29uc3QgaWdub3JlU2VsZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdzY3JpcHQuaWdub3JlU2VsZWN0aW9uJyk7XG5cbiAgICAvLyBJZiB0aGUgc2VsZWN0aW9uIHdhcyBlbXB0eSBvciBpZiBpZ25vcmUgc2VsZWN0aW9uIGlzIG9uLCB0aGVuIFwic2VsZWN0XCIgQUxMXG4gICAgLy8gb2YgdGhlIHRleHRcbiAgICAvLyBUaGlzIGFsbG93cyB1cyB0byBydW4gb24gbmV3IGZpbGVzXG4gICAgbGV0IHRleHRTb3VyY2U7XG4gICAgaWYgKHNlbGVjdGlvbi5pc0VtcHR5KCkgfHwgaWdub3JlU2VsZWN0aW9uKSB7XG4gICAgICB0ZXh0U291cmNlID0gZWRpdG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0U291cmNlID0gc2VsZWN0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IGNvZGVDb250ZXh0ID0gbmV3IENvZGVDb250ZXh0KGZpbGVuYW1lLCBmaWxlcGF0aCwgdGV4dFNvdXJjZSk7XG4gICAgY29kZUNvbnRleHQuc2VsZWN0aW9uID0gc2VsZWN0aW9uO1xuICAgIGNvZGVDb250ZXh0LnNoZWJhbmcgPSB0aGlzLmdldFNoZWJhbmcoZWRpdG9yKTtcblxuICAgIGNvbnN0IGxhbmcgPSB0aGlzLmdldExhbmcoZWRpdG9yKTtcblxuICAgIGlmICh0aGlzLnZhbGlkYXRlTGFuZyhsYW5nKSkge1xuICAgICAgY29kZUNvbnRleHQubGFuZyA9IGxhbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvZGVDb250ZXh0O1xuICB9XG5cbiAgZ2V0U2hlYmFuZyhlZGl0b3IpIHtcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgY29uc3QgbGluZXMgPSB0ZXh0LnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBmaXJzdExpbmUgPSBsaW5lc1swXTtcbiAgICBpZiAoIWZpcnN0TGluZS5tYXRjaCgvXiMhLykpIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIGZpcnN0TGluZS5yZXBsYWNlKC9eIyFcXHMqLywgJycpO1xuICB9XG5cbiAgZ2V0TGFuZyhlZGl0b3IpIHtcbiAgICByZXR1cm4gZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lO1xuICB9XG5cbiAgdmFsaWRhdGVMYW5nKGxhbmcpIHtcbiAgICBsZXQgdmFsaWQgPSB0cnVlO1xuXG4gICAgLy8gRGV0ZXJtaW5lIGlmIG5vIGxhbmd1YWdlIGlzIHNlbGVjdGVkLlxuICAgIGlmIChsYW5nID09PSAnTnVsbCBHcmFtbWFyJyB8fCBsYW5nID09PSAnUGxhaW4gVGV4dCcpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtbm90LXNwZWNpZnktbGFuZ3VhZ2UnKTtcbiAgICAgIHZhbGlkID0gZmFsc2U7XG5cbiAgICAvLyBQcm92aWRlIHRoZW0gYSBkaWFsb2cgdG8gc3VibWl0IGFuIGlzc3VlIG9uIEdILCBwcmVwb3B1bGF0ZWQgd2l0aCB0aGVpclxuICAgIC8vIGxhbmd1YWdlIG9mIGNob2ljZS5cbiAgICB9IGVsc2UgaWYgKCEobGFuZyBpbiBncmFtbWFyTWFwKSkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1ub3Qtc3VwcG9ydC1sYW5ndWFnZScsIHsgbGFuZyB9KTtcbiAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkO1xuICB9XG5cbiAgb25EaWROb3RTcGVjaWZ5TGFuZ3VhZ2UoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtbm90LXNwZWNpZnktbGFuZ3VhZ2UnLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkRpZE5vdFN1cHBvcnRMYW5ndWFnZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1ub3Qtc3VwcG9ydC1sYW5ndWFnZScsIGNhbGxiYWNrKTtcbiAgfVxufVxuIl19