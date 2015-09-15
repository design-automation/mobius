//
// Execute generated code ('run' button)
//

vidamo.controller('executeCtrl',['$scope','generateCode','hotkeys',
    function($scope,generateCode,hotkeys) {

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
        });

        $scope.outputs = [];


        // shortcut keys
        hotkeys.add({
            combo: 'ctrl+enter',
            description: 'run',
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

                    for(var m in $scope.outputs[i].value) {
                        var geoms = [];
                        if($scope.outputs[i].value[m].constructor !== Array){
                            geoms.push($scope.outputs[i].value[m].toThreeGeometry());
                        }
                        else{
                            for(var n =0; n < $scope.outputs[i].value[m].length; n++){
                                geoms.push($scope.outputs[i].value[m][n].toThreeGeometry());
                            }
                        }
                        $scope.outputs[i].geom.push(geoms);
                    }

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
                    console.log($scope.outputs[i].geom)
                }
            },0);


            document.getElementById('log').innerHTML += "<div> Execution done </div>";
        }
    }]);

