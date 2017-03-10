// text editor viewport example
mobius.controller('textCtrl',
    ['$scope','$rootScope', 'generateCode',
        function($scope,$rootScope,generateCode) {
            // geometry list for visualising after node selection
            $scope.outputGeom =[];
            $scope.currentTextVersionGeom = {geom:"Hi, No node is selected."};
            $scope.nodeIndex = '';

            $scope.$watch(function () { return generateCode.getOutputGeom(); }, function () {
                $scope.outputGeom = generateCode.getOutputGeom();
            });

            $scope.chartViewModel = generateCode.getChartViewModel();

            $scope.$watch(function(){return generateCode.getChartViewModel()},function(){
                $scope.chartViewModel = generateCode.getChartViewModel();
            });

            // listen to the graph, when a node is clicked, update text accordingly
            $rootScope.$on("nodeIndex", function(event, message) {
                if($scope.nodeIndex !== message && message !== undefined && message !== "port"){
                    $scope.nodeIndex = message;
                    displayText();
                }else if(message === undefined){
                    $scope.nodeIndex = message;
                }
                function displayText(){
                    var selectedNodes = $scope.chartViewModel.getSelectedNodes();
                    for(var i = 0; i < $scope.outputGeom.length; i++){
                        for(var j =0; j < selectedNodes.length; j++){
                            if($scope.outputGeom[i].name === selectedNodes[j].data.name){
                                for(var i = 0; i < $scope.outputGeom.length; i++){
                                    for(var j =0; j < selectedNodes.length; j++){
                                        if($scope.outputGeom[i].name === selectedNodes[j].data.name){
                                            $scope.currentTextVersionGeom.geom = $scope.outputGeom[i].geom;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }]);