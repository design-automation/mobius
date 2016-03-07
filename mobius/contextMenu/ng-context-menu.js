angular
    .module('ng-context-menu', [])
    .factory('ContextMenuService', function() {
      return {
        element: null,
        menuElement: null
      };
    })
    .directive('contextMenu', [
      '$document',
      'ContextMenuService',
      function($document, ContextMenuService) {
        return {
          restrict: 'A',
          scope: {
            'callback': '&contextMenu',
            'disabled': '&contextMenuDisabled',
            'closeCallback': '&contextMenuClose'
          },
          link: function($scope, $element, $attrs) {
            var opened = false;

            function open(event, menuElement) {
              menuElement.addClass('open');

              // fixme offset for menu
              var left = Math.max(event.pageX , 0),
                  top = Math.max(event.pageY - 24, 0);


              menuElement.css('top', top + 'px');
              menuElement.css('left', left + 'px');
              opened = true;
            }

            function close(menuElement) {
              menuElement.removeClass('open');

              if (opened) {
                $scope.closeCallback();
              }

              opened = false;
            }

            $element.bind('contextmenu', function(event) {
              if (!$scope.disabled()) {
                if (ContextMenuService.menuElement !== null) {
                  close(ContextMenuService.menuElement);
                }

                ContextMenuService.menuElement = angular.element(
                    document.getElementById($attrs.target)
                );
                ContextMenuService.element = event.target;

                event.preventDefault();
                event.stopPropagation();
                $scope.$apply(function() {
                  $scope.callback({ $event: event });
                });
                $scope.$apply(function() {
                  open(event, ContextMenuService.menuElement);
                });
              }
            });

            function handleKeyUpEvent(event) {
              if (!$scope.disabled() && opened && event.keyCode === 27) {
                $scope.$apply(function() {
                  close(ContextMenuService.menuElement);
                });
              }
            }

            function handleClickEvent(event) {
              if (!$scope.disabled() && opened &&
                  (event.button !== 2 || event.target !== ContextMenuService.element) ) {
                $scope.$apply(function() {
                  close(ContextMenuService.menuElement);
                });
              }
            }

            $document.bind('keyup', handleKeyUpEvent);
            $document.bind('click', handleClickEvent);
            $document.bind('contextmenu', handleClickEvent);
            $(document.getElementById($attrs.target)).bind('click', handleClickEvent);


            $scope.$on('$destroy', function() {
              $document.unbind('keyup', handleKeyUpEvent);
              $document.unbind('click', handleClickEvent);
              $document.unbind('contextmenu', handleClickEvent);
            });
          }
        };
      }
    ]);