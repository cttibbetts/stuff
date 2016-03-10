(function() {
  var Dispatch, Emitter, Environment, Executor, GoExecutable, Gobuild, Gocover, Godef, Gofmt, Golint, Gopath, Govet, LineMessageView, MessagePanelView, PlainMessageView, SplicerSplitter, Subscriber, async, os, path, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  Gofmt = require('./gofmt');

  Govet = require('./govet');

  Golint = require('./golint');

  Gopath = require('./gopath');

  Gobuild = require('./gobuild');

  Gocover = require('./gocover');

  Executor = require('./executor');

  Environment = require('./environment');

  GoExecutable = require('./goexecutable');

  Godef = require('./godef');

  SplicerSplitter = require('./util/splicersplitter');

  _ = require('underscore-plus');

  _ref1 = require('atom-message-panel'), MessagePanelView = _ref1.MessagePanelView, LineMessageView = _ref1.LineMessageView, PlainMessageView = _ref1.PlainMessageView;

  path = require('path');

  os = require('os');

  async = require('async');

  module.exports = Dispatch = (function() {
    Subscriber.includeInto(Dispatch);

    Emitter.includeInto(Dispatch);

    function Dispatch() {
      this.gettools = __bind(this.gettools, this);
      this.displayGoInfo = __bind(this.displayGoInfo, this);
      this.emitReady = __bind(this.emitReady, this);
      this.displayMessages = __bind(this.displayMessages, this);
      this.resetAndDisplayMessages = __bind(this.resetAndDisplayMessages, this);
      this.detect = __bind(this.detect, this);
      this.handleEvents = __bind(this.handleEvents, this);
      this.subscribeToAtomEvents = __bind(this.subscribeToAtomEvents, this);
      this.destroy = __bind(this.destroy, this);
      var gobuildsubscription, gocoversubscription, gofmtsubscription, golintsubscription, gopathsubscription, govetsubscription;
      this.activated = false;
      this.dispatching = false;
      this.ready = false;
      this.messages = [];
      this.items = [];
      this.environment = new Environment(process.env);
      this.executor = new Executor(this.environment.Clone());
      this.splicersplitter = new SplicerSplitter();
      this.goexecutable = new GoExecutable(this.env());
      this.gofmt = new Gofmt(this);
      this.govet = new Govet(this);
      this.golint = new Golint(this);
      this.gopath = new Gopath(this);
      this.gobuild = new Gobuild(this);
      this.gocover = new Gocover(this);
      this.godef = new Godef(this);
      if (this.messagepanel == null) {
        this.messagepanel = new MessagePanelView({
          title: '<span class="icon-diff-added"></span> go-plus',
          rawTitle: true
        });
      }
      gofmtsubscription = this.gofmt.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      golintsubscription = this.golint.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      govetsubscription = this.govet.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      gopathsubscription = this.gopath.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      gobuildsubscription = this.gobuild.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      gocoversubscription = this.gocover.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      this.subscribe(gofmtsubscription);
      this.subscribe(golintsubscription);
      this.subscribe(govetsubscription);
      this.subscribe(gopathsubscription);
      this.subscribe(gobuildsubscription);
      this.subscribe(gocoversubscription);
      this.on('dispatch-complete', (function(_this) {
        return function(editor) {
          return _this.displayMessages(editor);
        };
      })(this));
      this.subscribeToAtomEvents();
      this.detect();
    }

    Dispatch.prototype.destroy = function() {
      var _ref2;
      this.destroyItems();
      this.unsubscribe();
      this.resetPanel();
      if ((_ref2 = this.messagepanel) != null) {
        _ref2.remove();
      }
      this.messagepanel = null;
      this.gocover.destroy();
      this.gobuild.destroy();
      this.golint.destroy();
      this.govet.destroy();
      this.gopath.destroy();
      this.gofmt.destroy();
      this.godef.destroy();
      this.gocover = null;
      this.gobuild = null;
      this.golint = null;
      this.govet = null;
      this.gopath = null;
      this.gofmt = null;
      this.godef = null;
      this.ready = false;
      this.activated = false;
      return this.emit('destroyed');
    };

    Dispatch.prototype.addItem = function(item) {
      if (__indexOf.call(this.items, item) >= 0) {
        return;
      }
      if (typeof item.on === 'function') {
        this.subscribe(item, 'destroyed', (function(_this) {
          return function() {
            return _this.removeItem(item);
          };
        })(this));
      }
      return this.items.splice(0, 0, item);
    };

    Dispatch.prototype.removeItem = function(item) {
      var index;
      index = this.items.indexOf(item);
      if (index === -1) {
        return;
      }
      if (typeof item.on === 'function') {
        this.unsubscribe(item);
      }
      return this.items.splice(index, 1);
    };

    Dispatch.prototype.destroyItems = function() {
      var item, _i, _len, _ref2, _results;
      if (!(this.items && _.size(this.items) > 0)) {
        return;
      }
      _ref2 = this.items;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        item = _ref2[_i];
        _results.push(item.dispose());
      }
      return _results;
    };

    Dispatch.prototype.subscribeToAtomEvents = function() {
      this.addItem(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.handleEvents(editor);
        };
      })(this)));
      this.addItem(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(event) {
          return _this.resetPanel();
        };
      })(this)));
      this.addItem(atom.config.observe('go-plus.getMissingTools', (function(_this) {
        return function() {
          if ((atom.config.get('go-plus.getMissingTools') != null) && atom.config.get('go-plus.getMissingTools') && _this.ready) {
            return _this.gettools(false);
          }
        };
      })(this)));
      this.addItem(atom.config.observe('go-plus.formatTool', (function(_this) {
        return function() {
          if (_this.ready) {
            return _this.displayGoInfo(true);
          }
        };
      })(this)));
      this.addItem(atom.config.observe('go-plus.goPath', (function(_this) {
        return function() {
          if (_this.ready) {
            return _this.displayGoInfo(true);
          }
        };
      })(this)));
      this.addItem(atom.config.observe('go-plus.environmentOverridesConfiguration', (function(_this) {
        return function() {
          if (_this.ready) {
            return _this.displayGoInfo(true);
          }
        };
      })(this)));
      this.addItem(atom.config.observe('go-plus.goInstallation', (function(_this) {
        return function() {
          if (_this.ready) {
            return _this.detect();
          }
        };
      })(this)));
      atom.commands.add('atom-workspace', {
        'golang:goinfo': (function(_this) {
          return function() {
            if (_this.ready && _this.activated) {
              return _this.displayGoInfo(true);
            }
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'golang:getmissingtools': (function(_this) {
          return function() {
            if (_this.activated) {
              return _this.gettools(false);
            }
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'golang:updatetools': (function(_this) {
          return function() {
            if (_this.activated) {
              return _this.gettools(true);
            }
          };
        })(this)
      });
      return this.activated = true;
    };

    Dispatch.prototype.handleEvents = function(editor) {
      var buffer, destroyedsubscription, modifiedsubscription, savedsubscription;
      buffer = editor != null ? editor.getBuffer() : void 0;
      if (buffer == null) {
        return;
      }
      this.updateGutter(editor, this.messages);
      modifiedsubscription = buffer.onDidStopChanging((function(_this) {
        return function() {
          if (!_this.activated) {
            return;
          }
          return _this.handleBufferChanged(editor);
        };
      })(this));
      savedsubscription = buffer.onDidSave((function(_this) {
        return function() {
          if (!_this.activated) {
            return;
          }
          if (!!_this.dispatching) {
            return;
          }
          return _this.handleBufferSave(editor, true);
        };
      })(this));
      destroyedsubscription = buffer.onDidDestroy((function(_this) {
        return function() {
          if (savedsubscription != null) {
            savedsubscription.dispose();
          }
          if (savedsubscription != null) {
            _this.removeItem(savedsubscription);
          }
          if (modifiedsubscription != null) {
            modifiedsubscription.dispose();
          }
          if (modifiedsubscription != null) {
            return _this.removeItem(modifiedsubscription);
          }
        };
      })(this));
      this.addItem(modifiedsubscription);
      this.addItem(savedsubscription);
      return this.addItem(destroyedsubscription);
    };

    Dispatch.prototype.detect = function() {
      this.ready = false;
      return this.goexecutable.detect().then((function(_this) {
        return function(gos) {
          if ((atom.config.get('go-plus.getMissingTools') != null) && atom.config.get('go-plus.getMissingTools')) {
            _this.gettools(false);
          }
          _this.displayGoInfo(false);
          return _this.emitReady();
        };
      })(this));
    };

    Dispatch.prototype.resetAndDisplayMessages = function(editor, msgs) {
      if (!this.isValidEditor(editor)) {
        return;
      }
      this.resetState(editor);
      this.collectMessages(msgs);
      return this.displayMessages(editor);
    };

    Dispatch.prototype.displayMessages = function(editor) {
      this.updatePane(editor, this.messages);
      this.updateGutter(editor, this.messages);
      this.dispatching = false;
      return this.emit('display-complete');
    };

    Dispatch.prototype.emitReady = function() {
      this.ready = true;
      return this.emit('ready');
    };

    Dispatch.prototype.displayGoInfo = function(force) {
      var editor, go, gopath, thepath, _ref2, _ref3, _ref4, _ref5;
      editor = (_ref2 = atom.workspace) != null ? _ref2.getActiveTextEditor() : void 0;
      if (!force) {
        if (!this.isValidEditor(editor)) {
          return;
        }
      }
      this.resetPanel();
      go = this.goexecutable.current();
      if ((go != null) && (go.executable != null) && go.executable.trim() !== '') {
        this.messagepanel.add(new PlainMessageView({
          raw: true,
          message: '<b>Go:</b> ' + go.name + ' (@' + go.executable + ')',
          className: 'text-info'
        }));
        gopath = go.buildgopath();
        if ((gopath != null) && gopath.trim() !== '') {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>GOPATH:</b> ' + gopath,
            className: 'text-highlight'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>GOPATH:</b> Not Set (You Should Try Launching Atom Using The Shell Commands...)',
            className: 'text-error'
          }));
        }
        if ((go.cover() != null) && go.cover() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Cover Tool:</b> ' + go.cover(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Cover Tool:</b> Not Found',
            className: 'text-error'
          }));
        }
        if ((go.vet() != null) && go.vet() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Vet Tool:</b> ' + go.vet(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Vet Tool:</b> Not Found',
            className: 'text-error'
          }));
        }
        if ((go.format() != null) && go.format() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Format Tool:</b> ' + go.format(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Format Tool (' + atom.config.get('go-plus.formatTool') + '):</b> Not Found',
            className: 'text-error'
          }));
        }
        if ((go.golint() != null) && go.golint() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Lint Tool:</b> ' + go.golint(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Lint Tool:</b> Not Found',
            className: 'text-error'
          }));
        }
        if ((go.gocode() != null) && go.gocode() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Gocode Tool:</b> ' + go.gocode(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Gocode Tool:</b> Not Found',
            className: 'text-error'
          }));
        }
        if ((go.godef() != null) && go.godef() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Godef Tool:</b> ' + go.godef(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Godef Tool:</b> Not Found',
            className: 'text-error'
          }));
        }
        if (_.contains(atom.packages.getAvailablePackageNames(), 'autocomplete-plus')) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Gocode Status:</b> Enabled',
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Gocode Status:</b> Not Enabled (autocomplete-plus needs to be installed and active; install it and restart)',
            className: 'text-warning'
          }));
        }
        if ((go.oracle() != null) && go.oracle() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Oracle Tool: ' + go.oracle(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Oracle Tool: Not Found',
            className: 'text-error'
          }));
        }
        if ((go.git() != null) && go.git() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Git:</b> ' + go.git(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Git:</b> Not Found',
            className: 'text-warning'
          }));
        }
        thepath = (_ref3 = this.env()) != null ? _ref3.PATH : void 0;
        if (os.platform() === 'win32') {
          thepath = ((_ref4 = this.env()) != null ? _ref4.Path : void 0) || ((_ref5 = this.env()) != null ? _ref5.PATH : void 0);
        }
        if ((thepath != null) && thepath.trim() !== '') {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>PATH:</b> ' + thepath,
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>PATH:</b> Not Set',
            className: 'text-error'
          }));
        }
      } else {
        this.messagepanel.add(new PlainMessageView({
          raw: true,
          message: 'No Go Installations Were Found',
          className: 'text-error'
        }));
      }
      this.messagepanel.add(new PlainMessageView({
        raw: true,
        message: '<b>Atom:</b> ' + atom.appVersion + ' (' + os.platform() + ' ' + os.arch() + ' ' + os.release() + ')',
        className: 'text-info'
      }));
      return this.messagepanel.attach();
    };

    Dispatch.prototype.collectMessages = function(messages) {
      if ((messages != null) && _.size(messages) > 0) {
        messages = _.flatten(messages);
      }
      messages = _.filter(messages, function(element, index, list) {
        return element != null;
      });
      if (messages == null) {
        return;
      }
      messages = _.filter(messages, function(message) {
        return message != null;
      });
      this.messages = _.union(this.messages, messages);
      this.messages = _.uniq(this.messages, function(element, index, list) {
        return (element != null ? element.line : void 0) + ':' + (element != null ? element.column : void 0) + ':' + (element != null ? element.msg : void 0);
      });
      return this.emit('messages-collected', _.size(this.messages));
    };

    Dispatch.prototype.triggerPipeline = function(editor, saving) {
      var go;
      this.dispatching = true;
      go = this.goexecutable.current();
      if (!((go != null) && (go.executable != null) && go.executable.trim() !== '')) {
        this.displayGoInfo(false);
        this.dispatching = false;
        return;
      }
      async.series([
        (function(_this) {
          return function(callback) {
            return _this.gofmt.formatBuffer(editor, saving, callback);
          };
        })(this)
      ], (function(_this) {
        return function(err, modifymessages) {
          _this.collectMessages(modifymessages);
          return async.parallel([
            function(callback) {
              return _this.govet.checkBuffer(editor, saving, callback);
            }, function(callback) {
              return _this.golint.checkBuffer(editor, saving, callback);
            }, function(callback) {
              return _this.gopath.check(editor, saving, callback);
            }, function(callback) {
              return _this.gobuild.checkBuffer(editor, saving, callback);
            }
          ], function(err, checkmessages) {
            _this.collectMessages(checkmessages);
            return _this.emit('dispatch-complete', editor);
          });
        };
      })(this));
      return async.series([
        (function(_this) {
          return function(callback) {
            return _this.gocover.runCoverage(editor, saving, callback);
          };
        })(this)
      ], (function(_this) {
        return function(err, modifymessages) {
          return _this.emit('coverage-complete');
        };
      })(this));
    };

    Dispatch.prototype.handleBufferSave = function(editor, saving) {
      if (!(this.ready && this.activated)) {
        return;
      }
      if (!this.isValidEditor(editor)) {
        return;
      }
      this.resetState(editor);
      return this.triggerPipeline(editor, saving);
    };

    Dispatch.prototype.handleBufferChanged = function(editor) {
      if (!(this.ready && this.activated)) {
        return;
      }
      if (!this.isValidEditor(editor)) {

      }
    };

    Dispatch.prototype.resetState = function(editor) {
      this.messages = [];
      this.resetGutter(editor);
      return this.resetPanel();
    };

    Dispatch.prototype.resetGutter = function(editor) {
      var marker, markers, _i, _len, _ref2, _results;
      if (!this.isValidEditor(editor)) {
        return;
      }
      markers = editor != null ? (_ref2 = editor.getBuffer()) != null ? _ref2.findMarkers({
        "class": 'go-plus'
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
    };

    Dispatch.prototype.updateGutter = function(editor, messages) {
      var buffer, error, marker, message, skip, _i, _len, _results;
      this.resetGutter(editor);
      if (!this.isValidEditor(editor)) {
        return;
      }
      if (!((messages != null) && messages.length > 0)) {
        return;
      }
      buffer = editor != null ? editor.getBuffer() : void 0;
      if (buffer == null) {
        return;
      }
      _results = [];
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        message = messages[_i];
        skip = false;
        if (((message != null ? message.file : void 0) != null) && message.file !== '') {
          skip = message.file !== (buffer != null ? buffer.getPath() : void 0);
        }
        if (!skip) {
          if (((message != null ? message.line : void 0) != null) && message.line !== false && message.line >= 0) {
            try {
              marker = buffer != null ? buffer.markPosition([message.line - 1, 0], {
                "class": 'go-plus',
                invalidate: 'touch'
              }) : void 0;
              _results.push(editor != null ? editor.decorateMarker(marker, {
                type: 'line-number',
                "class": 'goplus-' + message.type
              }) : void 0);
            } catch (_error) {
              error = _error;
              _results.push(console.log(error));
            }
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Dispatch.prototype.resetPanel = function() {
      var _ref2, _ref3;
      if ((_ref2 = this.messagepanel) != null) {
        _ref2.close();
      }
      return (_ref3 = this.messagepanel) != null ? _ref3.clear() : void 0;
    };

    Dispatch.prototype.updatePane = function(editor, messages) {
      var className, column, file, line, message, sortedMessages, _i, _len;
      this.resetPanel;
      if (messages == null) {
        return;
      }
      if (messages.length <= 0 && atom.config.get('go-plus.showPanelWhenNoIssuesExist')) {
        this.messagepanel.add(new PlainMessageView({
          message: 'No Issues',
          className: 'text-success'
        }));
        this.messagepanel.attach();
        return;
      }
      if (!(messages.length > 0)) {
        return;
      }
      if (!atom.config.get('go-plus.showPanel')) {
        return;
      }
      sortedMessages = _.sortBy(this.messages, function(element, index, list) {
        return parseInt(element.line, 10);
      });
      for (_i = 0, _len = sortedMessages.length; _i < _len; _i++) {
        message = sortedMessages[_i];
        className = (function() {
          switch (message.type) {
            case 'error':
              return 'text-error';
            case 'warning':
              return 'text-warning';
            default:
              return 'text-info';
          }
        })();
        file = (message.file != null) && message.file.trim() !== '' ? message.file : null;
        if ((file != null) && file !== '' && ((typeof atom !== "undefined" && atom !== null ? atom.project : void 0) != null)) {
          file = atom.project.relativize(file);
        }
        column = (message.column != null) && message.column !== '' && message.column !== false ? message.column : null;
        line = (message.line != null) && message.line !== '' && message.line !== false ? message.line : null;
        if (file === null && column === null && line === null) {
          this.messagepanel.add(new PlainMessageView({
            message: message.msg,
            className: className
          }));
        } else {
          this.messagepanel.add(new LineMessageView({
            file: file,
            line: line,
            character: column,
            message: message.msg,
            className: className
          }));
        }
      }
      if ((typeof atom !== "undefined" && atom !== null ? atom.workspace : void 0) != null) {
        return this.messagepanel.attach();
      }
    };

    Dispatch.prototype.isValidEditor = function(editor) {
      var _ref2;
      return (editor != null ? (_ref2 = editor.getGrammar()) != null ? _ref2.scopeName : void 0 : void 0) === 'source.go';
    };

    Dispatch.prototype.env = function() {
      return this.environment.Clone();
    };

    Dispatch.prototype.gettools = function(updateExistingTools) {
      var thego;
      updateExistingTools = (updateExistingTools != null) && updateExistingTools;
      this.ready = false;
      thego = this.goexecutable.current();
      if (!((thego != null) && (thego.executable != null) && thego.executable.trim() !== '')) {
        this.displayGoInfo(false);
        return;
      }
      if (!(thego.toolsAreMissing() || updateExistingTools)) {
        this.emitReady();
        return;
      }
      this.resetPanel();
      this.messagepanel.add(new PlainMessageView({
        message: 'Running `go get -u` to get required tools...',
        className: 'text-success'
      }));
      this.messagepanel.attach();
      this.goexecutable.on('gettools-complete', (function(_this) {
        return function() {
          _this.displayGoInfo(true);
          return _this.emitReady();
        };
      })(this));
      return this.goexecutable.gettools(thego, updateExistingTools);
    };

    return Dispatch;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9kaXNwYXRjaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ09BQUE7SUFBQTt5SkFBQTs7QUFBQSxFQUFBLE9BQXdCLE9BQUEsQ0FBUSxVQUFSLENBQXhCLEVBQUMsa0JBQUEsVUFBRCxFQUFhLGVBQUEsT0FBYixDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQUZSLENBQUE7O0FBQUEsRUFHQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FIVCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBSlQsQ0FBQTs7QUFBQSxFQUtBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUxWLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FOVixDQUFBOztBQUFBLEVBT0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBUFgsQ0FBQTs7QUFBQSxFQVFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUixDQVJkLENBQUE7O0FBQUEsRUFTQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGdCQUFSLENBVGYsQ0FBQTs7QUFBQSxFQVVBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQVZSLENBQUE7O0FBQUEsRUFXQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx3QkFBUixDQVhsQixDQUFBOztBQUFBLEVBWUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQVpKLENBQUE7O0FBQUEsRUFhQSxRQUF3RCxPQUFBLENBQVEsb0JBQVIsQ0FBeEQsRUFBQyx5QkFBQSxnQkFBRCxFQUFtQix3QkFBQSxlQUFu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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/dispatch.coffee
