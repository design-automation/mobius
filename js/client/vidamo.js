var vidamo = angular.module('vidamo', ['ui.layout','ui.ace','ui.bootstrap','ngSanitize','ui.tree','flowChart','panzoom'])

/////////////////////////////////////////////////////////////////////////////////
// graph controller

// Simple service to create a prompt.
vidamo.factory('prompt', function () {
    // Return the browsers prompt function.
    return prompt;
})

// config to add blob as safe prefix in the white list
vidamo.config( [
    '$compileProvider',
    function( $compileProvider )
    {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob|data):/);
    }
]);

// Application controller
vidamo.controller('graphCtrl', function($scope,prompt,$rootScope) {

    //temp
    $scope.isCollapsed = false;

    // data structure of procedure list
    $scope.dataList = [];

    // procedure code data structure of procedure list
    $scope.codeList = [];

    // interface data structure of procedure list
    $scope.interfaceList = [];

    // currently selected node ID
    $scope.nodeIndex = '';
    $scope.currentNodeName = '';

    // Selects the next node id.
    var nextNodeID = 0;

    // Setup the data-model for the chart.
    var chartDataModel = {
        nodes: [],
        connections: []
    };

    //
    // save and open json file
    //

    // store json url
    $scope.json = '';

    // procedure json
    $scope.procedureJson = '';

    // check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        console.log('The File APIs are supported in this browser');
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    // open and read json file
    $scope.readJson = function(){

        document.getElementById('upload').click();

        JsonObj = null;

        function handleFileSelect(evt) {
            var files = evt.target.files;
            var f = files[0];

            // todo file type match to json
            var reader = new FileReader();

            reader.onload = (function (theFile) {
                return function (e) {
                    JsonObj = JSON.parse(e.target.result);

                    // update the chart data and view model
                    chartDataModel = JsonObj;
                    $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
                };
            })(f);

            reader.readAsText(f);
        }

        document.getElementById('upload').addEventListener('change', handleFileSelect, false);
    }

    // save json file
    // todo note it is for the graph only for now
    $scope.jsonURL = function(){
        var graphJson = JSON.stringify($scope.chartViewModel.data, null, 4);
        var procedureJson = JSON.stringify($scope.dataList, null, 4);
        var fullJson = graphJson.concat('\n');
        var fullJson = fullJson.concat(procedureJson);

        var blob = new Blob([fullJson], {type: "application/json"});
        var url = URL.createObjectURL(blob);

        $scope.json = url;
    }



    //
    // ------------------------------------- NODE GRAPH -------------------------------------
    //


    // listen to the graph, when a node is clicked, update the visual procedure/ code/ interface accordions
     $scope.$on("nodeIndex", function(event, message) {
         $scope.nodeIndex = message;
         $scope.currentNodeName = $scope.chartViewModel.nodes[$scope.nodeIndex].data.name;
         // update the procedure tab
         $scope.data  = $scope.dataList[$scope.nodeIndex];

         // update the code tab
         $scope.code = $scope.codeList[$scope.nodeIndex];
         $scope.functionCode = $scope.code;

         // update the interface tab
         $scope.interface = $scope.interfaceList[$scope.nodeIndex];
     });


    // Add a new node to the chart.
    $scope.addNewNode = function () {
        // promote for name of new node
        var nodeName = prompt("Enter a node name:", "New node");
        if (!nodeName) {
            return;
        }

        // Template for a new node
        // todo initial location of new node
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
            ],
            outputConnectors: [
            ]
        };

        // when new node added, increase the number of procedure list by one
        $scope.dataList.push([]);

        // when new node added, add new code block
        $scope.codeList.push('');

        // when new node added, increase the number of interface list by one
        $scope.interfaceList.push([]);

        $scope.chartViewModel.addNode(newNodeDataModel);

        // sort nodes topologically and emit the result to procedure part
        // var sortedOrder = $scope.chartViewModel.topoSort().slice();
        // console.log("after sorting: ", sortedOrder);
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
                value:''
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
                value: ""
            });
        }
    };

    // Delete selected nodes and connections in data&view model
    // todo code and interface deletion
    $scope.deleteSelected = function () {
        var deletedNodeIds = $scope.chartViewModel.deleteSelected();

        console.log(deletedNodeIds);

        $scope.dataList.splice(deletedNodeIds[0],1);

        if(deletedNodeIds[0] != ''){
            nextNodeID --;
            console.log($scope.dataList);
        }
    };


    // Create the view-model for the chart and attach to the scope.
    $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);

    //
    // ------------------------------------- PROCEDURE GRAPH -------------------------------------
    //

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
                looping: '',
                parentNode: $scope.chartViewModel.nodes[$scope.nodeIndex]
            });
        }
    };


    //onchange write the input value
    $scope.applyValue = function (cate, value,location){
        switch (cate){
            //
            // ----------- cases for data procedure -----------
            //

            case 'dataName':
                location.dataName = value;
                console.log("dataName:",value);
                break;

            case 'dataValue':
                location.dataValue = value;
                console.log("dataValue:",value);
                break;
            //
            // ----------- cases for action procedure -----------
            //

            case 'method':
                location.method = value;
                break;

            // append output method, parameters: 1. output port, 2. dataValue 3. dataName
            case 'outputPort':
                location.parameters[0] = value;
                break;

            case 'outputDataName':
                console.log(value);
                var split = value.split(",");
                console.log("SPLIT1:",split[0]);
                console.log("SPLIT2:",split[1]);
                location.parameters[1] = split[0];
                location.parameters[2] = split[1];
                break;

            // get input method, parameters: 1. input port name
            case 'inputPort':
                location.parameters[0] = value;
                console.log("input port name:",value);
                break;

            // print data method, parameter: 1. data value 2. data name
            case 'printDataName':
                var split = value.split(",");
                console.log("SPLIT1:",split[0]);
                console.log("SPLIT2:",split[1]);
                //location.parameters[0] = split[0];
                location.parameters[1] = split[1];
                break;

            //
            // ----------- control procedure -----------
            //
            case 'looping':
                location.looping = value;
                break;

            // ----------- add data to interface ------------
            // parameter0: dataValue parameter1: dataName parameter2: node id
            case 'addToInterface':
                var split = value.split(",");
                console.log("SPLIT1:",split[0]);
                console.log("SPLIT2:",split[1]);
                console.log("SPLIT3:",split[2]);
                location.parameters[0] = split[0];
                location.parameters[1] = split[1];
                location.parameters[2] = split[2]-1;
                break;

            // change data in interface and synchronize with procedure
            // todo when change i won't update directly
            case 'interfaceValue':
                location.parameters[0] = value;
                $scope.data[location.parameters[2]].dataValue = location.parameters[0];
                break;
        }
    };

    // interface manipulation

    // add new item in interface
    $scope.newInterface = function(cate) {
        if(cate == 'Data'){
            $scope.interface.push({
                id: $scope.data.length  + 1,
                title:  'Data',
                dataName:'',
                parameters:[],
                dataValue:'',
                parentNode: $scope.chartViewModel.nodes[$scope.nodeIndex]
            });
        }
    };

    //
    // ------------------------------------- RUN-TIME EXECUTIONS -------------------------------------
    //

    // ------------------------------------- ACTUAL RUN-TIME EXECUTIONS ------------------------------

    // execute the topological sort, then call procedure functions in sorted order
    $scope.run = function(){
        // declare start running in console
        // todo future throw errors/ warning in console
        $scope.consoleMsg = [];
        $scope.consoleMsg.push('   Start Running:');

        // copy the sorted order
        var sortedOrder = $scope.chartViewModel.topoSort().slice();

        // execute procedures should follows the topological sort order
        // iterate through all nodes and their procedures to find methods and execute it
        for(var i = 0; i < sortedOrder.length; i++) {

            var currentNode = $scope.dataList[sortedOrder[i]];

            for (var j = 0; j < currentNode.length; j++) {

                // find control procedure
                if(currentNode[j].title == 'Control'){
                    runControl(currentNode[j]);
                }

                // find action procedures
                else if (currentNode[j].title == 'Action') {

                    // get input method
                    if (currentNode[j].method == 'get input') {
                        runGetInput(currentNode[j]);
                    }

                    // append output method
                    else if (currentNode[j].method == 'append output') {
                        runAppendOutput(currentNode[j], currentNode);
                    }
                    // testing print method
                    else if(currentNode[j].method == 'print data'){
                        runPrintData(currentNode[j]);
                    }

                }
            }
        }

        //
        // ------------------------------------- SUPPORTING RUN-TIME FUNCTIONS -------------------------------------
        //

        function runGetInput(procedure){
            for (var n = 0; n < procedure.parentNode.data.inputConnectors.length; n++) {
                if (procedure.parentNode.data.inputConnectors[n].name
                    == procedure.parameters[0]) {
                    procedure.dataValue = procedure.parentNode.data.inputConnectors[n].value;
                    console.log("get input:", procedure.dataName, " ", procedure.dataValue);
                }
            }
        }

        function runAppendOutput(procedure, procedureSet){
            // search the output connector in this node that match the selected name
            // and replace the value of the output
            for (var m = 0; m < procedure.parentNode.data.outputConnectors.length; m++) {
                if (procedure.parentNode.data.outputConnectors[m].name
                    == procedure.parameters[0]) {
                    // update the output port data value
                    for (var n = 0; n < procedureSet.length; n++) {
                        if (procedureSet[n].dataName == procedure.parameters[2]) {
                            procedure.parentNode.data.outputConnectors[m].value = procedureSet[n].dataValue;

                            console.log(procedure.parentNode.data.outputConnectors[m].name,
                                procedure.parentNode.data.outputConnectors[m].value);
                        }
                    }

                    // if this outport is connected: update the connection value
                    // todo use id instead of name
                    for (var k = 0; k < $scope.chartViewModel.connections.length; k++) {
                        if (procedure.parentNode.data.outputConnectors[m].name
                            == $scope.chartViewModel.connections[k].source.name()) {
                            $scope.chartViewModel.connections[k].dest.data.value
                                = procedure.parentNode.data.outputConnectors[m].value;
                            $scope.chartViewModel.connections[k].data.value
                                = procedure.parentNode.data.outputConnectors[m].value;
                        }
                    }
                }
            }
        }

        // supporting function for control procedure
        function runControl(procedure){
            for(var n = 0; n < procedure.looping; n++ ){
                for(var m = 0; m < procedure.nodes.length; m ++){
                    if(procedure.nodes[m].title =='Action'){
                        if(procedure.nodes[m].method =='print data'){
                            runPrintData(procedure.nodes[m]);
                        }
                    }
                }
            }
        }

        function runPrintData(procedure){
            for (var n = 0; n < $scope.dataList[procedure.parentNode.data.id].length; n++) {
                if ($scope.dataList[procedure.parentNode.data.id][n].dataName
                    == procedure.parameters[1]) {
                    procedure.parameters[0] = $scope.dataList[procedure.parentNode.data.id][n].dataValue;
                }
            }
            $scope.consoleMsg.push(procedure.parameters[0]);
        }

        // ------------------------------------- CODE GENERATIONS-------------------------------------

        //
        // dummy code generation PART I
        //

        // functions based on procedures
        // print out the list of function definitions
        $scope.javascriptCode ='//Function definitions:' + '\n';

        // use flag to check whether it is the first argument
        var flag= false;

        for(var i = 0; i < $scope.dataList.length; i++){

            $scope.javascriptCode = $scope.javascriptCode + 'function node' + i +' (';

            $scope.codeList[i]= '// Function definition' + '\n';
            $scope.codeList[i] = $scope.codeList[i]+ 'function node' + i +' (';


            // print out values of inputs (parameters)
            // check the input is empty by checking its value entity
            for(var n =0; n < $scope.chartViewModel.nodes[i].inputConnectors.length; n++){
                if($scope.chartViewModel.nodes[i].inputConnectors[n].data.value != ""){
                    if(flag == false){
                        $scope.javascriptCode = $scope.javascriptCode  + "input" + n;
                        $scope.codeList[i] = $scope.codeList[i] + "input" + n
                        flag =true;
                    }else{
                        $scope.javascriptCode = $scope.javascriptCode  + ", input" + n;
                        $scope.codeList[i] = $scope.codeList[i]  + ", input" + n;
                    }
                }
            }
            flag = false;
            $scope.javascriptCode = $scope.javascriptCode  + "){" + "\n";
            $scope.codeList[i] = $scope.codeList[i] + "){" + "\n";

            // print out content of procedures
            // data procedure
            // print out code for single variable
            for(var j = 0; j < $scope.dataList[i].length; j++){
                if($scope.dataList[i][j].title == "Data"){
                    $scope.javascriptCode = $scope.javascriptCode  + "    " + "var "
                                                + $scope.dataList[i][j].dataName
                                                + " = "
                                                + $scope.dataList[i][j].dataValue + ";\n";

                    $scope.codeList[i] = $scope.codeList[i]+ "    " + "var "
                                                + $scope.dataList[i][j].dataName
                                                + " = "
                                                + $scope.dataList[i][j].dataValue + ";\n";
                }
            }

            // todo print out code for print data method
            // todo print out code for control method

            // get inpput procedure
            for(var j = 0; j < $scope.dataList[i].length; j++){
                if($scope.dataList[i][j].title == "Action"){
                    if($scope.dataList[i][j].method == "get input"){
                        $scope.javascriptCode = $scope.javascriptCode  + "    " + "var "
                                                 + $scope.dataList[i][j].dataName + " = getInput("
                                                 + $scope.dataList[i][j].parameters[0] + ");\n"

                        $scope.codeList[i] = $scope.codeList[i]  + "    " + "var "
                        + $scope.dataList[i][j].dataName + " = getInput("
                        + $scope.dataList[i][j].parameters[0] + ");\n"
                    }
                }
            }

            // append output procedure
            for(var j = 0; j < $scope.dataList[i].length; j++){
                if($scope.dataList[i][j].title == "Action"){
                    if($scope.dataList[i][j].method == "append output"){
                        $scope.javascriptCode = $scope.javascriptCode  + "    " + "appendOutput("
                                                        + $scope.dataList[i][j].parameters[0] + ", "
                                                        + $scope.dataList[i][j].parameters[2] + ");\n"

                        $scope.codeList[i] = $scope.codeList[i]  + "    " + "appendOutput("
                        + $scope.dataList[i][j].parameters[0] + ", "
                        + $scope.dataList[i][j].parameters[2] + ");\n"
                    }
                }
            }

            // print output procedure

            // print return value
            // check the output port is empty by checking its value entity
            if($scope.chartViewModel.nodes[i].outputConnectors.length != 0) {
                $scope.javascriptCode = $scope.javascriptCode + "    " + "return ";

                $scope.codeList[i]= $scope.codeList[i] + "    " + "return ";
            }
            for(var n =0; n < $scope.chartViewModel.nodes[i].outputConnectors.length; n++){
                if($scope.chartViewModel.nodes[i].outputConnectors[n].data.value != ""){
                    if(n !=  $scope.chartViewModel.nodes[i].outputConnectors.length-1){
                        $scope.javascriptCode = $scope.javascriptCode
                            + $scope.chartViewModel.nodes[i].outputConnectors[n].data.name + ", ";

                        $scope.codeList[i]= $scope.codeList[i]
                        + $scope.chartViewModel.nodes[i].outputConnectors[n].data.name + ", ";

                    }else{
                        $scope.javascriptCode = $scope.javascriptCode
                            + $scope.chartViewModel.nodes[i].outputConnectors[n].data.name + ";\n";

                        $scope.codeList[i] = $scope.codeList[i]
                        + $scope.chartViewModel.nodes[i].outputConnectors[n].data.name + ";\n";
                    }
                }else{console.log($scope.chartViewModel.nodes[i].outputConnectors[n])}
            }
            $scope.javascriptCode = $scope.javascriptCode  + "}\n\n";
            $scope.codeList[i]= $scope.codeList[i]  + "}\n\n";
        }

        //
        // dummy code generation PART II
        //

        // execution orders based on topological sort

        $scope.javascriptCode = $scope.javascriptCode + "// execution \n";

        flag = false;

        for(var n = 0; n < sortedOrder.length; n++) {

            // case where the node has output
            if ($scope.chartViewModel.nodes[sortedOrder[n]].outputConnectors.length != 0) {
                $scope.javascriptCode = $scope.javascriptCode + "var result" + n + " = ";
            }

            // case where the node has no output
            $scope.javascriptCode = $scope.javascriptCode + "node" + sortedOrder[n] + "(";

            // print all the parameters/inputs
            flag = false;

            for (var m = 0; m < $scope.chartViewModel.nodes[sortedOrder[n]].inputConnectors.length; m++) {
                for (var k = 0; k < $scope.chartViewModel.connections.length; k++) {
                    // todo check id instead of name
                    // todo when one node return multiple outputs, should be an array
                    if ($scope.chartViewModel.connections[k].dest.data.name
                        == $scope.chartViewModel.nodes[sortedOrder[n]].inputConnectors[m].data.name) {

                        var inputIndex
                            = sortedOrder
                            .indexOf(($scope.chartViewModel.connections[k].source.parentNode().data.id))

                        if (flag == false) {
                            $scope.javascriptCode = $scope.javascriptCode + "result" + inputIndex;
                            flag = true;
                        } else {
                            $scope.javascriptCode = $scope.javascriptCode + ", result" + inputIndex;
                        }
                    }
                }
            }

            $scope.javascriptCode = $scope.javascriptCode + ");\n"
            flag = false;
        }

        $scope.consoleMsg.push('Running Finished.');
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


////////////////////////////////////////////////////////////////////////////////////////
// todo temporary directive, pls refactor
// simple directive to display the json for procedures
//vidamo.directive('procedureJson', function () {
//    return {
//        link: function(scope, elem, attrs) {
//
//            scope.$watch('dataList', function() {
//                var json = JSON.stringify(scope.dataList, null, 4);
//                scope.procedureJson = json;
//                $(elem).val(scope.procedureJson);
//            }, true);
//
//}}})