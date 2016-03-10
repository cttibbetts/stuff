(function() {
  var Environment, Executor, fs, os, _;

  _ = require('underscore-plus');

  os = require('os');

  fs = require('fs-plus');

  Executor = require('./executor');

  module.exports = Environment = (function() {
    function Environment(environment) {
      this.environment = environment;
    }

    Environment.prototype.Clone = function() {
      var env, executor, match, matcher, pathhelper, result;
      env = _.clone(this.environment);
      if (env.DYLD_INSERT_LIBRARIES != null) {
        env.DYLD_INSERT_LIBRARIES = void 0;
      }
      if (!(os.platform() === 'darwin' && env.PATH === '/usr/bin:/bin:/usr/sbin:/sbin')) {
        return env;
      }
      pathhelper = '/usr/libexec/path_helper';
      if (!fs.existsSync(pathhelper)) {
        return env;
      }
      executor = new Executor(env);
      result = executor.execSync(pathhelper);
      if (result.code !== 0) {
        return env;
      }
      if ((result.stderr != null) && result.stderr !== '') {
        return env;
      }
      matcher = /^PATH="(.*?)";/img;
      match = matcher.exec(result.stdout);
      if (match == null) {
        return env;
      }
      env.PATH = match[1];
      return env;
    };

    return Environment;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9lbnZpcm9ubWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBSFgsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHFCQUFDLFdBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxXQUFmLENBRFc7SUFBQSxDQUFiOztBQUFBLDBCQUdBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxVQUFBLGlEQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFDLENBQUEsV0FBVCxDQUFOLENBQUE7QUFDQSxNQUFBLElBQXlDLGlDQUF6QztBQUFBLFFBQUEsR0FBRyxDQUFDLHFCQUFKLEdBQTRCLE1BQTVCLENBQUE7T0FEQTtBQUVBLE1BQUEsSUFBQSxDQUFBLENBQWtCLEVBQUUsQ0FBQyxRQUFILENBQUEsQ0FBQSxLQUFpQixRQUFqQixJQUE4QixHQUFHLENBQUMsSUFBSixLQUFZLCtCQUE1RCxDQUFBO0FBQUEsZUFBTyxHQUFQLENBQUE7T0FGQTtBQUFBLE1BR0EsVUFBQSxHQUFhLDBCQUhiLENBQUE7QUFJQSxNQUFBLElBQUEsQ0FBQSxFQUFvQixDQUFDLFVBQUgsQ0FBYyxVQUFkLENBQWxCO0FBQUEsZUFBTyxHQUFQLENBQUE7T0FKQTtBQUFBLE1BS0EsUUFBQSxHQUFlLElBQUEsUUFBQSxDQUFTLEdBQVQsQ0FMZixDQUFBO0FBQUEsTUFNQSxNQUFBLEdBQVMsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsVUFBbEIsQ0FOVCxDQUFBO0FBT0EsTUFBQSxJQUFjLE1BQU0sQ0FBQyxJQUFQLEtBQWlCLENBQS9CO0FBQUEsZUFBTyxHQUFQLENBQUE7T0FQQTtBQVFBLE1BQUEsSUFBYyx1QkFBQSxJQUFtQixNQUFNLENBQUMsTUFBUCxLQUFtQixFQUFwRDtBQUFBLGVBQU8sR0FBUCxDQUFBO09BUkE7QUFBQSxNQVNBLE9BQUEsR0FBVSxtQkFUVixDQUFBO0FBQUEsTUFVQSxLQUFBLEdBQVEsT0FBTyxDQUFDLElBQVIsQ0FBYSxNQUFNLENBQUMsTUFBcEIsQ0FWUixDQUFBO0FBV0EsTUFBQSxJQUFrQixhQUFsQjtBQUFBLGVBQU8sR0FBUCxDQUFBO09BWEE7QUFBQSxNQVlBLEdBQUcsQ0FBQyxJQUFKLEdBQVcsS0FBTSxDQUFBLENBQUEsQ0FaakIsQ0FBQTtBQWFBLGFBQU8sR0FBUCxDQWRLO0lBQUEsQ0FIUCxDQUFBOzt1QkFBQTs7TUFQRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/environment.coffee
