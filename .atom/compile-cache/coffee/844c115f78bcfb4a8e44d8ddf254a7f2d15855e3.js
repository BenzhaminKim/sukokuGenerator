
/*
  lib/sub-atom.coffee
 */

(function() {
  var $, CompositeDisposable, Disposable, SubAtom, ref,
    slice = [].slice;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  $ = require('jquery');

  module.exports = SubAtom = (function() {
    function SubAtom() {
      this.disposables = new CompositeDisposable;
    }

    SubAtom.prototype.addDisposable = function(disposable, disposeEventObj, disposeEventType) {
      var autoDisposables, e;
      if (disposeEventObj) {
        try {
          autoDisposables = new CompositeDisposable;
          autoDisposables.add(disposable);
          autoDisposables.add(disposeEventObj[disposeEventType]((function(_this) {
            return function() {
              autoDisposables.dispose();
              return _this.disposables.remove(autoDisposables);
            };
          })(this)));
          return this.disposables.add(autoDisposables);
        } catch (error) {
          e = error;
          return console.log('SubAtom::add, invalid dispose event', disposeEventObj, disposeEventType, e);
        }
      } else {
        return this.disposables.add(disposable);
      }
    };

    SubAtom.prototype.addElementListener = function(ele, events, selector, disposeEventObj, disposeEventType, handler) {
      var disposable, subscription;
      if (selector) {
        subscription = $(ele).on(events, selector, handler);
      } else {
        subscription = $(ele).on(events, handler);
      }
      disposable = new Disposable(function() {
        return subscription.off(events, handler);
      });
      return this.addDisposable(disposable, disposeEventObj, disposeEventType);
    };

    SubAtom.prototype.add = function() {
      var arg, args, disposeEventObj, disposeEventType, ele, events, handler, i, len, selector, signature;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      signature = '';
      for (i = 0, len = args.length; i < len; i++) {
        arg = args[i];
        switch (typeof arg) {
          case 'string':
            signature += 's';
            break;
          case 'object':
            signature += 'o';
            break;
          case 'function':
            signature += 'f';
        }
      }
      switch (signature) {
        case 'o':
        case 'oos':
          return this.addDisposable.apply(this, args);
        case 'ssf':
        case 'osf':
          ele = args[0], events = args[1], handler = args[2];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ossf':
        case 'sssf':
          ele = args[0], events = args[1], selector = args[2], handler = args[3];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ososf':
        case 'ssosf':
          ele = args[0], events = args[1], disposeEventObj = args[2], disposeEventType = args[3], handler = args[4];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ossosf':
        case 'sssosf':
          ele = args[0], events = args[1], selector = args[2], disposeEventObj = args[3], disposeEventType = args[4], handler = args[5];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        default:
          console.log('SubAtom::add, invalid call signature', args);
      }
    };

    SubAtom.prototype.remove = function() {
      var args, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref1 = this.disposables).remove.apply(ref1, args);
    };

    SubAtom.prototype.clear = function() {
      return this.disposables.clear();
    };

    SubAtom.prototype.dispose = function() {
      return this.disposables.dispose();
    };

    return SubAtom;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F0b20tYXV0b2NvbXBsZXRlLXBocC9ub2RlX21vZHVsZXMvc3ViLWF0b20vbGliL3N1Yi1hdG9tLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtBQUFBLE1BQUEsZ0RBQUE7SUFBQTs7RUFJQSxNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUN0QixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBRUosTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLGlCQUFBO01BQ1gsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO0lBRFI7O3NCQUdiLGFBQUEsR0FBZSxTQUFDLFVBQUQsRUFBYSxlQUFiLEVBQThCLGdCQUE5QjtBQUNiLFVBQUE7TUFBQSxJQUFHLGVBQUg7QUFDRTtVQUNFLGVBQUEsR0FBa0IsSUFBSTtVQUN0QixlQUFlLENBQUMsR0FBaEIsQ0FBb0IsVUFBcEI7VUFDQSxlQUFlLENBQUMsR0FBaEIsQ0FBb0IsZUFBZ0IsQ0FBQSxnQkFBQSxDQUFoQixDQUFrQyxDQUFBLFNBQUEsS0FBQTttQkFBQSxTQUFBO2NBQ3BELGVBQWUsQ0FBQyxPQUFoQixDQUFBO3FCQUNBLEtBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFvQixlQUFwQjtZQUZvRDtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBcEI7aUJBR0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLGVBQWpCLEVBTkY7U0FBQSxhQUFBO1VBT007aUJBQ0osT0FBTyxDQUFDLEdBQVIsQ0FBWSxxQ0FBWixFQUFtRCxlQUFuRCxFQUFvRSxnQkFBcEUsRUFBc0YsQ0FBdEYsRUFSRjtTQURGO09BQUEsTUFBQTtlQVdFLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixVQUFqQixFQVhGOztJQURhOztzQkFjZixrQkFBQSxHQUFvQixTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsUUFBZCxFQUF3QixlQUF4QixFQUF5QyxnQkFBekMsRUFBMkQsT0FBM0Q7QUFDbEIsVUFBQTtNQUFBLElBQUcsUUFBSDtRQUNFLFlBQUEsR0FBZSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsRUFBUCxDQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEIsT0FBNUIsRUFEakI7T0FBQSxNQUFBO1FBR0UsWUFBQSxHQUFlLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxFQUFQLENBQVUsTUFBVixFQUFrQixPQUFsQixFQUhqQjs7TUFJQSxVQUFBLEdBQWEsSUFBSSxVQUFKLENBQWUsU0FBQTtlQUFHLFlBQVksQ0FBQyxHQUFiLENBQWlCLE1BQWpCLEVBQXlCLE9BQXpCO01BQUgsQ0FBZjthQUNiLElBQUMsQ0FBQSxhQUFELENBQWUsVUFBZixFQUEyQixlQUEzQixFQUE0QyxnQkFBNUM7SUFOa0I7O3NCQVFwQixHQUFBLEdBQUssU0FBQTtBQUNILFVBQUE7TUFESTtNQUNKLFNBQUEsR0FBWTtBQUNaLFdBQUEsc0NBQUE7O0FBQ0UsZ0JBQU8sT0FBTyxHQUFkO0FBQUEsZUFDTyxRQURQO1lBQ3VCLFNBQUEsSUFBYTtBQUE3QjtBQURQLGVBRU8sUUFGUDtZQUV1QixTQUFBLElBQWE7QUFBN0I7QUFGUCxlQUdPLFVBSFA7WUFHdUIsU0FBQSxJQUFhO0FBSHBDO0FBREY7QUFLQSxjQUFPLFNBQVA7QUFBQSxhQUNPLEdBRFA7QUFBQSxhQUNZLEtBRFo7aUJBQ3VCLElBQUMsQ0FBQSxhQUFELGFBQWUsSUFBZjtBQUR2QixhQUVPLEtBRlA7QUFBQSxhQUVjLEtBRmQ7VUFHSyxhQUFELEVBQU0sZ0JBQU4sRUFBYztpQkFDZCxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsR0FBcEIsRUFBeUIsTUFBekIsRUFBaUMsUUFBakMsRUFBMkMsZUFBM0MsRUFBNEQsZ0JBQTVELEVBQThFLE9BQTlFO0FBSkosYUFLTyxNQUxQO0FBQUEsYUFLZSxNQUxmO1VBTUssYUFBRCxFQUFNLGdCQUFOLEVBQWMsa0JBQWQsRUFBd0I7aUJBQ3hCLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixHQUFwQixFQUF5QixNQUF6QixFQUFpQyxRQUFqQyxFQUEyQyxlQUEzQyxFQUE0RCxnQkFBNUQsRUFBOEUsT0FBOUU7QUFQSixhQVFPLE9BUlA7QUFBQSxhQVFnQixPQVJoQjtVQVNLLGFBQUQsRUFBTSxnQkFBTixFQUFjLHlCQUFkLEVBQStCLDBCQUEvQixFQUFpRDtpQkFDakQsSUFBQyxDQUFBLGtCQUFELENBQW9CLEdBQXBCLEVBQXlCLE1BQXpCLEVBQWlDLFFBQWpDLEVBQTJDLGVBQTNDLEVBQTRELGdCQUE1RCxFQUE4RSxPQUE5RTtBQVZKLGFBV08sUUFYUDtBQUFBLGFBV2lCLFFBWGpCO1VBWUssYUFBRCxFQUFNLGdCQUFOLEVBQWMsa0JBQWQsRUFBd0IseUJBQXhCLEVBQXlDLDBCQUF6QyxFQUEyRDtpQkFDM0QsSUFBQyxDQUFBLGtCQUFELENBQW9CLEdBQXBCLEVBQXlCLE1BQXpCLEVBQWlDLFFBQWpDLEVBQTJDLGVBQTNDLEVBQTRELGdCQUE1RCxFQUE4RSxPQUE5RTtBQWJKO1VBZUksT0FBTyxDQUFDLEdBQVIsQ0FBWSxzQ0FBWixFQUFvRCxJQUFwRDtBQWZKO0lBUEc7O3NCQXlCTCxNQUFBLEdBQVEsU0FBQTtBQUNOLFVBQUE7TUFETzthQUNQLFFBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBWSxDQUFDLE1BQWIsYUFBb0IsSUFBcEI7SUFETTs7c0JBR1IsS0FBQSxHQUFPLFNBQUE7YUFDTCxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQWIsQ0FBQTtJQURLOztzQkFHUCxPQUFBLEdBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO0lBRE87Ozs7O0FBbEVYIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gIGxpYi9zdWItYXRvbS5jb2ZmZWVcbiMjI1xuXG57Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcblxubW9kdWxlLmV4cG9ydHMgPSBcbmNsYXNzIFN1YkF0b21cbiAgXG4gIGNvbnN0cnVjdG9yOiAtPiBcbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIGFkZERpc3Bvc2FibGU6IChkaXNwb3NhYmxlLCBkaXNwb3NlRXZlbnRPYmosIGRpc3Bvc2VFdmVudFR5cGUpIC0+XG4gICAgaWYgZGlzcG9zZUV2ZW50T2JqXG4gICAgICB0cnlcbiAgICAgICAgYXV0b0Rpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICAgICAgYXV0b0Rpc3Bvc2FibGVzLmFkZCBkaXNwb3NhYmxlXG4gICAgICAgIGF1dG9EaXNwb3NhYmxlcy5hZGQgZGlzcG9zZUV2ZW50T2JqW2Rpc3Bvc2VFdmVudFR5cGVdID0+XG4gICAgICAgICAgYXV0b0Rpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgICAgICAgIEBkaXNwb3NhYmxlcy5yZW1vdmUgYXV0b0Rpc3Bvc2FibGVzXG4gICAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXV0b0Rpc3Bvc2FibGVzXG4gICAgICBjYXRjaCBlXG4gICAgICAgIGNvbnNvbGUubG9nICdTdWJBdG9tOjphZGQsIGludmFsaWQgZGlzcG9zZSBldmVudCcsIGRpc3Bvc2VFdmVudE9iaiwgZGlzcG9zZUV2ZW50VHlwZSwgZVxuICAgIGVsc2VcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgZGlzcG9zYWJsZVxuICAgICAgICBcbiAgYWRkRWxlbWVudExpc3RlbmVyOiAoZWxlLCBldmVudHMsIHNlbGVjdG9yLCBkaXNwb3NlRXZlbnRPYmosIGRpc3Bvc2VFdmVudFR5cGUsIGhhbmRsZXIpIC0+XG4gICAgaWYgc2VsZWN0b3JcbiAgICAgIHN1YnNjcmlwdGlvbiA9ICQoZWxlKS5vbiBldmVudHMsIHNlbGVjdG9yLCBoYW5kbGVyXG4gICAgZWxzZVxuICAgICAgc3Vic2NyaXB0aW9uID0gJChlbGUpLm9uIGV2ZW50cywgaGFuZGxlclxuICAgIGRpc3Bvc2FibGUgPSBuZXcgRGlzcG9zYWJsZSAtPiBzdWJzY3JpcHRpb24ub2ZmIGV2ZW50cywgaGFuZGxlclxuICAgIEBhZGREaXNwb3NhYmxlIGRpc3Bvc2FibGUsIGRpc3Bvc2VFdmVudE9iaiwgZGlzcG9zZUV2ZW50VHlwZVxuICBcbiAgYWRkOiAoYXJncy4uLikgLT5cbiAgICBzaWduYXR1cmUgPSAnJ1xuICAgIGZvciBhcmcgaW4gYXJncyBcbiAgICAgIHN3aXRjaCB0eXBlb2YgYXJnXG4gICAgICAgIHdoZW4gJ3N0cmluZycgICB0aGVuIHNpZ25hdHVyZSArPSAncydcbiAgICAgICAgd2hlbiAnb2JqZWN0JyAgIHRoZW4gc2lnbmF0dXJlICs9ICdvJ1xuICAgICAgICB3aGVuICdmdW5jdGlvbicgdGhlbiBzaWduYXR1cmUgKz0gJ2YnXG4gICAgc3dpdGNoIHNpZ25hdHVyZVxuICAgICAgd2hlbiAnbycsICdvb3MnIHRoZW4gQGFkZERpc3Bvc2FibGUgYXJncy4uLlxuICAgICAgd2hlbiAnc3NmJywgJ29zZicgICAgICBcbiAgICAgICAgW2VsZSwgZXZlbnRzLCBoYW5kbGVyXSA9IGFyZ3NcbiAgICAgICAgQGFkZEVsZW1lbnRMaXN0ZW5lciBlbGUsIGV2ZW50cywgc2VsZWN0b3IsIGRpc3Bvc2VFdmVudE9iaiwgZGlzcG9zZUV2ZW50VHlwZSwgaGFuZGxlclxuICAgICAgd2hlbiAnb3NzZicsICdzc3NmJyAgICAgXG4gICAgICAgIFtlbGUsIGV2ZW50cywgc2VsZWN0b3IsIGhhbmRsZXJdID0gYXJnc1xuICAgICAgICBAYWRkRWxlbWVudExpc3RlbmVyIGVsZSwgZXZlbnRzLCBzZWxlY3RvciwgZGlzcG9zZUV2ZW50T2JqLCBkaXNwb3NlRXZlbnRUeXBlLCBoYW5kbGVyXG4gICAgICB3aGVuICdvc29zZicsICdzc29zZidcbiAgICAgICAgW2VsZSwgZXZlbnRzLCBkaXNwb3NlRXZlbnRPYmosIGRpc3Bvc2VFdmVudFR5cGUsIGhhbmRsZXJdID0gYXJnc1xuICAgICAgICBAYWRkRWxlbWVudExpc3RlbmVyIGVsZSwgZXZlbnRzLCBzZWxlY3RvciwgZGlzcG9zZUV2ZW50T2JqLCBkaXNwb3NlRXZlbnRUeXBlLCBoYW5kbGVyXG4gICAgICB3aGVuICdvc3Nvc2YnLCAnc3Nzb3NmJ1xuICAgICAgICBbZWxlLCBldmVudHMsIHNlbGVjdG9yLCBkaXNwb3NlRXZlbnRPYmosIGRpc3Bvc2VFdmVudFR5cGUsIGhhbmRsZXJdID0gYXJnc1xuICAgICAgICBAYWRkRWxlbWVudExpc3RlbmVyIGVsZSwgZXZlbnRzLCBzZWxlY3RvciwgZGlzcG9zZUV2ZW50T2JqLCBkaXNwb3NlRXZlbnRUeXBlLCBoYW5kbGVyXG4gICAgICBlbHNlIFxuICAgICAgICBjb25zb2xlLmxvZyAnU3ViQXRvbTo6YWRkLCBpbnZhbGlkIGNhbGwgc2lnbmF0dXJlJywgYXJnc1xuICAgICAgICByZXR1cm5cblxuICByZW1vdmU6IChhcmdzLi4uKSAtPiBcbiAgICBAZGlzcG9zYWJsZXMucmVtb3ZlIGFyZ3MuLi5cbiAgICBcbiAgY2xlYXI6IC0+IFxuICAgIEBkaXNwb3NhYmxlcy5jbGVhcigpXG5cbiAgZGlzcG9zZTogLT4gXG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuIl19
