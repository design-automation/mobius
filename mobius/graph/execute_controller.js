//
// Execute generated code ('run' button)
//

mobius.controller('executeCtrl',['$scope','$rootScope','executeService','consoleMsg','generateCode','hotkeys',
    function($scope,$rootScope,executeService,consoleMsg,generateCode,hotkeys) {

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

            executeService.execute( $scope.javascriptCode,$scope.geomListCode)
                .then(function (data) {
                        console.log('running done');
                        $scope.outputs = data;
                    }
                ).then(function() {
                    console.log('display');

                     //display in the viewport according to node selection
                    //setTimeout(function(){
                        var scope = angular.element(document.getElementById('threeViewport')).scope();
                        var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

                        scope.viewportControl.refreshView();
                        scopeTopo.topoViewportControl.refreshView();
                    //},0);

                    var selectedNodes = $scope.chartViewModel.getSelectedNodes();

                    var scope = angular.element(document.getElementById('threeViewport')).scope();
                    var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

                    for(var i = 0; i < $scope.outputs.length; i++){

                        for(var j =0; j < selectedNodes.length; j++){
                            if($scope.outputs[i].name === selectedNodes[j].data.name){

                                var p = 0;

                                for(var k in $scope.outputs[i].value){
                                    //scope.$apply(function(){
                                        scope.viewportControl.
                                                addGeometryToScene($scope.outputs[i].value[k],
                                                                    $scope.outputs[i].geom[p],
                                                                    $scope.outputs[i].geomData[p]);
                                    //} );

                                    //scopeTopo.$apply(function(){
                                        scopeTopo.topoViewportControl.
                                            addGeometryToScene($scope.outputs[i].value[k],
                                                $scope.outputs[i].topo[p]);
                                    //} );
                                    p++;
                                }
                            }
                        }
                    }
            });
        }
    }]);
