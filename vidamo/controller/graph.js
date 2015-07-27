//
// VIDAMO Left Graph controller
//

vidamo.controller('graphCtrl',[
                    '$scope',
                    'generateCode',
                    'prompt',
    function($scope,generateCode,prompt) {

        // synchronization with vidamo application data pool

        // generated javascript code
        $scope.javascriptCode = generateCode.getJavascriptCode();
        $scope.$watch('javascriptCode', function () {
            generateCode.setJavascriptCode($scope.javascriptCode);
        });
        $scope.$watch(function () { return generateCode.getJavascriptCode(); }, function () {
            $scope.javascriptCode = generateCode.getJavascriptCode();
        });

        // function code for procedures
        $scope.codeList = generateCode.getCodeList();
        $scope.$watch('codeList', function () {
            generateCode.setCodeList($scope.codeList);
        });
        $scope.$watch(function () { return generateCode.getCodeList(); }, function () {
            $scope.codeList = generateCode.getCodeList();
        });

        // procedure data list
        $scope.dataList = generateCode.getDataList();
        $scope.$watch('dataList', function () {
            generateCode.setDataList($scope.dataList);
        });
        $scope.$watch(function () { return generateCode.getDataList(); }, function () {
            $scope.dataList = generateCode.getDataList();
        });

        // interface data list
        $scope.interfaceList= generateCode.getInterfaceList();
        $scope.$watch('interfaceList', function () {
            generateCode.setInterfaceList($scope.interfaceList);
        });
        $scope.$watch(function () { return generateCode.getInterfaceList(); }, function () {
            $scope.interfaceList = generateCode.getInterfaceList();
        });

        // graph flowchart view model
        $scope.chartViewModel= generateCode.getChartViewModel();
        $scope.$watch('chartViewModel', function () {
                generateCode.setChartViewModel($scope.chartViewModel);
        });
        $scope.$watch(function () { return generateCode.getChartViewModel(); }, function () {
            $scope.chartViewModel = generateCode.getChartViewModel();
        });


        // currently selected node ID
        $scope.nodeIndex = '';

        // currently selected node name
        $scope.currentNodeName = '';

        // Selects the next node id.
        var nextNodeID = 0;

        // number of deleted nodes which have the largest node id
        // in order to correct the new node id
        var numOfDeletedTopNode =0;

        // Setup the data-model for the chart.
        var chartDataModel = {
            nodes: [],
            connections: []
        };

        // Create the view-model for the chart and attach to the scope.
        $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);

        // new node type
        $scope.nodeTypes = ['empty'];

        // listen to the graph, when a node is clicked, update the visual procedure/ code/ interface accordions
         $scope.$on("nodeIndex", function(event, message) {

             $scope.nodeIndex = message;

             $scope.currentNodeName =  $scope.chartViewModel.nodes[$scope.nodeIndex].data.name;

             // update generated code

             generateCode.generateCode();
         });


        // Add a new node to the chart.
        $scope.addNewNode = function (type) {

            // promote for name of new node
            var nodeName = prompt('Enter a node name:', 'node' + ($scope.chartViewModel.nodes.length + numOfDeletedTopNode));

            // validate input name
            if (!isValidName(nodeName)) {
                return;
            }

            // Template for a new node
            if(type == "empty"){
                var newNodeDataModel = {
                    name: nodeName,
                    id: nextNodeID++,
                    x: 1900,
                    y: 2100,
                    inputConnectors: [
                    ],
                    outputConnectors: [
                    ]
                };
            }

            // when new node added, increase the number of procedure list by one

            $scope.dataList.push([]);

            // when new node added, add new code block

            $scope.codeList.push('//\n' + '// To generate code, create nodes & procedures and run!\n' + '//\n');

            // when new node added, increase the number of interface list by one

            $scope.interfaceList.push([]);

            $scope.chartViewModel.addNode(newNodeDataModel);

            // update generated code
            generateCode.generateCode();
        };

        // Add an input connector to selected nodes.

        $scope.addNewInputConnector = function () {
            try{
                var connectorName = prompt("Enter a connector name:", "in"
                    + $scope.chartViewModel.nodes[$scope.nodeIndex].inputConnectors.length
                    + '_'
                    + $scope.chartViewModel.nodes[$scope.nodeIndex].data.name);

                if (!isValidName(connectorName)) {
                    return;
                }

                var selectedNodes = $scope.chartViewModel.getSelectedNodes();

                for (var i = 0; i < selectedNodes.length; ++i) {
                    var node = selectedNodes[i];

                    node.addInputConnector({
                        name: connectorName,
                        value:''
                    });
                }
            }
            catch(err){
                document.getElementById('log').innerHTML += "<div style='color: red'>Error: no node selected!</div>";
            }

            // update generated code
            generateCode.generateCode();
        };

        // Add an output connector to selected nodes.

        $scope.addNewOutputConnector = function () {

            try{
                var connectorName = prompt("Enter a connector name:", "out"
                    + $scope.chartViewModel.nodes[$scope.nodeIndex].outputConnectors.length);


                if (!isValidName(connectorName)) {
                    return;
                }

                var selectedNodes = $scope.chartViewModel.getSelectedNodes();
                for (var i = 0; i < selectedNodes.length; ++i) {
                    var node = selectedNodes[i];
                    node.addOutputConnector({
                        name: connectorName,
                        value: ""
                    });
                }
            }
            catch(err){
                document.getElementById('log').innerHTML += "<div style='color: red'>Error: no node selected!</div>";
            }


            // update generated code
            generateCode.generateCode();
        };

        // Delete selected nodes and connections in data&view model

        $scope.deleteSelected = function () {
            var deletedNodeIds = $scope.deleteSelected();

            // update only if selected is a node
            if(deletedNodeIds[0]){
                // update scene data structure
                nextNodeID --;
                $scope.dataList.splice(deletedNodeIds[0],1);
                $scope.interfaceList.splice(deletedNodeIds[0],1);

                // using this variable for auto fill node name correction
                if(deletedNodeIds[0] != chartDataModel.nodes.length){
                    numOfDeletedTopNode++;
                }
            }


            // update generated code
            generateCode.generateCode();
        };


        //
        // ------------------------------------- RUN-TIME EXECUTIONS -----------------------------------
        //

        $scope.run = function(){

            // declare start running in console

            document.getElementById('log').innerHTML += "<div></br> Executing generated code ... </div>";

            try{
                eval( $scope.javascriptCode);
            }catch (e) {
                document.getElementById('log').innerHTML +=     "<div style='color:red'>" +  e.message + "</div>";
                alert(e.stack);
            }

            document.getElementById('log').innerHTML += "<div> Execution done </div>";
        }

    }]);