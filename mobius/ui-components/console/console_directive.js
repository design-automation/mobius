//
//  display the parameters of the selected node
//
mobius.directive('console', [ 'hotkeys', 'executeService', 'generateCode', 'consoleMsg', '$rootScope', function(hotkeys, executeService, generateCode, consoleMsg, $rootScope) {
  return {
        restrict: 'E', 
        controller: 'consoleCtrl',
        template: '<div class="doormat" ng-dblclick="showConsole()">\
                                    <div style="display: inline-block;">Console</div>\
                                    <button class="button"\
                                            id = "clear"\
                                            title="clear console"\
                                            ng-click="clearConsole()"\
                                            style="position: absolute; right: 2px;">\
                                        <i class="fa fa-eraser"></i>\
                                    </button>\
                                 </div>\
                                 <div class="console" id ="log">\
                        </div>'
    }
}]);
