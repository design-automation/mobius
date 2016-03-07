mobius.controller('procedureMenuCtrl',['$scope','$rootScope','generateCode',
    function($scope, $rootScope, generateCode){

        // procedure items to track
        $scope.selectedParentItem = undefined;
        $scope.selectedPos = undefined;
        $scope.selectedParent = undefined;

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
            if(parent && parent.nodes){
                for(var i = 0; i < parent.nodes.length; i++){
                    parent.nodes[i].disabled = false;
                    $scope.enableSubItems(parent.nodes[i]);
                }
            }
        };

        // cover backwards enable for if/else and for recursively
        $scope.enableParentItems = function(son){

            if(son && son.disabled === true){
                son.disabled = false;
                $scope.selectedParentItem = undefined;

                for(var i = 0;i < $scope.data.length; i++){
                    $scope.searchParent($scope.selectedPos,$scope.data[i]);
                }


                //$scope.enableSubItems($scope.selectedParentItem);
                $scope.selectedPos = $scope.selectedParentItem;
                $scope.enableParentItems($scope.selectedParentItem);
            }
        };

        // to find the parent item recursively
        $scope.searchParent = function(son,tree){
            if(tree.nodes && tree.nodes.length >0){
                for(var i =0; i < tree.nodes.length; i++){
                    if(tree.nodes[i] === son){
                        $scope.selectedParentItem = tree;
                    }else{
                        $scope.searchParent(son, tree.nodes[i])
                    }
                }
            }
        };

        // todo comprehensive copy
        $scope.copyProcedure = function (){
            // version 1 | copy without content
            // broadcast to procedure controller to add new items
            //$scope.findSelectedProcedure($scope.data);
            //
            //if($scope.selectedPos.title === 'Data' ||
            //    $scope.selectedPos.title === 'Output' ){
            //    $rootScope.$broadcast('copyProcedure', $scope.selectedPos.title);
            //}
            //else if($scope.selectedPos.title === 'Action'){
            //    var subCate = {
            //        category:$scope.selectedPos.category,
            //        name:$scope.selectedPos.method,
            //        return:$scope.selectedPos.return};
            //    $rootScope.$broadcast('copyProcedure', $scope.selectedPos.title,subCate);
            //}
            //else if($scope.selectedPos.title === 'Control'){
            //    var subCate = $scope.selectedPos.controlType;
            //    if(subCate === 'if' || subCate === 'else'){
            //        subCate === 'if else';
            //    }
            //    $rootScope.$broadcast('copyProcedure', $scope.selectedPos.title,subCate);
            //}

            // version 2 | copy with content
            $scope.findSelectedProcedure($scope.data);
            $scope.numOfItems = 0;
            $scope.findNumOfItems($scope.selectedPos);
            var temp =  angular.copy($scope.selectedPos);
            $scope.updateCopyItemId(temp,$scope.numOfItems);
            $rootScope.$broadcast('copyProcedure',temp);
        };

        $scope.numOfItems = 0;

        // find number of items to be copy
        $scope.findNumOfItems = function(parent){
            if(parent && parent.nodes){
                if(parent.controlType !== 'if' && parent.controlType !== 'else'){
                    $scope.numOfItems ++;
                }
                for(var i = 0; i < parent.nodes.length; i++){
                    $scope.findNumOfItems (parent.nodes[i]);
                }
            }
        };

        // update copy item id & reset selected attribute
        $scope.updateCopyItemId = function(parent,increment){
            if(parent && parent.nodes){
                parent.id += increment;
                parent.selected = false;
                for(var i = 0; i < parent.nodes.length; i++){
                    $scope.updateCopyItemId (parent.nodes[i],increment);
                }
            }
        };

        $scope.findSelectedProcedure = function (tree){
            for(var i = 0; i < tree.length; i++ ){
                if(tree[i].selected === true){

                        $scope.selectedPos  = tree[i];
                        $scope.selectedParent = tree;
                        $scope.root = false;

                }else if(tree[i].nodes){
                    $scope.findSelectedProcedure(tree[i].nodes);
                    $scope.selectedParentItem = tree[i];
                }
            }
        };

        $scope.checkDisabled = function(){
            if($scope.data !== undefined){

                $scope.findSelectedProcedure($scope.data);
                if($scope.selectedPos !== undefined){
                    if($scope.selectedPos.disabled === true || $scope.selectedPos.title === 'Output' ){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        };


        $scope.isOutput = function(){
            if($scope.data !== undefined){

                $scope.findSelectedProcedure($scope.data);
                if($scope.selectedPos !== undefined){
                    if( $scope.selectedPos.title === 'Output' ){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        };
    }]);