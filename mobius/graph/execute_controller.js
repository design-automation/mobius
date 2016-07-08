//
// Execute generated code ('run' button)
//
mobius.controller('executeCtrl',['$scope','$rootScope','$q','executeService','consoleMsg','usSpinnerService','generateCode','hotkeys',
    function($scope,$rootScope,$q,executeService,consoleMsg,usSpinnerService,generateCode,hotkeys) {
        $scope.showSpinner = false;

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
                    }, function(msg){
                        document.getElementById('waiting').style.display='none';
                        $scope.showSpinner = false;
                        console.error(msg);
                        generateCode.clearError();
                        generateCode.displayError(msg);
                    })
                    .then(function() {
                        console.log('display');

                        //display in the viewport according to node selection
                        var scope = angular.element(document.getElementById('threeViewport')).scope();
                        var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

                        scope.viewportControl.refreshView();
                        scopeTopo.topoViewportControl.refreshView();

                        var selectedNodes = $scope.chartViewModel.getSelectedNodes();

                        var scope = angular.element(document.getElementById('threeViewport')).scope();
                        var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

                        for(var i = 0; i < $scope.outputs.length; i++){
                            for(var j =0; j < selectedNodes.length; j++){
                                if($scope.outputs[i].name === selectedNodes[j].data.name){

                                    var p = 0;
                                    scope.viewportControl.geometryData = {};

                                    for(var k in $scope.outputs[i].value){
                                        // store selected node's output connector name for data table display
                                        if(k !== 'geomList'){
                                            scope.viewportControl.geometryData[k] = [];
                                        }

                                        if($scope.outputs[i].value[k] !== undefined){
                                            scope.viewportControl.addGeometryToScene($scope.outputs[i].value[k],
                                                $scope.outputs[i].geom[p],
                                                $scope.outputs[i].geomData[p],k);

                                            scopeTopo.topoViewportControl.addGeometryToScene($scope.outputs[i].value[k],
                                                $scope.outputs[i].topo[p]);
                                        }
                                        p++;
                                    }
                                }
                            }
                        }
                        $rootScope.$broadcast('Update Datatable');
                    });
            },100);
        }
    }]);
