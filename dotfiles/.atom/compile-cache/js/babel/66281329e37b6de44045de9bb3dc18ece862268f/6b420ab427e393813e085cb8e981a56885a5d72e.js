'use babel';
'use strict';

var _this = this;

describe('AMU Font Options', function () {
    beforeEach(function () {
        _this.workspace = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(_this.workspace);

        waitsForPromise('Theme Activation', function () {
            return atom.packages.activatePackage('atom-material-ui');
        });
    });

    it('should be able to scale UI via font-size', function () {
        atom.config.set('atom-material-ui.fonts.fontSize', '18');
        expect(document.querySelector(':root').style.fontSize).toBe('18px');

        atom.config.set('atom-material-ui.fonts.fontSize', '16');
        expect(document.querySelector(':root').style.fontSize).toBe('16px');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZhZ3JhbnQvLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9zcGVjL3NldHRpbmdzLWZvbnQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7QUFDWixZQUFZLENBQUM7Ozs7QUFFYixRQUFRLENBQUMsa0JBQWtCLEVBQUUsWUFBTTtBQUMvQixjQUFVLENBQUMsWUFBTTtBQUNiLGNBQUssU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwRCxlQUFPLENBQUMsV0FBVyxDQUFDLE1BQUssU0FBUyxDQUFDLENBQUM7O0FBRXBDLHVCQUFlLENBQUMsa0JBQWtCLEVBQUUsWUFBTTtBQUN0QyxtQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1NBQzVELENBQUMsQ0FBQztLQUNOLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsMENBQTBDLEVBQUUsWUFBTTtBQUNqRCxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6RCxjQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVwRSxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6RCxjQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3ZFLENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS92YWdyYW50Ly5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvc3BlYy9zZXR0aW5ncy1mb250LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbid1c2Ugc3RyaWN0JztcblxuZGVzY3JpYmUoJ0FNVSBGb250IE9wdGlvbnMnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHRoaXMud29ya3NwYWNlID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh0aGlzLndvcmtzcGFjZSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCdUaGVtZSBBY3RpdmF0aW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdG9tLW1hdGVyaWFsLXVpJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIHNjYWxlIFVJIHZpYSBmb250LXNpemUnLCAoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1tYXRlcmlhbC11aS5mb250cy5mb250U2l6ZScsICcxOCcpO1xuICAgICAgICBleHBlY3QoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignOnJvb3QnKS5zdHlsZS5mb250U2l6ZSkudG9CZSgnMThweCcpO1xuXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1tYXRlcmlhbC11aS5mb250cy5mb250U2l6ZScsICcxNicpO1xuICAgICAgICBleHBlY3QoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignOnJvb3QnKS5zdHlsZS5mb250U2l6ZSkudG9CZSgnMTZweCcpO1xuICAgIH0pO1xufSk7XG4iXX0=
//# sourceURL=/home/vagrant/.atom/packages/atom-material-ui/spec/settings-font-spec.js
