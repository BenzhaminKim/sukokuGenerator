var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

var Intentions = (function () {
  function Intentions() {
    _classCallCheck(this, Intentions);

    this.messages = [];
    this.grammarScopes = ['*'];
  }

  _createClass(Intentions, [{
    key: 'getIntentions',
    value: function getIntentions(_ref) {
      var textEditor = _ref.textEditor;
      var bufferPosition = _ref.bufferPosition;

      var intentions = [];
      var messages = (0, _helpers.filterMessages)(this.messages, textEditor.getPath());

      var _loop = function (message) {
        var hasFixes = message.version === 1 ? message.fix : message.solutions && message.solutions.length;
        if (!hasFixes) {
          return 'continue';
        }
        var range = (0, _helpers.$range)(message);
        var inRange = range && range.containsPoint(bufferPosition);
        if (!inRange) {
          return 'continue';
        }

        var solutions = [];
        if (message.version === 1 && message.fix) {
          solutions.push(message.fix);
        } else if (message.version === 2 && message.solutions && message.solutions.length) {
          solutions = message.solutions;
        }
        var linterName = message.linterName || 'Linter';

        intentions = intentions.concat(solutions.map(function (solution) {
          return {
            priority: solution.priority ? solution.priority + 200 : 200,
            icon: 'tools',
            title: solution.title || 'Fix ' + linterName + ' issue',
            selected: function selected() {
              (0, _helpers.applySolution)(textEditor, message.version, solution);
            }
          };
        }));
      };

      for (var message of messages) {
        var _ret = _loop(message);

        if (_ret === 'continue') continue;
      }
      return intentions;
    }
  }, {
    key: 'update',
    value: function update(messages) {
      this.messages = messages;
    }
  }]);

  return Intentions;
})();

module.exports = Intentions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaW50ZW50aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3VCQUVzRCxXQUFXOztJQUczRCxVQUFVO0FBSUgsV0FKUCxVQUFVLEdBSUE7MEJBSlYsVUFBVTs7QUFLWixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7R0FDM0I7O2VBUEcsVUFBVTs7V0FRRCx1QkFBQyxJQUFzQyxFQUFpQjtVQUFyRCxVQUFVLEdBQVosSUFBc0MsQ0FBcEMsVUFBVTtVQUFFLGNBQWMsR0FBNUIsSUFBc0MsQ0FBeEIsY0FBYzs7QUFDeEMsVUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFVBQU0sUUFBUSxHQUFHLDZCQUFlLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7OzRCQUV6RCxPQUFPO0FBQ2hCLFlBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQTtBQUNwRyxZQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsNEJBQVE7U0FDVDtBQUNELFlBQU0sS0FBSyxHQUFHLHFCQUFPLE9BQU8sQ0FBQyxDQUFBO0FBQzdCLFlBQU0sT0FBTyxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQzVELFlBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWiw0QkFBUTtTQUNUOztBQUVELFlBQUksU0FBd0IsR0FBRyxFQUFFLENBQUE7QUFDakMsWUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ3hDLG1CQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUM1QixNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtBQUNqRixtQkFBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUE7U0FDOUI7QUFDRCxZQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQTs7QUFFakQsa0JBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUM1QixTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUTtpQkFBSztBQUN6QixvQkFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsR0FBRztBQUMzRCxnQkFBSSxFQUFFLE9BQU87QUFDYixpQkFBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLGFBQVcsVUFBVSxXQUFRO0FBQ2xELG9CQUFRLEVBQUEsb0JBQUc7QUFDVCwwQ0FBYyxVQUFVLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQTthQUNyRDtXQUNGO1NBQUMsQ0FBQyxDQUNKLENBQUE7OztBQTVCSCxXQUFLLElBQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTt5QkFBckIsT0FBTzs7aUNBUWQsU0FBUTtPQXFCWDtBQUNELGFBQU8sVUFBVSxDQUFBO0tBQ2xCOzs7V0FDSyxnQkFBQyxRQUE4QixFQUFFO0FBQ3JDLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0tBQ3pCOzs7U0E5Q0csVUFBVTs7O0FBaURoQixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQSIsImZpbGUiOiJmaWxlOi8vL0M6L1VzZXJzL3VzZXIvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL2ludGVudGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyAkcmFuZ2UsIGFwcGx5U29sdXRpb24sIGZpbHRlck1lc3NhZ2VzIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi90eXBlcydcblxuY2xhc3MgSW50ZW50aW9ucyB7XG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPlxuICBncmFtbWFyU2NvcGVzOiBBcnJheTxzdHJpbmc+XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5ncmFtbWFyU2NvcGVzID0gWycqJ11cbiAgfVxuICBnZXRJbnRlbnRpb25zKHsgdGV4dEVkaXRvciwgYnVmZmVyUG9zaXRpb24gfTogT2JqZWN0KTogQXJyYXk8T2JqZWN0PiB7XG4gICAgbGV0IGludGVudGlvbnMgPSBbXVxuICAgIGNvbnN0IG1lc3NhZ2VzID0gZmlsdGVyTWVzc2FnZXModGhpcy5tZXNzYWdlcywgdGV4dEVkaXRvci5nZXRQYXRoKCkpXG5cbiAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICAgIGNvbnN0IGhhc0ZpeGVzID0gbWVzc2FnZS52ZXJzaW9uID09PSAxID8gbWVzc2FnZS5maXggOiBtZXNzYWdlLnNvbHV0aW9ucyAmJiBtZXNzYWdlLnNvbHV0aW9ucy5sZW5ndGhcbiAgICAgIGlmICghaGFzRml4ZXMpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJhbmdlID0gJHJhbmdlKG1lc3NhZ2UpXG4gICAgICBjb25zdCBpblJhbmdlID0gcmFuZ2UgJiYgcmFuZ2UuY29udGFpbnNQb2ludChidWZmZXJQb3NpdGlvbilcbiAgICAgIGlmICghaW5SYW5nZSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBsZXQgc29sdXRpb25zOiBBcnJheTxPYmplY3Q+ID0gW11cbiAgICAgIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDEgJiYgbWVzc2FnZS5maXgpIHtcbiAgICAgICAgc29sdXRpb25zLnB1c2gobWVzc2FnZS5maXgpXG4gICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMiAmJiBtZXNzYWdlLnNvbHV0aW9ucyAmJiBtZXNzYWdlLnNvbHV0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgc29sdXRpb25zID0gbWVzc2FnZS5zb2x1dGlvbnNcbiAgICAgIH1cbiAgICAgIGNvbnN0IGxpbnRlck5hbWUgPSBtZXNzYWdlLmxpbnRlck5hbWUgfHwgJ0xpbnRlcidcblxuICAgICAgaW50ZW50aW9ucyA9IGludGVudGlvbnMuY29uY2F0KFxuICAgICAgICBzb2x1dGlvbnMubWFwKHNvbHV0aW9uID0+ICh7XG4gICAgICAgICAgcHJpb3JpdHk6IHNvbHV0aW9uLnByaW9yaXR5ID8gc29sdXRpb24ucHJpb3JpdHkgKyAyMDAgOiAyMDAsXG4gICAgICAgICAgaWNvbjogJ3Rvb2xzJyxcbiAgICAgICAgICB0aXRsZTogc29sdXRpb24udGl0bGUgfHwgYEZpeCAke2xpbnRlck5hbWV9IGlzc3VlYCxcbiAgICAgICAgICBzZWxlY3RlZCgpIHtcbiAgICAgICAgICAgIGFwcGx5U29sdXRpb24odGV4dEVkaXRvciwgbWVzc2FnZS52ZXJzaW9uLCBzb2x1dGlvbilcbiAgICAgICAgICB9LFxuICAgICAgICB9KSksXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBpbnRlbnRpb25zXG4gIH1cbiAgdXBkYXRlKG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPikge1xuICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZW50aW9uc1xuIl19