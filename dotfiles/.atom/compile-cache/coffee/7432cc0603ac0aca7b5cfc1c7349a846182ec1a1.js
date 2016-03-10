(function() {
  var Point, Subscriber, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require("underscore-plus");

  Subscriber = require('emissary').Subscriber;

  Point = require('atom').Point;

  describe("godef", function() {
    var bufferTextOffset, bufferTextPos, cursorToOffset, cursorToText, dispatch, editor, editorView, filePath, godefDone, mainModule, offsetCursorPos, testDisposables, testText, triggerCommand, waitsForCommand, waitsForDispatchComplete, waitsForGodef, waitsForGodefReturn, workspaceElement, _ref;
    _ref = [], mainModule = _ref[0], editor = _ref[1], editorView = _ref[2], dispatch = _ref[3], filePath = _ref[4], workspaceElement = _ref[5];
    testDisposables = [];
    testText = "package main\nimport \"fmt\"\nvar testvar = \"stringy\"\n\nfunc f(){\n  localVar := \" says 世界中の世界中の!\"\n  fmt.Println( testvar + localVar )}";
    beforeEach(function() {
      var directory;
      atom.config.set("go-plus.formatOnSave", false);
      atom.config.set("go-plus.lintOnSave", false);
      atom.config.set("go-plus.vetOnSave", false);
      atom.config.set("go-plus.syntaxCheckOnSave", false);
      atom.config.set("go-plus.runCoverageOnSave", false);
      directory = temp.mkdirSync();
      atom.project.setPaths(directory);
      filePath = path.join(directory, 'go-plus-testing.go');
      fs.writeFileSync(filePath, '');
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      jasmine.unspy(window, 'setTimeout');
      waitsForPromise(function() {
        return atom.workspace.open(filePath).then(function(e) {
          editor = e;
          return editorView = atom.views.getView(editor);
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
    triggerCommand = function(command) {
      return atom.commands.dispatch(workspaceElement, dispatch.godef[command]);
    };
    godefDone = function() {
      return new Promise(function(resolve, reject) {
        testDisposables.push(dispatch.godef.onDidComplete(resolve));
      });
    };
    bufferTextOffset = function(text, count, delta) {
      var buffer, i, index, _i;
      if (count == null) {
        count = 1;
      }
      if (delta == null) {
        delta = 0;
      }
      buffer = editor.getText();
      index = -1;
      for (i = _i = 1; 1 <= count ? _i <= count : _i >= count; i = 1 <= count ? ++_i : --_i) {
        index = buffer.indexOf(text, (index === -1 ? 0 : index + text.length));
        if (index === -1) {
          break;
        }
      }
      if (index === -1) {
        return index;
      }
      return index + delta;
    };
    offsetCursorPos = function(offset) {
      if (offset < 0) {
        return;
      }
      return editor.getBuffer().positionForCharacterIndex(offset);
    };
    bufferTextPos = function(text, count, delta) {
      if (count == null) {
        count = 1;
      }
      if (delta == null) {
        delta = 0;
      }
      return offsetCursorPos(bufferTextOffset(text, count, delta));
    };
    cursorToOffset = function(offset) {
      if (offset === -1) {
        return;
      }
      editor.setCursorBufferPosition(offsetCursorPos(offset));
    };
    cursorToText = function(text, count, delta) {
      if (count == null) {
        count = 1;
      }
      if (delta == null) {
        delta = 0;
      }
      return cursorToOffset(bufferTextOffset(text, count, delta));
    };
    afterEach(function() {
      var disposable, _i, _len;
      for (_i = 0, _len = testDisposables.length; _i < _len; _i++) {
        disposable = testDisposables[_i];
        disposable.dispose();
      }
      return testDisposables = [];
    });
    waitsForCommand = function(command) {
      var godefPromise;
      godefPromise = void 0;
      runs(function() {
        godefPromise = godefDone();
        return triggerCommand(command);
      });
      waitsForPromise(function() {
        return godefPromise;
      });
    };
    waitsForGodef = function() {
      return waitsForCommand('godefCommand');
    };
    waitsForGodefReturn = function() {
      return waitsForCommand('returnCommand');
    };
    waitsForDispatchComplete = function(action) {
      var dispatchComplete;
      dispatchComplete = false;
      runs(function() {
        return dispatch.once('dispatch-complete', function() {
          return dispatchComplete = true;
        });
      });
      runs(action);
      return waitsFor(function() {
        return dispatchComplete;
      });
    };
    describe("wordAtCursor (| represents cursor pos)", function() {
      var godef;
      godef = null;
      beforeEach(function() {
        godef = dispatch.godef;
        godef.editor = editor;
        return editor.setText("foo foo.bar bar");
      });
      it("should return foo for |foo", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 0]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('foo');
        return expect(range).toEqual([[0, 0], [0, 3]]);
      });
      it("should return foo for fo|o", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 2]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('foo');
        return expect(range).toEqual([[0, 0], [0, 3]]);
      });
      it("should return no word for foo| foo", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 3]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('foo');
        return expect(range).toEqual([[0, 0], [0, 3]]);
      });
      it("should return bar for |bar", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 12]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('bar');
        return expect(range).toEqual([[0, 12], [0, 15]]);
      });
      it("should return foo.bar for !foo.bar", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 4]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('foo.bar');
        return expect(range).toEqual([[0, 4], [0, 11]]);
      });
      return it("should return foo.bar for foo.ba|r", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 10]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('foo.bar');
        return expect(range).toEqual([[0, 4], [0, 11]]);
      });
    });
    describe("when go-plus is loaded", function() {
      return it("should have registered the golang:godef command", function() {
        var cmd, currentCommands, godefCommand;
        currentCommands = atom.commands.findCommands({
          target: editorView
        });
        godefCommand = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = currentCommands.length; _i < _len; _i++) {
            cmd = currentCommands[_i];
            if (cmd.name === dispatch.godef.godefCommand) {
              _results.push(cmd);
            }
          }
          return _results;
        })();
        return expect(godefCommand.length).toEqual(1);
      });
    });
    describe("when godef command is invoked", function() {
      describe("if there is more than one cursor", function() {
        return it("displays a warning message", function() {
          waitsForDispatchComplete(function() {
            editor.setText(testText);
            return editor.save();
          });
          runs(function() {
            editor.setCursorBufferPosition([0, 0]);
            return editor.addCursorAtBufferPosition([1, 0]);
          });
          waitsForGodef();
          return runs(function() {
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            return expect(dispatch.messages[0].type).toBe("warning");
          });
        });
      });
      describe("with no word under the cursor", function() {
        return it("displays a warning message", function() {
          editor.setCursorBufferPosition([0, 0]);
          waitsForGodef();
          return runs(function() {
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            return expect(dispatch.messages[0].type).toBe("warning");
          });
        });
      });
      return describe("with a word under the cursor", function() {
        beforeEach(function() {
          return waitsForDispatchComplete(function() {
            editor.setText(testText);
            return editor.save();
          });
        });
        describe("defined within the current file", function() {
          beforeEach(function() {
            cursorToText("testvar", 2);
            return waitsForGodef();
          });
          it("should move the cursor to the definition", function() {
            return runs(function() {
              return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("testvar", 1));
            });
          });
          return it("should create a highlight decoration of the correct class", function() {
            return runs(function() {
              var d, goPlusHighlightDecs, higlightClass;
              higlightClass = 'definition';
              goPlusHighlightDecs = (function() {
                var _i, _len, _ref1, _results;
                _ref1 = editor.getHighlightDecorations();
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  d = _ref1[_i];
                  if (d.getProperties()['class'] === higlightClass) {
                    _results.push(d);
                  }
                }
                return _results;
              })();
              return expect(goPlusHighlightDecs.length).toBe(1);
            });
          });
        });
        describe("defined outside the current file", function() {
          return it("should open a new text editor", function() {
            runs(function() {
              return cursorToText("fmt.Println", 1, "fmt.".length);
            });
            waitsForGodef();
            return runs(function() {
              var currentEditor;
              currentEditor = atom.workspace.getActiveTextEditor();
              return expect(currentEditor.getTitle()).toBe('print.go');
            });
          });
        });
        describe("defined as a local variable", function() {
          return it("should jump to the local var definition", function() {
            runs(function() {
              return cursorToText("localVar", 2);
            });
            waitsForGodef();
            return runs(function() {
              return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 1));
            });
          });
        });
        describe("defined as a local import prefix", function() {
          return it("should jump to the import", function() {
            runs(function() {
              return cursorToText("fmt.Println");
            });
            waitsForGodef();
            return runs(function() {
              return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("\"fmt\""));
            });
          });
        });
        return describe("an import statement", function() {
          return it("should open the first (lexicographical) .go file in the imported package", function() {
            runs(function() {
              return cursorToText("\"fmt\"");
            });
            waitsForGodef();
            return runs(function() {
              var activeEditor, file;
              activeEditor = atom.workspace.getActiveTextEditor();
              file = activeEditor.getURI();
              expect(path.basename(file)).toEqual("doc.go");
              return expect(path.basename(path.dirname(file))).toEqual("fmt");
            });
          });
        });
      });
    });
    return describe("when godef-return command is invoked", function() {
      beforeEach(function() {
        return waitsForDispatchComplete(function() {
          editor.setText(testText);
          return editor.save();
        });
      });
      it("will return across files to the location where godef was invoked", function() {
        runs(function() {
          return cursorToText("fmt.Println", 1, "fmt.".length);
        });
        waitsForGodef();
        runs(function() {
          var activeEditor;
          activeEditor = atom.workspace.getActiveTextEditor();
          return expect(path.basename(activeEditor.getURI())).toEqual("print.go");
        });
        waitsForGodefReturn();
        return runs(function() {
          expect(atom.workspace.getActiveTextEditor()).toBe(editor);
          return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("fmt.Println", 1, "fmt.".length));
        });
      });
      it("will return within the same file to the location where godef was invoked", function() {
        runs(function() {
          return cursorToText("localVar", 2);
        });
        waitsForGodef();
        runs(function() {
          return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 1));
        });
        waitsForGodefReturn();
        return runs(function() {
          return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 2));
        });
      });
      return it('will do nothing if the return stack is empty', function() {
        runs(function() {
          dispatch.godef.clearReturnHistory();
          return cursorToText("localVar", 2);
        });
        waitsForGodefReturn();
        return runs(function() {
          return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 2));
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvZ29kZWYtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0NBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUZQLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFTLGlCQUFULENBSEosQ0FBQTs7QUFBQSxFQUlDLGFBQWMsT0FBQSxDQUFRLFVBQVIsRUFBZCxVQUpELENBQUE7O0FBQUEsRUFLQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FMRCxDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLFFBQUEsK1JBQUE7QUFBQSxJQUFBLE9BQXlFLEVBQXpFLEVBQUMsb0JBQUQsRUFBYSxnQkFBYixFQUFxQixvQkFBckIsRUFBaUMsa0JBQWpDLEVBQTJDLGtCQUEzQyxFQUFxRCwwQkFBckQsQ0FBQTtBQUFBLElBQ0EsZUFBQSxHQUFrQixFQURsQixDQUFBO0FBQUEsSUFFQSxRQUFBLEdBQVcsK0lBRlgsQ0FBQTtBQUFBLElBV0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUVULFVBQUEsU0FBQTtBQUFBLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixFQUF3QyxLQUF4QyxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsRUFBc0MsS0FBdEMsQ0FEQSxDQUFBO0FBQUEs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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/spec/godef-spec.coffee
