//
// Mobius Graph Add Node/Type controller
//

mobius.controller('newNodeCtrl',[
    '$scope',
    '$timeout',
    'consoleMsg',
    'hotkeys',
    'generateCode',
    'nodeCollection',
    'prompt',
    '$mdDialog',
    function($scope,$timeout,consoleMsg,hotkeys,generateCode,nodeCollection,prompt,$mdDialog) {

        // synchronization with mobius application data pool

        // inner function code for procedures
        $scope.innerCodeList = generateCode.getInnerCodeList();
        $scope.$watch('innerCodeList', function () {
            generateCode.setInnerCodeList($scope.innerCodeList);
        },true);
        $scope.$watch(function () { return generateCode.getInnerCodeList(); }, function () {
            $scope.innerCodeList = generateCode.getInnerCodeList();
        },true);

        // outer function code for procedures
        $scope.outerCodeList = generateCode.getOuterCodeList();
        $scope.$watch('outerCodeList', function () {
            generateCode.setOuterCodeList($scope.outerCodeList);
        },true);
        $scope.$watch(function () { return generateCode.getOuterCodeList(); }, function () {
            $scope.outerCodeList = generateCode.getOuterCodeList();
        },true);

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
        $scope.chartViewModel= generateCode.getChartViewModel();
        $scope.$watch('chartViewModel.data', function () {
            generateCode.generateCode();
        },true);

        $scope.$watch(function () { return generateCode.getChartViewModel(); }, function () {
            if(generateCode.getChartViewModel() !== $scope.chartViewModel){
                $scope.chartViewModel= generateCode.getChartViewModel();
            }
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
        // fixme replace eval with regex
        function isValidName(inputName) {
            var valid = true;

            if (inputName) {
                var testString = 'function ' + inputName + '(){};';

                try {
                    eval(testString);
                } catch (err) {
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
        };


        // Add a new node to the chart.
        $scope.addNewNode = function (type) {
            if(type === 'create new type'){
                // install new node type and update type
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'mobius/template/inputName_dialog.tmpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:false,
                    focusOnOpen:false
                }).then(function(newTypeName){
                    if (!isValidName(newTypeName)) {
                        consoleMsg.errorMsg('invalidName');
                        return;}

                    if ($scope.nodeTypes().indexOf(newTypeName) >= 0 ){
                        consoleMsg.errorMsg('dupName');
                        return;
                    }

                    var newProcedureDataModel =  [];
                    var newInterfaceDataModel = [];

                    nodeCollection.installNewNodeType(newTypeName,newProcedureDataModel,newInterfaceDataModel);
                    if(newTypeName !== undefined){
                        type = newTypeName;
                    }

                    addNode(type);
                });
            }else{
                addNode(type);
            }

            function addNode(type){
                // add node to graph
                var tempIndex = 0;
                for(var i =0; i < $scope.chartViewModel.nodes.length; i++){
                    if($scope.chartViewModel.nodes[i].data.type === type){
                        tempIndex ++;
                    }
                }

                var nodeName = type + tempIndex;

                // update node name, node id and location
                var newNodeDataModel = {};
                // fixme potential id duplication
                newNodeDataModel.id = $scope.chartViewModel.nodes.length;
                newNodeDataModel.name = nodeName;
                // fixme canvas reconfiguration requried
                newNodeDataModel.x = 1900;
                newNodeDataModel.y = 2100;
                newNodeDataModel.inputConnectors = nodeCollection.getInputConnectors(type);
                newNodeDataModel.outputConnectors = nodeCollection.getOutputConnectors(type);
                newNodeDataModel.type = type;
                newNodeDataModel.version = 0;
                newNodeDataModel.overwrite = nodeCollection.getOverwrite(type);
                newNodeDataModel.disabled = false;

                // when new node added, increase the number of procedure list by one
                $scope.dataList.push(nodeCollection.getProcedureDataModel(type));

                // when new node added, add new code block
                $scope.innerCodeList.push('//\n' + '// To generate code, create nodes & procedures and run!\n' + '//\n');
                $scope.outerCodeList.push('//\n' + '// To generate code, create nodes & procedures and run!\n' + '//\n');

                var tempInterface = nodeCollection.getInterfaceDataModel(type);
                if(tempInterface){
                    for(var i = 0; i < tempInterface.length; i++){
                        if(tempInterface[i].connected === true){
                            tempInterface[i].connected = false;
                        }
                    }
                }
                // when new node added, increase the number of interface list by one
                $scope.interfaceList.push(tempInterface);

                // todo interface code list

                // add new node data model to view model

                $scope.chartViewModel.addNode(newNodeDataModel);

                // dynamically link input and output from graph and procedure
                for(var i =0; i < $scope.chartViewModel.nodes.length; i++){
                    for(var j = 0 ; j < $scope.chartViewModel.nodes[i].outputConnectors.length; j++ ){
                        for(var k = 0; k < $scope.dataList[i].length; k++){
                            if($scope.dataList[i][k].title === 'Output'){
                                if($scope.chartViewModel.nodes[i].outputConnectors[j].data.id
                                    === $scope.dataList[i][k].id ){
                                    $scope.chartViewModel.nodes[i].outputConnectors[j].data =
                                        $scope.dataList[i][k];
                                }
                            }
                        }
                    }
                }


                for(var i =0; i < $scope.chartViewModel.nodes.length; i++) {
                    for (var j = 0; j < $scope.chartViewModel.nodes[i].inputConnectors.length; j++) {
                        for (var k = 0; k <  $scope.interfaceList[i].length; k++) {
                            if ($scope.interfaceList[i][k].title === 'Input') {


                                if ($scope.chartViewModel.nodes[i].inputConnectors[j].data.id
                                    === $scope.interfaceList[i][k].id) {
                                    $scope.chartViewModel.nodes[i].inputConnectors[j].data =
                                        $scope.interfaceList[i][k];
                                }
                            }
                        }
                    }
                }

                // clean dropdown menu -> flowchart directive
                $scope.$emit('cleanGraph');

                $scope.nextNodeId++;
            }
        };
    }]);