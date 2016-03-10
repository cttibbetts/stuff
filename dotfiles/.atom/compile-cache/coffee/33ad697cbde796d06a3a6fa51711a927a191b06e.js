(function() {
  var Emitter, Project, fs, path;

  Emitter = require('atom').Emitter;

  path = require('path');

  fs = require('fs-plus');

  Project = (function() {
    function Project(root) {
      this.root = root;
      this.emitter = new Emitter;
      this.projectName = null;
      this.trackedFile = null;
    }

    Project.prototype.destory = function() {
      var _ref;
      this.unwatch();
      this.projectName = null;
      this.trackedFile = null;
      if ((_ref = this.emitter) != null) {
        _ref.dispose();
      }
      return this.emitter = null;
    };

    Project.prototype.unwatch = function() {
      if (this.watchSubscription != null) {
        this.watchSubscription.close();
        return this.watchSubscription = null;
      }
    };

    Project.prototype.watch = function() {
      if (this.watchSubscription == null) {
        try {
          return this.watchSubscription = fs.watch(this.root.getPath(), (function(_this) {
            return function(event, filename) {
              if (event === 'change') {
                if (filename === _this.trackedFile) {
                  return _this.findProjectName();
                }
              } else {
                return _this.findProjectName();
              }
            };
          })(this));
        } catch (_error) {}
      }
    };

    Project.prototype.onDidChange = function(eventType, callback) {
      return this.emitter.on(eventType, callback);
    };

    Project.prototype.findProjectName = function() {
      var rootPath;
      rootPath = this.root.getPath();
      return new Promise(function(resolve, reject) {
        return fs.readdir(rootPath, function(error, files) {
          return resolve(files);
        });
      }).then((function(_this) {
        return function(files) {
          var pkgFile;
          if (files == null) {
            return;
          }
          if (files.indexOf('package.json') !== -1) {
            pkgFile = path.join(rootPath, 'package.json');
            _this.trackedFile = 'package.json';
            return _this.getPropertyFromPackageJson(pkgFile, 'name');
          } else if (files.indexOf('.bower.json') !== -1) {
            pkgFile = path.join(rootPath, '.bower.json');
            _this.trackedFile = '.bower.json';
            return _this.getPropertyFromPackageJson(pkgFile, 'name');
          } else if (files.indexOf('composer.json') !== -1) {
            pkgFile = path.join(rootPath, 'composer.json');
            _this.trackedFile = 'composer.json';
            return _this.getPropertyFromPackageJson(pkgFile, 'name');
          } else {
            _this.trackedFile = null;
          }
        };
      })(this)).then((function(_this) {
        return function(name) {
          var result;
          result = {
            root: _this.root,
            name: name
          };
          _this.projectName = name;
          _this.emitter.emit('name', result);
          return result;
        };
      })(this));
    };

    Project.prototype.getProjectName = function() {
      return this.projectName;
    };

    Project.prototype.getPropertyFromPackageJson = function(rootPath, property) {
      return new Promise(function(resolve, reject) {
        return fs.readFile(rootPath, 'utf8', function(error, data) {
          var pkgData;
          if (error) {
            resolve(null);
          }
          try {
            pkgData = JSON.parse(data);
            if (pkgData[property]) {
              return resolve(pkgData[property]);
            } else {
              return resolve(null);
            }
          } catch (_error) {
            error = _error;
            return resolve(null);
          }
        });
      });
    };

    return Project;

  })();

  module.exports = Project;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LXZpZXcvbGliL3Byb2plY3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSU07QUFFUyxJQUFBLGlCQUFFLElBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLE9BQUEsSUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFEZixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBRmYsQ0FEVztJQUFBLENBQWI7O0FBQUEsc0JBS0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFEZixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBRmYsQ0FBQTs7WUFHUSxDQUFFLE9BQVYsQ0FBQTtPQUhBO2FBSUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUxKO0lBQUEsQ0FMVCxDQUFBOztBQUFBLHNCQVlBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUcsOEJBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxLQUFuQixDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixLQUZ2QjtPQURPO0lBQUEsQ0FaVCxDQUFBOztBQUFBLHNCQWlCQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFPLDhCQUFQO0FBQ0U7aUJBQ0UsSUFBQyxDQUFBLGlCQUFELEdBQXFCLEVBQUUsQ0FBQyxLQUFILENBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUEsQ0FBVCxFQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO21CQUFBLFNBQUMsS0FBRCxFQUFRLFFBQVIsR0FBQTtBQUM3QyxjQUFBLElBQUcsS0FBQSxLQUFTLFFBQVo7QUFDRSxnQkFBQSxJQUFzQixRQUFBLEtBQVksS0FBQyxDQUFBLFdBQW5DO3lCQUFBLEtBQUMsQ0FBQSxlQUFELENBQUEsRUFBQTtpQkFERjtlQUFBLE1BQUE7dUJBR0UsS0FBQyxDQUFBLGVBQUQsQ0FBQSxFQUhGO2VBRDZDO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsRUFEdkI7U0FBQSxrQkFERjtPQURLO0lBQUEsQ0FqQlAsQ0FBQTs7QUFBQSxzQkEwQkEsV0FBQSxHQUFhLFNBQUMsU0FBRCxFQUFZLFFBQVosR0FBQTthQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLFNBQVosRUFBdUIsUUFBdkIsRUFEVztJQUFBLENBMUJiLENBQUE7O0FBQUEsc0JBNkJBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxRQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUEsQ0FBWCxDQUFBO0FBQ0EsYUFBVyxJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7ZUFDakIsRUFBRSxDQUFDLE9BQUgsQ0FBVyxRQUFYLEVBQXFCLFNBQUMsS0FBRCxFQUFRLEtBQVIsR0FBQTtpQkFDbkIsT0FBQSxDQUFRLEtBQVIsRUFEbUI7UUFBQSxDQUFyQixFQURpQjtNQUFBLENBQVIsQ0FHWCxDQUFDLElBSFUsQ0FHTCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDSixjQUFBLE9BQUE7QUFBQSxVQUFBLElBQWMsYUFBZDtBQUFBLGtCQUFBLENBQUE7V0FBQTtBQUNBLFVBQUEsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLGNBQWQsQ0FBQSxLQUFtQyxDQUFBLENBQXRDO0FBQ0UsWUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLElBQUwsQ0FBVSxRQUFWLEVBQW9CLGNBQXBCLENBQVYsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLFdBQUQsR0FBZSxjQURmLENBQUE7QUFFQSxtQkFBTyxLQUFDLENBQUEsMEJBQUQsQ0FBNEIsT0FBNUIsRUFBcUMsTUFBckMsQ0FBUCxDQUhGO1dBQUEsTUFJSyxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsYUFBZCxDQUFBLEtBQWtDLENBQUEsQ0FBckM7QUFDSCxZQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsSUFBTCxDQUFVLFFBQVYsRUFBb0IsYUFBcEIsQ0FBVixDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsV0FBRCxHQUFlLGFBRGYsQ0FBQTtBQUVBLG1CQUFPLEtBQUMsQ0FBQSwwQkFBRCxDQUE0QixPQUE1QixFQUFxQyxNQUFyQyxDQUFQLENBSEc7V0FBQSxNQUlBLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxlQUFkLENBQUEsS0FBb0MsQ0FBQSxDQUF2QztBQUNILFlBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxJQUFMLENBQVUsUUFBVixFQUFvQixlQUFwQixDQUFWLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxXQUFELEdBQWUsZUFEZixDQUFBO0FBRUEsbUJBQU8sS0FBQyxDQUFBLDBCQUFELENBQTRCLE9BQTVCLEVBQXFDLE1BQXJDLENBQVAsQ0FIRztXQUFBLE1BQUE7WUFLSCxLQUFDLENBQUEsV0FBRCxHQUFlLEtBTFo7V0FWRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSEssQ0FvQlgsQ0FBQyxJQXBCVSxDQW9CTCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDSixjQUFBLE1BQUE7QUFBQSxVQUFBLE1BQUEsR0FBUztBQUFBLFlBQUMsSUFBQSxFQUFNLEtBQUMsQ0FBQSxJQUFSO0FBQUEsWUFBYyxJQUFBLEVBQU0sSUFBcEI7V0FBVCxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsV0FBRCxHQUFlLElBRGYsQ0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsTUFBZCxFQUFzQixNQUF0QixDQUZBLENBQUE7QUFHQSxpQkFBTyxNQUFQLENBSkk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXBCSyxDQUFYLENBRmU7SUFBQSxDQTdCakIsQ0FBQTs7QUFBQSxzQkF5REEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxhQUFPLElBQUMsQ0FBQSxXQUFSLENBRGM7SUFBQSxDQXpEaEIsQ0FBQTs7QUFBQSxzQkE0REEsMEJBQUEsR0FBNEIsU0FBQyxRQUFELEVBQVcsUUFBWCxHQUFBO0FBQzFCLGFBQVcsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO2VBQ2pCLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBWixFQUFzQixNQUF0QixFQUE4QixTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDNUIsY0FBQSxPQUFBO0FBQUEsVUFBQSxJQUFHLEtBQUg7QUFDRSxZQUFBLE9BQUEsQ0FBUSxJQUFSLENBQUEsQ0FERjtXQUFBO0FBRUE7QUFDRSxZQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBVixDQUFBO0FBQ0EsWUFBQSxJQUFHLE9BQVEsQ0FBQSxRQUFBLENBQVg7cUJBQ0UsT0FBQSxDQUFRLE9BQVEsQ0FBQSxRQUFBLENBQWhCLEVBREY7YUFBQSxNQUFBO3FCQUdFLE9BQUEsQ0FBUSxJQUFSLEVBSEY7YUFGRjtXQUFBLGNBQUE7QUFPRSxZQURJLGNBQ0osQ0FBQTttQkFBQSxPQUFBLENBQVEsSUFBUixFQVBGO1dBSDRCO1FBQUEsQ0FBOUIsRUFEaUI7TUFBQSxDQUFSLENBQVgsQ0FEMEI7SUFBQSxDQTVENUIsQ0FBQTs7bUJBQUE7O01BTkYsQ0FBQTs7QUFBQSxFQWdGQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQWhGakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/vagrant/.atom/packages/project-view/lib/project.coffee
