//
// broadcasting msg to graph controller
// procedure and graph data are not affected in this controller
//

mobius.controller('nodeMenuCtrl',['$scope','$rootScope','generateCode',
    function($scope,$rootScope,generateCode) {

        // procedure data list
        $scope.dataList = generateCode.getDataList();

        $scope.$watch(function () { return generateCode.getDataList(); }, function () {
            $scope.dataList = generateCode.getDataList();
        },true);

        // interface data list

        $scope.interfaceList= generateCode.getInterfaceList();

        $scope.$watch(function () { return generateCode.getInterfaceList(); }, function () {
            $scope.interfaceList= generateCode.getInterfaceList();
        },true);

        // graph flowchart view model
        $scope.chartViewModel= generateCode.getChartViewModel();

        $scope.$watch(function () { return generateCode.getChartViewModel(); }, function () {
            if(generateCode.getChartViewModel() !== $scope.chartViewModel){
                $scope.chartViewModel= generateCode.getChartViewModel();
            }
        });


        $scope.$watch(function () {
            return generateCode.getNodeIndex();
        }, function () {
            if (generateCode.getNodeIndex() !== $scope.nodeIndex) {
                $scope.nodeIndex = generateCode.getNodeIndex();
                $scope.procedures = $scope.dataList[$scope.nodeIndex];
                $scope.inputs = $scope.interfaceList[$scope.nodeIndex];
            }
        });

        $scope.addInputConnector = function(model){
            $rootScope.$broadcast("newInputConnector",model)
        };

        $scope.addOutputConnector = function(model){
            $rootScope.$broadcast("newOutputConnector",model)
        };

        $scope.addFunctionOutput = function(){
            var model = {
                    id:'999',
                    title: 'Output',
                    name: 'FUNC_OUTPUT',
                    dataValue:undefined,
                    type:undefined
            }

            $rootScope.$broadcast("newOutputConnector",model)
        };

        $scope.checkDupOutput  = function(output){
            if($scope.chartViewModel.nodes[$scope.nodeIndex] !== undefined){
                var outputs = $scope.chartViewModel.nodes[$scope.nodeIndex].data.outputConnectors;
                    for(var i = 0; i < outputs.length; i++){
                        if(outputs[i].name === output.name && outputs[i].name !== 'FUNC_OUTPUT'){
                            return false;
                        }
                    }
                }
            return true;
        };

        $scope.checkDupFunc  = function(){
            if($scope.chartViewModel.nodes[$scope.nodeIndex] !== undefined){
                var outputs = $scope.chartViewModel.nodes[$scope.nodeIndex].data.outputConnectors;
                for(var i = 0; i < outputs.length; i++){
                    if(outputs[i].name === 'FUNC_OUTPUT'){
                        return false;
                    }
                }
            }
            return true;
        };


        $scope.disableAddInput = function(){
            if($scope.inputs){
                for(var i = 0; i < $scope.inputs.length; i++){
                    if($scope.checkDupInput($scope.inputs[i])){
                        return true;
                    }
                }
                return false;
            }else{
                return false;
            }
        };

        $scope.disableAddOutput = function(){
            if($scope.procedures){
                for(var i = 0; i < $scope.procedures.length; i++){
                    if($scope.checkDupOutput($scope.procedures[i])){
                        return true;
                    }
                }
                return false;
            }else{
                return false;
            }
        };

        $scope.checkDupInput  = function(input){
            if($scope.chartViewModel.nodes[$scope.nodeIndex] !== undefined){
                var inputs = $scope.chartViewModel.nodes[$scope.nodeIndex].data.inputConnectors;
                for(var i = 0; i < inputs.length; i++){
                    if(inputs[i].name === input.name){
                        return false;
                    }
                }
            }
            return true;
        };

        $scope.disableNode = function(){
            $rootScope.$broadcast("disableNode")
        };

        $scope.enableNode = function(){
            $rootScope.$broadcast("enableNode")
        };

        $scope.checkDisabled = function(){
            if($scope.chartViewModel.nodes[$scope.nodeIndex] !== undefined){
                if($scope.chartViewModel.nodes[$scope.nodeIndex].disabled() === false ||
                    $scope.chartViewModel.nodes[$scope.nodeIndex].disabled() === undefined){
                    return false;
                }else{
                    return true;
                }
            }
            return false;
        };

        $scope.delete = function(){$rootScope.$broadcast("deleteSelected")};
        $scope.rename = function(){$rootScope.$broadcast("renameSelected")};
        $scope.saveAsNew = function(){$rootScope.$broadcast("saveAsNewType")};
        $scope.overwrite= function(){$rootScope.$broadcast("overWriteProcedure")};
        $scope.editProcedure= function(){$rootScope.$broadcast("editProcedure");};
    }]);