mobius.controller('nodeTypesCtrl',['$scope','nodeCollection','consoleMsg',function($scope,nodeCollection,consoleMsg){

    $scope.selectAll = false;

    $scope.typeList = JSON.parse(localStorage.mobiusNodeTypes);

    $scope.$watch(function(){return localStorage.mobiusNodeTypes}, function(){
        $scope.typeList = JSON.parse(localStorage.mobiusNodeTypes);
    });
    $scope.closeTypeManager = function(){
        document.getElementById('typeManager').style.display = 'none'
    };

    // delete
    // fixme add confirmation
    $scope.deleteChecked = function(){
        var deleteList = [];
        for(var i = 0; i< $scope.typeList.length; i++){
            if($scope.typeList[i].checked === true){
                deleteList.push($scope.typeList[i].nodeType)
            }
        }
        nodeCollection.deleteNodeType(deleteList);
    };

    // import single/multiple nodes from a single file
    // fixme error handle
    // fixme duplication of name
    $scope.importNode = function(files){
        var jsonString;

        for(var i = 0; i < files.length ; i ++ ){
            var f = files[i];

            var reader = new FileReader();

            reader.onload = (function () {

                return function (e) {
                    if(f.name.split('.').pop() === 'json') {

                        jsonString = e.target.result;
                        var objectString =  jsonString.split('\n');

                        var existingTypes = [];
                        for(var j = 0; j < $scope.typeList.length; j++){
                            existingTypes.push($scope.typeList[j].nodeType);
                        }
                        // install new imported node into nodeCollection
                        for(var i = 0; i < objectString.length - 1;i++){
                            var newType = JSON.parse(objectString[i]);
                            if(existingTypes.indexOf(newType.nodeType) === -1){
                                nodeCollection.importNodeType(newType);
                                existingTypes.push(newType.nodeType);
                            }
                        }
                        // when updating data outside angular need to apply digest cycle
                        $scope.$apply();

                        // fixme consoleMsg is not visible in type manager
                        consoleMsg.confirmMsg('nodeImport');
                    }else{
                        // fixme consoleMsg is not visible in type manager
                        consoleMsg.errorMsg('invalidFileType');
                    }
                };
            })(f);

            reader.readAsText(f);
        }
        document.getElementById("importNode").value = "";
    };

    // export node
    $scope.exportNode = function (){
        var jsonString = "";
        var types = JSON.parse(localStorage.mobiusNodeTypes);
        for(var i = 0; i< $scope.typeList.length; i++){
            if($scope.typeList[i].checked === true){
                jsonString = jsonString.concat(JSON.stringify(types[i]),'\n');
            }
        }

        var blob = new Blob([jsonString],{type:"application/json"});
        $scope.nodeUrl = URL.createObjectURL(blob);
    };

    // select all
    $scope.toggleSelection = function(){
        if($scope.selectAll === true){
            for(var i = 0; i< $scope.typeList.length; i++){
                $scope.typeList[i].checked = false;
            }
            $scope.selectAll = false;
        } else {
            for (var i = 0; i < $scope.typeList.length; i++) {
                $scope.typeList[i].checked = true;
            }
            $scope.selectAll = true;
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

    // only there is checked item then toggle export nodes
    // fixme warning
    // fixme directly from javascript
    $scope.existSelected = function(){
        for(var i = 0; i< $scope.typeList.length; i++){
          if(  $scope.typeList[i].checked === true){
              return true;
          }
        }
    }
}]);
