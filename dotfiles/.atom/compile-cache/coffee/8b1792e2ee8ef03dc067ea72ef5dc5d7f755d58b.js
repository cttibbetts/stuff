(function() {
  var CompositeDisposable, GocodeProvider, Range, path, _, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), Range = _ref.Range, CompositeDisposable = _ref.CompositeDisposable;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = GocodeProvider = (function() {
    GocodeProvider.prototype.selector = '.source.go';

    GocodeProvider.prototype.inclusionPriority = 1;

    GocodeProvider.prototype.excludeLowerPriority = true;

    GocodeProvider.prototype.suppressForCharacters = [];

    function GocodeProvider() {
      this.subscriptions = new CompositeDisposable;
      this.disableForSelector = atom.config.get('go-plus.autocompleteBlacklist');
      this.subscriptions.add(atom.config.observe('go-plus.suppressAutocompleteActivationForCharacters', (function(_this) {
        return function(value) {
          _this.suppressForCharacters = _.map(value, function(c) {
            var char;
            char = (c != null ? c.trim() : void 0) || '';
            char = (function() {
              switch (false) {
                case char.toLowerCase() !== 'comma':
                  return ',';
                case char.toLowerCase() !== 'newline':
                  return '\n';
                case char.toLowerCase() !== 'space':
                  return ' ';
                case char.toLowerCase() !== 'tab':
                  return '\t';
                default:
                  return char;
              }
            })();
            return char;
          });
          return _this.suppressForCharacters = _.compact(_this.suppressForCharacters);
        };
      })(this)));
    }

    GocodeProvider.prototype.setDispatch = function(dispatch) {
      this.dispatch = dispatch;
      return this.funcRegex = /^(?:func[(]{1})([^\)]*)(?:[)]{1})(?:$|(?:\s)([^\(]*$)|(?: [(]{1})([^\)]*)(?:[)]{1}))/i;
    };

    GocodeProvider.prototype.getSuggestions = function(options) {
      return new Promise((function(_this) {
        return function(resolve) {
          var args, buffer, cmd, configArgs, cwd, done, env, go, gopath, index, message, offset, quotedRange, text, _ref1, _ref2;
          if (options == null) {
            return resolve();
          }
          if (!((_ref1 = _this.dispatch) != null ? _ref1.isValidEditor(options.editor) : void 0)) {
            return resolve();
          }
          buffer = options.editor.getBuffer();
          if (buffer == null) {
            return resolve();
          }
          go = _this.dispatch.goexecutable.current();
          if (go == null) {
            return resolve();
          }
          gopath = go.buildgopath();
          if ((gopath == null) || gopath === '') {
            return resolve();
          }
          if (!options.bufferPosition) {
            return resolve();
          }
          index = buffer.characterIndexForPosition(options.bufferPosition);
          text = options.editor.getText();
          if (index > 0 && (_ref2 = text[index - 1], __indexOf.call(_this.suppressForCharacters, _ref2) >= 0)) {
            return resolve();
          }
          quotedRange = options.editor.displayBuffer.bufferRangeForScopeAtPosition('.string.quoted', options.bufferPosition);
          if (quotedRange) {
            return resolve();
          }
          offset = Buffer.byteLength(text.substring(0, index), "utf8");
          env = _this.dispatch.env();
          env['GOPATH'] = gopath;
          cwd = path.dirname(buffer.getPath());
          args = ['-f=json', 'autocomplete', buffer.getPath(), offset];
          configArgs = _this.dispatch.splicersplitter.splitAndSquashToArray(' ', atom.config.get('go-plus.gocodeArgs'));
          if ((configArgs != null) && _.size(configArgs) > 0) {
            args = _.union(configArgs, args);
          }
          cmd = go.gocode();
          if (cmd === false) {
            message = {
              line: false,
              column: false,
              msg: 'gocode Tool Missing',
              type: 'error',
              source: _this.name
            };
            resolve();
            return;
          }
          done = function(exitcode, stdout, stderr, messages) {
            if ((stderr != null) && stderr.trim() !== '') {
              console.log(_this.name + ' - stderr: ' + stderr);
            }
            if ((stdout != null) && stdout.trim() !== '') {
              messages = _this.mapMessages(stdout, options.editor, options.bufferPosition);
            }
            if ((messages != null ? messages.length : void 0) < 1) {
              return resolve();
            }
            return resolve(messages);
          };
          return _this.dispatch.executor.exec(cmd, cwd, env, done, args, text);
        };
      })(this));
    };

    GocodeProvider.prototype.mapMessages = function(data, editor, position) {
      var c, candidates, numPrefix, prefix, res, suggestion, suggestions, _i, _len;
      if (data == null) {
        return [];
      }
      res = JSON.parse(data);
      numPrefix = res[0];
      candidates = res[1];
      if (!candidates) {
        return [];
      }
      prefix = editor.getTextInBufferRange([[position.row, position.column - numPrefix], position]);
      suggestions = [];
      for (_i = 0, _len = candidates.length; _i < _len; _i++) {
        c = candidates[_i];
        suggestion = {
          replacementPrefix: prefix,
          leftLabel: c.type || c["class"],
          type: this.translateType(c["class"])
        };
        if (c["class"] === 'func') {
          suggestion = this.upgradeSuggestion(suggestion, c);
        } else {
          suggestion.text = c.name;
        }
        if (suggestion.type === 'package') {
          suggestion.iconHTML = '<i class="icon-package"></i>';
        }
        suggestions.push(suggestion);
      }
      return suggestions;
    };

    GocodeProvider.prototype.translateType = function(type) {
      switch (type) {
        case 'func':
          return 'function';
        case 'var':
          return 'variable';
        case 'const':
          return 'constant';
        case 'PANIC':
          return 'panic';
        default:
          return type;
      }
    };

    GocodeProvider.prototype.upgradeSuggestion = function(suggestion, c) {
      var match;
      if (!((c.type != null) && c.type !== '')) {
        return suggestion;
      }
      match = this.funcRegex.exec(c.type);
      if (!((match != null) && (match[0] != null))) {
        suggestion.snippet = c.name + '()';
        suggestion.leftLabel = '';
        return suggestion;
      }
      suggestion.leftLabel = match[2] || match[3] || '';
      suggestion.snippet = this.generateSnippet(c.name, match);
      return suggestion;
    };

    GocodeProvider.prototype.generateSnippet = function(name, match) {
      var arg, args, i, signature, _i, _len;
      signature = name;
      if (!((match[1] != null) && match[1] !== '')) {
        return signature + '()';
      }
      args = match[1].split(/, /);
      args = _.map(args, function(a) {
        if (!((a != null ? a.length : void 0) > 2)) {
          return a;
        }
        if (a.substring(a.length - 2, a.length) === '{}') {
          return a.substring(0, a.length - 1) + '\\}';
        }
        return a;
      });
      if (args.length === 1) {
        return signature + '(${1:' + args[0] + '})';
      }
      i = 1;
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        if (i === 1) {
          signature = signature + '(${' + i + ':' + arg + '}';
        } else {
          signature = signature + ', ${' + i + ':' + arg + '}';
        }
        i = i + 1;
      }
      signature = signature + ')';
      return signature;
    };

    GocodeProvider.prototype.dispose = function() {
      var _ref1;
      if ((_ref1 = this.subscriptions) != null) {
        _ref1.dispose();
      }
      this.subscriptions = null;
      this.disableForSelector = null;
      this.suppressForCharacters = null;
      return this.dispatch = null;
    };

    return GocodeProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nb2NvZGVwcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseURBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLE9BQWdDLE9BQUEsQ0FBUSxNQUFSLENBQWhDLEVBQUMsYUFBQSxLQUFELEVBQVEsMkJBQUEsbUJBQVIsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw2QkFBQSxRQUFBLEdBQVUsWUFBVixDQUFBOztBQUFBLDZCQUNBLGlCQUFBLEdBQW1CLENBRG5CLENBQUE7O0FBQUEsNkJBRUEsb0JBQUEsR0FBc0IsSUFGdEIsQ0FBQTs7QUFBQSw2QkFHQSxxQkFBQSxHQUF1QixFQUh2QixDQUFBOztBQUthLElBQUEsd0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtCQUFoQixDQUR0QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHFEQUFwQixFQUEyRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDNUYsVUFBQSxLQUFDLENBQUEscUJBQUQsR0FBeUIsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxLQUFOLEVBQWEsU0FBQyxDQUFELEdBQUE7QUFD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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/gocodeprovider.coffee
