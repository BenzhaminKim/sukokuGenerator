(function() {
  var GrammarUtils, OperatingSystem, args, command, options, os, path, ref, windows;

  path = require('path');

  ref = GrammarUtils = require('../grammar-utils'), OperatingSystem = ref.OperatingSystem, command = ref.command;

  os = OperatingSystem.platform();

  windows = OperatingSystem.isWindows();

  options = '-Wall -include stdio.h';

  args = function(arg) {
    var filepath;
    filepath = arg.filepath;
    args = (function() {
      switch (os) {
        case 'darwin':
          return "xcrun clang " + options + " -fcolor-diagnostics '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
        case 'linux':
          return "cc " + options + " '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
      }
    })();
    return ['-c', args];
  };

  exports.C = {
    'File Based': {
      command: 'bash',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang " + options + " -fcolor-diagnostics '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
            case 'linux':
              return "cc " + options + " '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
          }
        })();
        return ['-c', args];
      }
    },
    'Selection Based': {
      command: 'bash',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.c');
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang " + options + " -fcolor-diagnostics " + tmpFile + " -o /tmp/c.out && /tmp/c.out";
            case 'linux':
              return "cc " + options + " " + tmpFile + " -o /tmp/c.out && /tmp/c.out";
          }
        })();
        return ['-c', args];
      }
    }
  };

  exports['C#'] = {
    'Selection Based': {
      command: command,
      args: function(context) {
        var code, exe, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.cs');
        exe = tmpFile.replace(/\.cs$/, '.exe');
        if (windows) {
          return ["/c csc /out:" + exe + " " + tmpFile + " && " + exe];
        } else {
          return ['-c', "csc /out:" + exe + " " + tmpFile + " && mono " + exe];
        }
      }
    },
    'File Based': {
      command: command,
      args: function(arg) {
        var exe, filename, filepath;
        filepath = arg.filepath, filename = arg.filename;
        exe = filename.replace(/\.cs$/, '.exe');
        if (windows) {
          return ["/c csc " + filepath + " && " + exe];
        } else {
          return ['-c', "csc '" + filepath + "' && mono " + exe];
        }
      }
    }
  };

  exports['C# Script File'] = {
    'Selection Based': {
      command: 'scriptcs',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.csx');
        return ['-script', tmpFile];
      }
    },
    'File Based': {
      command: 'scriptcs',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-script', filepath];
      }
    }
  };

  exports['C++'] = {
    'Selection Based': {
      command: 'bash',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.cpp');
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang++ -std=c++14 " + options + " -fcolor-diagnostics -include iostream " + tmpFile + " -o /tmp/cpp.out && /tmp/cpp.out";
            case 'linux':
              return "g++ " + options + " -std=c++14 -include iostream " + tmpFile + " -o /tmp/cpp.out && /tmp/cpp.out";
          }
        })();
        return ['-c', args];
      }
    },
    'File Based': {
      command: command,
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang++ -std=c++14 " + options + " -fcolor-diagnostics -include iostream '" + filepath + "' -o /tmp/cpp.out && /tmp/cpp.out";
            case 'linux':
              return "g++ -std=c++14 " + options + " -include iostream '" + filepath + "' -o /tmp/cpp.out && /tmp/cpp.out";
            case 'win32':
              if (GrammarUtils.OperatingSystem.release().split('.').slice(-1 >= '14399')) {
                filepath = path.posix.join.apply(path.posix, [].concat([filepath.split(path.win32.sep)[0].toLowerCase()], filepath.split(path.win32.sep).slice(1))).replace(':', '');
                return "g++ -std=c++14 " + options + " -include iostream /mnt/" + filepath + " -o /tmp/cpp.out && /tmp/cpp.out";
              }
          }
        })();
        return GrammarUtils.formatArgs(args);
      }
    }
  };

  exports['C++14'] = exports['C++'];

  if (os === 'darwin') {
    exports['Objective-C'] = {
      'File Based': {
        command: 'bash',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-c', "xcrun clang " + options + " -fcolor-diagnostics -framework Cocoa '" + filepath + "' -o /tmp/objc-c.out && /tmp/objc-c.out"];
        }
      }
    };
    exports['Objective-C++'] = {
      'File Based': {
        command: 'bash',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-c', "xcrun clang++ -Wc++11-extensions " + options + " -fcolor-diagnostics -include iostream -framework Cocoa '" + filepath + "' -o /tmp/objc-cpp.out && /tmp/objc-cpp.out"];
        }
      }
    };
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxNQUE2QixZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSLENBQTVDLEVBQUMscUNBQUQsRUFBa0I7O0VBRWxCLEVBQUEsR0FBSyxlQUFlLENBQUMsUUFBaEIsQ0FBQTs7RUFDTCxPQUFBLEdBQVUsZUFBZSxDQUFDLFNBQWhCLENBQUE7O0VBRVYsT0FBQSxHQUFVOztFQUVWLElBQUEsR0FBTyxTQUFDLEdBQUQ7QUFDTCxRQUFBO0lBRE8sV0FBRDtJQUNOLElBQUE7QUFBTyxjQUFPLEVBQVA7QUFBQSxhQUNBLFFBREE7aUJBRUgsY0FBQSxHQUFlLE9BQWYsR0FBdUIsd0JBQXZCLEdBQStDLFFBQS9DLEdBQXdEO0FBRnJELGFBR0EsT0FIQTtpQkFJSCxLQUFBLEdBQU0sT0FBTixHQUFjLElBQWQsR0FBa0IsUUFBbEIsR0FBMkI7QUFKeEI7O0FBS1AsV0FBTyxDQUFDLElBQUQsRUFBTyxJQUFQO0VBTkY7O0VBUVAsT0FBTyxDQUFDLENBQVIsR0FDRTtJQUFBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUNKLFlBQUE7UUFETSxXQUFEO1FBQ0wsSUFBQTtBQUFPLGtCQUFPLEVBQVA7QUFBQSxpQkFDQSxRQURBO3FCQUVILGNBQUEsR0FBZSxPQUFmLEdBQXVCLHdCQUF2QixHQUErQyxRQUEvQyxHQUF3RDtBQUZyRCxpQkFHQSxPQUhBO3FCQUlILEtBQUEsR0FBTSxPQUFOLEdBQWMsSUFBZCxHQUFrQixRQUFsQixHQUEyQjtBQUp4Qjs7QUFLUCxlQUFPLENBQUMsSUFBRCxFQUFPLElBQVA7TUFOSCxDQUROO0tB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WSxDQUFDLFVBQWIsQ0FBd0IsSUFBeEI7TUFWSCxDQUZNO0tBWmQ7OztFQTBCRixPQUFRLENBQUEsT0FBQSxDQUFSLEdBQW1CLE9BQVEsQ0FBQSxLQUFBOztFQUUzQixJQUFHLEVBQUEsS0FBTSxRQUFUO0lBQ0UsT0FBUSxDQUFBLGFBQUEsQ0FBUixHQUNFO01BQUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE1BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsSUFBRCxFQUFPLGNBQUEsR0FBZSxPQUFmLEdBQXVCLHlDQUF2QixHQUFnRSxRQUFoRSxHQUF5RSx5Q0FBaEY7UUFBaEIsQ0FETjtPQURGOztJQUlGLE9BQVEsQ0FBQSxlQUFBLENBQVIsR0FDSTtNQUFBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLElBQUQsRUFBTyxtQ0FBQSxHQUFvQyxPQUFwQyxHQUE0QywyREFBNUMsR0FBdUcsUUFBdkcsR0FBZ0gsNkNBQXZIO1FBQWhCLENBRE47T0FERjtNQVBOOztBQW5HQSIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xue09wZXJhdGluZ1N5c3RlbSwgY29tbWFuZH0gPSBHcmFtbWFyVXRpbHMgPSByZXF1aXJlICcuLi9ncmFtbWFyLXV0aWxzJ1xuXG5vcyA9IE9wZXJhdGluZ1N5c3RlbS5wbGF0Zm9ybSgpXG53aW5kb3dzID0gT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpXG5cbm9wdGlvbnMgPSAnLVdhbGwgLWluY2x1ZGUgc3RkaW8uaCdcblxuYXJncyA9ICh7ZmlsZXBhdGh9KSAtPlxuICBhcmdzID0gc3dpdGNoIG9zXG4gICAgd2hlbiAnZGFyd2luJ1xuICAgICAgXCJ4Y3J1biBjbGFuZyAje29wdGlvbnN9IC1mY29sb3ItZGlhZ25vc3RpY3MgJyN7ZmlsZXBhdGh9JyAtbyAvdG1wL2Mub3V0ICYmIC90bXAvYy5vdXRcIlxuICAgIHdoZW4gJ2xpbnV4J1xuICAgICAgXCJjYyAje29wdGlvbnN9ICcje2ZpbGVwYXRofScgLW8gL3RtcC9jLm91dCAmJiAvdG1wL2Mub3V0XCJcbiAgcmV0dXJuIFsnLWMnLCBhcmdzXVxuXG5leHBvcnRzLkMgPVxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2Jhc2gnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+XG4gICAgICBhcmdzID0gc3dpdGNoIG9zXG4gICAgICAgIHdoZW4gJ2RhcndpbidcbiAgICAgICAgICBcInhjcnVuIGNsYW5nICN7b3B0aW9uc30gLWZjb2xvci1kaWFnbm9zdGljcyAnI3tmaWxlcGF0aH0nIC1vIC90bXAvYy5vdXQgJiYgL3RtcC9jLm91dFwiXG4gICAgICAgIHdoZW4gJ2xpbnV4J1xuICAgICAgICAgIFwiY2MgI3tvcHRpb25zfSAnI3tmaWxlcGF0aH0nIC1vIC90bXAvYy5vdXQgJiYgL3RtcC9jLm91dFwiXG4gICAgICByZXR1cm4gWyctYycsIGFyZ3NdXG5cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2Jhc2gnXG4gICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCAnLmMnKVxuICAgICAgYXJncyA9IHN3aXRjaCBvc1xuICAgICAgICB3aGVuICdkYXJ3aW4nXG4gICAgICAgICAgXCJ4Y3J1biBjbGFuZyAje29wdGlvbnN9IC1mY29sb3ItZGlhZ25vc3RpY3MgI3t0bXBGaWxlfSAtbyAvdG1wL2Mub3V0ICYmIC90bXAvYy5vdXRcIlxuICAgICAgICB3aGVuICdsaW51eCdcbiAgICAgICAgICBcImNjICN7b3B0aW9uc30gI3t0bXBGaWxlfSAtbyAvdG1wL2Mub3V0ICYmIC90bXAvYy5vdXRcIlxuICAgICAgcmV0dXJuIFsnLWMnLCBhcmdzXVxuXG5leHBvcnRzWydDIyddID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6IHtcbiAgICBjb21tYW5kXG4gICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCAnLmNzJylcbiAgICAgIGV4ZSA9IHRtcEZpbGUucmVwbGFjZSAvXFwuY3MkLywgJy5leGUnXG4gICAgICBpZiB3aW5kb3dzXG4gICAgICAgIHJldHVybiBbXCIvYyBjc2MgL291dDoje2V4ZX0gI3t0bXBGaWxlfSAmJiAje2V4ZX1cIl1cbiAgICAgIGVsc2UgWyctYycsIFwiY3NjIC9vdXQ6I3tleGV9ICN7dG1wRmlsZX0gJiYgbW9ubyAje2V4ZX1cIl1cbiAgfVxuICAnRmlsZSBCYXNlZCc6IHtcbiAgICBjb21tYW5kXG4gICAgYXJnczogKHtmaWxlcGF0aCwgZmlsZW5hbWV9KSAtPlxuICAgICAgZXhlID0gZmlsZW5hbWUucmVwbGFjZSAvXFwuY3MkLywgJy5leGUnXG4gICAgICBpZiB3aW5kb3dzXG4gICAgICAgIHJldHVybiBbXCIvYyBjc2MgI3tmaWxlcGF0aH0gJiYgI3tleGV9XCJdXG4gICAgICBlbHNlIFsnLWMnLCBcImNzYyAnI3tmaWxlcGF0aH0nICYmIG1vbm8gI3tleGV9XCJdXG4gIH1cbmV4cG9ydHNbJ0MjIFNjcmlwdCBGaWxlJ10gPVxuXG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdzY3JpcHRjcydcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcuY3N4JylcbiAgICAgIHJldHVybiBbJy1zY3JpcHQnLCB0bXBGaWxlXVxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3NjcmlwdGNzJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1zY3JpcHQnLCBmaWxlcGF0aF1cblxuZXhwb3J0c1snQysrJ10gPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnYmFzaCdcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcuY3BwJylcbiAgICAgIGFyZ3MgPSBzd2l0Y2ggb3NcbiAgICAgICAgd2hlbiAnZGFyd2luJ1xuICAgICAgICAgIFwieGNydW4gY2xhbmcrKyAtc3RkPWMrKzE0ICN7b3B0aW9uc30gLWZjb2xvci1kaWFnbm9zdGljcyAtaW5jbHVkZSBpb3N0cmVhbSAje3RtcEZpbGV9IC1vIC90bXAvY3BwLm91dCAmJiAvdG1wL2NwcC5vdXRcIlxuICAgICAgICB3aGVuICdsaW51eCdcbiAgICAgICAgICBcImcrKyAje29wdGlvbnN9IC1zdGQ9YysrMTQgLWluY2x1ZGUgaW9zdHJlYW0gI3t0bXBGaWxlfSAtbyAvdG1wL2NwcC5vdXQgJiYgL3RtcC9jcHAub3V0XCJcbiAgICAgIHJldHVybiBbJy1jJywgYXJnc11cblxuICAnRmlsZSBCYXNlZCc6IHtcbiAgICBjb21tYW5kXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+XG4gICAgICBhcmdzID0gc3dpdGNoIG9zXG4gICAgICAgIHdoZW4gJ2RhcndpbidcbiAgICAgICAgICBcInhjcnVuIGNsYW5nKysgLXN0ZD1jKysxNCAje29wdGlvbnN9IC1mY29sb3ItZGlhZ25vc3RpY3MgLWluY2x1ZGUgaW9zdHJlYW0gJyN7ZmlsZXBhdGh9JyAtbyAvdG1wL2NwcC5vdXQgJiYgL3RtcC9jcHAub3V0XCJcbiAgICAgICAgd2hlbiAnbGludXgnXG4gICAgICAgICAgXCJnKysgLXN0ZD1jKysxNCAje29wdGlvbnN9IC1pbmNsdWRlIGlvc3RyZWFtICcje2ZpbGVwYXRofScgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXG4gICAgICAgIHdoZW4gJ3dpbjMyJ1xuICAgICAgICAgIGlmIEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0ucmVsZWFzZSgpLnNwbGl0KCcuJykuc2xpY2UgLTEgPj0gJzE0Mzk5J1xuICAgICAgICAgICAgZmlsZXBhdGggPSBwYXRoLnBvc2l4LmpvaW4uYXBwbHkocGF0aC5wb3NpeCwgW10uY29uY2F0KFtmaWxlcGF0aC5zcGxpdChwYXRoLndpbjMyLnNlcClbMF0udG9Mb3dlckNhc2UoKV0sIGZpbGVwYXRoLnNwbGl0KHBhdGgud2luMzIuc2VwKS5zbGljZSgxKSkpLnJlcGxhY2UoJzonLCAnJylcbiAgICAgICAgICAgIFwiZysrIC1zdGQ9YysrMTQgI3tvcHRpb25zfSAtaW5jbHVkZSBpb3N0cmVhbSAvbW50LyN7ZmlsZXBhdGh9IC1vIC90bXAvY3BwLm91dCAmJiAvdG1wL2NwcC5vdXRcIlxuICAgICAgcmV0dXJuIEdyYW1tYXJVdGlscy5mb3JtYXRBcmdzKGFyZ3MpXG4gIH1cbmV4cG9ydHNbJ0MrKzE0J10gPSBleHBvcnRzWydDKysnXVxuXG5pZiBvcyBpcyAnZGFyd2luJ1xuICBleHBvcnRzWydPYmplY3RpdmUtQyddID1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnYmFzaCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1jJywgXCJ4Y3J1biBjbGFuZyAje29wdGlvbnN9IC1mY29sb3ItZGlhZ25vc3RpY3MgLWZyYW1ld29yayBDb2NvYSAnI3tmaWxlcGF0aH0nIC1vIC90bXAvb2JqYy1jLm91dCAmJiAvdG1wL29iamMtYy5vdXRcIl1cblxuICBleHBvcnRzWydPYmplY3RpdmUtQysrJ10gPVxuICAgICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgICBjb21tYW5kOiAnYmFzaCdcbiAgICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLWMnLCBcInhjcnVuIGNsYW5nKysgLVdjKysxMS1leHRlbnNpb25zICN7b3B0aW9uc30gLWZjb2xvci1kaWFnbm9zdGljcyAtaW5jbHVkZSBpb3N0cmVhbSAtZnJhbWV3b3JrIENvY29hICcje2ZpbGVwYXRofScgLW8gL3RtcC9vYmpjLWNwcC5vdXQgJiYgL3RtcC9vYmpjLWNwcC5vdXRcIl1cbiJdfQ==
