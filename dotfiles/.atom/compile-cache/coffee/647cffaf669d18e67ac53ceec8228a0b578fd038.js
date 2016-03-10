(function() {
  var TreeViewGitStatusTooltip, path;

  path = require('path');

  module.exports = TreeViewGitStatusTooltip = (function() {
    TreeViewGitStatusTooltip.prototype.tooltip = null;

    TreeViewGitStatusTooltip.prototype.root = null;

    TreeViewGitStatusTooltip.prototype.repo = null;

    TreeViewGitStatusTooltip.prototype.mouseEnterSubscription = null;

    function TreeViewGitStatusTooltip(root, repo) {
      this.root = root;
      this.repo = repo;
      root.header.addEventListener('mouseenter', (function(_this) {
        return function() {
          return _this.onMouseEnter();
        };
      })(this));
      this.mouseEnterSubscription = {
        dispose: (function(_this) {
          return function() {
            _this.root.header.removeEventListener('mouseenter', function() {
              return _this.onMouseEnter();
            });
            return _this.mouseEnterSubscription = null;
          };
        })(this)
      };
    }

    TreeViewGitStatusTooltip.prototype.destruct = function() {
      var repo, root, tooltip, _ref;
      this.destroyTooltip();
      if ((_ref = this.mouseEnterSubscription) != null) {
        _ref.dispose();
      }
      tooltip = null;
      root = null;
      return repo = null;
    };

    TreeViewGitStatusTooltip.prototype.destroyTooltip = function() {
      var _ref;
      return (_ref = this.tooltip) != null ? _ref.dispose() : void 0;
    };

    TreeViewGitStatusTooltip.prototype.generateTooltipContent = function() {
      var branch, container, item, itemElem, itemsContainer, originURL, titleElem, titlesContainer, tooltipItems, workingDir, _base, _base1, _i, _len, _ref, _ref1, _ref2;
      tooltipItems = [];
      branch = (_ref = this.repo.branch) != null ? _ref : null;
      originURL = (_ref1 = typeof (_base = this.repo).getOriginURL === "function" ? _base.getOriginURL() : void 0) != null ? _ref1 : null;
      workingDir = (_ref2 = typeof (_base1 = this.repo).getWorkingDirectory === "function" ? _base1.getWorkingDirectory() : void 0) != null ? _ref2 : null;
      if (branch != null) {
        tooltipItems.push({
          'title': 'Head',
          'content': branch
        });
      }
      if (originURL != null) {
        tooltipItems.push({
          'title': 'Origin',
          'content': originURL
        });
      }
      if (workingDir != null) {
        tooltipItems.push({
          'title': 'Path',
          'content': this.shortenPath(path.normalize(workingDir))
        });
      }
      container = document.createElement('div');
      container.classList.add('git-status-tooltip');
      titlesContainer = document.createElement('div');
      titlesContainer.classList.add('titles-container');
      itemsContainer = document.createElement('div');
      itemsContainer.classList.add('items-container');
      for (_i = 0, _len = tooltipItems.length; _i < _len; _i++) {
        item = tooltipItems[_i];
        titleElem = document.createElement('span');
        titleElem.classList.add('title');
        titleElem.innerText = item.title;
        titlesContainer.appendChild(titleElem);
        if (typeof item.content === 'string') {
          itemElem = document.createElement('span');
          itemElem.classList.add('item');
          itemElem.innerText = item.content;
          itemsContainer.appendChild(itemElem);
        } else if (item.content instanceof HTMLElement) {
          itemsContainer.appendChild(item.content);
        }
      }
      container.appendChild(titlesContainer);
      container.appendChild(itemsContainer);
      return container;
    };

    TreeViewGitStatusTooltip.prototype.onMouseEnter = function() {
      var _ref;
      this.destroyTooltip();
      if (((_ref = this.repo) != null ? _ref.repo : void 0) != null) {
        return this.tooltip = atom.tooltips.add(this.root.header, {
          title: this.generateTooltipContent(),
          html: true,
          placement: 'bottom'
        });
      }
    };

    TreeViewGitStatusTooltip.prototype.shortenPath = function(dirPath) {
      var normRootPath, userHome;
      if (process.platform === 'win32') {
        userHome = process.env.USERPROFILE;
      } else {
        userHome = process.env.HOME;
      }
      normRootPath = path.normalize(dirPath);
      if (normRootPath.indexOf(userHome) === 0) {
        return '~' + normRootPath.substring(userHome.length);
      } else {
        return dirPath;
      }
    };

    return TreeViewGitStatusTooltip;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LXN0YXR1cy9saWIvdG9vbHRpcC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsOEJBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsdUNBQUEsT0FBQSxHQUFTLElBQVQsQ0FBQTs7QUFBQSx1Q0FDQSxJQUFBLEdBQU0sSUFETixDQUFBOztBQUFBLHVDQUVBLElBQUEsR0FBTSxJQUZOLENBQUE7O0FBQUEsdUNBR0Esc0JBQUEsR0FBd0IsSUFIeEIsQ0FBQTs7QUFLYSxJQUFBLGtDQUFFLElBQUYsRUFBUyxJQUFULEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxPQUFBLElBQ2IsQ0FBQTtBQUFBLE1BRG1CLElBQUMsQ0FBQSxPQUFBLElBQ3BCLENBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQVosQ0FBNkIsWUFBN0IsRUFBMkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBTSxLQUFDLENBQUEsWUFBRCxDQUFBLEVBQU47UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQyxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQjtBQUFBLFFBQUEsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ2pDLFlBQUEsS0FBQyxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQWIsQ0FBaUMsWUFBakMsRUFBK0MsU0FBQSxHQUFBO3FCQUFNLEtBQUMsQ0FBQSxZQUFELENBQUEsRUFBTjtZQUFBLENBQS9DLENBQUEsQ0FB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

//# sourceURL=/home/vagrant/.atom/packages/tree-view-git-status/lib/tooltip.coffee
