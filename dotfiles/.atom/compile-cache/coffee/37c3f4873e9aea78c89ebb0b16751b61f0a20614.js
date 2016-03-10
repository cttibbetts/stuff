(function() {
  var BufferedProcess, Executor, fs, spawnSync,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  spawnSync = require('child_process').spawnSync;

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs-plus');

  module.exports = Executor = (function() {
    function Executor(environment) {
      this.exec = __bind(this.exec, this);
      this.execSync = __bind(this.execSync, this);
      this.environment = environment;
    }

    Executor.prototype.execSync = function(command, cwd, env, args, input) {
      var done, message, options, result;
      if (input == null) {
        input = null;
      }
      options = {
        cwd: null,
        env: null,
        encoding: 'utf8'
      };
      if ((cwd != null) && cwd !== '' && cwd !== false && fs.existsSync(cwd)) {
        options.cwd = fs.realpathSync(cwd);
      }
      options.env = env != null ? env : this.environment;
      if (input) {
        options.input = input;
      }
      if (args == null) {
        args = [];
      }
      done = spawnSync(command, args, options);
      result = {
        error: done != null ? done.error : void 0,
        code: done != null ? done.status : void 0,
        stdout: (done != null ? done.stdout : void 0) != null ? done.stdout : '',
        stderr: (done != null ? done.stderr : void 0) != null ? done.stderr : '',
        messages: []
      };
      if (done.error != null) {
        if (done.error.code === 'ENOENT') {
          message = {
            line: false,
            column: false,
            msg: 'No file or directory: [' + command + ']',
            type: 'error',
            source: 'executor'
          };
          result.messages.push(message);
          result.code = 127;
        } else if (done.error.code === 'ENOTCONN') {
          result.error = null;
          result.code = 0;
        } else {
          console.log('Error: ' + JSON.stringify(done.error));
        }
      }
      return result;
    };

    Executor.prototype.exec = function(command, cwd, env, callback, args, input) {
      var bufferedprocess, code, error, exit, messages, options, output, stderr, stdout;
      if (input == null) {
        input = null;
      }
      output = '';
      error = '';
      code = 0;
      messages = [];
      options = {
        cwd: null,
        env: null
      };
      if ((cwd != null) && cwd !== '' && cwd !== false && fs.existsSync(cwd)) {
        options.cwd = fs.realpathSync(cwd);
      }
      options.env = env != null ? env : this.environment;
      stdout = function(data) {
        return output += data;
      };
      stderr = function(data) {
        return error += data;
      };
      exit = function(data) {
        var message;
        if ((error != null) && error !== '' && error.replace(/\r?\n|\r/g, '') === "\'" + command + "\' is not recognized as an internal or external command,operable program or batch file.") {
          message = {
            line: false,
            column: false,
            msg: 'No file or directory: [' + command + ']',
            type: 'error',
            source: 'executor'
          };
          messages.push(message);
          callback(127, output, error, messages);
          return;
        }
        code = data;
        return callback(code, output, error, messages);
      };
      if (args == null) {
        args = [];
      }
      bufferedprocess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      bufferedprocess.onWillThrowError(function(err) {
        var message;
        if (err == null) {
          return;
        }
        if (err.error.code === 'ENOENT') {
          message = {
            line: false,
            column: false,
            msg: 'No file or directory: [' + command + ']',
            type: 'error',
            source: 'executor'
          };
          messages.push(message);
        } else {
          console.log('Error: ' + JSON.stringify(err.error));
        }
        err.handle();
        return callback(127, output, error, messages);
      });
      if (input != null) {
        return bufferedprocess.process.stdin.end(input);
      }
    };

    return Executor;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9leGVjdXRvci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLFlBQWEsT0FBQSxDQUFRLGVBQVIsRUFBYixTQUFELENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFERCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLGtCQUFDLFdBQUQsR0FBQTtBQUNYLHlDQUFBLENBQUE7QUFBQSxpREFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLFdBQWYsQ0FEVztJQUFBLENBQWI7O0FBQUEsdUJBR0EsUUFBQSxHQUFVLFNBQUMsT0FBRCxFQUFVLEdBQVYsRUFBZSxHQUFmLEVBQW9CLElBQXBCLEVBQTBCLEtBQTFCLEdBQUE7QUFDUixVQUFBLDhCQUFBOztRQURrQyxRQUFRO09BQzFDO0FBQUEsTUFBQSxPQUFBLEdBQ0U7QUFBQSxRQUFBLEdBQUEsRUFBSyxJQUFMO0FBQUEsUUFDQSxHQUFBLEVBQUssSUFETDtBQUFBLFFBRUEsUUFBQSxFQUFVLE1BRlY7T0FERixDQUFBO0FBSUEsTUFBQSxJQUFzQyxhQUFBLElBQVMsR0FBQSxLQUFTLEVBQWxCLElBQXlCLEdBQUEsS0FBUyxLQUFsQyxJQUE0QyxFQUFFLENBQUMsVUFBSCxDQUFjLEdBQWQsQ0FBbEY7QUFBQSxRQUFBLE9BQU8sQ0FBQyxHQUFSLEdBQWMsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsR0FBaEIsQ0FBZCxDQUFBO09BSkE7QUFBQSxNQUtBLE9BQU8sQ0FBQyxHQUFSLEdBQWlC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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/executor.coffee
