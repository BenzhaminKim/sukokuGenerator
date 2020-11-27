(function() {
  module.exports = {
    priority: 1,
    providerName: 'autocomplete-python',
    disableForSelector: '.source.python .comment, .source.python .string, .source.python .numeric, .source.python .integer, .source.python .decimal, .source.python .punctuation, .source.python .keyword, .source.python .storage, .source.python .variable.parameter',
    constructed: false,
    constructor: function() {
      this.provider = require('./provider');
      this.log = require('./log');
      this.selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;
      this.Selector = require('selector-kit').Selector;
      this.constructed = true;
      return this.log.debug('Loading python hyper-click provider...');
    },
    _getScopes: function(editor, range) {
      return editor.scopeDescriptorForBufferPosition(range).scopes;
    },
    getSuggestionForWord: function(editor, text, range) {
      var bufferPosition, callback, disableForSelector, scopeChain, scopeDescriptor;
      if (!this.constructed) {
        this.constructor();
      }
      if (text === '.' || text === ':') {
        return;
      }
      if (editor.getGrammar().scopeName.indexOf('source.python') > -1) {
        bufferPosition = range.start;
        scopeDescriptor = editor.scopeDescriptorForBufferPosition(bufferPosition);
        scopeChain = scopeDescriptor.getScopeChain();
        disableForSelector = this.Selector.create(this.disableForSelector);
        if (this.selectorsMatchScopeChain(disableForSelector, scopeChain)) {
          return;
        }
        if (atom.config.get('autocomplete-python.outputDebug')) {
          this.log.debug(range.start, this._getScopes(editor, range.start));
          this.log.debug(range.end, this._getScopes(editor, range.end));
        }
        callback = (function(_this) {
          return function() {
            return _this.provider.load().goToDefinition(editor, bufferPosition);
          };
        })(this);
        return {
          range: range,
          callback: callback
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1weXRob24vbGliL2h5cGVyY2xpY2stcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxDQUFWO0lBQ0EsWUFBQSxFQUFjLHFCQURkO0lBRUEsa0JBQUEsRUFBb0IsK09BRnBCO0lBR0EsV0FBQSxFQUFhLEtBSGI7SUFLQSxXQUFBLEVBQWEsU0FBQTtNQUNYLElBQUMsQ0FBQSxRQUFELEdBQVksT0FBQSxDQUFRLFlBQVI7TUFDWixJQUFDLENBQUEsR0FBRCxHQUFPLE9BQUEsQ0FBUSxPQUFSO01BQ04sSUFBQyxDQUFBLDJCQUE0QixPQUFBLENBQVEsaUJBQVIsRUFBNUI7TUFDRCxJQUFDLENBQUEsV0FBWSxPQUFBLENBQVEsY0FBUixFQUFaO01BQ0YsSUFBQyxDQUFBLFdBQUQsR0FBZTthQUNmLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBTCxDQUFXLHdDQUFYO0lBTlcsQ0FMYjtJQWFBLFVBQUEsRUFBWSxTQUFDLE1BQUQsRUFBUyxLQUFUO0FBQ1YsYUFBTyxNQUFNLENBQUMsZ0NBQVAsQ0FBd0MsS0FBeEMsQ0FBOEMsQ0FBQztJQUQ1QyxDQWJaO0lBZ0JBLG9CQUFBLEVBQXNCLFNBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxLQUFmO0FBQ3BCLFVBQUE7TUFBQSxJQUFHLENBQUksSUFBQyxDQUFBLFdBQVI7UUFDRSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBREY7O01BRUEsSUFBRyxJQUFBLEtBQVMsR0FBVCxJQUFBLElBQUEsS0FBYyxHQUFqQjtBQUNFLGVBREY7O01BRUEsSUFBRyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsU0FBUyxDQUFDLE9BQTlCLENBQXNDLGVBQXRDLENBQUEsR0FBeUQsQ0FBQyxDQUE3RDtRQUNFLGNBQUEsR0FBaUIsS0FBSyxDQUFDO1FBQ3ZCLGVBQUEsR0FBa0IsTUFBTSxDQUFDLGdDQUFQLENBQ2hCLGNBRGdCO1FBRWxCLFVBQUEsR0FBYSxlQUFlLENBQUMsYUFBaEIsQ0FBQTtRQUNiLGtCQUFBLEdBQXFCLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixJQUFDLENBQUEsa0JBQWxCO1FBQ3JCLElBQUcsSUFBQyxDQUFBLHdCQUFELENBQTBCLGtCQUExQixFQUE4QyxVQUE5QyxDQUFIO0FBQ0UsaUJBREY7O1FBR0EsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLENBQUg7VUFDRSxJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBVyxLQUFLLENBQUMsS0FBakIsRUFBd0IsSUFBQyxDQUFBLFVBQUQsQ0FBWSxNQUFaLEVBQW9CLEtBQUssQ0FBQyxLQUExQixDQUF4QjtVQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBTCxDQUFXLEtBQUssQ0FBQyxHQUFqQixFQUFzQixJQUFDLENBQUEsVUFBRCxDQUFZLE1BQVosRUFBb0IsS0FBSyxDQUFDLEdBQTFCLENBQXRCLEVBRkY7O1FBR0EsUUFBQSxHQUFXLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ1QsS0FBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQUEsQ0FBZ0IsQ0FBQyxjQUFqQixDQUFnQyxNQUFoQyxFQUF3QyxjQUF4QztVQURTO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtBQUVYLGVBQU87VUFBQyxPQUFBLEtBQUQ7VUFBUSxVQUFBLFFBQVI7VUFkVDs7SUFMb0IsQ0FoQnRCOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBwcmlvcml0eTogMVxuICBwcm92aWRlck5hbWU6ICdhdXRvY29tcGxldGUtcHl0aG9uJ1xuICBkaXNhYmxlRm9yU2VsZWN0b3I6ICcuc291cmNlLnB5dGhvbiAuY29tbWVudCwgLnNvdXJjZS5weXRob24gLnN0cmluZywgLnNvdXJjZS5weXRob24gLm51bWVyaWMsIC5zb3VyY2UucHl0aG9uIC5pbnRlZ2VyLCAuc291cmNlLnB5dGhvbiAuZGVjaW1hbCwgLnNvdXJjZS5weXRob24gLnB1bmN0dWF0aW9uLCAuc291cmNlLnB5dGhvbiAua2V5d29yZCwgLnNvdXJjZS5weXRob24gLnN0b3JhZ2UsIC5zb3VyY2UucHl0aG9uIC52YXJpYWJsZS5wYXJhbWV0ZXInXG4gIGNvbnN0cnVjdGVkOiBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBwcm92aWRlciA9IHJlcXVpcmUgJy4vcHJvdmlkZXInXG4gICAgQGxvZyA9IHJlcXVpcmUgJy4vbG9nJ1xuICAgIHtAc2VsZWN0b3JzTWF0Y2hTY29wZUNoYWlufSA9IHJlcXVpcmUgJy4vc2NvcGUtaGVscGVycydcbiAgICB7QFNlbGVjdG9yfSA9IHJlcXVpcmUgJ3NlbGVjdG9yLWtpdCdcbiAgICBAY29uc3RydWN0ZWQgPSB0cnVlXG4gICAgQGxvZy5kZWJ1ZyAnTG9hZGluZyBweXRob24gaHlwZXItY2xpY2sgcHJvdmlkZXIuLi4nXG5cbiAgX2dldFNjb3BlczogKGVkaXRvciwgcmFuZ2UpIC0+XG4gICAgcmV0dXJuIGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihyYW5nZSkuc2NvcGVzXG5cbiAgZ2V0U3VnZ2VzdGlvbkZvcldvcmQ6IChlZGl0b3IsIHRleHQsIHJhbmdlKSAtPlxuICAgIGlmIG5vdCBAY29uc3RydWN0ZWRcbiAgICAgIEBjb25zdHJ1Y3RvcigpXG4gICAgaWYgdGV4dCBpbiBbJy4nLCAnOiddXG4gICAgICByZXR1cm5cbiAgICBpZiBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZS5pbmRleE9mKCdzb3VyY2UucHl0aG9uJykgPiAtMVxuICAgICAgYnVmZmVyUG9zaXRpb24gPSByYW5nZS5zdGFydFxuICAgICAgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFxuICAgICAgICBidWZmZXJQb3NpdGlvbilcbiAgICAgIHNjb3BlQ2hhaW4gPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVDaGFpbigpXG4gICAgICBkaXNhYmxlRm9yU2VsZWN0b3IgPSBAU2VsZWN0b3IuY3JlYXRlKEBkaXNhYmxlRm9yU2VsZWN0b3IpXG4gICAgICBpZiBAc2VsZWN0b3JzTWF0Y2hTY29wZUNoYWluKGRpc2FibGVGb3JTZWxlY3Rvciwgc2NvcGVDaGFpbilcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5vdXRwdXREZWJ1ZycpXG4gICAgICAgIEBsb2cuZGVidWcgcmFuZ2Uuc3RhcnQsIEBfZ2V0U2NvcGVzKGVkaXRvciwgcmFuZ2Uuc3RhcnQpXG4gICAgICAgIEBsb2cuZGVidWcgcmFuZ2UuZW5kLCBAX2dldFNjb3BlcyhlZGl0b3IsIHJhbmdlLmVuZClcbiAgICAgIGNhbGxiYWNrID0gPT5cbiAgICAgICAgQHByb3ZpZGVyLmxvYWQoKS5nb1RvRGVmaW5pdGlvbihlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2t9XG4iXX0=
