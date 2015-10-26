//
// VIDAMO viewport controller for viewport directive
// This functions of viewport directive will be invoked through VIDAMO module
//

vidamo.controller('viewportCtrl',[
    '$scope',
    function($scope) {

        $scope.topoViewportControl = {"xxx":[]};

        $scope.viewportControl = {
            "geometryData":[]
        };

        $scope.gridOptions = {data: 'viewportControl.geometryData',
                            columnDefs:
                                [{ field: 'Property', displayName: 'Property'},
                                { field: 'Value', displayName: 'Value'},
                                { field: 'attachedTo', displayName: 'AttachedTo'}]};

        $scope.showGeometry = true;
        $scope.showFullCode = false;
        $scope.showData = false;
        $scope.showTopology = false;


        $scope.toggleFullCode = function(){
            $scope.showGeometry = false;
            $scope.showFullCode = true;
            $scope.showData = false;
            $scope.showTopology = false;
            document.getElementById("threeViewport").style.display = "none";
            document.getElementById("topoViewport").style.display = "none";
        };

        $scope.toggleGeometry = function(){
            $scope.showGeometry = true;
            $scope.showFullCode = false;
            $scope.showData = false;
            $scope.showTopology = false;
            document.getElementById("threeViewport").style.display = "inline";
            document.getElementById("topoViewport").style.display = "none";
        };

        $scope.toggleData = function(){
            $scope.showGeometry = false;
            $scope.showFullCode = false;
            $scope.showData = true;
            $scope.showTopology = false;
            document.getElementById("threeViewport").style.display = "none";
            document.getElementById("topoViewport").style.display = "none";
        };

        $scope.toggleTopology = function(){
            $scope.showGeometry = false;
            $scope.showFullCode = false;
            $scope.showData = false;
            $scope.showTopology = true;
            document.getElementById("threeViewport").style.display = "none";
            document.getElementById("topoViewport").style.display = "inline";
        };
    }
]);