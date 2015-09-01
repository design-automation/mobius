//
// data pool for default types of nodes
//

vidamo.factory('nodeCollection', function () {

    var nodes= [];
    var defaultNodes = [{

        // node type
        nodeType: 'create new type',

        // node data model for graph
        nodeDataModel: {
            name: undefined,
            type:undefined,
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
    },
        {

            // node type
            nodeType: 'point(default)',

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
        },
        {

            // node type
            nodeType: 'node from a friend',

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