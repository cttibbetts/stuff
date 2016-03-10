(function() {
  var Go, fs, os, path, _;

  fs = require('fs-plus');

  path = require('path');

  os = require('os');

  _ = require('underscore-plus');

  module.exports = Go = (function() {
    Go.prototype.name = '';

    Go.prototype.os = '';

    Go.prototype.exe = '';

    Go.prototype.arch = '';

    Go.prototype.version = '';

    Go.prototype.gopath = '';

    Go.prototype.goroot = '';

    Go.prototype.gotooldir = '';

    Go.prototype.env = false;

    function Go(executable, pathexpander, options) {
      this.executable = executable;
      this.pathexpander = pathexpander;
      if ((options != null ? options.name : void 0) != null) {
        this.name = options.name;
      }
      if ((options != null ? options.os : void 0) != null) {
        this.os = options.os;
      }
      if ((options != null ? options.exe : void 0) != null) {
        this.exe = options.exe;
      }
      if ((options != null ? options.arch : void 0) != null) {
        this.arch = options.arch;
      }
      if ((options != null ? options.version : void 0) != null) {
        this.version = options.version;
      }
      if ((options != null ? options.gopath : void 0) != null) {
        this.gopath = options.gopath;
      }
      if ((options != null ? options.goroot : void 0) != null) {
        this.goroot = options.goroot;
      }
      if ((options != null ? options.gotooldir : void 0) != null) {
        this.gotooldir = options.gotooldir;
      }
    }

    Go.prototype.description = function() {
      return this.name + ' (@ ' + this.goroot + ')';
    };

    Go.prototype.go = function() {
      if (!((this.executable != null) && this.executable !== '')) {
        return false;
      }
      if (!fs.existsSync(this.executable)) {
        return false;
      }
      return fs.realpathSync(this.executable);
    };

    Go.prototype.buildgopath = function() {
      var environmentOverridesConfig, gopathConfig, result;
      result = '';
      gopathConfig = atom.config.get('go-plus.goPath');
      environmentOverridesConfig = (atom.config.get('go-plus.environmentOverridesConfiguration') != null) && atom.config.get('go-plus.environmentOverridesConfiguration');
      if ((this.env.GOPATH != null) && this.env.GOPATH !== '') {
        result = this.env.GOPATH;
      }
      if ((this.gopath != null) && this.gopath !== '') {
        result = this.gopath;
      }
      if (!environmentOverridesConfig && (gopathConfig != null) && gopathConfig.trim() !== '') {
        result = gopathConfig;
      }
      if (result === '' && (gopathConfig != null) && gopathConfig.trim() !== '') {
        result = gopathConfig;
      }
      result = result.replace('\n', '').replace('\r', '');
      return this.pathexpander.expand(result, '');
    };

    Go.prototype.splitgopath = function() {
      var result;
      result = this.buildgopath();
      if (!((result != null) && result !== '')) {
        return [];
      }
      return result.split(path.delimiter);
    };

    Go.prototype.gofmt = function() {
      return this.gorootBinOrPathItem('gofmt');
    };

    Go.prototype.format = function() {
      switch (atom.config.get('go-plus.formatTool')) {
        case 'goimports':
          return this.goimports();
        case 'goreturns':
          return this.goreturns();
        default:
          return this.gofmt();
      }
    };

    Go.prototype.vet = function() {
      return this.goTooldirOrGopathBinOrPathItem('vet');
    };

    Go.prototype.cover = function() {
      return this.goTooldirOrGopathBinOrPathItem('cover');
    };

    Go.prototype.goimports = function() {
      return this.gopathBinOrPathItem('goimports');
    };

    Go.prototype.goreturns = function() {
      return this.gopathBinOrPathItem('goreturns');
    };

    Go.prototype.golint = function() {
      return this.gopathBinOrPathItem('golint');
    };

    Go.prototype.gocode = function() {
      return this.gopathBinOrPathItem('gocode');
    };

    Go.prototype.godef = function() {
      return this.goTooldirOrGopathBinOrPathItem('godef');
    };

    Go.prototype.oracle = function() {
      return this.gopathBinOrPathItem('oracle');
    };

    Go.prototype.git = function() {
      return this.pathItem('git');
    };

    Go.prototype.goTooldirOrGopathBinOrPathItem = function(name) {
      var result;
      result = this.goTooldirItem(name);
      if (!((result != null) && result)) {
        result = this.gopathBinOrPathItem(name);
      }
      return result;
    };

    Go.prototype.gopathBinOrPathItem = function(name) {
      var result;
      result = this.gopathBinItem(name);
      if (!((result != null) && result)) {
        result = this.pathItem(name);
      }
      return result;
    };

    Go.prototype.gopathBinItem = function(name) {
      var gopaths, item, result, _i, _len;
      if (!((name != null) && name !== '')) {
        return false;
      }
      gopaths = this.splitgopath();
      for (_i = 0, _len = gopaths.length; _i < _len; _i++) {
        item = gopaths[_i];
        result = path.resolve(path.normalize(path.join(item, 'bin', name + this.exe)));
        if (fs.existsSync(result)) {
          return fs.realpathSync(result);
        }
      }
      return false;
    };

    Go.prototype.pathItem = function(name) {
      var element, elements, p, pathresult, target, _i, _len;
      if (!((name != null) && name !== '')) {
        return false;
      }
      pathresult = false;
      p = this.env.PATH;
      if (os.platform() === 'win32') {
        p = this.env.Path || this.env.PATH;
      }
      if (p != null) {
        elements = p.split(path.delimiter);
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          element = elements[_i];
          target = path.resolve(path.normalize(path.join(element, name + this.exe)));
          if (fs.existsSync(target)) {
            pathresult = fs.realpathSync(target);
            return pathresult;
          }
        }
      }
      return pathresult;
    };

    Go.prototype.gorootBinOrPathItem = function(name) {
      var result;
      if (!((name != null) && name !== '')) {
        return false;
      }
      result = this.gorootBinItem(name);
      if (!((result != null) && result)) {
        result = this.pathItem(name);
      }
      return result;
    };

    Go.prototype.gorootBinItem = function(name) {
      var result;
      if (!((name != null) && name !== '')) {
        return false;
      }
      if (!((this.goroot != null) && this.goroot !== '')) {
        return false;
      }
      result = path.join(this.goroot, 'bin', name + this.exe);
      if (!fs.existsSync(result)) {
        return false;
      }
      return fs.realpathSync(result);
    };

    Go.prototype.goTooldirItem = function(name) {
      var result;
      if (!((name != null) && name !== '')) {
        return false;
      }
      result = path.join(this.gotooldir, name + this.exe);
      if (fs.existsSync(result)) {
        return fs.realpathSync(result);
      }
      return false;
    };

    Go.prototype.toolsAreMissing = function() {
      if (this.format() === false) {
        return true;
      }
      if (this.golint() === false) {
        return true;
      }
      if (this.vet() === false) {
        return true;
      }
      if (this.cover() === false) {
        return true;
      }
      if (this.gocode() === false) {
        return true;
      }
      if (this.oracle() === false) {
        return true;
      }
      if (this.git() === false) {
        return true;
      }
      if (this.godef() === false) {
        return true;
      }
      return false;
    };

    return Go;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nby5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSEosQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixpQkFBQSxJQUFBLEdBQU0sRUFBTixDQUFBOztBQUFBLGlCQUNBLEVBQUEsR0FBSSxFQURKLENBQUE7O0FBQUEsaUJBRUEsR0FBQSxHQUFLLEVBRkwsQ0FBQTs7QUFBQSxpQkFHQSxJQUFBLEdBQU0sRUFITixDQUFBOztBQUFBLGlCQUlBLE9BQUEsR0FBUyxFQUpULENBQUE7O0FBQUEsaUJBS0EsTUFBQSxHQUFRLEVBTFIsQ0FBQTs7QUFBQSxpQkFNQSxNQUFBLEdBQVEsRUFOUixDQUFBOztBQUFBLGlCQU9BLFNBQUEsR0FBVyxFQVBYLENBQUE7O0FBQUEsaUJBUUEsR0FBQSxHQUFLLEtBUkwsQ0FBQTs7QUFVYSxJQUFBLFlBQUUsVUFBRixFQUFlLFlBQWYsRUFBNkIsT0FBN0IsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLGVBQUEsWUFDMUIsQ0FBQTtBQUFBLE1BQUEsSUFBd0IsaURBQXhCO0FBQUEsUUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLE9BQU8sQ0FBQyxJQUFoQixDQUFBO09BQUE7QUFDQSxNQUFBLElBQW9CLCtD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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/go.coffee
