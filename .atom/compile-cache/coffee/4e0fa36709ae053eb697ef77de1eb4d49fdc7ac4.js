(function() {
  var Executable, HybridExecutable, Promise, _, fs, os, parentConfigKey, path, semver, spawn, which,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Promise = require('bluebird');

  _ = require('lodash');

  which = require('which');

  spawn = require('child_process').spawn;

  path = require('path');

  semver = require('semver');

  os = require('os');

  fs = require('fs');

  parentConfigKey = "atom-beautify.executables";

  Executable = (function() {
    var isInstalled, version;

    Executable.prototype.name = null;

    Executable.prototype.cmd = null;

    Executable.prototype.key = null;

    Executable.prototype.homepage = null;

    Executable.prototype.installation = null;

    Executable.prototype.versionArgs = ['--version'];

    Executable.prototype.versionParse = function(text) {
      return semver.clean(text);
    };

    Executable.prototype.versionRunOptions = {};

    Executable.prototype.versionsSupported = '>= 0.0.0';

    Executable.prototype.required = true;

    function Executable(options) {
      var versionOptions;
      if (options.cmd == null) {
        throw new Error("The command (i.e. cmd property) is required for an Executable.");
      }
      this.name = options.name;
      this.cmd = options.cmd;
      this.key = this.cmd;
      this.homepage = options.homepage;
      this.installation = options.installation;
      this.required = !options.optional;
      if (options.version != null) {
        versionOptions = options.version;
        if (versionOptions.args) {
          this.versionArgs = versionOptions.args;
        }
        if (versionOptions.parse) {
          this.versionParse = versionOptions.parse;
        }
        if (versionOptions.runOptions) {
          this.versionRunOptions = versionOptions.runOptions;
        }
        if (versionOptions.supported) {
          this.versionsSupported = versionOptions.supported;
        }
      }
      this.setupLogger();
    }

    Executable.prototype.init = function() {
      return Promise.all([this.loadVersion()]).then((function(_this) {
        return function() {
          return _this.verbose("Done init of " + _this.name);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (!_this.required) {
            _this.verbose("Not required");
            return _this;
          } else {
            return Promise.reject(error);
          }
        };
      })(this));
    };


    /*
    Logger instance
     */

    Executable.prototype.logger = null;


    /*
    Initialize and configure Logger
     */

    Executable.prototype.setupLogger = function() {
      var key, method, ref;
      this.logger = require('../logger')(this.name + " Executable");
      ref = this.logger;
      for (key in ref) {
        method = ref[key];
        this[key] = method;
      }
      return this.verbose(this.name + " executable logger has been initialized.");
    };

    isInstalled = null;

    version = null;

    Executable.prototype.loadVersion = function(force) {
      if (force == null) {
        force = false;
      }
      this.verbose("loadVersion", this.version, force);
      if (force || (this.version == null)) {
        this.verbose("Loading version without cache");
        return this.runVersion().then((function(_this) {
          return function(text) {
            return _this.saveVersion(text);
          };
        })(this));
      } else {
        this.verbose("Loading cached version");
        return Promise.resolve(this.version);
      }
    };

    Executable.prototype.runVersion = function() {
      return this.run(this.versionArgs, this.versionRunOptions).then((function(_this) {
        return function(version) {
          _this.info("Version text: " + version);
          return version;
        };
      })(this));
    };

    Executable.prototype.saveVersion = function(text) {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.versionParse(text);
        };
      })(this)).then(function(version) {
        var valid;
        valid = Boolean(semver.valid(version));
        if (!valid) {
          throw new Error("Version is not valid: " + version);
        }
        return version;
      }).then((function(_this) {
        return function(version) {
          _this.isInstalled = true;
          return _this.version = version;
        };
      })(this)).then((function(_this) {
        return function(version) {
          _this.info(_this.cmd + " version: " + version);
          return version;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          var help;
          _this.isInstalled = false;
          _this.error(error);
          help = {
            program: _this.cmd,
            link: _this.installation || _this.homepage,
            pathOption: "Executable - " + (_this.name || _this.cmd) + " - Path"
          };
          return Promise.reject(_this.commandNotFoundError(_this.name || _this.cmd, help));
        };
      })(this));
    };

    Executable.prototype.isSupported = function() {
      return this.isVersion(this.versionsSupported);
    };

    Executable.prototype.isVersion = function(range) {
      return this.versionSatisfies(this.version, range);
    };

    Executable.prototype.versionSatisfies = function(version, range) {
      return semver.satisfies(version, range);
    };

    Executable.prototype.getConfig = function() {
      return (typeof atom !== "undefined" && atom !== null ? atom.config.get(parentConfigKey + "." + this.key) : void 0) || {};
    };


    /*
    Run command-line interface command
     */

    Executable.prototype.run = function(args, options) {
      var cmd, cwd, exeName, help, ignoreReturnCode, onStdin, returnStderr, returnStdoutOrStderr;
      if (options == null) {
        options = {};
      }
      this.debug("Run: ", this.cmd, args, options);
      cmd = options.cmd, cwd = options.cwd, ignoreReturnCode = options.ignoreReturnCode, help = options.help, onStdin = options.onStdin, returnStderr = options.returnStderr, returnStdoutOrStderr = options.returnStdoutOrStderr;
      exeName = cmd || this.cmd;
      if (cwd == null) {
        cwd = os.tmpdir();
      }
      if (help == null) {
        help = {
          program: this.cmd,
          link: this.installation || this.homepage,
          pathOption: "Executable - " + (this.name || this.cmd) + " - Path"
        };
      }
      return Promise.all([this.shellEnv(), this.resolveArgs(args)]).then((function(_this) {
        return function(arg1) {
          var args, env, exePath;
          env = arg1[0], args = arg1[1];
          _this.debug('exeName, args:', exeName, args);
          exePath = _this.path(exeName);
          return Promise.all([exeName, args, env, exePath]);
        };
      })(this)).then((function(_this) {
        return function(arg1) {
          var args, env, exe, exeName, exePath, spawnOptions;
          exeName = arg1[0], args = arg1[1], env = arg1[2], exePath = arg1[3];
          _this.debug('exePath:', exePath);
          _this.debug('env:', env);
          _this.debug('PATH:', env.PATH);
          _this.debug('args', args);
          args = _this.relativizePaths(args);
          _this.debug('relativized args', args);
          exe = exePath != null ? exePath : exeName;
          spawnOptions = {
            cwd: cwd,
            env: env
          };
          _this.debug('spawnOptions', spawnOptions);
          return _this.spawn(exe, args, spawnOptions, onStdin).then(function(arg2) {
            var returnCode, stderr, stdout, windowsProgramNotFoundMsg;
            returnCode = arg2.returnCode, stdout = arg2.stdout, stderr = arg2.stderr;
            _this.verbose('spawn result, returnCode', returnCode);
            _this.verbose('spawn result, stdout', stdout);
            _this.verbose('spawn result, stderr', stderr);
            if (!ignoreReturnCode && returnCode !== 0) {
              windowsProgramNotFoundMsg = "is not recognized as an internal or external command";
              _this.verbose(stderr, windowsProgramNotFoundMsg);
              if (_this.isWindows() && returnCode === 1 && stderr.indexOf(windowsProgramNotFoundMsg) !== -1) {
                throw _this.commandNotFoundError(exeName, help);
              } else {
                throw new Error(stderr || stdout);
              }
            } else {
              if (returnStdoutOrStderr) {
                return stdout || stderr;
              } else if (returnStderr) {
                return stderr;
              } else {
                return stdout;
              }
            }
          })["catch"](function(err) {
            _this.debug('error', err);
            if (err.code === 'ENOENT' || err.errno === 'ENOENT') {
              throw _this.commandNotFoundError(exeName, help);
            } else {
              throw err;
            }
          });
        };
      })(this));
    };

    Executable.prototype.path = function(cmd) {
      var config, exeName;
      if (cmd == null) {
        cmd = this.cmd;
      }
      config = this.getConfig();
      if (config && config.path) {
        return Promise.resolve(config.path);
      } else {
        exeName = cmd;
        return this.which(exeName);
      }
    };

    Executable.prototype.resolveArgs = function(args) {
      args = _.flatten(args);
      return Promise.all(args);
    };

    Executable.prototype.relativizePaths = function(args) {
      var newArgs, tmpDir;
      tmpDir = os.tmpdir();
      newArgs = args.map(function(arg) {
        var isTmpFile;
        isTmpFile = typeof arg === 'string' && !arg.includes(':') && path.isAbsolute(arg) && path.dirname(arg).startsWith(tmpDir);
        if (isTmpFile) {
          return path.relative(tmpDir, arg);
        }
        return arg;
      });
      return newArgs;
    };


    /*
    Spawn
     */

    Executable.prototype.spawn = function(exe, args, options, onStdin) {
      args = _.without(args, void 0);
      args = _.without(args, null);
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var cmd, stderr, stdout;
          _this.debug('spawn', exe, args);
          cmd = spawn(exe, args, options);
          stdout = "";
          stderr = "";
          cmd.stdout.on('data', function(data) {
            return stdout += data;
          });
          cmd.stderr.on('data', function(data) {
            return stderr += data;
          });
          cmd.on('close', function(returnCode) {
            _this.debug('spawn done', returnCode, stderr, stdout);
            return resolve({
              returnCode: returnCode,
              stdout: stdout,
              stderr: stderr
            });
          });
          cmd.on('error', function(err) {
            _this.debug('error', err);
            return reject(err);
          });
          if (onStdin) {
            return onStdin(cmd.stdin);
          }
        };
      })(this));
    };


    /*
    Add help to error.description
    
    Note: error.description is not officially used in JavaScript,
    however it is used internally for Atom Beautify when displaying errors.
     */

    Executable.prototype.commandNotFoundError = function(exe, help) {
      if (exe == null) {
        exe = this.name || this.cmd;
      }
      return this.constructor.commandNotFoundError(exe, help);
    };

    Executable.commandNotFoundError = function(exe, help) {
      var docsLink, er, helpStr, message;
      message = "Could not find '" + exe + "'. The program may not be installed.";
      er = new Error(message);
      er.code = 'CommandNotFound';
      er.errno = er.code;
      er.syscall = 'beautifier::run';
      er.file = exe;
      if (help != null) {
        if (typeof help === "object") {
          docsLink = "https://github.com/Glavin001/atom-beautify#beautifiers";
          helpStr = "See " + exe + " installation instructions at " + docsLink + (help.link ? ' or go to ' + help.link : '') + "\n";
          if (help.pathOption) {
            helpStr += "You can configure Atom Beautify with the absolute path to '" + (help.program || exe) + "' by setting '" + help.pathOption + "' in the Atom Beautify package settings.\n";
          }
          helpStr += "Your program is properly installed if running '" + (this.isWindows() ? 'where.exe' : 'which') + " " + exe + "' in your " + (this.isWindows() ? 'CMD prompt' : 'Terminal') + " returns an absolute path to the executable.\n";
          if (help.additional) {
            helpStr += help.additional;
          }
          er.description = helpStr;
        } else {
          er.description = help;
        }
      }
      return er;
    };

    Executable._envCache = null;

    Executable.prototype.shellEnv = function() {
      var env;
      env = this.constructor.shellEnv();
      this.debug("env", env);
      return env;
    };

    Executable.shellEnv = function() {
      return Promise.resolve(process.env);
    };


    /*
    Like the unix which utility.
    
    Finds the first instance of a specified executable in the PATH environment variable.
    Does not cache the results,
    so hash -r is not needed when the PATH changes.
    See https://github.com/isaacs/node-which
     */

    Executable.prototype.which = function(exe, options) {
      return this.constructor.which(exe, options);
    };

    Executable._whichCache = {};

    Executable.which = function(exe, options) {
      if (options == null) {
        options = {};
      }
      if (this._whichCache[exe]) {
        return Promise.resolve(this._whichCache[exe]);
      }
      return this.shellEnv().then((function(_this) {
        return function(env) {
          return new Promise(function(resolve, reject) {
            var i, ref;
            if (options.path == null) {
              options.path = env.PATH;
            }
            if (_this.isWindows()) {
              if (!options.path) {
                for (i in env) {
                  if (i.toLowerCase() === "path") {
                    options.path = env[i];
                    break;
                  }
                }
              }
              if (options.pathExt == null) {
                options.pathExt = ((ref = process.env.PATHEXT) != null ? ref : '.EXE') + ";";
              }
            }
            return which(exe, options, function(err, path) {
              if (err) {
                return resolve(exe);
              }
              _this._whichCache[exe] = path;
              return resolve(path);
            });
          });
        };
      })(this));
    };


    /*
    If platform is Windows
     */

    Executable.prototype.isWindows = function() {
      return this.constructor.isWindows();
    };

    Executable.isWindows = function() {
      return new RegExp('^win').test(process.platform);
    };

    return Executable;

  })();

  HybridExecutable = (function(superClass) {
    extend(HybridExecutable, superClass);

    HybridExecutable.prototype.dockerOptions = {
      image: void 0,
      workingDir: "/workdir"
    };

    function HybridExecutable(options) {
      HybridExecutable.__super__.constructor.call(this, options);
      this.verbose("HybridExecutable Options", options);
      if (options.docker != null) {
        this.dockerOptions = Object.assign({}, this.dockerOptions, options.docker);
        this.docker = this.constructor.dockerExecutable();
      }
    }

    HybridExecutable.docker = void 0;

    HybridExecutable.dockerExecutable = function() {
      if (this.docker == null) {
        this.docker = new Executable({
          name: "Docker",
          cmd: "docker",
          homepage: "https://www.docker.com/",
          installation: "https://www.docker.com/get-docker",
          version: {
            parse: function(text) {
              return text.match(/version [0]*([1-9]\d*).[0]*([0-9]\d*).[0]*([0-9]\d*)/).slice(1).join('.');
            }
          }
        });
      }
      return this.docker;
    };

    HybridExecutable.prototype.installedWithDocker = false;

    HybridExecutable.prototype.init = function() {
      return HybridExecutable.__super__.init.call(this).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (_this.docker == null) {
            return Promise.reject(error);
          }
          return Promise.resolve(error);
        };
      })(this)).then((function(_this) {
        return function(errorOrThis) {
          var shouldTryWithDocker;
          shouldTryWithDocker = !_this.isInstalled && (_this.docker != null);
          _this.verbose("Executable shouldTryWithDocker", shouldTryWithDocker, _this.isInstalled, _this.docker != null);
          if (shouldTryWithDocker) {
            return _this.initDocker()["catch"](function() {
              return Promise.reject(errorOrThis);
            });
          }
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (!_this.required) {
            _this.verbose("Not required");
            return _this;
          } else {
            return Promise.reject(error);
          }
        };
      })(this));
    };

    HybridExecutable.prototype.initDocker = function() {
      return this.docker.init().then((function(_this) {
        return function() {
          return _this.runImage(_this.versionArgs, _this.versionRunOptions);
        };
      })(this)).then((function(_this) {
        return function(text) {
          return _this.saveVersion(text);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.installedWithDocker = true;
        };
      })(this)).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(dockerError) {
          _this.debug(dockerError);
          return Promise.reject(dockerError);
        };
      })(this));
    };

    HybridExecutable.prototype.run = function(args, options) {
      if (options == null) {
        options = {};
      }
      this.verbose("Running HybridExecutable");
      this.verbose("installedWithDocker", this.installedWithDocker);
      this.verbose("docker", this.docker);
      this.verbose("docker.isInstalled", this.docker && this.docker.isInstalled);
      if (this.installedWithDocker && this.docker && this.docker.isInstalled) {
        return this.runImage(args, options);
      }
      return HybridExecutable.__super__.run.call(this, args, options);
    };

    HybridExecutable.prototype.runImage = function(args, options) {
      this.debug("Run Docker executable: ", args, options);
      return this.resolveArgs(args).then((function(_this) {
        return function(args) {
          var cwd, image, newArgs, pwd, rootPath, tmpDir, workingDir;
          cwd = options.cwd;
          tmpDir = os.tmpdir();
          pwd = fs.realpathSync(cwd || tmpDir);
          image = _this.dockerOptions.image;
          workingDir = _this.dockerOptions.workingDir;
          rootPath = '/mountedRoot';
          newArgs = args.map(function(arg) {
            if (typeof arg === 'string' && !arg.includes(':') && path.isAbsolute(arg) && !path.dirname(arg).startsWith(tmpDir)) {
              return path.join(rootPath, arg);
            } else {
              return arg;
            }
          });
          return _this.docker.run(["run", "--volume", pwd + ":" + workingDir, "--volume", (path.resolve('/')) + ":" + rootPath, "--workdir", workingDir, image, newArgs], Object.assign({}, options, {
            cmd: void 0
          }));
        };
      })(this));
    };

    return HybridExecutable;

  })(Executable);

  module.exports = HybridExecutable;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2V4ZWN1dGFibGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2RkFBQTtJQUFBOzs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0VBQ1YsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUNKLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7RUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQzs7RUFDakMsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjs7RUFDVCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLGVBQUEsR0FBa0I7O0VBR1o7QUFFSixRQUFBOzt5QkFBQSxJQUFBLEdBQU07O3lCQUNOLEdBQUEsR0FBSzs7eUJBQ0wsR0FBQSxHQUFLOzt5QkFDTCxRQUFBLEdBQVU7O3lCQUNWLFlBQUEsR0FBYzs7eUJBQ2QsV0FBQSxHQUFhLENBQUMsV0FBRDs7eUJBQ2IsWUFBQSxHQUFjLFNBQUMsSUFBRDthQUFVLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBYjtJQUFWOzt5QkFDZCxpQkFBQSxHQUFtQjs7eUJBQ25CLGlCQUFBLEdBQW1COzt5QkFDbkIsUUFBQSxHQUFVOztJQUVHLG9CQUFDLE9BQUQ7QUFFWCxVQUFBO01BQUEsSUFBSSxtQkFBSjtBQUNFLGNBQU0sSUFBSSxLQUFKLENBQVUsZ0VBQVYsRUFEUjs7TUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLE9BQU8sQ0FBQztNQUNoQixJQUFDLENBQUEsR0FBRCxHQUFPLE9BQU8sQ0FBQztNQUNmLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBO01B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UTs7OztLQXpFbUI7O0VBc0cvQixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQTljakIiLCJzb3VyY2VzQ29udGVudCI6WyJQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG53aGljaCA9IHJlcXVpcmUoJ3doaWNoJylcbnNwYXduID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLnNwYXduXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5zZW12ZXIgPSByZXF1aXJlKCdzZW12ZXInKVxub3MgPSByZXF1aXJlKCdvcycpXG5mcyA9IHJlcXVpcmUoJ2ZzJylcblxucGFyZW50Q29uZmlnS2V5ID0gXCJhdG9tLWJlYXV0aWZ5LmV4ZWN1dGFibGVzXCJcblxuXG5jbGFzcyBFeGVjdXRhYmxlXG5cbiAgbmFtZTogbnVsbFxuICBjbWQ6IG51bGxcbiAga2V5OiBudWxsXG4gIGhvbWVwYWdlOiBudWxsXG4gIGluc3RhbGxhdGlvbjogbnVsbFxuICB2ZXJzaW9uQXJnczogWyctLXZlcnNpb24nXVxuICB2ZXJzaW9uUGFyc2U6ICh0ZXh0KSAtPiBzZW12ZXIuY2xlYW4odGV4dClcbiAgdmVyc2lvblJ1bk9wdGlvbnM6IHt9XG4gIHZlcnNpb25zU3VwcG9ydGVkOiAnPj0gMC4wLjAnXG4gIHJlcXVpcmVkOiB0cnVlXG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgICMgVmFsaWRhdGlvblxuICAgIGlmICFvcHRpb25zLmNtZD9cbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBjb21tYW5kIChpLmUuIGNtZCBwcm9wZXJ0eSkgaXMgcmVxdWlyZWQgZm9yIGFuIEV4ZWN1dGFibGUuXCIpXG4gICAgQG5hbWUgPSBvcHRpb25zLm5hbWVcbiAgICBAY21kID0gb3B0aW9ucy5jbWRcbiAgICBAa2V5ID0gQGNtZFxuICAgIEBob21lcGFnZSA9IG9wdGlvbnMuaG9tZXBhZ2VcbiAgICBAaW5zdGFsbGF0aW9uID0gb3B0aW9ucy5pbnN0YWxsYXRpb25cbiAgICBAcmVxdWlyZWQgPSBub3Qgb3B0aW9ucy5vcHRpb25hbFxuICAgIGlmIG9wdGlvbnMudmVyc2lvbj9cbiAgICAgIHZlcnNpb25PcHRpb25zID0gb3B0aW9ucy52ZXJzaW9uXG4gICAgICBAdmVyc2lvbkFyZ3MgPSB2ZXJzaW9uT3B0aW9ucy5hcmdzIGlmIHZlcnNpb25PcHRpb25zLmFyZ3NcbiAgICAgIEB2ZXJzaW9uUGFyc2UgPSB2ZXJzaW9uT3B0aW9ucy5wYXJzZSBpZiB2ZXJzaW9uT3B0aW9ucy5wYXJzZVxuICAgICAgQHZlcnNpb25SdW5PcHRpb25zID0gdmVyc2lvbk9wdGlvbnMucnVuT3B0aW9ucyBpZiB2ZXJzaW9uT3B0aW9ucy5ydW5PcHRpb25zXG4gICAgICBAdmVyc2lvbnNTdXBwb3J0ZWQgPSB2ZXJzaW9uT3B0aW9ucy5zdXBwb3J0ZWQgaWYgdmVyc2lvbk9wdGlvbnMuc3VwcG9ydGVkXG4gICAgQHNldHVwTG9nZ2VyKClcblxuICBpbml0OiAoKSAtPlxuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIEBsb2FkVmVyc2lvbigpXG4gICAgXSlcbiAgICAgIC50aGVuKCgpID0+IEB2ZXJib3NlKFwiRG9uZSBpbml0IG9mICN7QG5hbWV9XCIpKVxuICAgICAgLnRoZW4oKCkgPT4gQClcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+XG4gICAgICAgIGlmIG5vdCBALnJlcXVpcmVkXG4gICAgICAgICAgQHZlcmJvc2UoXCJOb3QgcmVxdWlyZWRcIilcbiAgICAgICAgICBAXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChlcnJvcilcbiAgICAgIClcblxuICAjIyNcbiAgTG9nZ2VyIGluc3RhbmNlXG4gICMjI1xuICBsb2dnZXI6IG51bGxcbiAgIyMjXG4gIEluaXRpYWxpemUgYW5kIGNvbmZpZ3VyZSBMb2dnZXJcbiAgIyMjXG4gIHNldHVwTG9nZ2VyOiAtPlxuICAgIEBsb2dnZXIgPSByZXF1aXJlKCcuLi9sb2dnZXInKShcIiN7QG5hbWV9IEV4ZWN1dGFibGVcIilcbiAgICBmb3Iga2V5LCBtZXRob2Qgb2YgQGxvZ2dlclxuICAgICAgQFtrZXldID0gbWV0aG9kXG4gICAgQHZlcmJvc2UoXCIje0BuYW1lfSBleGVjdXRhYmxlIGxvZ2dlciBoYXMgYmVlbiBpbml0aWFsaXplZC5cIilcblxuICBpc0luc3RhbGxlZCA9IG51bGxcbiAgdmVyc2lvbiA9IG51bGxcbiAgbG9hZFZlcnNpb246IChmb3JjZSA9IGZhbHNlKSAtPlxuICAgIEB2ZXJib3NlKFwibG9hZFZlcnNpb25cIiwgQHZlcnNpb24sIGZvcmNlKVxuICAgIGlmIGZvcmNlIG9yICFAdmVyc2lvbj9cbiAgICAgIEB2ZXJib3NlKFwiTG9hZGluZyB2ZXJzaW9uIHdpdGhvdXQgY2FjaGVcIilcbiAgICAgIEBydW5WZXJzaW9uKClcbiAgICAgICAgLnRoZW4oKHRleHQpID0+IEBzYXZlVmVyc2lvbih0ZXh0KSlcbiAgICBlbHNlXG4gICAgICBAdmVyYm9zZShcIkxvYWRpbmcgY2FjaGVkIHZlcnNpb25cIilcbiAgICAgIFByb21pc2UucmVzb2x2ZShAdmVyc2lvbilcblxuICBydW5WZXJzaW9uOiAoKSAtPlxuICAgIEBydW4oQHZlcnNpb25BcmdzLCBAdmVyc2lvblJ1bk9wdGlvbnMpXG4gICAgICAudGhlbigodmVyc2lvbikgPT5cbiAgICAgICAgQGluZm8oXCJWZXJzaW9uIHRleHQ6IFwiICsgdmVyc2lvbilcbiAgICAgICAgdmVyc2lvblxuICAgICAgKVxuXG4gIHNhdmVWZXJzaW9uOiAodGV4dCkgLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgLnRoZW4oID0+IEB2ZXJzaW9uUGFyc2UodGV4dCkpXG4gICAgICAudGhlbigodmVyc2lvbikgLT5cbiAgICAgICAgdmFsaWQgPSBCb29sZWFuKHNlbXZlci52YWxpZCh2ZXJzaW9uKSlcbiAgICAgICAgaWYgbm90IHZhbGlkXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVmVyc2lvbiBpcyBub3QgdmFsaWQ6IFwiK3ZlcnNpb24pXG4gICAgICAgIHZlcnNpb25cbiAgICAgIClcbiAgICAgIC50aGVuKCh2ZXJzaW9uKSA9PlxuICAgICAgICBAaXNJbnN0YWxsZWQgPSB0cnVlXG4gICAgICAgIEB2ZXJzaW9uID0gdmVyc2lvblxuICAgICAgKVxuICAgICAgLnRoZW4oKHZlcnNpb24pID0+XG4gICAgICAgIEBpbmZvKFwiI3tAY21kfSB2ZXJzaW9uOiAje3ZlcnNpb259XCIpXG4gICAgICAgIHZlcnNpb25cbiAgICAgIClcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+XG4gICAgICAgIEBpc0luc3RhbGxlZCA9IGZhbHNlXG4gICAgICAgIEBlcnJvcihlcnJvcilcbiAgICAgICAgaGVscCA9IHtcbiAgICAgICAgICBwcm9ncmFtOiBAY21kXG4gICAgICAgICAgbGluazogQGluc3RhbGxhdGlvbiBvciBAaG9tZXBhZ2VcbiAgICAgICAgICBwYXRoT3B0aW9uOiBcIkV4ZWN1dGFibGUgLSAje0BuYW1lIG9yIEBjbWR9IC0gUGF0aFwiXG4gICAgICAgIH1cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoQGNvbW1hbmROb3RGb3VuZEVycm9yKEBuYW1lIG9yIEBjbWQsIGhlbHApKVxuICAgICAgKVxuXG4gIGlzU3VwcG9ydGVkOiAoKSAtPlxuICAgIEBpc1ZlcnNpb24oQHZlcnNpb25zU3VwcG9ydGVkKVxuXG4gIGlzVmVyc2lvbjogKHJhbmdlKSAtPlxuICAgIEB2ZXJzaW9uU2F0aXNmaWVzKEB2ZXJzaW9uLCByYW5nZSlcblxuICB2ZXJzaW9uU2F0aXNmaWVzOiAodmVyc2lvbiwgcmFuZ2UpIC0+XG4gICAgc2VtdmVyLnNhdGlzZmllcyh2ZXJzaW9uLCByYW5nZSlcblxuICBnZXRDb25maWc6ICgpIC0+XG4gICAgYXRvbT8uY29uZmlnLmdldChcIiN7cGFyZW50Q29uZmlnS2V5fS4je0BrZXl9XCIpIG9yIHt9XG5cbiAgIyMjXG4gIFJ1biBjb21tYW5kLWxpbmUgaW50ZXJmYWNlIGNvbW1hbmRcbiAgIyMjXG4gIHJ1bjogKGFyZ3MsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBAZGVidWcoXCJSdW46IFwiLCBAY21kLCBhcmdzLCBvcHRpb25zKVxuICAgIHsgY21kLCBjd2QsIGlnbm9yZVJldHVybkNvZGUsIGhlbHAsIG9uU3RkaW4sIHJldHVyblN0ZGVyciwgcmV0dXJuU3Rkb3V0T3JTdGRlcnIgfSA9IG9wdGlvbnNcbiAgICBleGVOYW1lID0gY21kIG9yIEBjbWRcbiAgICBjd2QgPz0gb3MudG1wZGlyKClcbiAgICBoZWxwID89IHtcbiAgICAgIHByb2dyYW06IEBjbWRcbiAgICAgIGxpbms6IEBpbnN0YWxsYXRpb24gb3IgQGhvbWVwYWdlXG4gICAgICBwYXRoT3B0aW9uOiBcIkV4ZWN1dGFibGUgLSAje0BuYW1lIG9yIEBjbWR9IC0gUGF0aFwiXG4gICAgfVxuXG4gICAgIyBSZXNvbHZlIGV4ZWN1dGFibGUgYW5kIGFsbCBhcmdzXG4gICAgUHJvbWlzZS5hbGwoW0BzaGVsbEVudigpLCB0aGlzLnJlc29sdmVBcmdzKGFyZ3MpXSlcbiAgICAgIC50aGVuKChbZW52LCBhcmdzXSkgPT5cbiAgICAgICAgQGRlYnVnKCdleGVOYW1lLCBhcmdzOicsIGV4ZU5hbWUsIGFyZ3MpXG4gICAgICAgICMgR2V0IFBBVEggYW5kIG90aGVyIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICAgICAgICBleGVQYXRoID0gQHBhdGgoZXhlTmFtZSlcbiAgICAgICAgUHJvbWlzZS5hbGwoW2V4ZU5hbWUsIGFyZ3MsIGVudiwgZXhlUGF0aF0pXG4gICAgICApXG4gICAgICAudGhlbigoW2V4ZU5hbWUsIGFyZ3MsIGVudiwgZXhlUGF0aF0pID0+XG4gICAgICAgIEBkZWJ1ZygnZXhlUGF0aDonLCBleGVQYXRoKVxuICAgICAgICBAZGVidWcoJ2VudjonLCBlbnYpXG4gICAgICAgIEBkZWJ1ZygnUEFUSDonLCBlbnYuUEFUSClcbiAgICAgICAgQGRlYnVnKCdhcmdzJywgYXJncylcbiAgICAgICAgYXJncyA9IHRoaXMucmVsYXRpdml6ZVBhdGhzKGFyZ3MpXG4gICAgICAgIEBkZWJ1ZygncmVsYXRpdml6ZWQgYXJncycsIGFyZ3MpXG5cbiAgICAgICAgZXhlID0gZXhlUGF0aCA/IGV4ZU5hbWVcbiAgICAgICAgc3Bhd25PcHRpb25zID0ge1xuICAgICAgICAgIGN3ZDogY3dkXG4gICAgICAgICAgZW52OiBlbnZcbiAgICAgICAgfVxuICAgICAgICBAZGVidWcoJ3NwYXduT3B0aW9ucycsIHNwYXduT3B0aW9ucylcblxuICAgICAgICBAc3Bhd24oZXhlLCBhcmdzLCBzcGF3bk9wdGlvbnMsIG9uU3RkaW4pXG4gICAgICAgICAgLnRoZW4oKHtyZXR1cm5Db2RlLCBzdGRvdXQsIHN0ZGVycn0pID0+XG4gICAgICAgICAgICBAdmVyYm9zZSgnc3Bhd24gcmVzdWx0LCByZXR1cm5Db2RlJywgcmV0dXJuQ29kZSlcbiAgICAgICAgICAgIEB2ZXJib3NlKCdzcGF3biByZXN1bHQsIHN0ZG91dCcsIHN0ZG91dClcbiAgICAgICAgICAgIEB2ZXJib3NlKCdzcGF3biByZXN1bHQsIHN0ZGVycicsIHN0ZGVycilcblxuICAgICAgICAgICAgIyBJZiByZXR1cm4gY29kZSBpcyBub3QgMCB0aGVuIGVycm9yIG9jY3VyZWRcbiAgICAgICAgICAgIGlmIG5vdCBpZ25vcmVSZXR1cm5Db2RlIGFuZCByZXR1cm5Db2RlIGlzbnQgMFxuICAgICAgICAgICAgICAjIG9wZXJhYmxlIHByb2dyYW0gb3IgYmF0Y2ggZmlsZVxuICAgICAgICAgICAgICB3aW5kb3dzUHJvZ3JhbU5vdEZvdW5kTXNnID0gXCJpcyBub3QgcmVjb2duaXplZCBhcyBhbiBpbnRlcm5hbCBvciBleHRlcm5hbCBjb21tYW5kXCJcblxuICAgICAgICAgICAgICBAdmVyYm9zZShzdGRlcnIsIHdpbmRvd3NQcm9ncmFtTm90Rm91bmRNc2cpXG5cbiAgICAgICAgICAgICAgaWYgQGlzV2luZG93cygpIGFuZCByZXR1cm5Db2RlIGlzIDEgYW5kIHN0ZGVyci5pbmRleE9mKHdpbmRvd3NQcm9ncmFtTm90Rm91bmRNc2cpIGlzbnQgLTFcbiAgICAgICAgICAgICAgICB0aHJvdyBAY29tbWFuZE5vdEZvdW5kRXJyb3IoZXhlTmFtZSwgaGVscClcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzdGRlcnIgb3Igc3Rkb3V0KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBpZiByZXR1cm5TdGRvdXRPclN0ZGVyclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGRvdXQgb3Igc3RkZXJyXG4gICAgICAgICAgICAgIGVsc2UgaWYgcmV0dXJuU3RkZXJyXG4gICAgICAgICAgICAgICAgc3RkZXJyXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzdGRvdXRcbiAgICAgICAgICApXG4gICAgICAgICAgLmNhdGNoKChlcnIpID0+XG4gICAgICAgICAgICBAZGVidWcoJ2Vycm9yJywgZXJyKVxuXG4gICAgICAgICAgICAjIENoZWNrIGlmIGVycm9yIGlzIEVOT0VOVCAoY29tbWFuZCBjb3VsZCBub3QgYmUgZm91bmQpXG4gICAgICAgICAgICBpZiBlcnIuY29kZSBpcyAnRU5PRU5UJyBvciBlcnIuZXJybm8gaXMgJ0VOT0VOVCdcbiAgICAgICAgICAgICAgdGhyb3cgQGNvbW1hbmROb3RGb3VuZEVycm9yKGV4ZU5hbWUsIGhlbHApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICMgY29udGludWUgYXMgbm9ybWFsIGVycm9yXG4gICAgICAgICAgICAgIHRocm93IGVyclxuICAgICAgICAgIClcbiAgICAgIClcblxuICBwYXRoOiAoY21kID0gQGNtZCkgLT5cbiAgICBjb25maWcgPSBAZ2V0Q29uZmlnKClcbiAgICBpZiBjb25maWcgYW5kIGNvbmZpZy5wYXRoXG4gICAgICBQcm9taXNlLnJlc29sdmUoY29uZmlnLnBhdGgpXG4gICAgZWxzZVxuICAgICAgZXhlTmFtZSA9IGNtZFxuICAgICAgQHdoaWNoKGV4ZU5hbWUpXG5cbiAgcmVzb2x2ZUFyZ3M6IChhcmdzKSAtPlxuICAgIGFyZ3MgPSBfLmZsYXR0ZW4oYXJncylcbiAgICBQcm9taXNlLmFsbChhcmdzKVxuXG4gIHJlbGF0aXZpemVQYXRoczogKGFyZ3MpIC0+XG4gICAgdG1wRGlyID0gb3MudG1wZGlyKClcbiAgICBuZXdBcmdzID0gYXJncy5tYXAoKGFyZykgLT5cbiAgICAgIGlzVG1wRmlsZSA9ICh0eXBlb2YgYXJnIGlzICdzdHJpbmcnIGFuZCBub3QgYXJnLmluY2x1ZGVzKCc6JykgYW5kIFxcXG4gICAgICAgIHBhdGguaXNBYnNvbHV0ZShhcmcpIGFuZCBwYXRoLmRpcm5hbWUoYXJnKS5zdGFydHNXaXRoKHRtcERpcikpXG4gICAgICBpZiBpc1RtcEZpbGVcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUodG1wRGlyLCBhcmcpXG4gICAgICByZXR1cm4gYXJnXG4gICAgKVxuICAgIG5ld0FyZ3NcblxuICAjIyNcbiAgU3Bhd25cbiAgIyMjXG4gIHNwYXduOiAoZXhlLCBhcmdzLCBvcHRpb25zLCBvblN0ZGluKSAtPlxuICAgICMgUmVtb3ZlIHVuZGVmaW5lZC9udWxsIHZhbHVlc1xuICAgIGFyZ3MgPSBfLndpdGhvdXQoYXJncywgdW5kZWZpbmVkKVxuICAgIGFyZ3MgPSBfLndpdGhvdXQoYXJncywgbnVsbClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgQGRlYnVnKCdzcGF3bicsIGV4ZSwgYXJncylcblxuICAgICAgY21kID0gc3Bhd24oZXhlLCBhcmdzLCBvcHRpb25zKVxuICAgICAgc3Rkb3V0ID0gXCJcIlxuICAgICAgc3RkZXJyID0gXCJcIlxuXG4gICAgICBjbWQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpIC0+XG4gICAgICAgIHN0ZG91dCArPSBkYXRhXG4gICAgICApXG4gICAgICBjbWQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpIC0+XG4gICAgICAgIHN0ZGVyciArPSBkYXRhXG4gICAgICApXG4gICAgICBjbWQub24oJ2Nsb3NlJywgKHJldHVybkNvZGUpID0+XG4gICAgICAgIEBkZWJ1Zygnc3Bhd24gZG9uZScsIHJldHVybkNvZGUsIHN0ZGVyciwgc3Rkb3V0KVxuICAgICAgICByZXNvbHZlKHtyZXR1cm5Db2RlLCBzdGRvdXQsIHN0ZGVycn0pXG4gICAgICApXG4gICAgICBjbWQub24oJ2Vycm9yJywgKGVycikgPT5cbiAgICAgICAgQGRlYnVnKCdlcnJvcicsIGVycilcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIClcblxuICAgICAgb25TdGRpbiBjbWQuc3RkaW4gaWYgb25TdGRpblxuICAgIClcblxuXG4gICMjI1xuICBBZGQgaGVscCB0byBlcnJvci5kZXNjcmlwdGlvblxuXG4gIE5vdGU6IGVycm9yLmRlc2NyaXB0aW9uIGlzIG5vdCBvZmZpY2lhbGx5IHVzZWQgaW4gSmF2YVNjcmlwdCxcbiAgaG93ZXZlciBpdCBpcyB1c2VkIGludGVybmFsbHkgZm9yIEF0b20gQmVhdXRpZnkgd2hlbiBkaXNwbGF5aW5nIGVycm9ycy5cbiAgIyMjXG4gIGNvbW1hbmROb3RGb3VuZEVycm9yOiAoZXhlLCBoZWxwKSAtPlxuICAgIGV4ZSA/PSBAbmFtZSBvciBAY21kXG4gICAgQGNvbnN0cnVjdG9yLmNvbW1hbmROb3RGb3VuZEVycm9yKGV4ZSwgaGVscClcblxuICBAY29tbWFuZE5vdEZvdW5kRXJyb3I6IChleGUsIGhlbHApIC0+XG4gICAgIyBDcmVhdGUgbmV3IGltcHJvdmVkIGVycm9yXG4gICAgIyBub3RpZnkgdXNlciB0aGF0IGl0IG1heSBub3QgYmVcbiAgICAjIGluc3RhbGxlZCBvciBpbiBwYXRoXG4gICAgbWVzc2FnZSA9IFwiQ291bGQgbm90IGZpbmQgJyN7ZXhlfScuIFxcXG4gICAgICAgICAgICBUaGUgcHJvZ3JhbSBtYXkgbm90IGJlIGluc3RhbGxlZC5cIlxuICAgIGVyID0gbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgZXIuY29kZSA9ICdDb21tYW5kTm90Rm91bmQnXG4gICAgZXIuZXJybm8gPSBlci5jb2RlXG4gICAgZXIuc3lzY2FsbCA9ICdiZWF1dGlmaWVyOjpydW4nXG4gICAgZXIuZmlsZSA9IGV4ZVxuICAgIGlmIGhlbHA/XG4gICAgICBpZiB0eXBlb2YgaGVscCBpcyBcIm9iamVjdFwiXG4gICAgICAgICMgQmFzaWMgbm90aWNlXG4gICAgICAgIGRvY3NMaW5rID0gXCJodHRwczovL2dpdGh1Yi5jb20vR2xhdmluMDAxL2F0b20tYmVhdXRpZnkjYmVhdXRpZmllcnNcIlxuICAgICAgICBoZWxwU3RyID0gXCJTZWUgI3tleGV9IGluc3RhbGxhdGlvbiBpbnN0cnVjdGlvbnMgYXQgI3tkb2NzTGlua30je2lmIGhlbHAubGluayB0aGVuICgnIG9yIGdvIHRvICcraGVscC5saW5rKSBlbHNlICcnfVxcblwiXG4gICAgICAgICMgIyBIZWxwIHRvIGNvbmZpZ3VyZSBBdG9tIEJlYXV0aWZ5IGZvciBwcm9ncmFtJ3MgcGF0aFxuICAgICAgICBoZWxwU3RyICs9IFwiWW91IGNhbiBjb25maWd1cmUgQXRvbSBCZWF1dGlmeSBcXFxuICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBhYnNvbHV0ZSBwYXRoIFxcXG4gICAgICAgICAgICAgICAgICAgIHRvICcje2hlbHAucHJvZ3JhbSBvciBleGV9JyBieSBzZXR0aW5nIFxcXG4gICAgICAgICAgICAgICAgICAgICcje2hlbHAucGF0aE9wdGlvbn0nIGluIFxcXG4gICAgICAgICAgICAgICAgICAgIHRoZSBBdG9tIEJlYXV0aWZ5IHBhY2thZ2Ugc2V0dGluZ3MuXFxuXCIgaWYgaGVscC5wYXRoT3B0aW9uXG4gICAgICAgIGhlbHBTdHIgKz0gXCJZb3VyIHByb2dyYW0gaXMgcHJvcGVybHkgaW5zdGFsbGVkIGlmIHJ1bm5pbmcgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnI3tpZiBAaXNXaW5kb3dzKCkgdGhlbiAnd2hlcmUuZXhlJyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgJ3doaWNoJ30gI3tleGV9JyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHlvdXIgI3tpZiBAaXNXaW5kb3dzKCkgdGhlbiAnQ01EIHByb21wdCcgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlICdUZXJtaW5hbCd9IFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJucyBhbiBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBleGVjdXRhYmxlLlxcblwiXG4gICAgICAgICMgIyBPcHRpb25hbCwgYWRkaXRpb25hbCBoZWxwXG4gICAgICAgIGhlbHBTdHIgKz0gaGVscC5hZGRpdGlvbmFsIGlmIGhlbHAuYWRkaXRpb25hbFxuICAgICAgICBlci5kZXNjcmlwdGlvbiA9IGhlbHBTdHJcbiAgICAgIGVsc2UgI2lmIHR5cGVvZiBoZWxwIGlzIFwic3RyaW5nXCJcbiAgICAgICAgZXIuZGVzY3JpcHRpb24gPSBoZWxwXG4gICAgcmV0dXJuIGVyXG5cblxuICBAX2VudkNhY2hlID0gbnVsbFxuICBzaGVsbEVudjogKCkgLT5cbiAgICBlbnYgPSBAY29uc3RydWN0b3Iuc2hlbGxFbnYoKVxuICAgIEBkZWJ1ZyhcImVudlwiLCBlbnYpXG4gICAgcmV0dXJuIGVudlxuICBAc2hlbGxFbnY6ICgpIC0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKHByb2Nlc3MuZW52KVxuXG4gICMjI1xuICBMaWtlIHRoZSB1bml4IHdoaWNoIHV0aWxpdHkuXG5cbiAgRmluZHMgdGhlIGZpcnN0IGluc3RhbmNlIG9mIGEgc3BlY2lmaWVkIGV4ZWN1dGFibGUgaW4gdGhlIFBBVEggZW52aXJvbm1lbnQgdmFyaWFibGUuXG4gIERvZXMgbm90IGNhY2hlIHRoZSByZXN1bHRzLFxuICBzbyBoYXNoIC1yIGlzIG5vdCBuZWVkZWQgd2hlbiB0aGUgUEFUSCBjaGFuZ2VzLlxuICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9ub2RlLXdoaWNoXG4gICMjI1xuICB3aGljaDogKGV4ZSwgb3B0aW9ucykgLT5cbiAgICBALmNvbnN0cnVjdG9yLndoaWNoKGV4ZSwgb3B0aW9ucylcbiAgQF93aGljaENhY2hlID0ge31cbiAgQHdoaWNoOiAoZXhlLCBvcHRpb25zID0ge30pIC0+XG4gICAgaWYgQF93aGljaENhY2hlW2V4ZV1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoQF93aGljaENhY2hlW2V4ZV0pXG4gICAgIyBHZXQgUEFUSCBhbmQgb3RoZXIgZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAgQHNoZWxsRW52KClcbiAgICAgIC50aGVuKChlbnYpID0+XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgICAgb3B0aW9ucy5wYXRoID89IGVudi5QQVRIXG4gICAgICAgICAgaWYgQGlzV2luZG93cygpXG4gICAgICAgICAgICAjIEVudmlyb25tZW50IHZhcmlhYmxlcyBhcmUgY2FzZS1pbnNlbnNpdGl2ZSBpbiB3aW5kb3dzXG4gICAgICAgICAgICAjIENoZWNrIGVudiBmb3IgYSBjYXNlLWluc2Vuc2l0aXZlICdwYXRoJyB2YXJpYWJsZVxuICAgICAgICAgICAgaWYgIW9wdGlvbnMucGF0aFxuICAgICAgICAgICAgICBmb3IgaSBvZiBlbnZcbiAgICAgICAgICAgICAgICBpZiBpLnRvTG93ZXJDYXNlKCkgaXMgXCJwYXRoXCJcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnMucGF0aCA9IGVudltpXVxuICAgICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgIyBUcmljayBub2RlLXdoaWNoIGludG8gaW5jbHVkaW5nIGZpbGVzXG4gICAgICAgICAgICAjIHdpdGggbm8gZXh0ZW5zaW9uIGFzIGV4ZWN1dGFibGVzLlxuICAgICAgICAgICAgIyBQdXQgZW1wdHkgZXh0ZW5zaW9uIGxhc3QgdG8gYWxsb3cgZm9yIG90aGVyIHJlYWwgZXh0ZW5zaW9ucyBmaXJzdFxuICAgICAgICAgICAgb3B0aW9ucy5wYXRoRXh0ID89IFwiI3twcm9jZXNzLmVudi5QQVRIRVhUID8gJy5FWEUnfTtcIlxuICAgICAgICAgIHdoaWNoKGV4ZSwgb3B0aW9ucywgKGVyciwgcGF0aCkgPT5cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGV4ZSkgaWYgZXJyXG4gICAgICAgICAgICBAX3doaWNoQ2FjaGVbZXhlXSA9IHBhdGhcbiAgICAgICAgICAgIHJlc29sdmUocGF0aClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcblxuICAjIyNcbiAgSWYgcGxhdGZvcm0gaXMgV2luZG93c1xuICAjIyNcbiAgaXNXaW5kb3dzOiAoKSAtPiBAY29uc3RydWN0b3IuaXNXaW5kb3dzKClcbiAgQGlzV2luZG93czogKCkgLT4gbmV3IFJlZ0V4cCgnXndpbicpLnRlc3QocHJvY2Vzcy5wbGF0Zm9ybSlcblxuY2xhc3MgSHlicmlkRXhlY3V0YWJsZSBleHRlbmRzIEV4ZWN1dGFibGVcblxuICBkb2NrZXJPcHRpb25zOiB7XG4gICAgaW1hZ2U6IHVuZGVmaW5lZFxuICAgIHdvcmtpbmdEaXI6IFwiL3dvcmtkaXJcIlxuICB9XG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgIHN1cGVyKG9wdGlvbnMpXG4gICAgQHZlcmJvc2UoXCJIeWJyaWRFeGVjdXRhYmxlIE9wdGlvbnNcIiwgb3B0aW9ucylcbiAgICBpZiBvcHRpb25zLmRvY2tlcj9cbiAgICAgIEBkb2NrZXJPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgQGRvY2tlck9wdGlvbnMsIG9wdGlvbnMuZG9ja2VyKVxuICAgICAgQGRvY2tlciA9IEBjb25zdHJ1Y3Rvci5kb2NrZXJFeGVjdXRhYmxlKClcblxuICBAZG9ja2VyOiB1bmRlZmluZWRcbiAgQGRvY2tlckV4ZWN1dGFibGU6ICgpIC0+XG4gICAgaWYgbm90IEBkb2NrZXI/XG4gICAgICBAZG9ja2VyID0gbmV3IEV4ZWN1dGFibGUoe1xuICAgICAgICBuYW1lOiBcIkRvY2tlclwiXG4gICAgICAgIGNtZDogXCJkb2NrZXJcIlxuICAgICAgICBob21lcGFnZTogXCJodHRwczovL3d3dy5kb2NrZXIuY29tL1wiXG4gICAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL3d3dy5kb2NrZXIuY29tL2dldC1kb2NrZXJcIlxuICAgICAgICB2ZXJzaW9uOiB7XG4gICAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0Lm1hdGNoKC92ZXJzaW9uIFswXSooWzEtOV1cXGQqKS5bMF0qKFswLTldXFxkKikuWzBdKihbMC05XVxcZCopLykuc2xpY2UoMSkuam9pbignLicpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgcmV0dXJuIEBkb2NrZXJcblxuICBpbnN0YWxsZWRXaXRoRG9ja2VyOiBmYWxzZVxuICBpbml0OiAoKSAtPlxuICAgIHN1cGVyKClcbiAgICAgIC50aGVuKCgpID0+XG4gICAgICAgIHJldHVybiBAXG4gICAgICApXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PlxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpIGlmIG5vdCBAZG9ja2VyP1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGVycm9yKVxuICAgICAgKVxuICAgICAgLnRoZW4oKGVycm9yT3JUaGlzKSA9PlxuICAgICAgICBzaG91bGRUcnlXaXRoRG9ja2VyID0gbm90IEBpc0luc3RhbGxlZCBhbmQgQGRvY2tlcj9cbiAgICAgICAgQHZlcmJvc2UoXCJFeGVjdXRhYmxlIHNob3VsZFRyeVdpdGhEb2NrZXJcIiwgc2hvdWxkVHJ5V2l0aERvY2tlciwgQGlzSW5zdGFsbGVkLCBAZG9ja2VyPylcbiAgICAgICAgaWYgc2hvdWxkVHJ5V2l0aERvY2tlclxuICAgICAgICAgIHJldHVybiBAaW5pdERvY2tlcigpLmNhdGNoKCgpIC0+IFByb21pc2UucmVqZWN0KGVycm9yT3JUaGlzKSlcbiAgICAgICAgcmV0dXJuIEBcbiAgICAgIClcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+XG4gICAgICAgIGlmIG5vdCBALnJlcXVpcmVkXG4gICAgICAgICAgQHZlcmJvc2UoXCJOb3QgcmVxdWlyZWRcIilcbiAgICAgICAgICBAXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChlcnJvcilcbiAgICAgIClcblxuICBpbml0RG9ja2VyOiAoKSAtPlxuICAgIEBkb2NrZXIuaW5pdCgpXG4gICAgICAudGhlbig9PiBAcnVuSW1hZ2UoQHZlcnNpb25BcmdzLCBAdmVyc2lvblJ1bk9wdGlvbnMpKVxuICAgICAgLnRoZW4oKHRleHQpID0+IEBzYXZlVmVyc2lvbih0ZXh0KSlcbiAgICAgIC50aGVuKCgpID0+IEBpbnN0YWxsZWRXaXRoRG9ja2VyID0gdHJ1ZSlcbiAgICAgIC50aGVuKD0+IEApXG4gICAgICAuY2F0Y2goKGRvY2tlckVycm9yKSA9PlxuICAgICAgICBAZGVidWcoZG9ja2VyRXJyb3IpXG4gICAgICAgIFByb21pc2UucmVqZWN0KGRvY2tlckVycm9yKVxuICAgICAgKVxuXG4gIHJ1bjogKGFyZ3MsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBAdmVyYm9zZShcIlJ1bm5pbmcgSHlicmlkRXhlY3V0YWJsZVwiKVxuICAgIEB2ZXJib3NlKFwiaW5zdGFsbGVkV2l0aERvY2tlclwiLCBAaW5zdGFsbGVkV2l0aERvY2tlcilcbiAgICBAdmVyYm9zZShcImRvY2tlclwiLCBAZG9ja2VyKVxuICAgIEB2ZXJib3NlKFwiZG9ja2VyLmlzSW5zdGFsbGVkXCIsIEBkb2NrZXIgYW5kIEBkb2NrZXIuaXNJbnN0YWxsZWQpXG4gICAgaWYgQGluc3RhbGxlZFdpdGhEb2NrZXIgYW5kIEBkb2NrZXIgYW5kIEBkb2NrZXIuaXNJbnN0YWxsZWRcbiAgICAgIHJldHVybiBAcnVuSW1hZ2UoYXJncywgb3B0aW9ucylcbiAgICBzdXBlcihhcmdzLCBvcHRpb25zKVxuXG4gIHJ1bkltYWdlOiAoYXJncywgb3B0aW9ucykgLT5cbiAgICBAZGVidWcoXCJSdW4gRG9ja2VyIGV4ZWN1dGFibGU6IFwiLCBhcmdzLCBvcHRpb25zKVxuICAgIHRoaXMucmVzb2x2ZUFyZ3MoYXJncylcbiAgICAgIC50aGVuKChhcmdzKSA9PlxuICAgICAgICB7IGN3ZCB9ID0gb3B0aW9uc1xuICAgICAgICB0bXBEaXIgPSBvcy50bXBkaXIoKVxuICAgICAgICBwd2QgPSBmcy5yZWFscGF0aFN5bmMoY3dkIG9yIHRtcERpcilcbiAgICAgICAgaW1hZ2UgPSBAZG9ja2VyT3B0aW9ucy5pbWFnZVxuICAgICAgICB3b3JraW5nRGlyID0gQGRvY2tlck9wdGlvbnMud29ya2luZ0RpclxuXG4gICAgICAgIHJvb3RQYXRoID0gJy9tb3VudGVkUm9vdCdcbiAgICAgICAgbmV3QXJncyA9IGFyZ3MubWFwKChhcmcpIC0+XG4gICAgICAgICAgaWYgKHR5cGVvZiBhcmcgaXMgJ3N0cmluZycgYW5kIG5vdCBhcmcuaW5jbHVkZXMoJzonKSBcXFxuICAgICAgICAgICAgYW5kIHBhdGguaXNBYnNvbHV0ZShhcmcpIGFuZCBub3QgcGF0aC5kaXJuYW1lKGFyZykuc3RhcnRzV2l0aCh0bXBEaXIpKSBcXFxuICAgICAgICAgICAgdGhlbiBwYXRoLmpvaW4ocm9vdFBhdGgsIGFyZykgZWxzZSBhcmdcbiAgICAgICAgKVxuXG4gICAgICAgIEBkb2NrZXIucnVuKFtcbiAgICAgICAgICAgIFwicnVuXCIsXG4gICAgICAgICAgICBcIi0tdm9sdW1lXCIsIFwiI3twd2R9OiN7d29ya2luZ0Rpcn1cIixcbiAgICAgICAgICAgIFwiLS12b2x1bWVcIiwgXCIje3BhdGgucmVzb2x2ZSgnLycpfToje3Jvb3RQYXRofVwiLFxuICAgICAgICAgICAgXCItLXdvcmtkaXJcIiwgd29ya2luZ0RpcixcbiAgICAgICAgICAgIGltYWdlLFxuICAgICAgICAgICAgbmV3QXJnc1xuICAgICAgICAgIF0sXG4gICAgICAgICAgT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywgeyBjbWQ6IHVuZGVmaW5lZCB9KVxuICAgICAgICApXG4gICAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gSHlicmlkRXhlY3V0YWJsZVxuIl19
