//
// Execute generated code ('run' button)
//

vidamo.controller('executeCtrl',['$scope','generateCode',
    function($scope,generateCode) {

        // one-way binding of generated javascript code

        //$scope.javascriptCode = generateCode.getJavascriptCode();



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
            console.log('from execute:', $scope.outputs)
        });

        $scope.outputs = [];

        $scope.run = function(){

            setTimeout(function(){
                    var scope = angular.element(document.getElementById('threeViewport')).scope();
                    scope.$apply(function(){scope.viewportControl.refresh();} );
                }
                ,0);

            // declare start running in console
            document.getElementById('log').innerHTML += "<div></br> Executing generated code ... </div>";

            try{
                // eval( $scope.javascriptCode);
                $scope.outputs = new Function(   $scope.javascriptCode + $scope.geomListCode + 'return geomList;')();
            }catch (e) {
                document.getElementById('log').innerHTML +=     "<div style='color:red'>" +  e.message + "</div>";
                alert(e.stack);
            }

            setTimeout(function(){
                var selectedNodes = $scope.chartViewModel.getSelectedNodes();
                var scope = angular.element(document.getElementById('threeViewport')).scope();

                for(var i = 0; i < $scope.outputs.length; i++){
                    for(var j =0; j < selectedNodes.length; j++){
                        if($scope.outputs[i].name === selectedNodes[j].data.name){
                            for(var k in $scope.outputs[i].value){
                                scope.$apply(function(){scope.viewportControl.addGeometryToScene($scope.outputs[i].value[k] );} );
                            }
                        }
                    }
                }
            },0);


            document.getElementById('log').innerHTML += "<div> Execution done </div>";
        }
    }]);

