(function() {
  var Emitter, Govet, Subscriber, path, spawn, _, _ref;

  spawn = require('child_process').spawn;

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = Govet = (function() {
    Subscriber.includeInto(Govet);

    Emitter.includeInto(Govet);

    function Govet(dispatch) {
      this.dispatch = dispatch;
      atom.commands.add('atom-workspace', {
        'golang:govet': (function(_this) {
          return function() {
            return _this.checkCurrentBuffer();
          };
        })(this)
      });
      this.name = 'vet';
    }

    Govet.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Govet.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Govet.prototype.checkCurrentBuffer = function() {
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

    Govet.prototype.checkBuffer = function(editor, saving, callback) {
      var args, buffer, cmd, cwd, done, env, go, gopath, message;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (saving && !atom.config.get('go-plus.vetOnSave')) {
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
      args = this.dispatch.splicersplitter.splitAndSquashToArray(' ', atom.config.get('go-plus.vetArgs'));
      args = _.union(args, [buffer.getPath()]);
      cmd = this.dispatch.goexecutable.current().vet();
      if (cmd === false) {
        message = {
          line: false,
          column: false,
          msg: 'Vet Tool Missing',
          type: 'error',
          source: this.name
        };
        callback(null, [message]);
        return;
      }
      done = (function(_this) {
        return function(exitcode, stdout, stderr, messages) {
          if ((stdout != null) && stdout.trim() !== '') {
            console.log(_this.name + ' - stdout: ' + stdout);
          }
          if ((stderr != null) && stderr.trim() !== '') {
            messages = _this.mapMessages(stderr, cwd);
          }
          _this.emit(_this.name + '-complete', editor, saving);
          return callback(null, messages);
        };
      })(this);
      return this.dispatch.executor.exec(cmd, cwd, env, done, args);
    };

    Govet.prototype.mapMessages = function(data, cwd) {
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
                source: 'vet'
              };
            default:
              return {
                file: file,
                line: matchLine[2],
                column: false,
                msg: matchLine[5],
                type: 'warning',
                source: 'vet'
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

    return Govet;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nb3ZldC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0RBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxlQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsT0FBd0IsT0FBQSxDQUFRLFVBQVIsQ0FBeEIsRUFBQyxrQkFBQSxVQUFELEVBQWEsZUFBQSxPQURiLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixLQUF2QixDQUFBLENBQUE7O0FBQUEsSUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixLQUFwQixDQURBLENBQUE7O0FBR2EsSUFBQSxlQUFDLFFBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUFaLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsa0JBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEI7T0FERixDQURBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FIUixDQURXO0lBQUEsQ0FIYjs7QUFBQSxvQkFTQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsV0FBRCxDQUFBLENB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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/govet.coffee
