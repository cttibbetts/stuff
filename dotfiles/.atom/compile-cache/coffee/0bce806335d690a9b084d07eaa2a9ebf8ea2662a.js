(function() {
  module.exports = {
    config: {
      environmentOverridesConfiguration: {
        title: 'Environment Overrides Config',
        description: 'Use the environment\'s value for GOPATH (if set) instead of the configured value for GOPATH (below)',
        type: 'boolean',
        "default": true,
        order: 1
      },
      goPath: {
        title: 'GOPATH',
        description: 'You should set your GOPATH in the environment, and launch Atom using the `atom` command line tool; if you would like to set it explicitly, you can do so here (e.g. ~/go)',
        type: 'string',
        "default": '',
        order: 2
      },
      goInstallation: {
        title: 'Go Installation Path',
        description: 'You should not normally set this; if you have a non-standard go installation path and `go` is not available on your PATH, you can use this to configure the location to `go` (e.g. /usr/local/othergo/bin/go or c:\\othergo\\bin\\go.exe)',
        type: 'string',
        "default": '',
        order: 3
      },
      formatOnSave: {
        title: 'Run Format Tool On Save',
        description: 'Run the configured format tool each time a file is saved',
        type: 'boolean',
        "default": true,
        order: 4
      },
      formatTool: {
        title: 'Format Tool',
        description: 'Choose one: goimports, goreturns, or gofmt',
        type: 'string',
        "default": 'goimports',
        "enum": ['goimports', 'goreturns', 'gofmt'],
        order: 5
      },
      formatArgs: {
        title: 'Format Arguments',
        description: '`-w` will always be used; you can specify additional arguments for the format tool if desired',
        type: 'string',
        "default": '-w -e',
        order: 6
      },
      lintOnSave: {
        title: 'Run Lint Tool On Save',
        description: 'Run `golint` each time a file is saved',
        type: 'boolean',
        "default": true,
        order: 7
      },
      golintArgs: {
        title: 'Lint Arguments',
        description: 'Arguments to pass to `golint` (these are not usually needed)',
        type: 'string',
        "default": '',
        order: 8
      },
      runCoverageOnSave: {
        title: 'Run Coverage Tool On Save',
        description: 'Run `go test -coverprofile` each time a file is saved',
        type: 'boolean',
        "default": false,
        order: 9
      },
      syntaxCheckOnSave: {
        title: 'Run Syntax Check On Save',
        description: 'Run `go build` / `go test` each time a file is saved',
        type: 'boolean',
        "default": true,
        order: 10
      },
      vetOnSave: {
        title: 'Run Vet Tool On Save',
        description: 'Run `go vet` each time a file is saved',
        type: 'boolean',
        "default": true,
        order: 11
      },
      vetArgs: {
        title: 'Vet Arguments',
        description: 'Arguments to pass to `go vet` (these are not usually needed)',
        type: 'string',
        "default": '',
        order: 12
      },
      getMissingTools: {
        title: 'Automatically Get Missing Tools',
        description: 'Run `go get -u` to retrieve any tools that are required but not currently available in the go tool directory, the PATH, or your GOPATH',
        type: 'boolean',
        "default": true,
        order: 13
      },
      showPanel: {
        title: 'Show Message Panel',
        description: 'Show the go-plus message panel to provide information about issues with your source',
        type: 'boolean',
        "default": true,
        order: 14
      },
      showPanelWhenNoIssuesExist: {
        title: 'Show Message Panel When No Issues Exist',
        description: 'Show the go-plus message panel even when no issues exist',
        type: 'boolean',
        "default": false,
        order: 15
      },
      autocompleteBlacklist: {
        title: 'Autocomplete Scope Blacklist',
        description: 'Autocomplete suggestions will not be shown when the cursor is inside the following comma-delimited scope(s).',
        type: 'string',
        "default": '.source.go .comment',
        order: 16
      },
      suppressBuiltinAutocompleteProvider: {
        title: 'Suppress Built-In Autocomplete Plus Provider',
        description: 'Suppress the provider built-in to the autocomplete-plus package when editing .go files.',
        type: 'boolean',
        "default": true,
        order: 17
      },
      suppressAutocompleteActivationForCharacters: {
        title: 'Suppress Autocomplete Activation For Characters',
        description: 'Suggestions will not be provided when you type one of these characters.',
        type: 'array',
        "default": ['comma', 'newline', 'space', 'tab', '/', '\\', '(', ')', '"', '\'', ':', ';', '<', '>', '~', '!', '@', '#', '$', '%', '^', '&', '*', '|', '+', '=', '[', ']', '{', '}', '`', '~', '?', '-'],
        items: {
          type: 'string'
        },
        order: 18
      }
    },
    activate: function(state) {
      var run;
      run = (function(_this) {
        return function() {
          return _this.getDispatch();
        };
      })(this);
      return setTimeout(run.bind(this), 0);
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.provider) != null) {
        _ref.dispose();
      }
      this.provider = null;
      if ((_ref1 = this.dispatch) != null) {
        _ref1.destroy();
      }
      return this.dispatch = null;
    },
    getDispatch: function() {
      var Dispatch;
      if (this.dispatch != null) {
        return this.dispatch;
      }
      Dispatch = require('./dispatch');
      this.dispatch = new Dispatch();
      this.setDispatch();
      return this.dispatch;
    },
    setDispatch: function() {
      if ((this.provider != null) && (this.dispatch != null)) {
        return this.provider.setDispatch(this.dispatch);
      }
    },
    getProvider: function() {
      var GocodeProvider;
      if (this.provider != null) {
        return this.provider;
      }
      GocodeProvider = require('./gocodeprovider');
      this.provider = new GocodeProvider();
      this.setDispatch();
      return this.provider;
    },
    provide: function() {
      return this.getProvider();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nby1wbHVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGlDQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyw4QkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHFHQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BREY7QUFBQSxNQU1BLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLFFBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwyS0FEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxFQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQVBGO0FBQUEsTUFZQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDJPQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEVBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BYkY7QUFBQSxNQWtCQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyx5QkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDBEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BbkJGO0FBQUEsTUF3QkEsVUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sYUFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDRDQURi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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/go-plus.coffee
