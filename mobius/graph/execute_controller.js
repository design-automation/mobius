//
// Execute generated code ('run' button)
//

vidamo.controller('executeCtrl',['$scope','$rootScope','consoleMsg','generateCode','hotkeys',
    function($scope,$rootScope,consoleMsg,generateCode,hotkeys,usSpinnerService) {

        // one-way binding of generated javascript code

        $scope.spin = false;

        $scope.$watch(function () { return generateCode.getJavascriptCode(); }, function () {
            $scope.javascriptCode = generateCode.getJavascriptCode();
        });

        $scope.$watch(function () { return generateCode.getGeomListCode(); }, function () {
            $scope.geomListCode = generateCode.getGeomListCode();
        });

        $scope.chartViewModel ='';
        $scope.$watch(function () { return generateCode.getChartViewModel(); }, function () {
            if(generateCode.getChartViewModel() !== $scope.chartViewModel){
                $scope.chartViewModel= generateCode.getChartViewModel();
            }
        });

        $scope.$watch('outputs',function(){
            generateCode.setOutputGeom($scope.outputs);
        });

        $scope.outputs = [];


        // shortcut keys
        hotkeys.add({
            combo: 'ctrl+enter',
            description: 'Run the generated code',
            callback: function() {
                $scope.run();
            }
        });


        $rootScope.$on('runNewScene',function(){
            consoleMsg.execMsg().then(function(){
                    $scope.run();
                })
        });


        $scope.run = function(){

            // clean output buffer
            $scope.outputs = [];

            setTimeout(function(){

                var scope = angular.element(document.getElementById('threeViewport')).scope();
                    var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

                    scope.$apply(function(){scope.viewportControl.refreshView();} );
                    scopeTopo.$apply(function(){scopeTopo.topoViewportControl.refreshView();} );
            },0);


            try{
                $scope.outputs = new Function(   $scope.javascriptCode
                    + $scope.geomListCode
                    + '\n return MOBIUS.dataConversion(geomList);')();
                consoleMsg.runtimeMsg();

            }catch (e) {
                consoleMsg.runtimeMsg(e.message);
                throw(e);
            }


            // display in the viewport according to node selection

            setTimeout(function(){

                var selectedNodes = $scope.chartViewModel.getSelectedNodes();

                var scope = angular.element(document.getElementById('threeViewport')).scope();
                var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();


                for(var i = 0; i < $scope.outputs.length; i++){

                    for(var j =0; j < selectedNodes.length; j++){
                        if($scope.outputs[i].name === selectedNodes[j].data.name){
                            var p = 0;

                            for(var k in $scope.outputs[i].value){
                                scope.$apply(function(){
                                    scope.viewportControl.
                                        addGeometryToScene($scope.outputs[i].value[k],
                                                            $scope.outputs[i].geom[p],
                                                        $scope.outputGeom[i].geomData[p]);
                                } );

                                scopeTopo.$apply(function(){
                                    scopeTopo.topoViewportControl.
                                        addGeometryToScene($scope.outputs[i].value[k],
                                        $scope.outputGeom[i].topo[p]);
                                } );
                                p++;
                            }
                        }
                    }
                }
            },0);
        }
    }]);

