(function() {
  var PathHelper, os;

  os = require('os');

  module.exports = PathHelper = (function() {
    function PathHelper() {}

    PathHelper.prototype.home = function() {
      switch (os.platform()) {
        case 'darwin':
        case 'freebsd':
        case 'linux':
        case 'sunos':
          return process.env.HOME;
        case 'win32':
          return process.env.USERPROFILE;
      }
    };

    return PathHelper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvdXRpbC9wYXRoaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007NEJBRUo7O0FBQUEseUJBQUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLGNBQU8sRUFBRSxDQUFDLFFBQUgsQ0FBQSxDQUFQO0FBQUEsYUFDTyxRQURQO0FBQUEsYUFDaUIsU0FEakI7QUFBQSxhQUM0QixPQUQ1QjtBQUFBLGFBQ3FDLE9BRHJDO0FBRUksaUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFuQixDQUZKO0FBQUEsYUFHTyxPQUhQO0FBSUksaUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFuQixDQUpKO0FBQUEsT0FESTtJQUFBLENBQU4sQ0FBQTs7c0JBQUE7O01BTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/vagrant/.atom/packages/go-plus/spec/util/pathhelper.coffee
