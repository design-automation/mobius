mobius.directive('procedureDisplay', [ '$rootScope', function($rootScope) {
  return {
        restrict: 'E', 
        controller: 'procedureCtrl',
        templateUrl: 'mobius/procedure/template/procedureHTML.html'
    }
}]);
