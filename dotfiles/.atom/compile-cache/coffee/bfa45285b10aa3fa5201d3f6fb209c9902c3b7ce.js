(function() {
  var CompositeDisposable, TreeViewGitStatus, TreeViewGitStatusTooltip, fs, path;

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  fs = require('fs-plus');

  TreeViewGitStatusTooltip = require('./tooltip');

  module.exports = TreeViewGitStatus = {
    config: {
      autoToggle: {
        type: 'boolean',
        "default": true
      },
      showProjectModifiedStatus: {
        type: 'boolean',
        "default": true,
        description: 'Mark project folder as modified in case there are any ' + 'uncommited changes'
      },
      showBranchLabel: {
        type: 'boolean',
        "default": true
      },
      showCommitsAheadLabel: {
        type: 'boolean',
        "default": true
      },
      showCommitsBehindLabel: {
        type: 'boolean',
        "default": true
      }
    },
    subscriptions: null,
    repositorySubscriptions: null,
    repositoryMap: null,
    treeView: null,
    treeViewRootsMap: null,
    roots: null,
    showProjectModifiedStatus: true,
    showBranchLabel: true,
    showCommitsAheadLabel: true,
    showCommitsBehindLabel: true,
    subscriptionsOfCommands: null,
    active: false,
    ignoredRepositories: null,
    activate: function() {
      this.active = true;
      this.showProjectModifiedStatus = atom.config.get('tree-view-git-status.showProjectModifiedStatus');
      this.showBranchLabel = atom.config.get('tree-view-git-status.showBranchLabel');
      this.showCommitsAheadLabel = atom.config.get('tree-view-git-status.showCommitsAheadLabel');
      this.showCommitsBehindLabel = atom.config.get('tree-view-git-status.showCommitsBehindLabel');
      this.subscriptionsOfCommands = new CompositeDisposable;
      this.subscriptionsOfCommands.add(atom.commands.add('atom-workspace', {
        'tree-view-git-status:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      this.subscriptions = new CompositeDisposable;
      this.treeViewRootsMap = new Map;
      this.ignoredRepositories = new Map;
      if (atom.config.get('tree-view-git-status.autoToggle')) {
        return this.toggle();
      }
    },
    deactivate: function() {
      var _ref, _ref1, _ref2, _ref3, _ref4;
      if ((_ref = this.subscriptions) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.repositorySubscriptions) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.subscriptionsOfCommands) != null) {
        _ref2.dispose();
      }
      if (this.treeView != null) {
        this.clearTreeViewRootMap();
      }
      if ((_ref3 = this.repositoryMap) != null) {
        _ref3.clear();
      }
      if ((_ref4 = this.ignoredRepositories) != null) {
        _ref4.clear();
      }
      this.treeViewRootsMap = null;
      this.subscriptions = null;
      this.treeView = null;
      this.repositorySubscriptions = null;
      this.treeViewRootsMap = null;
      this.repositoryMap = null;
      this.ignoredRepositories = null;
      this.active = false;
      return this.toggled = false;
    },
    toggle: function() {
      var _ref, _ref1, _ref2;
      if (!this.active) {
        return;
      }
      if (this.toggled) {
        this.toggled = false;
        if ((_ref = this.subscriptions) != null) {
          _ref.dispose();
        }
        if ((_ref1 = this.repositorySubscriptions) != null) {
          _ref1.dispose();
        }
        if (this.treeView != null) {
          this.clearTreeViewRootMap();
        }
        return (_ref2 = this.repositoryMap) != null ? _ref2.clear() : void 0;
      } else {
        this.toggled = true;
        this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
          return function() {
            return _this.subscribeUpdateRepositories();
          };
        })(this)));
        this.subscribeUpdateRepositories();
        this.subscribeUpdateConfigurations();
        return atom.packages.activatePackage('tree-view').then((function(_this) {
          return function(treeViewPkg) {
            if (!(_this.active && _this.toggled)) {
              return;
            }
            _this.treeView = treeViewPkg.mainModule.createView();
            _this.subscribeUpdateTreeView();
            return _this.updateRoots(true);
          };
        })(this))["catch"](function(error) {
          return console.error(error, error.stack);
        });
      }
    },
    clearTreeViewRootMap: function() {
      var _ref, _ref1;
      if ((_ref = this.treeViewRootsMap) != null) {
        _ref.forEach(function(root, rootPath) {
          var customElements, _ref1, _ref2, _ref3, _ref4;
          if ((_ref1 = root.root) != null) {
            if ((_ref2 = _ref1.classList) != null) {
              _ref2.remove('status-modified', 'status-added');
            }
          }
          customElements = root.customElements;
          if ((customElements != null ? customElements.headerGitStatus : void 0) != null) {
            if ((_ref3 = root.root) != null) {
              if ((_ref4 = _ref3.header) != null) {
                _ref4.removeChild(customElements.headerGitStatus);
              }
            }
            customElements.headerGitStatus = null;
          }
          if ((customElements != null ? customElements.tooltip : void 0) != null) {
            customElements.tooltip.destruct();
            return customElements.tooltip = null;
          }
        });
      }
      return (_ref1 = this.treeViewRootsMap) != null ? _ref1.clear() : void 0;
    },
    subscribeUpdateConfigurations: function() {
      atom.config.observe('tree-view-git-status.showProjectModifiedStatus', (function(_this) {
        return function(newValue) {
          if (_this.showProjectModifiedStatus !== newValue) {
            _this.showProjectModifiedStatus = newValue;
            return _this.updateRoots();
          }
        };
      })(this));
      atom.config.observe('tree-view-git-status.showBranchLabel', (function(_this) {
        return function(newValue) {
          if (_this.showBranchLabel !== newValue) {
            _this.showBranchLabel = newValue;
            return _this.updateRoots();
          }
        };
      })(this));
      atom.config.observe('tree-view-git-status.showCommitsAheadLabel', (function(_this) {
        return function(newValue) {
          if (_this.showCommitsAheadLabel !== newValue) {
            _this.showCommitsAheadLabel = newValue;
            return _this.updateRoots();
          }
        };
      })(this));
      return atom.config.observe('tree-view-git-status.showCommitsBehindLabel', (function(_this) {
        return function(newValue) {
          if (_this.showCommitsBehindLabel !== newValue) {
            _this.showCommitsBehindLabel = newValue;
            return _this.updateRoots();
          }
        };
      })(this));
    },
    subscribeUpdateTreeView: function() {
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('tree-view.hideVcsIgnoredFiles', (function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('tree-view.hideIgnoredNames', (function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('core.ignoredNames', (function(_this) {
        return function() {
          if (atom.config.get('tree-view.hideIgnoredNames')) {
            return _this.updateRoots(true);
          }
        };
      })(this)));
      return this.subscriptions.add(atom.config.onDidChange('tree-view.sortFoldersBeforeFiles', (function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
    },
    subscribeUpdateRepositories: function() {
      var repo, _i, _len, _ref, _ref1, _results;
      if ((_ref = this.repositorySubscriptions) != null) {
        _ref.dispose();
      }
      this.repositorySubscriptions = new CompositeDisposable;
      this.repositoryMap = new Map();
      _ref1 = atom.project.getRepositories();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        repo = _ref1[_i];
        if (repo != null) {
          if ((repo.getShortHead != null) && typeof repo.getShortHead() === 'string' && (repo.getWorkingDirectory != null) && typeof repo.getWorkingDirectory() === 'string' && (repo.statuses != null) && !this.isRepositoryIgnored(repo.getWorkingDirectory())) {
            this.repositoryMap.set(this.normalizePath(repo.getWorkingDirectory()), repo);
            _results.push(this.subscribeToRepo(repo));
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    },
    subscribeToRepo: function(repo) {
      this.repositorySubscriptions.add(repo.onDidChangeStatuses((function(_this) {
        return function() {
          return _this.updateRootForRepo(repo);
        };
      })(this)));
      return this.repositorySubscriptions.add(repo.onDidChangeStatus((function(_this) {
        return function() {
          return _this.updateRootForRepo(repo);
        };
      })(this)));
    },
    updateRoots: function(reset) {
      var repoForRoot, repoSubPath, root, rootPath, rootPathHasGitFolder, _i, _len, _ref, _results;
      if (this.treeView != null) {
        this.roots = this.treeView.roots;
        if (reset) {
          this.clearTreeViewRootMap();
        }
        _ref = this.roots;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          root = _ref[_i];
          rootPath = this.normalizePath(root.directoryName.dataset.path);
          if (reset) {
            this.treeViewRootsMap.set(rootPath, {
              root: root,
              customElements: {}
            });
          }
          repoForRoot = null;
          repoSubPath = null;
          rootPathHasGitFolder = fs.existsSync(path.join(rootPath, '.git'));
          this.repositoryMap.forEach(function(repo, repoPath) {
            if ((repoForRoot == null) && ((rootPath === repoPath) || (rootPath.indexOf(repoPath) === 0 && !rootPathHasGitFolder))) {
              repoSubPath = path.relative(repoPath, rootPath);
              return repoForRoot = repo;
            }
          });
          if (repoForRoot != null) {
            if ((repoForRoot != null ? repoForRoot.repo : void 0) == null) {
              repoForRoot = null;
            }
            _results.push(this.doUpdateRootNode(root, repoForRoot, rootPath, repoSubPath));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    updateRootForRepo: function(repo) {
      var repoPath;
      if ((this.treeView != null) && (this.treeViewRootsMap != null)) {
        repoPath = this.normalizePath(repo.getWorkingDirectory());
        return this.treeViewRootsMap.forEach((function(_this) {
          return function(root, rootPath) {
            var repoSubPath;
            if (rootPath.indexOf(repoPath) === 0) {
              repoSubPath = path.relative(repoPath, rootPath);
              if ((repo != null ? repo.repo : void 0) == null) {
                repo = null;
              }
              if (root.root != null) {
                return _this.doUpdateRootNode(root.root, repo, rootPath, repoSubPath);
              }
            }
          };
        })(this));
      }
    },
    doUpdateRootNode: function(root, repo, rootPath, repoSubPath) {
      var convStatus, customElements, headerGitStatus, showHeaderGitStatus, status;
      customElements = this.treeViewRootsMap.get(rootPath).customElements;
      if (this.showProjectModifiedStatus && (repo != null)) {
        if (repoSubPath !== '') {
          status = repo.getDirectoryStatus(repoSubPath);
        } else {
          status = this.getRootDirectoryStatus(repo);
        }
      }
      convStatus = this.convertDirectoryStatus(repo, status);
      root.classList.remove('status-modified', 'status-added');
      if (convStatus != null) {
        root.classList.add("status-" + convStatus);
      }
      showHeaderGitStatus = this.showBranchLabel || this.showCommitsAheadLabel || this.showCommitsBehindLabel;
      if (showHeaderGitStatus && (repo != null) && (customElements.headerGitStatus == null)) {
        headerGitStatus = document.createElement('span');
        headerGitStatus.classList.add('tree-view-git-status');
        this.generateGitStatusText(headerGitStatus, repo);
        root.header.insertBefore(headerGitStatus, root.directoryName.nextSibling);
        customElements.headerGitStatus = headerGitStatus;
      } else if (showHeaderGitStatus && (customElements.headerGitStatus != null)) {
        this.generateGitStatusText(customElements.headerGitStatus, repo);
      } else if (customElements.headerGitStatus != null) {
        root.header.removeChild(customElements.headerGitStatus);
        customElements.headerGitStatus = null;
      }
      if ((repo != null) && (customElements.tooltip == null)) {
        return customElements.tooltip = new TreeViewGitStatusTooltip(root, repo);
      }
    },
    generateGitStatusText: function(container, repo) {
      var ahead, behind, branchLabel, commitsAhead, commitsBehind, display, head, _ref, _ref1;
      display = false;
      head = repo != null ? repo.getShortHead() : void 0;
      ahead = behind = 0;
      if (repo.getCachedUpstreamAheadBehindCount != null) {
        _ref1 = (_ref = repo.getCachedUpstreamAheadBehindCount()) != null ? _ref : {}, ahead = _ref1.ahead, behind = _ref1.behind;
      }
      if (this.showBranchLabel && (head != null)) {
        branchLabel = document.createElement('span');
        branchLabel.classList.add('branch-label');
        branchLabel.textContent = head;
        display = true;
      }
      if (this.showCommitsAheadLabel && ahead > 0) {
        commitsAhead = document.createElement('span');
        commitsAhead.classList.add('commits-ahead-label');
        commitsAhead.textContent = ahead;
        display = true;
      }
      if (this.showCommitsBehindLabel && behind > 0) {
        commitsBehind = document.createElement('span');
        commitsBehind.classList.add('commits-behind-label');
        commitsBehind.textContent = behind;
        display = true;
      }
      if (display) {
        container.classList.remove('hide');
      } else {
        container.classList.add('hide');
      }
      container.innerHTML = '';
      if (branchLabel != null) {
        container.appendChild(branchLabel);
      }
      if (commitsAhead != null) {
        container.appendChild(commitsAhead);
      }
      if (commitsBehind != null) {
        return container.appendChild(commitsBehind);
      }
    },
    convertDirectoryStatus: function(repo, status) {
      var newStatus;
      newStatus = null;
      if (repo.isStatusModified(status)) {
        newStatus = 'modified';
      } else if (repo.isStatusNew(status)) {
        newStatus = 'added';
      }
      return newStatus;
    },
    getRootDirectoryStatus: function(repo) {
      var directoryStatus, filePath, status, _ref;
      directoryStatus = 0;
      _ref = repo.statuses;
      for (filePath in _ref) {
        status = _ref[filePath];
        directoryStatus |= status;
      }
      return directoryStatus;
    },
    ignoreRepository: function(repoPath) {
      this.ignoredRepositories.set(repoPath, true);
      this.subscribeUpdateRepositories();
      return this.updateRoots(true);
    },
    isRepositoryIgnored: function(repoPath) {
      return this.ignoredRepositories.has(repoPath);
    },
    normalizePath: function(repoPath) {
      var normPath;
      normPath = path.normalize(repoPath);
      if (process.platform === 'darwin') {
        normPath = normPath.replace(/^\/private/, '');
      }
      return normPath;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LXN0YXR1cy9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEVBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0Esd0JBQUEsR0FBMkIsT0FBQSxDQUFRLFdBQVIsQ0FIM0IsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGlCQUFBLEdBQ2Y7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FERjtBQUFBLE1BR0EseUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxXQUFBLEVBQ0Usd0RBQUEsR0FDQSxvQkFKRjtPQUpGO0FBQUEsTUFTQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQVZGO0FBQUEsTUFZQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FiRjtBQUFBLE1BZUEsc0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BaEJGO0tBREY7QUFBQSxJQW9CQSxhQUFBLEVBQWUsSUFwQmY7QUFB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

//# sourceURL=/home/vagrant/.atom/packages/tree-view-git-status/lib/main.coffee
