//
//  display the parameters of the selected node
//
mobius.directive('paramDisplay', [ 'hotkeys', 'executeService', 'generateCode', 'consoleMsg', '$rootScope', function(hotkeys, executeService, generateCode, consoleMsg, $rootScope) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'mobius/ui-components/parameter_display/param_display_tpl.html',
        link: function (scope, element, attrs) {

            scope.nodeIndex = undefined;

            // shortcut keys
            hotkeys.add({
                combo: 'ctrl+enter',
                description: 'Run the generated code',
                callback: function() {
                    scope.run();
                }
            });

            $rootScope.$on("nodeIndex", function(event, message) {

                if(message === undefined){
                }
                else if(/*scope.nodeIndex !== message && */message !== "port"){

                    scope.nodeIndex = message;
                    scope.interface = scope.interfaceList[scope.nodeIndex];

                    // todo: why is this needed?
                    setTimeout(function () {
                        scope.$apply();
                    }, 0);


                }
                else if(message === 'port'){

                }
            });

            // watch the chartViewModel to look for changes
            scope.interfaceList= generateCode.getInterfaceList();
            scope.interface = scope.interfaceList[scope.nodeIndex];
            scope.$watch(function(){return generateCode.getInterfaceList()},function(){
                scope.interfaceList= generateCode.getInterfaceList();
                scope.interface = scope.interfaceList[scope.nodeIndex];
            });

            // run button
            scope.run = function(){
                scope.javascriptCode = generateCode.getJavascriptCode();
                scope.outputs = [];

                //document.getElementById('waiting').style.display='inline';
                scope.showSpinner = true;

                setTimeout(function(){
                    executeService.execute(scope.javascriptCode+ '\n return dataConversion(geomList);')
                        .then(function (data) {
                            //document.getElementById('waiting').style.display='none';
                            scope.showSpinner = false;
                            scope.outputs = data;
                            generateCode.setOutputGeom(data);
                            generateCode.clearError();
                            consoleMsg.runtimeMsg();
                        }, function(msg){
                            //document.getElementById('waiting').style.display='none';
                            scope.showSpinner = false;
                            consoleMsg.runtimeMsg(msg[1]);
                            generateCode.clearError();
                            generateCode.displayError(msg[0]);
                        })
                        .then(function() {
                            //display in the viewport according to node selection
                            var threescope = angular.element(document.getElementById('threeViewport')).scope();
                            var scopeVizi = angular.element(document.getElementById('viziViewport')).scope();
                            // var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

                            threescope.viewportControl.refreshView();
                            scopeVizi.viziViewportControl.refreshView();
                            // scopeTopo.topoViewportControl.refreshView();

                            var selectedNodes = threescope.chartViewModel.getSelectedNodes();

                            for(var i = 0; i < scope.outputs.length; i++){
                                for(var j =0; j < selectedNodes.length; j++){
                                    if(scope.outputs[i].name === selectedNodes[j].data.name){
                                        threescope.viewportControl.addGeometryToScene(scope.outputs[i].geom);
                                    }
                                    else if(scope.outputs[i].name ==="saveGeoJSON0"){
                                        scopeVizi.viziViewportControl.addGeometryToScene(scope.outputs[i].geomData[0][0].Value);
                                    }
                                }
                            }

                            $rootScope.$broadcast('Update Datatable');
                        });
                },100);
            }

        }
    }
}]);