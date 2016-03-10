(function() {
  var EditorLocationStack, Emitter, Godef, Point, Subscriber, fs, path, _ref,
    __slice = [].slice;

  Point = require('atom').Point;

  _ref = require('emissary'), Emitter = _ref.Emitter, Subscriber = _ref.Subscriber;

  path = require('path');

  fs = require('fs');

  EditorLocationStack = require('./util/editor-location-stack');

  module.exports = Godef = (function() {
    Subscriber.includeInto(Godef);

    Emitter.includeInto(Godef);

    function Godef(dispatch) {
      this.dispatch = dispatch;
      this.godefCommand = "golang:godef";
      this.returnCommand = "golang:godef-return";
      this.name = 'def';
      this.didCompleteNotification = "" + this.name + "-complete";
      this.godefLocationStack = new EditorLocationStack();
      atom.commands.add('atom-workspace', {
        "golang:godef": (function(_this) {
          return function() {
            return _this.gotoDefinitionForWordAtCursor();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        "golang:godef-return": (function(_this) {
          return function() {
            return _this.godefReturn();
          };
        })(this)
      });
      this.cursorOnChangeSubscription = null;
    }

    Godef.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Godef.prototype.reset = function(editor) {
      var _ref1;
      this.emit('reset', this.editor);
      return (_ref1 = this.cursorOnChangeSubscription) != null ? _ref1.dispose() : void 0;
    };

    Godef.prototype.clearReturnHistory = function() {
      return this.godefLocationStack.reset();
    };

    Godef.prototype.onDidComplete = function(callback) {
      return this.on(this.didCompleteNotification, callback);
    };

    Godef.prototype.godefReturn = function() {
      return this.godefLocationStack.restorePreviousLocation().then((function(_this) {
        return function() {
          return _this.emitDidComplete();
        };
      })(this));
    };

    Godef.prototype.gotoDefinitionForWordAtCursor = function() {
      var done, editorCursorUTF8Offset, offset, _ref1, _ref2;
      this.editor = typeof atom !== "undefined" && atom !== null ? (_ref1 = atom.workspace) != null ? _ref1.getActiveTextEditor() : void 0 : void 0;
      done = (function(_this) {
        return function(err, messages) {
          var _ref2;
          return (_ref2 = _this.dispatch) != null ? _ref2.resetAndDisplayMessages(_this.editor, messages) : void 0;
        };
      })(this);
      if (!((_ref2 = this.dispatch) != null ? _ref2.isValidEditor(this.editor) : void 0)) {
        this.emitDidComplete();
        return;
      }
      if (this.editor.hasMultipleCursors()) {
        this.bailWithWarning('Godef only works with a single cursor', done);
        return;
      }
      editorCursorUTF8Offset = function(e) {
        var characterOffset, text;
        characterOffset = e.getBuffer().characterIndexForPosition(e.getCursorBufferPosition());
        text = e.getText().substring(0, characterOffset);
        return Buffer.byteLength(text, "utf8");
      };
      offset = editorCursorUTF8Offset(this.editor);
      this.reset(this.editor);
      return this.gotoDefinitionWithParameters(['-o', offset, '-i'], this.editor.getText(), done);
    };

    Godef.prototype.gotoDefinitionForWord = function(word, callback) {
      if (callback == null) {
        callback = function() {
          return void 0;
        };
      }
      return this.gotoDefinitionWithParameters([word], void 0, callback);
    };

    Godef.prototype.gotoDefinitionWithParameters = function(cmdArgs, cmdInput, callback) {
      var args, cmd, cwd, done, env, filePath, go, gopath, message;
      if (cmdInput == null) {
        cmdInput = void 0;
      }
      if (callback == null) {
        callback = function() {
          return void 0;
        };
      }
      message = null;
      done = (function(_this) {
        return function(exitcode, stdout, stderr, messages) {
          if (exitcode !== 0) {
            _this.bailWithWarning(stderr, callback);
            return;
          }
          return _this.visitLocation(_this.parseGodefLocation(stdout), callback);
        };
      })(this);
      go = this.dispatch.goexecutable.current();
      cmd = go.godef();
      if (cmd === false) {
        this.bailWithError('Godef Tool Missing', callback);
        return;
      }
      gopath = go.buildgopath();
      if ((gopath == null) || gopath === '') {
        this.bailWithError('GOPATH is Missing', callback);
        return;
      }
      env = this.dispatch.env();
      env['GOPATH'] = gopath;
      filePath = this.editor.getPath();
      cwd = path.dirname(filePath);
      args = ['-f', filePath].concat(__slice.call(cmdArgs));
      return this.dispatch.executor.exec(cmd, cwd, env, done, args, cmdInput);
    };

    Godef.prototype.parseGodefLocation = function(godefStdout) {
      var colNumber, outputs, p, rowNumber, targetFilePath, targetFilePathSegments, _i;
      outputs = godefStdout.trim().split(':');
      targetFilePathSegments = 3 <= outputs.length ? __slice.call(outputs, 0, _i = outputs.length - 2) : (_i = 0, []), rowNumber = outputs[_i++], colNumber = outputs[_i++];
      targetFilePath = targetFilePathSegments.join(':');
      if (targetFilePath.length === 0 && rowNumber) {
        targetFilePath = [rowNumber, colNumber].filter(function(x) {
          return x;
        }).join(':');
        rowNumber = colNumber = void 0;
      }
      p = function(rawPosition) {
        return parseInt(rawPosition, 10) - 1;
      };
      return {
        filepath: targetFilePath,
        pos: (rowNumber != null) && (colNumber != null) ? new Point(p(rowNumber), p(colNumber)) : void 0,
        raw: godefStdout
      };
    };

    Godef.prototype.visitLocation = function(loc, callback) {
      if (!loc.filepath) {
        this.bailWithWarning("godef returned malformed output: " + (JSON.stringify(loc.raw)), callback);
        return;
      }
      return fs.stat(loc.filepath, (function(_this) {
        return function(err, stats) {
          if (err) {
            _this.bailWithWarning("godef returned invalid file path: \"" + loc.filepath + "\"", callback);
            return;
          }
          _this.godefLocationStack.pushCurrentLocation();
          if (stats.isDirectory()) {
            return _this.visitDirectory(loc, callback);
          } else {
            return _this.visitFile(loc, callback);
          }
        };
      })(this));
    };

    Godef.prototype.visitFile = function(loc, callback) {
      return atom.workspace.open(loc.filepath).then((function(_this) {
        return function(editor) {
          _this.editor = editor;
          if (loc.pos) {
            _this.editor.scrollToBufferPosition(loc.pos);
            _this.editor.setCursorBufferPosition(loc.pos);
            _this.cursorOnChangeSubscription = _this.highlightWordAtCursor(atom.workspace.getActiveTextEditor());
          }
          _this.emitDidComplete();
          return callback(null, []);
        };
      })(this));
    };

    Godef.prototype.visitDirectory = function(loc, callback) {
      var failure, success;
      success = (function(_this) {
        return function(goFile) {
          return _this.visitFile({
            filepath: goFile,
            raw: loc.raw
          }, callback);
        };
      })(this);
      failure = (function(_this) {
        return function(err) {
          return _this.bailWithWarning("godef return invalid directory " + loc.filepath + ": " + err, callback);
        };
      })(this);
      return this.findFirstGoFile(loc.filepath).then(success)["catch"](failure);
    };

    Godef.prototype.findFirstGoFile = function(dir) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return fs.readdir(dir, function(err, files) {
            var goFilePath;
            if (err) {
              reject(err);
            }
            goFilePath = _this.firstGoFilePath(dir, files.sort());
            if (goFilePath) {
              return resolve(goFilePath);
            } else {
              return reject("" + dir + " has no non-test .go file");
            }
          });
        };
      })(this));
    };

    Godef.prototype.firstGoFilePath = function(dir, files) {
      var file, isGoSourceFile, _i, _len;
      isGoSourceFile = function(file) {
        return file.endsWith('.go') && file.indexOf('_test') === -1;
      };
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        if (isGoSourceFile(file)) {
          return path.join(dir, file);
        }
      }
    };

    Godef.prototype.emitDidComplete = function() {
      return this.emit(this.didCompleteNotification, this.editor, false);
    };

    Godef.prototype.bailWithWarning = function(warning, callback) {
      return this.bailWithMessage('warning', warning, callback);
    };

    Godef.prototype.bailWithError = function(error, callback) {
      return this.bailWithMessage('error', error, callback);
    };

    Godef.prototype.bailWithMessage = function(type, msg, callback) {
      var message;
      message = {
        line: false,
        column: false,
        msg: msg,
        type: type,
        source: this.name
      };
      callback(null, [message]);
      return this.emitDidComplete();
    };

    Godef.prototype.wordAtCursor = function(editor) {
      var cursor, options, range, word;
      if (editor == null) {
        editor = this.editor;
      }
      options = {
        wordRegex: /[\w+\.]*/
      };
      cursor = editor.getLastCursor();
      range = cursor.getCurrentWordBufferRange(options);
      word = this.editor.getTextInBufferRange(range);
      return {
        word: word,
        range: range
      };
    };

    Godef.prototype.highlightWordAtCursor = function(editor) {
      var cursor, decoration, marker, range, word, _ref1;
      if (editor == null) {
        editor = this.editor;
      }
      _ref1 = this.wordAtCursor(editor), word = _ref1.word, range = _ref1.range;
      marker = editor.markBufferRange(range, {
        invalidate: 'inside'
      });
      decoration = editor.decorateMarker(marker, {
        type: 'highlight',
        "class": 'definition'
      });
      cursor = editor.getLastCursor();
      return cursor.onDidChangePosition(function() {
        return marker.destroy();
      });
    };

    return Godef;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nb2RlZi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0VBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxPQUF3QixPQUFBLENBQVEsVUFBUixDQUF4QixFQUFDLGVBQUEsT0FBRCxFQUFVLGtCQUFBLFVBRFYsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBS0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLDhCQUFSLENBTHRCLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixLQUF2QixDQUFBLENBQUE7O0FBQUEsSUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixLQUFwQixDQURBLENBQUE7O0FBR2EsSUFBQSxlQUFFLFFBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFdBQUEsUUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsWUFBRCxHQUFnQixjQUFoQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixxQkFEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUQsR0FBUSxLQUZSLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSx1QkFBRCxHQUEyQixFQUFBLEdBQUcsSUFBQyxDQUFBLElBQUosR0FBUyxXQUhwQyxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsa0JBQUQsR0FBMEIsSUFBQSxtQkFBQSxDQUFBLENBSjFCLENBQUE7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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/godef.coffee
