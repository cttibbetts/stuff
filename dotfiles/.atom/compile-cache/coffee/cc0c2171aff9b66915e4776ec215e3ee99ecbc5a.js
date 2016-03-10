(function() {
  var CompositeDisposable, Project, ProjectView, fs, path;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  path = require('path');

  Project = require('./project');

  module.exports = ProjectView = {
    config: {
      displayPath: {
        type: 'boolean',
        "default": true,
        description: 'Show the project path after project name in tree-view root.'
      }
    },
    activate: function() {
      this.projectMap = {};
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          return _this.initProjectView();
        };
      })(this)));
      this.initProjectView();
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'project-view:toggle-path': function() {
          return atom.config.set('project-view.displayPath', !atom.config.get('project-view.displayPath'));
        }
      }));
    },
    initProjectView: function() {
      var treeViewPkg, _ref;
      if (this.treeView == null) {
        if (atom.packages.getActivePackage('nuclide-tree-view') != null) {
          treeViewPkg = atom.packages.getActivePackage('nuclide-tree-view');
        } else if (atom.packages.getActivePackage('tree-view') != null) {
          treeViewPkg = atom.packages.getActivePackage('tree-view');
        }
        if ((treeViewPkg != null ? (_ref = treeViewPkg.mainModule) != null ? _ref.treeView : void 0 : void 0) != null) {
          this.treeView = treeViewPkg.mainModule.treeView;
          this.subscribeUpdateEvents();
          return this.updateRoots(this.treeView.roots);
        }
      }
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.subscriptions) != null) {
        _ref.dispose();
      }
      if (this.treeView != null) {
        this.clearRoots();
      }
      this.subscriptions = null;
      this.treeView = null;
      return this.projectMap = null;
    },
    subscribeUpdateEvents: function() {
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.updateRoots();
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('tree-view.hideVcsIgnoredFiles', (function(_this) {
        return function() {
          return _this.updateRoots();
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('tree-view.hideIgnoredNames', (function(_this) {
        return function() {
          return _this.updateRoots();
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('core.ignoredNames', (function(_this) {
        return function() {
          if (atom.config.get('tree-view.hideIgnoredNames')) {
            return _this.updateRoots();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('tree-view.sortFoldersBeforeFiles', (function(_this) {
        return function() {
          return _this.updateRoots();
        };
      })(this)));
      return this.subscriptions.add(atom.config.onDidChange('project-view.displayPath', (function(_this) {
        return function() {
          return _this.updateRoots();
        };
      })(this)));
    },
    updateRoots: function() {
      var project, projectsToRemove, root, rootPath, roots, _i, _j, _len, _len1, _ref, _ref1, _results;
      roots = this.treeView.roots;
      for (_i = 0, _len = roots.length; _i < _len; _i++) {
        root = roots[_i];
        rootPath = root.getPath();
        project = this.projectMap[rootPath];
        if (typeof proj === "undefined" || proj === null) {
          project = new Project(root);
          this.projectMap[rootPath] = project;
          project.onDidChange('name', (function(_this) {
            return function(_arg) {
              var name, root;
              root = _arg.root, name = _arg.name;
              return _this.updateProjectRoot(root, name);
            };
          })(this));
          project.watch();
        }
        project.findProjectName().then((function(_this) {
          return function(_arg) {
            var name, root;
            root = _arg.root, name = _arg.name;
            return _this.updateProjectRoot(root, name);
          };
        })(this))["catch"](function(error) {
          return console.error(error, error.stack);
        });
      }
      projectsToRemove = [];
      _ref = this.projectMap;
      for (rootPath in _ref) {
        project = _ref[rootPath];
        if (this.findRootByPath(rootPath) == null) {
          projectsToRemove.push(rootPath);
        }
      }
      _results = [];
      for (_j = 0, _len1 = projectsToRemove.length; _j < _len1; _j++) {
        rootPath = projectsToRemove[_j];
        if ((_ref1 = this.projectMap[rootPath]) != null) {
          _ref1.destory();
        }
        _results.push(delete this.projectMap[rootPath]);
      }
      return _results;
    },
    findRootByPath: function(rootPath) {
      var root, _i, _len, _ref;
      _ref = this.treeView.roots;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        root = _ref[_i];
        if (rootPath === root.getPath()) {
          return rootPath;
        }
      }
    },
    clearRoots: function() {
      var directoryPath, project, root, roots, _i, _len;
      roots = this.treeView.roots;
      for (_i = 0, _len = roots.length; _i < _len; _i++) {
        root = roots[_i];
        project = this.projectMap[root.getPath()];
        if (project != null) {
          project.destory();
        }
        root.directoryName.textContent = root.directoryName.dataset.name;
        root.directoryName.classList.remove('project-view');
        directoryPath = root.header.querySelector('.project-view-path');
        if (directoryPath != null) {
          root.header.removeChild(directoryPath);
        }
        delete root.directoryPath;
      }
      return this.projectMap = {};
    },
    updateProjectRoot: function(root, name) {
      if (name != null) {
        root.directoryName.textContent = name;
        root.directoryName.classList.add('project-view');
      } else {
        root.directoryName.textContent = root.directoryName.dataset.name;
        root.directoryName.classList.remove('project-view');
      }
      if (root.directoryPath == null) {
        root.directoryPath = document.createElement('span');
        root.header.appendChild(root.directoryPath);
      }
      root.directoryPath.classList.add('name', 'project-view-path', 'status-ignored');
      if (atom.config.get('project-view.displayPath')) {
        return root.directoryPath.textContent = '(' + this.shortenRootPath(root.directory.path) + ')';
      } else {
        return root.directoryPath.textContent = '';
      }
    },
    shortenRootPath: function(rootPath) {
      var normRootPath, userHome;
      userHome = fs.getHomeDirectory();
      normRootPath = path.normalize(rootPath);
      if (normRootPath.indexOf(userHome) === 0) {
        return '~' + normRootPath.substring(userHome.length);
      } else {
        return rootPath;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LXZpZXcvbGliL3Byb2plY3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSFYsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFdBQUEsR0FDZjtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDZEQUZiO09BREY7S0FERjtBQUFBLElBTUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxFQUFkLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFIakIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsNEJBQWQsQ0FBMkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDNUQsS0FBQyxDQUFBLGVBQUQsQ0FBQSxFQUQ0RDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNDLENBQW5CLENBSkEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGVBQUQsQ0FB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

//# sourceURL=/home/vagrant/.atom/packages/project-view/lib/project-view.coffee
