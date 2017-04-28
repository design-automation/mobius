//
// MOBIUS Left Graph controller
//

mobius.controller(  'graphCtrl',
                    ['$scope',
                    '$rootScope',
                    '$timeout',
                    'consoleMsg',
                    'hotkeys',
                    'generateCode',
                    'nodeCollection',
                    'prompt',
                    '$mdDialog',
                    'History',
    function($scope,$rootScope,$timeout,consoleMsg,hotkeys,generateCode,nodeCollection,prompt,$mdDialog, History) {

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

        $scope.graphList = generateCode.getGraphList();

        // procedure data list
        $scope.dataList = generateCode.getDataList();

        $scope.$watch(function () { return generateCode.getDataList(); }, function () {
            $scope.dataList = generateCode.getDataList();
        },true);

        // interface data list
        $scope.interfaceList= generateCode.getInterfaceList();

        $scope.$watch(function () { return generateCode.getInterfaceList(); }, function () {
            $scope.interfaceList= generateCode.getInterfaceList();
        },true);

        // graph flowchart view model
        // note that changes in procedure/ interface/ argument will update the
        // version of selected node, hence update the chartViewModel.data
        // watch chartViewModel.data instead of chartViewModel to prevent stack limit exceeded
        $scope.chartViewModel = generateCode.getChartViewModel();


        // fixme confirm socket usage
        $scope.$watch(function(){return generateCode.getChartViewModel()},function(){
            $scope.dataList = generateCode.getDataList();
            $scope.interfaceList= generateCode.getInterfaceList();
            $scope.chartViewModel = generateCode.getChartViewModel();
        });

        $scope.$watch('chartViewModel.data', function (newValue, oldValue) {
            if(!angular.equals(newValue.connections,oldValue.connections)){
                // connection change detected
                generateCode.generateCode();
            }else if(newValue.nodes.length !== oldValue.nodes.length){
                // nodes change detected
                generateCode.generateCode();
            }else{
                for(var i = 0; i < newValue.nodes.length; i++){
                    if( newValue.nodes[i].disabled !== oldValue.nodes[i].disabled ||
                        newValue.nodes[i].id !== oldValue.nodes[i].id ||
                        newValue.nodes[i].overwrite !== oldValue.nodes[i].overwrite ||
                        newValue.nodes[i].version !== oldValue.nodes[i].version ||
                        newValue.nodes[i].type !== oldValue.nodes[i].type ||
                        newValue.nodes[i].name !== oldValue.nodes[i].name ||
                        !angular.equals(newValue.nodes[i].inputConnectors,oldValue.nodes[i].inputConnectors) ||
                        !angular.equals(newValue.nodes[i].outputConnectors,oldValue.nodes[i].outputConnectors)
                    ){
                        // pass connector list to subgraph chartdatamodel input/output port
                        if($scope.chartViewModel.nodes[i].data.subGraph === true){
                            var outputList = [];
                            for (var j = 0; j < $scope.dataList[$scope.nodeIndex].length;j++){
                                if($scope.dataList[$scope.nodeIndex][j].title === 'Output'){
                                    outputList.push($scope.dataList[$scope.nodeIndex][j]);
                                }
                            }

                            for (var j = 0; j < $scope.interfaceList[$scope.nodeIndex].length;j++){
                                if($scope.interfaceList[$scope.nodeIndex][j].title === 'Output'){
                                    outputList.push($scope.interfaceList[$scope.nodeIndex][j]);
                                }
                            }

                            angular.copy(outputList,
                                $scope.chartViewModel.nodes[i].data.subGraphModel.chartDataModel.outputPort.inputConnectors);
                        }

                        if($scope.chartViewModel.nodes[i].data.subGraph === true){
                            var inputList = [];
                            for (var j = 0; j < $scope.interfaceList[$scope.nodeIndex].length;j++){
                                if($scope.interfaceList[$scope.nodeIndex][j].title === 'Input'){
                                    inputList.push($scope.interfaceList[$scope.nodeIndex][j]);
                                }
                            }

                            angular.copy(
                                inputList,
                                $scope.chartViewModel.nodes[i].data.subGraphModel.chartDataModel.inputPort.outputConnectors
                            )
                        }
                        generateCode.generateCode();
                        break;
                    }
                }
            }
        },true);

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

             if(message === undefined){
                // do nothing
 
                //$scope.nodeIndex = message;


                // $scope.currentNodeName = '';
                //
                // var scope = angular.element(document.getElementById('threeViewport')).scope();
                // var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();
                //
                // scope.$apply(function(){scope.viewportControl.refreshView();} );
                // scope.$apply(function(){scope.viewportControl.refreshData();} );
                // scopeTopo.$apply(function(){scopeTopo.topoViewportControl.refreshView();} );
                // scopeTopo.$apply(function(){scopeTopo.viewportControl.refreshData();} );
             }
             else if($scope.nodeIndex !== message && message !== "port"){
                
                // message contains clicked node id; if not same as currently selected, update variables

                $scope.nodeIndex = message;
                $scope.currentNodeName = $scope.chartViewModel.data.nodes[$scope.nodeIndex].name;
                $scope.currentNodeType = $scope.chartViewModel.data.nodes[$scope.nodeIndex].type;
                $scope.currentNodeVersion = $scope.chartViewModel.data.nodes[$scope.nodeIndex].version === 0?'':'*';
                displayGeometry();

             }else if(message === undefined){

             }else if(message === 'port'){
                 // todo input/output port configuration
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
                             for(var i = 0; i < $scope.outputGeom.length; i++){
                                 for(var j =0; j < selectedNodes.length; j++){
                                     if($scope.outputGeom[i].name === selectedNodes[j].data.name){
                                         scope.viewportControl.addGeometryToScene($scope.outputGeom[i].geom);
                                         var p = 0;
                                         scope.viewportControl.geometryData = {};

                                         for(var k in $scope.outputGeom[i].value){
                                             // store selected node's output connector name for data table display
                                             if(k !== 'geomList'){
                                                 scope.viewportControl.geometryData[k] = [];
                                             }

                                             if($scope.outputGeom[i].value[k] !== undefined){
                                                 scope.viewportControl.addDataToScene($scope.outputGeom[i].value[k],
                                                     $scope.outputGeom[i].geom,
                                                     $scope.outputGeom[i].geomData[p],k)

                                                 scopeTopo.topoViewportControl.addGeometryToScene($scope.outputGeom[i].value[k],
                                                     $scope.outputGeom[i].topo[p]);
                                             }
                                             p++;
                                         }
                                     }
                                 }
                             }
                         }
                     }
                 }
                 $rootScope.$broadcast('Update Datatable');

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
                    $scope.chartViewModel.data.nodes[$scope.nodeIndex].version = d.getTime();
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
                $scope.chartViewModel.data.nodes[$scope.nodeIndex].version = d.getTime();
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
                $scope.chartViewModel.data.nodes[deletedObj.nodeIndex].version = d.getTime();
            }else{

                $scope.$emit('clearProcedure');
                $scope.currentNodeName = '';

                for(var i = deletedObj.deletedNodeIds.length -1; i >= 0 ; i--){
                    // update scene data structure
                    $scope.dataList.splice(deletedObj.deletedNodeIds[i],1);
                    $scope.interfaceList.splice(deletedObj.deletedNodeIds[i],1);
                }
            }
        });

        $scope.$on("node-dbClick", function(){
            if($scope.chartViewModel.getSelectedNodes()[0].data.subGraph){
                $scope.$emit('openSubGraph')
            }else{
                $scope.$emit("showProcedure");
                //$scope.$emit("editProcedure");
            }
        });

        // todo what is it?
        $scope.$on('clearProcedure', function(){
            $scope.currentNodeName = '';
        });

        $scope.$on("renameSelected",function(){
            $mdDialog.show({
                    //controller: DialogController,
                    templateUrl: 'mobius/dialog/inputName_dialog.tmpl.html',
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
                                $scope.chartViewModel.data.nodes[renameObj.nodeIndex].version = d.getTime();
                            }
                        }
                    }, 10);
                });
        });

        $scope.$on("saveAsNewType",function(){
            $mdDialog.show({
                //controller: 'DialogController',
                templateUrl: 'mobius/dialog/inputName_dialog.tmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                    focusOnOpen:false
            })
                .then(function(newTypeName){
                if (!isValidName(newTypeName)) {return;}
                if ($scope.nodeTypes().indexOf(newTypeName) >= 0 ){
                    $rootScope.$broadcast("overWriteProcedure");
                    return;
                }else{
                    consoleMsg.confirmMsg('typeAdded');
                }

                // todo when multi-selection should throw error to user that only one node can be saved
                var node = $scope.chartViewModel.getSelectedNodes()[0];
                var input =  $scope.chartViewModel.getSelectedNodes()[0].data.inputConnectors;
                var output = $scope.chartViewModel.getSelectedNodes()[0].data.outputConnectors;
                var index = $scope.chartViewModel.getSelectedNodes()[0].data.id;
                var newProcedureDataModel =  $scope.dataList[index];
                var newInterfaceDataModel = $scope.interfaceList[index];
                var isSubGraph = $scope.chartViewModel.getSelectedNodes()[0].data.subGraph;
                var subGraphModel = $scope.chartViewModel.getSelectedNodes()[0].data.subGraphModel;

                nodeCollection.
                    installNewNodeType(
                        newTypeName,isSubGraph,input,output,
                        newProcedureDataModel,newInterfaceDataModel,subGraphModel,node);
            });
        });

        // todo when multi-selection should throw error to user that only one node can be saved
        $scope.$on('overWriteProcedure',function(){
            console.log('overwritable? :', $scope.chartViewModel.getSelectedNodes()[0].data.overwrite)

            if($scope.chartViewModel.getSelectedNodes()[0].data.overwrite){
                // get new type name, by default the original type name
                var instanceName =  $scope.chartViewModel.getSelectedNodes()[0].data.name;
                var oldTypeName = $scope.chartViewModel.getSelectedNodes()[0].data.type;

                $mdDialog.show({
                        //controller: DialogController,
                        templateUrl: 'mobius/dialog/overwrite_dialog.tmpl.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:false
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
                var isSubGraph = $scope.chartViewModel.getSelectedNodes()[0].data.subGraph;
                var newSubGraphModel =  $scope.chartViewModel.getSelectedNodes()[0].data.subGraphModel;

                nodeCollection.updateNodeType(oldTypeName, newTypeName, input,output,newProcedureDataModel,newInterfaceDataModel, isSubGraph,newSubGraphModel);

                // update this node
                $scope.chartViewModel.getSelectedNodes()[0].data.type = newTypeName;
                $scope.chartViewModel.getSelectedNodes()[0].data.version = 0;

                // update other nodes with original type and version 0
                // todo fix for subgraph
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

            generateCode.generateCode();

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


        $scope.$on('openSubGraph',function(){
            var inputPortProcedure = $scope.interfaceList[$scope.nodeIndex];
            var outputPortProcedure = $scope.dataList[$scope.nodeIndex];
            var nodeData = $scope.chartViewModel.nodes[$scope.nodeIndex].data;
            generateCode.openNewChart(nodeData, inputPortProcedure, outputPortProcedure);
            $scope.$emit('clearProcedure');
            $scope.$broadcast('Extend');
        });

        $scope.goRoot = function(){
            generateCode.goRoot();
            $scope.$emit('clearProcedure');
            $scope.$broadcast('Extend');
        };

        $scope.changeGraphView = function(index){
            generateCode.changeGraphView(index);
            $scope.$emit('clearProcedure');
            $scope.$broadcast('Extend');
        };
    }]);