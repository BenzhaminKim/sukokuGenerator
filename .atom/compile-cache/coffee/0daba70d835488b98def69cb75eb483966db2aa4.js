(function() {
  var AnnotationManager, AutocompletionManager, GotoManager, StatusInProgress, TooltipManager, config, parser, plugins, proxy;

  GotoManager = require("./goto/goto-manager.coffee");

  TooltipManager = require("./tooltip/tooltip-manager.coffee");

  AnnotationManager = require("./annotation/annotation-manager.coffee");

  AutocompletionManager = require("./autocompletion/autocompletion-manager.coffee");

  StatusInProgress = require("./services/status-in-progress.coffee");

  config = require('./config.coffee');

  proxy = require('./services/php-proxy.coffee');

  parser = require('./services/php-file-parser.coffee');

  plugins = require('./services/plugin-manager.coffee');

  module.exports = {
    config: {
      binComposer: {
        title: 'Command to use composer',
        description: 'This plugin depends on composer in order to work. Specify the path to your composer bin (e.g : bin/composer, composer.phar, composer)',
        type: 'string',
        "default": '/usr/local/bin/composer',
        order: 1
      },
      binPhp: {
        title: 'Command php',
        description: 'This plugin use php CLI in order to work. Please specify your php command ("php" on UNIX systems)',
        type: 'string',
        "default": 'php',
        order: 2
      },
      autoloadPaths: {
        title: 'Autoloader file',
        description: 'Relative path to the files of autoload.php from composer (or an other one). You can specify multiple paths (comma separated) if you have different paths for some projects.',
        type: 'array',
        "default": ['vendor/autoload.php', 'autoload.php'],
        order: 3
      },
      gotoKey: {
        title: 'Goto key',
        description: 'Key to use with "click" to use goto. By default "alt" (because on macOS, ctrl + click is like right click)',
        type: 'string',
        "default": 'alt',
        "enum": ['alt', 'ctrl', 'cmd'],
        order: 4
      },
      classMapFiles: {
        title: 'Classmap files',
        description: 'Relative path to the files that contains a classmap (array with "className" => "fileName"). By default on composer it\'s vendor/composer/autoload_classmap.php',
        type: 'array',
        "default": ['vendor/composer/autoload_classmap.php', 'autoload/ezp_kernel.php'],
        order: 5
      },
      insertNewlinesForUseStatements: {
        title: 'Insert newlines for use statements.',
        description: 'When enabled, the plugin will add additional newlines before or after an automatically added use statement when it can\'t add them nicely to an existing group. This results in more cleanly separated use statements but will create additional vertical whitespace.',
        type: 'boolean',
        "default": false,
        order: 6
      },
      verboseErrors: {
        title: 'Errors on file saving showed',
        description: 'When enabled, you\'ll have a notification once an error occured on autocomplete. Otherwise, the message will just be logged in developer console',
        type: 'boolean',
        "default": false,
        order: 7
      }
    },
    activate: function() {
      config.testConfig();
      config.init();
      this.autocompletionManager = new AutocompletionManager();
      this.autocompletionManager.init();
      this.gotoManager = new GotoManager();
      this.gotoManager.init();
      this.tooltipManager = new TooltipManager();
      this.tooltipManager.init();
      this.annotationManager = new AnnotationManager();
      this.annotationManager.init();
      return proxy.init();
    },
    deactivate: function() {
      this.gotoManager.deactivate();
      this.tooltipManager.deactivate();
      this.annotationManager.deactivate();
      this.autocompletionManager.deactivate();
      return proxy.deactivate();
    },
    consumeStatusBar: function(statusBar) {
      config.statusInProgress.initialize(statusBar);
      config.statusInProgress.attach();
      config.statusErrorAutocomplete.initialize(statusBar);
      return config.statusErrorAutocomplete.attach();
    },
    consumePlugin: function(plugin) {
      return plugins.plugins.push(plugin);
    },
    provideAutocompleteTools: function() {
      this.services = {
        proxy: proxy,
        parser: parser
      };
      return this.services;
    },
    getProvider: function() {
      return this.autocompletionManager.getProviders();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F0b20tYXV0b2NvbXBsZXRlLXBocC9saWIvcGVla21vLXBocC1hdG9tLWF1dG9jb21wbGV0ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsNEJBQVI7O0VBQ2QsY0FBQSxHQUFpQixPQUFBLENBQVEsa0NBQVI7O0VBQ2pCLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3Q0FBUjs7RUFDcEIscUJBQUEsR0FBd0IsT0FBQSxDQUFRLGdEQUFSOztFQUN4QixnQkFBQSxHQUFtQixPQUFBLENBQVEsc0NBQVI7O0VBQ25CLE1BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVI7O0VBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSw2QkFBUjs7RUFDUixNQUFBLEdBQVMsT0FBQSxDQUFRLG1DQUFSOztFQUNULE9BQUEsR0FBVSxPQUFBLENBQVEsa0NBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDSTtJQUFBLE1BQUEsRUFDSTtNQUFBLFdBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyx5QkFBUDtRQUNBLFdBQUEsRUFBYSx1SUFEYjtRQUdBLElBQUEsRUFBTSxRQUhOO1FBSUEsQ0FBQSxPQUFBLENBQUEsRUFBUyx5QkFKVDtRQUtBLEtBQUEsRUFBTyxDQUxQO09BREo7TUFRQSxNQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sYUFBUDtRQUNBLFdBQUEsRUFBYSxtR0FEYjtRQUdBLElBQUEsRUFBTSxRQUhOO1FBSUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUpUO1FBS0EsS0FBQSxFQUFPLENBTFA7T0FUSjtNQWdCQSxhQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8saUJBQVA7UUFDQSxXQUFBLEVBQWEsNktBRGI7UUFHQSxJQUFBLEVBQU0sT0FITjtRQUlBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FB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dXJjZXNDb250ZW50IjpbIkdvdG9NYW5hZ2VyID0gcmVxdWlyZSBcIi4vZ290by9nb3RvLW1hbmFnZXIuY29mZmVlXCJcblRvb2x0aXBNYW5hZ2VyID0gcmVxdWlyZSBcIi4vdG9vbHRpcC90b29sdGlwLW1hbmFnZXIuY29mZmVlXCJcbkFubm90YXRpb25NYW5hZ2VyID0gcmVxdWlyZSBcIi4vYW5ub3RhdGlvbi9hbm5vdGF0aW9uLW1hbmFnZXIuY29mZmVlXCJcbkF1dG9jb21wbGV0aW9uTWFuYWdlciA9IHJlcXVpcmUgXCIuL2F1dG9jb21wbGV0aW9uL2F1dG9jb21wbGV0aW9uLW1hbmFnZXIuY29mZmVlXCJcblN0YXR1c0luUHJvZ3Jlc3MgPSByZXF1aXJlIFwiLi9zZXJ2aWNlcy9zdGF0dXMtaW4tcHJvZ3Jlc3MuY29mZmVlXCJcbmNvbmZpZyA9IHJlcXVpcmUgJy4vY29uZmlnLmNvZmZlZSdcbnByb3h5ID0gcmVxdWlyZSAnLi9zZXJ2aWNlcy9waHAtcHJveHkuY29mZmVlJ1xucGFyc2VyID0gcmVxdWlyZSAnLi9zZXJ2aWNlcy9waHAtZmlsZS1wYXJzZXIuY29mZmVlJ1xucGx1Z2lucyA9IHJlcXVpcmUgJy4vc2VydmljZXMvcGx1Z2luLW1hbmFnZXIuY29mZmVlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgY29uZmlnOlxuICAgICAgICBiaW5Db21wb3NlcjpcbiAgICAgICAgICAgIHRpdGxlOiAnQ29tbWFuZCB0byB1c2UgY29tcG9zZXInXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgcGx1Z2luIGRlcGVuZHMgb24gY29tcG9zZXIgaW4gb3JkZXIgdG8gd29yay4gU3BlY2lmeSB0aGUgcGF0aFxuICAgICAgICAgICAgIHRvIHlvdXIgY29tcG9zZXIgYmluIChlLmcgOiBiaW4vY29tcG9zZXIsIGNvbXBvc2VyLnBoYXIsIGNvbXBvc2VyKSdcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBkZWZhdWx0OiAnL3Vzci9sb2NhbC9iaW4vY29tcG9zZXInXG4gICAgICAgICAgICBvcmRlcjogMVxuXG4gICAgICAgIGJpblBocDpcbiAgICAgICAgICAgIHRpdGxlOiAnQ29tbWFuZCBwaHAnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgcGx1Z2luIHVzZSBwaHAgQ0xJIGluIG9yZGVyIHRvIHdvcmsuIFBsZWFzZSBzcGVjaWZ5IHlvdXIgcGhwXG4gICAgICAgICAgICAgY29tbWFuZCAoXCJwaHBcIiBvbiBVTklYIHN5c3RlbXMpJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdwaHAnXG4gICAgICAgICAgICBvcmRlcjogMlxuXG4gICAgICAgIGF1dG9sb2FkUGF0aHM6XG4gICAgICAgICAgICB0aXRsZTogJ0F1dG9sb2FkZXIgZmlsZSdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUmVsYXRpdmUgcGF0aCB0byB0aGUgZmlsZXMgb2YgYXV0b2xvYWQucGhwIGZyb20gY29tcG9zZXIgKG9yIGFuIG90aGVyIG9uZSkuIFlvdSBjYW4gc3BlY2lmeSBtdWx0aXBsZVxuICAgICAgICAgICAgIHBhdGhzIChjb21tYSBzZXBhcmF0ZWQpIGlmIHlvdSBoYXZlIGRpZmZlcmVudCBwYXRocyBmb3Igc29tZSBwcm9qZWN0cy4nXG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknXG4gICAgICAgICAgICBkZWZhdWx0OiBbJ3ZlbmRvci9hdXRvbG9hZC5waHAnLCAnYXV0b2xvYWQucGhwJ11cbiAgICAgICAgICAgIG9yZGVyOiAzXG5cbiAgICAgICAgZ290b0tleTpcbiAgICAgICAgICAgIHRpdGxlOiAnR290byBrZXknXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0tleSB0byB1c2Ugd2l0aCBcImNsaWNrXCIgdG8gdXNlIGdvdG8uIEJ5IGRlZmF1bHQgXCJhbHRcIiAoYmVjYXVzZSBvbiBtYWNPUywgY3RybCArIGNsaWNrIGlzIGxpa2UgcmlnaHQgY2xpY2spJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdhbHQnXG4gICAgICAgICAgICBlbnVtOiBbJ2FsdCcsICdjdHJsJywgJ2NtZCddXG4gICAgICAgICAgICBvcmRlcjogNFxuXG4gICAgICAgIGNsYXNzTWFwRmlsZXM6XG4gICAgICAgICAgICB0aXRsZTogJ0NsYXNzbWFwIGZpbGVzJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdSZWxhdGl2ZSBwYXRoIHRvIHRoZSBmaWxlcyB0aGF0IGNvbnRhaW5zIGEgY2xhc3NtYXAgKGFycmF5IHdpdGggXCJjbGFzc05hbWVcIiA9PiBcImZpbGVOYW1lXCIpLiBCeSBkZWZhdWx0XG4gICAgICAgICAgICAgb24gY29tcG9zZXIgaXRcXCdzIHZlbmRvci9jb21wb3Nlci9hdXRvbG9hZF9jbGFzc21hcC5waHAnXG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknXG4gICAgICAgICAgICBkZWZhdWx0OiBbJ3ZlbmRvci9jb21wb3Nlci9hdXRvbG9hZF9jbGFzc21hcC5waHAnLCAnYXV0b2xvYWQvZXpwX2tlcm5lbC5waHAnXVxuICAgICAgICAgICAgb3JkZXI6IDVcblxuICAgICAgICBpbnNlcnROZXdsaW5lc0ZvclVzZVN0YXRlbWVudHM6XG4gICAgICAgICAgICB0aXRsZTogJ0luc2VydCBuZXdsaW5lcyBmb3IgdXNlIHN0YXRlbWVudHMuJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdXaGVuIGVuYWJsZWQsIHRoZSBwbHVnaW4gd2lsbCBhZGQgYWRkaXRpb25hbCBuZXdsaW5lcyBiZWZvcmUgb3IgYWZ0ZXIgYW4gYXV0b21hdGljYWxseSBhZGRlZFxuICAgICAgICAgICAgICAgIHVzZSBzdGF0ZW1lbnQgd2hlbiBpdCBjYW5cXCd0IGFkZCB0aGVtIG5pY2VseSB0byBhbiBleGlzdGluZyBncm91cC4gVGhpcyByZXN1bHRzIGluIG1vcmUgY2xlYW5seVxuICAgICAgICAgICAgICAgIHNlcGFyYXRlZCB1c2Ugc3RhdGVtZW50cyBidXQgd2lsbCBjcmVhdGUgYWRkaXRpb25hbCB2ZXJ0aWNhbCB3aGl0ZXNwYWNlLidcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiA2XG5cbiAgICAgICAgdmVyYm9zZUVycm9yczpcbiAgICAgICAgICAgIHRpdGxlOiAnRXJyb3JzIG9uIGZpbGUgc2F2aW5nIHNob3dlZCdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBlbmFibGVkLCB5b3VcXCdsbCBoYXZlIGEgbm90aWZpY2F0aW9uIG9uY2UgYW4gZXJyb3Igb2NjdXJlZCBvbiBhdXRvY29tcGxldGUuIE90aGVyd2lzZSwgdGhlIG1lc3NhZ2Ugd2lsbCBqdXN0IGJlIGxvZ2dlZCBpbiBkZXZlbG9wZXIgY29uc29sZSdcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiA3XG5cbiAgICBhY3RpdmF0ZTogLT5cbiAgICAgICAgY29uZmlnLnRlc3RDb25maWcoKVxuICAgICAgICBjb25maWcuaW5pdCgpXG5cbiAgICAgICAgQGF1dG9jb21wbGV0aW9uTWFuYWdlciA9IG5ldyBBdXRvY29tcGxldGlvbk1hbmFnZXIoKVxuICAgICAgICBAYXV0b2NvbXBsZXRpb25NYW5hZ2VyLmluaXQoKVxuXG4gICAgICAgIEBnb3RvTWFuYWdlciA9IG5ldyBHb3RvTWFuYWdlcigpXG4gICAgICAgIEBnb3RvTWFuYWdlci5pbml0KClcblxuICAgICAgICBAdG9vbHRpcE1hbmFnZXIgPSBuZXcgVG9vbHRpcE1hbmFnZXIoKVxuICAgICAgICBAdG9vbHRpcE1hbmFnZXIuaW5pdCgpXG5cbiAgICAgICAgQGFubm90YXRpb25NYW5hZ2VyID0gbmV3IEFubm90YXRpb25NYW5hZ2VyKClcbiAgICAgICAgQGFubm90YXRpb25NYW5hZ2VyLmluaXQoKVxuXG4gICAgICAgIHByb3h5LmluaXQoKVxuXG4gICAgZGVhY3RpdmF0ZTogLT5cbiAgICAgICAgQGdvdG9NYW5hZ2VyLmRlYWN0aXZhdGUoKVxuICAgICAgICBAdG9vbHRpcE1hbmFnZXIuZGVhY3RpdmF0ZSgpXG4gICAgICAgIEBhbm5vdGF0aW9uTWFuYWdlci5kZWFjdGl2YXRlKClcbiAgICAgICAgQGF1dG9jb21wbGV0aW9uTWFuYWdlci5kZWFjdGl2YXRlKClcbiAgICAgICAgcHJveHkuZGVhY3RpdmF0ZSgpXG5cbiAgICBjb25zdW1lU3RhdHVzQmFyOiAoc3RhdHVzQmFyKSAtPlxuICAgICAgICBjb25maWcuc3RhdHVzSW5Qcm9ncmVzcy5pbml0aWFsaXplKHN0YXR1c0JhcilcbiAgICAgICAgY29uZmlnLnN0YXR1c0luUHJvZ3Jlc3MuYXR0YWNoKClcblxuICAgICAgICBjb25maWcuc3RhdHVzRXJyb3JBdXRvY29tcGxldGUuaW5pdGlhbGl6ZShzdGF0dXNCYXIpXG4gICAgICAgIGNvbmZpZy5zdGF0dXNFcnJvckF1dG9jb21wbGV0ZS5hdHRhY2goKVxuXG4gICAgY29uc3VtZVBsdWdpbjogKHBsdWdpbikgLT5cbiAgICAgICAgcGx1Z2lucy5wbHVnaW5zLnB1c2gocGx1Z2luKVxuXG4gICAgcHJvdmlkZUF1dG9jb21wbGV0ZVRvb2xzOiAtPlxuICAgICAgICBAc2VydmljZXMgPVxuICAgICAgICAgICAgcHJveHk6IHByb3h5XG4gICAgICAgICAgICBwYXJzZXI6IHBhcnNlclxuXG4gICAgICAgIHJldHVybiBAc2VydmljZXNcblxuICAgIGdldFByb3ZpZGVyOiAtPlxuICAgICAgICByZXR1cm4gQGF1dG9jb21wbGV0aW9uTWFuYWdlci5nZXRQcm92aWRlcnMoKVxuIl19
