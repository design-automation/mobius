// data pool for node types

mobius.factory('nodeCollection', function () {

    var nodes= [];
    var defaultNodes = [{
        // node type name
        nodeType:'create new type',
        // node type
        version:'',
        // node option to be overwritten
        overwrite:false,

        // graph info
        inputConnectors: [],
        outputConnectors: [],

        // procedure data model linked with node
        procedureDataModel: [],

        // procedure data model linked with node
        interfaceDataModel: []
    }];


    // check if node types exists in local storage, if not, store default
    if(localStorage.mobiusNodeTypes === undefined){
        // store default into local storage
        localStorage.mobiusNodeTypes = JSON.stringify(defaultNodes);
    }

    // retrieve the local storage node types for usage
    nodes = JSON.parse(localStorage.mobiusNodeTypes);

    return{
        syncNodeTpyeStorage: function(){
            nodes = JSON.parse(localStorage.mobiusNodeTypes);
        },

        // return node types for graph
        getNodeTypes: function(){
            var nodeTypes = [];
            for(var i = 0; i < nodes.length; i++){
                nodeTypes.push(nodes[i].nodeType);
            }
            return nodeTypes;
        },

        // return overwrite option
        getOverwrite: function(typeName){
            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].nodeType == typeName){
                    return nodes[i].overwrite;
                }
            }
        },

        getInputConnectors: function(type){
            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].nodeType == type){
                    var input = [];
                    angular.copy(nodes[i].inputConnectors,input);
                    return input;
                }
            }
        },

        getOutputConnectors: function(type){
            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].nodeType == type){
                    var output = [];
                    angular.copy(nodes[i].outputConnectors,output);
                    return output;
                }
            }
        },

        // return procedure data model for procedure
        getProcedureDataModel: function(typeName){
            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].nodeType == typeName){
                    var obj = [];
                    angular.copy(nodes[i].procedureDataModel,obj);
                    return obj;
                }
            }
        },

        // return interface data model for interface
        getInterfaceDataModel: function(typeName){
            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].nodeType == typeName){
                    var obj = [];
                    angular.copy(nodes[i].interfaceDataModel,obj);
                    return obj;
                }
            }
        },

        // install node for create new node type / import node
        installNewNodeType: function(type, input, output, procedureList, interfaceList){

            //if(interfaceList){
            //    for(var i = 0; i <interfaceList.length; i++){
            //        if(interfaceList[i].connected === true){
            //            interfaceList[i].connected = false;
            //            console.log('xx')
            //        }
            //    }
            //}

            var newNode = {
                nodeType: type,
                version:0,
                overwrite:true,

                inputConnectors: input,
                outputConnectors: output,

                procedureDataModel: procedureList,
                interfaceDataModel: interfaceList
            };

            nodes.push(newNode);
            localStorage.mobiusNodeTypes = JSON.stringify(nodes);

        },

        // update node procedure content
        updateNodeType: function(oldType,newType, input, output, newProcedureList,newInterfaceList){

            //if(newInterfaceList){
            //    for(var i = 0; i <newInterfaceList.length; i++){
            //        if(newInterfaceList[i].connected === true){
            //            newInterfaceList[i].connected = false;
            //        }
            //    }
            //}

            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].nodeType == oldType){
                    nodes[i].nodeType = newType;
                    nodes[i].inputConnectors = input;
                    nodes[i].outputConnectors = output;
                    nodes[i].procedureDataModel = newProcedureList;
                    nodes[i].interfaceDataModel = newInterfaceList;
                }

                localStorage.mobiusNodeTypes = JSON.stringify(nodes);
            }
        }
    }
});