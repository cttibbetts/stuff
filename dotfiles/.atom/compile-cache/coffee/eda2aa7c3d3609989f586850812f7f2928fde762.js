(function() {
  module.exports = {
    config: {
      preview: {
        type: 'string',
        "default": 'The Quick brown fox { 0 !== "O" }'
      },
      fontFamily: {
        description: 'Use one of the fonts available in this package.',
        type: 'string',
        "default": 'Source Code Pro',
        "enum": ['Anka/Coder', 'Anonymous Pro', 'Aurulent Sans Mono', 'Average Mono', 'BPmono', 'Bitstream Vera Sans Mono', 'CamingoCode', 'Code New Roman', 'Consolamono', 'Cousine', 'Cutive Mono', 'DejaVu Mono', 'Droid Sans Mono', 'Effects Eighty', 'Fantasque Sans Mono', 'Fifteen', 'Fira Mono', 'FiraCode', 'Fixedsys', 'GNU Freefont', 'GNU Unifont', 'Generic Mono', 'Gohufont 11', 'Gohufont 14', 'Hack', 'Hasklig', 'Hermit Light', 'Hermit', 'Inconsolata', 'Inconsolata-g', 'Iosevka', 'Iosevka Thin', 'Iosevka Light', 'Iosevka Extra Light', 'Iosevka Medium', 'Latin Modern Mono Light', 'Latin Modern Mono', 'Lekton', 'Liberation Mono', 'Luxi Mono', 'M+ Light', 'M+ Medium', 'M+ Thin', 'M+', 'Meslo', 'Monofur', 'Monoid', 'NotCourierSans', 'Nova Mono', 'Office Code Pro', 'Office Code Pro Light', 'Office Code Pro Medium', 'Oxygen Mono', 'PT Mono', 'Profont', 'Proggy Clean', 'Quinze', 'Roboto Mono', 'Roboto Mono Light', 'Roboto Mono Thin', 'Roboto Mono Medium', 'Share Tech Mono', 'Source Code Pro Extra Light', 'Source Code Pro Light', 'Source Code Pro Medium', 'Source Code Pro', 'Sudo', 'TeX Gyre Cursor', 'Ubuntu Mono', 'VT323', 'Verily Serif Mono', 'saxMono']
      }
    },
    activate: function(state) {
      return atom.packages.onDidActivateInitialPackages(function() {
        var Runner;
        Runner = require('./runner');
        return Runner.run();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9mb250cy9saWIvZm9udHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLG1DQURUO09BREY7QUFBQSxNQUdBLFVBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLGlEQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsU0FBQSxFQUFTLGlCQUZUO0FBQUEsUUFHQSxNQUFBLEVBQU0sQ0FDSixZQURJLEVBRUosZUFGSSxFQUdKLG9CQUhJLEVBSUosY0FKSSxFQUtKLFFBTEksRUFNSiwwQkFOSSxFQU9KLGFBUEksRUFRSixnQkFSSSxFQVNKLGFBVEksRUFVSixTQVZJLEVBV0osYUFYSSxFQVlKLGFBWkksRUFhSixpQkFiSSxFQWNKLGdCQWRJLEVBZUoscUJBZkksRUFnQkosU0FoQkksRUFpQkosV0FqQkksRUFrQkosVUFsQkksRUFtQkosVUFuQkksRUFvQkosY0FwQkksRUFxQkosYUFyQkksRUFzQkosY0F0QkksRUF1QkosYUF2QkksRUF3QkosYUF4QkksRUF5QkosTUF6QkksRUEwQkosU0ExQkksRUEyQkosY0EzQkksRUE0QkosUUE1QkksRUE2QkosYUE3QkksRUE4QkosZUE5QkksRUErQkosU0EvQkksRUFnQ0osY0FoQ0ksRUFpQ0osZUFqQ0ksRUFrQ0oscUJBbENJLEVBbUNKLGdCQW5DSSxFQW9DSix5QkFwQ0ksRUFxQ0osbUJBckNJLEVBc0NKLFFBdENJLEVBdUNKLGlCQXZDSSxFQXdDSixXQXhDSSxFQXlDSixVQXpDSSxFQTBDSixXQTFDSSxFQTJDSixTQTNDSSxFQTRDSixJQTVDSSxFQTZDSixPQTdDSSxFQThDSixTQTlDSSxFQStDSixRQS9DSSxFQWdESixnQkFoREksRUFpREosV0FqREksRUFrREosaUJBbERJLEVBbURKLHVCQW5ESSxFQW9ESix3QkFwREksRUFxREosYUFyREksRUFzREosU0F0REksRUF1REosU0F2REksRUF3REosY0F4REksRUF5REosUUF6REksRUEwREosYUExREksRUEyREosbUJBM0RJLEVBNERKLGtCQTVESSxFQTZESixvQkE3REksRUE4REosaUJBOURJLEVBK0RKLDZCQS9ESSxFQWdFSix1QkFoRUksRUFpRUosd0JBakVJLEVBa0VKLGlCQWxFSSxFQW1FSixNQW5FSSxFQW9FSixpQkFwRUksRUFxRUosYUFyRUksRUFzRUosT0F0RUksRUF1RUosbUJBdkVJLEVBd0VKLFNBeEVJLENBSE47T0FKRjtLQURGO0FBQUEsSUFtRkEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBR1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyw0QkFBZCxDQUEyQyxTQUFBLEdBQUE7QUFDekMsWUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBO2VBQ0EsTUFBTSxDQUFDLEdBQVAsQ0FBQSxFQUZ5QztNQUFBLENBQTNDLEVBSFE7SUFBQSxDQW5GVjtHQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/vagrant/.atom/packages/fonts/lib/fonts.coffee
