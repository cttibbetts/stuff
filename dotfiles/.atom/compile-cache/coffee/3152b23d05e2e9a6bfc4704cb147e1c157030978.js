(function() {
  var SplicerSplitter, _,
    __slice = [].slice;

  _ = require('underscore-plus');

  module.exports = SplicerSplitter = (function() {
    function SplicerSplitter() {}

    SplicerSplitter.prototype.splitAndSquashToArray = function(delimeter, arg) {
      var result;
      if (!((arg != null) && arg.length > 0)) {
        return [];
      }
      if (!((delimeter != null) && delimeter.length > 0)) {
        return [];
      }
      result = (function() {
        switch (delimeter) {
          case ' ':
            return arg.split(/[\s]+/);
          case ':':
            return arg.split(/[:]+/);
          case ';':
            return arg.split(/[;]+/);
          default:
            return [];
        }
      })();
      result = _.map(result, function(item) {
        if (item == null) {
          return '';
        }
        return item.trim();
      });
      return result = _.filter(result, function(item) {
        return (item != null) && item.length > 0 && item !== '';
      });
    };

    SplicerSplitter.prototype.spliceAndSquash = function() {
      var args, result;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (!((args != null) && args.length > 0)) {
        return '';
      }
      args = _.map.apply(_, __slice.call(args).concat([function(item) {
        if (item == null) {
          return '';
        }
        return item.trim();
      }]));
      args = _.filter(args, function(item) {
        return (item != null) && item.length > 0 && item.trim() !== '';
      });
      return result = args.join(' ');
    };

    return SplicerSplitter;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi91dGlsL3NwbGljZXJzcGxpdHRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtpQ0FDSjs7QUFBQSw4QkFBQSxxQkFBQSxHQUF1QixTQUFDLFNBQUQsRUFBWSxHQUFaLEdBQUE7QUFDckIsVUFBQSxNQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsQ0FBaUIsYUFBQSxJQUFTLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBdkMsQ0FBQTtBQUFBLGVBQU8sRUFBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxDQUFpQixtQkFBQSxJQUFlLFNBQVMsQ0FBQyxNQUFWLEdBQW1CLENBQW5ELENBQUE7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQURBO0FBQUEsTUFFQSxNQUFBO0FBQVMsZ0JBQU8sU0FBUDtBQUFBLGVBQ0YsR0FERTttQkFDTyxHQUFHLENBQUMsS0FBSixDQUFVLE9BQVYsRUFEUDtBQUFBLGVBRUYsR0FGRTttQkFFTyxHQUFHLENBQUMsS0FBSixDQUFVLE1BQVYsRUFGUDtBQUFBLGVBR0YsR0FIRTttQkFHTyxHQUFHLENBQUMsS0FBSixDQUFVLE1BQVYsRUFIUDtBQUFBO21CQUlGLEdBSkU7QUFBQTtVQUZULENBQUE7QUFBQSxNQU9BLE1BQUEsR0FBUyxDQUFDLENBQUMsR0FBRixDQUFNLE1BQU4sRUFBYyxTQUFDLElBQUQsR0FBQTtBQUNyQixRQUFBLElBQWlCLFlBQWpCO0FBQUEsaUJBQU8sRUFBUCxDQUFBO1NBQUE7QUFDQSxlQUFPLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBUCxDQUZxQjtNQUFBLENBQWQsQ0FQVCxDQUFBO2FBVUEsTUFBQSxHQUFTLENBQUMsQ0FBQyxNQUFGLENBQVMsTUFBVCxFQUFpQixTQUFDLElBQUQsR0FBQTtlQUFVLGNBQUEsSUFBVSxJQUFJLENBQUMsTUFBTCxHQUFjLENBQXhCLElBQThCLElBQUEsS0FBVSxHQUFsRDtNQUFBLENBQWpCLEVBWFk7SUFBQSxDQUF2QixDQUFBOztBQUFBLDhCQWFBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxZQUFBO0FBQUEsTUFEZ0IsOERBQ2hCLENBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUFpQixjQUFBLElBQVUsSUFBSSxDQUFDLE1BQUwsR0FBYyxDQUF6QyxDQUFBO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLENBQUMsQ0FBQyxHQUFGLFVBQU0sYUFBQSxJQUFBLENBQUEsUUFBUyxDQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ3BCLFFBQUEsSUFBaUIsWUFBakI7QUFBQSxpQkFBTyxFQUFQLENBQUE7U0FBQTtBQUNBLGVBQU8sSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFQLENBRm9CO01BQUEsQ0FBQSxDQUFULENBQU4sQ0FEUCxDQUFBO0FBQUEsTUFJQSxJQUFBLEdBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsU0FBQyxJQUFELEdBQUE7ZUFBVSxjQUFBLElBQVUsSUFBSSxDQUFDLE1BQUwsR0FBYyxDQUF4QixJQUE4QixJQUFJLENBQUMsSUFBTCxDQUFBLENBQUEsS0FBaUIsR0FBekQ7TUFBQSxDQUFmLENBSlAsQ0FBQTthQUtBLE1BQUEsR0FBUyxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsRUFOTTtJQUFBLENBYmpCLENBQUE7OzJCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/util/splicersplitter.coffee
