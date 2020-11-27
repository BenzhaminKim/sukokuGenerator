(function() {
  var StatusBarView,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = StatusBarView = (function() {
    function StatusBarView() {
      this.removeElement = bind(this.removeElement, this);
      this.getElement = bind(this.getElement, this);
      this.element = document.createElement('div');
      this.element.classList.add("highlight-selected-status", "inline-block");
    }

    StatusBarView.prototype.updateCount = function(count) {
      var statusBarString;
      statusBarString = atom.config.get("highlight-selected.statusBarString");
      this.element.textContent = statusBarString.replace("%c", count);
      if (count === 0) {
        return this.element.classList.add("highlight-selected-hidden");
      } else {
        return this.element.classList.remove("highlight-selected-hidden");
      }
    };

    StatusBarView.prototype.getElement = function() {
      return this.element;
    };

    StatusBarView.prototype.removeElement = function() {
      this.element.parentNode.removeChild(this.element);
      return this.element = null;
    };

    return StatusBarView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1zZWxlY3RlZC9saWIvc3RhdHVzLWJhci12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsYUFBQTtJQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyx1QkFBQTs7O01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLDJCQUF2QixFQUFtRCxjQUFuRDtJQUZXOzs0QkFJYixXQUFBLEdBQWEsU0FBQyxLQUFEO0FBQ1gsVUFBQTtNQUFBLGVBQUEsR0FBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQjtNQUNsQixJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsR0FBdUIsZUFBZSxDQUFDLE9BQWhCLENBQXdCLElBQXhCLEVBQThCLEtBQTlCO01BQ3ZCLElBQUcsS0FBQSxLQUFTLENBQVo7ZUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QiwyQkFBdkIsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFuQixDQUEwQiwyQkFBMUIsRUFIRjs7SUFIVzs7NEJBUWIsVUFBQSxHQUFZLFNBQUE7YUFDVixJQUFDLENBQUE7SUFEUzs7NEJBR1osYUFBQSxHQUFlLFNBQUE7TUFDYixJQUFDLENBQUEsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFwQixDQUFnQyxJQUFDLENBQUEsT0FBakM7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRkU7Ozs7O0FBakJqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFN0YXR1c0JhclZpZXdcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZ2hsaWdodC1zZWxlY3RlZC1zdGF0dXNcIixcImlubGluZS1ibG9ja1wiKVxuXG4gIHVwZGF0ZUNvdW50OiAoY291bnQpIC0+XG4gICAgc3RhdHVzQmFyU3RyaW5nID0gYXRvbS5jb25maWcuZ2V0KFwiaGlnaGxpZ2h0LXNlbGVjdGVkLnN0YXR1c0JhclN0cmluZ1wiKVxuICAgIEBlbGVtZW50LnRleHRDb250ZW50ID0gc3RhdHVzQmFyU3RyaW5nLnJlcGxhY2UoXCIlY1wiLCBjb3VudClcbiAgICBpZiBjb3VudCA9PSAwXG4gICAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGlnaGxpZ2h0LXNlbGVjdGVkLWhpZGRlblwiKVxuICAgIGVsc2VcbiAgICAgIEBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWdobGlnaHQtc2VsZWN0ZWQtaGlkZGVuXCIpXG5cbiAgZ2V0RWxlbWVudDogPT5cbiAgICBAZWxlbWVudFxuXG4gIHJlbW92ZUVsZW1lbnQ6ID0+XG4gICAgQGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChAZWxlbWVudClcbiAgICBAZWxlbWVudCA9IG51bGxcbiJdfQ==
