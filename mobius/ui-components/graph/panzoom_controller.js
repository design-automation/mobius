// mobius zoom and pan controller for left-panel
mobius.controller('znpController', ['$scope', 'PanZoomService','generateCode',
    function($scope,PanZoomService,generateCode) {
        $scope.chartViewModel = generateCode.getChartViewModel();

        $scope.$watch(function(){return generateCode.getChartViewModel()},function(){
            $scope.chartViewModel = generateCode.getChartViewModel();
        });

        $scope.$on("Update", function(event, message) {
            $scope.scaleFactor = message;
        });

        var zoomToFitZoomLevelFactor = 0.9;

        $scope.panzoomModel = {};

        var rect = {
            x : 2000,
            y : 2000,
            width: document.getElementById('PanZoom').clientWidth,
            height: document.getElementById('PanZoom').clientHeight
        };

        $scope.panzoomConfig = {
            initialZoomToFit: rect,
            zoomToFitZoomLevelFactor:zoomToFitZoomLevelFactor,
            neutralZoomLevel:3,
            zoomOnDoubleClick:false,
            invertMouseWheel:true,
            zoomLevels:12,
            useHardwareAcceleration:true,
            chromeUseTransform:true,
            keepInBounds:false
        };

        $scope.view = { zoomLevel: undefined,
                        pan:{
                            x:undefined,
                            y:undefined
                        }};

        $scope.getView = function(){
            PanZoomService.getAPI('PanZoom').then(function (api) {
                $scope.view.zoomLevel = api.model.zoomLevel;
                $scope.view.pan.x = api.model.pan.x;
                $scope.view.pan.y = api.model.pan.y;
            });
        };

        $scope.goView = function(){
            PanZoomService.getAPI('PanZoom').then(function (api) {
                api.updateModel($scope.view);
            });
        };

        $scope.reset = function(){
            PanZoomService.getAPI('PanZoom').then(function (api) {
                api.zoomToFit({ x : 2000,
                                y : 2000,
                                width: document.getElementById('PanZoom').offsetWidth,
                                height:document.getElementById('PanZoom').offsetHeight});
            });
        };

        // if no nodes in the graph, reset to initial positon
        $scope.$on('Extend',function(){
            $scope.extend()
        });

        $scope.extend = function(){
            $scope.chartViewModel = generateCode.getChartViewModel();

            var view = $scope.chartViewModel.calculateExtendView();

            var width = view.width;
            var height =  view.height;

            if($scope.chartViewModel.nodes.length === 0 &&
                !$scope.chartViewModel.inputPort &&
                !$scope.chartViewModel.outputPort
            ){
                $scope.reset();
            }else{
                PanZoomService.getAPI('PanZoom').then(function (api) {
                    api.zoomToFit({
                        x :view.x,
                        y :view.y ,
                        width: width,
                        height:height
                    });
                });
            }
        }
    }
]);