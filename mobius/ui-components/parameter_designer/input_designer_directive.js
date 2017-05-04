mobius.directive('inputDesigner', [ 'hotkeys', 'executeService', 'generateCode', 'consoleMsg', '$rootScope', function(hotkeys, executeService, generateCode, consoleMsg, $rootScope) {
  return {
        restrict: 'E', 
        templateUrl: 'mobius/ui-components/parameter_designer/input_designer_tpl.html'
    }
}]);
