//
// data model service for application data synchronization among controllers
// code generation module
//

// todo restructure chartDataModel and chartViewModel
// todo restructure core data and other code lists


mobius.factory('generateCode', ['$rootScope',function ($rootScope) {

    var outputGeom = [];

    // track of subgraphs
    var graphList = [];

    var data = {
        javascriptCode: '// To generate code,\n' + '// create nodes & procedures and run!\n',
        geomListCode: "var geomList = [];\n",
        innerCodeList:[],
        outerCodeList:[],
        dataList:[],
        interfaceList:[],
        chartViewModel: new flowchart.ChartViewModel({
            nodes: [],
            connections: []
            // todo input/output ports goes here
        }),
        nodeIndex:undefined
    };

    var current = {
        javascriptCode:data.javascriptCode,
        geomListCode: data.geomListCode,
        innerCodeList:data.innerCodeList,
        outerCodeList:data.outerCodeList,
        chartViewModel: data.chartViewModel,
        dataList: data.dataList,
        interfaceList: data.interfaceList,
        nodeIndex:undefined
    };


    // todo refactor nodeindexing direct $watch from graph controller and procedure controller
    $rootScope.$on("nodeIndex", function(event, message) {
        current.nodeIndex = message;
    });

    function generateCode (subgraph){
        var model = {};

        if(subgraph){
            model = subgraph;
            model.chartViewModel = new flowchart.ChartViewModel(model.chartDataModel);
        }else{
            model = data;
        }

        var sortedOrder = model.chartViewModel.topoSort().slice();

        generate_execution_code();
        generate_outer_function_code();
        generate_inner_function_code();

        // todo fix inner/outer datalist for subgraph update
        for(var i = 0; i < model.dataList.length; i++){
            model.javascriptCode += model.outerCodeList[i];
        }

        for(var i = 0; i < model.dataList.length; i++){
            model.javascriptCode += model.innerCodeList[i];
        }

        // execution based topological sort
        function generate_execution_code(){
            model.javascriptCode = '// execution: \n';
            model.geomListCode = "var geomList = [];\n";
            for(var n = 0; n < sortedOrder.length; n++) {
                // first check if the node is disabled
                if((model.chartViewModel.nodes[sortedOrder[n]].disabled() === false) ||
                    !model.chartViewModel.nodes[sortedOrder[n]].disabled()){
                    // case where the node has output
                    var output_port_num = model.chartViewModel.nodes[sortedOrder[n]].outputConnectors.length;
                    var node_name = model.chartViewModel.nodes[sortedOrder[n]].data.name;
                    var return_obj_name = 'output_' + model.chartViewModel.nodes[sortedOrder[n]].data.name;

                    if (output_port_num != 0) {
                        // first get the return object
                        model.javascriptCode += 'var ' + return_obj_name + ' = ';
                        model.geomListCode += 'geomList.push({'
                            + 'name:'
                            + node_name +'.name,'
                            + 'value:'
                            + return_obj_name + ','
                            + 'geom:[],'
                            + 'geomData:[],'
                            + 'topo:[]'
                            +'});'
                    }

                    // case where the node has no output
                    model.javascriptCode += model.chartViewModel.nodes[sortedOrder[n]].data.name + "(";

                    // print all the parameters/inputs

                    var input_port_num = model.chartViewModel.nodes[sortedOrder[n]].inputConnectors.length;

                    for (var m = 0; m < input_port_num; m++) {

                        var input_port_name = model.chartViewModel.nodes[sortedOrder[n]].inputConnectors[m].data.name;

                        if(model.chartViewModel.nodes[sortedOrder[n]].inputConnectors[m].data.connected === true){
                            if(m != input_port_num-1){
                                model.javascriptCode += input_port_name + ',';
                            }
                            else{
                                model.javascriptCode += input_port_name;
                            }
                        }
                    }

                    if( model.javascriptCode.slice(-1) === ','){
                        model.javascriptCode = model.javascriptCode.substring(0, model.javascriptCode.length - 1);
                    }

                    model.javascriptCode +=  ");\n";

                    // extract items from return through label
                    // fixme name duplication or undefined name
                    for(var m =0; m < output_port_num; m++){

                        var output_port_node_id = model.chartViewModel.nodes[sortedOrder[n]].data.id;
                        var output_port_name = model.chartViewModel.nodes[sortedOrder[n]].outputConnectors[m].data.name;

                        for (var l = 0; l < model.chartViewModel.connections.length; l++) {

                            if (output_port_name === model.chartViewModel.connections[l].source.name()
                                && output_port_node_id === model.chartViewModel.connections[l].data.source.nodeID) {
                                var connected_input_name = model.chartViewModel.connections[l].dest.data.name;

                                var destNodeId =  model.chartViewModel.connections[l].data.dest.nodeID;
                                // if connection dest node is not disabled
                                if((model.chartViewModel.nodes[destNodeId].disabled() === false) ||
                                    model.chartViewModel.nodes[destNodeId].disabled() === undefined){
                                    model.javascriptCode +=  'var '
                                        + connected_input_name +' = MOBIUS.obj.copy('
                                        + return_obj_name
                                        + '.'
                                        + output_port_name + ');\n';
                                }
                            }
                        }
                    }
                    model.javascriptCode +=  "\n";
                }
                model.javascriptCode += '\n';
            }
        }

        // outer function code with parameters-definition and invoking of procedure function
        function generate_outer_function_code(){

            for(var i = 0; i < model.dataList.length; i++){
                // function name
                model.outerCodeList[i]='// This is definition for function '
                    + model.chartViewModel.nodes[i].data.name + '\n';

                model.outerCodeList[i] += 'function ' + model.chartViewModel.nodes[i].data.name +' (';

                // function inputs

                var num_input_ports = model.chartViewModel.nodes[i].inputConnectors.length;

                if(num_input_ports){
                    for(var k = 0; k < num_input_ports; k++){

                        if(model.chartViewModel.nodes[i].inputConnectors[k].data.connected === true){
                            if( k != num_input_ports-1){
                                model.outerCodeList[i] += model.chartViewModel.nodes[i].inputConnectors[k].data.name + ',';
                            }
                            else{
                                model.outerCodeList[i] += model.chartViewModel.nodes[i].inputConnectors[k].data.name;
                            }
                        }
                    }

                    if(model.outerCodeList[i].slice(-1) === ','){
                        model.outerCodeList[i] =  model.outerCodeList[i].substring(0, model.outerCodeList[i].length - 1);
                    }

                    model.outerCodeList[i] += '){\n'

                }else{
                    model.outerCodeList[i] +=  '){\n';
                }

                // parameters code
                // todo assign or create new variable
                for(var j = 0; j < model.interfaceList[i].length;j++){

                    if(model.interfaceList[i][j].connected === false){
                        // creating new parameters
                        var codeBlock = "    " + "var "
                            + model.interfaceList[i][j].name
                            + " = ";
                        if(model.interfaceList[i][j].option.name === 'color picker'){
                            var color = "'" + model.interfaceList[i][j].color + "' ;\n" ;
                            codeBlock += color.replace('#','0x').replace("'",'').replace("'",'')
                        }
                        else{
                            codeBlock += model.interfaceList[i][j].dataValue + ";\n";
                        }

                        model.outerCodeList[i] += codeBlock;
                    }

                }

                // code for invoking inner function
                var identifier = '_' + model.chartViewModel.nodes[i].data.version;
                if(model.chartViewModel.nodes[i].data.version === 0){
                    identifier = '';
                }

                model.outerCodeList[i] += '    return ' + model.chartViewModel.nodes[i].data.type + identifier + '(';

                for(var j = 0; j < model.interfaceList[i].length; j++){
                    model.outerCodeList[i] += model.interfaceList[i][j].name;
                    if(j !=  model.interfaceList[i].length-1){
                        model.outerCodeList[i] += ', '
                    }
                }

                model.outerCodeList[i] +=   ');' + '\n}\n\n';
            }
        }

        // inner function code generation and procedure content code
        function generate_inner_function_code(){
            // inner(type) function definition: linking with parameters
            for(var i = 0; i < model.dataList.length; i++) {

                model.innerCodeList[i] = '// This is definition for type '
                    + model.chartViewModel.nodes[i].data.type + '\n'
                    + '// version: ' + model.chartViewModel.nodes[i].data.version + '\n';

                var identifier = '_' + model.chartViewModel.nodes[i].data.version;
                if(model.chartViewModel.nodes[i].data.version === 0){
                    identifier = '';
                }

                model.innerCodeList[i] += 'function ' + model.chartViewModel.nodes[i].data.type + identifier + '( ';

                for (var j = 0; j < model.interfaceList[i].length; j++) {
                    model.innerCodeList[i] += model.interfaceList[i][j].name;
                    if (j != model.interfaceList[i].length - 1) {
                        model.innerCodeList[i] += ', '
                    }
                }

                model.innerCodeList[i] += ' ){\n';
                model.innerCodeList[i] += '    var FUNC_OUTPUT = ';
                model.innerCodeList[i] += model.chartViewModel.nodes[i].data.type + identifier + ';\n';

                // define return items according to output port
                var num_output_ports = model.chartViewModel.nodes[i].outputConnectors.length;

                // inner function content
                for (var j = 0; j < model.dataList[i].length; j++) {

                    // data procedure

                    if(model.dataList[i][j].title === 'Output'){
                        procedure_output(model.dataList[i][j], i, false);
                    }

                    if (model.dataList[i][j].title == "Data") {
                        procedure_data(model.dataList[i][j], i, false);
                    }

                    // action procedure

                    if (model.dataList[i][j].title == 'Action') {
                        procedure_action(model.dataList[i][j], i, false);
                    }

                    // control procedure

                    if (model.dataList[i][j].title == 'Control') {
                        procedure_control(model.dataList[i][j], i, false);
                    }
                }


                // generate code for subgraph and append to inner function code
                if(model.chartViewModel.nodes[i].data.subGraph){
                    model.innerCodeList[i] += generateCode(model.chartViewModel.nodes[i].data.subGraphModel);
                }

                // return value
                if(num_output_ports){
                    model.innerCodeList[i] = model.innerCodeList[i] + '\n    return {\n';

                    for(var k = 0; k < num_output_ports; k++){
                        model.innerCodeList[i] +=
                            '        ' + model.chartViewModel.nodes[i].outputConnectors[k].data.name
                            + ':'
                            + model.chartViewModel.nodes[i].outputConnectors[k].data.name
                            + ',\n'
                    }
                    model.innerCodeList[i] += '    };\n' + '}\n\n'
                }else{
                    model.innerCodeList[i] += '}\n\n';
                }
            }
        }

        // data procedure
        function procedure_data(procedure,nodeIndex,fromLoop){

            if(procedure.disabled === true){
                return;
            }
            if(fromLoop){
                var intentation = '    ';
            }else{
                var intentation = '';
            }

            var codeBlock = '';

            if(procedure.title == "Data"){
                if(procedure.type === 'assign'){
                    // assign value to variable instead of creating new variable
                    codeBlock = intentation + "    "
                        + procedure.dataName
                        + " = "
                        + procedure.dataValue + ";\n";

                    model.innerCodeList[nodeIndex] += codeBlock;
                }else{
                    // creating new variable
                    codeBlock = intentation + "    " + "var "
                        + procedure.dataName
                        + " = "
                        + procedure.dataValue + ";\n";

                    model.innerCodeList[nodeIndex] += codeBlock;
                }
            }
        }

        // output procedure
        function procedure_output(procedure,nodeIndex,fromLoop){

            if(procedure.disabled === true){
                return;
            }

            if(fromLoop){
                var intentation = '    ';
            }else{
                var intentation = '';
            }

            var codeBlock = '';

            if(procedure.title == "Output"){
                codeBlock = intentation + "    " + "var "
                    + procedure.name
                    + " = "
                    + procedure.dataValue + ";\n";

                model.innerCodeList[nodeIndex] += codeBlock;
            }
        }

        // action procedure
        function procedure_action(procedure,nodeIndex,fromLoop){
            if(procedure.disabled === true){
                return;
            }

            // todo this is only a dummy intentation
            if(fromLoop){
                var intentation = '    ';
            }else{
                var intentation = '';
            }

            var codeBlock = '';
            if(procedure.method !== 'print' &&
                procedure.method !== 'expression' &&
                procedure.return !== false){
                codeBlock += intentation  + '    '  + 'var ' + procedure.result + ' = ';
            }else{
                codeBlock += intentation  + '    ';
            }

            if(procedure.method !== 'expression'){

                codeBlock +=  'MOBIUS.' + procedure.category + '.' +procedure.method + '(';

                for(var j = 0; j< procedure.parameters.length; j++){
                    if(j != procedure.parameters.length - 1 ){
                        codeBlock +=  procedure.parameters[j].value + ', ';
                    }else{
                        codeBlock += procedure.parameters[j].value;
                    }
                }

                codeBlock += ');\n';
            }else if(procedure.method === 'expression'){
                if(procedure.expression !== undefined && procedure.expression !== ''){
                    codeBlock += procedure.expression + ';';
                }
            }


            model.innerCodeList[nodeIndex] += codeBlock;
        }

        // control procedure
        function procedure_control(procedure,nodeIndex,fromLoop){
            if(procedure.disabled === true){
                return;
            }

            var intentation;
            if(fromLoop){
                intentation = '    ';
            }else{
                intentation = '';
            }

            if(procedure.controlType === 'for each'){
                model.innerCodeList[nodeIndex] +=  intentation + '    ' + 'for( var ' +
                    procedure.dataName + ' of '
                    + procedure.forList + '){\n';

                if(procedure.nodes.length > 0){
                    for(var m = 0; m < procedure.nodes.length; m++){
                        if(procedure.nodes[m].title == 'Action'){procedure_action(procedure.nodes[m],nodeIndex,true)}
                        if(procedure.nodes[m].title == 'Data'){procedure_data(procedure.nodes[m],nodeIndex,true)}
                        if(procedure.nodes[m].title == 'Control'){procedure_control(procedure.nodes[m],nodeIndex,true)}
                    }
                }

                model.innerCodeList[nodeIndex] += intentation + '    }\n';
            }

            else if (procedure.controlType === 'if else'){
                model.innerCodeList[nodeIndex] +=  intentation + '    ' + 'if( ' +
                    procedure.nodes[0].ifExpression + ' ){\n';


                if(procedure.nodes[0].nodes.length > 0){
                    for(var i = 0; i < procedure.nodes[0].nodes.length; i++){
                        if(procedure.nodes[0].nodes[i].title == 'Action'){procedure_action(procedure.nodes[0].nodes[i],nodeIndex,true)}
                        if(procedure.nodes[0].nodes[i].title == 'Data'){procedure_data(procedure.nodes[0].nodes[i],nodeIndex,true)}
                        if(procedure.nodes[0].nodes[i].title == 'Control'){procedure_control(procedure.nodes[0].nodes[i],nodeIndex,true)}
                    }
                }

                model.innerCodeList[nodeIndex] += intentation + '    }else{\n';

                if(procedure.nodes[1].nodes.length > 0){
                    for(var m = 0; m < procedure.nodes[1].nodes.length; m++){
                        if(procedure.nodes[1].nodes[m].title == 'Action'){procedure_action(procedure.nodes[1].nodes[m],nodeIndex,true)}
                        if(procedure.nodes[1].nodes[m].title == 'Data'){procedure_data(procedure.nodes[1].nodes[m],nodeIndex,true)}
                        if(procedure.nodes[1].nodes[m].title == 'Control'){procedure_control(procedure.nodes[1].nodes[m],nodeIndex,true)}
                    }
                }

                model.innerCodeList[nodeIndex] += intentation + '    }\n';
            }
        }

        return model.javascriptCode;
    }

    return {

        getGraphList:function(){
            return graphList;
        },

        goRoot:function(){
            current = data;

            graphList.length = 0;
        },

        openNewChart:function(chartModel){
            graphList.push(chartModel);
            current = {
                javascriptCode:graphList[graphList.length-1].subGraphModel.javascriptCode,
                geomListCode:graphList[graphList.length-1].subGraphModel.geomListCode,
                innerCodeList:graphList[graphList.length-1].subGraphModel.innerCodeList,
                outerCodeList:graphList[graphList.length-1].subGraphModel.outerCodeList,
                chartViewModel: new flowchart.ChartViewModel(graphList[graphList.length-1].subGraphModel.chartDataModel),
                dataList: graphList[graphList.length-1].subGraphModel.dataList,
                interfaceList: graphList[graphList.length-1].subGraphModel.interfaceList,
                nodeIndex:undefined
            };
        },

        changeGraphView: function (index) {
            graphList.length = index + 1;

            current = {
                javascriptCode:graphList[graphList.length-1].subGraphModel.javascriptCode,
                geomListCode:graphList[graphList.length-1].subGraphModel.geomListCode,
                innerCodeList:graphList[graphList.length-1].subGraphModel.innerCodeList,
                outerCodeList:graphList[graphList.length-1].subGraphModel.outerCodeList,
                chartViewModel: new flowchart.ChartViewModel(graphList[graphList.length-1].subGraphModel.chartDataModel),
                dataList: graphList[graphList.length-1].subGraphModel.dataList,
                interfaceList: graphList[graphList.length-1].subGraphModel.interfaceList,
                nodeIndex:undefined
            };
        },

        getNodeIndex: function(){
            return current.nodeIndex;
        },

        getOutputGeom: function(){
            return outputGeom;
        },

        setOutputGeom: function(value){
            outputGeom = value;
        },

        getJavascriptCode: function () {
            return data.javascriptCode;
        },

        getGeomListCode: function () {
            return current.geomListCode;
        },

        getInnerCodeList: function () {
            return current.innerCodeList;
        },

        getOuterCodeList: function () {
            return current.outerCodeList;
        },

        setInnerCodeList: function (value) {
            current.innerCodeList = value;
        },

        setOuterCodeList: function (value) {
            current.outerCodeList = value;
        },

        getDataList: function () {
            return current.dataList;
        },

        getInterfaceList: function () {
            return current.interfaceList;
        },

        getChartViewModel: function () {
            return current.chartViewModel;
        },

        setDataList: function (value) {
            angular.copy(value,data.dataList);
        },

        setInterfaceList: function (value) {
            angular.copy(value,data.interfaceList);
        },

        setChartViewModel: function (value) {
            angular.copy(value,data.chartViewModel);
        },

        getRootDataList: function(){
            return data.dataList;
        },

        getRootInterfaceList: function(){
            return data.interfaceList;
        },

        getRootChartViewModel: function(){
            return data.chartViewModel;
        },

        getFunctionCodeList: function(){
            var functionCode = [];
            for(var i = 0; i< current.outerCodeList.length; i++){
                functionCode.push(current.outerCodeList[i] + current.innerCodeList[i]);
            }
            return functionCode;
        },

        generateCode: function (){
            generateCode();
        }
    };
}]);