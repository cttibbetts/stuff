(function() {
  var AtomConfig, PathHelper, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require('underscore-plus');

  PathHelper = require('./util/pathhelper');

  AtomConfig = require('./util/atomconfig');

  describe('build', function() {
    var directory, dispatch, editor, filePath, mainModule, oldGoPath, pathhelper, secondEditor, secondFilePath, testEditor, testFilePath, thirdEditor, thirdFilePath, _ref;
    _ref = [], mainModule = _ref[0], editor = _ref[1], dispatch = _ref[2], secondEditor = _ref[3], thirdEditor = _ref[4], testEditor = _ref[5], directory = _ref[6], filePath = _ref[7], secondFilePath = _ref[8], thirdFilePath = _ref[9], testFilePath = _ref[10], oldGoPath = _ref[11], pathhelper = _ref[12];
    beforeEach(function() {
      var atomconfig;
      atomconfig = new AtomConfig();
      pathhelper = new PathHelper();
      atomconfig.allfunctionalitydisabled();
      directory = temp.mkdirSync();
      oldGoPath = process.env.GOPATH;
      if (process.env.GOPATH == null) {
        oldGoPath = pathhelper.home() + path.sep + 'go';
      }
      process.env['GOPATH'] = directory;
      atom.project.setPaths(directory);
      return jasmine.unspy(window, 'setTimeout');
    });
    afterEach(function() {
      return process.env['GOPATH'] = oldGoPath;
    });
    describe('when syntax check on save is enabled', function() {
      var ready;
      ready = false;
      beforeEach(function() {
        atom.config.set('go-plus.goPath', directory);
        atom.config.set('go-plus.syntaxCheckOnSave', true);
        filePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus.go');
        testFilePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus_test.go');
        fs.writeFileSync(filePath, '');
        fs.writeFileSync(testFilePath, '');
        waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function(e) {
            return editor = e;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open(testFilePath).then(function(e) {
            return testEditor = e;
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
      it('displays errors for unused code', function() {
        var done;
        done = false;
        runs(function() {
          var buffer;
          fs.unlinkSync(testFilePath);
          buffer = editor.getBuffer();
          buffer.setText('package main\n\nimport "fmt"\n\nfunc main()  {\n42\nreturn\nfmt.Println("Unreachable...")}\n');
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3;
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\nfunc main()  {\n42\nreturn\nfmt.Println("Unreachable...")}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe('6');
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('42 evaluated but not used');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('displays errors for unused code in a test file', function() {
        var done;
        done = false;
        runs(function() {
          var testBuffer;
          fs.unlinkSync(filePath);
          testBuffer = testEditor.getBuffer();
          testBuffer.setText('package main\n\nimport "testing"\n\nfunc TestExample(t *testing.T) {\n\t42\n\tt.Error("Example Test")\n}');
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3;
            expect(fs.readFileSync(testFilePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "testing"\n\nfunc TestExample(t *testing.T) {\n\t42\n\tt.Error("Example Test")\n}');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe('6');
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('42 evaluated but not used');
            return done = true;
          });
          return testBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('cleans up test file', function() {
        var done;
        done = false;
        runs(function() {
          var go, testBuffer;
          fs.unlinkSync(filePath);
          testBuffer = testEditor.getBuffer();
          testBuffer.setText('package main\n\nimport "testing"\n\nfunc TestExample(t *testing.T) {\n\tt.Error("Example Test")\n}');
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          go = dispatch.goexecutable.current();
          dispatch.once('dispatch-complete', function() {
            expect(fs.existsSync(path.join(directory, 'src', 'github.com', 'testuser', 'example', 'example.test' + go.exe))).toBe(false);
            return done = true;
          });
          return testBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      return it("does not error when a file is saved that is missing the 'package ...' directive", function() {
        var done;
        done = false;
        runs(function() {
          var testBuffer;
          fs.unlinkSync(filePath);
          testBuffer = testEditor.getBuffer();
          testBuffer.setText("");
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            var _ref1;
            expect(fs.readFileSync(testFilePath, {
              encoding: 'utf8'
            })).toBe('');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.msg : void 0).toBe("expected 'package', found 'EOF'");
            return done = true;
          });
          return testBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
    describe('when working with multiple files', function() {
      var buffer, done, secondBuffer, testBuffer, thirdBuffer, _ref1;
      _ref1 = [], buffer = _ref1[0], secondBuffer = _ref1[1], thirdBuffer = _ref1[2], testBuffer = _ref1[3], done = _ref1[4];
      beforeEach(function() {
        buffer = null;
        secondBuffer = null;
        thirdBuffer = null;
        testBuffer = null;
        done = false;
        atom.config.set('go-plus.goPath', directory);
        atom.config.set('go-plus.syntaxCheckOnSave', true);
        filePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus.go');
        secondFilePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'util', 'util.go');
        thirdFilePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'util', 'strings.go');
        testFilePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus_test.go');
        fs.writeFileSync(filePath, '');
        fs.writeFileSync(secondFilePath, '');
        fs.writeFileSync(thirdFilePath, '');
        fs.writeFileSync(testFilePath, '');
        waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function(e) {
            return editor = e;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open(secondFilePath).then(function(e) {
            return secondEditor = e;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open(thirdFilePath).then(function(e) {
            return thirdEditor = e;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open(testFilePath).then(function(e) {
            return testEditor = e;
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
          var _ref2;
          return (_ref2 = mainModule.dispatch) != null ? _ref2.ready : void 0;
        });
        return runs(function() {
          return dispatch = mainModule.dispatch;
        });
      });
      it('does not display errors for dependent functions spread across multiple files in the same package', function() {
        runs(function() {
          fs.unlinkSync(testFilePath);
          buffer = editor.getBuffer();
          secondBuffer = secondEditor.getBuffer();
          thirdBuffer = thirdEditor.getBuffer();
          buffer.setText('package main\n\nimport "fmt"\nimport "github.com/testuser/example/util"\n\nfunc main() {\n\tfmt.Println("Hello, world!")\n\tutil.ProcessString("Hello, world!")\n}');
          secondBuffer.setText('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
          thirdBuffer.setText('package util\n\n// Stringify stringifies text\nfunc Stringify(text string) string {\n\treturn text + "-stringified"\n}');
          buffer.save();
          secondBuffer.save();
          return thirdBuffer.save();
        });
        waitsFor(function() {
          return !buffer.isModified() && !secondBuffer.isModified() && !thirdBuffer.isModified();
        });
        runs(function() {
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(secondFilePath, {
              encoding: 'utf8'
            })).toBe('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          return secondBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('does display errors for errors in dependent functions spread across multiple files in the same package', function() {
        runs(function() {
          fs.unlinkSync(testFilePath);
          buffer = editor.getBuffer();
          secondBuffer = secondEditor.getBuffer();
          thirdBuffer = thirdEditor.getBuffer();
          buffer.setText('package main\n\nimport "fmt"\nimport "github.com/testuser/example/util"\n\nfunc main() {\n\tfmt.Println("Hello, world!")\n\tutil.ProcessString("Hello, world!")\n}');
          secondBuffer.setText('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
          thirdBuffer.setText('package util\n\n// Stringify stringifies text\nfunc Stringify(text string) string {\n\t42\n\treturn text + "-stringified"\n}');
          buffer.save();
          secondBuffer.save();
          return thirdBuffer.save();
        });
        waitsFor(function() {
          return !buffer.isModified() && !secondBuffer.isModified() && !thirdBuffer.isModified();
        });
        runs(function() {
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(secondFilePath, {
              encoding: 'utf8'
            })).toBe('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0].file).toBe(thirdFilePath);
            expect(dispatch.messages[0].line).toBe('5');
            expect(dispatch.messages[0].msg).toBe('42 evaluated but not used');
            expect(dispatch.messages[0].type).toBe('error');
            expect(dispatch.messages[0].column).toBe(false);
            return done = true;
          });
          return secondBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      return it('displays errors for unused code in a file under test', function() {
        runs(function() {
          fs.unlinkSync(filePath);
          secondBuffer = secondEditor.getBuffer();
          thirdBuffer = thirdEditor.getBuffer();
          testBuffer = testEditor.getBuffer();
          secondBuffer.setText('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
          thirdBuffer.setText('package util\n\n// Stringify stringifies text\nfunc Stringify(text string) string {\n\t42\n\treturn text + "-stringified"\n}');
          testBuffer.setText('package util\n\nimport "testing"\nimport "fmt"\n\nfunc TestExample(t *testing.T) {\n\tfmt.Println(Stringify("Testing"))\n}');
          secondBuffer.save();
          thirdBuffer.save();
          return testBuffer.save();
        });
        waitsFor(function() {
          return !secondBuffer.isModified() && !thirdBuffer.isModified() && !testBuffer.isModified();
        });
        runs(function() {
          expect(fs.readFileSync(thirdFilePath, {
            encoding: 'utf8'
          })).toBe('package util\n\n// Stringify stringifies text\nfunc Stringify(text string) string {\n\t42\n\treturn text + "-stringified"\n}');
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(secondFilePath, {
              encoding: 'utf8'
            })).toBe('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
            expect(fs.readFileSync(thirdFilePath, {
              encoding: 'utf8'
            })).toBe('package util\n\n// Stringify stringifies text\nfunc Stringify(text string) string {\n\t42\n\treturn text + "-stringified"\n}');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0].file).toBe(thirdFilePath);
            expect(dispatch.messages[0].line).toBe('5');
            expect(dispatch.messages[0].msg).toBe('42 evaluated but not used');
            expect(dispatch.messages[0].type).toBe('error');
            expect(dispatch.messages[0].column).toBe(false);
            return done = true;
          });
          return testBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
    return describe('when files are opened outside a gopath', function() {
      var otherdirectory, ready;
      otherdirectory = [][0];
      ready = false;
      beforeEach(function() {
        otherdirectory = temp.mkdirSync();
        process.env['GOPATH'] = otherdirectory;
        atom.config.set('go-plus.goPath', otherdirectory);
        atom.config.set('go-plus.syntaxCheckOnSave', true);
        filePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus.go');
        testFilePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus_test.go');
        fs.writeFileSync(filePath, '');
        fs.writeFileSync(testFilePath, '');
        waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function(e) {
            return editor = e;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open(testFilePath).then(function(e) {
            return testEditor = e;
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
      return it('displays warnings about the gopath, but still displays errors', function() {
        var done;
        done = false;
        runs(function() {
          var buffer;
          fs.unlinkSync(testFilePath);
          buffer = editor.getBuffer();
          buffer.setText('package main\n\nimport "fmt"\n\nfunc main()  {\n42\nreturn\nfmt.Println("Unreachable...")}\n');
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\nfunc main()  {\n42\nreturn\nfmt.Println("Unreachable...")}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(2);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe(false);
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('Warning: GOPATH [' + otherdirectory + '] does not contain a "src" directory - please review http://golang.org/doc/code.html#Workspaces');
            expect((_ref4 = dispatch.messages[1]) != null ? _ref4.column : void 0).toBe(false);
            expect((_ref5 = dispatch.messages[1]) != null ? _ref5.file : void 0).toBe(fs.realpathSync(filePath));
            expect((_ref6 = dispatch.messages[1]) != null ? _ref6.line : void 0).toBe('6');
            expect((_ref7 = dispatch.messages[1]) != null ? _ref7.msg : void 0).toBe('42 evaluated but not used');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvZ29idWlsZC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5Q0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBLENBRlAsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FISixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxtQkFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLG1CQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTtBQUNoQixRQUFBLGtLQUFBO0FBQUEsSUFBQSxPQUFpSyxFQUFqSyxFQUFDLG9CQUFELEVBQWEsZ0JBQWIsRUFBcUIsa0JBQXJCLEVBQStCLHNCQUEvQixFQUE2QyxxQkFBN0MsRUFBMEQsb0JBQTFELEVBQXNFLG1CQUF0RSxFQUFpRixrQkFBakYsRUFBMkYsd0JBQTNGLEVBQTJHLHVCQUEzRyxFQUEwSCx1QkFBMUgsRUFBd0ksb0JBQXhJLEVBQW1KLHFCQUFuSixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFBLENBQWpCLENBQUE7QUFBQSxNQUNBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQUEsQ0FEakIsQ0FBQTtBQUFBLE1BRUEsVUFBVSxDQUFD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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/spec/gobuild-spec.coffee
