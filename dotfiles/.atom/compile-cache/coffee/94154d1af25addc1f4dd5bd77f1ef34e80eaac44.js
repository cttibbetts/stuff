(function() {
  var AtomConfig,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = AtomConfig = (function() {
    function AtomConfig() {
      this.allfunctionalitydisabled = __bind(this.allfunctionalitydisabled, this);
    }

    AtomConfig.prototype.defaults = function() {
      atom.config.set('go-plus.environmentOverridesConfiguration', true);
      atom.config.set('go-plus.formatArgs', '-w -e');
      atom.config.set('go-plus.vetArgs', '');
      atom.config.set('go-plus.formatTool', 'goimports');
      atom.config.set('go-plus.goPath', '');
      atom.config.set('go-plus.golintArgs', '');
      atom.config.set('go-plus.showPanel', true);
      return atom.config.set('go-plus.showPanelWhenNoIssuesExist', false);
    };

    AtomConfig.prototype.allfunctionalitydisabled = function() {
      this.defaults();
      atom.config.set('go-plus.syntaxCheckOnSave', false);
      atom.config.set('go-plus.formatOnSave', false);
      atom.config.set('go-plus.formatTool', 'gofmt');
      atom.config.set('go-plus.getMissingTools', false);
      atom.config.set('go-plus.vetOnSave', false);
      atom.config.set('go-plus.lintOnSave', false);
      atom.config.set('go-plus.runCoverageOnSave', false);
      return atom.config.set('autocomplete-plus.enableAutoActivation', false);
    };

    return AtomConfig;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvdXRpbC9hdG9tY29uZmlnLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNOzs7S0FFSjs7QUFBQSx5QkFBQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkNBQWhCLEVBQTZELElBQTdELENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQyxPQUF0QyxDQURBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQkFBaEIsRUFBbUMsRUFBbkMsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDLFdBQXRDLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdCQUFoQixFQUFrQyxFQUFsQyxDQUpBLENBQUE7QUFBQSxNQUtBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsRUFBc0MsRUFBdEMsQ0FMQSxDQUFBO0FBQUEsTUFNQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDLElBQXJDLENBTkEsQ0FBQTthQU9BLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEIsRUFBc0QsS0FBdEQsRUFSUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx5QkFVQSx3QkFBQSxHQUEwQixTQUFBLEdBQUE7QUFDeEIsTUFBQSxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQixFQUE2QyxLQUE3QyxDQURBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsS0FBeEMsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDLE9BQXRDLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQixFQUEyQyxLQUEzQyxDQUpBLENBQUE7QUFBQSxNQUtBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEIsRUFBcUMsS0FBckMsQ0FMQSxDQUFBO0FBQUEsTUFNQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDLEtBQXRDLENBTkEsQ0FBQTtBQUFBLE1BT0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQixFQUE2QyxLQUE3QyxDQVBBLENBQUE7YUFRQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLEVBQTBELEtBQTFELEVBVHdCO0lBQUEsQ0FWMUIsQ0FBQTs7c0JBQUE7O01BSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/vagrant/.atom/packages/go-plus/spec/util/atomconfig.coffee
