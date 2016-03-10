(function() {
  var AtomConfig, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require('underscore-plus');

  AtomConfig = require('./util/atomconfig');

  describe('gopath', function() {
    var directory, dispatch, editor, filePath, mainModule, oldGoPath, _ref;
    _ref = [], mainModule = _ref[0], editor = _ref[1], dispatch = _ref[2], directory = _ref[3], filePath = _ref[4], oldGoPath = _ref[5];
    beforeEach(function() {
      var atomconfig;
      atomconfig = new AtomConfig();
      atomconfig.allfunctionalitydisabled();
      directory = temp.mkdirSync();
      oldGoPath = process.env.GOPATH;
      process.env['GOPATH'] = directory;
      atom.project.setPaths(directory);
      return jasmine.unspy(window, 'setTimeout');
    });
    afterEach(function() {
      return process.env['GOPATH'] = oldGoPath;
    });
    describe('when syntax check on save is enabled and goPath is set', function() {
      beforeEach(function() {
        atom.config.set('go-plus.goPath', directory);
        atom.config.set('go-plus.syntaxCheckOnSave', true);
        filePath = path.join(directory, 'wrongsrc', 'github.com', 'testuser', 'example', 'go-plus.go');
        fs.writeFileSync(filePath, '');
        waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function(e) {
            return editor = e;
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
      it("displays a warning for a GOPATH without 'src' directory", function() {
        var done;
        done = false;
        runs(function() {
          var buffer;
          fs.unlinkSync(filePath);
          buffer = editor.getBuffer();
          buffer.setText('package main\n\nfunc main() {\n\treturn\n}\n');
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3, _ref4;
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n\treturn\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe(false);
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('Warning: GOPATH [' + directory + '] does not contain a "src" directory - please review http://golang.org/doc/code.html#Workspaces');
            expect((_ref4 = dispatch.messages[0]) != null ? _ref4.type : void 0).toBe('warning');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      return it('displays a warning for a non-existent GOPATH', function() {
        var done;
        done = false;
        runs(function() {
          var buffer;
          dispatch.goexecutable.current().gopath = path.join(directory, 'nonexistent');
          fs.unlinkSync(filePath);
          buffer = editor.getBuffer();
          buffer.setText('package main\n\nfunc main() {\n\treturn\n}\n');
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3, _ref4;
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n\treturn\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe(false);
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('Warning: GOPATH [' + path.join(directory, 'nonexistent') + '] does not exist');
            expect((_ref4 = dispatch.messages[0]) != null ? _ref4.type : void 0).toBe('warning');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
    return describe('when syntax check on save is enabled and GOPATH is not set', function() {
      beforeEach(function() {
        atom.config.set('go-plus.goPath', '');
        atom.config.set('go-plus.syntaxCheckOnSave', true);
        filePath = path.join(directory, 'wrongsrc', 'github.com', 'testuser', 'example', 'go-plus.go');
        fs.writeFileSync(filePath, '');
        waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function(e) {
            return editor = e;
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
      return it('displays warnings for an unset GOPATH', function() {
        var done;
        done = false;
        runs(function() {
          var buffer;
          dispatch.goexecutable.current().env['GOPATH'] = '';
          dispatch.goexecutable.current().gopath = '';
          fs.unlinkSync(filePath);
          buffer = editor.getBuffer();
          buffer.setText('package main\n\nfunc main() {\n\treturn\n}\n');
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3, _ref4;
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n\treturn\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe(false);
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('Warning: GOPATH is not set – either set the GOPATH environment variable or define the Go Path in go-plus package preferences');
            expect((_ref4 = dispatch.messages[0]) != null ? _ref4.type : void 0).toBe('warning');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvZ29wYXRoLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FGUCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUhKLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLG1CQUFSLENBSmIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtBQUNqQixRQUFBLGtFQUFBO0FBQUEsSUFBQSxPQUFpRSxFQUFqRSxFQUFDLG9CQUFELEVBQWEsZ0JBQWIsRUFBcUIsa0JBQXJCLEVBQStCLG1CQUEvQixFQUEwQyxrQkFBMUMsRUFBb0QsbUJBQXBELENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQUEsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsVUFBVSxDQUFDLHdCQUFYLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksSUFBSSxDQUFDLFNBQUwsQ0FBQSxDQUZaLENBQUE7QUFBQSxNQUdBLFNBQUEsR0FBWSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BSHhCLENBQUE7QUFBQSxNQUlBLE9BQU8sQ0FBQyxHQUFJLENBQUEsUUFBQSxDQUFaLEdBQXdCLFNBSnhCLENBQUE7QUFBQSxN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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/spec/gopath-spec.coffee
