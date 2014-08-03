var vidamo = angular.module('vidamo', ['ui.layout','ui.ace','ui.bootstrap','ngSanitize','ui.tree','flowChart','panzoom'])

// procedure tab (nested and dnd accordion) cpntroller
vidamo.controller('treeCtrl', function($scope) {
    $scope.remove = function(scope) {
        scope.remove();
    };

    $scope.toggle = function(scope) {
        scope.toggle();
    };

    $scope.newSubItem = function(scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
            id: nodeData.id * 10 + nodeData.nodes.length,
            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
            nodes: []
        });
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
                nodes: []
            });
        } else if(cate == 'Control'){
            $scope.data.push({
                id: $scope.data.length  + 1,
                title:  'Control',
                nodes: []
            });
        }

    };

    $scope.data = [{
        "id": 1,
        "title": "Control",
        "nodes": [
            {
                "id": 11,
                "title": "Control",
                "nodes": []
            },
            {
                "id": 12,
                "title": "Data",
                "nodes": []
            }
        ]
    }, {
        "id": 2,
        "title": "Control",
        "nodes": []
    }];
});

/////////////////////////////////////////////////////////////////////////////////
// graph controller

// Simple service to create a prompt.
    vidamo.factory('prompt', function () {

        /* Uncomment the following to test that the prompt service is working as expected.
         return function () {
         return "Test!";
         }
         */
        // Return the browsers prompt function.
        return prompt;
    })

// Application controller.
    vidamo.controller('graphCtrl', ['$scope', 'prompt', function AppCtrl ($scope, prompt) {

        // Selects the next node id.
        var nextNodeID = 10;

        // Setup the data-model for the chart.
        var chartDataModel = {
            nodes: [
//                {
//                    name: "Example Node 1",
//                    id: 0,
//                    x: 2000,
//                    y: 2000,
//                    inputConnectors: [{name: "A"},{name: "B"},{name: "C"},],
//                    outputConnectors: [
//                        {
//                            name: "A",
//                        },
//                        {
//                            name: "B",
//                        },
//                        {
//                            name: "C",
//                        },
//                    ],
//                },
//
//                {
//                    name: "Example Node 2",
//                    id: 1,
//                    x: 2000,
//                    y: 2200,
//                    inputConnectors: [
//                        {
//                            name: "A",
//                        },
//                        {
//                            name: "B",
//                        },
//                        {
//                            name: "C",
//                        },
//                    ],
//                    outputConnectors: [
//                        {
//                            name: "A",
//                        },
//                        {
//                            name: "B",
//                        },
//                        {
//                            name: "C",
//                        },
//                    ],
//                },

            ],
            connections: [
//                {
//                    source: {
//                        nodeID: 0,
//                        connectorIndex: 1,
//                    },
//
//                    dest: {
//                        nodeID: 1,
//                        connectorIndex: 2,
//                    },
//                },


            ]
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
    }])
;

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
