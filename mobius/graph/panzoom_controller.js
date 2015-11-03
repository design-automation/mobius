// VIDAMO zoom and pan controller for left-panel

vidamo.controller('znpController', ['$scope',
    function($scope) {
        var rect = { x : 2000, y: 2000, width: 500 , height:500};

        $scope.panzoomConfig = {
            initialZoomToFit: rect
        };

        $scope.panzoomModel = {};
    }
]);