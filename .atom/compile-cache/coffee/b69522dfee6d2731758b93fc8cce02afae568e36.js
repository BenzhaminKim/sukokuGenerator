(function() {
  module.exports = {
    browser: {
      title: 'Browser',
      type: 'boolean',
      "default": true,
      win32: {
        IE: {
          cmd: 'start iexplore '
        },
        Edge: {
          cmd: 'start microsoft-edge:'
        },
        Chrome: {
          cmd: 'start chrome '
        },
        ChromePortable: {
          cmd: 'start ' + atom.config.get("open-in-browsers.ChromePortable.path") + ' '
        },
        Firefox: {
          cmd: 'start firefox '
        },
        FirefoxPortable: {
          cmd: 'start ' + atom.config.get('open-in-browsers.FirefoxPortable.path') + ' '
        },
        Opera: {
          cmd: 'start opera '
        },
        Safari: {
          cmd: 'start safari '
        },
        SafariPortable: {
          cmd: 'start ' + atom.config.get('open-in-browsers.SafariPortable.path') + ' '
        }
      },
      win64: {
        Edge: {
          cmd: 'start microsoft-edge:'
        },
        IE: {
          cmd: 'start iexplore '
        },
        Chrome: {
          cmd: 'start chrome '
        },
        ChromePortable: {
          cmd: 'start ' + atom.config.get('open-in-browsers.ChromePortablePath') + ' '
        },
        Firefox: {
          cmd: 'start firefox '
        },
        FirefoxPortable: {
          cmd: 'start ' + atom.config.get('open-in-browsers.FirefoxPortablePath') + ' '
        },
        Opera: {
          cmd: 'start opera '
        },
        Safari: {
          cmd: 'start safari '
        },
        SafariPortable: {
          cmd: 'start ' + atom.config.get('open-in-browsers.SafariPortablePath') + ' '
        }
      },
      darwin: {
        Chrome: {
          cmd: 'open -a "Google Chrome" '
        },
        Firefox: {
          cmd: 'open -a "Firefox" '
        },
        Safari: {
          cmd: 'open -a "Safari" '
        },
        Opera: {
          cmd: 'open -a "Opera" '
        },
        ChromePortable: {
          cmd: 'open -a ' + atom.config.get('open-in-browsers.ChromePortablePath') + ' '
        },
        FirefoxPortable: {
          cmd: 'open -a ' + atom.config.get('open-in-browsers.FirefoxPortable.path') + ' '
        },
        SafariPortable: {
          cmd: 'open -a ' + atom.config.get('open-in-browsers.SafariPortable.path') + ' '
        }
      },
      linux: {
        Chrome: {
          cmd: 'google-chrome '
        },
        Firefox: {
          cmd: 'firefox '
        },
        Safari: {
          cmd: 'safari '
        },
        Opera: {
          cmd: 'opera '
        },
        ChromePortable: {
          cmd: 'open -a ' + atom.config.get('open-in-browsers.ChromePortablePath') + ' '
        },
        FirefoxPortable: {
          cmd: 'open -a ' + atom.config.get('open-in-browsers.FirefoxPortable.path') + ' '
        },
        SafariPortable: {
          cmd: 'open -a ' + atom.config.get('open-in-browsers.SafariPortable.path') + ' '
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL29wZW4taW4tYnJvd3NlcnMvbGliL2NvbmZpZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsT0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLFNBQVA7TUFDQSxJQUFBLEVBQU0sU0FETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFGVDtNQUlBLEtBQUEsRUFDRTtRQUFBLEVBQUEsRUFDRTtVQUFBLEdBQUEsRUFBSyxpQkFBTDtTQURGO1FBRUEsSUFBQSxFQUNFO1VBQUEsR0FBQSxFQUFLLHVCQUFMO1NBSEY7UUFJQSxNQUFBLEVBQ0U7VUFBQSxHQUFBLEVBQU0sZUFBTjtTQUxGO1FBTUEsY0FBQSxFQUNFO1VBQUEsR0FBQSxFQUFNLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBQVgsR0FBcUUsR0FBM0U7U0FQRjtRQVFBLE9BQUEsRUFDRTtVQUFBLEdBQUEsRUFBTSxnQkFBTjtTQVRGO1FBVUEsZUFBQSxFQUNFO1VBQUEsR0FBQSxFQUFNLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLENBQVgsR0FBc0UsR0FBNUU7U0FYRjtRQVlBLEtBQUEsRUFDRTtVQUFBLEdBQUEsRUFBSyxjQUFMO1NBYkY7UUFjQSxNQUFBLEVBQ0U7VUFBQSxHQUFBLEVBQUssZUFBTDtTQWZGO1FBZ0JBLGNBQUEsRUFDRTtVQUFBLEdBQUEsRUFBTSxRQUFBLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQUFYLEdBQXFFLEdBQTNFO1NBakJGO09BTEY7TUF3QkEsS0FBQSxFQUNFO1FBQUEsSUFBQSxFQUNFO1VBQUEsR0FBQSxFQUFLLHVCQUFMO1NBREY7UUFFQSxFQUFBLEVBQ0U7VUFBQSxHQUFBLEVBQUssaUJBQUw7U0FIRjtRQUlBLE1BQUEsRUFDRTtVQUFBLEdBQUEsRUFBTSxlQUFOO1NBTEY7UUFNQSxjQUFBLEVBQ0U7VUFBQSxHQUFBLEVBQU0sUUFBQSxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQ0FBaEIsQ0FBWCxHQUFvRSxHQUExRTtTQVBGO1FBUUEsT0FBQSxFQUNFO1VBQUEsR0FBQSxFQUFNLGdCQUFOO1NBVEY7UUFVQSxlQUFBLEVBQ0U7VUFBQSxHQUFBLEVBQU0sUUFBQSxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsQ0FBWCxHQUFxRSxHQUEzRTtTQVhGO1FBWUEsS0FBQSxFQUNFO1VBQUEsR0FBQSxFQUFLLGNBQUw7U0FiRjtRQWNBLE1BQUEsRUFDRTtVQUFBLEdBQUEsRUFBSyxlQUFMO1NBZkY7UUFnQkEsY0FBQSxFQUNFO1VBQUEsR0FBQSxFQUFNLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUNBQWhCLENBQVgsR0FBb0UsR0FBMUU7U0FqQkY7T0F6QkY7TUE0Q0EsTUFBQSxFQUNFO1FBQUEsTUFBQSxFQUNFO1VBQUEsR0FBQSxFQUFLLDBCQUFMO1NBREY7UUFFQSxPQUFBLEVBQ0U7VUFBQSxHQUFBLEVBQUssb0JBQUw7U0FIRjtRQUlBLE1BQUEsRUFDRTtVQUFBLEdBQUEsRUFBSyxtQkFBTDtTQUxGO1FBTUEsS0FBQSxFQUNFO1VBQUEsR0FBQSxFQUFLLGtCQUFMO1NBUEY7UUFRQSxjQUFBLEVBQ0U7VUFBQSxHQUFBLEVBQU0sVUFBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQ0FBaEIsQ0FBYixHQUFzRSxHQUE1RTtTQVRGO1FBVUEsZUFBQSxFQUNFO1VBQUEsR0FBQSxFQUFNLFVBQUEsR0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLENBQWIsR0FBd0UsR0FBOUU7U0FYRjtRQVlBLGNBQUEsRUFDRTtVQUFBLEdBQUEsRUFBTSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQUFiLEdBQXVFLEdBQTdFO1NBYkY7T0E3Q0Y7TUE2REEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUNFO1VBQUEsR0FBQSxFQUFLLGdCQUFMO1NBREY7UUFFQSxPQUFBLEVBQ0U7VUFBQSxHQUFBLEVBQUssVUFBTDtTQUhGO1FBSUEsTUFBQSxFQUNFO1VBQUEsR0FBQSxFQUFLLFNBQUw7U0FMRjtRQU1BLEtBQUEsRUFDRTtVQUFBLEdBQUEsRUFBSyxRQUFMO1NBUEY7UUFRQSxjQUFBLEVBQ0U7VUFBQSxHQUFBLEVBQU0sVUFBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQ0FBaEIsQ0FBYixHQUFzRSxHQUE1RTtTQVRGO1FBVUEsZUFBQSxFQUNFO1VBQUEsR0FBQSxFQUFNLFVBQUEsR0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLENBQWIsR0FBd0UsR0FBOUU7U0FYRjtRQVlBLGNBQUEsRUFDRTtVQUFBLEdBQUEsRUFBTSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQUFiLEdBQXVFLEdBQTdFO1NBYkY7T0E5REY7S0FERjs7QUFESiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgICBicm93c2VyOlxuICAgICAgdGl0bGU6ICdCcm93c2VyJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG5cbiAgICAgIHdpbjMyOlxuICAgICAgICBJRTpcbiAgICAgICAgICBjbWQ6ICdzdGFydCBpZXhwbG9yZSAnXG4gICAgICAgIEVkZ2U6XG4gICAgICAgICAgY21kOiAnc3RhcnQgbWljcm9zb2Z0LWVkZ2U6J1xuICAgICAgICBDaHJvbWU6XG4gICAgICAgICAgY21kOiAgJ3N0YXJ0IGNocm9tZSAnXG4gICAgICAgIENocm9tZVBvcnRhYmxlOlxuICAgICAgICAgIGNtZDogICdzdGFydCAnICsgYXRvbS5jb25maWcuZ2V0KFwib3Blbi1pbi1icm93c2Vycy5DaHJvbWVQb3J0YWJsZS5wYXRoXCIpICsgJyAnXG4gICAgICAgIEZpcmVmb3g6XG4gICAgICAgICAgY21kOiAgJ3N0YXJ0IGZpcmVmb3ggJ1xuICAgICAgICBGaXJlZm94UG9ydGFibGU6XG4gICAgICAgICAgY21kOiAgJ3N0YXJ0ICcgKyBhdG9tLmNvbmZpZy5nZXQoJ29wZW4taW4tYnJvd3NlcnMuRmlyZWZveFBvcnRhYmxlLnBhdGgnKSArICcgJ1xuICAgICAgICBPcGVyYTpcbiAgICAgICAgICBjbWQ6ICdzdGFydCBvcGVyYSAnXG4gICAgICAgIFNhZmFyaTpcbiAgICAgICAgICBjbWQ6ICdzdGFydCBzYWZhcmkgJ1xuICAgICAgICBTYWZhcmlQb3J0YWJsZTpcbiAgICAgICAgICBjbWQ6ICAnc3RhcnQgJyArIGF0b20uY29uZmlnLmdldCgnb3Blbi1pbi1icm93c2Vycy5TYWZhcmlQb3J0YWJsZS5wYXRoJykgKyAnICdcblxuICAgICAgd2luNjQ6XG4gICAgICAgIEVkZ2U6XG4gICAgICAgICAgY21kOiAnc3RhcnQgbWljcm9zb2Z0LWVkZ2U6J1xuICAgICAgICBJRTpcbiAgICAgICAgICBjbWQ6ICdzdGFydCBpZXhwbG9yZSAnXG4gICAgICAgIENocm9tZTpcbiAgICAgICAgICBjbWQ6ICAnc3RhcnQgY2hyb21lICdcbiAgICAgICAgQ2hyb21lUG9ydGFibGU6XG4gICAgICAgICAgY21kOiAgJ3N0YXJ0ICcgKyBhdG9tLmNvbmZpZy5nZXQoJ29wZW4taW4tYnJvd3NlcnMuQ2hyb21lUG9ydGFibGVQYXRoJykgKyAnICdcbiAgICAgICAgRmlyZWZveDpcbiAgICAgICAgICBjbWQ6ICAnc3RhcnQgZmlyZWZveCAnXG4gICAgICAgIEZpcmVmb3hQb3J0YWJsZTpcbiAgICAgICAgICBjbWQ6ICAnc3RhcnQgJyArIGF0b20uY29uZmlnLmdldCgnb3Blbi1pbi1icm93c2Vycy5GaXJlZm94UG9ydGFibGVQYXRoJykgKyAnICdcbiAgICAgICAgT3BlcmE6XG4gICAgICAgICAgY21kOiAnc3RhcnQgb3BlcmEgJ1xuICAgICAgICBTYWZhcmk6XG4gICAgICAgICAgY21kOiAnc3RhcnQgc2FmYXJpICdcbiAgICAgICAgU2FmYXJpUG9ydGFibGU6XG4gICAgICAgICAgY21kOiAgJ3N0YXJ0ICcgKyBhdG9tLmNvbmZpZy5nZXQoJ29wZW4taW4tYnJvd3NlcnMuU2FmYXJpUG9ydGFibGVQYXRoJykgKyAnICdcblxuICAgICAgZGFyd2luOlxuICAgICAgICBDaHJvbWU6XG4gICAgICAgICAgY21kOiAnb3BlbiAtYSBcIkdvb2dsZSBDaHJvbWVcIiAnXG4gICAgICAgIEZpcmVmb3g6XG4gICAgICAgICAgY21kOiAnb3BlbiAtYSBcIkZpcmVmb3hcIiAnXG4gICAgICAgIFNhZmFyaTpcbiAgICAgICAgICBjbWQ6ICdvcGVuIC1hIFwiU2FmYXJpXCIgJ1xuICAgICAgICBPcGVyYTpcbiAgICAgICAgICBjbWQ6ICdvcGVuIC1hIFwiT3BlcmFcIiAnXG4gICAgICAgIENocm9tZVBvcnRhYmxlOlxuICAgICAgICAgIGNtZDogICdvcGVuIC1hICcgKyBhdG9tLmNvbmZpZy5nZXQoJ29wZW4taW4tYnJvd3NlcnMuQ2hyb21lUG9ydGFibGVQYXRoJykgKyAnICdcbiAgICAgICAgRmlyZWZveFBvcnRhYmxlOlxuICAgICAgICAgIGNtZDogICdvcGVuIC1hICcgKyBhdG9tLmNvbmZpZy5nZXQoJ29wZW4taW4tYnJvd3NlcnMuRmlyZWZveFBvcnRhYmxlLnBhdGgnKSArICcgJ1xuICAgICAgICBTYWZhcmlQb3J0YWJsZTpcbiAgICAgICAgICBjbWQ6ICAnb3BlbiAtYSAnICsgYXRvbS5jb25maWcuZ2V0KCdvcGVuLWluLWJyb3dzZXJzLlNhZmFyaVBvcnRhYmxlLnBhdGgnKSArICcgJ1xuXG5cbiAgICAgIGxpbnV4OlxuICAgICAgICBDaHJvbWU6XG4gICAgICAgICAgY21kOiAnZ29vZ2xlLWNocm9tZSAnXG4gICAgICAgIEZpcmVmb3g6XG4gICAgICAgICAgY21kOiAnZmlyZWZveCAnXG4gICAgICAgIFNhZmFyaTpcbiAgICAgICAgICBjbWQ6ICdzYWZhcmkgJ1xuICAgICAgICBPcGVyYTpcbiAgICAgICAgICBjbWQ6ICdvcGVyYSAnXG4gICAgICAgIENocm9tZVBvcnRhYmxlOlxuICAgICAgICAgIGNtZDogICdvcGVuIC1hICcgKyBhdG9tLmNvbmZpZy5nZXQoJ29wZW4taW4tYnJvd3NlcnMuQ2hyb21lUG9ydGFibGVQYXRoJykgKyAnICdcbiAgICAgICAgRmlyZWZveFBvcnRhYmxlOlxuICAgICAgICAgIGNtZDogICdvcGVuIC1hICcgKyBhdG9tLmNvbmZpZy5nZXQoJ29wZW4taW4tYnJvd3NlcnMuRmlyZWZveFBvcnRhYmxlLnBhdGgnKSArICcgJ1xuICAgICAgICBTYWZhcmlQb3J0YWJsZTpcbiAgICAgICAgICBjbWQ6ICAnb3BlbiAtYSAnICsgYXRvbS5jb25maWcuZ2V0KCdvcGVuLWluLWJyb3dzZXJzLlNhZmFyaVBvcnRhYmxlLnBhdGgnKSArICcgJ1xuIl19
