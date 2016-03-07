//
// MOBIUS Left Graph controller
//

mobius.controller(  'graphCtrl',
                    ['$scope',
                    '$timeout',
                    'consoleMsg',
                    'hotkeys',
                    'generateCode',
                    'nodeCollection',
                    'prompt',
                    '$mdDialog',
                    'History',
    function($scope,$timeout,consoleMsg,hotkeys,generateCode,nodeCollection,prompt,$mdDialog, History) {

        // temp holder for name input
        // todo seperated service for hotkeys
        hotkeys.add({
            combo: 'ctrl+a',
            description: 'Select all the nodes in the graph',
            callback: function(event,hotkey) {
                event.preventDefault();
                $scope.$broadcast("selectAll");
            }
        });

        hotkeys.add({
            combo: 'del',
            description: 'Delete selected node in the graph',
            callback: function(event,hotkey) {
                event.preventDefault();
                $scope.$broadcast("deleteSelected");
            }
        });

        // procedure data list
        $scope.dataList = generateCode.getDataList();

        $scope.$watch('dataList', function () {
            generateCode.setDataList($scope.dataList);
        },true);

        $scope.$watch(function () { return generateCode.getDataList(); }, function () {
                $scope.dataList = generateCode.getDataList();
        },true);

        // interface data list
        $scope.interfaceList= generateCode.getInterfaceList();

        $scope.$watch('interfaceList', function () {
            generateCode.setInterfaceList($scope.interfaceList);
        },true);

        $scope.$watch(function () { return generateCode.getInterfaceList(); }, function () {
            $scope.interfaceList= generateCode.getInterfaceList();
        },true);

        // graph flowchart view model
        // pass by reference
        // watch chartViewModel.data instead of chartViewModel to prevent stack limit exceeded
        $scope.chartViewModel= generateCode.getChartViewModel();
        $scope.$watch('chartViewModel.data', function () {
            generateCode.generateCode();
        },true);

        $scope.$watch(function () { return generateCode.getChartViewModel(); }, function () {
            if(generateCode.getChartViewModel() !== $scope.chartViewModel){
                $scope.chartViewModel= generateCode.getChartViewModel();
            }
        });

        // geometry list for visualising after node selection
        $scope.outputGeom =[];

        $scope.$watch(function () { return generateCode.getOutputGeom(); }, function () {
            $scope.outputGeom = generateCode.getOutputGeom();
        });

        // synchronization with node collection
        // new node type
        $scope.nodeTypes = function(){
            return nodeCollection.getNodeTypes();
        };

        // for generate node name
        $scope.nextNodeId = 0;

        // currently selected node ID
        $scope.nodeIndex = '';

        // currently selected node name
        $scope.currentNodeName = '';
        $scope.currentNodeType = '';

        // verify the function name
        // todo rewrite with regex
        function isValidName(inputName) {
            var valid = true;

            if (inputName) {
                var testString = 'function ' + inputName + '(){};';

                try {
                    eval(testString);
                } catch (err) {

                    consoleMsg.errorMsg('invalidName');
                    valid = false;
                }
            } else {
                valid = false;
            }

            if(valid) {
                return true;
            } else {
                return false;
            }
        }

        // listen to the graph, when a node is clicked, update the visual procedure/ code/ interface
        $scope.$on("nodeIndex", function(event, message) {
             if($scope.nodeIndex !== message && message !== undefined){
                 $scope.nodeIndex = message;
                 $scope.currentNodeName = $scope.chartViewModel.nodes[$scope.nodeIndex].data.name;
                 $scope.currentNodeType = $scope.chartViewModel.nodes[$scope.nodeIndex].data.type;
                 $scope.currentNodeVersion = $scope.chartViewModel.nodes[$scope.nodeIndex].data.version === 0?'':'*';
                 displayGeometry();
             }else if(message === undefined){
                 $scope.nodeIndex = message;
                $scope.currentNodeName = '';

                $scope.$emit("editProcedure",false);

                 var scope = angular.element(document.getElementById('threeViewport')).scope();
                 var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

                 scope.$apply(function(){scope.viewportControl.refreshView();} );
                 scopeTopo.$apply(function(){scopeTopo.topoViewportControl.refreshView();} );

             }

             function displayGeometry(){
                 var selectedNodes = $scope.chartViewModel.getSelectedNodes();

                 var scope = angular.element(document.getElementById('threeViewport')).scope();
                 var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

                 scope.viewportControl.refreshView();
                 scopeTopo.topoViewportControl.refreshView();

                 for(var i = 0; i < $scope.outputGeom.length; i++){

                     for(var j =0; j < selectedNodes.length; j++){

                         if($scope.outputGeom[i].name === selectedNodes[j].data.name){
                             var p =0;
                             for(var k in $scope.outputGeom[i].value){
                                     scope.viewportControl
                                         .addGeometryToScene($scope.outputGeom[i].value[k],
                                         $scope.outputGeom[i].geom[p],
                                         $scope.outputGeom[i].geomData[p]);

                                     scopeTopo.topoViewportControl.
                                         addGeometryToScene($scope.outputGeom[i].value[k],
                                         $scope.outputGeom[i].topo[p]);
                                 p ++;
                             }
                         }
                     }
                 }
             }
         });

        // Add an input connector to selected nodes.
        $scope.$on("newInputConnector",function (event,connectorModel) {
            try{
                    if (!isValidName(connectorModel.name)) {
                        return;
                    }

                    var selectedNodes = $scope.chartViewModel.getSelectedNodes();

                    for (var i = 0; i < selectedNodes.length; ++i) {
                        var node = selectedNodes[i];

                        node.addInputConnector(connectorModel);
                    }

                    // update version fixme
                    var d = new Date();
                    $scope.chartViewModel.nodes[$scope.nodeIndex].data.version = d.getTime();
                }
            catch(err){
                consoleMsg.errorMsg('noNode');
            }
        });

        // Add an output connector to selected nodes.
        $scope.$on("newOutputConnector",function (event,connectorModel) {

            try{
                if (!isValidName(connectorModel.name)) {
                    return;
                }

                var selectedNodes = $scope.chartViewModel.getSelectedNodes();

                for (var i = 0; i < selectedNodes.length; ++i) {
                    var node = selectedNodes[i];
                    node.addOutputConnector(connectorModel);
                }

                var d = new Date();
                $scope.chartViewModel.nodes[$scope.nodeIndex].data.version = d.getTime();
            }
            catch(err){
                consoleMsg.errorMsg('noNode');
            }
        });

        // Delete selected nodes and connections in data&view model
        $scope.$on("deleteSelected", function (){
            var deletedObj = $scope.chartViewModel.deleteSelected();

            if(deletedObj.deletedNodeIds.length === 0 && deletedObj.nodeIndex !== undefined){
                // update version since connector changed
                var d = new Date();
                $scope.chartViewModel.nodes[deletedObj.nodeIndex].data.version = d.getTime();
            }else{

                $scope.$emit('clearProcedure');
                $scope.currentNodeName = '';

                for(var i = deletedObj.deletedNodeIds.length -1; i >= 0 ; i--){
                    // update scene data structure
                    $scope.dataList.splice(deletedObj.deletedNodeIds[i],1);
                    //$scope.innerCodeList.splice(deletedObj.deletedNodeIds[i],1);
                    //$scope.outerCodeList.splice(deletedObj.deletedNodeIds[i],1);
                    $scope.interfaceList.splice(deletedObj.deletedNodeIds[i],1);
                }
            }
        });

        // todo what is it?
        $scope.$on('clearProcedure', function(){
            $scope.currentNodeName = '';
        });

        $scope.$on("renameSelected",function(){
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'mobius/template/inputName_dialog.tmpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:false,
                    focusOnOpen:false
                })
                .then(function(newName) {
                    $timeout(function(){
                        if(newName !== null && newName !== '' && isValidName(newName)) {
                            var renameObj = $scope.chartViewModel.renameSelected(newName);
                            if (renameObj.isConnector) {
                                // update version since connector changed
                                var d = new Date();
                                $scope.chartViewModel.nodes[renameObj.nodeIndex].data.version = d.getTime();
                            }
                        }
                    }, 10);
                });
        });


        $scope.$on("saveAsNewType",function(){
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'mobius/template/inputName_dialog.tmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                    focusOnOpen:false
            })
                .then(function(newTypeName){
                if (!isValidName(newTypeName)) {return;}
                if ($scope.nodeTypes().indexOf(newTypeName) >= 0 ){
                    consoleMsg.errorMsg('dupName');
                    return;
                }else{
                    consoleMsg.confirmMsg('typeAdded');
                }

                // todo when multi-selection should throw error to user that only one node can be saved
                var input =  $scope.chartViewModel.getSelectedNodes()[0].data.inputConnectors;
                var output = $scope.chartViewModel.getSelectedNodes()[0].data.outputConnectors;
                var index = $scope.chartViewModel.getSelectedNodes()[0].data.id;
                var newProcedureDataModel =  $scope.dataList[index];
                var newInterfaceDataModel = $scope.interfaceList[index];

                nodeCollection.installNewNodeType(newTypeName,input,output,newProcedureDataModel,newInterfaceDataModel);
            });

        });

        // todo when multi-selection should throw error to user that only one node can be saved
        $scope.$on('overWriteProcedure',function(){
            if($scope.chartViewModel.getSelectedNodes()[0].data.overwrite){
            // get new type name, by default the original type name
            var instanceName =  $scope.chartViewModel.getSelectedNodes()[0].data.name;
            var oldTypeName = $scope.chartViewModel.getSelectedNodes()[0].data.type;
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'mobius/template/overwrite_dialog.tmpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:false,
                })
                .then(function(answer) {

                    if(answer === 'Ok'){
                        overwriteType(oldTypeName, oldTypeName, instanceName);
                    }
                });
            }else{
                consoleMsg.errorMsg('notWritable');
            }

            function overwriteType(oldTypeName,newTypeName,instanceName){

                // update the original type
                var input =  $scope.chartViewModel.getSelectedNodes()[0].data.inputConnectors;
                var output = $scope.chartViewModel.getSelectedNodes()[0].data.outputConnectors;
                var index = $scope.chartViewModel.getSelectedNodes()[0].data.id;
                var newProcedureDataModel = $scope.dataList[index];
                var newInterfaceDataModel = $scope.interfaceList[index];

                nodeCollection.updateNodeType(oldTypeName, newTypeName, input,output,newProcedureDataModel,newInterfaceDataModel);

                // update this node
                $scope.chartViewModel.getSelectedNodes()[0].data.type = newTypeName;
                $scope.chartViewModel.getSelectedNodes()[0].data.version = 0;

                // update other nodes with original type and version 0
                for(var i = 0; i < $scope.chartViewModel.nodes.length; i++){
                    var node = $scope.chartViewModel.nodes[i];
                    if(node.data.type === oldTypeName){
                        if(node.data.name !== instanceName && node.data.version === 0){
                            // nodeModel update
                            node.data.type = newTypeName;
                            node.data.inputConnectors = [];
                            node.data.outputConnectors = [];
                            node.inputConnectors = [];
                            node.outputConnectors = [];

                            for(var j = 0; j < input.length; j++){
                                node.addInputConnector({
                                    name: input[j].name,
                                    value:''
                                });
                            }

                            for(var k = 0; k < output.length; k++){
                                node.addOutputConnector({
                                    name: output[k].name,
                                    value:''
                                });
                            }

                            // procedure Model whole
                            $scope.dataList[node.data.id] = newProcedureDataModel;

                            // interface Model whole
                            $scope.interfaceList[node.data.id] = newInterfaceDataModel;
                        }
                    }
                }
                consoleMsg.confirmMsg('typeOverwritten');
            }
        });

        $scope.$on('disableNode', function(){
            var selectedNodes = $scope.chartViewModel.getSelectedNodes();

            for (var i = 0; i < selectedNodes.length; ++i) {
                var node = selectedNodes[i];
                node.disable();
            }

            // when disabled, reset the attribute of 'connected' in dest connector
            for(var i = 0; i <$scope.chartViewModel.connections.length; i++){
                var sourceNodeId = $scope.chartViewModel.connections[i].data.source.nodeID;
                var destNodeId = $scope.chartViewModel.connections[i].data.dest.nodeID;
                var destConnectorIndex = $scope.chartViewModel.connections[i].data.dest.connectorIndex;

                if($scope.chartViewModel.nodes[sourceNodeId].disabled() === true){
                    $scope.chartViewModel.nodes[destNodeId].inputConnectors[destConnectorIndex].data.connected = false;
                }
            }

        });

        $scope.$on('enableNode', function(){
            var selectedNodes = $scope.chartViewModel.getSelectedNodes();

            for (var i = 0; i < selectedNodes.length; ++i) {
                var node = selectedNodes[i];
                node.enable();
            }

            // when disabled, reset the attribute of 'connected' in dest connector
            for(var i = 0; i <$scope.chartViewModel.connections.length; i++){
                var sourceNodeId = $scope.chartViewModel.connections[i].data.source.nodeID;
                var destNodeId = $scope.chartViewModel.connections[i].data.dest.nodeID;
                var destConnectorIndex = $scope.chartViewModel.connections[i].data.dest.connectorIndex;

                if($scope.chartViewModel.nodes[sourceNodeId].disabled() === false){
                    $scope.chartViewModel.nodes[destNodeId].inputConnectors[destConnectorIndex].data.connected = true;
                }
            }
        });

        $scope.$on('selectAll',function(){
            $scope.chartViewModel.selectAll();
        });

        $scope.$on('deselectAll',function(){
            $scope.chartViewModel.deselectAll();
            var scope = angular.element(document.getElementById('threeViewport')).scope();
            var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

            scope.$apply(function(){scope.viewportControl.refreshView();} );
            scopeTopo.$apply(function(){scopeTopo.topoViewportControl.refreshView();} );
        });
    }]);