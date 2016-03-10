(function() {
  var AtomConfig, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require('underscore-plus');

  AtomConfig = require('./util/atomconfig');

  describe('vet', function() {
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
    describe('when vet on save is enabled', function() {
      beforeEach(function() {
        return atom.config.set('go-plus.vetOnSave', true);
      });
      it('displays errors for unreachable code', function() {
        var done;
        done = false;
        runs(function() {
          buffer.setText('package main\n\nimport "fmt"\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0]).toBeDefined();
            expect(dispatch.messages[0].column).toBe(false);
            expect(dispatch.messages[0].line).toBe('7');
            expect(dispatch.messages[0].msg).toBe('unreachable code');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      return it('allows vet args to be specified', function() {
        var done;
        done = false;
        runs(function() {
          atom.config.set('go-plus.vetArgs', '-unreachable=true');
          buffer.setText('package main\n\nimport "fmt"\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0]).toBeDefined();
            expect(dispatch.messages[0].column).toBe(false);
            expect(dispatch.messages[0].line).toBe('7');
            expect(dispatch.messages[0].msg).toBe('unreachable code');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
    return describe('when vet on save and format on save are enabled', function() {
      beforeEach(function() {
        atom.config.set('go-plus.formatOnSave', true);
        return atom.config.set('go-plus.vetOnSave', true);
      });
      return it('formats the file and displays errors for unreachable code', function() {
        var done;
        done = false;
        runs(function() {
          buffer.setText('package main\n\nimport "fmt"\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\nfunc main() {\n\treturn\n\tfmt.Println("Unreachable...")\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0]).toBeDefined();
            expect(dispatch.messages[0].column).toBe(false);
            expect(dispatch.messages[0].line).toBe('7');
            expect(dispatch.messages[0].msg).toBe('unreachable code');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvZ292ZXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkJBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUZQLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsbUJBQVIsQ0FKYixDQUFBOztBQUFBLEVBTUEsUUFBQSxDQUFTLEtBQVQsRUFBZ0IsU0FBQSxHQUFBO0FBQ2QsUUFBQSxvREFBQTtBQUFBLElBQUEsT0FBbUQsRUFBbkQsRUFBQyxvQkFBRCxFQUFhLGdCQUFiLEVBQXFCLGtCQUFyQixFQUErQixnQkFBL0IsRUFBdUMsa0JBQXZDLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLHFCQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFBLENBQWpCLENBQUE7QUFBQSxNQUNBLFVBQVUsQ0FBQyx3QkFBWCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFZLElBQUksQ0FBQyxTQUFMLENBQUEsQ0FGWixDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsU0FBdEIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFlBQXJCLENBSlgsQ0FBQTtBQUFB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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/spec/govet-spec.coffee
