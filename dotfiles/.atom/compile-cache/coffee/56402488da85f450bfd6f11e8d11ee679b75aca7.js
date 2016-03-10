(function() {
  var Emitter, Executor, Go, GoExecutable, PathExpander, Subscriber, async, fs, os, path, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  async = require('async');

  path = require('path');

  fs = require('fs-plus');

  os = require('os');

  Go = require('./go');

  _ = require('underscore-plus');

  Executor = require('./executor');

  PathExpander = require('./util/pathexpander');

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  module.exports = GoExecutable = (function() {
    Subscriber.includeInto(GoExecutable);

    Emitter.includeInto(GoExecutable);

    function GoExecutable(env) {
      this.current = __bind(this.current, this);
      this.gettools = __bind(this.gettools, this);
      this.detect = __bind(this.detect, this);
      this.buildCandidates = __bind(this.buildCandidates, this);
      this.env = env;
      this.gos = [];
      this.currentgo = '';
      this.executor = new Executor(this.env);
      this.pathexpander = new PathExpander(this.env);
    }

    GoExecutable.prototype.destroy = function() {
      this.unsubscribe();
      this.executor = null;
      this.pathexpander = null;
      this.gos = [];
      this.currentgo = '';
      return this.reset();
    };

    GoExecutable.prototype.reset = function() {
      this.gos = [];
      this.currentgo = '';
      return this.emit('reset');
    };

    GoExecutable.prototype.buildCandidates = function() {
      var candidates, element, elements, goinstallation, p, _i, _j, _len, _len1, _ref1;
      candidates = [];
      goinstallation = atom.config.get('go-plus.goInstallation');
      switch (os.platform()) {
        case 'darwin':
        case 'freebsd':
        case 'linux':
        case 'sunos':
          if ((goinstallation != null) && goinstallation.trim() !== '') {
            if (fs.existsSync(goinstallation)) {
              if ((_ref1 = fs.lstatSync(goinstallation)) != null ? _ref1.isDirectory() : void 0) {
                candidates.push(path.normalize(path.join(goinstallation, 'bin', 'go')));
              } else if (goinstallation.lastIndexOf(path.sep + 'go') === goinstallation.length - 3 || goinstallation.lastIndexOf(path.sep + 'goapp') === goinstallation.length - 6) {
                candidates.push(path.normalize(goinstallation));
              }
            }
          }
          if (this.env.PATH != null) {
            elements = this.env.PATH.split(path.delimiter);
            for (_i = 0, _len = elements.length; _i < _len; _i++) {
              element = elements[_i];
              candidates.push(path.normalize(path.join(element, 'go')));
            }
          }
          candidates.push(path.normalize(path.join('/usr', 'local', 'go', 'bin', 'go')));
          candidates.push(path.normalize(path.join('/usr', 'local', 'bin', 'go')));
          break;
        case 'win32':
          if ((goinstallation != null) && goinstallation.trim() !== '') {
            if (goinstallation.lastIndexOf(path.sep + 'go.exe') === goinstallation.length - 7 || goinstallation.lastIndexOf(path.sep + 'goapp.bat') === goinstallation.length - 10) {
              candidates.push(path.normalize(goinstallation));
            }
          }
          p = this.env.Path || this.env.PATH;
          if (p != null) {
            elements = p.split(path.delimiter);
            for (_j = 0, _len1 = elements.length; _j < _len1; _j++) {
              element = elements[_j];
              candidates.push(path.normalize(path.join(element, 'go.exe')));
            }
          }
          candidates.push(path.normalize(path.join('C:', 'go', 'bin', 'go.exe')));
          candidates.push(path.normalize(path.join('C:', 'tools', 'go', 'bin', 'go.exe')));
      }
      candidates = _.chain(candidates).uniq().map(function(e) {
        return path.resolve(path.normalize(e));
      }).filter(function(e) {
        return fs.existsSync(e);
      }).reject(function(e) {
        var _ref2;
        return (_ref2 = fs.lstatSync(e)) != null ? _ref2.isDirectory() : void 0;
      }).value();
      return candidates;
    };

    GoExecutable.prototype.detect = function() {
      return new Promise((function(_this) {
        return function(resolve) {
          var candidate, candidates, envResult, error, go, item, items, key, tuple, value, versionComponents, versionResult, _i, _j, _len, _len1;
          _this.gos = [];
          try {
            candidates = _this.buildCandidates();
            for (_i = 0, _len = candidates.length; _i < _len; _i++) {
              candidate = candidates[_i];
              if (!((candidate != null) && candidate.trim() !== '')) {
                break;
              }
              versionResult = _this.executor.execSync(candidate, false, _this.env, ['version']);
              if (versionResult == null) {
                break;
              }
              if (versionResult.error != null) {
                console.log('Error running go version for go: [' + candidate + '] (probably not a valid go)');
                console.log('Error detail: ' + versionResult.error);
                break;
              }
              if ((versionResult.stderr != null) && versionResult.stderr !== '') {
                console.log(versionResult.stderr);
                break;
              }
              if ((versionResult.stdout != null) && versionResult.stdout !== '') {
                versionComponents = versionResult.stdout.replace(/\r?\n|\r/g, '').split(' ');
                go = new Go(candidate, _this.pathexpander);
                if (go != null) {
                  go.name = versionComponents[2] + ' ' + versionComponents[3];
                }
                if (go != null) {
                  go.version = versionComponents[2];
                }
                if (go != null) {
                  go.env = _this.env;
                }
              }
              if (go !== null) {
                envResult = _this.executor.execSync(candidate, false, _this.env, ['env']);
              }
              if (envResult == null) {
                break;
              }
              if (envResult.error != null) {
                console.log('Error running go env for go: [' + candidate + '] (probably not a valid go)');
                console.log('Error detail: ' + envResult.error);
                break;
              }
              if ((envResult.stderr != null) && envResult.stderr !== '') {
                console.log(envResult.stderr);
                break;
              }
              if ((envResult.stdout != null) && envResult.stdout !== '') {
                items = envResult.stdout.split('\n');
                for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
                  item = items[_j];
                  if ((item != null) && item !== '' && item.trim() !== '') {
                    tuple = item.split('=');
                    key = tuple[0];
                    value = '';
                    if (os.platform() === 'win32') {
                      value = tuple[1];
                    } else {
                      if (tuple[1].length > 2) {
                        value = tuple[1].substring(1, tuple[1].length - 1);
                      }
                    }
                    if (os.platform() === 'win32') {
                      switch (key) {
                        case 'set GOARCH':
                          go.arch = value;
                          break;
                        case 'set GOOS':
                          go.os = value;
                          break;
                        case 'set GOPATH':
                          go.gopath = value;
                          break;
                        case 'set GOROOT':
                          go.goroot = value;
                          break;
                        case 'set GOTOOLDIR':
                          go.gotooldir = value;
                          break;
                        case 'set GOEXE':
                          go.exe = value;
                      }
                    } else {
                      switch (key) {
                        case 'GOARCH':
                          go.arch = value;
                          break;
                        case 'GOOS':
                          go.os = value;
                          break;
                        case 'GOPATH':
                          go.gopath = value;
                          break;
                        case 'GOROOT':
                          go.goroot = value;
                          break;
                        case 'GOTOOLDIR':
                          go.gotooldir = value;
                          break;
                        case 'GOEXE':
                          go.exe = value;
                      }
                    }
                  }
                }
              }
              if ((go != null) && (go.executable != null) && (go.gotooldir != null) && go.gotooldir !== '') {
                _this.gos.push(go);
              }
            }
          } catch (_error) {
            error = _error;
            console.log(error);
          }
          return resolve(_this.gos);
        };
      })(this));
    };

    GoExecutable.prototype.gettools = function(go, updateExistingTools) {
      var gogetenv, gopath;
      if (go == null) {
        this.emit('gettools-complete');
        return;
      }
      gogetenv = _.clone(this.env);
      gopath = go.buildgopath();
      if (!((gopath != null) && gopath.trim() !== '')) {
        this.emit('gettools-complete');
        return;
      }
      gogetenv['GOPATH'] = gopath;
      return async.series([
        (function(_this) {
          return function(callback) {
            var done;
            done = function(exitcode, stdout, stderr) {
              return callback(null);
            };
            if (go.vet() !== false && !updateExistingTools) {
              return done();
            } else {
              return _this.executor.exec(go.executable, false, gogetenv, done, ['get', '-u', 'golang.org/x/tools/cmd/vet']);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            var done;
            done = function(exitcode, stdout, stderr) {
              return callback(null);
            };
            if (go.cover() !== false && !updateExistingTools) {
              return done();
            } else {
              return _this.executor.exec(go.executable, false, gogetenv, done, ['get', '-u', 'golang.org/x/tools/cmd/cover']);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            var done, pkg;
            done = function(exitcode, stdout, stderr) {
              return callback(null);
            };
            if (go.format() !== false && !updateExistingTools) {
              return done();
            } else {
              pkg = (function() {
                switch (atom.config.get('go-plus.formatTool')) {
                  case 'goimports':
                    return 'golang.org/x/tools/cmd/goimports';
                  case 'goreturns':
                    return 'sourcegraph.com/sqs/goreturns';
                  default:
                    return false;
                }
              })();
              if (pkg == null) {
                done();
              }
              return _this.executor.exec(go.executable, false, gogetenv, done, ['get', '-u', pkg]);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            var done;
            done = function(exitcode, stdout, stderr) {
              return callback(null);
            };
            if (go.golint() !== false && !updateExistingTools) {
              return done();
            } else {
              return _this.executor.exec(go.executable, false, gogetenv, done, ['get', '-u', 'github.com/golang/lint/golint']);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            var done;
            done = function(exitcode, stdout, stderr) {
              return callback(null);
            };
            if (go.gocode() !== false && !updateExistingTools) {
              return done();
            } else {
              return _this.executor.exec(go.executable, false, gogetenv, done, ['get', '-u', 'github.com/nsf/gocode']);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            var done;
            done = function(exitcode, stdout, stderr) {
              return callback(null);
            };
            if (go.godef() !== false && !updateExistingTools) {
              return done();
            } else {
              return _this.executor.exec(go.executable, false, gogetenv, done, ['get', '-u', 'github.com/rogpeppe/godef']);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            var done;
            done = function(exitcode, stdout, stderr) {
              return callback(null);
            };
            if (go.oracle() !== false && !updateExistingTools) {
              return done();
            } else {
              return _this.executor.exec(go.executable, false, gogetenv, done, ['get', '-u', 'golang.org/x/tools/cmd/oracle']);
            }
          };
        })(this)
      ], (function(_this) {
        return function(err, results) {
          return _this.emit('gettools-complete');
        };
      })(this));
    };

    GoExecutable.prototype.current = function() {
      var go, _i, _len, _ref1, _ref2;
      if (!(((_ref1 = this.gos) != null ? _ref1.length : void 0) > 0)) {
        return false;
      }
      if (_.size(this.gos) === 1) {
        return this.gos[0];
      }
      _ref2 = this.gos;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        go = _ref2[_i];
        if ((go != null ? go.executable : void 0) === this.currentgo && this.currentgo !== '') {
          return go;
        }
      }
      return this.gos[0];
    };

    return GoExecutable;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nb2V4ZWN1dGFibGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJGQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxNQUFSLENBSkwsQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FMSixDQUFBOztBQUFBLEVBTUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBTlgsQ0FBQTs7QUFBQSxFQU9BLFlBQUEsR0FBZSxPQUFBLENBQVEscUJBQVIsQ0FQZixDQUFBOztBQUFBLEVBUUEsT0FBd0IsT0FBQSxDQUFRLFVBQVIsQ0FBeEIsRUFBQyxrQkFBQSxVQUFELEVBQWEsZUFBQSxPQVJiLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixZQUF2QixDQUFBLENBQUE7O0FBQUEsSUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixZQUFwQixDQURBLENBQUE7O0FBR2EsSUFBQSxzQkFBQyxHQUFELEdBQUE7QUFDWCwrQ0FBQSxDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSwrREFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsR0FBRCxHQUFPLEdBQVAsQ0FB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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/goexecutable.coffee
