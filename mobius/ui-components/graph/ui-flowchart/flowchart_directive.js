//
// Flowchart module.
//
angular.module('flowChart', ['dragging'] )

//
// Directive that generates the rendered chart from the data model.
//
.directive('flowChart', function() {
  return {
  	restrict: 'E',
  	templateUrl: "mobius/ui-components/graph/ui-flowchart/flowchart_template.html",
  	replace: true,
  	scope: {
  		chart: "=chart",
		readonly:'='
  	},

  	//
  	// Controller for the flowchart directive.
  	// Having a separate controller is better for unit testing, otherwise
  	// it is painful to unit test a directive without instantiating the DOM
  	// (which is possible, just not ideal).
  	//
  	controller: 'FlowChartController'
  };
})


//
// Controller for the flowchart directive.
//
.controller('FlowChartController', ['$scope', 'dragging', '$element','$rootScope','$timeout',
	function FlowChartController ($scope, dragging, $element,$rootScope,$timeout) {
		var controller = this;

		//
		// Reference to the document and jQuery, can be overridden for testing.
		//
		this.document = document;

		//
		// Wrap jQuery so it can easily be  mocked for testing.
		//
		this.jQuery = function (element) {
			return $(element);
		};

		//
		// Init data-model variables.
		//
		$scope.draggingConnection = false;
		$scope.connectorSize = 4;
		$scope.dragSelecting = false;

		//
		// @ mobius: fetching zoom scale factor for the controling the size of 'double click menu'
		//
		$rootScope.$on("Update", function(event, message) {
			$scope.scaleFactor = message;
			//
			// @ mobius scale the new node dropxdown
			// fixme

			// todo shall hide dropdown when zoom?
			// document.getElementById("node-creator").style.transform
			// 	= 'scale(' + 1/$scope.scaleFactor+','+ 1/$scope.scaleFactor +')';
		});

		/* Can use this to test the drag selection rect.
		$scope.dragSelectionRect = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
		};
		*/

		//
		// @mobius test for double click menu
		//
		$scope.dbClickMenu = {
			x:0,
			y:0,
			width:0,
			height:0
		};

		//
		// @mobius clean dropdown menu after node added or cancelled
		//
		$scope.$on('cleanGraph',function(){
			document.getElementById("test").style.display = "none";
			// document.getElementById("node-creator").style.display = "none";
			console.log(" Iniside clean graph function");
		});

		//
		// Reference to the connection, connector or node that the mouse is currently over.
		//
		$scope.mouseOverConnector = null;
		$scope.mouseOverConnection = null;
		$scope.mouseOverNode = null;

		//
		// The class for connections and connectors.
		//
		this.connectionClass = 'connection';
		this.connectorClass = 'connector';
		this.nodeClass = 'node';

		//
		// Search up the HTML element tree for an element the requested class.
		//
		this.searchUp = function (element, parentClass) {

			//
			// Reached the root.
			//
			if (element == null || element.length == 0) {
				return null;
			}

			//
			// Check if the element has the class that identifies it as a connector.
			//
			if (hasClassSVG(element, parentClass)) {
				//
				// Found the connector element.
				//
				return element;
			}

			//
			// Recursively search parent elements.
			//
			return this.searchUp(element.parent(), parentClass);
		};

		//
		// Hit test and retreive node and connector that was hit at the specified coordinates.
		//
		this.hitTest = function (clientX, clientY) {

			//
			// Retreive the element the mouse is currently over.
			//
			return this.document.elementFromPoint(clientX, clientY);
		};

		//
		// Hit test and retreive node and connector that was hit at the specified coordinates.
		//
		this.checkForHit = function (mouseOverElement, whichClass) {

			//
			// Find the parent element, if any, that is a connector.
			//
			var hoverElement = this.searchUp(this.jQuery(mouseOverElement), whichClass);
			if (!hoverElement) {
				return null;
			}

			return hoverElement.scope();
		};

		//
		// Translate the coordinates so they are relative to the svg element.
		//
		this.translateCoordinates = function(x, y) {
			var svg_elem =  $element.get(0);
			var matrix = svg_elem.getScreenCTM();
			var point = svg_elem.createSVGPoint();
			point.x = x;
			point.y = y;
			return point.matrixTransform(matrix.inverse());
		};

		//
		// @ mobius: double click to toggle dropdown for new node
		//
		$scope.doubleClick = function(evt){


			// todo: make sure double click not on node/connection

			// update zoom factor
			if($scope.readonly !== true){
				$rootScope.$on("Update", function(event, message) {
					$scope.scaleFactor = message;
				});


				// update dropdown location
				var dBclickPoint = controller.translateCoordinates(evt.clientX, evt.clientY);


				$scope.dbClickMenu.x = dBclickPoint.x * (1/$scope.scaleFactor) 	- (90-90/$scope.scaleFactor);
				$scope.dbClickMenu.y = dBclickPoint.y *(1/$scope.scaleFactor );

				// Broadcasting the co-ordinates of the node type drop down menu

				$rootScope.$broadcast('doubleClickCordinatesOnSVG',[evt.clientX,evt.clientY]);

				//document.getElementById("node-creator").style.display = "inline-block";



				// node location
				$scope.chart.newPos.x = dBclickPoint.x * (1/$scope.scaleFactor);
				$scope.chart.newPos.y = $scope.dbClickMenu.y;

				// enable dropdown
				var ele = document.getElementById("node-dropdown");

				setTimeout(function(){
					angular.element(ele).find('input').click();
					$(ele).find('input').click();
					// $('#node-dropdown').find('input').click();
					$('#test-dropdown').find('input').click();

				},0);

				$scope.$broadcast('SetFocus');

			}
		};

		//
		// @mobius scale factor, Called on mouse down in the chart.
		//
		$scope.primarySelectedIndex = undefined;

		$scope.mouseDown = function (evt) {
			if($scope.readonly !== true) {
				if (evt.which == 1) {
					// $scope.chart.deselectAll();

					//
					// @ mobius toggle new node dropdown
					//

					var mouseOverElement = controller.hitTest(evt.clientX, evt.clientY);

					if (mouseOverElement instanceof SVGElement) {
						// document.getElementById("node-creator").style.display = "none";
						document.getElementById("test").style.display = "none";
						/*setTimeout(function () {
							$scope.$emit("nodeIndex", undefined);
						}, 0);*/
					}

					dragging.startDrag(evt, {
						//
						// Commence dragging... setup variables to display the drag selection rect.
						//
						dragStarted: function (x, y) {
							$scope.primarySelectedIndex = undefined;

							// msg from pan and zoom
							$rootScope.$on("Update", function (event, message) {
								$scope.scaleFactor = message;
							});

							$scope.dragSelecting = true;
							var startPoint = controller.translateCoordinates(x, y, evt);
							$scope.dragSelectionStartPoint = startPoint;
							$scope.dragSelectionRect = {
								x: startPoint.x * (1 / $scope.scaleFactor ),
								y: startPoint.y * (1 / $scope.scaleFactor ),
								width: 0,
								height: 0
							};
						},

						//
						// Update the drag selection rect while dragging continues.
						//
						dragging: function (x, y) {
							var startPoint = $scope.dragSelectionStartPoint;
							var curPoint = controller.translateCoordinates(x, y, evt);

							$scope.dragSelectionRect = {
								x: curPoint.x > startPoint.x ? startPoint.x * (1 / $scope.scaleFactor ) : curPoint.x * (1 / $scope.scaleFactor ),
								y: curPoint.y > startPoint.y ? startPoint.y * (1 / $scope.scaleFactor ) : curPoint.y * (1 / $scope.scaleFactor ),
								width: curPoint.x > startPoint.x ? curPoint.x * (1 / $scope.scaleFactor ) - startPoint.x * (1 / $scope.scaleFactor ) : startPoint.x - curPoint.x,
								height: curPoint.y > startPoint.y ? curPoint.y * (1 / $scope.scaleFactor ) - startPoint.y * (1 / $scope.scaleFactor ) : startPoint.y * (1 / $scope.scaleFactor ) - curPoint.y * (1 / $scope.scaleFactor ),
							};
						},

						//
						// Dragging has ended... select all that are within the drag selection rect.
						//
						dragEnded: function () {
							$scope.dragSelecting = false;
							var index = $scope.chart.applySelectionRect($scope.dragSelectionRect);
							$scope.$emit("nodeIndex", index);

							$scope.primarySelectedIndex = index;
							delete $scope.dragSelectionStartPoint;
							delete $scope.dragSelectionRect;
						},
					});
				}
			}
		};

		//
		// @mobius scale factor	Called for each mouse move on the svg element.
		//
		$scope.mouseMove = function (evt) {
			if($scope.readonly !== true) {
				//
				// Clear out all cached mouse over elements.
				//
				$scope.mouseOverConnection = null;
				$scope.mouseOverConnector = null;
				$scope.mouseOverNode = null;


				var mouseOverElement = controller.hitTest(evt.clientX, evt.clientY);
				if (mouseOverElement == null) {
					// Mouse isn't over anything, just clear all.
					return;
				}

				if (!$scope.draggingConnection) { // Only allow 'connection mouse over' when not dragging out a connection.

					// Figure out if the mouse is over a connection.
					var scope = controller.checkForHit(mouseOverElement, controller.connectionClass);
					$scope.mouseOverConnection = (scope && scope.connection) ? scope.connection : null;
					if ($scope.mouseOverConnection) {
						// Don't attempt to mouse over anything else.
						return;
					}
				}

				// Figure out if the mouse is over a connector.
				var scope = controller.checkForHit(mouseOverElement, controller.connectorClass);
				$scope.mouseOverConnector = (scope && scope.connector) ? scope.connector : null;
				if ($scope.mouseOverConnector) {
					// Don't attempt to mouse over anything else.
					return;
				}

				// Figure out if the mouse is over a node.
				var scope = controller.checkForHit(mouseOverElement, controller.nodeClass);
				$scope.mouseOverNode = (scope && scope.node) ? scope.node : null;
				if ($scope.mouseOverName) {
					// Don't attempt to mouse over anything else.
					return;
				}
			}
		};

		//
		// Handle mousedown on a node / port
		//
		$scope.nodeMouseDown = function (evt, node, isPort) {
			if($scope.readonly !== true) {
				//
				// @ mobius toggle new node dropdown
				//
				// document.getElementById("node-creator").style.display = "none";
				document.getElementById("test").style.display = "none";

				var chart = $scope.chart;
				var lastMouseCoords;

                if (!node.selected()) {
                    chart.deselectAll();
                    node.select();
                }

				dragging.startDrag(evt, {
					//
					// Node dragging has commenced.
					//
					dragStarted: function (x, y) {
						lastMouseCoords = controller.translateCoordinates(x, y);

                        if (!isPort) {
                            // @mobius dragging is considered as clicked (selected)
                            var nodeIndex = chart.handleNodeDragged(node, evt.ctrlKey);
                            $scope.$emit("nodeIndex", nodeIndex);
                        }else{
                            $scope.$emit("nodeIndex", 'port');
                        }
					},

					//
					// Dragging selected nodes... update their x,y coordinates.
					//
					dragging: function (x, y) {
						var curCoords = controller.translateCoordinates(x, y);
						$rootScope.$on("Update", function (event, message) {
							$scope.scaleFactor = message;
						});
						var deltaX = curCoords.x * (1 / $scope.scaleFactor ) - lastMouseCoords.x * (1 / $scope.scaleFactor);
						var deltaY = curCoords.y * (1 / $scope.scaleFactor) - lastMouseCoords.y * (1 / $scope.scaleFactor);
						chart.updateSelectedNodesLocation(deltaX, deltaY, isPort);

						lastMouseCoords = curCoords;
					},

					//
					// The node wasn't dragged... it was clicked.
					//
					clicked: function () {

						// @mobius let controller know the current node
						if (evt.which === 1) {
							var nodeIndex = chart.handleNodeLeftClicked(node, evt.ctrlKey);
						}

						if (evt.which === 3) {
							var nodeIndex = chart.handleNodeRightClicked(node, evt.ctrlKey);
						}

						if (!isPort) {
							$scope.$emit("nodeIndex", nodeIndex);
						}else{
							$scope.$emit("nodeIndex", 'port');
						}
					}

				});
			}
		};

		//
		// Handle double click on a node
		//
		$scope.nodeDoubleClick = function(evt){
			if($scope.readonly !== true) {
				// document.getElementById("node-creator").style.display = "none";
				document.getElementById("test").style.display = "none";
				$scope.$emit("node-dbClick");
			}
		};

		//
		// Handle mousedown on a connection.
		//
		$scope.connectionMouseDown = function (evt, connection) {
			if($scope.readonly !== true) {
				//
				// @ mobius toggle new node dropdown
				// fixme control
				// document.getElementById("node-creator").style.display = "none";
				document.getElementById("test").style.display = "none";

				var chart = $scope.chart;
				chart.handleConnectionMouseDown(connection, evt.ctrlKey);

				// Don't let the chart handle the mouse down.
				evt.stopPropagation();
				evt.preventDefault();
			}
		};


		//
		// @ mobius scale factor Handle mousedown on an input connector.
		//
		$scope.connectorMouseDown = function (evt, node, connector, connectorIndex, isInputConnector, isPort) {
			//
			// @ mobius toggle new node dropdown
			// fixme control
			if($scope.readonly !== true) {
				// document.getElementById("node-creator").style.display = "none";
				document.getElementById("test").style.display = "none";

				//
				// Initiate dragging out of a connection.
				//
				dragging.startDrag(evt, {

					//
					// Called when the mouse has moved greater than the threshold distance
					// and dragging has commenced.
					//

					dragStarted: function (x, y) {

						var curCoords = controller.translateCoordinates(x, y);

						$rootScope.$on("Update", function (event, message) {
							$scope.scaleFactor = message;
						});

						$scope.draggingConnection = true;
						$scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector, isPort);
						$scope.dragPoint2 = {
							x: curCoords.x * (1 / $scope.scaleFactor ),
							y: curCoords.y * (1 / $scope.scaleFactor )
						};
						$scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
						$scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
					},

					//
					// Called on mousemove while dragging out a connection.
					//
					dragging: function (x, y) {
						var startCoords = controller.translateCoordinates(x, y);

						//
						// @ mobius communicate with pan&zoom controller to correct scale
						//
						$rootScope.$on("Update", function (event, message) {
							$scope.scaleFactor = message;
						});

						$scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector, isPort);
						$scope.dragPoint2 = {
							x: startCoords.x * (1 / $scope.scaleFactor ),
							y: startCoords.y * (1 / $scope.scaleFactor )
						};
						$scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
						$scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
					},

					//
					// Clean up when dragging has finished.
					//
					dragEnded: function () {

						if ($scope.mouseOverConnector &&
							$scope.mouseOverConnector !== connector) {

							//
							// Dragging has ended...
							// The mouse is over a valid connector...
							// Create a new connection.
							//
							$scope.chart.createNewConnection(connector, $scope.mouseOverConnector);

							// when new connection create, emit for the update in vidamo.js
							// fixme where does it go?
							$scope.$emit("newEdge", connector.parentNode());
						}

						$scope.draggingConnection = false;
						delete $scope.dragPoint1;
						delete $scope.dragTangent1;
						delete $scope.dragPoint2;
						delete $scope.dragTangent2;
					},

					//
					// The connector wasn't dragged... it was clicked.
					//
					// @ vidamo add click event to connectors
					clicked: function () {
						var chart = $scope.chart;
						chart.handleConnectorClicked(connector, evt.ctrlKey);

						// don't let the chart handle the mouse down click
						evt.stopPropagation();
						evt.preventDefault();
					}
				});
			}
		};

		// context menu positioning
		$scope.onshow = function(event) {
			if ($scope.readonly !== true) {
				var width = window.innerWidth,
					height = window.innerHeight;

				document.getElementById('menu-node').className = ' position-fixed';

				if (event.clientY > height - 300) {
					document.getElementById('menu-node').className += ' menu-up';
				}

				if (event.clientX > width - 120) {
					document.getElementById('menu-node').className += ' menu-left';
				}

				if (event.clientX > width - 200) {
					document.getElementById('menu-node').className += ' submenu-left';
				}
			}
		}



	}
]);
