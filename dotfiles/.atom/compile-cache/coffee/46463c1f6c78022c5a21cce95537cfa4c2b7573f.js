(function() {
  var TreeViewGitStatus, fs, path, temp;

  TreeViewGitStatus = require('../lib/main');

  fs = require('fs-plus');

  path = require('path');

  temp = require('temp').track();

  describe("TreeViewGitStatus", function() {
    var extractGitRepoFixture, fixturesPath, gitStatus, treeView, validateProjectPaths, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], gitStatus = _ref[1], treeView = _ref[2], fixturesPath = _ref[3];
    beforeEach(function() {
      fixturesPath = atom.project.getPaths()[0];
      atom.project.removePath(fixturesPath);
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return waitsForPromise(function() {
        return atom.packages.activatePackage('tree-view-git-status').then(function(pkg) {
          gitStatus = pkg.mainModule;
          treeView = gitStatus.treeView;
          return gitStatus.ignoreRepository((path.resolve(fixturesPath, '..', '..').split(path.sep)).join('/'));
        });
      });
    });
    afterEach(function() {
      return temp.cleanup();
    });
    it('activates the TreeViewGitStatus package', function() {
      expect(gitStatus).toBeDefined();
      return expect(gitStatus.treeView).toBeDefined();
    });
    it('adds valid Git repositories to the repository map', function() {
      var projPaths;
      projPaths = [extractGitRepoFixture(fixturesPath, 'git-project')];
      atom.project.setPaths(projPaths);
      validateProjectPaths(projPaths);
      expect(gitStatus.toggled).toBe(true);
      expect(atom.project.getRepositories().length).toBe(1);
      return expect(gitStatus.repositoryMap.size).toBe(1);
    });
    it('disables the TreeViewGitStatus when toggled', function() {
      var projPaths, root, rootPath, _i, _j, _len, _len1, _ref1, _ref2;
      projPaths = [extractGitRepoFixture(fixturesPath, 'git-project')];
      atom.project.setPaths(projPaths);
      validateProjectPaths(projPaths);
      expect(gitStatus.toggled).toBe(true);
      expect(gitStatus.repositoryMap.size).toBe(1);
      _ref1 = treeView.roots;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        root = _ref1[_i];
        rootPath = gitStatus.normalizePath(root.directoryName.dataset.path);
        expect(gitStatus.repositoryMap.keys().next().value).toBe(rootPath);
        expect(gitStatus.repositoryMap.has(rootPath)).toBe(true);
        expect(root.header.querySelector('span.tree-view-git-status')).toExist();
      }
      gitStatus.toggle();
      _ref2 = treeView.roots;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        root = _ref2[_j];
        expect(root.header.querySelector('span.tree-view-git-status')).not.toExist();
      }
      expect(gitStatus.toggled).toBe(false);
      expect(gitStatus.subscriptions.disposed).toBe(true);
      expect(gitStatus.repositorySubscriptions.disposed).toBe(true);
      expect(gitStatus.repositoryMap.size).toBe(0);
      return expect(gitStatus.ignoredRepositories.size).not.toBeNull();
    });
    it('skips adding the TreeViewGitStatus on none Git projects', function() {
      var projPaths, root, _i, _len, _ref1, _results;
      projPaths = [path.join(fixturesPath, 'none-git-project')];
      atom.project.setPaths(projPaths);
      validateProjectPaths(projPaths);
      expect(gitStatus.toggled).toBe(true);
      _ref1 = treeView.roots;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        root = _ref1[_i];
        _results.push(expect(root.header.querySelector('span.tree-view-git-status')).not.toExist());
      }
      return _results;
    });
    describe('when deactivated', function() {
      beforeEach(function() {
        var projPaths;
        projPaths = [extractGitRepoFixture(fixturesPath, 'git-project')];
        atom.project.setPaths(projPaths);
        validateProjectPaths(projPaths);
        expect(gitStatus.toggled).toBe(true);
        expect(atom.project.getRepositories().length).toBe(1);
        return runs(function() {
          return gitStatus.deactivate();
        });
      });
      it('destroys the TreeViewGitStatus instance', function() {
        expect(gitStatus.active).toBe(false);
        expect(gitStatus.toggled).toBe(false);
        expect(gitStatus.subscriptions).toBeNull();
        expect(gitStatus.treeView).toBeNull();
        expect(gitStatus.repositorySubscriptions).toBeNull();
        expect(gitStatus.treeViewRootsMap).toBeNull();
        expect(gitStatus.repositoryMap).toBeNull();
        return expect(gitStatus.ignoredRepositories).toBeNull();
      });
      it('destroys the Git Status elements that were added to the DOM', function() {
        var root, _i, _len, _ref1, _results;
        _ref1 = treeView.roots;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          root = _ref1[_i];
          _results.push(expect(root.header.querySelector('span.tree-view-git-status')).not.toExist());
        }
        return _results;
      });
      return it('removes the Git Status CSS classes that were added to the DOM', function() {
        var root, _i, _len, _ref1, _results;
        _ref1 = treeView.roots;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          root = _ref1[_i];
          expect(root.classList.contains('status-modified')).toBe(false);
          _results.push(expect(root.classList.contains('status-added')).toBe(false));
        }
        return _results;
      });
    });
    extractGitRepoFixture = function(fixturesPath, dotGitFixture) {
      var dotGit, dotGitFixturePath;
      dotGitFixturePath = path.join(fixturesPath, dotGitFixture, 'git.git');
      dotGit = path.join(temp.mkdirSync('repo'), '.git');
      fs.copySync(dotGitFixturePath, dotGit);
      return path.resolve(dotGit, '..');
    };
    return validateProjectPaths = function(projPaths) {
      var pPath, _i, _len, _ref1;
      expect(atom.project.getPaths().length).toBe(projPaths.length);
      _ref1 = atom.project.getPaths();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        pPath = _ref1[_i];
        expect(projPaths.indexOf(pPath)).toBeGreaterThan(-1);
      }
      return expect(treeView.roots.length).toBe(projPaths.length);
    };
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LXN0YXR1cy9zcGVjL3RyZWUtdmlldy1naXQtc3RhdHVzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBOztBQUFBLEVBQUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLGFBQVIsQ0FBcEIsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBLENBSFAsQ0FBQTs7QUFBQSxFQVVBLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsUUFBQSxzR0FBQTtBQUFBLElBQUEsT0FBd0QsRUFBeEQsRUFBQywwQkFBRCxFQUFtQixtQkFBbkIsRUFBOEIsa0JBQTlCLEVBQXdDLHNCQUF4QyxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQXZDLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBYixDQUF3QixZQUF4QixDQURBLENBQUE7QUFBQSxNQUdBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FIbkIsQ0FBQTtBQUFBLE1BSUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBSkEsQ0FBQTthQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHNCQUE5QixDQUFxRCxDQUFDLElBQXRELENBQTJELFNBQUMsR0FBRCxHQUFBO0FBQ3pELFVBQUEsU0FBQSxHQUFZLEdBQUcsQ0FBQyxVQUFoQixDQUFBO0FBQUEsVUFDQSxRQUFBLEdBQVcsU0FBUyxDQUFDLFFBRHJCLENBQUE7aUJBTUEsU0FBUyxDQUFDLGdCQUFWLENBQ0UsQ0FBQyxJQUFJLENBQUMsT0FBTCxDQUFhLFlBQWIsRUFBMkIsSUFBM0IsRUFBZ0MsSUFBaEMsQ0FBcUMsQ0FBQyxLQUF0QyxDQUE0QyxJQUFJLENBQUMsR0FBakQsQ0FBRCxDQUFzRCxDQUFDLElBQXZELENBQTRELEdBQTVELENBREYsRUFQeUQ7UUFBQSxDQUEzRCxFQURjO01BQUEsQ0FBaEIsRUFQUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFvQkEsU0FBQSxDQUFVLFNBQUEsR0FBQTthQUNSLElBQUksQ0FBQyxPQUFMLENBQUEsRUFEUTtJQUFBLENBQVYsQ0FwQkEsQ0FBQTtBQUFBLElBdUJBLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBLEdBQUE7QUFDNUMsTUFBQSxNQUFBLENBQU8sU0FBUCxDQUFpQixDQUFDLFdBQWxCLENBQUEsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLFNBQVMsQ0FBQyxRQUFqQixDQUEwQixDQUFDLFdBQTNCLENBQUEsRUFGNEM7SUFBQSxDQUE5QyxDQXZCQSxDQUFBO0FBQUEsSUEyQkEsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUEsR0FBQTtBQUN0RCxVQUFBLFNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxDQUFDLHFCQUFBLENBQXNCLFlBQXRCLEVBQW9DLGFBQXBDLENBQUQsQ0FBWixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsU0FBdEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxvQkFBQSxDQUFxQixTQUFyQixDQUZBLENBQUE7QUFBQSxNQUlBLE1BQUEsQ0FBTyxTQUFTLENBQUMsT0FBakIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixJQUEvQixDQUpBLENBQUE7QUFBQSxNQUtBLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWIsQ0FBQSxDQUE4QixDQUFDLE1BQXRDLENBQTZDLENBQUMsSUFBOUMsQ0FBbUQsQ0FBbkQsQ0FMQSxDQUFBO2FBTUEsTUFBQSxDQUFPLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBL0IsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxDQUExQyxFQVBzRDtJQUFBLENBQXhELENBM0JBLENBQUE7QUFBQSxJQW9DQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQSxHQUFBO0FBQ2hELFVBQUEsNERBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxDQUFDLHFCQUFBLENBQXNCLFlBQXRCLEVBQW9DLGFBQXBDLENBQUQsQ0FBWixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsU0FBdEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxvQkFBQSxDQUFxQixTQUFyQixDQUZBLENBQUE7QUFBQSxNQUlBLE1BQUEsQ0FBTyxTQUFTLENBQUMsT0FBakIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixJQUEvQixDQUpBLENBQUE7QUFBQSxNQUtBLE1BQUEsQ0FBTyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQS9CLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsQ0FBMUMsQ0FMQSxDQUFBO0FBT0E7QUFBQSxXQUFBLDRDQUFBO3lCQUFBO0FBQ0UsUUFBQSxRQUFBLEdBQVcsU0FBUyxDQUFDLGFBQVYsQ0FBd0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBbkQsQ0FBWCxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUF4QixDQUFBLENBQThCLENBQUMsSUFBL0IsQ0FBQSxDQUFxQyxDQUFDLEtBQTdDLENBQW1ELENBQUMsSUFBcEQsQ0FBeUQsUUFBekQsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUF4QixDQUE0QixRQUE1QixDQUFQLENBQTZDLENBQUMsSUFBOUMsQ0FBbUQsSUFBbkQsQ0FIQSxDQUFBO0FBQUEsUUFJQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFaLENBQTBCLDJCQUExQixDQUFQLENBQThELENBQUMsT0FBL0QsQ0FBQSxDQUpBLENBREY7QUFBQSxPQVBBO0FBQUEsTUFjQSxTQUFTLENBQUMsTUFBVixDQUFBLENBZEEsQ0FBQTtBQWdCQTtBQUFBLFdBQUEsOENBQUE7eUJBQUE7QUFDRSxRQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBMEIsMkJBQTFCLENBQVAsQ0FDRSxDQUFDLEdBQUcsQ0FBQyxPQURQLENBQUEsQ0FBQSxDQURGO0FBQUEsT0FoQkE7QUFBQSxNQW9CQSxNQUFBLENBQU8sU0FBUyxDQUFDLE9BQWpCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsS0FBL0IsQ0FwQkEsQ0FBQTtBQUFBLE1BcUJBLE1BQUEsQ0FBTyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQS9CLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsSUFBOUMsQ0FyQkEsQ0FBQTtBQUFBLE1Bc0JBLE1BQUEsQ0FBTyxTQUFTLENBQUMsdUJBQXVCLENBQUMsUUFBekMsQ0FBa0QsQ0FBQyxJQUFuRCxDQUF3RCxJQUF4RCxDQXRCQSxDQUFBO0FBQUEsTUF1QkEsTUFBQSxDQUFPLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBL0IsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxDQUExQyxDQXZCQSxDQUFBO2FBd0JBLE1BQUEsQ0FBTyxTQUFTLENBQUMsbUJBQW1CLENBQUMsSUFBckMsQ0FBMEMsQ0FBQyxHQUFHLENBQUMsUUFBL0MsQ0FBQSxFQXpCZ0Q7SUFBQSxDQUFsRCxDQXBDQSxDQUFBO0FBQUEsSUErREEsRUFBQSxDQUFHLHlEQUFILEVBQThELFNBQUEsR0FBQTtBQUM1RCxVQUFBLDBDQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsRUFBd0Isa0JBQXhCLENBQUQsQ0FBWixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsU0FBdEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxvQkFBQSxDQUFxQixTQUFyQixDQUZBLENBQUE7QUFBQSxNQUlBLE1BQUEsQ0FBTyxTQUFTLENBQUMsT0FBakIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixJQUEvQixDQUpBLENBQUE7QUFRQTtBQUFBO1dBQUEsNENBQUE7eUJBQUE7QUFDRSxzQkFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFaLENBQTBCLDJCQUExQixDQUFQLENBQ0UsQ0FBQyxHQUFHLENBQUMsT0FEUCxDQUFBLEVBQUEsQ0FERjtBQUFBO3NCQVQ0RDtJQUFBLENBQTlELENBL0RBLENBQUE7QUFBQSxJQTRFQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsU0FBQTtBQUFBLFFBQUEsU0FBQSxHQUFZLENBQUMscUJBQUEsQ0FBc0IsWUFBdEIsRUFBb0MsYUFBcEMsQ0FBRCxDQUFaLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixTQUF0QixDQURBLENBQUE7QUFBQSxRQUVBLG9CQUFBLENBQXFCLFNBQXJCLENBRkEsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLFNBQVMsQ0FBQyxPQUFqQixDQUF5QixDQUFDLElBQTFCLENBQStCLElBQS9CLENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBQSxDQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUFBLENBQThCLENBQUMsTUFBdEMsQ0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxDQUFuRCxDQUxBLENBQUE7ZUFPQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUNILFNBQVMsQ0FBQyxVQUFWLENBQUEsRUFERztRQUFBLENBQUwsRUFSUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFXQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO0FBQzVDLFFBQUEsTUFBQSxDQUFPLFNBQVMsQ0FBQyxNQUFqQixDQUF3QixDQUFDLElBQXpCLENBQThCLEtBQTlCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLFNBQVMsQ0FBQyxPQUFqQixDQUF5QixDQUFDLElBQTFCLENBQStCLEtBQS9CLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLFNBQVMsQ0FBQyxhQUFqQixDQUErQixDQUFDLFFBQWhDLENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sU0FBUyxDQUFDLFFBQWpCLENBQTBCLENBQUMsUUFBM0IsQ0FBQSxDQUhBLENBQUE7QUFBQSxRQUlBLE1BQUEsQ0FBTyxTQUFTLENBQUMsdUJBQWpCLENBQXlDLENBQUMsUUFBMUMsQ0FBQSxDQUpBLENBQUE7QUFBQSxRQUtBLE1BQUEsQ0FBTyxTQUFTLENBQUMsZ0JBQWpCLENBQWtDLENBQUMsUUFBbkMsQ0FBQSxDQUxBLENBQUE7QUFBQSxRQU1BLE1BQUEsQ0FBTyxTQUFTLENBQUMsYUFBakIsQ0FBK0IsQ0FBQyxRQUFoQyxDQUFBLENBTkEsQ0FBQTtlQU9BLE1BQUEsQ0FBTyxTQUFTLENBQUMsbUJBQWpCLENBQXFDLENBQUMsUUFBdEMsQ0FBQSxFQVI0QztNQUFBLENBQTlDLENBWEEsQ0FBQTtBQUFBLE1BcUJBLEVBQUEsQ0FBRyw2REFBSCxFQUFrRSxTQUFBLEdBQUE7QUFDaEUsWUFBQSwrQkFBQTtBQUFBO0FBQUE7YUFBQSw0Q0FBQTsyQkFBQTtBQUNFLHdCQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBMEIsMkJBQTFCLENBQVAsQ0FDRSxDQUFDLEdBQUcsQ0FBQyxPQURQLENBQUEsRUFBQSxDQURGO0FBQUE7d0JBRGdFO01BQUEsQ0FBbEUsQ0FyQkEsQ0FBQTthQTBCQSxFQUFBLENBQUcsK0RBQUgsRUFBb0UsU0FBQSxHQUFBO0FBQ2xFLFlBQUEsK0JBQUE7QUFBQTtBQUFBO2FBQUEsNENBQUE7MkJBQUE7QUFDRSxVQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBd0IsaUJBQXhCLENBQVAsQ0FBa0QsQ0FBQyxJQUFuRCxDQUF3RCxLQUF4RCxDQUFBLENBQUE7QUFBQSx3QkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQXdCLGNBQXhCLENBQVAsQ0FBK0MsQ0FBQyxJQUFoRCxDQUFxRCxLQUFyRCxFQURBLENBREY7QUFBQTt3QkFEa0U7TUFBQSxDQUFwRSxFQTNCMkI7SUFBQSxDQUE3QixDQTVFQSxDQUFBO0FBQUEsSUE0R0EscUJBQUEsR0FBd0IsU0FBQyxZQUFELEVBQWUsYUFBZixHQUFBO0FBQ3RCLFVBQUEseUJBQUE7QUFBQSxNQUFBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsWUFBVixFQUF3QixhQUF4QixFQUF1QyxTQUF2QyxDQUFwQixDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsU0FBTCxDQUFlLE1BQWYsQ0FBVixFQUFrQyxNQUFsQyxDQURULENBQUE7QUFBQSxNQUVBLEVBQUUsQ0FBQyxRQUFILENBQVksaUJBQVosRUFBK0IsTUFBL0IsQ0FGQSxDQUFBO0FBR0EsYUFBTyxJQUFJLENBQUMsT0FBTCxDQUFhLE1BQWIsRUFBcUIsSUFBckIsQ0FBUCxDQUpzQjtJQUFBLENBNUd4QixDQUFBO1dBa0hBLG9CQUFBLEdBQXVCLFNBQUMsU0FBRCxHQUFBO0FBQ3JCLFVBQUEsc0JBQUE7QUFBQSxNQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF1QixDQUFDLE1BQS9CLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsU0FBUyxDQUFDLE1BQXRELENBQUEsQ0FBQTtBQUNBO0FBQUEsV0FBQSw0Q0FBQTswQkFBQTtBQUNFLFFBQUEsTUFBQSxDQUFPLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEtBQWxCLENBQVAsQ0FBK0IsQ0FBQyxlQUFoQyxDQUFnRCxDQUFBLENBQWhELENBQUEsQ0FERjtBQUFBLE9BREE7YUFHQSxNQUFBLENBQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUF0QixDQUE2QixDQUFDLElBQTlCLENBQW1DLFNBQVMsQ0FBQyxNQUE3QyxFQUpxQjtJQUFBLEVBbkhLO0VBQUEsQ0FBOUIsQ0FWQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/vagrant/.atom/packages/tree-view-git-status/spec/tree-view-git-status-spec.coffee
