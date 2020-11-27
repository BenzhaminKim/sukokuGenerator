(function() {
  var GrammarUtils, OperatingSystem, base, command, os, path, ref, ref1, ref2, ref3, windows;

  path = require('path');

  ref = GrammarUtils = require('../grammar-utils'), OperatingSystem = ref.OperatingSystem, command = ref.command;

  os = OperatingSystem.platform();

  windows = OperatingSystem.isWindows();

  module.exports = {
    '1C (BSL)': {
      'File Based': {
        command: 'oscript',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-encoding=utf-8', filepath];
        }
      }
    },
    Ansible: {
      'File Based': {
        command: 'ansible-playbook',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Clojure: {
      'Selection Based': {
        command: 'lein',
        args: function(context) {
          return ['exec', '-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'lein',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['exec', filepath];
        }
      }
    },
    Crystal: {
      'Selection Based': {
        command: 'crystal',
        args: function(context) {
          return ['eval', context.getCode()];
        }
      },
      'File Based': {
        command: 'crystal',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    D: {
      'Selection Based': {
        command: 'rdmd',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.D.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'rdmd',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Elixir: {
      'Selection Based': {
        command: 'elixir',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'elixir',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-r', filepath];
        }
      }
    },
    Erlang: {
      'Selection Based': {
        command: 'erl',
        args: function(context) {
          return ['-noshell', '-eval', (context.getCode()) + ", init:stop()."];
        }
      }
    },
    'F*': {
      'File Based': {
        command: 'fstar',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    'F#': {
      'File Based': {
        command: windows ? 'fsi' : 'fsharpi',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['--exec', filepath];
        }
      }
    },
    Forth: {
      'File Based': {
        command: 'gforth',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Gherkin: {
      'File Based': {
        command: 'cucumber',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['--color', filepath];
        }
      },
      'Line Number Based': {
        command: 'cucumber',
        args: function(context) {
          return ['--color', context.fileColonLine()];
        }
      }
    },
    Go: {
      'File Based': {
        command: 'go',
        workingDirectory: (ref1 = atom.workspace.getActivePaneItem()) != null ? (ref2 = ref1.buffer) != null ? (ref3 = ref2.file) != null ? typeof ref3.getParent === "function" ? typeof (base = ref3.getParent()).getPath === "function" ? base.getPath() : void 0 : void 0 : void 0 : void 0 : void 0,
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          if (filepath.match(/_test.go/)) {
            return ['test', ''];
          } else {
            return ['run', filepath];
          }
        }
      }
    },
    Groovy: {
      'Selection Based': {
        command: 'groovy',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'groovy',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Hy: {
      'Selection Based': {
        command: 'hy',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code, '.hy');
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'hy',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Idris: {
      'File Based': {
        command: 'idris',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath, '-o', path.basename(filepath, path.extname(filepath))];
        }
      }
    },
    InnoSetup: {
      'File Based': {
        command: 'ISCC.exe',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['/Q', filepath];
        }
      }
    },
    ioLanguage: {
      'Selection Based': {
        command: 'io',
        args: function(context) {
          return [context.getCode()];
        }
      },
      'File Based': {
        command: 'io',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-e', filepath];
        }
      }
    },
    Jolie: {
      'File Based': {
        command: 'jolie',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Julia: {
      'Selection Based': {
        command: 'julia',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'julia',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    LAMMPS: os === 'darwin' || os === 'linux' ? {
      'File Based': {
        command: 'lammps',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-log', 'none', '-in', filepath];
        }
      }
    } : void 0,
    LilyPond: {
      'File Based': {
        command: 'lilypond',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    LiveScript: {
      'Selection Based': {
        command: 'lsc',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'lsc',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Makefile: {
      'Selection Based': {
        command: 'bash',
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      'File Based': {
        command: 'make',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-f', filepath];
        }
      }
    },
    MATLAB: {
      'Selection Based': {
        command: 'matlab',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.MATLAB.createTempFileWithCode(code);
          return ['-nodesktop', '-nosplash', '-r', "try, run('" + tmpFile + "'); while ~isempty(get(0,'Children')); pause(0.5); end; catch ME; disp(ME.message); exit(1); end; exit(0);"];
        }
      },
      'File Based': {
        command: 'matlab',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-nodesktop', '-nosplash', '-r', "try run('" + filepath + "'); while ~isempty(get(0,'Children')); pause(0.5); end; catch ME; disp(ME.message); exit(1); end; exit(0);"];
        }
      }
    },
    'MIPS Assembler': {
      'File Based': {
        command: 'spim',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-f', filepath];
        }
      }
    },
    NCL: {
      'Selection Based': {
        command: 'ncl',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode() + '\n\nexit';
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'ncl',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Nim: {
      'File Based': {
        command: command,
        args: function(arg) {
          var commands, dir, file, filepath;
          filepath = arg.filepath;
          file = GrammarUtils.Nim.findNimProjectFile(filepath);
          dir = GrammarUtils.Nim.projectDir(filepath);
          commands = "cd '" + dir + "' && nim c --hints:off --parallelBuild:1 -r '" + file + "' 2>&1";
          return GrammarUtils.formatArgs(commands);
        }
      }
    },
    NSIS: {
      'Selection Based': {
        command: 'makensis',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'makensis',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Octave: {
      'Selection Based': {
        command: 'octave',
        args: function(context) {
          var dir;
          dir = path.dirname(context.filepath);
          return ['-p', path.dirname(context.filepath), '--eval', context.getCode()];
        }
      },
      'File Based': {
        command: 'octave',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-p', path.dirname(filepath), filepath];
        }
      }
    },
    Oz: {
      'Selection Based': {
        command: 'ozc',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-c', tmpFile];
        }
      },
      'File Based': {
        command: 'ozc',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-c', filepath];
        }
      }
    },
    Pascal: {
      'Selection Based': {
        command: 'fpc',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'fpc',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Povray: {
      'File Based': {
        command: command,
        args: function(arg) {
          var commands, filepath;
          filepath = arg.filepath;
          commands = windows ? 'pvengine /EXIT /RENDER ' : 'povray ';
          return GrammarUtils.formatArgs(commands + filepath);
        }
      }
    },
    Prolog: {
      'File Based': {
        command: command,
        args: function(arg) {
          var commands, dir, filepath;
          filepath = arg.filepath;
          dir = path.dirname(filepath);
          commands = "cd '" + dir + "'; swipl -f '" + filepath + "' -t main --quiet";
          return GrammarUtils.formatArgs(commands);
        }
      }
    },
    PureScript: {
      'File Based': {
        command: command,
        args: function(arg) {
          var dir, filepath;
          filepath = arg.filepath;
          dir = path.dirname(filepath);
          return GrammarUtils.formatArgs("cd '" + dir + "' && pulp run");
        }
      }
    },
    R: {
      'Selection Based': {
        command: 'Rscript',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.R.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'Rscript',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Racket: {
      'Selection Based': {
        command: 'racket',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'racket',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    "Ren'Py": {
      'File Based': {
        command: 'renpy',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath.substr(0, filepath.lastIndexOf('/game'))];
        }
      }
    },
    'Robot Framework': {
      'File Based': {
        command: 'robot',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Rust: {
      'File Based': {
        command: command,
        args: function(arg) {
          var filename, filepath;
          filepath = arg.filepath, filename = arg.filename;
          if (windows) {
            return ["/c rustc " + filepath + " && " + filename.slice(0, -3) + ".exe"];
          } else {
            return ['-c', "rustc '" + filepath + "' -o /tmp/rs.out && /tmp/rs.out"];
          }
        }
      }
    },
    Scala: {
      'Selection Based': {
        command: 'scala',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'scala',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Stata: {
      'Selection Based': {
        command: 'stata',
        args: function(context) {
          return ['do', context.getCode()];
        }
      },
      'File Based': {
        command: 'stata',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['do', filepath];
        }
      }
    },
    Turing: {
      'File Based': {
        command: 'turing',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-run', filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBNkIsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUE1QyxFQUFDLHFDQUFELEVBQWtCOztFQUVsQixFQUFBLEdBQUssZUFBZSxDQUFDLFFBQWhCLENBQUE7O0VBQ0wsT0FBQSxHQUFVLGVBQWUsQ0FBQyxTQUFoQixDQUFBOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxVQUFBLEVBQ0U7TUFBQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsU0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxpQkFBRCxFQUFvQixRQUFwQjtRQUFoQixDQUROO09BREY7S0FERjtJQUtBLE9BQUEsRUFDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxrQkFBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxRQUFEO1FBQWhCLENBRE47T0FERjtLQU5GO0lBVUEsT0FBQSxFQUNFO01BQUEsaUJBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFmO1FBQWIsQ0FETjtPQURGO01BR0EsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE1BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsTUFBRCxFQUFTLFFBQVQ7UUFBaEIsQ0FETjtP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QUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE9BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2lCQUFhLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUDtRQUFiLENBRE47T0FERjtNQUdBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLFFBQUQ7UUFBaEIsQ0FETjtPQUpGO0tBM1NGO0lBa1RBLEtBQUEsRUFDRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsT0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7aUJBQWEsQ0FBQyxJQUFELEVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQO1FBQWIsQ0FETjtPQURGO01BR0EsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE9BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsSUFBRCxFQUFPLFFBQVA7UUFBaEIsQ0FETjtPQUpGO0tBblRGO0lBMFRBLE1BQUEsRUFDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxRQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLE1BQUQsRUFBUyxRQUFUO1FBQWhCLENBRE47T0FERjtLQTNURjs7QUFQRiIsInNvdXJjZXNDb250ZW50IjpbIiMgTWFwcyBBdG9tIEdyYW1tYXIgbmFtZXMgdG8gdGhlIGNvbW1hbmQgdXNlZCBieSB0aGF0IGxhbmd1YWdlXG4jIEFzIHdlbGwgYXMgYW55IHNwZWNpYWwgc2V0dXAgZm9yIGFyZ3VtZW50cy5cblxucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57T3BlcmF0aW5nU3lzdGVtLCBjb21tYW5kfSA9IEdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbm9zID0gT3BlcmF0aW5nU3lzdGVtLnBsYXRmb3JtKClcbndpbmRvd3MgPSBPcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKClcblxubW9kdWxlLmV4cG9ydHMgPVxuICAnMUMgKEJTTCknOlxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdvc2NyaXB0J1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLWVuY29kaW5nPXV0Zi04JywgZmlsZXBhdGhdXG5cbiAgQW5zaWJsZTpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnYW5zaWJsZS1wbGF5Ym9vaydcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgQ2xvanVyZTpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdsZWluJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnZXhlYycsICctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdsZWluJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnZXhlYycsIGZpbGVwYXRoXVxuXG4gIENyeXN0YWw6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnY3J5c3RhbCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJ2V2YWwnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnY3J5c3RhbCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgRDpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdyZG1kJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLkQuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICByZXR1cm4gW3RtcEZpbGVdXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3JkbWQnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIEVsaXhpcjpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdlbGl4aXInXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdlbGl4aXInXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctcicsIGZpbGVwYXRoXVxuXG4gIEVybGFuZzpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdlcmwnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctbm9zaGVsbCcsICctZXZhbCcsIFwiI3tjb250ZXh0LmdldENvZGUoKX0sIGluaXQ6c3RvcCgpLlwiXVxuXG4gICdGKic6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2ZzdGFyJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICAnRiMnOlxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6IGlmIHdpbmRvd3MgdGhlbiAnZnNpJyBlbHNlICdmc2hhcnBpJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLS1leGVjJywgZmlsZXBhdGhdXG5cbiAgRm9ydGg6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2dmb3J0aCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgR2hlcmtpbjpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnY3VjdW1iZXInXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctLWNvbG9yJywgZmlsZXBhdGhdXG4gICAgJ0xpbmUgTnVtYmVyIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdjdWN1bWJlcidcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy0tY29sb3InLCBjb250ZXh0LmZpbGVDb2xvbkxpbmUoKV1cblxuICBHbzpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnZ28nXG4gICAgICB3b3JraW5nRGlyZWN0b3J5OiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpPy5idWZmZXI/LmZpbGU/LmdldFBhcmVudD8oKS5nZXRQYXRoPygpXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT5cbiAgICAgICAgaWYgZmlsZXBhdGgubWF0Y2goL190ZXN0LmdvLykgdGhlbiBbJ3Rlc3QnLCAnJ11cbiAgICAgICAgZWxzZSBbJ3J1bicsIGZpbGVwYXRoXVxuXG4gIEdyb292eTpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdncm9vdnknXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdncm9vdnknXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIEh5OlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2h5J1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy5oeScpXG4gICAgICAgIHJldHVybiBbdG1wRmlsZV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnaHknXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIElkcmlzOlxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdpZHJpcydcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGgsICctbycsIHBhdGguYmFzZW5hbWUoZmlsZXBhdGgsIHBhdGguZXh0bmFtZShmaWxlcGF0aCkpXVxuXG4gIElubm9TZXR1cDpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnSVNDQy5leGUnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWycvUScsIGZpbGVwYXRoXVxuXG4gIGlvTGFuZ3VhZ2U6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnaW8nXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZ2V0Q29kZSgpXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdpbydcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1lJywgZmlsZXBhdGhdXG5cbiAgSm9saWU6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2pvbGllJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBKdWxpYTpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdqdWxpYSdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2p1bGlhJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBMQU1NUFM6XG4gICAgaWYgb3MgaW4gWydkYXJ3aW4nLCAnbGludXgnXVxuICAgICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgICBjb21tYW5kOiAnbGFtbXBzJ1xuICAgICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctbG9nJywgJ25vbmUnLCAnLWluJywgZmlsZXBhdGhdXG5cbiAgTGlseVBvbmQ6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2xpbHlwb25kJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBMaXZlU2NyaXB0OlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2xzYydcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2xzYydcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgTWFrZWZpbGU6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnYmFzaCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1jJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnbWFrZSdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1mJywgZmlsZXBhdGhdXG5cbiAgTUFUTEFCOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ21hdGxhYidcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5NQVRMQUIuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICByZXR1cm4gWyctbm9kZXNrdG9wJywgJy1ub3NwbGFzaCcsICctcicsIFwidHJ5LCBydW4oJyN7dG1wRmlsZX0nKTsgd2hpbGUgfmlzZW1wdHkoZ2V0KDAsJ0NoaWxkcmVuJykpOyBwYXVzZSgwLjUpOyBlbmQ7IGNhdGNoIE1FOyBkaXNwKE1FLm1lc3NhZ2UpOyBleGl0KDEpOyBlbmQ7IGV4aXQoMCk7XCJdXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ21hdGxhYidcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1ub2Rlc2t0b3AnLCAnLW5vc3BsYXNoJywgJy1yJywgXCJ0cnkgcnVuKCcje2ZpbGVwYXRofScpOyB3aGlsZSB+aXNlbXB0eShnZXQoMCwnQ2hpbGRyZW4nKSk7IHBhdXNlKDAuNSk7IGVuZDsgY2F0Y2ggTUU7IGRpc3AoTUUubWVzc2FnZSk7IGV4aXQoMSk7IGVuZDsgZXhpdCgwKTtcIl1cblxuICAnTUlQUyBBc3NlbWJsZXInOlxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdzcGltJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLWYnLCBmaWxlcGF0aF1cblxuICBOQ0w6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnbmNsJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKSArICdcXG5cXG5leGl0J1xuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgcmV0dXJuIFt0bXBGaWxlXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICduY2wnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIE5pbTpcbiAgICAnRmlsZSBCYXNlZCc6IHtcbiAgICAgIGNvbW1hbmRcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPlxuICAgICAgICBmaWxlID0gR3JhbW1hclV0aWxzLk5pbS5maW5kTmltUHJvamVjdEZpbGUoZmlsZXBhdGgpXG4gICAgICAgIGRpciA9IEdyYW1tYXJVdGlscy5OaW0ucHJvamVjdERpcihmaWxlcGF0aClcbiAgICAgICAgY29tbWFuZHMgPSBcImNkICcje2Rpcn0nICYmIG5pbSBjIC0taGludHM6b2ZmIC0tcGFyYWxsZWxCdWlsZDoxIC1yICcje2ZpbGV9JyAyPiYxXCJcbiAgICAgICAgcmV0dXJuIEdyYW1tYXJVdGlscy5mb3JtYXRBcmdzKGNvbW1hbmRzKVxuICAgIH1cbiAgTlNJUzpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdtYWtlbnNpcydcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIHJldHVybiBbdG1wRmlsZV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnbWFrZW5zaXMnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIE9jdGF2ZTpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdvY3RhdmUnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgZGlyID0gcGF0aC5kaXJuYW1lKGNvbnRleHQuZmlsZXBhdGgpXG4gICAgICAgIHJldHVybiBbJy1wJywgcGF0aC5kaXJuYW1lKGNvbnRleHQuZmlsZXBhdGgpLCAnLS1ldmFsJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ29jdGF2ZSdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1wJywgcGF0aC5kaXJuYW1lKGZpbGVwYXRoKSwgZmlsZXBhdGhdXG5cbiAgT3o6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnb3pjJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgcmV0dXJuIFsnLWMnLCB0bXBGaWxlXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdvemMnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctYycsIGZpbGVwYXRoXVxuXG4gIFBhc2NhbDpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdmcGMnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICByZXR1cm4gW3RtcEZpbGVdXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2ZwYydcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgUG92cmF5OlxuICAgICdGaWxlIEJhc2VkJzoge1xuICAgICAgY29tbWFuZFxuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+XG4gICAgICAgIGNvbW1hbmRzID0gaWYgd2luZG93cyB0aGVuICdwdmVuZ2luZSAvRVhJVCAvUkVOREVSICcgZWxzZSAncG92cmF5ICdcbiAgICAgICAgcmV0dXJuIEdyYW1tYXJVdGlscy5mb3JtYXRBcmdzKGNvbW1hbmRzK2ZpbGVwYXRoKVxuICAgIH1cblxuICBQcm9sb2c6XG4gICAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgICBjb21tYW5kXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT5cbiAgICAgICAgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGVwYXRoKVxuICAgICAgICBjb21tYW5kcyA9IFwiY2QgJyN7ZGlyfSc7IHN3aXBsIC1mICcje2ZpbGVwYXRofScgLXQgbWFpbiAtLXF1aWV0XCJcbiAgICAgICAgcmV0dXJuIEdyYW1tYXJVdGlscy5mb3JtYXRBcmdzKGNvbW1hbmRzKVxuICAgIH1cbiAgUHVyZVNjcmlwdDpcbiAgICAnRmlsZSBCYXNlZCc6IHtcbiAgICAgIGNvbW1hbmRcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPlxuICAgICAgICBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZXBhdGgpXG4gICAgICAgIHJldHVybiBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhcImNkICcje2Rpcn0nICYmIHB1bHAgcnVuXCIpXG4gICAgfVxuICBSOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ1JzY3JpcHQnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuUi5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIHJldHVybiBbdG1wRmlsZV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnUnNjcmlwdCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgUmFja2V0OlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3JhY2tldCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3JhY2tldCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgXCJSZW4nUHlcIjpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncmVucHknXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoLnN1YnN0cigwLCBmaWxlcGF0aC5sYXN0SW5kZXhPZignL2dhbWUnKSldXG5cbiAgJ1JvYm90IEZyYW1ld29yayc6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3JvYm90J1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBSdXN0OlxuICAgICdGaWxlIEJhc2VkJzoge1xuICAgICAgY29tbWFuZFxuICAgICAgYXJnczogKHtmaWxlcGF0aCwgZmlsZW5hbWV9KSAtPlxuICAgICAgICBpZiB3aW5kb3dzXG4gICAgICAgICAgcmV0dXJuIFtcIi9jIHJ1c3RjICN7ZmlsZXBhdGh9ICYmICN7ZmlsZW5hbWVbLi4tNF19LmV4ZVwiXVxuICAgICAgICBlbHNlIFsnLWMnLCBcInJ1c3RjICcje2ZpbGVwYXRofScgLW8gL3RtcC9ycy5vdXQgJiYgL3RtcC9ycy5vdXRcIl1cbiAgICB9XG4gIFNjYWxhOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3NjYWxhJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnc2NhbGEnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIFN0YXRhOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3N0YXRhJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnZG8nLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnc3RhdGEnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWydkbycsIGZpbGVwYXRoXVxuXG4gIFR1cmluZzpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAndHVyaW5nJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLXJ1bicsIGZpbGVwYXRoXVxuIl19
