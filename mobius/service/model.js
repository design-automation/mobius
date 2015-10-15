//
// data model service for application data synchronization among controllers
// code generation module
//

vidamo.factory('generateCode', function () {

    // vidamo application data pool

    var chartDataModel = {
        nodes: [],
        connections: []
    };

    var outputGeom = [];

    var data = {
        javascriptCode: '// To generate code,\n' + '// create nodes & procedures and run!\n',
        geomListCode: "var geomList = [];\n",
        innerCodeList:[],
        outerCodeList:[],
        dataList:[],
        interfaceList:[],
        chartViewModel: new flowchart.ChartViewModel(chartDataModel)
    };

    return {
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
            return data.geomListCode;
        },

        setJavascriptCode: function (value) {
            data.javascriptCode = value;
        },

        getInnerCodeList: function () {
            return data.innerCodeList;
        },

        getOuterCodeList: function () {
            return data.outerCodeList;
        },

        setInnerCodeList: function (value) {
            data.innerCodeList = value;
        },

        setOuterCodeList: function (value) {
            data.outerCodeList = value;
        },

        getDataList: function () {
            return data.dataList;
        },

        setDataList: function (value) {
            data.dataList = value;
        },

        getInterfaceList: function () {
            return data.interfaceList;
        },

        setInterfaceList: function (value) {
            data.interfaceList= value;
        },

        getChartViewModel: function () {
            return data.chartViewModel;
        },

        setChartViewModel: function (value) {
            data.chartViewModel= value;
        },
        getFunctionCodeList: function(){
            var functionCode = [];
            for(var i = 0; i< data.outerCodeList.length; i++){
                functionCode.push(data.outerCodeList[i] + data.innerCodeList[i]);
            }
            return functionCode;
        },

        generateCode: function (){
            console.log('generateCode');
            // copy the sorted order
            var sortedOrder = data.chartViewModel.topoSort().slice();

            generate_execution_code();
            generate_outer_function_code();
            generate_inner_function_code();

            for(var i = 0; i < data.dataList.length; i++){
                data.javascriptCode += data.outerCodeList[i];
            }

            for(var i = 0; i < data.dataList.length; i++){
                data.javascriptCode += data.innerCodeList[i];
            }

            // execution based topological sort
            function generate_execution_code(){
                data.javascriptCode = '// execution: \n';
                data.geomListCode = "var geomList = [];\n";
                for(var n = 0; n < sortedOrder.length; n++) {

                    // case where the node has output
                    var output_port_num = data.chartViewModel.nodes[sortedOrder[n]].outputConnectors.length;
                    var node_name = data.chartViewModel.nodes[sortedOrder[n]].data.name;
                    var return_obj_name = 'output_' + data.chartViewModel.nodes[sortedOrder[n]].data.name;

                    if (output_port_num != 0) {
                        // first get the return object
                        data.javascriptCode += 'var ' + return_obj_name + ' = ';
                        data.geomListCode += 'geomList.push({'
                                            + 'name:'
                                            + node_name +'.name,'
                                            + 'value:'
                                            + return_obj_name + ','
                                            + 'geom:'
                                            + '[]'
                                            +'});'
                    }


                    // case where the node has no output
                    data.javascriptCode += data.chartViewModel.nodes[sortedOrder[n]].data.name + "(";

                    // print all the parameters/inputs

                    var input_port_num = data.chartViewModel.nodes[sortedOrder[n]].inputConnectors.length;

                    for (var m = 0; m < input_port_num; m++) {

                        var input_port_name = data.chartViewModel.nodes[sortedOrder[n]].inputConnectors[m].data.name;
                        if(m != input_port_num-1){
                            data.javascriptCode += input_port_name + ',';
                        }
                        else{
                            data.javascriptCode += input_port_name;
                        }

                    }

                    data.javascriptCode +=  ");\n";

                    // extract items from return through label
                    for(var m =0; m < output_port_num; m++){

                        var output_port_name = data.chartViewModel.nodes[sortedOrder[n]].outputConnectors[m].data.name;

                        for (var l = 0; l < data.chartViewModel.connections.length; l++) {

                            if (output_port_name == data.chartViewModel.connections[l].source.name()) {

                                var connected_input_name = data.chartViewModel.connections[l].dest.data.name;

                                data.javascriptCode +=  'var '
                                    + connected_input_name +' = '
                                    + return_obj_name
                                    + '.'
                                    + output_port_name + ';\n';
                            }
                        }
                    }
                    data.javascriptCode +=  "\n";
                }

                data.javascriptCode += '\n';
            }

            // outer function code with parameters-definition and invoking of procedure function
            function generate_outer_function_code(){

                for(var i = 0; i < data.dataList.length; i++){
                    // function name
                    data.outerCodeList[i]='// This is definition for function '
                        + data.chartViewModel.nodes[i].data.name + '\n';

                    data.outerCodeList[i] += 'function ' + data.chartViewModel.nodes[i].data.name +' (';

                    // function inputs

                    var num_input_ports = data.chartViewModel.nodes[i].inputConnectors.length;

                    if(data.chartViewModel.nodes[i].inputConnectors.length){

                        for(var k = 0; k < num_input_ports; k++){

                            if( k != num_input_ports-1){
                                data.outerCodeList[i] += data.chartViewModel.nodes[i].inputConnectors[k].data.name + ',';
                            }
                            else{
                                data.outerCodeList[i] += data.chartViewModel.nodes[i].inputConnectors[k].data.name;
                            }
                        }

                        data.outerCodeList[i] += '){\n'

                    }else{
                        data.outerCodeList[i] +=  '){\n';
                    }

                    // parameters code
                    // todo assign or create new variable
                    for(var j = 0; j < data.interfaceList[i].length;j++){

                        // creating new parameters
                        var codeBlock = "    " + "var "
                            + data.interfaceList[i][j].dataName
                            + " = "
                            + data.interfaceList[i][j].dataValue + ";\n";

                        data.outerCodeList[i] += codeBlock;
                    }

                    // code for invoking inner function
                    var identifier = '_' + data.chartViewModel.nodes[i].data.version;
                    if(data.chartViewModel.nodes[i].data.version === 0){
                        identifier = '';
                    }

                    data.outerCodeList[i] += '    return ' + data.chartViewModel.nodes[i].data.type + identifier + '(';

                    for(var j = 0; j < data.interfaceList[i].length; j++){
                        data.outerCodeList[i] += data.interfaceList[i][j].dataName;
                        if(j !=  data.interfaceList[i].length-1){
                            data.outerCodeList[i] += ', '
                        }
                    }

                    data.outerCodeList[i] +=   ');' + '\n}\n\n';
            }
            }

            // inner function code generation and procedure content code
            function generate_inner_function_code(){
                // inner(type) function definition: linking with parameters
                for(var i = 0; i < data.dataList.length; i++) {

                    data.innerCodeList[i] = '// This is definition for type '
                        + data.chartViewModel.nodes[i].data.type + '\n'
                        + '// version: ' + data.chartViewModel.nodes[i].data.version + '\n';

                    var identifier = '_' + data.chartViewModel.nodes[i].data.version;
                    if(data.chartViewModel.nodes[i].data.version === 0){
                        identifier = '';
                    }

                    data.innerCodeList[i] += 'function ' + data.chartViewModel.nodes[i].data.type + identifier + '( ';

                    for (var j = 0; j < data.interfaceList[i].length; j++) {
                        data.innerCodeList[i] += data.interfaceList[i][j].dataName;
                        if (j != data.interfaceList[i].length - 1) {
                            data.innerCodeList[i] += ', '
                        }
                    }

                    data.innerCodeList[i] += ' ){\n';


                    // define return items according to output port
                    var num_output_ports = data.chartViewModel.nodes[i].outputConnectors.length;

                    if(num_output_ports){

                        for(var k = 0; k < num_output_ports; k++){
                            data.innerCodeList[i] += '    var '
                                + data.chartViewModel.nodes[i].outputConnectors[k].data.name
                                + ';\n';
                        }

                        data.innerCodeList[i] +=  '\n';
                    }

                    // inner function content
                    for (var j = 0; j < data.dataList[i].length; j++) {

                        // data procedure

                        if (data.dataList[i][j].title == "Data") {
                            procedure_data(data.dataList[i][j], i, false);
                        }

                        // action procedure

                        if (data.dataList[i][j].title == 'Action') {
                            procedure_action(data.dataList[i][j], i, false);
                        }

                        // control procedure

                        if (data.dataList[i][j].title == 'Control') {
                            procedure_control(data.dataList[i][j], i, false);
                        }
                    }

                    // return value
                    if(num_output_ports){
                        data.innerCodeList[i] = data.innerCodeList[i] + '\n    return {\n';

                        for(var k = 0; k < num_output_ports; k++){
                            data.innerCodeList[i] +=
                                '        ' + data.chartViewModel.nodes[i].outputConnectors[k].data.name
                                + ':'
                                + data.chartViewModel.nodes[i].outputConnectors[k].data.name
                                + ',\n'
                        }
                        data.innerCodeList[i] += '    };\n' + '}\n\n'
                    }else{
                        data.innerCodeList[i] += '}\n\n';
                    }
                }
            }

            // data procedure
            function procedure_data(procedure,nodeIndex,fromLoop){
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

                        data.innerCodeList[nodeIndex] += codeBlock;
                    }else{
                        // creating new variable
                        codeBlock = intentation + "    " + "var "
                            + procedure.dataName
                            + " = "
                            + procedure.dataValue + ";\n";

                        data.innerCodeList[nodeIndex] += codeBlock;
                    }
                }
            }

            // action procedure
             function procedure_action(procedure,nodeIndex,fromLoop){
                // todo this is only a dummy intentation
                if(fromLoop){
                    var intentation = '    ';
                }else{
                    var intentation = '';
                }

                 var codeBlock = '';
                 if(procedure.method !== 'print' && procedure.method !== 'expression'){
                    codeBlock += intentation  + '    '  + 'var ' + procedure.result + ' = ';
                 }else{
                     codeBlock += intentation  + '    ';
                 }

                 if(procedure.method !== 'expression'){
                     codeBlock +=  'VIDAMO.' + procedure.method + '(';

                     for(var j = 0; j< procedure.parameters.length; j++){
                         if(j != procedure.parameters.length - 1 ){
                             codeBlock +=  procedure.parameters[j].value + ', ';
                         }else{
                             codeBlock += procedure.parameters[j].value;
                         }
                     }

                     codeBlock += ');\n';
                 }else if(procedure.method === 'expression'){
                     codeBlock += procedure.expression;
                 }


                 data.innerCodeList[nodeIndex] += codeBlock;
             }

            // control procedure
            function procedure_control(procedure,nodeIndex,fromLoop){
                var intentation;
                if(fromLoop){
                    intentation = '    ';
                }else{
                    intentation = '';
                }

                if(procedure.controlType === 'for each'){
                    data.innerCodeList[nodeIndex] +=  intentation + '    ' + 'for( var ' +
                                            procedure.dataName + ' of '
                                            + procedure.forList + '){\n';

                     if(procedure.nodes.length > 0){
                         for(var m = 0; m < procedure.nodes.length; m++){
                             if(procedure.nodes[m].title == 'Action'){procedure_action(procedure.nodes[m],nodeIndex,true)}
                             if(procedure.nodes[m].title == 'Data'){procedure_data(procedure.nodes[m],nodeIndex,true)}
                             if(procedure.nodes[m].title == 'Control'){procedure_control(procedure.nodes[m],nodeIndex,true)}
                         }
                     }

                     data.innerCodeList[nodeIndex] += intentation + '    }\n';
                }

                 else if (procedure.controlType === 'if else'){
                     data.innerCodeList[nodeIndex] +=  intentation + '    ' + 'if( ' +
                         procedure.nodes[0].ifExpression + ' ){\n';


                     if(procedure.nodes[0].nodes.length > 0){
                         for(var i = 0; i < procedure.nodes[0].nodes.length; i++){
                             if(procedure.nodes[0].nodes[i].title == 'Action'){procedure_action(procedure.nodes[0].nodes[i],nodeIndex,true)}
                             if(procedure.nodes[0].nodes[i].title == 'Data'){procedure_data(procedure.nodes[0].nodes[i],nodeIndex,true)}
                             if(procedure.nodes[0].nodes[i].title == 'Control'){procedure_control(procedure.nodes[0].nodes[i],nodeIndex,true)}
                         }
                     }

                     data.innerCodeList[nodeIndex] += intentation + '    }else{\n';

                     if(procedure.nodes[1].nodes.length > 0){
                         for(var m = 0; m < procedure.nodes[1].nodes.length; m++){
                             if(procedure.nodes[1].nodes[m].title == 'Action'){procedure_action(procedure.nodes[1].nodes[m],nodeIndex,true)}
                             if(procedure.nodes[1].nodes[m].title == 'Data'){procedure_data(procedure.nodes[1].nodes[m],nodeIndex,true)}
                             if(procedure.nodes[1].nodes[m].title == 'Control'){procedure_control(procedure.nodes[1].nodes[m],nodeIndex,true)}
                         }
                     }

                     data.innerCodeList[nodeIndex] += intentation + '    }\n';
                 }
            }
        }
    };
});
