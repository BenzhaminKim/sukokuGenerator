
/*
Requires https://github.com/bbatsov/rubocop
 */

(function() {
  "use strict";
  var Beautifier, Rubocop, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  module.exports = Rubocop = (function(superClass) {
    extend(Rubocop, superClass);

    function Rubocop() {
      return Rubocop.__super__.constructor.apply(this, arguments);
    }

    Rubocop.prototype.name = "Rubocop";

    Rubocop.prototype.link = "https://github.com/bbatsov/rubocop";

    Rubocop.prototype.isPreInstalled = false;

    Rubocop.prototype.options = {
      Ruby: {
        indent_size: true,
        rubocop_path: true
      }
    };

    Rubocop.prototype.executables = [
      {
        name: "Rubocop",
        cmd: "rubocop",
        homepage: "http://rubocop.readthedocs.io/",
        installation: "http://rubocop.readthedocs.io/en/latest/installation/",
        version: {
          parse: function(text) {
            return text.match(/(\d+\.\d+\.\d+)/)[1];
          }
        }
      }
    ];

    Rubocop.prototype.beautify = function(text, language, options, context) {
      var _relativePath, fullPath, projectPath, ref;
      fullPath = context.filePath || "";
      ref = atom.project.relativizePath(fullPath), projectPath = ref[0], _relativePath = ref[1];
      if (options.rubocop_path) {
        this.deprecateOptionForExecutable("Rubocop", "Ruby - Rubocop Path (rubocop_path)", "Path");
      }
      return this.Promise.all([options.rubocop_path ? this.which(options.rubocop_path) : void 0, this.which('rubocop')]).then((function(_this) {
        return function(paths) {
          var config, configFile, exeOptions, rubocopArguments, rubocopPath, tempConfig, yaml;
          _this.debug('rubocop paths', paths);
          rubocopPath = paths.find(function(p) {
            return p && path.isAbsolute(p);
          }) || "rubocop";
          _this.verbose('rubocopPath', rubocopPath);
          _this.debug('rubocopPath', rubocopPath, paths);
          configFile = _this.findFile(path.dirname(fullPath), ".rubocop.yml");
          if (configFile == null) {
            yaml = require("yaml-front-matter");
            config = {
              "Style/IndentationWidth": {
                "Width": options.indent_size
              }
            };
            tempConfig = _this.tempFile("rubocop-config", yaml.safeDump(config));
          }
          rubocopArguments = ["--auto-correct", "--force-exclusion", "--stdin", fullPath || "atom-beautify.rb"];
          exeOptions = {
            ignoreReturnCode: true,
            cwd: configFile != null ? projectPath : void 0,
            onStdin: function(stdin) {
              return stdin.end(text);
            }
          };
          if (tempConfig != null) {
            rubocopArguments.push("--config", tempConfig);
          }
          _this.debug("rubocop arguments", rubocopArguments);
          return (options.rubocop_path ? _this.run(rubocopPath, rubocopArguments, exeOptions) : _this.exe("rubocop").run(rubocopArguments, exeOptions)).then(function(stdout) {
            var result;
            _this.debug("rubocop output", stdout);
            if (stdout.length === 0) {
              return text;
            }
            result = stdout.split("====================\n");
            if (result.length === 1) {
              result = stdout.split("====================\r\n");
            }
            return result[result.length - 1];
          });
        };
      })(this));
    };

    return Rubocop;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3J1Ym9jb3AuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLHlCQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7c0JBQ3JCLElBQUEsR0FBTTs7c0JBQ04sSUFBQSxHQUFNOztzQkFDTixjQUFBLEdBQWdCOztzQkFFaEIsT0FBQSxHQUFTO01BQ1AsSUFBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLElBQWI7UUFDQSxZQUFBLEVBQWMsSUFEZDtPQUZLOzs7c0JBTVQsV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sU0FEUjtRQUVFLEdBQUEsRUFBSyxTQUZQO1FBR0UsUUFBQSxFQUFVLGdDQUhaO1FBSUUsWUFBQSxFQUFjLHVEQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7bUJBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxpQkFBWCxDQUE4QixDQUFBLENBQUE7VUFBeEMsQ0FEQTtTQUxYO09BRFc7OztzQkFZYixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixFQUEwQixPQUExQjtBQUNSLFVBQUE7TUFBQSxRQUFBLEdBQVcsT0FBTyxDQUFDLFFBQVIsSUFBb0I7TUFDL0IsTUFBK0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQS9CLEVBQUMsb0JBQUQsRUFBYztNQUdkLElBQUcsT0FBTyxDQUFDLFlBQVg7UUFDRSxJQUFDLENBQUEsNEJBQUQsQ0FBOEIsU0FBOUIsRUFBeUMsb0NBQXpDLEVBQStFLE1BQS9FLEVBREY7O2FBSUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFULENBQWEsQ0FDcUIsT0FBTyxDQUFDLFlBQXhDLEdBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxPQUFPLENBQUMsWUFBZixDQUFBLEdBQUEsTUFEVyxFQUVYLElBQUMsQ0FBQSxLQUFELENBQU8sU0FBUCxDQUZXLENBQWIsQ0FJQSxDQUFDLElBSkQsQ0FJTSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtBQUNKLGNBQUE7VUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLGVBQVAsRUFBd0IsS0FBeEI7VUFFQSxXQUFBLEdBQWMsS0FBSyxDQUFDLElBQU4sQ0FBVyxTQUFDLENBQUQ7bUJBQU8sQ0FBQSxJQUFNLElBQUksQ0FBQyxVQUFMLENBQWdCLENBQWhCO1VBQWIsQ0FBWCxDQUFBLElBQStDO1VBQzdELEtBQUMsQ0FBQSxPQUFELENBQVMsYUFBVCxFQUF3QixXQUF4QjtVQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQUFzQixXQUF0QixFQUFtQyxLQUFuQztVQUdBLFVBQUEsR0FBYSxLQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYixDQUFWLEVBQWtDLGNBQWxDO1VBQ2IsSUFBSSxrQkFBSjtZQUNFLElBQUEsR0FBTyxPQUFBLENBQVEsbUJBQVI7WUFDUCxNQUFBLEdBQVM7Y0FDUCx3QkFBQSxFQUNFO2dCQUFBLE9BQUEsRUFBUyxPQUFPLENBQUMsV0FBakI7ZUFGSzs7WUFJVCxVQUFBLEdBQWEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxnQkFBVixFQUE0QixJQUFJLENBQUMsUUFBTCxDQUFjLE1BQWQsQ0FBNUIsRUFOZjs7VUFRQSxnQkFBQSxHQUFtQixDQUNqQixnQkFEaUIsRUFFakIsbUJBRmlCLEVBR2pCLFNBSGlCLEVBR04sUUFBQSxJQUFZLGtCQUhOO1VBS25CLFVBQUEsR0FBYTtZQUNYLGdCQUFBLEVBQWtCLElBRFA7WUFFWCxHQUFBLEVBQW9CLGtCQUFmLEdBQUEsV0FBQSxHQUFBLE1BRk07WUFHWCxPQUFBLEVBQVMsU0FBQyxLQUFEO3FCQUFXLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVjtZQUFYLENBSEU7O1VBS2IsSUFBaUQsa0JBQWpEO1lBQUEsZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsVUFBdEIsRUFBa0MsVUFBbEMsRUFBQTs7VUFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLG1CQUFQLEVBQTRCLGdCQUE1QjtpQkFFQSxDQUFJLE9BQU8sQ0FBQyxZQUFYLEdBQ0MsS0FBQyxDQUFBLEdBQUQsQ0FBSyxXQUFMLEVBQWtCLGdCQUFsQixFQUFvQyxVQUFwQyxDQURELEdBRUMsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFMLENBQWUsQ0FBQyxHQUFoQixDQUFvQixnQkFBcEIsRUFBc0MsVUFBdEMsQ0FGRixDQUdDLENBQUMsSUFIRixDQUdPLFNBQUMsTUFBRDtBQUNMLGdCQUFBO1lBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxnQkFBUCxFQUF5QixNQUF6QjtZQUVBLElBQWUsTUFBTSxDQUFDLE1BQVAsS0FBaUIsQ0FBaEM7QUFBQSxxQkFBTyxLQUFQOztZQUVBLE1BQUEsR0FBUyxNQUFNLENBQUMsS0FBUCxDQUFhLHdCQUFiO1lBQ1QsSUFBcUQsTUFBTSxDQUFDLE1BQVAsS0FBaUIsQ0FBdEU7Y0FBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLEtBQVAsQ0FBYSwwQkFBYixFQUFUOzttQkFFQSxNQUFPLENBQUEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBaEI7VUFSRixDQUhQO1FBOUJJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpOO0lBVFE7Ozs7S0F2QjJCO0FBUnZDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vYmJhdHNvdi9ydWJvY29wXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJ1Ym9jb3AgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUnVib2NvcFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2JiYXRzb3YvcnVib2NvcFwiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuXG4gIG9wdGlvbnM6IHtcbiAgICBSdWJ5OlxuICAgICAgaW5kZW50X3NpemU6IHRydWVcbiAgICAgIHJ1Ym9jb3BfcGF0aDogdHJ1ZVxuICB9XG5cbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIlJ1Ym9jb3BcIlxuICAgICAgY21kOiBcInJ1Ym9jb3BcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cDovL3J1Ym9jb3AucmVhZHRoZWRvY3MuaW8vXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwOi8vcnVib2NvcC5yZWFkdGhlZG9jcy5pby9lbi9sYXRlc3QvaW5zdGFsbGF0aW9uL1wiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMsIGNvbnRleHQpIC0+XG4gICAgZnVsbFBhdGggPSBjb250ZXh0LmZpbGVQYXRoIG9yIFwiXCJcbiAgICBbcHJvamVjdFBhdGgsIF9yZWxhdGl2ZVBhdGhdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZ1bGxQYXRoKVxuXG4gICAgIyBEZXByZWNhdGUgb3B0aW9ucy5ydWJvY29wX3BhdGhcbiAgICBpZiBvcHRpb25zLnJ1Ym9jb3BfcGF0aFxuICAgICAgQGRlcHJlY2F0ZU9wdGlvbkZvckV4ZWN1dGFibGUoXCJSdWJvY29wXCIsIFwiUnVieSAtIFJ1Ym9jb3AgUGF0aCAocnVib2NvcF9wYXRoKVwiLCBcIlBhdGhcIilcblxuICAgICMgRmluZCB0aGUgcnVib2NvcCBwYXRoXG4gICAgQFByb21pc2UuYWxsKFtcbiAgICAgIEB3aGljaChvcHRpb25zLnJ1Ym9jb3BfcGF0aCkgaWYgb3B0aW9ucy5ydWJvY29wX3BhdGhcbiAgICAgIEB3aGljaCgncnVib2NvcCcpXG4gICAgXSlcbiAgICAudGhlbigocGF0aHMpID0+XG4gICAgICBAZGVidWcoJ3J1Ym9jb3AgcGF0aHMnLCBwYXRocylcbiAgICAgICMgR2V0IGZpcnN0IHZhbGlkLCBhYnNvbHV0ZSBwYXRoXG4gICAgICBydWJvY29wUGF0aCA9IHBhdGhzLmZpbmQoKHApIC0+IHAgYW5kIHBhdGguaXNBYnNvbHV0ZShwKSkgb3IgXCJydWJvY29wXCJcbiAgICAgIEB2ZXJib3NlKCdydWJvY29wUGF0aCcsIHJ1Ym9jb3BQYXRoKVxuICAgICAgQGRlYnVnKCdydWJvY29wUGF0aCcsIHJ1Ym9jb3BQYXRoLCBwYXRocylcblxuICAgICAgIyBGaW5kIG9yIGdlbmVyYXRlIGEgY29uZmlnIGZpbGUgaWYgbm9uIGV4aXN0c1xuICAgICAgY29uZmlnRmlsZSA9IEBmaW5kRmlsZShwYXRoLmRpcm5hbWUoZnVsbFBhdGgpLCBcIi5ydWJvY29wLnltbFwiKVxuICAgICAgaWYgIWNvbmZpZ0ZpbGU/XG4gICAgICAgIHlhbWwgPSByZXF1aXJlKFwieWFtbC1mcm9udC1tYXR0ZXJcIilcbiAgICAgICAgY29uZmlnID0ge1xuICAgICAgICAgIFwiU3R5bGUvSW5kZW50YXRpb25XaWR0aFwiOlxuICAgICAgICAgICAgXCJXaWR0aFwiOiBvcHRpb25zLmluZGVudF9zaXplXG4gICAgICAgIH1cbiAgICAgICAgdGVtcENvbmZpZyA9IEB0ZW1wRmlsZShcInJ1Ym9jb3AtY29uZmlnXCIsIHlhbWwuc2FmZUR1bXAoY29uZmlnKSlcblxuICAgICAgcnVib2NvcEFyZ3VtZW50cyA9IFtcbiAgICAgICAgXCItLWF1dG8tY29ycmVjdFwiXG4gICAgICAgIFwiLS1mb3JjZS1leGNsdXNpb25cIlxuICAgICAgICBcIi0tc3RkaW5cIiwgZnVsbFBhdGggb3IgXCJhdG9tLWJlYXV0aWZ5LnJiXCIgIyAtLXN0ZGluIHJlcXVpcmVzIGFuIGFyZ3VtZW50XG4gICAgICBdXG4gICAgICBleGVPcHRpb25zID0ge1xuICAgICAgICBpZ25vcmVSZXR1cm5Db2RlOiB0cnVlLFxuICAgICAgICBjd2Q6IHByb2plY3RQYXRoIGlmIGNvbmZpZ0ZpbGU/LFxuICAgICAgICBvblN0ZGluOiAoc3RkaW4pIC0+IHN0ZGluLmVuZCB0ZXh0XG4gICAgICB9XG4gICAgICBydWJvY29wQXJndW1lbnRzLnB1c2goXCItLWNvbmZpZ1wiLCB0ZW1wQ29uZmlnKSBpZiB0ZW1wQ29uZmlnP1xuICAgICAgQGRlYnVnKFwicnVib2NvcCBhcmd1bWVudHNcIiwgcnVib2NvcEFyZ3VtZW50cylcblxuICAgICAgKGlmIG9wdGlvbnMucnVib2NvcF9wYXRoIHRoZW4gXFxcbiAgICAgICAgQHJ1bihydWJvY29wUGF0aCwgcnVib2NvcEFyZ3VtZW50cywgZXhlT3B0aW9ucykgZWxzZSBcXFxuICAgICAgICBAZXhlKFwicnVib2NvcFwiKS5ydW4ocnVib2NvcEFyZ3VtZW50cywgZXhlT3B0aW9ucylcbiAgICAgICkudGhlbigoc3Rkb3V0KSA9PlxuICAgICAgICBAZGVidWcoXCJydWJvY29wIG91dHB1dFwiLCBzdGRvdXQpXG4gICAgICAgICMgUnVib2NvcCBvdXRwdXQgYW4gZXJyb3IgaWYgc3Rkb3V0IGlzIGVtcHR5XG4gICAgICAgIHJldHVybiB0ZXh0IGlmIHN0ZG91dC5sZW5ndGggPT0gMFxuXG4gICAgICAgIHJlc3VsdCA9IHN0ZG91dC5zcGxpdChcIj09PT09PT09PT09PT09PT09PT09XFxuXCIpXG4gICAgICAgIHJlc3VsdCA9IHN0ZG91dC5zcGxpdChcIj09PT09PT09PT09PT09PT09PT09XFxyXFxuXCIpIGlmIHJlc3VsdC5sZW5ndGggPT0gMVxuXG4gICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV1cbiAgICAgIClcbiAgICApXG4iXX0=
