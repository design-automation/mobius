//
// Execute generated code ('run' button)
//

vidamo.controller('executeCtrl',['$scope','generateCode','hotkeys',
    function($scope,generateCode,hotkeys) {

        // one-way binding of generated javascript code

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
			console.log($scope.outputs)
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


        $scope.run = function(){

            setTimeout(function(){
                    var scope = angular.element(document.getElementById('threeViewport')).scope();
                    scope.$apply(function(){scope.viewportControl.refresh();} );
                }
                ,0);

            // declare start running in console
            document.getElementById('log').innerHTML += "<div></br> Executing generated code ... </div>";

            try{
                $scope.outputs = new Function(   $scope.javascriptCode
                                                + $scope.geomListCode
                                                + 'return VIDAMO.dataConversion(geomList);')(); 
            }catch (e) {
                document.getElementById('log').innerHTML +=     "<div style='color:red'>" +  e.message + "</div>";
                alert(e.stack);
            }

            // display in the viewport according to node selection

            setTimeout(function(){
                var selectedNodes = $scope.chartViewModel.getSelectedNodes();
                var scope = angular.element(document.getElementById('threeViewport')).scope();

                for(var i = 0; i < $scope.outputs.length; i++){

                    for(var j =0; j < selectedNodes.length; j++){
                        if($scope.outputs[i].name === selectedNodes[j].data.name){
                            var p = 0;

                            for(var k in $scope.outputs[i].value){
                                scope.$apply(function(){
                                    scope.viewportControl.
                                        addGeometryToScene($scope.outputs[i].value[k],$scope.outputs[i].geom[p]);
                                } );
                                p++;
                            }
                        }
                    }
                }
            },0);


            document.getElementById('log').innerHTML += "<div> Execution done </div>";
        }
    }]);

