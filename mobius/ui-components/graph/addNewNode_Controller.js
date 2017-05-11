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
        // procedure data list
        $scope.dataList = generateCode.getDataList();

        // interface data list
        $scope.interfaceList= generateCode.getInterfaceList();

        // graph flowchart view model
        $scope.chartViewModel= generateCode.getChartViewModel();

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

        $scope.$watch(function(){return generateCode.getChartViewModel()},function(){
            $scope.chartViewModel = generateCode.getChartViewModel();
            $scope.dataList = generateCode.getDataList();
            $scope.interfaceList= generateCode.getInterfaceList();
        });

        $scope.$watch(function () { return generateCode.getDataList(); }, function () {
            $scope.dataList = generateCode.getDataList();
        },true);

        $scope.$watch(function () { return generateCode.getInterfaceList(); }, function () {
            $scope.interfaceList= generateCode.getInterfaceList();
        },true);

        // synchronization with node collection
        // new node type
        $scope.nodeTypes = function(){
            var x = angular.copy(nodeCollection.getNodeTypes());
            x.splice(0,0,"create new type");
            x.splice(1,0,"create new sub-graph");
            return x;
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
	        $scope.nodeMenu.display="none";


            if(type === 'create new type'){
                $scope.$emit('cleanGraph');
	            // install new node type and update type
                $mdDialog.show({
                    //controller: DialogController,
                    templateUrl: 'mobius/dialog/inputName_dialog.tmpl.html',
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

                    //nodeCollection.installNewNodeType(newTypeName);
                    if(newTypeName !== undefined){
                        type = newTypeName;
                    }

                    addNode(type,false); console.log("adding node");
                });
            }
            else if(type === 'create new sub-graph'){
                $scope.$emit('cleanGraph');
                $mdDialog.show({
                    //controller: DialogController,
                    templateUrl: 'mobius/dialog/inputName_dialog.tmpl.html',
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

                    // pass in subGraph flag
                    // nodeCollection.installNewNodeType(newTypeName,true);
                    if(newTypeName !== undefined){
                        type = newTypeName;
                    }

                    addNode(type, true);
                });
            }
            else{
                addNode(type);
            }

            function addNode(type, ifSubgraph){
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
                newNodeDataModel.overwrite = nodeCollection.getOverwrite(type);
                newNodeDataModel.type = type;
                newNodeDataModel.version = 0;
                newNodeDataModel.disabled = false;

                if(nodeCollection.ifSubGraph(type) !== undefined){
                    newNodeDataModel.subGraph = nodeCollection.ifSubGraph(type);
                    newNodeDataModel.subGraphModel = nodeCollection.getSubGraphModel(type);
                }else{
                    newNodeDataModel.subGraph = ifSubgraph;
                    if(ifSubgraph){
                        newNodeDataModel.subGraphModel = {
                            javascriptCode: '// To generate code,\n' + '// create nodes & procedures and run!\n',
                            geomListCode: "var geomList = [];\n",
                            innerCodeList: [],
                            outerCodeList: [],
                            dataList: [],
                            interfaceList: [],
                            chartDataModel: {
                                "nodes": [],
                                "connections": [],
                                "inputPort": {
                                    x: 1900,
                                    y: 1900,
                                    outputConnectors: []
                                },
                                "outputPort": {
                                    x: 1900,
                                    y: 2300,
                                    inputConnectors: []
                                }
                            }
                        }
                    }else{
                        newNodeDataModel.subGraphModel = undefined;
                    }
                }



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


	    $scope.nodeMenu = {
		    x:0,
		    y:0,
		    width:0,
		    height:0,
            display:"none",
		    direction:"auto"

	    };

	    $scope.$on("doubleClickCordinatesOnSVG", function (evt, data) {

            //Getting the Pane where the menu need to be displayed
	        var panZoomPosition=$($(".panzoom.pan-zoom-frame")[0]);

	        //Checking if the click is near to the edge of the right end of window and shifting it towards left if near
	        if(data[0]>$(window).width()-$("#test").width()){
		    data[0]=$(window).width()-$("#test").width();
		    }

		    //Checking if the click is near to the edge of the bottom end of window and shifting it towards top if near
	        if(data[1]>=Math.floor(panZoomPosition.offset().top+panZoomPosition.height()- $("#test").height()* $scope.nodeTypes().length )){
		        $scope.nodeMenu.direction="up";
		        //angular.element('#test-choices').scope().$select.dropdownPosition= "up"
	            data[1]=Math.floor(panZoomPosition.offset().top+panZoomPosition.height()-$("#test").height());

	        }
	        else{
		        //angular.element('#test-choices').scope().$select.dropdownPosition= "auto"
		        $scope.nodeMenu.direction="auto";

            }

		    $scope.nodeMenu.x=data[0];
		    $scope.nodeMenu.y=data[1];
		    $scope.nodeMenu.display="inline-block";

	    });


    }])