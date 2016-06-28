//
// view model Global accessor for graph
//

var flowchart = {};

// Module.
(function () {

	//
	// Width of a node.
	//
	flowchart.nodeHeight =20;

	//
	// height of input /output port height for subgraph
	//
	flowchart.portHeight = 6;

	//
	// Amount of space reserved for displaying the node's name.
	//
	flowchart.nodeNameWidth = 50;

	//
	// Height of a connector in a node.
	//
	flowchart.connectorWidth = 35;

	//
	// Compute the Y coordinate of a connector, given its index.
	//
	flowchart.computeConnectorX = function (connectorIndex) {
		// return flowchart.nodeNameWidth + (connectorIndex * flowchart.connectorWidth);
		return 15 + (connectorIndex * 20);
	};

	//
	// Compute the position of a connector in the graph.
	//
	flowchart.computeConnectorPos = function (node, connectorIndex, inputConnector, isPort) {
		return {
			x: node.x() + flowchart.computeConnectorX(connectorIndex),
			y: isPort === true ? node.y() + (inputConnector ? 0 : flowchart.portHeight) : node.y() + (inputConnector ? 0 : flowchart.nodeHeight)
		};
	};


	//
	// View model for a connector.
	// @ mobius add selection for connector deletion
	//
	flowchart.ConnectorViewModel = function (connectorDataModel, x, y, parentNode) {

		this.data = connectorDataModel;
		this._parentNode = parentNode;
		this._x = x;
		this._y = y;

		//
		// The name of the connector.
		//
		this.name = function () {
			return this.data.name;
		};

		//
		// X coordinate of the connector.
		//
		this.x = function () {
			return this._x;
		};

		//
		// Y coordinate of the connector.
		//
		this.y = function () {
			return this._y;
		};

		//
		// The parent node that the connector is attached to.
		//
		this.parentNode = function () {
			return this._parentNode;
		};

		// Set to true when the connector is selected.
		this._selected = false;

		//
		// Select the connector
		//
		this.select = function () {
			this._selected = true;
		};

		//
		// Deselect the connector
		//
		this.deselect = function () {
			this._selected = false;
		};

		//
		// Toggle the selection state of the connector
		//
		this.toggleSelected = function () {
			this._selected = !this._selected;
		};

		//
		// Returns true if the connector is selected.
		//
		this.selected = function () {
			return this._selected;
		};
	};

	//
	// Create view model for a list of data models.
	//
	var createConnectorsViewModel = function (connectorDataModels, y, parentNode) {
		var viewModels = [];
		if (connectorDataModels) {
			for (var i = 0; i < connectorDataModels.length; ++i) {
				var connectorViewModel =
					new flowchart.ConnectorViewModel(connectorDataModels[i], flowchart.computeConnectorX(i), y, parentNode);
				viewModels.push(connectorViewModel);
			}
		}

		return viewModels;
	};

	//
	// View model for a node.
	//
	flowchart.NodeViewModel = function (nodeDataModel) {
		this.data = nodeDataModel;
		this.inputConnectors = createConnectorsViewModel(this.data.inputConnectors, 0, this);
		this.outputConnectors = createConnectorsViewModel(this.data.outputConnectors, flowchart.nodeHeight, this);

		// Set to true when the node is selected.
		this._selected = false;

		//
		// Name of the node.
		//
		this.name = function () {
			return this.data.name || "";
		};

		//
		// X coordinate of the node.
		//
		this.x = function () {
			return this.data.x;
		};

		//
		// Y coordinate of the node.
		//
		this.y = function () {
			return this.data.y;
		};

		//
		// Width of the node.
		//
		this.width = function () {
			var numConnectors =
				Math.max(
					this.inputConnectors.length,
					this.outputConnectors.length);
			return flowchart.computeConnectorX(numConnectors)-5;
		};

		//
		// Height of the node.
		//
		this.height = function () {
			return flowchart.nodeHeight;
		};

		//
		// Select the node.
		//
		this.select = function () {
			this._selected = true;
		};

		//
		// Deselect the node.
		//
		this.deselect = function () {
			this._selected = false;
		};

		//
		// Enable the node.
		//
		this.disable = function(){
			nodeDataModel.disabled = true;
		};

		//
		// Disable the node.
		//
		this.enable = function(){
			nodeDataModel.disabled = false;
		};

		//
		// Toggle the selection state of the node.
		//
		this.toggleSelected = function () {
			this._selected = !this._selected;
		};

		//
		// Returns true if the node is selected.
		//
		this.selected = function () {
			return this._selected;
		};

		//
		// Returns true if the node is selected.
		//
		this.disabled = function () {
			return nodeDataModel.disabled;
		};

		this.error = function () {
			return nodeDataModel.error;
		};

		//
		// Internal function to add a connector.
		this._addConnector = function (connectorDataModel, y, connectorsDataModel, connectorsViewModel) {
			var connectorViewModel =
				new flowchart.ConnectorViewModel(connectorDataModel,
					flowchart.computeConnectorX(connectorsViewModel.length),y, this);

			connectorsDataModel.push(connectorDataModel);

			// Add to node's view model.
			connectorsViewModel.push(connectorViewModel);
		};

		//
		// Add an input connector to the node.
		//
		this.addInputConnector = function (connectorDataModel) {

			if (!this.data.inputConnectors) {
				this.data.inputConnectors = [];
			}
			this._addConnector(connectorDataModel, 0, this.data.inputConnectors, this.inputConnectors);
		};

		//
		// Add an ouput connector to the node.
		//
		this.addOutputConnector = function (connectorDataModel) {

			if (!this.data.outputConnectors) {
				this.data.outputConnectors = [];
			}
			this._addConnector(connectorDataModel, flowchart.nodeHeight, this.data.outputConnectors, this.outputConnectors);
		};
	};

	//
	// Wrap the nodes data-model in a view-model.
	//
	var createNodesViewModel = function (nodesDataModel) {
		var nodesViewModel = [];

		if (nodesDataModel) {
			for (var i = 0; i < nodesDataModel.length; ++i) {
				nodesViewModel.push(new flowchart.NodeViewModel(nodesDataModel[i]));
			}
		}

		return nodesViewModel;
	};

	//
	// view model for input in subgraph
	// provide output connectors but title is still input
	flowchart.InputPortViewModel = function (inputDataModel){
		this.data = inputDataModel;
		this.data.id = 'inputPort';
		for(var i = 0; i < this.data.outputConnectors.length; i++){
			this.data.outputConnectors[i].title = 'Output';
		}

		this.outputConnectors = createConnectorsViewModel(this.data.outputConnectors, flowchart.portHeight, this);

		// Set to true when the node is selected.
		this._selected = false;

		//
		// X coordinate of the node.
		//
		this.x = function () {
			return this.data.x;
		};

		//
		// Y coordinate of the node.
		//
		this.y = function () {
			return this.data.y;
		};

		//
		// Width of the node.
		//
		this.width = function () {
			var numConnectors = this.outputConnectors.length;
			return flowchart.computeConnectorX(numConnectors)-5;
		};

		//
		// Height of the node.
		//
		this.height = function () {
			return flowchart.portHeight;
		};

		//
		// Select the node.
		//
		this.select = function () {
			this._selected = true;
		};

		//
		// Deselect the node.
		//
		this.deselect = function () {
			this._selected = false;
		};

		//
		// Toggle the selection state of the node.
		//
		this.toggleSelected = function () {
			this._selected = !this._selected;
		};

		//
		// Returns true if the node is selected.
		//
		this.selected = function () {
			return this._selected;
		};
	};

	//
	// view model for output in subgraph
	// provide input connectors but title is still output
	flowchart.OutputPortViewModel = function (outputPortDataModel){
		this.data = outputPortDataModel;
		this.data.id = 'outputPort';
		for(var i = 0; i < this.data.inputConnectors.length; i++){
			this.data.inputConnectors[i].title = 'Input';
		}
		this.inputConnectors = createConnectorsViewModel(this.data.inputConnectors, 0, this);

		// Set to true when the node is selected.
		this._selected = false;

		//
		// X coordinate of the node.
		//
		this.x = function () {
			return this.data.x;
		};

		//
		// Y coordinate of the node.
		//
		this.y = function () {
			return this.data.y;
		};

		//
		// Width of the node.
		//
		this.width = function () {
			var numConnectors = this.inputConnectors.length;
			return flowchart.computeConnectorX(numConnectors)-5;
		};

		//
		// Height of the node.
		//
		this.height = function () {
			return flowchart.portHeight;
		};

		//
		// Select the node.
		//
		this.select = function () {
			this._selected = true;
		};

		//
		// Deselect the node.
		//
		this.deselect = function () {
			this._selected = false;
		};

		//
		// Toggle the selection state of the node.
		//
		this.toggleSelected = function () {
			this._selected = !this._selected;
		};

		//
		// Returns true if the node is selected.
		//
		this.selected = function () {
			return this._selected;
		};
	};

	//
	// wrap inputs data-model in view-model
	//
	var createInputPortViewModel = function (inputPortDataModel){
		if (inputPortDataModel) {
			var inputPortViewModel = new flowchart.InputPortViewModel(inputPortDataModel);
		}

		return inputPortViewModel;
	};

	//
	// wrap outputs data-model in view-model
	//
	var createOutputPortViewModel = function (outputPortDataModel){
		if (outputPortDataModel) {
			var outputPortViewModel = new flowchart.OutputPortViewModel(outputPortDataModel);
		}

		return outputPortViewModel;
	};

	//
	// View model for a connection.
	//
	flowchart.ConnectionViewModel = function (connectionDataModel, sourceConnector, destConnector) {

		//
		// @ mobius
		//

		// data attribute for transferring data from node to node through connections
		// fixme data in connection no longer in use

		this.data = connectionDataModel;
		this.source = sourceConnector;
		this.dest = destConnector;

		// Set to true when the connection is selected.
		this._selected = false;

		// @ mobius
		// return the source output value
		//this.value = function (){
		//    //return this.source.data.value
		//}

		this.sourceCoordX = function () {
			return this.source.parentNode().x() + this.source.x();
		};

		this.sourceCoordY = function () {
			return this.source.parentNode().y() + this.source.y();
		};

		this.sourceCoord = function () {
			return {
				x: this.sourceCoordX(),
				y: this.sourceCoordY()
			};
		};

		this.sourceTangentX = function () {
			return flowchart.computeConnectionSourceTangentX(this.sourceCoord(), this.destCoord());
		};

		this.sourceTangentY = function () {
			return flowchart.computeConnectionSourceTangentY(this.sourceCoord(), this.destCoord());
		};

		this.destCoordX = function () {
			return this.dest.parentNode().x() + this.dest.x();
		};

		this.destCoordY = function () {
			return this.dest.parentNode().y() + this.dest.y();
		};

		this.destCoord = function () {
			return {
				x: this.destCoordX(),
				y: this.destCoordY()
			};
		};

		this.destTangentX = function () {
			return flowchart.computeConnectionDestTangentX(this.sourceCoord(), this.destCoord());
		};

		this.destTangentY = function () {
			return flowchart.computeConnectionDestTangentY(this.sourceCoord(), this.destCoord());
		};

		//
		// Select the connection.
		//
		this.select = function () {
			this._selected = true;
		};

		//
		// Deselect the connection.
		//
		this.deselect = function () {
			this._selected = false;
		};

		//
		// Toggle the selection state of the connection.
		//
		this.toggleSelected = function () {
			this._selected = !this._selected;
		};

		//
		// Returns true if the connection is selected.
		//
		this.selected = function () {
			return this._selected;
		};
	};

	//
	// Helper function.
	//
	var computeConnectionTangentOffset = function (pt1, pt2) {

		return (pt2.y - pt1.y) / 2;
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionSourceTangentY = function (pt1, pt2) {

		return pt1.y + computeConnectionTangentOffset(pt1, pt2);
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionSourceTangentX = function (pt1, pt2) {

		return pt1.x;
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionSourceTangent = function(pt1, pt2) {
		return {
			x: flowchart.computeConnectionSourceTangentX(pt1, pt2),
			y: flowchart.computeConnectionSourceTangentY(pt1, pt2)
		};
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionDestTangentY = function (pt1, pt2) {

		return pt2.y - computeConnectionTangentOffset(pt1, pt2);
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionDestTangentX = function (pt1, pt2) {

		return pt2.x;
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionDestTangent = function(pt1, pt2) {
		return {
			x: flowchart.computeConnectionDestTangentX(pt1, pt2),
			y: flowchart.computeConnectionDestTangentY(pt1, pt2)
		};
	};

	//
	// View model for the chart.
	//
	flowchart.ChartViewModel = function (chartDataModel) {

		// @ mobius variable for topological sort
		var edgeList = [];

		// @ mobius new node position
		this.newPos = {x:1900,y:2100};

		// Reference to the underlying data.
		this.data = chartDataModel;

		// create a view-model for input ports
		if(this.data.inputPort ){
			this.inputPort = createInputPortViewModel(this.data.inputPort);
		}

		// create a view-model for output ports
		if(this.data.outputPort ){
			this.outputPort = createOutputPortViewModel(this.data.outputPort);
		}

		//
		// Find a specific node within the chart.
		//
		this.findNode = function (nodeID) {
			for (var i = 0; i < this.nodes.length; ++i) {
				var node = this.nodes[i];
				if (node.data.id === nodeID) {
					return node;
				}
			}

			// fixme how come this.inputPort got undefined > . <
			if(this.inputPort){
				if (this.inputPort.data.id === nodeID) {
					return this.inputPort;
				}
			}

			if(this.outputPort){
				if (this.outputPort.data.id === nodeID) {
					return this.outputPort;
				}
			}

			//throw new Error("Failed to find node " + nodeID);
		};

		//
		// Find a specific input connector within the chart.
		//
		this.findInputConnector = function (nodeID, connectorIndex,portConnectorID) {

			var node = this.findNode(nodeID);

			if(node){
				if(portConnectorID === undefined){
					if (!node.inputConnectors || node.inputConnectors.length <= connectorIndex) {
						throw new Error("Node " + nodeID + " has invalid input connectors.");
					}else{
						return node.inputConnectors[connectorIndex];
					}
				}else{
					if(portConnectorID === node.inputConnectors[connectorIndex].data.id){
						return node.inputConnectors[connectorIndex];
					}else{
						for(var i =0; i < node.inputConnectors.length;i++){
							if(node.inputConnectors[i].data.id === portConnectorID){
								return node.inputConnectors[i]
							}
						}
					}
				}
			}
		};

		//
		// Find a specific output connector within the chart.
		//
		this.findOutputConnector = function (nodeID, connectorIndex,portConnectorID) {

			var node = this.findNode(nodeID);

			if(node) {
				if (portConnectorID === undefined) {
					if (!node.outputConnectors || node.outputConnectors.length <= connectorIndex) {
						throw new Error("Node " + nodeID + " has invalid input connectors.");
					} else {
						return node.outputConnectors[connectorIndex];
					}
				} else {
					if (portConnectorID === node.outputConnectors[connectorIndex].data.id) {
						return node.outputConnectors[connectorIndex];
					} else {
						for (var i = 0; i < node.outputConnectors.length; i++) {
							if (node.outputConnectors[i].data.id === portConnectorID) {
								return node.outputConnectors[i]
							}
						}
					}
				}
			}
		};

		//
		// Wrap the connections data-model in a view-model.
		//
		this._createConnectionsViewModel = function (connectionsDataModel) {

			var connectionsViewModel = [];

			if (connectionsDataModel) {
				for (var i = 0; i < connectionsDataModel.length; ++i) {

					var sourceConnector = this.findOutputConnector(connectionsDataModel[i].source.nodeID, connectionsDataModel[i].source.connectorIndex,connectionsDataModel[i].source.portConnectorID);
					var destConnector = this.findInputConnector(connectionsDataModel[i].dest.nodeID, connectionsDataModel[i].dest.connectorIndex,connectionsDataModel[i].dest.portConnectorID);

					// if found source and dest connector add new view-model, else exclude connection-data-model
					if(sourceConnector && destConnector){
						connectionsViewModel.push(new flowchart.ConnectionViewModel(connectionsDataModel[i], sourceConnector, destConnector));
					}else{
						connectionsViewModel.splice(i, 1);
						connectionsDataModel.splice(i, 1);
					}
				}
			}

			return connectionsViewModel;
		};

		//
		// Create a view-model for nodes.
		//
		this.nodes = createNodesViewModel(this.data.nodes);

		//
		// Create a view-model for connections.
		//
		this.connections = this._createConnectionsViewModel(this.data.connections);

		//
		// Create a view model for a new connection.
		//
		this.createNewConnection = function (sourceConnector, destConnector) {

			debug.assertObjectValid(sourceConnector);
			debug.assertObjectValid(destConnector);

			// if connected from input connector to output connector, switch data model
			if(sourceConnector.data.title === 'Input' && destConnector.data.title === 'Output'){
				var temp = sourceConnector;
				sourceConnector = destConnector;
				destConnector = temp;
			}

			// @ mobius : flag for input connector is connected
			destConnector.data.connected = true;

			var connectionsDataModel = this.data.connections;
			if (!connectionsDataModel) {
				connectionsDataModel = this.data.connections = [];
			}

			var connectionsViewModel = this.connections;
			if (!connectionsViewModel) {
				connectionsViewModel = this.connections = [];
			}

			var sourceNode = sourceConnector.parentNode();
			var sourceConnectorIndex = sourceNode.outputConnectors.indexOf(sourceConnector);
			var sourceFlag = true;
			if (sourceConnectorIndex == -1) {
				sourceFlag = false;
				sourceConnectorIndex = sourceNode.inputConnectors.indexOf(sourceConnector);
				if (sourceConnectorIndex == -1) {
					throw new Error("Failed to find source connector within either inputConnectors or outputConnectors of source node.");
				}
			}
			// if source node is inputPort, the id of the connector in its parent's procedure/ parameter list need to be recorded
			// in case renaming / repositioning in its parent's procedure/ paramter list

			var destNode = destConnector.parentNode();
			var destConnectorIndex = destNode.inputConnectors.indexOf(destConnector);
			var destFlag = true;
			if (destConnectorIndex == -1) {
				destFlag = false;
				destConnectorIndex = destNode.outputConnectors.indexOf(destConnector);
				if (destConnectorIndex == -1) {
					throw new Error("Failed to find dest connector within inputConnectors or ouputConnectors of dest node.");
				}
			}

			// fixme pass in port connector hashkey when src/dest node is a port
			if(sourceNode.data.id === 'inputPort'){
				var sourcePortConnectorID = sourceConnector.data.id;
			}

			if(destNode.data.id === 'outputPort'){
				var destPortConnectorID = destConnector.data.id;
			}

			if (sourceFlag == true ){
				if(destFlag == true){
					var connectionDataModel = {
						// apply the output connector value to the connection
						//value: sourceConnector.data.value,
						source: {
							nodeID: sourceNode.data.id,
							connectorIndex: sourceConnectorIndex,
							portConnectorID:sourcePortConnectorID
						},
						dest: {
							nodeID: destNode.data.id,
							connectorIndex: destConnectorIndex,
							portConnectorID:destPortConnectorID
						}
					};

					connectionsDataModel.push(connectionDataModel);
					var connectionViewModel = new flowchart.ConnectionViewModel(connectionDataModel, sourceConnector, destConnector);
					connectionsViewModel.push(connectionViewModel);
				}
			}
			else if( destFlag == false) {
				var connectionDataModel = {
					// apply the output connector value to the connection
					//value: destConnector.data.value,
					source: {
						nodeID: destNode.data.id,
						connectorIndex: destConnectorIndex,
						portConnectorID:sourcePortConnectorID
					},
					dest: {
						nodeID: sourceNode.data.id,
						connectorIndex: sourceConnectorIndex,
						portConnectorID:destPortConnectorID
					}
				};

				connectionsDataModel.push(connectionDataModel);
				var connectionViewModel = new flowchart.ConnectionViewModel(connectionDataModel, destConnector, sourceConnector);
				connectionsViewModel.push(connectionViewModel);
			}

			//
			// @ mobius
			//
			// store and all the connection edges for topological sort
			edgeList = [];
			for(var i=0;i<this.data.connections.length;i++){
				edgeList.push([this.data.connections[i].source.nodeID, this.data.connections[i].dest.nodeID]);
			}
		};

		//
		// Add a node to the view model.
		//
		this.addNode = function (nodeDataModel) {
			if (!this.data.nodes) {
				this.data.nodes = [];
			}

			nodeDataModel.x = this.newPos.x;
			nodeDataModel.y = this.newPos.y;

			//
			// Update the data model.
			//
			this.data.nodes.push(nodeDataModel);

			//
			// Update the view model.
			//
			this.nodes.push(new flowchart.NodeViewModel(nodeDataModel));
		};

		//
		//	@ mobius
		//  topological sort: current setting: add/delete
		//
		this.topoSort = function topoSort (subgraph){
			//
			// @ mobius
			// Update the edgeList
			edgeList = [];

			for(var j=0;j<this.data.connections.length;j++){
				edgeList.push([this.data.connections[j].source.nodeID, this.data.connections[j].dest.nodeID]);
			}

			// copy the node and edge lists
			var edges = edgeList.slice();
			var nodes = [];

			if(subgraph && this.data.inputPort && this.data.inputPort.outputConnectors.length !== 0){
				nodes.push('inputPort');
			}

			if(subgraph && this.data.outputPort && this.data.outputPort.inputConnectors.length !== 0){
				nodes.push('outputPort');
			}

			for(var i = 0; i < this.nodes.length; i++){
				nodes.push(this.nodes[i].data.id);
			}

			// topological sort
			var cursor = nodes.length
				, sorted = new Array(cursor)
				, visited = {}
				, i = cursor;

			while (i--) {
				if (!visited[i]) visit(nodes[i], i, [])
			}

			return sorted;

			function visit(node, i, predecessors) {
				if(predecessors.indexOf(node) >= 0) {
					throw new Error('Error: Cyclic dependency')
				}

				if (visited[i]) return;
				visited[i] = true;

				// outgoing edges
				var outgoing = edges.filter(function(edge){
					return edge[0] === node
				});

				if (i = outgoing.length) {
					var preds = predecessors.concat(node);
					do {
						var child = outgoing[--i][1];
						visit(child, nodes.indexOf(child), preds)
					} while (i)
				}

				sorted[--cursor] = node
			}
		};

		//
		// Select all nodes and connections in the chart.
		//
		this.selectAll = function () {

			var nodes = this.nodes;
			for (var i = 0; i < nodes.length; ++i) {
				var node = nodes[i];
				node.select();
			}

			var connections = this.connections;
			for (var i = 0; i < connections.length; ++i) {
				var connection = connections[i];
				connection.select();
			}

			if(this.inputPort){
				this.inputPort.select();

				for(var j = 0; j < this.inputPort.outputConnectors.length; j ++){
					this.inputPort.outputConnectors[j].select();
				}
			}

			if(this.outputPort){
				this.outputPort.select();

				for(var j = 0; j < this.outputPort.inputConnectors.length; j ++){
					this.outputPort.inputConnectors[j].select();
				}
			}
		};

		//
		// @ mobius
		// Deselect all nodes connections, connectors in the chart.
		//
		this.deselectAll = function () {
			var nodes = this.nodes;
			for (var i = 0; i < nodes.length; ++i) {
				var node = nodes[i];
				node.deselect();

				for(var j = 0; j < node.inputConnectors.length; j ++){
					var input = node.inputConnectors[j];
					input.deselect();
				}

				for(var k = 0; k < node.outputConnectors.length; k++){
					var output = node.outputConnectors[k];
					output.deselect();
				}
			}

			if(this.inputPort){
				this.inputPort.deselect();
				for(var j = 0; j < this.inputPort.outputConnectors.length; j ++){
					this.inputPort.outputConnectors[j].deselect();
				}
			}

			if(this.outputPort){
				this.outputPort.deselect();
				for(var j = 0; j < this.outputPort.inputConnectors.length; j ++){
					this.outputPort.inputConnectors[j].deselect();
				}
			}

			var connections = this.connections;
			for (var i = 0; i < connections.length; ++i) {
				var connection = connections[i];
				connection.deselect();
			}
		};

		//
		// Update the location of the node and its connectors.
		//
		this.updateSelectedNodesLocation = function (deltaX, deltaY,isPort) {

			if(!isPort){
				var selectedNodes = this.getSelectedNodes();

				for (var i = 0; i < selectedNodes.length; ++i) {
					var node = selectedNodes[i];
					node.data.x += deltaX;
					node.data.y += deltaY;

					if(node.data.x < 0){
						node.data.x = 0;
					}

					if(node.data.y < 0){
						node.data.y = 0;
					}
				}
			}else{
				// update position for input/output port
				if(this.inputPort.selected()){
					this.inputPort.data.x += deltaX;
					this.inputPort.data.y += deltaY;
					if(this.inputPort.data.x < 0){
						this.inputPort.data.x = 0;
					}
					if(this.inputPort.data.y <0 ){
						this.inputPort.data.y = 0;
					}
				}
				if(this.outputPort.selected()){
					this.outputPort.data.x += deltaX;
					this.outputPort.data.y += deltaY;

					if(this.outputPort.data.x < 0){
						this.outputPort.data.x = 0;
					}
					if(this.outputPort.data.y <0 ){
						this.outputPort.data.y = 0;
					}
				}
			}
		};

		//
		// Handle mouse click on a particular node.
		//
		this.handleNodeLeftClicked = function (node, ctrlKey) {

			if (ctrlKey) {
				node.toggleSelected();
			}
			else {
				this.deselectAll();
				node.select();
			}

			var nodeIndex = this.nodes.indexOf(node);
			return nodeIndex;
		};

		//
		// @ mobius handle right click, prevent deselection
		//
		this.handleNodeRightClicked = function (node, ctrlKey) {
			if (ctrlKey) {
				node.toggleSelected();
			}
			else {
				node.select();
			}

			var nodeIndex = this.nodes.indexOf(node);
			return nodeIndex;
		};

		//
		// @ mobius : Handle mouse drag on a particular node/ prevent deselection
		//
		this.handleNodeDragged = function (node, ctrlKey) {
			if (ctrlKey) {
				node.toggleSelected();
			}
			else {
				node.select();
			}

			var nodeIndex = this.nodes.indexOf(node);
			return nodeIndex;
		};

		//
		// Handle mouse down on a connection.
		//
		this.handleConnectionMouseDown = function (connection, ctrlKey) {
			if (ctrlKey) {
				connection.toggleSelected();
			}
			else {
				this.deselectAll();
				connection.select();
			}
		};

		//
		// @ mobius
		// Handle mouse down on a connector
		//
		this.handleConnectorClicked = function (connector, ctrlKey) {
			if (ctrlKey) {
				connector.toggleSelected();
			}
			else {

				this.deselectAll();
				connector.select();
			}
		};

		//
		// @mobius rename selected element (node/connector)
		//
		this.renameSelected = function(newName){
			for (var nodeIndex = 0; nodeIndex < this.nodes.length; ++nodeIndex) {

				var node = this.nodes[nodeIndex];

				// let graph know what is changing so it can update accordingly
				var renameObj = {
					isConnector:false,
					nodeIndex:''
				};

				// update selected node name
				if (this.nodes[nodeIndex].selected()) {
					this.data.nodes[nodeIndex].name = newName;
					this.nodes[nodeIndex].data = this.data.nodes[nodeIndex];
					return renameObj;
				}

				// update selected input connector name
				for(var inputIndex = 0; inputIndex < node.inputConnectors.length; inputIndex ++){
					if (node.inputConnectors[inputIndex].selected()) {
						renameObj.isConnector = true;
						renameObj.nodeIndex = nodeIndex;
						this.data.nodes[nodeIndex].inputConnectors[inputIndex].name = newName;
						this.nodes[nodeIndex].data = this.data.nodes[nodeIndex];
						return renameObj;
					}
				}

				// update selected output connector name
				for(var outputIndex = 0; outputIndex < node.outputConnectors.length; outputIndex ++){
					if (node.outputConnectors[outputIndex].selected()) {
						renameObj.isConnector = true;
						renameObj.nodeIndex = nodeIndex;
						this.data.nodes[nodeIndex].outputConnectors[outputIndex].name = newName;
						this.nodes[nodeIndex].data = this.data.nodes[nodeIndex];
						return renameObj;
					}
				}
			}
		};

		//
		// Delete all nodes and connections that are selected.
		//
		this.deleteSelected = function () {

			var newNodeViewModels = [];
			var newNodeDataModels = [];

			var deletedNodeIds = [];
			var returnIndex;

			var deletedInputConnectors = [];
			var deletedOutputConnectors = [];

			//
			// remove node that are selected, retain deleted node id for connections
			// @ mobius Remove connectors that are selected, retain deleted connector id for connections
			//

			for (var nodeIndex = 0; nodeIndex < this.nodes.length; ++nodeIndex) {

				var node = this.nodes[nodeIndex];

				var newInputConnectorDataModels = [];
				var newOutputConnectorDataModels = [];

				var newInputConnectorViewModels = [];
				var newOutputConnectorViewModels = [];

				// node deletion
				if (!node.selected()) {
					newNodeViewModels.push(node);
					newNodeDataModels.push(node.data);
				}
				else {
					deletedNodeIds.push(node.data.id);
				}

				// connector deletion
				for(var inputIndex = 0; inputIndex < node.inputConnectors.length; inputIndex ++){

					var inputConnector = node.inputConnectors[inputIndex];

					if (!inputConnector.selected()) {
						newInputConnectorDataModels.push(inputConnector.data);
						newInputConnectorViewModels.push(inputConnector);
					}

					else{
						returnIndex = nodeIndex;
						deletedInputConnectors.push({
							nodeId:node.data.id,
							inputConnectorIndex:node.inputConnectors.indexOf(inputConnector)
						});
					}
				}

				for(var outputIndex = 0; outputIndex < node.outputConnectors.length; outputIndex ++){

					var outputConnector = node.outputConnectors[outputIndex];

					if (!outputConnector.selected()) {
						newOutputConnectorDataModels.push(outputConnector.data);
						newOutputConnectorViewModels.push(outputConnector);
					}

					else{
						returnIndex = nodeIndex;

						deletedOutputConnectors.push({
							nodeId:node.data.id,
							outputConnectorIndex:node.outputConnectors.indexOf(outputConnector)
						});
					}
				}

				// empty the original connector data and view model
				node.data.inputConnectors = [];
				node.data.outputConnectors = [];
				node.inputConnectors = [];
				node.outputConnectors = [];


				// generate connector view model using new connector data model
				for(var newInputIndex = 0; newInputIndex < newInputConnectorDataModels.length; newInputIndex++){
					node.addInputConnector(newInputConnectorDataModels[newInputIndex]);
				}

				for(var newOutputIndex = 0; newOutputIndex < newOutputConnectorDataModels.length; newOutputIndex++){
					node.addOutputConnector(newOutputConnectorDataModels[newOutputIndex]);
				}
			}

			//
			// Remove connections that are selected.
			// Also remove connections for nodes that have been deleted.
			//

			var newConnectionViewModels = [];
			var newConnectionDataModels = [];

			// fixme subgraph connection deletion fix
			for (var connectionIndex = 0; connectionIndex < this.connections.length; ++connectionIndex) {

				var connection = this.connections[connectionIndex];

				if (// connection is not selected
				!connection.selected() &&
					// connected node is not deleted
				deletedNodeIds.indexOf(connection.data.source.nodeID) === -1 &&
				deletedNodeIds.indexOf(connection.data.dest.nodeID) === -1
				){
					// The nodes this connection is attached to, where not deleted,
					// so keep the connection for now then check the connectors

					var flag = true;

					for(var i = 0; i < deletedInputConnectors.length; i ++){
						if(deletedInputConnectors[i].nodeId === connection.data.dest.nodeID &&
							deletedInputConnectors[i].inputConnectorIndex === connection.data.dest.connectorIndex){
							flag = false;
						}
					}

					for(var j = 0; j < deletedOutputConnectors.length; j++){
						if(deletedOutputConnectors[j].nodeId === connection.data.source.nodeID &&
							deletedOutputConnectors[j].outputConnectorIndex === connection.data.source.connectorIndex){
							flag = false;
							// connection will be deleted, so reset the current connected input connector
							this.findInputConnector(connection.data.dest.nodeID,connection.data.dest.connectorIndex)
								.data.connected=false;
						}
					}

					if(flag){
						newConnectionViewModels.push(connection);
						newConnectionDataModels.push(connection.data);
					}
				}else{
					// set the connected of dest connector of deleted connection to false

					if(	this.findInputConnector(connection.data.dest.nodeID,connection.data.dest.connectorIndex)){
						this.findInputConnector(connection.data.dest.nodeID,connection.data.dest.connectorIndex)
							.data.connected=false;
					}

				}
			}

			// Update nodes
			this.nodes = newNodeViewModels;
			this.data.nodes = newNodeDataModels;

			// update connections
			this.connections = newConnectionViewModels;
			this.data.connections = newConnectionDataModels;

			//
			// @ mobius update the connection id for connectors
			//

			for(var i = 0; i < this.connections.length; i++){

				for(var j = 0; j < deletedInputConnectors.length ; j++){
					var destDecreaseIn = 0;

					if(this.connections[i].data.dest.nodeID === deletedInputConnectors[j].nodeId){
						if(this.connections[i].data.dest.connectorIndex > deletedInputConnectors[j].inputConnectorIndex){
							destDecreaseIn ++;
						}
					}

					this.connections[i].data.dest.connectorIndex -= destDecreaseIn;
					this.connections[i].dest = this.findInputConnector(this.connections[i].data.dest.nodeID,
						this.connections[i].data.dest.connectorIndex);
				}

				for(var j = 0; j < deletedOutputConnectors.length ; j++){
					var sourceDecreaseIn = 0;

					if(this.connections[i].data.source.nodeID === deletedOutputConnectors[j].nodeId){
						if(this.connections[i].data.source.connectorIndex > deletedOutputConnectors[j].outputConnectorIndex){
							sourceDecreaseIn ++;
						}
					}

					this.connections[i].data.source.connectorIndex -= sourceDecreaseIn;
					this.connections[i].source = this.findOutputConnector(this.connections[i].data.source.nodeID,
						this.connections[i].data.source.connectorIndex);
				}
			}

			// Update the node index
			for(var i = 0; i < this.nodes.length ;i++){

				var decreaseIn = 0;

				for(j = 0; j <deletedNodeIds.length; j++){
					if(this.nodes[i].data.id > deletedNodeIds[j]){
						decreaseIn ++;
					}
				}

				this.nodes[i].data.id = this.nodes[i].data.id - decreaseIn;
			}

			//
			// @ mobius update the connection id for nodes
			//

			for(var i = 0; i < this.connections.length; i++){

				var sourceDecreaseIn = 0;

				for(j = 0; j <deletedNodeIds.length; j++){
					if(this.connections[i].data.source.nodeID > deletedNodeIds[j]){
						sourceDecreaseIn ++;
					}
				}

				if(this.connections[i].data.source.nodeID !== 'inputPort' && this.connections[i].data.source.nodeID !== 'outputPort'){
					this.connections[i].data.source.nodeID = this.connections[i].data.source.nodeID - sourceDecreaseIn;
				}

				var destDecreaseIn = 0;

				for(var k = 0; k < deletedNodeIds.length; k++ ){
					if(this.connections[i].data.dest.nodeID > deletedNodeIds[0]){
						destDecreaseIn ++;
					}
				}

				if(this.connections[i].data.dest.nodeID !== 'inputPort' && this.connections[i].data.dest.nodeID !== 'outputPort'){
					this.connections[i].data.dest.nodeID = this.connections[i].data.dest.nodeID - destDecreaseIn;
				}
			}

			//
			// @ mobius
			//
			// update edgeList for topological sort
			edgeList = [];
			for(var j=0;j<this.data.connections.length;j++){
				edgeList.push([this.data.connections[j].source.nodeID, this.data.connections[j].dest.nodeID]);
			}

			return {
				deletedNodeIds:deletedNodeIds,
				nodeIndex:returnIndex
			};
		};

		//
		// Select nodes and connections that fall within the selection rect.
		//
		this.applySelectionRect = function (selectionRect) {

			this.deselectAll();
			var index = undefined;

			for (var i = 0; i < this.nodes.length; ++i) {
				var node = this.nodes[i];
				if (node.x() >= selectionRect.x &&
					node.y() >= selectionRect.y &&
					node.x() + node.width() <= selectionRect.x + selectionRect.width &&
					node.y() + node.height() <= selectionRect.y + selectionRect.height)
				{
					// Select nodes that are within the selection rect.
					node.select();
					index = node.data.id;
				}

				// @ mobius select connectors within the selection rect.
				for(var inputIndex = 0; inputIndex < node.inputConnectors.length; inputIndex++){

					var inputConnector = node.inputConnectors[inputIndex];

					if (node.x() + inputConnector.x() >= selectionRect.x &&
						node.y() + inputConnector.y() >= selectionRect.y &&
						node.x() + inputConnector.x() + 8 <= selectionRect.x + selectionRect.width &&
						node.y() +inputConnector.y() + 8 <= selectionRect.y + selectionRect.height){
						inputConnector.select();
					}
				}

				for(var outputIndex = 0; outputIndex < node.outputConnectors.length; outputIndex++){
					var outputConnector = node.outputConnectors[outputIndex];

					if (node.x() + outputConnector.x() >= selectionRect.x &&
						node.y() + outputConnector.y() >= selectionRect.y &&
						node.x() + outputConnector.x() + 8 <= selectionRect.x + selectionRect.width &&
						node.y() +outputConnector.y() + 8 <= selectionRect.y + selectionRect.height){
						outputConnector.select();
					}
				}

			}

			for (var i = 0; i < this.connections.length; ++i) {
				var connection = this.connections[i];
				if (connection.source.parentNode().selected() &&
					connection.dest.parentNode().selected())
				{
					// Select the connection if both its parent nodes are selected.
					connection.select();
				}
			}

			if(this.inputPort && this.outputPort){
				if (this.inputPort.x() >= selectionRect.x &&
					this.inputPort.y() >= selectionRect.y &&
					this.inputPort.x() + this.inputPort.width() <= selectionRect.x + selectionRect.width &&
					this.inputPort.y() + this.inputPort.height() <= selectionRect.y + selectionRect.height)
				{
					this.inputPort.select();
				}

				if (this.outputPort.x() >= selectionRect.x &&
					this.outputPort.y() >= selectionRect.y &&
					this.outputPort.x() + this.outputPort.width() <= selectionRect.x + selectionRect.width &&
					this.outputPort.y() + this.outputPort.height() <= selectionRect.y + selectionRect.height)
				{
					this.outputPort.select();
				}
			}


			return index;
		};

		//
		// Get the array of nodes that are currently selected.
		//
		this.getSelectedNodes = function () {
			var selectedNodes = [];

			for (var i = 0; i < this.nodes.length; ++i) {
				var node = this.nodes[i];
				if (node.selected()) {
					selectedNodes.push(node);
				}
			}

			return selectedNodes;
		};

		//
		// Get the array of connections that are currently selected.
		// fixme refactor
		this.getSelectedConnections = function () {
			var selectedConnections = [];

			for (var i = 0; i < this.connections.length; ++i) {
				var connection = this.connections[i];
				if (connection.selected()) {
					selectedConnections.push(connection);
				}
			}

			return selectedConnections;
		};

		//
		// @ mobius get the array of input connectors that currently selected.
		// fixme refactor
		this.getSelectedInputConnectors = function () {
			var selectedInputConnector = [];

			for (var i = 0; i < this.nodes.length; ++i) {
				var node = this.nodes[i];

				for(var inputIndex = 0; inputIndex < node.inputConnectors.length; inputIndex ++){
					if(node.inputConnectors[inputIndex].selected()){
						selectedInputConnector.push(node.inputConnectors[inputIndex]);
					}
				}
			}

			return selectedInputConnector;
		};

		//
		// @ mobius get the array of output connectors that currently selected.
		// fixme refactor
		this.getSelectedOutputConnectors = function () {
			var selectedOutputConnector = [];

			for (var i = 0; i < this.nodes.length; ++i) {
				var node = this.nodes[i];

				for(var outputIndex = 0; outputIndex < node.outputConnectors.length; outputIndex ++){
					if(node.outputConnectors[outputIndex].selected()){
						selectedOutputConnector.push(node.outputConnectors[outputIndex]);
					}
				}
			}

			return selectedOutputConnector;
		};

		this.calculateExtendView = function(){
			var view = {}, sumX = 0, sumY = 0, xList = [], yList = [],length = this.nodes.length;

			for(var i = 0; i < length;i++){
				xList.push(this.nodes[i].data.x);
				yList.push(this.nodes[i].data.y);

				sumX += this.nodes[i].data.x;
				sumY += this.nodes[i].data.y;
			}

			if(this.inputPort){
				sumX += this.inputPort.data.x;
				sumY += this.inputPort.data.y;
				xList.push(this.inputPort.data.x);
				yList.push(this.inputPort.data.y);
				length ++;
			}

			if(this.outputPort){
				//sumX += this.outputPort.data.x;
				//sumY += this.outputPort.data.y;
				xList.push(this.outputPort.data.x);
				yList.push(this.outputPort.data.y);
				//length ++;
			}

			var minX = Math.min.apply(Math, xList);
			var maxX = Math.max.apply(Math, xList);
			var minY = Math.min.apply(Math, yList);
			var maxY = Math.max.apply(Math, yList);

			//view.x = sumX / length;
			//view.y = sumY / length;

			view.x = minX;
			view.y = minY;

			view.width = (maxX - minX)*1.25 + 50;
			view.height = (maxY - minY)*1.25 + 50;

			view.width <100 ? view.width = 100 : view.width = view.width;
			view.height <100 ? view.height = 100 : view.height = view.height;

			return view;
		};
	};

})

();