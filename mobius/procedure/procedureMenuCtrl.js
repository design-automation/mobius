vidamo.controller('procedureMenuCtrl',['$scope','$rootScope','generateCode',
    function($scope, $rootScope, generateCode){


        // procedure data list
        $scope.dataList = generateCode.getDataList();

        $scope.$watch('dataList', function () {
            generateCode.setDataList($scope.dataList);
        });

        $scope.$watch(function () { return generateCode.getDataList(); }, function () {
            $scope.dataList = generateCode.getDataList();
        },true);

        $scope.$watch(function () {
            return generateCode.getNodeIndex();
        }, function () {
            if (generateCode.getNodeIndex() !== $scope.nodeIndex) {
                $scope.nodeIndex = generateCode.getNodeIndex();
                $scope.data  = $scope.dataList[$scope.nodeIndex];
            }
        });

        // disable selected item
        $scope.disableProcedure = function(){
            $scope.findSelectedProcedure($scope.data);

            // if disable 'if' -> disable 'if/else'
            if($scope.selectedPos.title === 'Control' && $scope.selectedPos.controlType === 'if'){
                for(var i = 0;i < $scope.data.length; i++){
                    $scope.searchParent($scope.selectedPos,$scope.data[i]);
                }
                if($scope.selectedParentItem.controlType === 'if else'){
                    $scope.selectedPos = $scope.selectedParentItem;
                }
            }

            $scope.selectedPos.disabled = true;
            $scope.disableSubItems($scope.selectedPos);
        };

        // disable items recursively
        $scope.disableSubItems = function(parent){
            if(parent.nodes){
                for(var i = 0; i < parent.nodes.length; i++){
                    parent.nodes[i].disabled = true;
                    $scope.disableSubItems(parent.nodes[i]);
                }
            }
        };

        // enable selected item
        $scope.enableProcedure = function(){
            $scope.findSelectedProcedure($scope.data);
            $scope.enableSubItems($scope.selectedPos);
            $scope.enableParentItems($scope.selectedPos);
        };


        // enable sub items recursively
        $scope.enableSubItems = function(parent){
            if(parent.nodes){
                for(var i = 0; i < parent.nodes.length; i++){
                    parent.nodes[i].disabled = false;
                    $scope.enableSubItems(parent.nodes[i]);
                }
            }
        };

        $scope.selectedParentItem = undefined;

        // cover backwards enable for if/else and for recursively
        // todo cover various cases of 'for loop' and 'if else'
        $scope.enableParentItems = function(son){

            if(son.disabled === true){
                son.disabled = false;

                for(var i = 0;i < $scope.data.length; i++){
                    $scope.searchParent($scope.selectedPos,$scope.data[i]);
                }

                $scope.enableSubItems($scope.selectedParentItem);
                $scope.selectedPos = $scope.selectedParentItem;
                $scope.enableParentItems($scope.selectedParentItem);
            }
        };

        // fixme if else subitems id are alway : 1if, 1else, not reading the sub layer if-else loops
        // to find the parent item recursively
        $scope.searchParent = function(son,tree){
            if(tree.nodes.length >0){
                for(var i =0; i < tree.nodes.length; i++){
                    if(tree.nodes[i] === son){
                        $scope.selectedParentItem = tree;
                    }else{
                        $scope.searchParent(son, tree.nodes[i])
                    }
                }
            }
        };


        // todo copy selected item
        $scope.copyProcedure = function (){};

        $scope.selectedPos = undefined;
        $scope.selectedParent = undefined;

        $scope.findSelectedProcedure = function (tree){
            for(var i = 0; i < tree.length; i++ ){
                if(tree[i].selected === true){

                        $scope.selectedPos  = tree[i];
                        $scope.selectedParent = tree;
                        $scope.root = false;

                }else if(tree[i].nodes){
                    $scope.findSelectedProcedure(tree[i].nodes)
                    $scope.selectedParentItem = tree[i];
                }
            }
        };

        $scope.checkDisabled = function(){
            if($scope.data !== undefined){

                $scope.findSelectedProcedure($scope.data);
                if($scope.selectedPos !== undefined){
                    if($scope.selectedPos.disabled === true){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        };


    }]);