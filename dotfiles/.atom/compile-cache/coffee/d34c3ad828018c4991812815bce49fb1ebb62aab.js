(function() {
  var AtomConfig, path, _;

  path = require('path');

  _ = require('underscore-plus');

  AtomConfig = require('./util/atomconfig');

  xdescribe('gocode', function() {
    var autocompleteMain, autocompleteManager, buffer, completionDelay, dispatch, editor, editorView, goplusMain, provider, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], editor = _ref[1], editorView = _ref[2], dispatch = _ref[3], buffer = _ref[4], completionDelay = _ref[5], goplusMain = _ref[6], autocompleteMain = _ref[7], autocompleteManager = _ref[8], provider = _ref[9];
    beforeEach(function() {
      runs(function() {
        var atomconfig, pack;
        atomconfig = new AtomConfig();
        atomconfig.allfunctionalitydisabled();
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        atom.config.set('go-plus.suppressBuiltinAutocompleteProvider', false);
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        pack = atom.packages.loadPackage('go-plus');
        goplusMain = pack.mainModule;
        spyOn(goplusMain, 'provide').andCallThrough();
        spyOn(goplusMain, 'setDispatch').andCallThrough();
        pack = atom.packages.loadPackage('autocomplete-plus');
        autocompleteMain = pack.mainModule;
        spyOn(autocompleteMain, 'consumeProvider').andCallThrough();
        return jasmine.unspy(window, 'setTimeout');
      });
      waitsForPromise(function() {
        return atom.workspace.open('gocode.go').then(function(e) {
          editor = e;
          return editorView = atom.views.getView(editor);
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('autocomplete-plus');
      });
      waitsFor(function() {
        var _ref1;
        return (_ref1 = autocompleteMain.autocompleteManager) != null ? _ref1.ready : void 0;
      });
      runs(function() {
        autocompleteManager = autocompleteMain.getAutocompleteManager();
        spyOn(autocompleteManager, 'displaySuggestions').andCallThrough();
        spyOn(autocompleteManager, 'showSuggestionList').andCallThrough();
        return spyOn(autocompleteManager, 'hideSuggestionList').andCallThrough();
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-go');
      });
      runs(function() {
        expect(goplusMain.provide).not.toHaveBeenCalled();
        return expect(goplusMain.provide.calls.length).toBe(0);
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('go-plus');
      });
      waitsFor(function() {
        return goplusMain.provide.calls.length === 1;
      });
      waitsFor(function() {
        return autocompleteMain.consumeProvider.calls.length === 1;
      });
      waitsFor(function() {
        var _ref1;
        return (_ref1 = goplusMain.dispatch) != null ? _ref1.ready : void 0;
      });
      waitsFor(function() {
        return goplusMain.setDispatch.calls.length >= 1;
      });
      return runs(function() {
        expect(goplusMain.provide).toHaveBeenCalled();
        expect(goplusMain.provider).toBeDefined();
        provider = goplusMain.provider;
        spyOn(provider, 'getSuggestions').andCallThrough();
        provider.onDidInsertSuggestion = jasmine.createSpy();
        expect(_.size(autocompleteManager.providerManager.providersForScopeDescriptor('.source.go'))).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.go')[0]).toEqual(provider);
        buffer = editor.getBuffer();
        dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
        return dispatch.goexecutable.detect();
      });
    });
    afterEach(function() {
      jasmine.unspy(goplusMain, 'provide');
      jasmine.unspy(goplusMain, 'setDispatch');
      jasmine.unspy(autocompleteManager, 'displaySuggestions');
      jasmine.unspy(autocompleteMain, 'consumeProvider');
      jasmine.unspy(autocompleteManager, 'hideSuggestionList');
      jasmine.unspy(autocompleteManager, 'showSuggestionList');
      return jasmine.unspy(provider, 'getSuggestions');
    });
    return describe('when the gocode autocomplete-plus provider is enabled', function() {
      it('displays suggestions from gocode', function() {
        runs(function() {
          expect(provider).toBeDefined();
          expect(provider.getSuggestions).not.toHaveBeenCalled();
          expect(autocompleteManager.displaySuggestions).not.toHaveBeenCalled();
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.setCursorScreenPosition([5, 6]);
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 1;
        });
        runs(function() {
          editor.insertText('P');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.showSuggestionList.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus span.word') != null;
        });
        return runs(function() {
          expect(provider.getSuggestions).toHaveBeenCalled();
          expect(provider.getSuggestions.calls.length).toBe(1);
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          expect(editorView.querySelector('.autocomplete-plus span.word').innerHTML).toBe('<span class="character-match">P</span>rint(<span class="snippet-completion">a ...interface{}</span>)');
          expect(editorView.querySelector('.autocomplete-plus span.left-label').innerHTML).toBe('n int, err error');
          return editor.backspace();
        });
      });
      it('confirms a suggestion when the prefix case does not match', function() {
        runs(function() {
          expect(provider).toBeDefined();
          expect(provider.getSuggestions).not.toHaveBeenCalled();
          expect(autocompleteManager.displaySuggestions).not.toHaveBeenCalled();
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.setCursorScreenPosition([7, 0]);
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 1;
        });
        runs(function() {
          editor.insertText('    fmt.');
          editor.insertText('p');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.showSuggestionList.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus span.word') != null;
        });
        runs(function() {
          var suggestionListView;
          expect(provider.getSuggestions).toHaveBeenCalled();
          expect(provider.getSuggestions.calls.length).toBe(1);
          expect(provider.onDidInsertSuggestion).not.toHaveBeenCalled();
          expect(editorView.querySelector('.autocomplete-plus span.word').innerHTML).toBe('<span class="character-match">P</span>rint(<span class="snippet-completion">a ...interface{}</span>)');
          suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
          return atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
        });
        waitsFor(function() {
          return provider.onDidInsertSuggestion.calls.length === 1;
        });
        return runs(function() {
          expect(provider.onDidInsertSuggestion).toHaveBeenCalled();
          return expect(buffer.getTextInRange([[7, 4], [7, 9]])).toBe('fmt.P');
        });
      });
      it('confirms a suggestion when the prefix case does not match', function() {
        runs(function() {
          expect(provider).toBeDefined();
          expect(provider.getSuggestions).not.toHaveBeenCalled();
          expect(autocompleteManager.displaySuggestions).not.toHaveBeenCalled();
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.setCursorScreenPosition([7, 0]);
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 1;
        });
        runs(function() {
          editor.insertText('    fmt.p');
          editor.insertText('r');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.showSuggestionList.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus span.word') != null;
        });
        runs(function() {
          var suggestionListView;
          expect(provider.getSuggestions).toHaveBeenCalled();
          expect(provider.getSuggestions.calls.length).toBe(1);
          expect(provider.onDidInsertSuggestion).not.toHaveBeenCalled();
          expect(editorView.querySelector('.autocomplete-plus span.word').innerHTML).toBe('<span class="character-match">P</span><span class="character-match">r</span>int(<span class="snippet-completion">a ...interface{}</span>)');
          suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
          return atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
        });
        waitsFor(function() {
          return provider.onDidInsertSuggestion.calls.length === 1;
        });
        return runs(function() {
          expect(provider.onDidInsertSuggestion).toHaveBeenCalled();
          return expect(buffer.getTextInRange([[7, 4], [7, 10]])).toBe('fmt.Pr');
        });
      });
      xit('does not display suggestions when no gocode suggestions exist', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.setCursorScreenPosition([6, 15]);
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 1;
        });
        runs(function() {
          editor.insertText('w');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 2;
        });
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
      return it('does not display suggestions at the end of a line when no gocode suggestions exist', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.setCursorScreenPosition([5, 15]);
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 1;
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 0;
        });
        runs(function() {
          editor.insertText(')');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          return editor.insertText(';');
        });
        waitsFor(function() {
          autocompleteManager.displaySuggestions.calls.length === 1;
          return advanceClock(completionDelay);
        });
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvZ29jb2RlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxtQkFBUixDQUZiLENBQUE7O0FBQUEsRUFJQSxTQUFBLENBQVUsUUFBVixFQUFvQixTQUFBLEdBQUE7QUFDbEIsUUFBQSwwSUFBQTtBQUFBLElBQUEsT0FBeUksRUFBekksRUFBQywwQkFBRCxFQUFtQixnQkFBbkIsRUFBMkIsb0JBQTNCLEVBQXVDLGtCQUF2QyxFQUFpRCxnQkFBakQsRUFBeUQseUJBQXpELEVBQTBFLG9CQUExRSxFQUFzRiwwQkFBdEYsRUFBd0csNkJBQXhHLEVBQTZILGtCQUE3SCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxnQkFBQTtBQUFBLFFBQUEsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBQSxDQUFqQixDQUFBO0FBQUEsUUFDQSxVQUFVLENBQUMsd0JBQVgsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUlBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsRUFBMEQsSUFBMUQsQ0FKQSxDQUFBO0FBQUEsUUFLQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkNBQWhCLEVBQStELEtBQS9ELENBTEEsQ0FBQTtBQUFBLFFBT0EsZUFBQSxHQUFrQixHQVBsQixDQUFBO0FBQUEsUUFRQSxJQUFJLENBQUMs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

//# sourceURL=/home/vagrant/.atom/packages/go-plus/spec/gocode-spec.coffee
