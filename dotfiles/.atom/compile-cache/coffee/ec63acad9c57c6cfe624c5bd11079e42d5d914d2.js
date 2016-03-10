(function() {
  var Emitter, Gofmt, Subscriber, path, spawn, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  spawn = require('child_process').spawn;

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = Gofmt = (function() {
    Subscriber.includeInto(Gofmt);

    Emitter.includeInto(Gofmt);

    function Gofmt(dispatch) {
      this.mapMessages = __bind(this.mapMessages, this);
      atom.commands.add('atom-workspace', {
        'golang:gofmt': (function(_this) {
          return function() {
            return _this.formatCurrentBuffer();
          };
        })(this)
      });
      this.dispatch = dispatch;
      this.name = 'fmt';
    }

    Gofmt.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Gofmt.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Gofmt.prototype.formatCurrentBuffer = function() {
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
      return this.formatBuffer(editor, false, done);
    };

    Gofmt.prototype.formatBuffer = function(editor, saving, callback) {
      var args, buffer, cmd, configArgs, cwd, env, go, gopath, message, messages, stderr, stdout, _ref1;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (saving && !atom.config.get('go-plus.formatOnSave')) {
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
      cwd = path.dirname(buffer.getPath());
      args = ['-w'];
      configArgs = this.dispatch.splicersplitter.splitAndSquashToArray(' ', atom.config.get('go-plus.formatArgs'));
      if ((configArgs != null) && _.size(configArgs) > 0) {
        args = _.union(args, configArgs);
      }
      args = _.union(args, [buffer.getPath()]);
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
      cmd = go.format();
      if (cmd === false) {
        message = {
          line: false,
          column: false,
          msg: 'Format Tool Missing',
          type: 'error',
          source: this.name
        };
        callback(null, [message]);
        return;
      }
      _ref1 = this.dispatch.executor.execSync(cmd, cwd, env, args), stdout = _ref1.stdout, stderr = _ref1.stderr, messages = _ref1.messages;
      if ((stdout != null) && stdout.trim() !== '') {
        console.log(this.name + ' - stdout: ' + stdout);
      }
      if ((stderr != null) && stderr.trim() !== '') {
        messages = this.mapMessages(stderr, cwd);
      }
      this.emit(this.name + '-complete', editor, saving);
      return callback(null, messages);
    };

    Gofmt.prototype.mapMessages = function(data, cwd) {
      var extract, match, messages, pattern;
      pattern = /^(.*?):(\d*?):((\d*?):)?\s(.*)$/img;
      messages = [];
      if (!((data != null) && data !== '')) {
        return messages;
      }
      extract = (function(_this) {
        return function(matchLine) {
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
                  type: 'error',
                  source: this.name
                };
              default:
                return {
                  file: file,
                  line: matchLine[2],
                  column: false,
                  msg: matchLine[5],
                  type: 'error',
                  source: this.name
                };
            }
          }).call(_this);
          return messages.push(message);
        };
      })(this);
      while (true) {
        match = pattern.exec(data);
        extract(match);
        if (match == null) {
          break;
        }
      }
      return messages;
    };

    return Gofmt;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nb2ZtdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0RBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLGVBQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxPQUF3QixPQUFBLENBQVEsVUFBUixDQUF4QixFQUFDLGtCQUFBLFVBQUQsRUFBYSxlQUFBLE9BRGIsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLEtBQXZCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLEtBQXBCLENBREEsQ0FBQTs7QUFHYSxJQUFBLGVBQUMsUUFBRCxHQUFBO0FBQ1gsdURBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNFO0FBQUEsUUFBQSxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtPQURGLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUZaLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FIUixDQURXO0lBQUEsQ0FIYjs7QUFBQSxvQkFTQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1As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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/gofmt.coffee
