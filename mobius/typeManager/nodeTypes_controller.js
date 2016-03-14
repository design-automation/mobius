mobius.controller('nodeTypesCtrl',['$scope','nodeCollection',function($scope,nodeCollection){

    $scope.selectAll = false;

    $scope.typeList = JSON.parse(localStorage.mobiusNodeTypes);

    $scope.$watch(function(){return localStorage.mobiusNodeTypes}, function(){
        $scope.typeList = JSON.parse(localStorage.mobiusNodeTypes);
    });
    $scope.closeTypeManager = function(){
        document.getElementById('typeManager').style.display = 'none'
    };

    // scynchronize with node collection service model

    // check existing node type in the current scene

    // hide create new type

    // category

    // delete
    $scope.deleteChecked = function(){
        var deleteList = [];
        for(var i = 0; i< $scope.typeList.length; i++){
            if($scope.typeList[i].checked === true){
                deleteList.push($scope.typeList[i].nodeType)
            }
        }
        // todo confirm
        nodeCollection.deleteNodeType(deleteList);
        $scope.typeList = JSON.parse(localStorage.mobiusNodeTypes);
    };

    // select all
    $scope.toggleSelection = function(){
        if($scope.selectAll === true){
            for(var i = 0; i< $scope.typeList.length; i++){
                $scope.typeList[i].checked = true;
            }
        } else {
            for (var i = 0; i < $scope.typeList.length; i++) {
                $scope.typeList[i].checked = false;
            }
        }
    };

    $scope.$watch('typeList',function(){
        $scope.definition = $scope.getSelectedProcedureModel();
    },true);

    $scope.getSelectedProcedureModel = function (){
        for(var i = 0; i < $scope.typeList.length;i++){
            if($scope.typeList[i].selected !== false){
                return $scope.typeList[i].procedureDataModel;
            }
        }
    };

    $scope.definition = $scope.getSelectedProcedureModel();
}]);
