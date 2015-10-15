//
// data pool for node types
//

// todo
// 4. file system implementation

vidamo.factory('nodeCollection', function () {

    var nodes= [];
    var defaultNodes = [{

        // this should be the future template
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
    if(localStorage.vidamoNodeTypes === undefined){
        // store default into local storage
        localStorage.vidamoNodeTypes = JSON.stringify(defaultNodes);
    }

    // retrieve the local storage node types for usage
    nodes = JSON.parse(localStorage.vidamoNodeTypes);

    return{
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
            localStorage.vidamoNodeTypes = JSON.stringify(nodes);
        },

        // update node procedure content
        updateNodeType: function(oldType,newType, input, output, newProcedureList,newInterfaceList){
            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].nodeType == oldType){
                    nodes[i].nodeType = newType;
                    nodes[i].inputConnectors = input;
                    nodes[i].outputConnectors = output;
                    nodes[i].procedureDataModel = newProcedureList;
                    nodes[i].interfaceDataModel = newInterfaceList;
                }

                localStorage.vidamoNodeTypes = JSON.stringify(nodes);
            }
        }
    }
});