(function() {
  var Emitter, Gocover, GocoverParser, Subscriber, areas, fs, path, spawn, temp, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  spawn = require('child_process').spawn;

  temp = require('temp');

  path = require('path');

  fs = require('fs-plus');

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  GocoverParser = require('./gocover/gocover-parser');

  _ = require('underscore-plus');

  areas = [];

  module.exports = Gocover = (function() {
    Subscriber.includeInto(Gocover);

    Emitter.includeInto(Gocover);

    function Gocover(dispatch) {
      this.runCoverage = __bind(this.runCoverage, this);
      this.runCoverageForCurrentEditor = __bind(this.runCoverageForCurrentEditor, this);
      this.createCoverageFile = __bind(this.createCoverageFile, this);
      this.removeCoverageFile = __bind(this.removeCoverageFile, this);
      this.addMarkersToEditor = __bind(this.addMarkersToEditor, this);
      this.clearMarkersFromEditors = __bind(this.clearMarkersFromEditors, this);
      this.addMarkersToEditors = __bind(this.addMarkersToEditors, this);
      this.dispatch = dispatch;
      this.name = 'gocover';
      this.covering = false;
      this.parser = new GocoverParser();
      this.coverageFile = false;
      this.ranges = false;
      atom.commands.add('atom-workspace', {
        'golang:gocover': (function(_this) {
          return function() {
            return _this.runCoverageForCurrentEditor();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'golang:cleargocover': (function(_this) {
          return function() {
            return _this.clearMarkersFromEditors();
          };
        })(this)
      });
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.addMarkersToEditor(editor);
        };
      })(this));
    }

    Gocover.prototype.destroy = function() {
      this.unsubscribe();
      this.dispatch = null;
      this.parser = null;
      return this.removeCoverageFile();
    };

    Gocover.prototype.addMarkersToEditors = function() {
      var editor, editors, _i, _len, _results;
      editors = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        _results.push(this.addMarkersToEditor(editor));
      }
      return _results;
    };

    Gocover.prototype.clearMarkersFromEditors = function() {
      var editor, editors, _i, _len, _results;
      this.removeCoverageFile();
      editors = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        _results.push(this.clearMarkers(editor));
      }
      return _results;
    };

    Gocover.prototype.addMarkersToEditor = function(editor) {
      var buffer, clazz, editorRanges, error, file, marker, range, _i, _len, _ref1, _results;
      if ((editor != null ? (_ref1 = editor.getGrammar()) != null ? _ref1.scopeName : void 0 : void 0) !== 'source.go') {
        return;
      }
      file = editor != null ? editor.getPath() : void 0;
      buffer = editor != null ? editor.getBuffer() : void 0;
      if (!((file != null) && (buffer != null))) {
        return;
      }
      this.clearMarkers(editor);
      if (!((this.ranges != null) && this.ranges && _.size(this.ranges) > 0)) {
        return;
      }
      editorRanges = _.filter(this.ranges, function(r) {
        return _.endsWith(file, r.file);
      });
      try {
        _results = [];
        for (_i = 0, _len = editorRanges.length; _i < _len; _i++) {
          range = editorRanges[_i];
          marker = buffer.markRange(range.range, {
            "class": 'gocover',
            gocovercount: range.count,
            invalidate: 'touch'
          });
          clazz = range.count > 0 ? 'covered' : 'uncovered';
          _results.push(editor.decorateMarker(marker, {
            type: 'highlight',
            "class": clazz,
            onlyNonEmpty: true
          }));
        }
        return _results;
      } catch (_error) {
        error = _error;
        return console.log(error);
      }
    };

    Gocover.prototype.clearMarkers = function(editor) {
      var error, marker, markers, _i, _len, _ref1, _ref2, _results;
      if ((editor != null ? (_ref1 = editor.getGrammar()) != null ? _ref1.scopeName : void 0 : void 0) !== 'source.go') {
        return;
      }
      try {
        markers = editor != null ? (_ref2 = editor.getBuffer()) != null ? _ref2.findMarkers({
          "class": 'gocover'
        }) : void 0 : void 0;
        if (!((markers != null) && _.size(markers) > 0)) {
          return;
        }
        _results = [];
        for (_i = 0, _len = markers.length; _i < _len; _i++) {
          marker = markers[_i];
          _results.push(marker.destroy());
        }
        return _results;
      } catch (_error) {
        error = _error;
        return console.log(error);
      }
    };

    Gocover.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Gocover.prototype.removeCoverageFile = function() {
      this.ranges = [];
      if (this.coverageFile) {
        try {
          return fs.unlinkSync(this.coverageFile);
        } catch (_error) {

        }
      }
    };

    Gocover.prototype.createCoverageFile = function() {
      var tempDir;
      this.removeCoverageFile();
      tempDir = temp.mkdirSync();
      return this.coverageFile = path.join(tempDir, 'coverage.out');
    };

    Gocover.prototype.runCoverageForCurrentEditor = function() {
      var editor, _ref1;
      editor = typeof atom !== "undefined" && atom !== null ? (_ref1 = atom.workspace) != null ? _ref1.getActiveTextEditor() : void 0 : void 0;
      if (editor == null) {
        return;
      }
      this.reset(editor);
      return this.runCoverage(editor, false);
    };

    Gocover.prototype.runCoverage = function(editor, saving, callback) {
      var args, buffer, cmd, cover, cwd, done, env, go, gopath, message, re, tempFile;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (saving && !atom.config.get('go-plus.runCoverageOnSave')) {
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
      if (this.covering) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      this.covering = true;
      this.clearMarkersFromEditors();
      tempFile = this.createCoverageFile();
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
      re = new RegExp(buffer.getBaseName() + '$');
      go = this.dispatch.goexecutable.current();
      cover = go.cover();
      if (cover === false) {
        message = {
          line: false,
          column: false,
          msg: 'Cover Tool Missing',
          type: 'error',
          source: this.name
        };
        this.covering = false;
        callback(null, [message]);
        return;
      }
      cwd = buffer.getPath().replace(re, '');
      cmd = this.dispatch.goexecutable.current().executable;
      args = ['test', "-coverprofile=" + tempFile];
      done = (function(_this) {
        return function(exitcode, stdout, stderr, messages) {
          if (exitcode === 0) {
            _this.ranges = _this.parser.ranges(tempFile);
            _this.addMarkersToEditors();
          }
          _this.covering = false;
          _this.emit(_this.name + '-complete', editor, saving);
          return callback(null, messages);
        };
      })(this);
      return this.dispatch.executor.exec(cmd, cwd, env, done, args);
    };

    return Gocover;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nb2NvdmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrRkFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsZUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUlBLE9BQXdCLE9BQUEsQ0FBUSxVQUFSLENBQXhCLEVBQUMsa0JBQUEsVUFBRCxFQUFhLGVBQUEsT0FKYixDQUFBOztBQUFBLEVBS0EsYUFBQSxHQUFnQixPQUFBLENBQVEsMEJBQVIsQ0FMaEIsQ0FBQTs7QUFBQSxFQU1BLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FOSixDQUFBOztBQUFBLEVBUUEsS0FBQSxHQUFRLEVBUlIsQ0FBQTs7QUFBQSxFQVVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLE9BQXZCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQXBCLENBREEsQ0FBQTs7QUFHYSxJQUFBLGlCQUFDLFFBQUQsR0FBQTtBQUNYLHVEQUFBLENBQUE7QUFBQSx1RkFBQSxDQUFBO0FBQUEscUVBQUEsQ0FBQTtBQUFBLHFFQUFBLENBQUE7QUFBQSxxRUFBQSxDQUFBO0FBQUEsK0VBQUEsQ0FBQTtBQUFBLHVFQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksUUFBWixDQUFBO0FBQUEsTUFDQSxJQUFD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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/gocover.coffee
