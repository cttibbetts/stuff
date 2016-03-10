(function() {
  var AtomConfig, fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  AtomConfig = require('./util/atomconfig');

  describe('Go Plus', function() {
    var buffer, dispatch, editor, filePath, mainModule, _ref;
    _ref = [], mainModule = _ref[0], editor = _ref[1], dispatch = _ref[2], buffer = _ref[3], filePath = _ref[4];
    beforeEach(function() {
      var atomconfig, directory;
      atomconfig = new AtomConfig();
      atomconfig.allfunctionalitydisabled();
      directory = temp.mkdirSync();
      atom.project.setPaths(directory);
      filePath = path.join(directory, 'go-plus.go');
      fs.writeFileSync(filePath, '');
      jasmine.unspy(window, 'setTimeout');
      waitsForPromise(function() {
        return atom.workspace.open(filePath).then(function(e) {
          editor = e;
          return buffer = editor.getBuffer();
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-go');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('go-plus').then(function(g) {
          return mainModule = g.mainModule;
        });
      });
      waitsFor(function() {
        var _ref1;
        return (_ref1 = mainModule.dispatch) != null ? _ref1.ready : void 0;
      });
      return runs(function() {
        return dispatch = mainModule.dispatch;
      });
    });
    return describe('when the editor is destroyed', function() {
      beforeEach(function() {
        atom.config.set('go-plus.formatOnSave', true);
        return editor.destroy();
      });
      return it('unsubscribes from the buffer', function() {
        var done;
        editor.destroy();
        done = false;
        runs(function() {
          var bufferSubscription;
          buffer.setText('package main\n\nfunc main()  {\n}\n');
          expect(editor.getGrammar().scopeName).toBe('source.go');
          bufferSubscription = buffer.onDidSave(function() {
            if (bufferSubscription != null) {
              bufferSubscription.dispose();
            }
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main()  {\n}\n');
            return done = true;
          });
          buffer.save();
          return expect(buffer.getText()).toBe('package main\n\nfunc main()  {\n}\n');
        });
        waits(function() {
          return 500;
        });
        runs(function() {
          return expect(fs.readFileSync(filePath, {
            encoding: 'utf8'
          })).toBe('package main\n\nfunc main()  {\n}\n');
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvZ29wbHVzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FGUCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxtQkFBUixDQUhiLENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsUUFBQSxvREFBQTtBQUFBLElBQUEsT0FBbUQsRUFBbkQsRUFBQyxvQkFBRCxFQUFhLGdCQUFiLEVBQXFCLGtCQUFyQixFQUErQixnQkFBL0IsRUFBdUMsa0JBQXZDLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLHFCQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFBLENBQWpCLENBQUE7QUFBQSxNQUNBLFVBQVUsQ0FBQyx3QkFBWCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFZLElBQUksQ0FBQyxTQUFMLENBQUEsQ0FGWixDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsU0FBdEIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFlBQXJCLENBSlgsQ0FBQTtBQUFBLE1BS0EsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsUUFBakIsRUFBMkIsRUFBM0Is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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/spec/goplus-spec.coffee
