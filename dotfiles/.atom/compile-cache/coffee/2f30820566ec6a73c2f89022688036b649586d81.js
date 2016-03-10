(function() {
  var MinimapSelectionView;

  MinimapSelectionView = require('./minimap-selection-view');

  module.exports = {
    active: false,
    views: {},
    config: {
      highlightCursorsLines: {
        type: 'boolean',
        "default": false,
        description: 'When true, the lines with cursors are highlighted in the minimap.'
      }
    },
    activate: function() {},
    consumeMinimapServiceV1: function(minimap) {
      this.minimap = minimap;
      return this.minimap.registerPlugin('selection', this);
    },
    deactivate: function() {
      this.minimap.unregisterPlugin('selection');
      return this.minimap = null;
    },
    isActive: function() {
      return this.active;
    },
    activatePlugin: function() {
      if (this.active) {
        return;
      }
      this.active = true;
      return this.subscription = this.minimap.observeMinimaps((function(_this) {
        return function(o) {
          var disposable, minimap, selectionView, _ref;
          minimap = (_ref = o.view) != null ? _ref : o;
          selectionView = new MinimapSelectionView(minimap);
          _this.views[minimap.id] = selectionView;
          return disposable = minimap.onDidDestroy(function() {
            selectionView.destroy();
            delete _this.views[minimap.id];
            return disposable.dispose();
          });
        };
      })(this));
    },
    deactivatePlugin: function() {
      var id, view, _ref;
      if (!this.active) {
        return;
      }
      _ref = this.views;
      for (id in _ref) {
        view = _ref[id];
        view.destroy();
      }
      this.active = false;
      this.views = {};
      return this.subscription.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9taW5pbWFwLXNlbGVjdGlvbi9saWIvbWluaW1hcC1zZWxlY3Rpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9CQUFBOztBQUFBLEVBQUEsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLDBCQUFSLENBQXZCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxNQUFBLEVBQVEsS0FBUjtBQUFBLElBQ0EsS0FBQSxFQUFPLEVBRFA7QUFBQSxJQUdBLE1BQUEsRUFDRTtBQUFBLE1BQUEscUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsbUVBRmI7T0FERjtLQUpGO0FBQUEsSUFTQSxRQUFBLEVBQVUsU0FBQSxHQUFBLENBVFY7QUFBQSxJQVdBLHVCQUFBLEVBQXlCLFNBQUUsT0FBRixHQUFBO0FBQ3ZCLE1BRHdCLElBQUMsQ0FBQSxVQUFBLE9BQ3pCLENBQUE7YUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsSUFBckMsRUFEdUI7SUFBQSxDQVh6QjtBQUFBLElBY0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBVCxDQUEwQixXQUExQixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBRkQ7SUFBQSxDQWRaO0FBQUEsSUFrQkEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxPQUFKO0lBQUEsQ0FsQlY7QUFBQSxJQW9CQSxjQUFBLEVBQWdCLFNBQUEsR0FBQTtBQUNkLE1BQUEsSUFBVSxJQUFDLENBQUEsTUFBWDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBRFYsQ0FBQTthQUdBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsZUFBVCxDQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7QUFDdkMsY0FBQSx3Q0FBQTtBQUFBLFVBQUEsT0FBQSxvQ0FBbUIsQ0FBbkIsQ0FBQTtBQUFBLFVBQ0EsYUFBQSxHQUFvQixJQUFBLG9CQUFBLENBQXFCLE9BQXJCLENBRHBCLENBQUE7QUFBQSxVQUdBLEtBQUMsQ0FBQSxLQUFNLENBQUEsT0FBTyxDQUFDLEVBQVIsQ0FBUCxHQUFxQixhQUhyQixDQUFBO2lCQUtBLFVBQUEsR0FBYSxPQUFPLENBQUMsWUFBUixDQUFxQixTQUFBLEdBQUE7QUFDaEMsWUFBQSxhQUFhLENBQUMsT0FBZCxDQUFBLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxDQUFBLEtBQVEsQ0FBQSxLQUFNLENBQUEsT0FBTyxDQUFDLEVBQVIsQ0FEZCxDQUFBO21CQUVBLFVBQVUsQ0FBQyxPQUFYLENBQUEsRUFIZ0M7VUFBQSxDQUFyQixFQU4wQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCLEVBSkY7SUFBQSxDQXBCaEI7QUFBQSxJQW1DQSxnQkFBQSxFQUFrQixTQUFBLEdBQUE7QUFDaEIsVUFBQSxjQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLE1BQWY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUNBO0FBQUEsV0FBQSxVQUFBO3dCQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsT0FBTCxDQUFBLENBQUEsQ0FBQTtBQUFBLE9BREE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FGVixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBSFQsQ0FBQTthQUtBLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFBLEVBTmdCO0lBQUEsQ0FuQ2xCO0dBSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/vagrant/.atom/packages/minimap-selection/lib/minimap-selection.coffee
