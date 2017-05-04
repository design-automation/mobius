mobius.directive('procedureDisplay', [ '$rootScope', function($rootScope) {
  return {
        restrict: 'E', 
        controller: 'procedureCtrl',
        templateUrl: 'mobius/ui-components/procedure/template/procedureHTML.html'
    }
}]);
