(function() {
  var MinimapSelection;

  MinimapSelection = require('../lib/minimap-selection');

  describe("MinimapSelection", function() {
    var editor, minimap, minimapModule, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], editor = _ref[1], minimap = _ref[2], minimapModule = _ref[3];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.workspace.open('sample.coffee');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('minimap').then(function(pkg) {
          return minimapModule = pkg.mainModule;
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('minimap-selection');
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        minimap = minimapModule.minimapForEditor(editor);
        spyOn(minimap, 'decorateMarker').andCallThrough();
        return spyOn(minimap, 'removeDecoration').andCallThrough();
      });
    });
    return describe('when a selection is made in the text editor', function() {
      beforeEach(function() {
        return editor.setSelectedBufferRange([[1, 0], [2, 10]]);
      });
      it('adds a decoration for the selection in the minimap', function() {
        return expect(minimap.decorateMarker).toHaveBeenCalled();
      });
      return describe('and then removed', function() {
        beforeEach(function() {
          return editor.setSelectedBufferRange([[0, 0], [0, 0]]);
        });
        return it('removes the previously added decoration', function() {
          return expect(minimap.removeDecoration).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9taW5pbWFwLXNlbGVjdGlvbi9zcGVjL21pbmltYXAtc2VsZWN0aW9uLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDBCQUFSLENBQW5CLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsc0RBQUE7QUFBQSxJQUFBLE9BQXFELEVBQXJELEVBQUMsMEJBQUQsRUFBbUIsZ0JBQW5CLEVBQTJCLGlCQUEzQixFQUFvQyx1QkFBcEMsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO0FBQUEsTUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixlQUFwQixFQUFIO01BQUEsQ0FBaEIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixTQUE5QixDQUF3QyxDQUFDLElBQXpDLENBQThDLFNBQUMsR0FBRCxHQUFBO2lCQUMvRCxhQUFBLEdBQWdCLEdBQUcsQ0FBQyxXQUQyQztRQUFBLENBQTlDLEVBQUg7TUFBQSxDQUFoQixDQUhBLENBQUE7QUFBQSxNQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLG1CQUE5QixFQUFIO01BQUEsQ0FBaEIsQ0FOQSxDQUFBO2FBUUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxRQUNBLE9BQUEsR0FBVSxhQUFhLENBQUMsZ0JBQWQsQ0FBK0IsTUFBL0IsQ0FEVixDQUFBO0FBQUEsUUFHQSxLQUFBLENBQU0sT0FBTixFQUFlLGdCQUFmLENBQWdDLENBQUMsY0FBakMsQ0FBQSxDQUhBLENBQUE7ZUFJQSxLQUFBLENBQU0sT0FBTixFQUFlLGtCQUFmLENBQWtDLENBQUMsY0FBbkMsQ0FBQSxFQUxHO01BQUEsQ0FBTCxFQVRTO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FrQkEsUUFBQSxDQUFTLDZDQUFULEVBQXdELFNBQUEsR0FBQTtBQUN0RCxNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBUSxDQUFDLENBQUQsRUFBRyxFQUFILENBQVIsQ0FBOUIsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFHQSxFQUFBLENBQUcsb0RBQUgsRUFBeUQsU0FBQSxHQUFBO2VBQ3ZELE1BQUEsQ0FBTyxPQUFPLENBQUMsY0FBZixDQUE4QixDQUFDLGdCQUEvQixDQUFBLEVBRHVEO01BQUEsQ0FBekQsQ0FIQSxDQUFBO2FBTUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQVEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFSLENBQTlCLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUdBLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBLEdBQUE7aUJBQzVDLE1BQUEsQ0FBTyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsQ0FBQyxnQkFBakMsQ0FBQSxFQUQ0QztRQUFBLENBQTlDLEVBSjJCO01BQUEsQ0FBN0IsRUFQc0Q7SUFBQSxDQUF4RCxFQW5CMkI7RUFBQSxDQUE3QixDQVBBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/vagrant/.atom/packages/minimap-selection/spec/minimap-selection-spec.coffee
