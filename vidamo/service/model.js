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

    var data = {
        javascriptCode: '// To generate code,\n' + '// create nodes & procedures and run!\n',
        codeList:[],
        dataList:[],
        interfaceList:[],
        chartViewModel: new flowchart.ChartViewModel(chartDataModel)
    };

    return {
        getJavascriptCode: function () {
            return data.javascriptCode;
        },
        setJavascriptCode: function (value) {
            data.javascriptCode = value;
        },

        getCodeList: function () {
            return data.codeList;
        },
        setCodeList: function (value) {
            data.codeList = value;
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
        generateCode: function (){
            // copy the sorted order
            var sortedOrder = data.chartViewModel.topoSort().slice();

            //
            // execution based topological sort
            //

            data.javascriptCode = '// execution: \n';

            for(var n = 0; n < sortedOrder.length; n++) {

                // case where the node has output
                var output_port_num = data.chartViewModel.nodes[sortedOrder[n]].outputConnectors.length;
                var return_obj_name = 'ouput_' + data.chartViewModel.nodes[sortedOrder[n]].data.name;

                if (output_port_num != 0) {

                    // first get the return object

                    data.javascriptCode += 'var ' + return_obj_name + ' = ';

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


            //
            // function definitions
            //

            data.javascriptCode +='// Function definitions:' + '\n';

            // use flag to check whether it is the first argument

            for(var i = 0; i < data.dataList.length; i++){

                // function name

                data.javascriptCode += 'function ' + data.chartViewModel.nodes[i].data.name +' (';

                data.codeList[i]='// Function definitions:' + '\n' + '// This is definition for function '
                    + data.chartViewModel.nodes[i].data.name + '\n\n';

                data.codeList[i] = data.codeList[i] + 'function ' + data.chartViewModel.nodes[i].data.name +' (';

                // function arguments

                var num_input_ports = data.chartViewModel.nodes[i].inputConnectors.length;

                if(data.chartViewModel.nodes[i].inputConnectors.length){

                    for(var k = 0; k < num_input_ports; k++){

                        if( k != num_input_ports-1){
                            data.javascriptCode += data.chartViewModel.nodes[i].inputConnectors[k].data.name
                                + ',';

                            data.codeList[i] = data.codeList[i]
                                + data.chartViewModel.nodes[i].inputConnectors[k].data.name
                                + ',';
                        }
                        else{
                            data.javascriptCode += data.chartViewModel.nodes[i].inputConnectors[k].data.name;

                            data.codeList[i] = data.codeList[i]
                                + data.chartViewModel.nodes[i].inputConnectors[k].data.name;
                        }
                    }

                    data.javascriptCode +=  '){\n';
                    data.codeList[i] = data.codeList[i]+ '){\n'

                }else{

                    data.javascriptCode += '){\n';
                    data.codeList[i] = data.codeList[i]  + '){\n';
                }


                // define return items according to output port

                var num_output_ports = data.chartViewModel.nodes[i].outputConnectors.length;

                if(num_output_ports){

                    for(var k = 0; k < num_output_ports; k++){

                        data.javascriptCode += '    var '
                            + data.chartViewModel.nodes[i].outputConnectors[k].data.name
                            + ';\n';

                        data.codeList[i] = data.codeList[i]
                            + '    var '
                            + data.chartViewModel.nodes[i].outputConnectors[k].data.name
                            + ';\n'
                    }

                    data.javascriptCode +=  '\n';
                    data.codeList[i] = data.codeList[i] + '\n'

                }


                // parameters code
                for(var j = 0; j < data.interfaceList[i].length;j++){

                        // creating new parameters
                        // todo assign or create new variable
                        var codeBlock = "    " + "var "
                            + data.interfaceList[i][j].dataName
                            + " = "
                            + data.interfaceList[i][j].dataValue + ";\n";

                        data.javascriptCode += codeBlock;
                        data.codeList[i] += codeBlock;
                }

                for(var j = 0; j < data.dataList[i].length; j++){

                    // data procedure

                    if(data.dataList[i][j].title == "Data"){
                        procedure_data(data.dataList[i][j],i,false);
                    }

                    // action procedure

                    if(data.dataList[i][j].title == 'Action'){
                        procedure_action(data.dataList[i][j],i,false);
                    }


                    // control procedure

                    if(data.dataList[i][j].title == 'Control'){
                        procedure_control(data.dataList[i][j],i,false);
                    }

                }


                // return value

                if(num_output_ports){

                    data.javascriptCode +=  '\n    return {\n';

                    data.codeList[i] = data.codeList[i] + '\n    return {\n';

                    for(var k = 0; k < num_output_ports; k++){

                        data.javascriptCode +=
                            '        ' + data.chartViewModel.nodes[i].outputConnectors[k].data.name
                            + ':'
                            + data.chartViewModel.nodes[i].outputConnectors[k].data.name
                            + ',\n';

                        data.codeList[i] = data.codeList[i]
                            + '        ' + data.chartViewModel.nodes[i].outputConnectors[k].data.name
                            + ':'
                            + data.chartViewModel.nodes[i].outputConnectors[k].data.name
                            + ',\n'
                    }
                    data.javascriptCode +=  '    };\n' + '}\n\n';
                    data.codeList[i] = data.codeList[i] + '    };\n' + '}\n\n'
                }
                else{
                    data.javascriptCode +=  '}\n\n';
                    data.codeList[i] = data.codeList[i] + '}\n\n';
                }
            }



            //
            // Procedure Code Generation
            //

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
                        // asssign value to variable instead of creating new variable
                        codeBlock = intentation + "    "
                            + procedure.dataName
                            + " = "
                            + procedure.dataValue + ";\n";

                        data.javascriptCode += codeBlock;
                        data.codeList[nodeIndex] += codeBlock;
                    }else{
                        // creating new variable
                        codeBlock = intentation + "    " + "var "
                            + procedure.dataName
                            + " = "
                            + procedure.dataValue + ";\n";

                        data.javascriptCode += codeBlock;
                        data.codeList[nodeIndex] += codeBlock;
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

                // action: get data from input port
                if(procedure.method == 'get input'){

                    codeBlock = intentation  + '    ' + 'var '
                        + procedure.dataName + ' = '
                        + procedure.parameters[0] + ';\n';

                    data.javascriptCode += codeBlock;
                    data.codeList[nodeIndex] += codeBlock;
                }

                // action: print data
                if(procedure.method == 'print'){
                    codeBlock =  intentation  + '    ' + 'VIDAMO.print_data('
                        + procedure.parameters[0].value + ');\n';

                    data.javascriptCode += codeBlock;
                    data.codeList[nodeIndex] += codeBlock;
                }

                // action: set data to output port
                if(procedure.method == 'set output'){

                    codeBlock = intentation + '    '
                        + procedure.parameters[0]
                        + ' = '
                        + procedure.parameters[2] + ';\n';

                    data.javascriptCode += codeBlock;
                    data.codeList[nodeIndex] += codeBlock;
                }

                // action: create new var contains list length
                if(procedure.method == 'list length'){
                    codeBlock =
                        intentation + '    '  + 'var '
                        + procedure.dataName
                        + ' = '
                        + procedure.parameters[0] + '.length;\n';

                    data.javascriptCode += codeBlock;
                    data.codeList[nodeIndex] += codeBlock;
                }

                // action: create new var contains list item
                if(procedure.method == 'list item'){
                    codeBlock =
                        intentation + '    '  + 'var '
                        + procedure.dataName
                        + ' = '
                        + procedure.parameters[0] + '[' + procedure.parameters[1] + '];\n';

                    data.javascriptCode += codeBlock;
                    data.codeList[nodeIndex] += codeBlock;
                }

                // action: create new var contains sorted list and keep original list unchanged
                if(procedure.method == 'sort list'){

                    if(procedure.parameters[1] == 'alphabetic'){
                        codeBlock =
                            intentation + '    '  + 'var '
                            + procedure.dataName
                            + ' = '
                            + procedure.parameters[0] + '.slice().sort();\n';

                        data.javascriptCode += codeBlock;
                        data.codeList[nodeIndex] += codeBlock;
                    }

                    if(procedure.parameters[1] == 'numeric'){
                        codeBlock =
                            intentation + '    '  + 'var '
                            + procedure.dataName
                            + ' = '
                            + procedure.parameters[0] + '.slice().sort(function(a,b){return a-b});\n';

                        data.javascriptCode += codeBlock;
                        data.codeList[nodeIndex] += codeBlock;
                    }
                }

                // action: create new var contains reversed list and keep original list unchanged
                if(procedure.method == 'reverse list'){
                    codeBlock =
                        intentation + '    '  + 'var '
                        + procedure.dataName
                        + ' = '
                        + procedure.parameters[0] + '.slice().reverse();\n';

                    data.javascriptCode += codeBlock;
                    data.codeList[nodeIndex] += codeBlock;
                }

                // action: create new var contains combined list of two lists
                // todo multiple lists support
                if(procedure.method == 'combine lists'){
                    codeBlock =
                        intentation + '    ' +  'var '
                        + procedure.dataName
                        + ' = '
                        + procedure.parameters[0] + '.concat(' + procedure.parameters[1] + ');\n';

                    data.javascriptCode += codeBlock;
                    data.codeList[nodeIndex] += codeBlock;
                }

                // action: create new var contains list with added items and keep original list unchanged
                if(procedure.method == 'insert items to list'){

                    data.javascriptCode += codeBlock;
                    data.codeList[nodeIndex] += codeBlock;
                }
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
                     data.javascriptCode +=  intentation + '    ' + 'for( var ' +
                         procedure.dataName + ' of '
                         + procedure.forList + '){\n';

                     data.codeList[nodeIndex] +=  intentation + '    ' + 'for( var ' +
                         procedure.dataName + ' of '
                         + procedure.forList + '){\n';

                     if(procedure.nodes.length > 0){
                         for(var m = 0; m < procedure.nodes.length; m++){
                             if(procedure.nodes[m].title == 'Action'){procedure_action(procedure.nodes[m],nodeIndex,true)}
                             if(procedure.nodes[m].title == 'Data'){procedure_data(procedure.nodes[m],nodeIndex,true)}
                             if(procedure.nodes[m].title == 'Control'){procedure_control(procedure.nodes[m],nodeIndex,true)}
                         }
                     }
                     data.javascriptCode += intentation + '    }\n';
                     data.codeList[nodeIndex] += intentation + '    }\n';
                 }

                 else if (procedure.controlType === 'if else'){

                     data.javascriptCode +=  intentation + '    ' + 'if( ' +
                         procedure.nodes[0].ifExpression + ' ){\n';

                     data.codeList[nodeIndex] +=  intentation + '    ' + 'if( ' +
                         procedure.nodes[0].ifExpression + ' ){\n';


                     if(procedure.nodes[0].nodes.length > 0){
                         for(var i = 0; i < procedure.nodes[0].nodes.length; i++){
                             if(procedure.nodes[0].nodes[i].title == 'Action'){procedure_action(procedure.nodes[0].nodes[i],nodeIndex,true)}
                             if(procedure.nodes[0].nodes[i].title == 'Data'){procedure_data(procedure.nodes[0].nodes[i],nodeIndex,true)}
                             if(procedure.nodes[0].nodes[i].title == 'Control'){procedure_control(procedure.nodes[0].nodes[i],nodeIndex,true)}
                         }
                     }

                     data.javascriptCode += intentation + '    }else{\n';
                     data.codeList[nodeIndex] += intentation + '    }else{\n';

                     if(procedure.nodes[1].nodes.length > 0){
                         for(var m = 0; m < procedure.nodes[1].nodes.length; m++){
                             if(procedure.nodes[1].nodes[m].title == 'Action'){procedure_action(procedure.nodes[1].nodes[m],nodeIndex,true)}
                             if(procedure.nodes[1].nodes[m].title == 'Data'){procedure_data(procedure.nodes[1].nodes[m],nodeIndex,true)}
                             if(procedure.nodes[1].nodes[m].title == 'Control'){procedure_control(procedure.nodes[1].nodes[m],nodeIndex,true)}
                         }
                     }

                     data.javascriptCode += intentation + '    }\n';
                     data.codeList[nodeIndex] += intentation + '    }\n';
                 }

            }
        }
    };
});
