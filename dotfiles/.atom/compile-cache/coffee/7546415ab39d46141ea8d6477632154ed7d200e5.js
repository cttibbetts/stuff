(function() {
  var AtomConfig, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require('underscore-plus');

  AtomConfig = require('./util/atomconfig');

  describe('lint', function() {
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
    return describe('when lint on save is enabled', function() {
      beforeEach(function() {
        return atom.config.set('go-plus.lintOnSave', true);
      });
      it('displays errors for missing documentation', function() {
        var done;
        done = false;
        runs(function() {
          buffer.setText('package main\n\nimport "fmt"\n\ntype T int\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\ntype T int\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0].column).toBe('6');
            expect(dispatch.messages[0].line).toBe('5');
            expect(dispatch.messages[0].msg).toBe('exported type T should have comment or be unexported');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      return it('allows lint args to be specified', function() {
        var done;
        done = false;
        runs(function() {
          atom.config.set('go-plus.golintArgs', '-min_confidence=0.8');
          buffer.setText('package main\n\nimport "fmt"\n\ntype T int\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\ntype T int\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0].column).toBe('6');
            expect(dispatch.messages[0].line).toBe('5');
            expect(dispatch.messages[0].msg).toBe('exported type T should have comment or be unexported');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvZ29saW50LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FGUCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUhKLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLG1CQUFSLENBSmIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFNBQUEsR0FBQTtBQUNmLFFBQUEsb0RBQUE7QUFBQSxJQUFBLE9BQW1ELEVBQW5ELEVBQUMsb0JBQUQsRUFBYSxnQkFBYixFQUFxQixrQkFBckIsRUFBK0IsZ0JBQS9CLEVBQXVDLGtCQUF2QyxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxxQkFBQTtBQUFBLE1BQUEsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBQSxDQUFqQixDQUFBO0FBQUEsTUFDQSxVQUFVLENBQUMsd0JBQVgsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxJQUFJLENBQUMsU0FBTCxDQUFBLENBRlosQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLFNBQXRCLENBSEEsQ0FBQTtBQUFBLE1BSUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixZQUFyQixDQUpYLENBQUE7QUFB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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/spec/golint-spec.coffee
