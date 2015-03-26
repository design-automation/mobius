var vidamo = angular.module('vidamo', ['ui.layout','ui.ace','ui.bootstrap','ngSanitize','ui.select','ui.select2','ui.tree','flowChart','panzoom'])

/////////////////////////////////////////////////////////////////////////////////
// graph controller

// Simple service to create a prompt.
vidamo.factory('prompt', function () {
    // Return the browsers prompt function.
    return prompt;
})

// Application controller
vidamo.controller('graphCtrl', function($scope,prompt,$rootScope) {

    // data structure of procedure list
    $scope.dataList = [];
    $scope.procedureList = [];
    $scope.nodeIndex = '';


    // Selects the next node id.
    var nextNodeID = 0;


    // Setup the data-model for the chart.
    var chartDataModel = {
        nodes: [],
        connections: []
    };

    // listen to the graph, when a node is clicked, update the visual procedure accordions
    // use $scope since $rootScope cause duplication from the undestroyed listener
     $scope.$on("nodeIndex", function(event, message) {
        $scope.nodeIndex = message;
        console.log('===================================================');
        console.log("nodeIndex passed to procedure:",$scope.nodeIndex);
        $scope.data  = $scope.dataList[$scope.nodeIndex];
        console.log('selected node procedures: ', $scope.data);
        console.log('procedures overall: ',$scope.dataList);
    });

    // listen to the graph, when a new connection is created, connected input data is changed
    // since it is needed when output data is changed if a new edge created
    //$scope.$on("newEdge", function() {
    //    for (var i =0; i < $scope.dataList.length; i++){
    //        for(var j = 0; j <$scope.dataList[i].length; j++){
    //           if($scope.dataList[i][j].title == 'Action'){
    //                if($scope.dataList[i][j].method == 'get input'){
    //                    for (var j = 0; j < $scope.dataList[i][j].parentNode.data.inputConnectors.length; j++) {
    //                        if ($scope.dataList[i][j].parentNode.data.inputConnectors[j].name == $scope.dataList[i][j].parameters[0]) {
    //                            $scope.dataList[i][j].dataValue = $scope.dataList[i][j].parentNode.data.inputConnectors[j].value;
    //                            console.log("xx",$scope.dataList[i][j].dataName, " ", $scope.dataList[i][j].dataValue);
    //                        }
    //                    }
    //                }
    //           }
    //        }
    //    }
    //});

    // Add a new node to the chart.
    $scope.addNewNode = function () {
        // promote for name of new node
        var nodeName = prompt("Enter a node name:", "New node");
        if (!nodeName) {
            return;
        }

        // Template for a new node
        var newNodeDataModel = {
            name: nodeName,
            id: nextNodeID++,
            x: 2200,
            y: 2000,
            inputConnectors: [
                //{
                //    name: "Input1",
                //    value:''
                //}//,
                //{
                //    name: "Input2",
                //    value:''
                //},
                //{
                //    name: "Input3",
                //    value:''
                //}
            ],
            outputConnectors: [
                //{
                //    //name: "Output1",
                //    //value: ''
                //}//,
                //{
                //    name: "Output2",
                //    value: ''
                //
                //},
                //{
                //    name: "Output3",
                //    value: ''
                //}
            ]
        };

        // when new node added, increase the number of procedure list by one
        $scope.dataList.push([]);

        $scope.chartViewModel.addNode(newNodeDataModel);

        // sort nodes topologically and emit the result to procedure part
        var sortedOrder = $scope.chartViewModel.topoSort().slice();
        console.log("after sorting: ", sortedOrder);
    };

    // Add an input connector to selected nodes.

    $scope.addNewInputConnector = function () {
        var connectorName = prompt("Enter a connector name:", "New connector");
        if (!connectorName) {
            return;
        }

        var selectedNodes = $scope.chartViewModel.getSelectedNodes();
        for (var i = 0; i < selectedNodes.length; ++i) {
            var node = selectedNodes[i];
            node.addInputConnector({
                name: connectorName,
                value: ""
            });
        }
    };

    // Add an output connector to selected nodes.

    $scope.addNewOutputConnector = function () {
        var connectorName = prompt("Enter a connector name:", "New connector");
        if (!connectorName) {
            return;
        }

        var selectedNodes = $scope.chartViewModel.getSelectedNodes();
        for (var i = 0; i < selectedNodes.length; ++i) {
            var node = selectedNodes[i];
            node.addOutputConnector({
                name: connectorName,
                value: "initial"
            });
        }
    };

    // Delete selected nodes and connections.

    $scope.deleteSelected = function () {
        $scope.chartViewModel.deleteSelected();
    };


    // Create the view-model for the chart and attach to the scope.

    $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);

    // run function
    // first execute the topological sort
    // then call the run function in procedural controller
    $scope.run = function(){
        // copy the sorted order
        var sortedOrder = $scope.chartViewModel.topoSort().slice();

        // execute procedures should follows the topological sort order
        // iterate through all nodes and their procedures to find methods and execute it
        for(var i = 0; i < sortedOrder.length; i++){
            for(var j = 0; j < $scope.dataList[sortedOrder[i]].length; j++){

                //find action procedure
                if($scope.dataList[sortedOrder[i]][j].title == 'Action'){

                    // implementation of all the execution methods

                    // get input method
                    // search the input connector in this node with the selected name
                    // and apply its value to the procedure node's data value
                    if ($scope.dataList[sortedOrder[i]][j].method == 'get input') {
                        for (var n = 0; n < $scope.dataList[sortedOrder[i]][j].parentNode.data.inputConnectors.length; n++) {
                            if ($scope.dataList[sortedOrder[i]][j].parentNode.data.inputConnectors[n].name
                                == $scope.dataList[sortedOrder[i]][j].parameters[0]) {
                                $scope.dataList[sortedOrder[i]][j].dataValue = $scope.dataList[sortedOrder[i]][j].parentNode.data.inputConnectors[n].value;
                                console.log("get input:",$scope.dataList[sortedOrder[i]][j].dataName, " ", $scope.dataList[sortedOrder[i]][j].dataValue);
                            }
                        }
                    }

                    // append output method
                    else  if ($scope.dataList[sortedOrder[i]][j].method == 'append output') {
                        // search the output connector in this node that match the selected name
                        // and replace the value of the output
                        for (var m = 0; m < $scope.dataList[sortedOrder[i]][j].parentNode.data.outputConnectors.length; m++) {
                            if ($scope.dataList[sortedOrder[i]][j].parentNode.data.outputConnectors[m].name
                                ==  $scope.dataList[sortedOrder[i]][j].parameters[0]) {
                                // update the output port data value
                                // todo fix
                               for(var n = 0; n < $scope.dataList[sortedOrder[i]].length; n++){
                                   if($scope.dataList[sortedOrder[i]][n].dataName == $scope.dataList[sortedOrder[i]][j].parameters[2]){
                                       $scope.dataList[sortedOrder[i]][j].parentNode.data.outputConnectors[m].value = $scope.dataList[sortedOrder[i]][n].dataValue;

                                       console.log($scope.dataList[sortedOrder[i]][j].parentNode.data.outputConnectors[m].name,
                                        $scope.dataList[sortedOrder[i]][j].parentNode.data.outputConnectors[m].value);
                                   }
                               }

                                //$scope.dataList[sortedOrder[i]][j].parentNode.data.outputConnectors[m].value = $scope.dataList[sortedOrder[i]][j].parameters[1];
                                //console.log($scope.dataList[sortedOrder[i]][j].parentNode.data.outputConnectors[m].name,
                                //    $scope.dataList[sortedOrder[i]][j].parentNode.data.outputConnectors[m].value);

                                // if this outport is connected
                                // update the connection value
                                // todo use id instead of name
                                for(var k = 0; k < $scope.chartViewModel.connections.length; k++){
                                    if($scope.dataList[sortedOrder[i]][j].parentNode.data.outputConnectors[m].name == $scope.chartViewModel.connections[k].source.name()){
                                        $scope.chartViewModel.connections[k].dest.data.value = $scope.dataList[sortedOrder[i]][j].parentNode.data.outputConnectors[m].value;
                                        $scope.chartViewModel.connections[k].data.value = $scope.dataList[sortedOrder[i]][j].parentNode.data.outputConnectors[m].value;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        // dummy code generation PART I
        // functions based on procedures
        // print out the list of function definitions
        $scope.javascriptCode = "//Function definitions:" + "\n"

        // use flag to check whether it is the first argument
        var flag= false;
        for(var i = 0; i < $scope.dataList.length; i++){

            $scope.javascriptCode = $scope.javascriptCode + "function node" + i +" (";

            // print out values of inputs (parameters)
            // check the input is empty by checking its value entity
            for(var n =0; n < $scope.chartViewModel.nodes[i].inputConnectors.length; n++){
                if($scope.chartViewModel.nodes[i].inputConnectors[n].data.value != ""){
                    if(flag == false){
                        $scope.javascriptCode = $scope.javascriptCode  + "input" + n;
                        flag =true;
                    }else{
                        $scope.javascriptCode = $scope.javascriptCode  + ", input" + n;
                    }
                }
            }
            flag = false;
            $scope.javascriptCode = $scope.javascriptCode  + "){" + "\n";

            // print out content of procedures
            // data procedure
            // print out code for single variable
            for(var j = 0; j < $scope.dataList[i].length; j++){
                if($scope.dataList[i][j].title == "Data"){
                    $scope.javascriptCode = $scope.javascriptCode  + "    " + "var "
                                                + $scope.dataList[i][j].dataName
                                                + " = "
                                                + $scope.dataList[i][j].dataValue + ";\n";

                }
            }

            // print out code for procedure functions
            // append output procedure
            for(var j = 0; j < $scope.dataList[i].length; j++){
                if($scope.dataList[i][j].title == "Action"){
                    if($scope.dataList[i][j].method == "append output"){
                        $scope.javascriptCode = $scope.javascriptCode  + "    " + "appendOutput("
                                                        + $scope.dataList[i][j].parameters[0] + ", "
                                                        + $scope.dataList[i][j].parameters[2] + ");\n"
                    }
                }
            }

            // get inpput procedure
            for(var j = 0; j < $scope.dataList[i].length; j++){
                if($scope.dataList[i][j].title == "Action"){
                    if($scope.dataList[i][j].method == "get input"){
                        $scope.javascriptCode = $scope.javascriptCode  + "    " + "var "
                                                        + $scope.dataList[i][j].dataName + " = getInput("
                                                        + $scope.dataList[i][j].parameters[0] + ");\n"
                    }
                }
            }

            // print return value
            // check the output port is empty by checking its value entity
            if($scope.chartViewModel.nodes[i].outputConnectors.length != 0) {
                $scope.javascriptCode = $scope.javascriptCode + "    " + "return ";
            }
            for(var n =0; n < $scope.chartViewModel.nodes[i].outputConnectors.length; n++){
                if($scope.chartViewModel.nodes[i].outputConnectors[n].data.value != ""){
                    if(n !=  $scope.chartViewModel.nodes[i].outputConnectors.length-1){
                        $scope.javascriptCode = $scope.javascriptCode  + $scope.chartViewModel.nodes[i].outputConnectors[n].data.name + ", ";
                    }else{
                        $scope.javascriptCode = $scope.javascriptCode  + $scope.chartViewModel.nodes[i].outputConnectors[n].data.name + ";\n";
                    }
                }else{console.log($scope.chartViewModel.nodes[i].outputConnectors[n])}
            }
            $scope.javascriptCode = $scope.javascriptCode  + "}\n\n";
        }

        // dummy code generation PART II
        // execution orders based on topological sort

        $scope.javascriptCode = $scope.javascriptCode + "// execution \n"
        for(var n = 0; n < sortedOrder.length; n++) {
            // case where the node has output
            if ($scope.chartViewModel.nodes[sortedOrder[n]].outputConnectors.length != 0) {
                $scope.javascriptCode = $scope.javascriptCode + "var result" + n + " = ";
                $scope.javascriptCode = $scope.javascriptCode + "node" + sortedOrder[n] + "(";
                // print all the parameters/inputs
                for (var m = 0; m < $scope.chartViewModel.nodes[sortedOrder[n]].inputConnectors.length; m++) {
                    if (m != $scope.chartViewModel.nodes[sortedOrder[n]].inputConnectors.length - 1) {
                        $scope.javascriptCode = $scope.javascriptCode + $scope.chartViewModel.nodes[sortedOrder[n]].inputConnectors[m].data.name + ", "
                    } else {
                        // find the connected output port of this input port
                        for (var k = 0; k < $scope.chartViewModel.connections.length; k++) {
                            // todo check id instead of name
                            // todo when one node return multiple outputs, should be an array
                            if ($scope.chartViewModel.connections[k].dest.data.name == $scope.chartViewModel.nodes[sortedOrder[n]].inputConnectors[m].data.name) {
                                var inputIndex = sortedOrder.indexOf(($scope.chartViewModel.connections[k].source.parentNode().data.id));
                                console.log($scope.chartViewModel.connections[k].source.parentNode().data.id);
                                $scope.javascriptCode = $scope.javascriptCode + "result" + inputIndex;
                            }
                        }
                    }
                }
                $scope.javascriptCode = $scope.javascriptCode + ");\n"
            }
            // case where the node has no output
            else {
                $scope.javascriptCode = $scope.javascriptCode + "node" + sortedOrder[n] + "(";
                // print all the parameters/inputs
                for (var m = 0; m < $scope.chartViewModel.nodes[sortedOrder[n]].inputConnectors.length; m++) {
                    for (var k = 0; k < $scope.chartViewModel.connections.length; k++) {
                        // todo check id instead of name
                        // todo when one node return multiple outputs, should be an array
                        // todo check the input connectors empty, exclude empty ones
                        if ($scope.chartViewModel.connections[k].dest.data.name == $scope.chartViewModel.nodes[sortedOrder[n]].inputConnectors[m].data.name) {
                            var inputIndex = sortedOrder.indexOf(($scope.chartViewModel.connections[k].source.parentNode().data.id));
                            if (flag == false) {
                                $scope.javascriptCode = $scope.javascriptCode + "result" + inputIndex;
                                flag == true;
                            } else {
                                $scope.javascriptCode = $scope.javascriptCode + ", result" + inputIndex;
                            }
                        }
                    }
                }
                $scope.javascriptCode = $scope.javascriptCode + ");\n"
            }
        }
    };

    // procedure manipulation
    $scope.remove = function(scope) {
        scope.remove();
    };

    $scope.toggle = function(scope) {
        scope.toggle();
    };

    $scope.newItem = function(cate) {
        if(cate == 'Data'){
            $scope.data.push({
                id: $scope.data.length  + 1,
                title:  'Data',
                nodes: [],
                dataName:'',
                dataValue:'',
                parentNode: $scope.chartViewModel.nodes[$scope.nodeIndex]
            });
        } else if(cate == 'Action'){
            $scope.data.push({
                id: $scope.data.length  + 1,
                title:  'Action',
                nodes: [],

                // for method name
                method:'',

                // for method's arguments
                parameters:[],

                // if the method is get data from input port, use following two as holder
                dataName:'',
                dataValue:'',
                parentNode: $scope.chartViewModel.nodes[$scope.nodeIndex]
            });
        } else if(cate == 'Control'){
            $scope.data.push({
                id: $scope.data.length  + 1,
                title:  'Control',
                nodes: [],
                parentNode: $scope.chartViewModel.nodes[$scope.nodeIndex]
            });
        }
    };
    //onchange write the input value
    $scope.applyValue = function (cate, value,location){
        switch (cate){
            // cases for data procedure
            case 'dataName':
                location.dataName = value;
                console.log("dataName:",value);
                break
            case 'dataValue':
                location.dataValue = value;break;
                console.log("dataValue:",value);

            // cases for action procedure
            case 'method':
                location.method = value; break;

            // cases for specific method in an action procedure

            // append output method, parameters: 1. output port, 2. dataValue 3. dataName
            case 'outputPort':
                location.parameters[0] = value; break;

            case 'outputDataName':
                console.log(value);
                var split = value.split(",");
                console.log("SPLIT1:",split[0]);
                console.log("SPLIT2:",split[1]);
                location.parameters[1] = split[0];
                location.parameters[2] = split[1]; break;

            // get input method, parameters: 1. input port name
             case 'inputPort':
                 location.parameters[0] = value;
                 console.log("input port name:",value);
                 break;
        }
        // check if the node is in the procedure list, if not add it
        var flag = false;
        for(var i = 0;i < $scope.procedureList.length; i++){
            if($scope.procedureList[i] == location){
                flag = true;
            }
        }
        if (flag == false){
            $scope.procedureList.push(location);
            console.log(location,"added!");
        }

        //console.log("applied!!!!!! ", cate, ": ",value," ",location.id);
        //console.log("parent node: node ",location.parentNode.data.id);
        //console.log("procedures in this node: ", $scope.dataList[$scope.nodeIndex]);
        //console.log("parameters: ", location.parameters)

        // real-time execution methods
        // append output and get input need to be executed in real time
        //if(location.title == 'Action') {
        //
        //    // append output method
        //    if (location.method == 'append output') {
        //        // search the output connector in this node that match the selected name
        //        // and replace the value of the output
        //        for (var i = 0; i < location.parentNode.data.outputConnectors.length; i++) {
        //            if (location.parentNode.data.outputConnectors[i].name == location.parameters[0]) {
        //                // update the output port data value
        //                location.parentNode.data.outputConnectors[i].value = location.parameters[1];
        //                console.log(location.parentNode.data.outputConnectors[i].name, location.parentNode.data.outputConnectors[i].value);
        //            }
        //        }
        //    }
        //
        //    // get input method
        //    else if (location.method == 'get input') {
        //        // search the input connector in this node with the selected name
        //        // and apply its value to the procedure node's data value
        //        for (var j = 0; j < location.parentNode.data.inputConnectors.length; j++) {
        //            if (location.parentNode.data.inputConnectors[j].name == location.parameters[0]) {
        //                location.dataValue = location.parentNode.data.inputConnectors[j].value;
        //                console.log(location.dataName, " ", location.dataValue);
        //            }
        //        }
        //    }
        //}
    };
});

//////////////////////////////////////////////////////////////////////////////////////
// zoom and pan controller
vidamo.controller('znpController', ['$scope',
    function($scope) {
        var rect = { x : 2000, y: 2400, width: 500 , height:500};
        // Instantiate models which will be passed to <panzoom> and <panzoomwidget>

        // The panzoom config model can be used to override default configuration values
        $scope.panzoomConfig = {
            initialZoomToFit: rect
        };

        // The panzoom model should initialle be empty; it is initialized by the <panzoom>
        // directive. It can be used to read the current state of pan and zoom. Also, it will
        // contain methods for manipulating this state.
        $scope.panzoomModel = {};

    }
]);
