//
// VIDAMO viewport controller for viewport directive
// This functions of viewport directive will be invoked through VIDAMO module
//

vidamo.controller('viewportCtrl',[
    '$scope',
    function($scope) {
        $scope.viewportControl = {};

        $scope.showGeometry = true;
        $scope.showFullCode = false;
        $scope.showData = false;

        $scope.toggleFullCode = function(){
            $scope.showGeometry = false;
            $scope.showFullCode = true;
            $scope.showData = false;

        };

        $scope.toggleGeometry = function(){
            $scope.showGeometry = true;
            $scope.showFullCode = false;
            $scope.showData = false;
        };

        $scope.toggleData = function(){
            $scope.showGeometry = false;
            $scope.showFullCode = false;
            $scope.showData = true;
        };
    }
]);