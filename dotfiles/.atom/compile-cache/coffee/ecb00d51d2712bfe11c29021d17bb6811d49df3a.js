(function() {
  var EditorLocationStack, doneAlready;

  doneAlready = function() {
    return new Promise(function(resolve, reject) {
      return resolve();
    });
  };

  module.exports = EditorLocationStack = (function() {
    function EditorLocationStack(maxSize) {
      this.maxSize = maxSize != null ? maxSize : 500;
      if (this.maxSize < 1) {
        this.maxSize = 1;
      }
      this.stack = [];
    }

    EditorLocationStack.prototype.isEmpty = function() {
      return !this.stack.length;
    };

    EditorLocationStack.prototype.reset = function() {
      return this.stack = [];
    };

    EditorLocationStack.prototype.pushCurrentLocation = function() {
      var editor, loc, _ref, _ref1;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      loc = {
        position: editor.getCursorBufferPosition(),
        file: editor.getURI()
      };
      if (!(loc.file && ((_ref = loc.position) != null ? _ref.row : void 0) && ((_ref1 = loc.position) != null ? _ref1.column : void 0))) {
        return;
      }
      this.push(loc);
    };

    EditorLocationStack.prototype.restorePreviousLocation = function() {
      var lastLocation;
      if (this.isEmpty()) {
        return doneAlready();
      }
      lastLocation = this.stack.pop();
      return atom.workspace.open(lastLocation.file).then((function(_this) {
        return function(editor) {
          return _this.moveEditorCursorTo(editor, lastLocation.position);
        };
      })(this));
    };

    EditorLocationStack.prototype.moveEditorCursorTo = function(editor, pos) {
      if (!editor) {
        return;
      }
      editor.scrollToBufferPosition(pos);
      editor.setCursorBufferPosition(pos);
    };

    EditorLocationStack.prototype.push = function(loc) {
      this.stack.push(loc);
      if (this.stack.length > this.maxSize) {
        this.stack.splice(0, this.stack.length - this.maxSize);
      }
    };

    return EditorLocationStack;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi91dGlsL2VkaXRvci1sb2NhdGlvbi1zdGFjay5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsU0FBQSxHQUFBO1dBQ1IsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO2FBQ1YsT0FBQSxDQUFBLEVBRFU7SUFBQSxDQUFSLEVBRFE7RUFBQSxDQUFkLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ1MsSUFBQSw2QkFBRSxPQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSw0QkFBQSxVQUFVLEdBQ3ZCLENBQUE7QUFBQSxNQUFBLElBQWdCLElBQUMsQ0FBQSxPQUFELEdBQVcsQ0FBM0I7QUFBQSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsQ0FBWCxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFEVCxDQURXO0lBQUEsQ0FBYjs7QUFBQSxrQ0FJQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsQ0FBQSxJQUFLLENBQUEsS0FBSyxDQUFDLE9BREo7SUFBQSxDQUpULENBQUE7O0FBQUEsa0NBT0EsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxLQUFELEdBQVMsR0FESjtJQUFBLENBUFAsQ0FBQTs7QUFBQSxrQ0FVQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7QUFDbkIsVUFBQSx3QkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxNQUFBO0FBQUEsY0FBQSxDQUFBO09BREE7QUFBQSxNQUVBLEdBQUEsR0FDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVY7QUFBQSxRQUNBLElBQUEsRUFBTSxNQUFNLENBQUMsTUFBUCxDQUFBLENBRE47T0FIRixDQUFBO0FBS0EsTUFBQSxJQUFBLENBQUEsQ0FBYyxHQUFHLENBQUMsSUFBSix5Q0FBeUIsQ0FBRSxhQUEzQiwyQ0FBK0MsQ0FBRSxnQkFBL0QsQ0FBQTtBQUFBLGNBQUEsQ0FBQTtPQUxBO0FBQUEsTUFNQSxJQUFDLENBQUEsSUFBRCxDQUFNLEdBQU4sQ0FOQSxDQURtQjtJQUFBLENBVnJCLENBQUE7O0FBQUEsa0NBc0JBLHVCQUFBLEdBQXlCLFNBQUEsR0FBQTtBQUN2QixVQUFBLFlBQUE7QUFBQSxNQUFBLElBQXdCLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBeEI7QUFBQSxlQUFPLFdBQUEsQ0FBQSxDQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFlLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFBLENBRGYsQ0FBQTthQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFZLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQzFDLEtBQUMsQ0FBQSxrQkFBRCxDQUFvQixNQUFwQixFQUE0QixZQUFZLENBQUMsUUFBekMsRUFEMEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QyxFQUh1QjtJQUFBLENBdEJ6QixDQUFBOztBQUFBLGtDQTRCQSxrQkFBQSxHQUFvQixTQUFDLE1BQUQsRUFBUyxHQUFULEdBQUE7QUFDbEIsTUFBQSxJQUFBLENBQUEsTUFBQTtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsR0FBOUIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsR0FBL0IsQ0FGQSxDQURrQjtJQUFBLENBNUJwQixDQUFBOztBQUFBLGtDQWtDQSxJQUFBLEdBQU0sU0FBQyxHQUFELEdBQUE7QUFDSixNQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLEdBQVosQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUE4QyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsR0FBZ0IsSUFBQyxDQUFBLE9BQS9EO0FBQUEsUUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxHQUFnQixJQUFDLENBQUEsT0FBbEMsQ0FBQSxDQUFBO09BRkk7SUFBQSxDQWxDTixDQUFBOzsrQkFBQTs7TUFOSixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/util/editor-location-stack.coffee
