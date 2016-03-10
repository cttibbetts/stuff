(function() {
  var CompositeDisposable, MinimapSelectionView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  module.exports = MinimapSelectionView = (function() {
    MinimapSelectionView.prototype.decorations = [];

    function MinimapSelectionView(minimap) {
      var editor;
      this.minimap = minimap;
      this.handleSelection = __bind(this.handleSelection, this);
      editor = this.minimap.getTextEditor();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(editor.onDidAddCursor(this.handleSelection));
      this.subscriptions.add(editor.onDidChangeCursorPosition(this.handleSelection));
      this.subscriptions.add(editor.onDidRemoveCursor(this.handleSelection));
      this.handleSelection();
    }

    MinimapSelectionView.prototype.destroy = function() {
      this.removeDecorations();
      this.subscriptions.dispose();
      return this.minimap = null;
    };

    MinimapSelectionView.prototype.handleSelection = function() {
      var decoration, selection, textEditor, _i, _len, _ref, _results;
      this.removeDecorations();
      textEditor = this.minimap.getTextEditor();
      if ((textEditor.selections == null) || textEditor.selections.length === 0) {
        return;
      }
      _ref = textEditor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        if (!selection.isEmpty()) {
          decoration = this.minimap.decorateMarker(selection.marker, {
            type: 'highlight-under',
            scope: '.minimap .minimap-selection .region',
            plugin: 'selection'
          });
          if (decoration != null) {
            _results.push(this.decorations.push(decoration));
          } else {
            _results.push(void 0);
          }
        } else if (atom.config.get('minimap-selection.highlightCursorsLines')) {
          decoration = this.minimap.decorateMarker(selection.marker, {
            type: 'line',
            scope: '.minimap .minimap-selection .cursor-line',
            plugin: 'selection'
          });
          if (decoration != null) {
            _results.push(this.decorations.push(decoration));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    MinimapSelectionView.prototype.removeDecorations = function() {
      var decoration, _i, _len, _ref;
      if (this.decorations.length === 0) {
        return;
      }
      _ref = this.decorations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        decoration = _ref[_i];
        if (decoration != null) {
          decoration.destroy();
        }
      }
      return this.decorations = [];
    };

    return MinimapSelectionView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9taW5pbWFwLXNlbGVjdGlvbi9saWIvbWluaW1hcC1zZWxlY3Rpb24tdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG1DQUFBLFdBQUEsR0FBYSxFQUFiLENBQUE7O0FBRWEsSUFBQSw4QkFBRSxPQUFGLEdBQUE7QUFDWCxVQUFBLE1BQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFGakIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE1BQU0sQ0FBQyxjQUFQLENBQXNCLElBQUMsQ0FBQSxlQUF2QixDQUFuQixDQUpBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixNQUFNLENBQUMseUJBQVAsQ0FBaUMsSUFBQyxDQUFBLGVBQWxDLENBQW5CLENBTEEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixJQUFDLENBQUEsZUFBMUIsQ0FBbkIsQ0FOQSxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsZUFBRCxDQUFBLENBUkEsQ0FEVztJQUFBLENBRmI7O0FBQUEsbUNBYUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBSEo7SUFBQSxDQWJULENBQUE7O0FBQUEsbUNBa0JBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSwyREFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxVQUFBLEdBQWEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUEsQ0FGYixDQUFBO0FBR0EsTUFBQSxJQUFXLCtCQUFELElBQTJCLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBdEIsS0FBZ0MsQ0FBckU7QUFBQSxjQUFBLENBQUE7T0FIQTtBQUtBO0FBQUE7V0FBQSwyQ0FBQTs2QkFBQTtBQUNFLFFBQUEsSUFBRyxDQUFBLFNBQWEsQ0FBQyxPQUFWLENBQUEsQ0FBUDtBQUNFLFVBQUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsY0FBVCxDQUF3QixTQUFTLENBQUMsTUFBbEMsRUFBMEM7QUFBQSxZQUFBLElBQUEsRUFBTSxpQkFBTjtBQUFBLFlBQXlCLEtBQUEsRUFBTyxxQ0FBaEM7QUFBQSxZQUF1RSxNQUFBLEVBQVEsV0FBL0U7V0FBMUMsQ0FBYixDQUFBO0FBQ0EsVUFBQSxJQUFnQyxrQkFBaEM7MEJBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFVBQWxCLEdBQUE7V0FBQSxNQUFBO2tDQUFBO1dBRkY7U0FBQSxNQUdLLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlDQUFoQixDQUFIO0FBQ0gsVUFBQSxVQUFBLEdBQWEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxjQUFULENBQXdCLFNBQVMsQ0FBQyxNQUFsQyxFQUEwQztBQUFBLFlBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxZQUFjLEtBQUEsRUFBTywwQ0FBckI7QUFBQSxZQUFpRSxNQUFBLEVBQVEsV0FBekU7V0FBMUMsQ0FBYixDQUFBO0FBQ0EsVUFBQSxJQUFnQyxrQkFBaEM7MEJBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFVBQWxCLEdBQUE7V0FBQSxNQUFBO2tDQUFBO1dBRkc7U0FBQSxNQUFBO2dDQUFBO1NBSlA7QUFBQTtzQkFOZTtJQUFBLENBbEJqQixDQUFBOztBQUFBLG1DQWlDQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSwwQkFBQTtBQUFBLE1BQUEsSUFBVSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsS0FBdUIsQ0FBakM7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUNBO0FBQUEsV0FBQSwyQ0FBQTs4QkFBQTs7VUFBQSxVQUFVLENBQUUsT0FBWixDQUFBO1NBQUE7QUFBQSxPQURBO2FBRUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUhFO0lBQUEsQ0FqQ25CLENBQUE7O2dDQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/vagrant/.atom/packages/minimap-selection/lib/minimap-selection-view.coffee
