(function() {
  var Emitter, Gopath, Subscriber, fs, path, _, _ref;

  path = require('path');

  fs = require('fs-plus');

  _ = require('underscore-plus');

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  module.exports = Gopath = (function() {
    Subscriber.includeInto(Gopath);

    Emitter.includeInto(Gopath);

    function Gopath(dispatch) {
      this.dispatch = dispatch;
      this.name = 'gopath';
    }

    Gopath.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Gopath.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Gopath.prototype.check = function(editor, saving, callback) {
      var filepath, found, gopath, gopaths, message, messages, _i, _j, _k, _len, _len1, _len2;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (!atom.config.get('go-plus.syntaxCheckOnSave')) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      gopaths = this.dispatch.goexecutable.current().splitgopath();
      messages = [];
      if (!((gopaths != null) && _.size(gopaths) > 0)) {
        message = {
          line: false,
          column: false,
          msg: 'Warning: GOPATH is not set – either set the GOPATH environment variable or define the Go Path in go-plus package preferences',
          type: 'warning',
          source: 'gopath'
        };
        messages.push(message);
      }
      if ((messages != null) && _.size(messages) === 0) {
        for (_i = 0, _len = gopaths.length; _i < _len; _i++) {
          gopath = gopaths[_i];
          if (!fs.existsSync(gopath)) {
            message = {
              line: false,
              column: false,
              msg: 'Warning: GOPATH [' + gopath + '] does not exist',
              type: 'warning',
              source: 'gopath'
            };
            messages.push(message);
          }
        }
      }
      if ((messages != null) && _.size(messages) === 0) {
        for (_j = 0, _len1 = gopaths.length; _j < _len1; _j++) {
          gopath = gopaths[_j];
          if (!fs.existsSync(path.join(gopath, 'src'))) {
            message = {
              line: false,
              column: false,
              msg: 'Warning: GOPATH [' + gopath + '] does not contain a "src" directory - please review http://golang.org/doc/code.html#Workspaces',
              type: 'warning',
              source: 'gopath'
            };
            messages.push(message);
          }
        }
      }
      if ((messages != null) && _.size(messages) === 0) {
        filepath = editor != null ? editor.getPath() : void 0;
        if ((filepath != null) && filepath !== '' && fs.existsSync(filepath)) {
          filepath = fs.realpathSync(filepath);
          found = false;
          for (_k = 0, _len2 = gopaths.length; _k < _len2; _k++) {
            gopath = gopaths[_k];
            if (fs.existsSync(gopath)) {
              gopath = fs.realpathSync(gopath);
              if (filepath.toLowerCase().startsWith(path.join(gopath, 'src').toLowerCase())) {
                found = true;
              }
            }
          }
          if (!found) {
            message = {
              line: false,
              column: false,
              msg: 'Warning: File [' + filepath + '] does not reside within a "src" directory in your GOPATH [' + gopaths + '] - please review http://golang.org/doc/code.html#Workspaces',
              type: 'warning',
              source: 'gopath'
            };
            messages.push(message);
          }
        }
      }
      if ((messages != null) && _.size(messages) > 0) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null, messages);
        return;
      }
      this.emit(this.name + '-complete', editor, saving);
      callback(null);
    };

    return Gopath;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nb3BhdGguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUdBLE9BQXdCLE9BQUEsQ0FBUSxVQUFSLENBQXhCLEVBQUMsa0JBQUEsVUFBRCxFQUFhLGVBQUEsT0FIYixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsTUFBdkIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsTUFBcEIsQ0FEQSxDQUFBOztBQUdhLElBQUEsZ0JBQUMsUUFBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBQVosQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxRQURSLENBRFc7SUFBQSxDQUhiOztBQUFBLHFCQU9BLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUZMO0lBQUEsQ0FQVCxDQUFBOztBQUFBLHFCQVdBLEtBQUEsR0FBTyxTQUFDLE1BQUQsR0FBQTthQUNMLElBQUMsQ0FBQSxJQUFELENBQU0sT0FBTixFQUFlLE1BQWYsRUFESztJQUFBLENBWFAsQ0FBQTs7QUFBQSxxQkFjQSxLQUFBLEdBQU8sU0FBQyxNQUFELEVBQVMsTUFBVCxFQUFp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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/gopath.coffee
