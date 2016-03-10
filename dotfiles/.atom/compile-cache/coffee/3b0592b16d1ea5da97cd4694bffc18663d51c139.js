(function() {
  var GocoverParser, Range, fs, _;

  Range = require('atom').Range;

  _ = require('underscore-plus');

  fs = require('fs-plus');

  module.exports = GocoverParser = (function() {
    function GocoverParser() {}

    GocoverParser.prototype.setDataFile = function(file) {
      return this.dataFile = file;
    };

    GocoverParser.prototype.rangesForFile = function(file) {
      var ranges;
      ranges = this.ranges(this.dataFile);
      return _.filter(ranges, function(r) {
        return _.endsWith(file, r.file);
      });
    };

    GocoverParser.prototype.ranges = function(dataFile) {
      var data, error, extract, match, pattern, ranges;
      try {
        data = fs.readFileSync(dataFile, {
          encoding: 'utf8'
        });
      } catch (_error) {
        error = _error;
        return [];
      }
      ranges = [];
      pattern = /^(.+):(\d+).(\d+),(\d+).(\d+) (\d+) (\d+)$/img;
      extract = function(match) {
        var count, filePath, range, statements;
        if (match == null) {
          return;
        }
        filePath = match[1];
        statements = match[6];
        count = match[7];
        range = new Range([parseInt(match[2]) - 1, parseInt(match[3]) - 1], [parseInt(match[4]) - 1, parseInt(match[5]) - 1]);
        return ranges.push({
          range: range,
          count: parseInt(count),
          file: filePath
        });
      };
      while (true) {
        match = pattern.exec(data);
        extract(match);
        if (match == null) {
          break;
        }
      }
      return ranges;
    };

    return GocoverParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL2xpYi9nb2NvdmVyL2dvY292ZXItcGFyc2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNOytCQUNKOztBQUFBLDRCQUFBLFdBQUEsR0FBYSxTQUFDLElBQUQsR0FBQTthQUNYLElBQUMsQ0FBQSxRQUFELEdBQVksS0FERDtJQUFBLENBQWIsQ0FBQTs7QUFBQSw0QkFHQSxhQUFBLEdBQWUsU0FBQyxJQUFELEdBQUE7QUFDYixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsTUFBRCxDQUFRLElBQUMsQ0FBQSxRQUFULENBQVQsQ0FBQTthQUNBLENBQUMsQ0FBQyxNQUFGLENBQVMsTUFBVCxFQUFpQixTQUFDLENBQUQsR0FBQTtlQUFPLENBQUMsQ0FBQyxRQUFGLENBQVcsSUFBWCxFQUFpQixDQUFDLENBQUMsSUFBbkIsRUFBUDtNQUFBLENBQWpCLEVBRmE7SUFBQSxDQUhmLENBQUE7O0FBQUEsNEJBT0EsTUFBQSxHQUFRLFNBQUMsUUFBRCxHQUFBO0FBQ04sVUFBQSw0Q0FBQTtBQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsUUFBaEIsRUFBMEI7QUFBQSxVQUFDLFFBQUEsRUFBVSxNQUFYO1NBQTFCLENBQVAsQ0FERjtPQUFBLGNBQUE7QUFHRSxRQURJLGNBQ0osQ0FBQTtBQUFBLGVBQU8sRUFBUCxDQUhGO09BQUE7QUFBQSxNQUtBLE1BQUEsR0FBUyxFQUxULENBQUE7QUFBQSxNQVFBLE9BQUEsR0FBVSwrQ0FSVixDQUFBO0FBQUEsTUFVQSxPQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixZQUFBLGtDQUFBO0FBQUEsUUFBQSxJQUFjLGFBQWQ7QUFBQSxnQkFBQSxDQUFBO1NBQUE7QUFBQSxRQUNBLFFBQUEsR0FBVyxLQUFNLENBQUEsQ0FBQSxDQURqQixDQUFBO0FBQUEsUUFFQSxVQUFBLEdBQWEsS0FBTSxDQUFBLENBQUEsQ0FGbkIsQ0FBQTtBQUFBLFFBR0EsS0FBQSxHQUFRLEtBQU0sQ0FBQSxDQUFBLENBSGQsQ0FBQTtBQUFBLFFBSUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNLENBQUMsUUFBQSxDQUFTLEtBQU0sQ0FBQSxDQUFBLENBQWYsQ0FBQSxHQUFxQixDQUF0QixFQUF5QixRQUFBLENBQVMsS0FBTSxDQUFBLENBQUEsQ0FBZixDQUFBLEdBQXFCLENBQTlDLENBQU4sRUFBd0QsQ0FBQyxRQUFBLENBQVMsS0FBTSxDQUFBLENBQUEsQ0FBZixDQUFBLEdBQXFCLENBQXRCLEVBQXlCLFFBQUEsQ0FBUyxLQUFNLENBQUEsQ0FBQSxDQUFmLENBQUEsR0FBcUIsQ0FBOUMsQ0FBeEQsQ0FKWixDQUFBO2VBS0EsTUFBTSxDQUFDLElBQVAsQ0FBWTtBQUFBLFVBQUMsS0FBQSxFQUFPLEtBQVI7QUFBQSxVQUFlLEtBQUEsRUFBTyxRQUFBLENBQVMsS0FBVCxDQUF0QjtBQUFBLFVBQXVDLElBQUEsRUFBTSxRQUE3QztTQUFaLEVBTlE7TUFBQSxDQVZWLENBQUE7QUFpQkEsYUFBQSxJQUFBLEdBQUE7QUFDRSxRQUFBLEtBQUEsR0FBUSxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsQ0FBUixDQUFBO0FBQUEsUUFDQSxPQUFBLENBQVEsS0FBUixDQURBLENBQUE7QUFFQSxRQUFBLElBQWEsYUFBYjtBQUFBLGdCQUFBO1NBSEY7TUFBQSxDQWpCQTthQXNCQSxPQXZCTTtJQUFBLENBUFIsQ0FBQTs7eUJBQUE7O01BTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/vagrant/.atom/packages/go-plus/lib/gocover/gocover-parser.coffee
