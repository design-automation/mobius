//
// mobius viewport controller for viewport directive
// This functions of viewport directive will be invoked through mobius module
//

mobius.controller('viewportCtrl',[
    '$scope','$rootScope',
    function($scope,$rootScope) {

        $scope.topoViewportControl = {};

        $scope.viewportControl = {
            "geometryData":{},
        };

        $scope.geometryData = [];

        $scope.tableHeader = [];
        $scope.connectorNames = [];

        for(var topo in MOBIUS.TOPOLOGY_DEF) {
            $scope.tableHeader.push(topo);
        }
        $scope.tableHeader.push('object');
        $scope.currentHeader = $scope.tableHeader[0];

        $rootScope.$on('Update Datatable', function(){
            generateTableStructure();
            $scope.generateDataTable( $scope.currentHeader)
        });

        function generateTableStructure(){
            $scope.connectorNames = [];
            console.log('output data:', $scope.viewportControl.geometryData)
            if($scope.viewportControl.geometryData.length !== 0){
                for(var connectorName in $scope.viewportControl.geometryData){
                    $scope.connectorNames.push(connectorName);
                }
            }
        }

        $scope.selectDataTable = function(connectorName){
            $scope.currentConnector = connectorName;
            console.log('current connector: ' , $scope.currentConnector)
        };

        $scope.generateDataTable = function(header){
            if($scope.currentConnector === undefined){
                $scope.currentConnector = $scope.connectorNames[0]
            }

            $scope.currentHeader = header;
            var propertyList = [];
            var columnDefs = [];
            $scope.gridOptions = [];
            var table = [];

            angular.copy($scope.viewportControl.geometryData[$scope.currentConnector],$scope.geometryData);

            if(header !== undefined){
                for(var i = 0; i < $scope.geometryData.length; i++){
                    if($scope.geometryData[i].cate !== header){
                        $scope.geometryData.splice(i,1);
                        i--;
                    }
                }
            }

            for(var i = 0; i < $scope.geometryData.length; i++){
                if($scope.geometryData[i].Property !== undefined){
                    if(propertyList.indexOf($scope.geometryData[i].Property) === -1){
                        propertyList.push($scope.geometryData[i].Property);
                    }
                }
            }

            columnDefs = [{ field: 'attachedTo', displayName: 'AttachedTo'}];

            for(var i = 0; i < propertyList.length;i++){
                columnDefs.push({
                    field:propertyList[i],
                    displayName:propertyList[i]
                })
            }

            for(var i = 0; i < $scope.geometryData.length; i++){
                if(table.length === 0){
                    table.push({attachedTo: $scope.geometryData[i].attachedTo});

                    table[0][$scope.geometryData[i].Property]
                        = $scope.geometryData[i].Value;

                    table[0].belongsTo
                        = $scope.geometryData[i].belongsTo;
                    console.log(table)
                }

                for(var j = 0; j < table.length; j++){
                    if(table[j].belongsTo === $scope.geometryData[i].belongsTo &&
                        table[j].attachedTo === $scope.geometryData[i].attachedTo){
                        table[j][$scope.geometryData[i].Property] = $scope.geometryData[i].Value;
                        break;
                    }else{
                        if(j === table.length-1){
                            table.push({attachedTo: $scope.geometryData[i].attachedTo});

                            table[table.length-1][$scope.geometryData[i].Property]
                                = $scope.geometryData[i].Value;

                            table[table.length-1].belongsTo
                                = $scope.geometryData[i].belongsTo;
                        }
                    }
                }
            }

            $scope.gridOptions = {
                data: "geometryData",
                columnDefs: columnDefs
            };

            console.log('organized data:', table)
            $scope.geometryData = table;
        };


        $scope.viewportControl.layout = 'singleView';
        $scope.topoViewportControl.layout = 'singleView';
        $scope.topoViewportControl.LT = false;
        $scope.topoViewportControl.RT = false;
        $scope.topoViewportControl.LB = false;
        $scope.topoViewportControl.RB = false;

        document.getElementById("LT1").style.display = "none";
        document.getElementById("RT1").style.display = "none";
        document.getElementById("LB1").style.display = "none";
        document.getElementById("RB1").style.display = "none";

        $scope.viewportControl.showGeometry = true;
        $scope.showGeometry = true;
        $scope.showFullCode = false;
        $scope.showData = false;
        $scope.showTopology = false;


        $scope.showGeometryLT = true;
        $scope.showGeometryRT = true;
        $scope.showGeometryLB = true;
        $scope.showGeometryRB = true;

        if($scope.showTopology === false){
            document.getElementById("topoContainer").style.display = "none";
        }

        $rootScope.$on('singleView', function(){
            $scope.viewportControl.layout = 'singleView';
            $scope.topoViewportControl.layout = 'singleView';
            $scope.viewportControl.showGeometry =true;
            document.getElementById("viewSingle").style.display = "inline";
            document.getElementById("LT1").style.display = "none";
            document.getElementById("RT1").style.display = "none";
            document.getElementById("LB1").style.display = "none";
            document.getElementById("RB1").style.display = "none";

            $scope.showData = false;
            $scope.showFullCode = false;
        });

        $rootScope.$on('fourViews', function(){
            $scope.viewportControl.layout = 'fourViews';
            $scope.topoViewportControl.layout = 'fourViews';

            if($scope.showTopologyLT){
                document.getElementById("LT1").style.display = "inline";
            }

            if($scope.showTopologyRT){
                document.getElementById("RT1").style.display = "inline";
            }

            if($scope.showTopologyLB){
                document.getElementById("LB1").style.display = "inline";
            }

            if($scope.showTopologyRB){
                document.getElementById("RB1").style.display = "inline";
            }


            $scope.viewportControl.showGeometry= false;
            document.getElementById("viewSingle").style.display = "none";
            document.getElementById("topoContainer").style.display = "none";

            $scope.showData = false;
            $scope.showFullCode = false;
        });

        $scope.toggleFullCode = function(view){
            switch (view){
                case 'main':
                    $scope.viewportControl.currentCate = 'Code';
                    $scope.viewportControl.showGeometry = false;
                    $scope.showGeometry = false;
                    $scope.showFullCode = true;
                    $scope.showData = false;
                    $scope.showTopology = false;
                    document.getElementById("viewSingle").style.display = "none";
                    break;
                case 'LT':
                    $scope.viewportControl.LTcurrentCate = 'Code';
                    $scope.showGeometryLT = false;
                    $scope.showFullCodeLT = true;
                    $scope.showDataLT = false;
                    $scope.showTopologyLT = false;
                    document.getElementById("viewLT").style.display = "none";
                    $scope.topoViewportControl.LT = false;
                    document.getElementById("LT1").style.display = "none";
                    break;
                case 'LB':
                    $scope.viewportControl.LBcurrentCate = 'Code';
                    $scope.showGeometryLB = false;
                    $scope.showFullCodeLB = true;
                    $scope.showDataLB = false;
                    $scope.showTopologyLB = false;
                    document.getElementById("viewLB").style.display = "none";
                    $scope.topoViewportControl.LB = false;
                    document.getElementById("LB1").style.display = "none";
                    break;
                case 'RT':
                    $scope.viewportControl.RTcurrentCate = 'Code';
                    $scope.showGeometryRT = false;
                    $scope.showFullCodeRT = true;
                    $scope.showDataRT = false;
                    $scope.showTopologyRT = false;
                    document.getElementById("viewRT").style.display = "none";
                    $scope.topoViewportControl.RT = false;
                    document.getElementById("RT1").style.display = "none";
                    break;
                case 'RB':
                    $scope.viewportControl.RBcurrentCate = 'Code';
                    $scope.showGeometryRB = false;
                    $scope.showFullCodeRB = true;
                    $scope.showDataRB = false;
                    $scope.showTopologyRB = false;
                    document.getElementById("viewRB").style.display = "none";
                    $scope.topoViewportControl.RB = false;
                    document.getElementById("RB1").style.display = "none";
                    break;
            }
        };

        $scope.toggleGeometry = function(view){
            switch (view){
                case 'main':
                    $scope.viewportControl.currentCate = $scope.viewportControl.currentView;
                    $scope.viewportControl.showGeometry = true;
                    $scope.showGeometry = true;
                    $scope.showFullCode = false;
                    $scope.showData = false;
                    $scope.showTopology = false;
                    document.getElementById("viewSingle").style.display = "inline";
                    document.getElementById("topoContainer").style.display = "none";
                    break;
                case 'LT':
                    $scope.viewportControl.LTcurrentCate = $scope.viewportControl.LTcurrentView;
                    $scope.showGeometryLT = true;
                    $scope.showFullCodeLT = false;
                    $scope.showDataLT = false;
                    $scope.showTopologyLT = false;
                    document.getElementById("viewLT").style.display = "inline";
                    $scope.topoViewportControl.LT = false;
                    document.getElementById("LT1").style.display = "none";
                    break;
                case 'LB':
                    $scope.viewportControl.LBcurrentCate = $scope.viewportControl.LBcurrentView;
                    $scope.showGeometryLB = true;
                    $scope.showFullCodeLB = false;
                    $scope.showDataLB = false;
                    $scope.showTopologyLB = false;
                    document.getElementById("viewLB").style.display = "inline";
                    $scope.topoViewportControl.LB = false;
                    document.getElementById("LB1").style.display = "none";
                    break;
                case 'RT':
                    $scope.viewportControl.RTcurrentCate = $scope.viewportControl.RTcurrentView;
                    $scope.showGeometryRT = true;
                    $scope.showFullCodeRT = false;
                    $scope.showDataRT = false;
                    $scope.showTopologyRT = false;
                    $scope.topoViewportControl.RT = false;
                    document.getElementById("viewRT").style.display = "inline";
                    document.getElementById("RT1").style.display = "none";
                    break;
                case 'RB':
                    $scope.viewportControl.RBcurrentCate = $scope.viewportControl.RBcurrentView;
                    $scope.showGeometryRB = true;
                    $scope.showFullCodeRB = false;
                    $scope.showDataRB = false;
                    $scope.showTopologyRB = false;
                    $scope.topoViewportControl.RB = false;
                    document.getElementById("viewRB").style.display = "inline";
                    document.getElementById("RB1").style.display = "none";
                    break;
            }
        };

        $scope.toggleData = function(view){
            switch (view){
                case 'main':
                    $scope.viewportControl.currentCate = 'Data';
                    $scope.viewportControl.showGeometry = false;
                    $scope.showGeometry = false;
                    $scope.showFullCode = false;
                    $scope.showData = true;
                    $scope.showTopology = false;
                    document.getElementById("viewSingle").style.display = "none";
                    document.getElementById("topoContainer").style.display = "none";
                    break;
                case 'LT':
                    $scope.viewportControl.LTcurrentCate = 'Data';
                    $scope.showGeometryLT = false;
                    $scope.showFullCodeLT = false;
                    $scope.showDataLT = true;
                    $scope.showTopologyLT = false;
                    document.getElementById("viewLT").style.display = "none";
                    $scope.topoViewportControl.LT = false;
                    document.getElementById("LT1").style.display = "none";
                    break;
                case 'LB':
                    $scope.viewportControl.LBcurrentCate = 'Data';
                    $scope.showGeometryLB = false;
                    $scope.showFullCodeLB = false;
                    $scope.showDataLB = true;
                    $scope.showTopologyLB = false;
                    document.getElementById("viewLB").style.display = "none";
                    $scope.topoViewportControl.LB = false;
                    document.getElementById("LB1").style.display = "none";
                    break;
                case 'RT':
                    $scope.viewportControl.RTcurrentCate = 'Data';
                    $scope.showGeometryRT = false;
                    $scope.showFullCodeRT = false;
                    $scope.showDataRT = true;
                    $scope.showTopologyRT = false;
                    document.getElementById("viewRT").style.display = "none";
                    $scope.topoViewportControl.RT = false;
                    document.getElementById("RT1").style.display = "none";
                    break;
                case 'RB':
                    $scope.viewportControl.RBcurrentCate = 'Data';
                    $scope.showGeometryRB = false;
                    $scope.showFullCodeRB = false;
                    $scope.showDataRB = true;
                    $scope.showTopologyRB = false;
                    document.getElementById("viewRB").style.display = "none";
                    $scope.topoViewportControl.RB = false;
                    document.getElementById("RB1").style.display = "none";
                    break;
            }
        };

        $scope.toggleTopology = function(view){
            switch (view){
                case 'main':
                    $scope.viewportControl.currentCate = 'Topology';
                    $scope.viewportControl.showGeometry = false;
                    $scope.topoViewportControl.showTopology = true;
                    $scope.showGeometry = false;
                    $scope.showFullCode = false;
                    $scope.showData = false;
                    document.getElementById("viewSingle").style.display = "none";
                    document.getElementById("topoContainer").style.display = "inline";
                    break;
                case 'LT':
                    $scope.viewportControl.LTcurrentCate = 'Topology';
                    $scope.showGeometryLT = false;
                    $scope.showFullCodeLT = false;
                    $scope.showDataLT = false;
                    $scope.showTopologyLT = true;
                    document.getElementById("viewLT").style.display = "none";
                    $scope.topoViewportControl.LT = true;
                    document.getElementById("LT1").style.display = "inline";
                    break;
                case 'LB':
                    $scope.viewportControl.LBcurrentCate = 'Topology';
                    $scope.showGeometryLB = false;
                    $scope.showFullCodeLB = false;
                    $scope.showDataLB = false;
                    $scope.showTopologyLB = true;
                    document.getElementById("viewLB").style.display = "none";
                    $scope.topoViewportControl.LB = true;
                    document.getElementById("LB1").style.display = "inline";
                    break;
                case 'RT':
                    $scope.viewportControl.RTcurrentCate = 'Topology';
                    $scope.showGeometryRT = false;
                    $scope.showFullCodeRT = false;
                    $scope.showDataRT = false;
                    $scope.showTopologyRT = true;
                    document.getElementById("viewRT").style.display = "none";
                    document.getElementById("RT1").style.display = "inline";
                    $scope.topoViewportControl.RT = true;
                    break;
                case 'RB':
                    $scope.viewportControl.RBcurrentCate = 'Topology';
                    $scope.showGeometryRB = false;
                    $scope.showFullCodeRB = false;
                    $scope.showDataRB = false;
                    $scope.showTopologyRB = true;
                    document.getElementById("viewRB").style.display = "none";
                    document.getElementById("RB1").style.display = "inline";
                    $scope.topoViewportControl.RB = true;
                    break;
            }

        };
    }
]);