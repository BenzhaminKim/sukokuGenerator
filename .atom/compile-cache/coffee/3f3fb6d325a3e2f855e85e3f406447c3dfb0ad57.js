(function() {
  var GrammarUtils, command, path;

  path = require('path');

  command = (GrammarUtils = require('../grammar-utils')).command;

  exports['Fortran - Fixed Form'] = {
    'File Based': {
      command: command,
      args: function(arg) {
        var cmd, filepath;
        filepath = arg.filepath;
        cmd = "gfortran '" + filepath + "' -ffixed-form -o /tmp/f.out && /tmp/f.out";
        return GrammarUtils.formatArgs(cmd);
      }
    }
  };

  exports['Fortran - Free Form'] = {
    'File Based': {
      command: command,
      args: function(arg) {
        var cmd, filepath;
        filepath = arg.filepath;
        cmd = "gfortran '" + filepath + "' -ffree-form -o /tmp/f90.out && /tmp/f90.out";
        return GrammarUtils.formatArgs(cmd);
      }
    }
  };

  exports['Fortran - Modern'] = exports['Fortran - Free Form'];

  exports['Fortran - Punchcard'] = exports['Fortran - Fixed Form'];

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvZm9ydHJhbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDTixVQUFXLENBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUFmOztFQUVaLE9BQVEsQ0FBQSxzQkFBQSxDQUFSLEdBQ0U7SUFBQSxZQUFBLEVBQWM7TUFDWixTQUFBLE9BRFk7TUFFWixJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQ0osWUFBQTtRQURNLFdBQUQ7UUFDTCxHQUFBLEdBQU0sWUFBQSxHQUFhLFFBQWIsR0FBc0I7QUFDNUIsZUFBTyxZQUFZLENBQUMsVUFBYixDQUF3QixHQUF4QjtNQUZILENBRk07S0FBZDs7O0VBTUYsT0FBUSxDQUFBLHFCQUFBLENBQVIsR0FDRTtJQUFBLFlBQUEsRUFBYztNQUNaLFNBQUEsT0FEWTtNQUVaLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFDSixZQUFBO1FBRE0sV0FBRDtRQUNMLEdBQUEsR0FBTSxZQUFBLEdBQWEsUUFBYixHQUFzQjtBQUM1QixlQUFPLFlBQVksQ0FBQyxVQUFiLENBQXdCLEdBQXhCO01BRkgsQ0FGTTtLQUFkOzs7RUFNRixPQUFRLENBQUEsa0JBQUEsQ0FBUixHQUE4QixPQUFRLENBQUEscUJBQUE7O0VBQ3RDLE9BQVEsQ0FBQSxxQkFBQSxDQUFSLEdBQWlDLE9BQVEsQ0FBQSxzQkFBQTtBQWxCekMiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcbntjb21tYW5kfSA9IEdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbmV4cG9ydHNbJ0ZvcnRyYW4gLSBGaXhlZCBGb3JtJ10gPVxuICAnRmlsZSBCYXNlZCc6IHtcbiAgICBjb21tYW5kXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+XG4gICAgICBjbWQgPSBcImdmb3J0cmFuICcje2ZpbGVwYXRofScgLWZmaXhlZC1mb3JtIC1vIC90bXAvZi5vdXQgJiYgL3RtcC9mLm91dFwiXG4gICAgICByZXR1cm4gR3JhbW1hclV0aWxzLmZvcm1hdEFyZ3MoY21kKVxuICB9XG5leHBvcnRzWydGb3J0cmFuIC0gRnJlZSBGb3JtJ10gPVxuICAnRmlsZSBCYXNlZCc6IHtcbiAgICBjb21tYW5kXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+XG4gICAgICBjbWQgPSBcImdmb3J0cmFuICcje2ZpbGVwYXRofScgLWZmcmVlLWZvcm0gLW8gL3RtcC9mOTAub3V0ICYmIC90bXAvZjkwLm91dFwiXG4gICAgICByZXR1cm4gR3JhbW1hclV0aWxzLmZvcm1hdEFyZ3MoY21kKVxuICB9XG5leHBvcnRzWydGb3J0cmFuIC0gTW9kZXJuJ10gPSBleHBvcnRzWydGb3J0cmFuIC0gRnJlZSBGb3JtJ11cbmV4cG9ydHNbJ0ZvcnRyYW4gLSBQdW5jaGNhcmQnXSA9IGV4cG9ydHNbJ0ZvcnRyYW4gLSBGaXhlZCBGb3JtJ11cbiJdfQ==
