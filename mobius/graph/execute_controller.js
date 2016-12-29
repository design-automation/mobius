//
// Execute generated code ('run' button)
//
mobius.controller('executeCtrl',['$scope','$rootScope','$q','executeService','consoleMsg','usSpinnerService','generateCode','hotkeys',
    function($scope,$rootScope,$q,executeService,consoleMsg,usSpinnerService,generateCode,hotkeys) {
        $scope.showSpinner = false;

        // one-way binding of generated javascript code
        // $scope.$watch(function () { return generateCode.getJavascriptCode(); }, function (newValue, oldValue) {
        //     if(!angular.equals(newValue,oldValue)){
        //         console.log("from exe ctrl")
        //         $scope.javascriptCode = generateCode.getJavascriptCode();
        //     }
        // });

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
            $scope.javascriptCode = generateCode.getJavascriptCode();
            $scope.outputs = [];

            document.getElementById('waiting').style.display='inline';
            $scope.showSpinner = true;

            setTimeout(function(){
                executeService.execute($scope.javascriptCode+ '\n return dataConversion(geomList);')
                    .then(function (data) {
                        console.log('running done');
                        document.getElementById('waiting').style.display='none';
                        $scope.showSpinner = false;
                        $scope.outputs = data;
                        generateCode.clearError();
                        consoleMsg.runtimeMsg();
                    }, function(msg){
                        document.getElementById('waiting').style.display='none';
                        $scope.showSpinner = false;
                        consoleMsg.runtimeMsg(msg[1]);
                        generateCode.clearError();
                        generateCode.displayError(msg[0]);
                    })
                    .then(function() {
                        // merge and store outputs for visualization
                        // todo topology, data etc
                        // fixme coupling with viewer and module

                        $scope.mergedOutputs = [];

                        console.log($scope.outputs)

                        for(var i = 0; i < $scope.outputs.length; i++){
                            var p = 0;
                            for(var k in $scope.outputs[i].value){
                                if($scope.outputs[i].value[k] !== undefined){
                                    var temp= getMergedGeometry($scope.outputs[i].value[k],
                                        $scope.outputs[i].geom[p],
                                        $scope.outputs[i].geomData[p],k);

                                    //todo topo

                                    $scope.mergedOutputs.push(
                                        {
                                            name:  $scope.outputs[i].name,
                                            geometry: temp.geometry,
                                            geomData: temp.geomData,
                                            value: $scope.outputs[i].value
                                            // todo topo
                                        }
                                    )
                                }
                                p++;
                            }
                        }

                        $scope.outputs = $scope.mergedOutputs;

                        function getMergedGeometry(geom,value,geomData,connectorName){
                            var mergedGeometry = new THREE.Geometry();
                            if(value !== undefined){
                                if(value.constructor === Array){
                                    for(var i = 0; i< value.length ;i++){
                                        mergeGeometry(value[i],geomData[i],connectorName,mergedGeometry);
                                    }
                                } else {
                                    mergeGeometry(value,geomData,connectorName,mergedGeometry);
                                }
                            }

                            var meshMaterial = new THREE.MeshBasicMaterial({
                                color: 0xffffff,
                                shading: THREE.SmoothShading,
                                vertexColors: THREE.VertexColors
                            });

                            var edge = new THREE.EdgesGeometry( mergedGeometry );
                            var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1} );
                            var wireframe = new THREE.LineSegments( edge , mat);

                            var mergedMesh = new THREE.Mesh(mergedGeometry,meshMaterial);
                            // todo line wireframe should it be merged
                            console.log(geom)
                            return {
                                        geometry:[mergedMesh,wireframe],
                                        geomData: geomData,
                                    };

                        };

                        function mergeGeometry (singleGeomObject, singleGeomDataObject,connectorName,mergedGeometry){
                            if(singleGeomObject instanceof THREE.Mesh
                                || singleGeomObject instanceof THREE.Line
                                || singleGeomObject instanceof THREE.PointCloud
                                || singleGeomObject instanceof THREE.Object3D) {
                                for (var i = 0; i < singleGeomObject.children.length; i++) {
                                    if (singleGeomObject.children[i] instanceof THREE.Mesh) {
                                        mergedGeometry.mergeMesh(singleGeomObject.children[i], singleGeomObject.children[i].matrix)
                                    }
                                }
                            }
                        };

                        // todo topo
                        function getMergedTopo(){

                        };

                        function mergeTopo(){

                        };

                        //display in the viewport according to node selection
                        console.log('display');

                        var scope = angular.element(document.getElementById('threeViewport')).scope();
                        var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

                        scope.viewportControl.refreshView();
                        scopeTopo.topoViewportControl.refreshView();

                        var selectedNodes = $scope.chartViewModel.getSelectedNodes();

                        for(var i = 0; i < $scope.outputs.length; i++){
                            for(var j =0; j < selectedNodes.length; j++){
                                if($scope.outputs[i].name === selectedNodes[j].data.name){
                                    scope.viewportControl.addGeometryToScene($scope.outputs[i].geometry);

                                    var p = 0;
                                    scope.viewportControl.geometryData = {};

                                    for(var k in $scope.outputs[i].value){
                                        // store selected node's output connector name for data table display
                                        if(k !== 'geomList'){
                                            scope.viewportControl.geometryData[k] = [];
                                        }

                                        if($scope.outputs[i].value[k] !== undefined){
                                            scope.viewportControl.addDataToScene($scope.outputs[i].value[k],
                                                $scope.outputs[i].geom,
                                                $scope.outputs[i].geomData[p],k)
                                        }
                                        p++;
                                    }
                                    // todo topo
                                }
                            }
                        }

                        $rootScope.$broadcast('Update Datatable');
                    });
            },100);
        }
    }]);
