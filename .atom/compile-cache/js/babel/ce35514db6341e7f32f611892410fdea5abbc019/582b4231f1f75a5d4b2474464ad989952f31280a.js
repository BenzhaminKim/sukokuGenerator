'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _require = require('atom');

var CompositeDisposable = _require.CompositeDisposable;

var disposables = new CompositeDisposable();

var toggle = function toggle(enable, text) {
  var body = document.querySelector('body');

  if (enable) {
    body.className = body.className + ' ' + text;
  } else {
    body.className = body.className.replace(' ' + text, '');
  }
};

var activate = function activate() {
  disposables.add(atom.config.observe('seti-icons.noColor', function (value) {
    return toggle(value, 'seti-icons-no-color');
  }));

  // Removes removed setting
  atom.config.unset('seti-icons.iconsPlus');
};

exports.activate = activate;
var deactivate = function deactivate() {
  return disposables.dispose();
};
exports.deactivate = deactivate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9zZXRpLWljb25zL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7OztlQUVxQixPQUFPLENBQUMsTUFBTSxDQUFDOztJQUF2QyxtQkFBbUIsWUFBbkIsbUJBQW1COztBQUMzQixJQUFNLFdBQVcsR0FBRyxJQUFJLG1CQUFtQixFQUFBLENBQUE7O0FBRTNDLElBQU0sTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFLLE1BQU0sRUFBRSxJQUFJLEVBQU07QUFDakMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFM0MsTUFBSyxNQUFNLEVBQUc7QUFDWixRQUFJLENBQUMsU0FBUyxHQUFNLElBQUksQ0FBQyxTQUFTLFNBQUksSUFBSSxBQUFFLENBQUE7R0FDN0MsTUFBTTtBQUNMLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLE9BQUssSUFBSSxFQUFJLEVBQUUsQ0FBQyxDQUFBO0dBQ3hEO0NBQ0YsQ0FBQTs7QUFFTSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsR0FBUztBQUM1QixhQUFXLENBQUMsR0FBRyxDQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLFVBQUEsS0FBSztXQUM3QyxNQUFNLENBQUMsS0FBSyxFQUFFLHFCQUFxQixDQUFDO0dBQUEsQ0FDckMsQ0FDRixDQUFBOzs7QUFHRCxNQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0NBQzFDLENBQUE7OztBQUVNLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVTtTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUU7Q0FBQSxDQUFBIiwiZmlsZSI6ImZpbGU6Ly8vQzovVXNlcnMvdXNlci8uYXRvbS9wYWNrYWdlcy9zZXRpLWljb25zL2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmNvbnN0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSgnYXRvbScpXG5jb25zdCBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbmNvbnN0IHRvZ2dsZSA9ICggZW5hYmxlLCB0ZXh0ICkgPT4ge1xuICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpXG5cbiAgaWYgKCBlbmFibGUgKSB7XG4gICAgYm9keS5jbGFzc05hbWUgPSBgJHtib2R5LmNsYXNzTmFtZX0gJHt0ZXh0fWBcbiAgfSBlbHNlIHtcbiAgICBib2R5LmNsYXNzTmFtZSA9IGJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoYCAke3RleHR9YCwgJycpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFjdGl2YXRlID0gKCkgPT4ge1xuICBkaXNwb3NhYmxlcy5hZGQoXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnc2V0aS1pY29ucy5ub0NvbG9yJywgdmFsdWUgPT5cbiAgICAgIHRvZ2dsZSh2YWx1ZSwgJ3NldGktaWNvbnMtbm8tY29sb3InKVxuICAgIClcbiAgKVxuXG4gIC8vIFJlbW92ZXMgcmVtb3ZlZCBzZXR0aW5nXG4gIGF0b20uY29uZmlnLnVuc2V0KCdzZXRpLWljb25zLmljb25zUGx1cycpXG59XG5cbmV4cG9ydCBjb25zdCBkZWFjdGl2YXRlID0gKCkgPT4gZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4iXX0=