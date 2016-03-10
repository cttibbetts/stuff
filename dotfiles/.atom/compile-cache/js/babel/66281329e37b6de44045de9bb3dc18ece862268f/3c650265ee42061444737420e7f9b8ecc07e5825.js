Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _configSchema = require('./config-schema');

var _configSchema2 = _interopRequireDefault(_configSchema);

var _amuSettings = require('./amu-settings');

var _amuSettings2 = _interopRequireDefault(_amuSettings);

var _amuColorSettings = require('./amu-color-settings');

var _amuColorSettings2 = _interopRequireDefault(_amuColorSettings);

var _amuBindings = require('./amu-bindings');

var _amuBindings2 = _interopRequireDefault(_amuBindings);

var _tinycolor2 = require('tinycolor2');

var _tinycolor22 = _interopRequireDefault(_tinycolor2);

var _atomSpacePenViews = require('atom-space-pen-views');

var _atomSpacePenViews2 = _interopRequireDefault(_atomSpacePenViews);

'use babel';
'use strict';

var treeViews;

var setTreeViews = function setTreeViews() {
    setImmediate(function () {
        treeViews = [document.querySelector('.tree-view-resizer'), document.querySelector('.remote-ftp-view'), (function () {
            if (document.querySelector('.nuclide-file-tree')) {
                return document.querySelector('.nuclide-file-tree').parentElement.parentElement.parentElement;
            }
        })()];
    });
};

var removeBlendingEl = function removeBlendingEl() {
    setTreeViews();
    treeViews.forEach(function (treeView) {
        if (treeView) {
            var blendingEl = treeView.querySelector('.tabBlender');

            if (blendingEl) {
                treeView.removeChild(blendingEl);
            }
        }
    });
};

atom.workspace.onDidAddPane(function () {
    setImmediate(function () {
        return _amuBindings2['default'].apply();
    });
});

exports['default'] = {
    config: _configSchema2['default'],

    toggleClass: function toggleClass(boolean, className) {
        var root = document.querySelector('atom-workspace');

        if (boolean) {
            root.classList.add(className);
        } else {
            root.classList.remove(className);
        }
    },

    writeConfig: function writeConfig(options) {
        var accentColor = atom.config.get('atom-material-ui.colors.accentColor').toRGBAString();
        var baseColor = atom.config.get('atom-material-ui.colors.abaseColor').toRGBAString();
        var accentTextColor = '#666';
        var luminance = (0, _tinycolor22['default'])(baseColor).getLuminance();

        if (luminance <= 0.3 && luminance > 0.22) {
            accentTextColor = 'rgba(255,255,255,0.9)';
        } else if (luminance <= 0.22) {
            accentTextColor = 'rgba(255,255,255,0.8)';
        } else if (luminance > 0.3) {
            accentTextColor = 'rgba(0,0,0,0.6)';
        }

        /**
        * This is kind of against Airbnb's stylguide, but produces a much
        * better output and is readable.
        */
        var config = '@accent-color: ' + accentColor + ';\n' + ('@accent-text-color: ' + accentTextColor + ';\n') + ('@base-color: ' + baseColor + ';\n');

        _fs2['default'].writeFile(__dirname + '/../styles/custom.less', config, 'utf8', function () {
            if (!options || !options.noReload) {
                var themePack = atom.packages.getLoadedPackage('atom-material-ui');

                if (themePack) {
                    themePack.deactivate();
                    setImmediate(function () {
                        return themePack.activate();
                    });
                }
            }
            if (options && options.callback && typeof options.callback === 'function') {
                options.callback();
            }
        });
    },

    toggleBlendTreeView: function toggleBlendTreeView(bool) {
        var _this = this;

        setTreeViews();
        setImmediate(function () {
            treeViews.forEach(function (treeView) {
                if (treeView) {
                    var blendingEl = document.createElement('div');
                    var title = document.createElement('span');

                    blendingEl.classList.add('tabBlender');
                    blendingEl.appendChild(title);

                    if (treeView && bool) {
                        if (treeView.querySelector('.tabBlender')) {
                            removeBlendingEl();
                        }
                        treeView.insertBefore(blendingEl, treeView.firstChild);
                    } else if (treeView && !bool) {
                        removeBlendingEl();
                    } else if (!treeView && bool) {
                        if (atom.packages.getActivePackage('tree-view') || atom.packages.getActivePackage('Remote-FTP') || atom.packages.getActivePackage('nuclide')) {
                            return setTimeout(function () {
                                _this.toggleBlendTreeView(bool);
                                setImmediate(function () {
                                    return _amuBindings2['default'].apply();
                                });
                            }, 2000);
                        }
                    }
                }
            });
        });
    },

    activate: function activate() {
        _amuSettings2['default'].apply();
        _amuColorSettings2['default'].apply();
        setImmediate(function () {
            return _amuBindings2['default'].apply();
        });
        this.writeConfig({ noReload: true });
    },

    deactivate: function deactivate() {
        this.toggleBlendTreeView(false);
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZhZ3JhbnQvLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBR2UsSUFBSTs7Ozs0QkFDQSxpQkFBaUI7Ozs7MkJBQ1osZ0JBQWdCOzs7O2dDQUNYLHNCQUFzQjs7OzsyQkFDM0IsZ0JBQWdCOzs7OzBCQUNsQixZQUFZOzs7O2lDQUNwQixzQkFBc0I7Ozs7QUFUcEMsV0FBVyxDQUFDO0FBQ1osWUFBWSxDQUFDOztBQVViLElBQUksU0FBUyxDQUFDOztBQUVkLElBQUksWUFBWSxHQUFHLFNBQWYsWUFBWSxHQUFjO0FBQzFCLGdCQUFZLENBQUMsWUFBTTtBQUNmLGlCQUFTLEdBQUcsQ0FDUixRQUFRLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLEVBQzVDLFFBQVEsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsRUFDMUMsQ0FBQSxZQUFZO0FBQ1IsZ0JBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO0FBQzlDLHVCQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQzthQUNqRztTQUNKLENBQUEsRUFBRSxDQUNOLENBQUM7S0FDTCxDQUFDLENBQUM7Q0FDTixDQUFDOztBQUVGLElBQUksZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLEdBQWM7QUFDOUIsZ0JBQVksRUFBRSxDQUFDO0FBQ2YsYUFBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUM1QixZQUFJLFFBQVEsRUFBRTtBQUNWLGdCQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUV2RCxnQkFBSSxVQUFVLEVBQUU7QUFDWix3QkFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNwQztTQUNKO0tBQ0osQ0FBQyxDQUFDO0NBQ04sQ0FBQzs7QUFFRixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQzlCLGdCQUFZLENBQUM7ZUFBTSx5QkFBWSxLQUFLLEVBQUU7S0FBQSxDQUFDLENBQUM7Q0FDM0MsQ0FBQyxDQUFDOztxQkFFWTtBQUNYLFVBQU0sMkJBQUE7O0FBRU4sZUFBVyxFQUFBLHFCQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7QUFDNUIsWUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUVwRCxZQUFJLE9BQU8sRUFBRTtBQUNULGdCQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNqQyxNQUFNO0FBQ0gsZ0JBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3BDO0tBQ0o7O0FBRUQsZUFBVyxFQUFBLHFCQUFDLE9BQU8sRUFBRTtBQUNqQixZQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3hGLFlBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDckYsWUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQzdCLFlBQUksU0FBUyxHQUFHLDZCQUFVLFNBQVMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDOztBQUVwRCxZQUFJLFNBQVMsSUFBSSxHQUFHLElBQUksU0FBUyxHQUFHLElBQUksRUFBRTtBQUN0QywyQkFBZSxHQUFHLHVCQUF1QixDQUFDO1NBQzdDLE1BQU0sSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0FBQzFCLDJCQUFlLEdBQUcsdUJBQXVCLENBQUM7U0FDN0MsTUFBTSxJQUFJLFNBQVMsR0FBRyxHQUFHLEVBQUU7QUFDeEIsMkJBQWUsR0FBRyxpQkFBaUIsQ0FBQztTQUN2Qzs7Ozs7O0FBTUQsWUFBSSxNQUFNLEdBQUcsb0JBQWtCLFdBQVcscUNBQ04sZUFBZSxTQUFLLHNCQUMzQixTQUFTLFNBQUssQ0FBQzs7QUFFNUMsd0JBQUcsU0FBUyxDQUFJLFNBQVMsNkJBQTBCLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBTTtBQUNyRSxnQkFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7QUFDL0Isb0JBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFbkUsb0JBQUksU0FBUyxFQUFFO0FBQ1gsNkJBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUN2QixnQ0FBWSxDQUFDOytCQUFNLFNBQVMsQ0FBQyxRQUFRLEVBQUU7cUJBQUEsQ0FBQyxDQUFDO2lCQUM1QzthQUNKO0FBQ0QsZ0JBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxPQUFPLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUN2RSx1QkFBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQ3RCO1NBQ0osQ0FBQyxDQUFDO0tBQ047O0FBRUQsdUJBQW1CLEVBQUEsNkJBQUMsSUFBSSxFQUFFOzs7QUFDdEIsb0JBQVksRUFBRSxDQUFDO0FBQ2Ysb0JBQVksQ0FBQyxZQUFNO0FBQ2YscUJBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDNUIsb0JBQUksUUFBUSxFQUFFO0FBQ1Ysd0JBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0Msd0JBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTNDLDhCQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2Qyw4QkFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFOUIsd0JBQUksUUFBUSxJQUFJLElBQUksRUFBRTtBQUNsQiw0QkFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxFQUFFO0FBQ3ZDLDRDQUFnQixFQUFFLENBQUM7eUJBQ3RCO0FBQ0QsZ0NBQVEsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztxQkFDMUQsTUFBTSxJQUFJLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtBQUMxQix3Q0FBZ0IsRUFBRSxDQUFDO3FCQUN0QixNQUFNLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO0FBQzFCLDRCQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQzFJLG1DQUFPLFVBQVUsQ0FBQyxZQUFNO0FBQ3BCLHNDQUFLLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLDRDQUFZLENBQUM7MkNBQU0seUJBQVksS0FBSyxFQUFFO2lDQUFBLENBQUMsQ0FBQzs2QkFDM0MsRUFBRSxJQUFJLENBQUMsQ0FBQzt5QkFDWjtxQkFDSjtpQkFDSjthQUNKLENBQUMsQ0FBQztTQUNOLENBQUMsQ0FBQztLQUNOOztBQUVELFlBQVEsRUFBQSxvQkFBRztBQUNQLGlDQUFZLEtBQUssRUFBRSxDQUFDO0FBQ3BCLHNDQUFpQixLQUFLLEVBQUUsQ0FBQztBQUN6QixvQkFBWSxDQUFDO21CQUFNLHlCQUFZLEtBQUssRUFBRTtTQUFBLENBQUMsQ0FBQztBQUN4QyxZQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDeEM7O0FBRUQsY0FBVSxFQUFBLHNCQUFHO0FBQ1QsWUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ25DO0NBQ0oiLCJmaWxlIjoiL2hvbWUvdmFncmFudC8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLXNjaGVtYSc7XG5pbXBvcnQgYW11U2V0dGluZ3MgZnJvbSAnLi9hbXUtc2V0dGluZ3MnO1xuaW1wb3J0IGFtdUNvbG9yU2V0dGluZ3MgZnJvbSAnLi9hbXUtY29sb3Itc2V0dGluZ3MnO1xuaW1wb3J0IGFtdUJpbmRpbmdzIGZyb20gJy4vYW11LWJpbmRpbmdzJztcbmltcG9ydCB0aW55Y29sb3IgZnJvbSAndGlueWNvbG9yMic7XG5pbXBvcnQgJCBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5cbnZhciB0cmVlVmlld3M7XG5cbnZhciBzZXRUcmVlVmlld3MgPSBmdW5jdGlvbigpIHtcbiAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgICB0cmVlVmlld3MgPSBbXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHJlZS12aWV3LXJlc2l6ZXInKSxcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZW1vdGUtZnRwLXZpZXcnKSxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm51Y2xpZGUtZmlsZS10cmVlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5udWNsaWRlLWZpbGUtdHJlZScpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0oKVxuICAgICAgICBdO1xuICAgIH0pO1xufTtcblxudmFyIHJlbW92ZUJsZW5kaW5nRWwgPSBmdW5jdGlvbigpIHtcbiAgICBzZXRUcmVlVmlld3MoKTtcbiAgICB0cmVlVmlld3MuZm9yRWFjaCgodHJlZVZpZXcpID0+IHtcbiAgICAgICAgaWYgKHRyZWVWaWV3KSB7XG4gICAgICAgICAgICB2YXIgYmxlbmRpbmdFbCA9IHRyZWVWaWV3LnF1ZXJ5U2VsZWN0b3IoJy50YWJCbGVuZGVyJyk7XG5cbiAgICAgICAgICAgIGlmIChibGVuZGluZ0VsKSB7XG4gICAgICAgICAgICAgICAgdHJlZVZpZXcucmVtb3ZlQ2hpbGQoYmxlbmRpbmdFbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmF0b20ud29ya3NwYWNlLm9uRGlkQWRkUGFuZSgoKSA9PiB7XG4gICAgc2V0SW1tZWRpYXRlKCgpID0+IGFtdUJpbmRpbmdzLmFwcGx5KCkpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBjb25maWcsXG5cbiAgICB0b2dnbGVDbGFzcyhib29sZWFuLCBjbGFzc05hbWUpIHtcbiAgICAgICAgdmFyIHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhdG9tLXdvcmtzcGFjZScpO1xuXG4gICAgICAgIGlmIChib29sZWFuKSB7XG4gICAgICAgICAgICByb290LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJvb3QuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHdyaXRlQ29uZmlnKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGFjY2VudENvbG9yID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hY2NlbnRDb2xvcicpLnRvUkdCQVN0cmluZygpO1xuICAgICAgICB2YXIgYmFzZUNvbG9yID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hYmFzZUNvbG9yJykudG9SR0JBU3RyaW5nKCk7XG4gICAgICAgIHZhciBhY2NlbnRUZXh0Q29sb3IgPSAnIzY2Nic7XG4gICAgICAgIHZhciBsdW1pbmFuY2UgPSB0aW55Y29sb3IoYmFzZUNvbG9yKS5nZXRMdW1pbmFuY2UoKTtcblxuICAgICAgICBpZiAobHVtaW5hbmNlIDw9IDAuMyAmJiBsdW1pbmFuY2UgPiAwLjIyKSB7XG4gICAgICAgICAgICBhY2NlbnRUZXh0Q29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwLjkpJztcbiAgICAgICAgfSBlbHNlIGlmIChsdW1pbmFuY2UgPD0gMC4yMikge1xuICAgICAgICAgICAgYWNjZW50VGV4dENvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMC44KSc7XG4gICAgICAgIH0gZWxzZSBpZiAobHVtaW5hbmNlID4gMC4zKSB7XG4gICAgICAgICAgICBhY2NlbnRUZXh0Q29sb3IgPSAncmdiYSgwLDAsMCwwLjYpJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIFRoaXMgaXMga2luZCBvZiBhZ2FpbnN0IEFpcmJuYidzIHN0eWxndWlkZSwgYnV0IHByb2R1Y2VzIGEgbXVjaFxuICAgICAgICAqIGJldHRlciBvdXRwdXQgYW5kIGlzIHJlYWRhYmxlLlxuICAgICAgICAqL1xuICAgICAgICB2YXIgY29uZmlnID0gYEBhY2NlbnQtY29sb3I6ICR7YWNjZW50Q29sb3J9O1xcbmAgK1xuICAgICAgICAgICAgICAgICAgICAgYEBhY2NlbnQtdGV4dC1jb2xvcjogJHthY2NlbnRUZXh0Q29sb3J9O1xcbmAgK1xuICAgICAgICAgICAgICAgICAgICAgYEBiYXNlLWNvbG9yOiAke2Jhc2VDb2xvcn07XFxuYDtcblxuICAgICAgICBmcy53cml0ZUZpbGUoYCR7X19kaXJuYW1lfS8uLi9zdHlsZXMvY3VzdG9tLmxlc3NgLCBjb25maWcsICd1dGY4JywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLm5vUmVsb2FkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoZW1lUGFjayA9IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZSgnYXRvbS1tYXRlcmlhbC11aScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoZW1lUGFjaykge1xuICAgICAgICAgICAgICAgICAgICB0aGVtZVBhY2suZGVhY3RpdmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4gdGhlbWVQYWNrLmFjdGl2YXRlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuY2FsbGJhY2sgJiYgdHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB0b2dnbGVCbGVuZFRyZWVWaWV3KGJvb2wpIHtcbiAgICAgICAgc2V0VHJlZVZpZXdzKCk7XG4gICAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiB7XG4gICAgICAgICAgICB0cmVlVmlld3MuZm9yRWFjaCgodHJlZVZpZXcpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodHJlZVZpZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsZW5kaW5nRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG4gICAgICAgICAgICAgICAgICAgIGJsZW5kaW5nRWwuY2xhc3NMaXN0LmFkZCgndGFiQmxlbmRlcicpO1xuICAgICAgICAgICAgICAgICAgICBibGVuZGluZ0VsLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHJlZVZpZXcgJiYgYm9vbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRyZWVWaWV3LnF1ZXJ5U2VsZWN0b3IoJy50YWJCbGVuZGVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVCbGVuZGluZ0VsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmVlVmlldy5pbnNlcnRCZWZvcmUoYmxlbmRpbmdFbCwgdHJlZVZpZXcuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHJlZVZpZXcgJiYgIWJvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUJsZW5kaW5nRWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdHJlZVZpZXcgJiYgYm9vbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgndHJlZS12aWV3JykgfHwgYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdSZW1vdGUtRlRQJykgfHwgYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdudWNsaWRlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlQmxlbmRUcmVlVmlldyhib29sKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW1tZWRpYXRlKCgpID0+IGFtdUJpbmRpbmdzLmFwcGx5KCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDIwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhY3RpdmF0ZSgpIHtcbiAgICAgICAgYW11U2V0dGluZ3MuYXBwbHkoKTtcbiAgICAgICAgYW11Q29sb3JTZXR0aW5ncy5hcHBseSgpO1xuICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4gYW11QmluZGluZ3MuYXBwbHkoKSk7XG4gICAgICAgIHRoaXMud3JpdGVDb25maWcoeyBub1JlbG9hZDogdHJ1ZSB9KTtcbiAgICB9LFxuXG4gICAgZGVhY3RpdmF0ZSgpIHtcbiAgICAgICAgdGhpcy50b2dnbGVCbGVuZFRyZWVWaWV3KGZhbHNlKTtcbiAgICB9XG59O1xuIl19
//# sourceURL=/home/vagrant/.atom/packages/atom-material-ui/lib/main.js
