mobius.controller('layoutCtrl',['$scope','$rootScope','hotkeys',
    function($scope,$rootScope,hotkeys) {

        //hotkeys.add({
        //    combo: 'ctrl+`',
        //    description: 'Toggle procedure panel',
        //    callback: function(event,hotkey) {
        //        $scope.$emit("editProcedure");
        //    }
        //});

        // templates not in use
        $scope.procedureHTML = { name: 'procedureHTML.html', url: 'mobius/procedure/template/procedureHTML.html'} ;

        $scope.bodySize = document.getElementById('layout').offsetWidth;

        $scope.$watch(function(){
            return document.getElementById('layout').offsetWidth;
        }, function(newSize,oldSize){
            $scope.bodySize = document.getElementById('layout').offsetWidth;
            $scope.graphSize += newSize - oldSize;
            $scope.graphWidth = $scope.graphSize +'px';
        });

        $rootScope.$on('ui.layout.resize', function(){
            $scope.viewportSize = document.getElementById('viewport').offsetWidth;
            if(document.getElementById('procedure') !== null){
                $scope.procedureSize = document.getElementById('procedure').offsetWidth;
            }
            $scope.graphSize = document.getElementById('graph').offsetWidth;

            $scope.viewportWidth = $scope.viewportSize +'px';
            $scope.procedureWidth = $scope.procedureSize +'px';
            $scope.graphWidth = $scope.graphSize +'px';
        });

        // toggle procedure
        $scope.displayProcedure = false;

        // initial layout
        $scope.viewportSize = $scope.bodySize * 0.70;
        $scope.procedureSize = 0;
        $scope.graphSize = $scope.bodySize * 0.30;

        $scope.viewportWidth = $scope.viewportSize +'px';
        $scope.procedureWidth = $scope.procedureSize +'px';
        $scope.graphWidth = $scope.graphSize +'px';

        //$scope.$on('editProcedure', function(evt,message){
            //if(message === false || $scope.displayProcedure === true){
            //        $scope.displayProcedure = false;
            //        $scope.viewportSize += $scope.procedureSize;
            //        $scope.procedureSize = 0;
            //}
            //else if($scope.displayProcedure === false){
            //
            //    $scope.displayProcedure = true;
            //    if($scope.viewportSize > $scope.bodySize * 0.25){
            //        $scope.viewportSize -= $scope.bodySize * 0.25;
            //        $scope.procedureSize += $scope.bodySize * 0.25;
            //    }
            //    else if($scope.graphSize > $scope.bodySize * 0.25){
            //          $scope.graphSize -= $scope.bodySize * 0.25;
            //        $scope.procedureSize = $scope.bodySize * 0.25;
            //    }
            //}
            //
            //$scope.viewportWidth = $scope.viewportSize +'px';
            //$scope.procedureWidth = $scope.procedureSize +'px';
            //$scope.graphWidth = $scope.graphSize +'px';
        //});

        $scope.height = document.getElementById('layout').offsetHeight;
        $scope.graphHeight = ($scope.height - 32) * 0.7;
        $scope.procedureHeight =  32;

        $scope.$on('showProcedure', function(){
            console.log('show');
            $scope.graphHeight = 32 ;
            $scope.procedureHeight = ($scope.height - 32)*0.7;
        });

        $scope.$watch(function(){
            return document.getElementById('a').offsetHeight;
        }, function(newSize,oldSize){
            if(newSize !== oldSize && oldSize === 32){
                $scope.graphHeight = undefined;
            }
        });

        $scope.$watch(function(){
            return document.getElementById('c').offsetHeight;
        }, function(newSize,oldSize){
            if(newSize !== oldSize && oldSize === ($scope.height - 32) * 0.7){
                $scope.procedureHeight = undefined;
            }
        });

        $scope.$watch(function(){
            return document.getElementById('layout').offsetHeight;
        }, function(){
            $scope.height = document.getElementById('layout').offsetHeight;
        })
    }]);