//
// VIDAMO viewport controller for viewport directive
// This functions of viewport directive will be invoked through VIDAMO module
//

vidamo.controller('viewportCtrl',[
    '$scope',
    function($scope) {
        $scope.viewportControl = {};

        $scope.toggleFullCode = false;

        $scope.$on('toggleFullCode',function(){
            $scope.toggleFullCode = true;
        });

        $scope.closeFullCode = function(){
            $scope.toggleFullCode = false;
        }
    }
]);