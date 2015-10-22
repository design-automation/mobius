//
// VIDAMO viewport controller for viewport directive
// This functions of viewport directive will be invoked through VIDAMO module
//

vidamo.controller('viewportCtrl',[
    '$scope',
    function($scope) {
        $scope.viewportControl = {
            "geometryData":[{Property:'', Value:'',attachedTo:''}]
        };

        $scope.showGeometry = true;
        $scope.showFullCode = false;
        $scope.showData = false;


        $scope.toggleFullCode = function(){
            $scope.showGeometry = false;
            $scope.showFullCode = true;
            $scope.showData = false;
            document.getElementById("threeViewport").style.display = "none";
        };

        $scope.toggleGeometry = function(){
            $scope.showGeometry = true;
            $scope.showFullCode = false;
            $scope.showData = false;
            document.getElementById("threeViewport").style.display = "inline";
        };

        $scope.toggleData = function(){
            $scope.showGeometry = false;
            $scope.showFullCode = false;
            $scope.showData = true;
            document.getElementById("threeViewport").style.display = "none";
        };
    }
]);