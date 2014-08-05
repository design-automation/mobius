var vidamo = angular.module('vidamo', ['ui.layout','ui.ace','ui.bootstrap','ngSanitize','ui.select2','ui.tree','flowChart','panzoom'])

/////////////////////////////////////////////////////////////////////////////////
// graph controller

// Simple service to create a prompt.
vidamo.factory('prompt', function () {

    // Return the browsers prompt function.
    return prompt;
})

// Application controller.
vidamo.controller('graphCtrl', ['$scope', 'prompt', function AppCtrl ($scope, prompt) {

    // Selects the next node id.
    var nextNodeID = 10;

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
                    name: "Input1"
                },
                {
                    name: "Input2"
                },
                {
                    name: "Input3"
                }
            ],
            outputConnectors: [
                {
                    name: "Output1"
                },
                {
                    name: "Output2"
                },
                {
                    name: "Output3"
                }
            ],
        };

        $scope.chartViewModel.addNode(newNodeDataModel);
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
            });
        }
    };

    // Delete selected nodes and connections.
    $scope.deleteSelected = function () {

        $scope.chartViewModel.deleteSelected();
    };

    // Create the view-model for the chart and attach to the scope.

    $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
}]);

//////////////////////////////////////////////////////////////////////////////////////
// procedure tab (nested and dnd accordion) controller
vidamo.controller('treeCtrl', function($scope,$rootScope) {
    $scope.remove = function(scope) {
        scope.remove();
    };

    $scope.toggle = function(scope) {
        scope.toggle();
    };

//    $scope.newSubItem = function(scope) {
//        var nodeData = scope.$modelValue;
//        nodeData.nodes.push({
//            id: nodeData.id * 10 + nodeData.nodes.length,
//            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
//            nodes: []
//        });
//    };

    $scope.newItem = function(cate) {
        if(cate == 'Data'){
            $scope.data.push({
                id: $scope.data.length  + 1,
                title:  'Data',
                nodes: [],
                cmd:[]
            });
        } else if(cate == 'Action'){
            $scope.data.push({
                id: $scope.data.length  + 1,
                title:  'Action',
                nodes: [],
                cmd:[]
            });
        } else if(cate == 'Control'){
            $scope.data.push({
                id: $scope.data.length  + 1,
                title:  'Control',
                nodes: [],
                cmd:[]
            });
        }

    };
//dummy list for now
    $scope.dataList = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

    $rootScope.$on("nodeIndex", function(event, message) {
        $scope.index = message;
        console.log("nodeIndex passed to tree:",$scope.index);
        $scope.data = $scope.dataList[$scope.index];
    });

});



//////////////////////////////////////////////////////////////////////////////////////
// zoom and pan controller
vidamo.controller('TestController', ['$scope',
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
