var vidamo = angular.module('vidamo', ['ui.layout','ui.ace','ui.bootstrap','ngSanitize','ui.select2','ui.tree','flowChart','panzoom'])

/////////////////////////////////////////////////////////////////////////////////
// graph controller

// Simple service to create a prompt.
vidamo.factory('prompt', function () {

    // Return the browsers prompt function.
    return prompt;
})

// Application controller
vidamo.controller('graphCtrl', ['$scope', 'prompt', function ($scope,prompt,$rootScope) {

    // Selects the next node id.
    var nextNodeID = 0;

    // Setup the data-model for the chart.
    var chartDataModel = {
        nodes: [],
        connections: []
    };

    // Add a new node to the chart.
    $scope.addNewNode = function () {

        var nodeName = prompt("Enter a node name:", "New node");
        if (!nodeName) {
            return;
        }
        // Template for a new node.

        var newNodeDataModel = {
            name: nodeName,
            id: nextNodeID++,
            x: 2200,
            y: 2000,
            inputConnectors: [
                {
                    name: "Input1",
                    value:'initial'
                },
                {
                    name: "Input2",
                    value:'initial'
                },
                {
                    name: "Input3",
                    value:'initial'
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

        // add node and emit the result to procedure part
        $scope.chartViewModel.addNode(newNodeDataModel);
        var newNodeAdded =true;
        $scope.$emit('newNodeAdded',newNodeAdded);

        // sort nodes topologically and emit the result to procedure part
        var sortedOrder = $scope.chartViewModel.topoSort().slice();
        console.log("after sorting: ", sortedOrder);
        //$scope.$emit("sortedOrder", sortedOrder);

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

    // run function
    // first execute the topological sort
    // then call the run function in procedural controller
    $scope.run = function(){
        var sortedOrder = $scope.chartViewModel.topoSort().slice();
        $scope.$emit("topoSort",sortedOrder);
    };


    // Create the view-model for the chart and attach to the scope.
    $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);

}]);

//////////////////////////////////////////////////////////////////////////////////////
// procedure tab (nested and dnd accordion) controller
vidamo.controller('procedureCtrl', function($scope,$rootScope) {
    // link graph nodes with procedures
    // link procedure with nodes from graph controller
    $scope.dataList = [];

    // listen to the graph, when a new new node added, update the dataList[]
    $rootScope.$on("newNodeAdded",
        function(event, message) {
            if(message == true) {
                $scope.dataList.push([]);
            }
        }
    );

    // listen to the graph, when a node is clicked, update the visual procedure accordions
    $rootScope.$on("nodeIndex", function(event, message) {
        $scope.index = message;
        console.log('===================================================');
        console.log("nodeIndex passed to procedure:",$scope.index);
        $scope.data  = $scope.dataList[$scope.index];
        console.log('selected node procedures: ', $scope.data);
        console.log('procedures overall: ',$scope.dataList);
    });

    $scope.procedureList = [];

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

    // listen to the graph, when RUN in graph controlled is called, get the topological sort order and execute procedure "functions"
    $rootScope.$on("topoSort",
        function(event,message){
            var sortedOrder = message.slice();

            // dummy code generation for functions based on procedures
            console.log("=================== dummy code generation ===================");

            // print out the list of function definitions
            console.log("Function definitions:");
            for(var i = 0; i < $scope.dataList.length; i++){
                console.log("Function: ", i);
                for(var j = 0; j < $scope.dataList[i].length; j++){
                    console.log("   ", $scope.dataList[i][j]);
                }
            }

            // execution orders based on topological sort
            console.log("");
            console.log("Execution: ");
            for(var i = 0; i < sortedOrder.length; i++){
                console.log("Function: ",sortedOrder[i]);
            }
        });

    $scope.run = function(){

        // actual execution
        for (var i = 0;i < $scope.procedureList.length; i++){
            if($scope.procedureList[i].geo == 'box'){
                var widthSegments = 1;
                var heightSegments = 1;
                var depthSegments = 1;

                var geometry = new THREE.BoxGeometry( $scope.procedureList[i].width, $scope.procedureList[i].height, $scope.procedureList[i].depth, widthSegments, heightSegments, depthSegments );
                var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
                mesh.name = 'Box ' + ( ++ meshCount );

                editor.addObject( mesh );
                editor.select( mesh );
                mesh.position = new THREE.Vector3($scope.procedureList[i].x, $scope.procedureList[i].y, $scope.procedureList[i].z)
            }
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
