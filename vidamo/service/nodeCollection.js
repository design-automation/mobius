//
// data pool for different type of nodes
//


vidamo.factory('nodeCollection', function () {
    var nodes = [{
        // node type
        nodeType: 'empty',

        // node data model for graph
        nodeDataModel: {
            name: undefined,
            id: undefined,
            x: undefined,
            y: undefined,
            inputConnectors: [
            ],
            outputConnectors: [
            ]
        },

        // procedure data model linked with node
        procedureDataModel: [],

        // procedure data model linked with node
        interfaceDataModel: []
    }];

    return{

        // return node types for graph
        getNodeTypes: function(){
            var nodeTypes = [];
            for(var i = 0; i < nodes.length; i++){
                nodeTypes.push(nodes[i].nodeType);
            }
            return nodeTypes;
        },

        // return node data model for graph
        getNodeDataModel: function(type){
            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].nodeType == type){
                    var obj = {};
                    angular.copy(nodes[i].nodeDataModel,obj);
                    return obj;
                }
            }
        },

        // return procedure data model for procedure
        getProcedureDataModel: function(type){
            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].nodeType == type){
                    var obj = [];
                    angular.copy(nodes[i].procedureDataModel,obj);
                    return obj;
                }
            }
        },

        // return interface data model for interface
        getInterfaceDataModel: function(type){
            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].nodeType == type){
                    var obj = [];
                    angular.copy(nodes[i].interfaceDataModel,obj);
                    return obj;
                }
            }
        },

        // install node for import node
        installNewNode: function(name, nodeObj, procedureList, interfaceList){
            var newNode = {
                nodeType: name,

                nodeDataModel: nodeObj,

                procedureDataModel: procedureList,

                interfaceDataModel: interfaceList
            };

            nodes.push(newNode);
            console.log(nodes);
        }
    }
});