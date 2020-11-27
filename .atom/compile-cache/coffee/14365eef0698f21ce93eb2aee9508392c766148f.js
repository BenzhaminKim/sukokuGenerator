(function() {
  var GrammarUtils, command, windows;

  command = (GrammarUtils = require('../grammar-utils')).command;

  windows = GrammarUtils.OperatingSystem.isWindows();

  module.exports = {
    BuckleScript: {
      'Selection Based': {
        command: 'bsc',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-c', tmpFile];
        }
      },
      'File Based': {
        command: 'bsc',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-c', filepath];
        }
      }
    },
    OCaml: {
      'File Based': {
        command: 'ocaml',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Reason: {
      'File Based': {
        command: command,
        args: function(arg) {
          var file, filename;
          filename = arg.filename;
          file = filename.replace(/\.re$/, '.native');
          return GrammarUtils.formatArgs("rebuild '" + file + "' && '" + file + "'");
        }
      }
    },
    'Standard ML': {
      'File Based': {
        command: 'sml',
        args: function(arg) {
          var filename;
          filename = arg.filename;
          return [filename];
        }
      },
      'Selection Based': {
        command: 'sml',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code, '.sml');
          return [tmpFile];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvbWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxVQUFXLENBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUFmOztFQUVaLE9BQUEsR0FBVSxZQUFZLENBQUMsZUFBZSxDQUFDLFNBQTdCLENBQUE7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLFlBQUEsRUFDRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsS0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixjQUFBO1VBQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUE7VUFDUCxPQUFBLEdBQVUsWUFBWSxDQUFDLHNCQUFiLENBQW9DLElBQXBDO0FBQ1YsaUJBQU8sQ0FBQyxJQUFELEVBQU8sT0FBUDtRQUhILENBRE47T0FERjtNQU9BLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxLQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLElBQUQsRUFBTyxRQUFQO1FBQWhCLENBRE47T0FSRjtLQURGO0lBWUEsS0FBQSxFQUNFO01BQUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE9BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsUUFBRDtRQUFoQixDQUROO09BREY7S0FiRjtJQWlCQSxNQUFBLEVBQ0U7TUFBQSxZQUFBLEVBQWM7UUFDWixTQUFBLE9BRFk7UUFFWixJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQ0osY0FBQTtVQURNLFdBQUQ7VUFDTCxJQUFBLEdBQU8sUUFBUSxDQUFDLE9BQVQsQ0FBaUIsT0FBakIsRUFBMEIsU0FBMUI7aUJBQ1AsWUFBWSxDQUFDLFVBQWIsQ0FBd0IsV0FBQSxHQUFZLElBQVosR0FBaUIsUUFBakIsR0FBeUIsSUFBekIsR0FBOEIsR0FBdEQ7UUFGSSxDQUZNO09BQWQ7S0FsQkY7SUF5QkEsYUFBQSxFQUNFO01BQUEsWUFBQSxFQUFjO1FBQ1osT0FBQSxFQUFTLEtBREc7UUFFWixJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO0FBQWUsaUJBQU8sQ0FBQyxRQUFEO1FBQXZCLENBRk07T0FBZDtNQUtBLGlCQUFBLEVBQW1CO1FBQ2pCLE9BQUEsRUFBUyxLQURRO1FBRWpCLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixjQUFBO1VBQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUE7VUFDUCxPQUFBLEdBQVUsWUFBWSxDQUFDLHNCQUFiLENBQW9DLElBQXBDLEVBQTBDLE1BQTFDO0FBQ1YsaUJBQU8sQ0FBQyxPQUFEO1FBSEgsQ0FGVztPQUxuQjtLQTFCRjs7QUFORiIsInNvdXJjZXNDb250ZW50IjpbIntjb21tYW5kfSA9IEdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbndpbmRvd3MgPSBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBCdWNrbGVTY3JpcHQ6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnYnNjJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgcmV0dXJuIFsnLWMnLCB0bXBGaWxlXVxuXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2JzYydcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1jJywgZmlsZXBhdGhdXG5cbiAgT0NhbWw6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ29jYW1sJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBSZWFzb246XG4gICAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgICBjb21tYW5kXG4gICAgICBhcmdzOiAoe2ZpbGVuYW1lfSkgLT5cbiAgICAgICAgZmlsZSA9IGZpbGVuYW1lLnJlcGxhY2UgL1xcLnJlJC8sICcubmF0aXZlJ1xuICAgICAgICBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhcInJlYnVpbGQgJyN7ZmlsZX0nICYmICcje2ZpbGV9J1wiKVxuICAgIH1cblxuICAnU3RhbmRhcmQgTUwnOlxuICAgICdGaWxlIEJhc2VkJzoge1xuICAgICAgY29tbWFuZDogJ3NtbCdcbiAgICAgIGFyZ3M6ICh7ZmlsZW5hbWV9KSAtPiByZXR1cm4gW2ZpbGVuYW1lXTtcbiAgICB9XG5cbiAgICAnU2VsZWN0aW9uIEJhc2VkJzoge1xuICAgICAgY29tbWFuZDogJ3NtbCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcuc21sJylcbiAgICAgICAgcmV0dXJuIFt0bXBGaWxlXVxuICAgIH1cbiJdfQ==
