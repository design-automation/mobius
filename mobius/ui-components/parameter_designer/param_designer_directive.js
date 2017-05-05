mobius.directive('paramDesigner', ['$rootScope', 'generateCode', '$filter', 'consoleMsg',function($rootScope, generateCode, $filter, consoleMsg) {
  	return {
        restrict: 'E', 
        scope: {},
        templateUrl: 'mobius/ui-components/parameter_designer/param_designer_tpl.html',
        link: function (scope, element, attrs) {

        	scope.nodeIndex = undefined;

	        // interface design options
	        scope.interfaceOptions = [{name:'none'},
	                                   {name:'slider'},
	                                   {name:'dropdown'},
	                                   {name:'color picker'},
	                                   {name:'local file'}]

	        // --- Procedure
	        scope.$on("clearProcedure", function(){
	            scope.interface = undefined;
	        });

	        scope.$watch(function(){return generateCode.getChartViewModel()},function(){
	            scope.interfaceList= generateCode.getInterfaceList();
	        });

	        // interface data list
	        scope.interfaceList= generateCode.getInterfaceList();

	        scope.$watch(function () { return generateCode.getInterfaceList(); }, function () {
	            scope.interfaceList= generateCode.getInterfaceList();
	        },true);

	        /*scope.$watch('interface',function(){
	            updateVersion();
	            flattenData();
	            generateCode.generateCode();
	        },true);*/

	        // adding a new input output
	        scope.newInterface = function(cate) {
	            try{
	                if(cate === 'Input'){

	                    var inputObj = {
	                        id:scope.interface.length + 1,
	                        title: 'Input',
	                        name: undefined,
	                        connected:false,
	                        dataValue:undefined,
	                        type:undefined,
	                        option:{
	                            name:'none'
	                        },
	                        color:'#000000',
	                        menuOptionText:undefined
	                    };

	                    scope.interface.push(inputObj);

	                    // add an input connector to chartViewModel
	                    scope.chartViewModel.nodes[scope.nodeIndex].addInputConnector(inputObj);

	                }else if(cate === 'Output'){

	                    var outputObj = {
	                        id: scope.interface.length + 1,//scope.maxId(scope.data) + 1,
	                        title: 'Output'
	                    };

	                    scope.interface.push(outputObj);

	                    scope.chartViewModel.nodes[scope.nodeIndex].addOutputConnector(outputObj);
	                }
	            } catch(err) {
	                consoleMsg.errorMsg('noNode');
	            }

	            /*var argumentDiv = document.getElementById("argument-area");
	            setTimeout(function(){argumentDiv.scrollTop = argumentDiv.scrollHeight +6 ;},0);*/
	        };

	        scope.removeOutput = function(scope) {
	            scope.remove();

	            var newOutputConnectorDataModels = [];
	            var newConnectionDataModels = [];
	            var newConnectionViewModels = [];

	            for(var i = 0; i < scope.chartViewModel.data.nodes[scope.nodeIndex].outputConnectors.length; i ++){
	                if(scope.chartViewModel.nodes[scope.nodeIndex].outputConnectors[i].data !== scope.$modelValue){
	                    newOutputConnectorDataModels.push(scope.chartViewModel.nodes[scope.nodeIndex].outputConnectors[i].data);
	                }else{
	                    var deletedOutputConnectors = {
	                        nodeId: scope.chartViewModel.nodes[scope.nodeIndex].data.id,
	                        outputConnectorIndex:
	                            scope.chartViewModel.nodes[scope.nodeIndex].outputConnectors.indexOf(
	                                scope.chartViewModel.nodes[scope.nodeIndex].outputConnectors[i]
	                            )
	                    };
	                }
	            }

	            scope.chartViewModel.data.nodes[scope.nodeIndex].outputConnectors = [];
	            scope.chartViewModel.nodes[scope.nodeIndex].outputConnectors = [];

	            for(var newOutputIndex = 0; newOutputIndex < newOutputConnectorDataModels.length; newOutputIndex++){
	                scope.chartViewModel.nodes[scope.nodeIndex].addOutputConnector(newOutputConnectorDataModels[newOutputIndex]);
	            }


	            for(var j = 0; j < scope.chartViewModel.connections.length; j++){
	                if(!(deletedOutputConnectors.nodeId === scope.chartViewModel.connections[j].data.source.nodeID &&
	                    deletedOutputConnectors.outputConnectorIndex === scope.chartViewModel.connections[j].data.source.connectorIndex)){
	                        newConnectionViewModels.push(scope.chartViewModel.connections[j]);
	                        newConnectionDataModels.push(scope.chartViewModel.connections[j].data);
	                }
	            }

	            // fixme update connector index and source/dest in connections
	            for(var m = 0; m < scope.chartViewModel.connections.length; m++){

	                var sourceDecreaseIn = 0;

	                if(scope.chartViewModel.connections[m].data.source.nodeID === deletedOutputConnectors.nodeId){
	                    if(scope.chartViewModel.connections[m].data.source.connectorIndex >
	                        deletedOutputConnectors.outputConnectorIndex){
	                        sourceDecreaseIn ++;
	                    }
	                }

	                scope.chartViewModel.connections[m].data.source.connectorIndex -= sourceDecreaseIn;
	                scope.chartViewModel.connections[m].source = scope.chartViewModel.findOutputConnector(
	                    scope.chartViewModel.connections[m].data.source.nodeID,
	                    scope.chartViewModel.connections[m].data.source.connectorIndex);
	            }

	            scope.chartViewModel.connections = newConnectionViewModels;
	            scope.chartViewModel.data.connections = newConnectionDataModels;
	        };

	        scope.removeInput = function(scope) {
	            scope.remove();

	            var newInputConnectorDataModels = [];
	            var newConnectionDataModels = [];
	            var newConnectionViewModels = [];

	            for(var i = 0; i < scope.chartViewModel.data.nodes[scope.nodeIndex].inputConnectors.length; i ++){

	                if(scope.chartViewModel.nodes[scope.nodeIndex].inputConnectors[i].data !== scope.$modelValue){
	                    newInputConnectorDataModels.push(scope.chartViewModel.nodes[scope.nodeIndex].inputConnectors[i].data);
	                }else{
	                    var deletedInputConnectors = {
	                        nodeId: scope.chartViewModel.nodes[scope.nodeIndex].data.id,
	                        inputConnectorIndex:
	                            scope.chartViewModel.nodes[scope.nodeIndex].inputConnectors.indexOf(
	                                scope.chartViewModel.nodes[scope.nodeIndex].inputConnectors[i]
	                            )
	                    };
	                }
	            }

	            scope.chartViewModel.data.nodes[scope.nodeIndex].inputConnectors = [];
	            scope.chartViewModel.nodes[scope.nodeIndex].inputConnectors = [];

	            for(var newInputIndex = 0; newInputIndex < newInputConnectorDataModels.length; newInputIndex++){
	                scope.chartViewModel.nodes[scope.nodeIndex].addInputConnector(newInputConnectorDataModels[newInputIndex]);
	            }


	            for(var j = 0; j < scope.chartViewModel.connections.length; j++){
	                if(!(deletedInputConnectors.nodeId === scope.chartViewModel.connections[j].data.dest.nodeID &&
	                    deletedInputConnectors.inputConnectorIndex === scope.chartViewModel.connections[j].data.dest.connectorIndex)){
	                    newConnectionViewModels.push(scope.chartViewModel.connections[j]);
	                    newConnectionDataModels.push(scope.chartViewModel.connections[j].data);
	                }
	            }

	            // fixme update connector index and source/dest in connections
	            for(var m = 0; m < scope.chartViewModel.connections.length; m++){

	                var destDecreaseIn = 0;

	                if(scope.chartViewModel.connections[m].data.dest.nodeID === deletedInputConnectors.nodeId){
	                    if(scope.chartViewModel.connections[m].data.dest.connectorIndex >
	                        deletedInputConnectors.inputConnectorIndex){
	                        destDecreaseIn ++;
	                    }
	                }

	                scope.chartViewModel.connections[m].data.dest.connectorIndex -= destDecreaseIn;
	                scope.chartViewModel.connections[m].dest = scope.chartViewModel.findInputConnector(
	                    scope.chartViewModel.connections[m].data.dest.nodeID,
	                    scope.chartViewModel.connections[m].data.dest.connectorIndex);
	            }

	            scope.chartViewModel.connections = newConnectionViewModels;
	            scope.chartViewModel.data.connections = newConnectionDataModels;

	            scope.chartViewModel.connections = newConnectionViewModels;
	            scope.chartViewModel.data.connections = newConnectionDataModels;
	        };

	        scope.remove = function(scope){
	            scope.remove();
	        };

	        $rootScope.$on("add-interface-item", function(event, message){
	        	if(scope.nodeIndex != undefined) scope.newInterface(message);
	        	else console.log("no node seletced");
	        });

			// listen to the graph, when a node is clicked, update the procedure/ interface tabs
	        $rootScope.$on("nodeIndex", function(event, message) {

	            if(message === undefined){
	            }
	            else if(message !== "port"){

	                scope.nodeIndex = message; 
	                scope.interface = scope.interfaceList[scope.nodeIndex];

	                // todo: why is this needed?
	                setTimeout(function () {
	                    scope.$apply();
	                }, 0);

	            }
	            else if(message === 'port'){

	                //todo input/output port configuration

	                // update the procedure tab
	                // scope.data  = scope.dataList[scope.nodeIndex];

	                // update the interface tab
	                // scope.interface = scope.interfaceList[scope.nodeIndex];
	            }
	        });



	        /* todo: repeat functions from procedure controller */

	        // graph flowchart view model
	        // pass by reference
	        // deep watch chartViewModel.data instead of chartViewModel to prevent stack limit exceeded
	        scope.chartViewModel= generateCode.getChartViewModel();

	        scope.$watch(function(){return generateCode.getChartViewModel()},function(){
	            scope.interfaceList= generateCode.getInterfaceList();
	            scope.chartViewModel = generateCode.getChartViewModel();  // needed for ability to add and remove inputs outputs
	        });

    	}
    }
}]);
