(function() {
  var Emitter, Gobuild, Subscriber, fs, glob, path, spawn, temp, _, _ref;

  spawn = require('child_process').spawn;

  fs = require('fs-plus');

  glob = require('glob');

  path = require('path');

  temp = require('temp');

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  module.exports = Gobuild = (function() {
    Subscriber.includeInto(Gobuild);

    Emitter.includeInto(Gobuild);

    function Gobuild(dispatch) {
      this.dispatch = dispatch;
      atom.commands.add('atom-workspace', {
        'golang:gobuild': (function(_this) {
          return function() {
            return _this.checkCurrentBuffer();
          };
        })(this)
      });
      this.name = 'syntaxcheck';
    }

    Gobuild.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Gobuild.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Gobuild.prototype.checkCurrentBuffer = function() {
      var done, editor, _ref1;
      editor = typeof atom !== "undefined" && atom !== null ? (_ref1 = atom.workspace) != null ? _ref1.getActiveTextEditor() : void 0 : void 0;
      if (!this.dispatch.isValidEditor(editor)) {
        return;
      }
      this.reset(editor);
      done = (function(_this) {
        return function(err, messages) {
          return _this.dispatch.resetAndDisplayMessages(editor, messages);
        };
      })(this);
      return this.checkBuffer(editor, false, done);
    };

    Gobuild.prototype.checkBuffer = function(editor, saving, callback) {
      var args, buffer, cmd, cwd, done, env, fileDir, files, go, gopath, match, output, outputPath, pre, splitgopath, testPackage;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (saving && !atom.config.get('go-plus.syntaxCheckOnSave')) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      buffer = editor != null ? editor.getBuffer() : void 0;
      if (buffer == null) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      go = this.dispatch.goexecutable.current();
      if (go == null) {
        callback(null);
        this.dispatch.displayGoInfo(false);
        return;
      }
      gopath = go.buildgopath();
      if ((gopath == null) || gopath === '') {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      splitgopath = go.splitgopath();
      env = this.dispatch.env();
      env['GOPATH'] = gopath;
      cwd = path.dirname(buffer.getPath());
      output = '';
      outputPath = '';
      files = [];
      fileDir = path.dirname(buffer.getPath());
      args = [];
      this.tempDir = temp.mkdirSync();
      if (buffer.getPath().match(/_test.go$/i)) {
        pre = /^\w*package ([\d\w]+){1}\w*$/img;
        match = pre.exec(buffer.getText());
        testPackage = (match != null) && match.length > 0 ? match[1] : '';
        testPackage = testPackage.replace(/_test$/i, '');
        output = testPackage + '.test' + go.exe;
        outputPath = this.tempDir;
        args = ['test', '-copybinary', '-o', outputPath, '-c', '.'];
        files = fs.readdirSync(fileDir);
      } else {
        output = '.go-plus-syntax-check';
        outputPath = path.normalize(path.join(this.tempDir, output + go.exe));
        args = ['build', '-o', outputPath, '.'];
      }
      cmd = go.executable;
      done = (function(_this) {
        return function(exitcode, stdout, stderr, messages) {
          var file, pattern, updatedFiles, _i, _len;
          if ((stdout != null) && stdout.trim() !== '') {
            console.log(_this.name + ' - stdout: ' + stdout);
          }
          if ((stderr != null) && stderr !== '') {
            messages = _this.mapMessages(stderr, cwd, splitgopath);
          }
          if (fs.existsSync(outputPath)) {
            if (fs.lstatSync(outputPath).isDirectory()) {
              fs.rmdirSync(outputPath);
            } else {
              fs.unlinkSync(outputPath);
            }
          }
          updatedFiles = _.difference(fs.readdirSync(fileDir), files);
          if ((updatedFiles != null) && _.size(updatedFiles) > 0) {
            for (_i = 0, _len = updatedFiles.length; _i < _len; _i++) {
              file = updatedFiles[_i];
              if (_.endsWith(file, '.test' + go.exe)) {
                fs.unlinkSync(path.join(fileDir, file));
              }
            }
          }
          pattern = cwd + '/*' + output;
          glob(pattern, {
            mark: false
          }, function(er, files) {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
              file = files[_j];
              _results.push((function(file) {
                return fs.unlinkSync(file);
              })(file));
            }
            return _results;
          });
          _this.emit(_this.name + '-complete', editor, saving);
          return callback(null, messages);
        };
      })(this);
      return this.dispatch.executor.exec(cmd, cwd, env, done, args);
    };

    Gobuild.prototype.mapMessages = function(data, cwd, splitgopath) {
      var extract, match, messages, pattern, pkg;
      pattern = /^((#)\s(.*)?)|((.*?):(\d*?):((\d*?):)?\s((.*)?((\n\t.*)+)?))/img;
      messages = [];
      pkg = '';
      extract = function(matchLine) {
        var file, message;
        if (matchLine == null) {
          return;
        }
        if ((matchLine[2] != null) && matchLine[2] === '#') {

        } else {
          file = null;
          if ((matchLine[5] != null) && matchLine[5] !== '') {
            if (path.isAbsolute(matchLine[5])) {
              file = matchLine[5];
            } else {
              file = path.join(cwd, matchLine[5]);
            }
          }
          message = (function() {
            switch (false) {
              case matchLine[8] == null:
                return {
                  file: file,
                  line: matchLine[6],
                  column: matchLine[8],
                  msg: matchLine[9],
                  type: 'error',
                  source: 'syntaxcheck'
                };
              default:
                return {
                  file: file,
                  line: matchLine[6],
                  column: false,
                  msg: matchLine[9],
                  type: 'error',
                  source: 'syntaxcheck'
                };
            }
          })();
          return messages.push(message);
        }
      };
      while (true) {
        match = pattern.exec(data);
        extract(match);
        if (match == null) {
          break;
        }
      }
      return messages;
    };

    Gobuild.prototype.absolutePathForPackage = function(pkg, splitgopath) {
      var combinedpath, gopath, _i, _len;
      for (_i = 0, _len = splitgopath.length; _i < _len; _i++) {
        gopath = splitgopath[_i];
        combinedpath = path.join(gopath, 'src', pkg);
        if (fs.existsSync(combinedpath)) {
          return fs.realpathSync(combinedpath);
        }
      }
      return null;
    };

    return Gobuild;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nb2J1aWxkLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrRUFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLGVBQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FKUCxDQUFBOztBQUFBLEVBS0EsT0FBd0IsT0FBQSxDQUFRLFVBQVIsQ0FBeEIsRUFBQyxrQkFBQSxVQUFELEVBQWEsZUFBQSxPQUxiLENBQUE7O0FBQUEsRUFNQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBTkosQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLE9BQXZCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQXBCLENBREEsQ0FBQTs7QUFHYSxJQUFBLGlCQUFDLFFBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUFaLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsZ0JBQUEsRUFBa0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGtCQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FB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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/gobuild.coffee
