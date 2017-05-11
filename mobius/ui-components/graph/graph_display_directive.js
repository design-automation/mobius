//
//  display the parameters of the selected node
//
mobius.directive('graphDisplay', [ '$rootScope', function($rootScope) {
  return {
        restrict: 'E', 
        templateUrl: 'mobius/ui-components/graph/templates/graph-display-tpl.html',
        controller: 'graphCtrl',
        link: function ($scope, element, attrs) {

                        $scope.extendCanvas = function () {
                            $rootScope.$broadcast("Extend");
                        };
                }
    }
}]);
