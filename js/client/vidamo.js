var vidamo = angular.module('vidamo', ['ui.layout','ui.ace','ui.bootstrap','ngSanitize','ui.select2','ui.tree','flowChart','panzoom'])

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
        $scope.index = message;
        console.log('===================================================');
        console.log("nodeIndex passed to procedure:",$scope.index);
        $scope.data  = $scope.dataList[$scope.index];
        console.log('selected node procedures: ', $scope.data);
        console.log('procedures overall: ',$scope.dataList);
    });

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
                    value:''
                },
                {
                    name: "Input2",
                    value:''
                },
                {
                    name: "Input3",
                    value:''
                }
            ],
            outputConnectors: [
                {
                    name: "Output1",
                    value: "value"
                },
                {
                    name: "Output2",
                    value: "value"
                },
                {
                    name: "Output3",
                    value: "value"
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
                value: "initial"
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
        for(var i = 0; i < $scope.dataList.length; i++){

            var inputs = [];
            var outputs = [];
            console.log("Function: ", i);

            // print out values of inputs
                for(var n = 0; n < $scope.chartViewModel.nodes[i].inputConnectors.length; n++){
                    inputs.push($scope.chartViewModel.nodes[i].inputConnectors[n].data.value);
                }
            console.log("inputs: ", inputs);

            // print out content of procedures
            for(var j = 0; j < $scope.dataList[i].length; j++){
                console.log("   ", $scope.dataList[i][j]);
            }

            // print out values of outputs
                for(var y = 0; y < $scope.chartViewModel.nodes[i].outputConnectors.length; y++){
                    outputs.push($scope.chartViewModel.nodes[i].outputConnectors[y].data.value);
                }
            console.log("outputs: ",outputs);
            console.log("");
        }

        // execution orders based on topological sort
        console.log("Execution: ");
        for(var i = 0; i < sortedOrder.length; i++){
            console.log("Function: ",sortedOrder[i]);
        }

    };

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
                nodes: []
            });
        } else if(cate == 'Action'){
            $scope.data.push({
                id: $scope.data.length  + 1,
                title:  'Action',
                nodes: [],
                geo:[],
                x:[],
                y:[],
                z:[],
                width:[],
                height:[],
                depth:[]
            });
        } else if(cate == 'Control'){
            $scope.data.push({
                id: $scope.data.length  + 1,
                title:  'Control',
                nodes: []
            });
        }

        //onchange write the input value
        $scope.applyValue = function (cate, value,location){
            switch (cate){
                case 'looping': location.looping = value; break;
                case 'step': location.step = value; break;
                case 'geo': location.geo = value; break;
                case 'x': location.x = value; break;
                case 'y': location.y = value; break;
                case 'z':location.z = value; break;
                case 'width': location.width = value; break;
                case 'height': location.height = value; break;
                case 'depth': location.depth = value; break;
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
        }

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
