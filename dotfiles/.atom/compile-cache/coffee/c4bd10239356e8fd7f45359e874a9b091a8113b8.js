(function() {
  var Emitter, Golint, Subscriber, path, spawn, _, _ref;

  spawn = require('child_process').spawn;

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = Golint = (function() {
    Subscriber.includeInto(Golint);

    Emitter.includeInto(Golint);

    function Golint(dispatch) {
      atom.commands.add('atom-workspace', {
        'golang:golint': (function(_this) {
          return function() {
            return _this.checkCurrentBuffer();
          };
        })(this)
      });
      this.dispatch = dispatch;
      this.name = 'lint';
    }

    Golint.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Golint.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Golint.prototype.checkCurrentBuffer = function() {
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

    Golint.prototype.checkBuffer = function(editor, saving, callback) {
      var args, buffer, cmd, configArgs, cwd, done, env, go, gopath, message;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (saving && !atom.config.get('go-plus.lintOnSave')) {
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
      env = this.dispatch.env();
      env['GOPATH'] = gopath;
      cwd = path.dirname(buffer.getPath());
      args = [buffer.getPath()];
      configArgs = this.dispatch.splicersplitter.splitAndSquashToArray(' ', atom.config.get('go-plus.golintArgs'));
      if ((configArgs != null) && _.size(configArgs) > 0) {
        args = _.union(configArgs, args);
      }
      cmd = this.dispatch.goexecutable.current().golint();
      if (cmd === false) {
        message = {
          line: false,
          column: false,
          msg: 'Lint Tool Missing',
          type: 'error',
          source: this.name
        };
        callback(null, [message]);
        return;
      }
      done = (function(_this) {
        return function(exitcode, stdout, stderr, messages) {
          if ((stderr != null) && stderr.trim() !== '') {
            console.log(_this.name + ' - stderr: ' + stderr);
          }
          if ((stdout != null) && stdout.trim() !== '') {
            messages = _this.mapMessages(stdout, cwd);
          }
          _this.emit(_this.name + '-complete', editor, saving);
          return callback(null, messages);
        };
      })(this);
      return this.dispatch.executor.exec(cmd, cwd, env, done, args);
    };

    Golint.prototype.mapMessages = function(data, cwd) {
      var extract, match, messages, pattern;
      pattern = /^(.*?):(\d*?):((\d*?):)?\s(.*)$/img;
      messages = [];
      extract = function(matchLine) {
        var file, message;
        if (matchLine == null) {
          return;
        }
        file = (matchLine[1] != null) && matchLine[1] !== '' ? matchLine[1] : null;
        message = (function() {
          switch (false) {
            case matchLine[4] == null:
              return {
                file: file,
                line: matchLine[2],
                column: matchLine[4],
                msg: matchLine[5],
                type: 'warning',
                source: 'lint'
              };
            default:
              return {
                file: file,
                line: matchLine[2],
                column: false,
                msg: matchLine[5],
                type: 'warning',
                source: 'lint'
              };
          }
        })();
        return messages.push(message);
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

    return Golint;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nb2xpbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsZUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQXdCLE9BQUEsQ0FBUSxVQUFSLENBQXhCLEVBQUMsa0JBQUEsVUFBRCxFQUFhLGVBQUEsT0FEYixDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsTUFBdkIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsTUFBcEIsQ0FEQSxDQUFBOztBQUdhLElBQUEsZ0JBQUMsUUFBRCxHQUFBO0FBQ1gsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7QUFBQSxRQUFBLGVBQUEsRUFBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGtCQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCO09BREYsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBRlosQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUQsR0FBUSxNQUhSLENBRFc7SUFBQSxDQUhiOztBQUFBLHFCQVNBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxXQUFELENBQUEs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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/golint.coffee
