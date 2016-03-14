// mobius zoom and pan controller for left-panel

mobius.controller('znpController', ['$scope',
    function($scope) {
        var rect = { x : 2000, y: 2000, width: 500 , height:500};
        $scope.model = {};

        $scope.panzoomConfig = {
            initialZoomToFit: rect,
            neutralZoomLevel:1,
            zoomOnDoubleClick:false,
            invertMouseWheel:true,
            zoomLevels:15,
            initialZoomLevel:10,
            //keepInBounds:true,
            useHardwareAcceleration:true,
            chromeUseTransform:true
        };

        $scope.panzoomModel = {};
    }
]);