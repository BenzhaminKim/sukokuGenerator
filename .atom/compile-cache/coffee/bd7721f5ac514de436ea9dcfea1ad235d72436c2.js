(function() {
  var GrammarUtils, args, command, path, windows;

  path = require('path');

  command = (GrammarUtils = require('../grammar-utils')).command;

  windows = GrammarUtils.OperatingSystem.isWindows();

  args = function(filepath, jar) {
    var cmd;
    jar = (jar != null ? jar : path.basename(filepath)).replace(/\.kt$/, '.jar');
    cmd = "kotlinc '" + filepath + "' -include-runtime -d " + jar + " && java -jar " + jar;
    return GrammarUtils.formatArgs(cmd);
  };

  module.exports = {
    Java: {
      'File Based': {
        command: command,
        args: function(context) {
          var className, classPackages, sourcePath;
          className = GrammarUtils.Java.getClassName(context);
          classPackages = GrammarUtils.Java.getClassPackage(context);
          sourcePath = GrammarUtils.Java.getProjectPath(context);
          if (windows) {
            return ["/c javac -Xlint " + context.filename + " && java " + className];
          } else {
            return ['-c', "javac -J-Dfile.encoding=UTF-8 -sourcepath '" + sourcePath + "' -d /tmp '" + context.filepath + "' && java -Dfile.encoding=UTF-8 -cp /tmp " + classPackages + className];
          }
        }
      }
    },
    Kotlin: {
      'Selection Based': {
        command: command,
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code, '.kt');
          return args(tmpFile);
        }
      },
      'File Based': {
        command: command,
        args: function(arg) {
          var filename, filepath;
          filepath = arg.filepath, filename = arg.filename;
          return args(filepath, "/tmp/" + filename);
        }
      }
    },
    Processing: {
      'File Based': {
        command: 'processing-java',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ["--sketch=" + (path.dirname(filepath)), "--run"];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvamF2YS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDTixVQUFXLENBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUFmOztFQUVaLE9BQUEsR0FBVSxZQUFZLENBQUMsZUFBZSxDQUFDLFNBQTdCLENBQUE7O0VBRVYsSUFBQSxHQUFPLFNBQUMsUUFBRCxFQUFXLEdBQVg7QUFDTCxRQUFBO0lBQUEsR0FBQSxHQUFNLGVBQUMsTUFBTSxJQUFJLENBQUMsUUFBTCxDQUFjLFFBQWQsQ0FBUCxDQUErQixDQUFDLE9BQWhDLENBQXdDLE9BQXhDLEVBQWlELE1BQWpEO0lBQ04sR0FBQSxHQUFNLFdBQUEsR0FBWSxRQUFaLEdBQXFCLHdCQUFyQixHQUE2QyxHQUE3QyxHQUFpRCxnQkFBakQsR0FBaUU7QUFDdkUsV0FBTyxZQUFZLENBQUMsVUFBYixDQUF3QixHQUF4QjtFQUhGOztFQUtQLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxJQUFBLEVBQ0U7TUFBQSxZQUFBLEVBQWM7UUFDWixTQUFBLE9BRFk7UUFFWixJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osY0FBQTtVQUFBLFNBQUEsR0FBWSxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQWxCLENBQStCLE9BQS9CO1VBQ1osYUFBQSxHQUFnQixZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWxCLENBQWtDLE9BQWxDO1VBQ2hCLFVBQUEsR0FBYSxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWxCLENBQWlDLE9BQWpDO1VBQ2IsSUFBRyxPQUFIO0FBQ0UsbUJBQU8sQ0FBQyxrQkFBQSxHQUFtQixPQUFPLENBQUMsUUFBM0IsR0FBb0MsV0FBcEMsR0FBK0MsU0FBaEQsRUFEVDtXQUFBLE1BQUE7bUJBRUssQ0FBQyxJQUFELEVBQU8sNkNBQUEsR0FBOEMsVUFBOUMsR0FBeUQsYUFBekQsR0FBc0UsT0FBTyxDQUFDLFFBQTlFLEdBQXVGLDJDQUF2RixHQUFrSSxhQUFsSSxHQUFrSixTQUF6SixFQUZMOztRQUpJLENBRk07T0FBZDtLQURGO0lBV0EsTUFBQSxFQUNFO01BQUEsaUJBQUEsRUFBbUI7UUFDakIsU0FBQSxPQURpQjtRQUVqQixJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osY0FBQTtVQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1VBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQyxFQUEwQyxLQUExQztBQUNWLGlCQUFPLElBQUEsQ0FBSyxPQUFMO1FBSEgsQ0FGVztPQUFuQjtNQU9BLFlBQUEsRUFBYztRQUNaLFNBQUEsT0FEWTtRQUVaLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBMEIsY0FBQTtVQUF4Qix5QkFBVTtpQkFBYyxJQUFBLENBQUssUUFBTCxFQUFlLE9BQUEsR0FBUSxRQUF2QjtRQUExQixDQUZNO09BUGQ7S0FaRjtJQXVCQSxVQUFBLEVBQ0U7TUFBQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsaUJBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsV0FBQSxHQUFXLENBQUMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBQUQsQ0FBWixFQUF1QyxPQUF2QztRQUFoQixDQUROO09BREY7S0F4QkY7O0FBWkYiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcbntjb21tYW5kfSA9IEdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbndpbmRvd3MgPSBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpXG5cbmFyZ3MgPSAoZmlsZXBhdGgsIGphcikgLT5cbiAgamFyID0gKGphciA/IHBhdGguYmFzZW5hbWUoZmlsZXBhdGgpKS5yZXBsYWNlIC9cXC5rdCQvLCAnLmphcidcbiAgY21kID0gXCJrb3RsaW5jICcje2ZpbGVwYXRofScgLWluY2x1ZGUtcnVudGltZSAtZCAje2phcn0gJiYgamF2YSAtamFyICN7amFyfVwiXG4gIHJldHVybiBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhjbWQpXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBKYXZhOlxuICAgICdGaWxlIEJhc2VkJzoge1xuICAgICAgY29tbWFuZFxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNsYXNzTmFtZSA9IEdyYW1tYXJVdGlscy5KYXZhLmdldENsYXNzTmFtZSBjb250ZXh0XG4gICAgICAgIGNsYXNzUGFja2FnZXMgPSBHcmFtbWFyVXRpbHMuSmF2YS5nZXRDbGFzc1BhY2thZ2UgY29udGV4dFxuICAgICAgICBzb3VyY2VQYXRoID0gR3JhbW1hclV0aWxzLkphdmEuZ2V0UHJvamVjdFBhdGggY29udGV4dFxuICAgICAgICBpZiB3aW5kb3dzXG4gICAgICAgICAgcmV0dXJuIFtcIi9jIGphdmFjIC1YbGludCAje2NvbnRleHQuZmlsZW5hbWV9ICYmIGphdmEgI3tjbGFzc05hbWV9XCJdXG4gICAgICAgIGVsc2UgWyctYycsIFwiamF2YWMgLUotRGZpbGUuZW5jb2Rpbmc9VVRGLTggLXNvdXJjZXBhdGggJyN7c291cmNlUGF0aH0nIC1kIC90bXAgJyN7Y29udGV4dC5maWxlcGF0aH0nICYmIGphdmEgLURmaWxlLmVuY29kaW5nPVVURi04IC1jcCAvdG1wICN7Y2xhc3NQYWNrYWdlc30je2NsYXNzTmFtZX1cIl1cbiAgICB9XG4gIEtvdGxpbjpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzoge1xuICAgICAgY29tbWFuZFxuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy5rdCcpXG4gICAgICAgIHJldHVybiBhcmdzKHRtcEZpbGUpXG4gICAgfVxuICAgICdGaWxlIEJhc2VkJzoge1xuICAgICAgY29tbWFuZFxuICAgICAgYXJnczogKHtmaWxlcGF0aCwgZmlsZW5hbWV9KSAtPiBhcmdzKGZpbGVwYXRoLCBcIi90bXAvI3tmaWxlbmFtZX1cIilcbiAgICB9XG4gIFByb2Nlc3Npbmc6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3Byb2Nlc3NpbmctamF2YSdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbXCItLXNrZXRjaD0je3BhdGguZGlybmFtZShmaWxlcGF0aCl9XCIsIFwiLS1ydW5cIl1cbiJdfQ==
