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
                {
                    name: "Input1",
                    value:"1"
                },
                {
                    name: "Input2",
                    value:"2"
                },
                {
                    name: "Input3",
                    value:"3"
                }
            ],
            outputConnectors: [
                {
                    name: "Output1",
                    value: ''
                },
                {
                    name: "Output2",
                    value: ''

                },
                {
                    name: "Output3",
                    value: ''
                }
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

        // dummy code generation for functions based on procedures
        console.log("=================== dummy code generation ===================");

        // print out the list of function definitions
        console.log("Function definitions:");
        $scope.javascriptCode = "Function definitions:" + "\n";
        for(var i = 0; i < $scope.dataList.length; i++){

            var inputs = [];
            var outputs = [];

            console.log("Function: ", i);
            $scope.javascriptCode = $scope.javascriptCode + "Function: " + i + "\n";

            // print out values of inputs
            for(var n = 0; n < $scope.chartViewModel.nodes[i].inputConnectors.length; n++){
                    inputs.push($scope.chartViewModel.nodes[i].inputConnectors[n].data.value);
                }

            console.log("inputs: ", inputs);
            $scope.javascriptCode = $scope.javascriptCode + "inputs: " + inputs + "\n";

            // print out content of procedures
            for(var j = 0; j < $scope.dataList[i].length; j++){
                console.log("   ", $scope.dataList[i][j]);
                $scope.javascriptCode = $scope.javascriptCode  + "    " +  $scope.dataList[i][j] + "\n";
            }

            // print out values of outputs
                for(var y = 0; y < $scope.chartViewModel.nodes[i].outputConnectors.length; y++){
                    outputs.push($scope.chartViewModel.nodes[i].outputConnectors[y].data.value);
                }

            console.log("outputs: ",outputs);
            $scope.javascriptCode = $scope.javascriptCode + "outputs: " + outputs + "\n";

            console.log("");
            $scope.javascriptCode = $scope.javascriptCode  + "\n";
        }

        // execution orders based on topological sort
        console.log("Execution: ");
        $scope.javascriptCode = $scope.javascriptCode  + "Execution: " + "\n";

        for(var i = 0; i < sortedOrder.length; i++){
            console.log("Function: ",sortedOrder[i]);
            $scope.javascriptCode = $scope.javascriptCode  + "Function: " + sortedOrder[i] + "\n";
        }

        console.log($scope.chartViewModel.connections[0].dest);

        // iterate through all nodes and their procedures to find methods and execute it
        for(var i = 0; i < $scope.dataList.length ; i++){
            for(var j = 0; j < $scope.dataList[i].length; j++){

                //find action procedure
                if($scope.dataList[i][j].title == 'Action'){

                    // implementation of all the execution methods


                    // get input method
                    if ($scope.dataList[i][j].method == 'get input') {
                        // search the input connector in this node with the selected name
                        // and apply its value to the procedure node's data value
                        for (var n = 0; n < $scope.dataList[i][j].parentNode.data.inputConnectors.length; n++) {
                            if ($scope.dataList[i][j].parentNode.data.inputConnectors[n].name == $scope.dataList[i][j].parameters[0]) {
                                $scope.dataList[i][j].dataValue = $scope.dataList[i][j].parentNode.data.inputConnectors[n].value;
                                console.log($scope.dataList[i][j].dataName, " ", $scope.dataList[i][j].dataValue);
                            }
                        }
                    }

                    // append output method
                    else  if ($scope.dataList[i][j].method == 'append output') {
                        // search the output connector in this node that match the selected name
                        // and replace the value of the output
                        for (var m = 0; m < $scope.dataList[i][j].parentNode.data.outputConnectors.length; m++) {
                            if ($scope.dataList[i][j].parentNode.data.outputConnectors[m].name == $scope.dataList[i][j].parameters[0]) {
                                // update the output port data value
                                $scope.dataList[i][j].parentNode.data.outputConnectors[m].value = $scope.dataList[i][j].parameters[1];
                                console.log($scope.dataList[i][j].parentNode.data.outputConnectors[m].name,$scope.dataList[i][j].parentNode.data.outputConnectors[m].value);

                                // if this outport is connected
                                // update the connection value
                                // todo use id instead of name
                                for(var k = 0; k < $scope.chartViewModel.connections.length; k++){
                                    if($scope.dataList[i][j].parentNode.data.outputConnectors[m].name == $scope.chartViewModel.connections[k].source.name()){
                                        $scope.chartViewModel.connections[k].dest.data.value = $scope.dataList[i][j].parentNode.data.outputConnectors[m].value;
                                        console.log($scope.chartViewModel.connections[k].dest.value());
                                    }
                                }
                            }
                        }
                    }


                }
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
            case 'dataName':location.dataName = value;break;
            case 'dataValue':location.dataValue = value;break;

            // cases for action procedure
            case 'method': location.method = value; break;

            // cases for specific method in an action procedure

            // append output method, parameters: 1. output port, 2. dataName
            case 'outputPort': location.parameters[0] = value; break;
            case 'outputDataName': location.parameters[1] = value; break;

            // get input method, parameters: 1. input port, 2. dataName
            case 'inputPort': location.parameters[0] = value; break;
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
