(function() {
  var AtomConfig, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require('underscore-plus');

  AtomConfig = require('./util/atomconfig');

  describe('format', function() {
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
    describe('when format on save is enabled', function() {
      beforeEach(function() {
        return atom.config.set('go-plus.formatOnSave', true);
      });
      it('reformats the file', function() {
        var done;
        done = false;
        runs(function() {
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          buffer.setText('package main\n\nfunc main()  {\n}\n');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('reformats the file after multiple saves', function() {
        var displayDone, done;
        done = false;
        displayDone = false;
        runs(function() {
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          dispatch.once('display-complete', function() {
            return displayDone = true;
          });
          buffer.setText('package main\n\nfunc main()  {\n}\n');
          return buffer.save();
        });
        waitsFor(function() {
          return done === true;
        });
        waitsFor(function() {
          return displayDone === true;
        });
        runs(function() {
          done = false;
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          buffer.setText('package main\n\nfunc main()  {\n}\n');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('collects errors when the input is invalid', function() {
        var done;
        done = false;
        runs(function() {
          dispatch.once('dispatch-complete', function(editor) {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main(!)  {\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0].column).toBe('11');
            expect(dispatch.messages[0].line).toBe('3');
            expect(dispatch.messages[0].msg).toBe('expected type, found \'!\'');
            return done = true;
          });
          buffer.setText('package main\n\nfunc main(!)  {\n}\n');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('uses goimports to reorganize imports if enabled', function() {
        var done;
        done = false;
        runs(function() {
          atom.config.set('go-plus.formatTool', 'goimports');
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, 世界")\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          buffer.setText('package main\n\nfunc main()  {\n\tfmt.Println("Hello, 世界")\n}\n');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      return it('uses goreturns to handle returns if enabled', function() {
        var done;
        done = false;
        runs(function() {
          atom.config.set('go-plus.formatTool', 'goreturns');
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package demo\n\nimport "errors"\n\nfunc F() (string, int, error) {\n\treturn "", 0, errors.New("foo")\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          buffer.setText('package demo\n\nfunc F() (string, int, error)     {\nreturn errors.New("foo") }');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
    return describe('when format on save is disabled', function() {
      beforeEach(function() {
        return atom.config.set('go-plus.formatOnSave', false);
      });
      return it('does not reformat the file', function() {
        var done;
        done = false;
        runs(function() {
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main()  {\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          buffer.setText('package main\n\nfunc main()  {\n}\n');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvZ29mbXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkJBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUZQLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsbUJBQVIsQ0FKYixDQUFBOztBQUFBLEVBTUEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLFFBQUEsb0RBQUE7QUFBQSxJQUFBLE9BQW1ELEVBQW5ELEVBQUMsb0JBQUQsRUFBYSxnQkFBYixFQUFxQixrQkFBckIsRUFBK0IsZ0JBQS9CLEVBQXVDLGtCQUF2QyxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxxQkFBQTtBQUFBLE1BQUEsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBQSxDQUFqQixDQUFBO0FBQUEsTUFDQSxVQUFVLENBQUMsd0JBQVgsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxJQUFJLENBQUMsU0FBTCxDQUFBLENBRlosQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLFNBQXRCLENBSEEsQ0FBQTtBQUFBLE1BSUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixZQUFyQixDQUpYLENBQUE7QUFB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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/spec/gofmt-spec.coffee
