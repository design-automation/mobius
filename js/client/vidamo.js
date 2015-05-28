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
vidamo.controller('graphCtrl', function($scope,prompt) {

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


    // store json url

    $scope.graphUrl = '';
    $scope.procedureUrl = '';
    $scope.jsUrl = '';

    // procedure json

    $scope.procedureJson = '';

    // check for the various File API support.

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        console.log('The File APIs are supported in this browser');
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }


    // open and read json file for graph
    // todo json file content validation
    // todo warning: import without procedure is incomplete
    // todo asychronization error need to fix

    $scope.importGraphJson = function(){
        document.getElementById('importGraphJson').click();

        graphJsonObj = null;

        function handleFileSelect(evt) {
            var files = evt.target.files;
            var f = files[0];

            // todo file type match to json
            var reader = new FileReader();

            reader.onload = (function (theFile) {
                return function (e) {
                    graphJsonObj = JSON.parse(e.target.result);

                    console.log('reader onloading');

                    // update the chart data and view model

                    chartDataModel = graphJsonObj;
                    $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
                };
            })(f);

            reader.readAsText(f);
        }

        document.getElementById('importGraphJson').addEventListener('change', handleFileSelect, false);
    }


    // open and read json file for procedure
    // todo json file content validation
    // todo regenerate graph from procedure json import?
    // todo synchronization error need to fix

    $scope.importProcedureJson = function(){

        document.getElementById('importProcedureJson').click();

        procedureJsonObj = null;

        function handleFileSelect(evt) {
            var files = evt.target.files;
            var f = files[0];

            // todo file type match to json
            var reader = new FileReader();

            reader.onload = (function (theFile) {
                return function (e) {
                    procedureJsonObj = JSON.parse(e.target.result);

                    // update the procedure dataList
                    $scope.dataList = procedureJsonObj;
                };
            })(f);

            reader.readAsText(f);
        }

        document.getElementById('importProcedureJson').addEventListener('change', handleFileSelect, false);

        console.log($scope.dataList)
    }

    $scope.updateProcedure = function(){

    }

    // save json file for graph

    $scope.exportGraphJson = function(){
        var graphJson = JSON.stringify($scope.chartViewModel.data, null, 4);

        var graphBlob = new Blob([graphJson], {type: "application/json"});

        $scope.graphUrl = URL.createObjectURL(graphBlob);
    }

    // save json file for procedure

    $scope.exportProcedureJson = function(){

        var procedureJson = JSON.stringify($scope.dataList, null, 4);

        //var fullJson = graphJson.concat('\n');
        //var fullJson = fullJson.concat(procedureJson);

        var procedureBlob = new Blob([procedureJson], {type: "application/json"});

        $scope.procedureUrl = URL.createObjectURL(procedureBlob);
    }

    // save js file
    $scope.downloadJs = function(){

        var jsBlob = new Blob([$scope.javascriptCode], {type: "application/javascript"});

        $scope.jsUrl = URL.createObjectURL(jsBlob);
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
                parentNode: $scope.chartViewModel.nodes[$scope.nodeIndex].data
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
                parentNode: $scope.chartViewModel.nodes[$scope.nodeIndex].data

            });
        } else if(cate == 'Control'){
            $scope.data.push({
                id: $scope.data.length  + 1,
                title:  'Control',
                nodes: [],
                looping: '',
                parentNode: $scope.chartViewModel.nodes[$scope.nodeIndex].data
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

                var split = value.split(",");
                console.log("SPLIT1:",split[0]);
                console.log("SPLIT2:",split[1]);
                location.parameters[1] = split[0];
                location.parameters[2] = split[1];
                break;

            // get input method, parameters: 1. input port index

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
                parentNode: $scope.chartViewModel.nodes[$scope.nodeIndex].data
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
        // todo here get-data and append-data should be implemented here
        // todo other methods/ controls /data should be run as a javascript file/code block

        for(var i = 0; i < sortedOrder.length; i++) {

            var currentNode = $scope.dataList[sortedOrder[i]];

            for (var j = 0; j < currentNode.length; j++) {

                // find control procedure
                // todo it should not be here
                //if(currentNode[j].title == 'Control'){
                //    runControl(currentNode[j]);
                //}


                // find action procedures
                if (currentNode[j].title == 'Action') {

                    // get input method

                    if (currentNode[j].method == 'get input') {
                        runGetInput(currentNode[j]);
                    }

                    // append output method

                    else if (currentNode[j].method == 'append output') {
                        runAppendOutput(currentNode[j], currentNode);
                    }

                    // testing print method
                    // todo it should not be here

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
            for (var n = 0; n < procedure.parentNode.inputConnectors.length; n++) {
                if (procedure.parentNode.inputConnectors[n].name
                    == procedure.parameters[0]) {
                    procedure.dataValue = procedure.parentNode.inputConnectors[n].value;
                    console.log("get input:", procedure.dataName, " ", procedure.dataValue);
                }
            }
        }

        function runAppendOutput(procedure, procedureSet){

            // search the output connector in this node that match the selected name
            // and replace the value of the output

            for (var m = 0; m < procedure.parentNode.outputConnectors.length; m++) {
                if (procedure.parentNode.outputConnectors[m].name
                    == procedure.parameters[0]) {

                    // update the output port data value

                    for (var n = 0; n < procedureSet.length; n++) {
                        if (procedureSet[n].dataName == procedure.parameters[2]) {
                            procedure.parentNode.outputConnectors[m].value = procedureSet[n].dataValue;

                            console.log(procedure.parentNode.outputConnectors[m].name,
                                procedure.parentNode.outputConnectors[m].value);
                        }
                    }

                    // if this outport is connected: update the connection value

                    // todo use id instead of name
                    for (var k = 0; k < $scope.chartViewModel.connections.length; k++) {
                        if (procedure.parentNode.outputConnectors[m].name
                            == $scope.chartViewModel.connections[k].source.name()) {
                            $scope.chartViewModel.connections[k].dest.data.value
                                = procedure.parentNode.outputConnectors[m].value;
                            $scope.chartViewModel.connections[k].data.value
                                = procedure.parentNode.outputConnectors[m].value;
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
            for (var n = 0; n < $scope.dataList[procedure.parentNode.id].length; n++) {
                if ($scope.dataList[procedure.parentNode.id][n].dataName
                    == procedure.parameters[1]) {
                    procedure.parameters[0] = $scope.dataList[procedure.parentNode.id][n].dataValue;
                }
            }
            $scope.consoleMsg.push(procedure.parameters[0]);

        }

        //
        // ------------------------------------- CODE GENERATIONS-------------------------------------
        //

        //
        // function definitions
        //

        $scope.javascriptCode ='//Function definitions:' + '\n';

        // use flag to check whether it is the first argument

        for(var i = 0; i < $scope.dataList.length; i++){

            // function name

            $scope.javascriptCode = $scope.javascriptCode + 'function ' + $scope.chartViewModel.nodes[i].data.name +' (';

            // function arguments

            var num_input_ports = $scope.chartViewModel.nodes[i].inputConnectors.length;

            if($scope.chartViewModel.nodes[i].inputConnectors.length){

                for(var k = 0; k < num_input_ports; k++){

                    if( k != num_input_ports-1){
                        $scope.javascriptCode = $scope.javascriptCode
                        + $scope.chartViewModel.nodes[i].inputConnectors[k].data.name
                        + ',';
                    }
                    else{
                        $scope.javascriptCode = $scope.javascriptCode
                        + $scope.chartViewModel.nodes[i].inputConnectors[k].data.name;
                    }
                }

                $scope.javascriptCode = $scope.javascriptCode + '){\n'

            }else{

                $scope.javascriptCode = $scope.javascriptCode  + '){\n';
            }


            // define return items according to output port

            var num_output_ports = $scope.chartViewModel.nodes[i].outputConnectors.length;

            if(num_output_ports){

                for(var k = 0; k < num_output_ports; k++){

                    $scope.javascriptCode = $scope.javascriptCode
                                                + '    var '
                                                + $scope.chartViewModel.nodes[i].outputConnectors[k].data.name
                                                + ';\n'
                }

                $scope.javascriptCode = $scope.javascriptCode + '\n'

            }


            for(var j = 0; j < $scope.dataList[i].length; j++){

                // data procedure

                if($scope.dataList[i][j].title == "Data"){
                    $scope.javascriptCode = $scope.javascriptCode  + "    " + "var "
                    + $scope.dataList[i][j].dataName
                    + " = '"
                    + $scope.dataList[i][j].dataValue + "';\n";
                }


                // action procedure

                if($scope.dataList[i][j].title == 'Action'){

                    // action: get data from input port

                    if($scope.dataList[i][j].method == 'get input'){

                        $scope.javascriptCode = $scope.javascriptCode  + '    ' + 'var '
                                                + $scope.dataList[i][j].dataName
                                                + $scope.dataList[i][j].parameters[0] + ';\n'
                    }

                    // action: print data

                    if($scope.dataList[i][j].method == 'print data'){
                        $scope.javascriptCode = $scope.javascriptCode + '    ' + 'VIDAMO.pirnt_data('
                                                + $scope.dataList[i][j].parameters[1] + ');\n'

                    }

                    // action: append data to output port

                    if($scope.dataList[i][j].method == 'append output'){

                        $scope.javascriptCode = $scope.javascriptCode  + '    '
                                                + $scope.dataList[i][j].parameters[0]
                                                + ' = '
                                                + $scope.dataList[i][j].parameters[2] + ';\n';

                    }

                }
            }


            // return value


            if(num_output_ports){

                $scope.javascriptCode = $scope.javascriptCode
                                         + '\n    return {\n'

                for(var k = 0; k < num_output_ports; k++){

                    $scope.javascriptCode = $scope.javascriptCode

                        + '        ' + $scope.chartViewModel.nodes[i].outputConnectors[k].data.name
                        + ':'
                        + $scope.chartViewModel.nodes[i].outputConnectors[k].data.name
                        + ',\n'

                }

                $scope.javascriptCode = $scope.javascriptCode + '    };\n' + '}\n\n'

            }
            else{

                $scope.javascriptCode = $scope.javascriptCode + '\n}\n\n';

            }


        }

        //
        // execution based topological sort
        //

        $scope.javascriptCode = $scope.javascriptCode + '// execution \n';

        for(var n = 0; n < sortedOrder.length; n++) {

            // case where the node has output
            var output_port_num = $scope.chartViewModel.nodes[sortedOrder[n]].outputConnectors.length;
            var return_obj_name = 'ouput_' + $scope.chartViewModel.nodes[sortedOrder[n]].data.name;

            if (output_port_num != 0) {

                // first get the return object

                $scope.javascriptCode = $scope.javascriptCode + 'var ' + return_obj_name + ' = ';

            }

            // case where the node has no output
            $scope.javascriptCode = $scope.javascriptCode
                                            + $scope.chartViewModel.nodes[sortedOrder[n]].data.name + "(";

            // print all the parameters/inputs

            var input_port_num = $scope.chartViewModel.nodes[sortedOrder[n]].inputConnectors.length;

            for (var m = 0; m < input_port_num; m++) {

                var input_port_name = $scope.chartViewModel.nodes[sortedOrder[n]].inputConnectors[m].data.name;
                if(m != input_port_num-1){
                    $scope.javascriptCode = $scope.javascriptCode  + input_port_name + ',';
                }
                else{
                    $scope.javascriptCode = $scope.javascriptCode  + input_port_name;
                }

            }

            $scope.javascriptCode = $scope.javascriptCode + ");\n"

            // extract items from return through label
            for(var m =0; m < output_port_num; m++){

                var output_port_name = $scope.chartViewModel.nodes[sortedOrder[n]].outputConnectors[m].data.name;

                for (var l = 0; l < $scope.chartViewModel.connections.length; l++) {

                    if (output_port_name == $scope.chartViewModel.connections[l].source.name()) {

                        var connected_input_name = $scope.chartViewModel.connections[l].dest.data.name;

                        $scope.javascriptCode = $scope.javascriptCode + 'var '
                        + connected_input_name +' = '
                        + return_obj_name
                        + '.'
                        + output_port_name + ';\n';
                    }
                }
            }
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