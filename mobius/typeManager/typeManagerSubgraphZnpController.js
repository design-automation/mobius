// mobius zoom and pan controller for left-panel
mobius.controller('typeManagerSubgraphZnpController', ['$scope', 'PanZoomService',
    function($scope,PanZoomService) {

        var zoomToFitZoomLevelFactor = 1;

        $scope.panzoomModel = {};

        var rect = {
            x : 2000,
            y : 2000,
            width: document.getElementById('subgraph-code-container').clientWidth,
            height: document.getElementById('subgraph-code-container').clientHeight
        };

        $scope.panzoomConfig = {
            initialZoomToFit: rect,
            zoomToFitZoomLevelFactor:zoomToFitZoomLevelFactor,
            neutralZoomLevel:1,
            zoomOnDoubleClick:false,
            invertMouseWheel:true,
            zoomLevels:12,
            useHardwareAcceleration:true,
            chromeUseTransform:true,
            keepInBounds:true
        };

        $scope.view = { zoomLevel: undefined,
            pan:{
                x:undefined,
                y:undefined
            }};

        $scope.getView = function(){
            PanZoomService.getAPI('typeManagerSubgraphPanZoom').then(function (api) {
                $scope.view.zoomLevel = api.model.zoomLevel;
                $scope.view.pan.x = api.model.pan.x;
                $scope.view.pan.y = api.model.pan.y;
            });
        };

        $scope.goView = function(){
            PanZoomService.getAPI('typeManagerSubgraphPanZoom').then(function (api) {
                api.updateModel($scope.view);
            });
        };

        $scope.reset = function(){
            PanZoomService.getAPI('typeManagerSubgraphPanZoom').then(function (api) {
                api.zoomToFit({ x : 2000,
                    y : 2000,
                    width: document.getElementById('typeManagerSubgraphPanZoom').offsetWidth,
                    height:document.getElementById('typeManagerSubgraphPanZoom').offsetHeight});
            });
        };

        // if no nodes in the graph, reset to initial positon
        $scope.$on('type-subgraphExtend',function(event,chartViewModel){
            console.log('ed')
            $scope.extend(chartViewModel);
        });

        $scope.extend = function(chartViewModel){
            $scope.chartViewModel = chartViewModel;

            var view = $scope.chartViewModel.calculateExtendView();

            var width = view.width;
            var height =  view.height;

            if($scope.chartViewModel.nodes.length === 0 &&
                !$scope.chartViewModel.inputPort &&
                !$scope.chartViewModel.outputPort
            ){
                $scope.reset();
            }else{
                PanZoomService.getAPI('typeManagerSubgraphPanZoom').then(function (api) {
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