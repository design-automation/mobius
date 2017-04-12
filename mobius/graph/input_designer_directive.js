mobius.directive('inputDesigner', [ 'hotkeys', 'executeService', 'generateCode', 'consoleMsg', '$rootScope', function(hotkeys, executeService, generateCode, consoleMsg, $rootScope) {
  return {
        restrict: 'E', 
        templateUrl: 'mobius/graph/templates/input_designer_tpl.html'
    }
}]);
