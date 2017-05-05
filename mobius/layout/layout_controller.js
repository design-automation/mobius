mobius.controller('layoutCtrl',['$scope','$rootScope','hotkeys',
    function($scope,$rootScope,hotkeys) {

        //hotkeys.add({
        //    combo: 'ctrl+`',
        //    description: 'Toggle procedure panel',
        //    callback: function(event,hotkey) {
        //        $scope.$emit("editProcedure");
        //    }
        //});

        $scope.bodySize = document.getElementById('layout').offsetWidth;

        // initial layout
        $scope.viewportSize = $scope.bodySize * 0.35;
        $scope.graphSize = $scope.bodySize * 0.25;
        $scope.procedureSize = $scope.bodySize * 0.25;
        $scope.toolkitSize = $scope.bodySize * 0.20;

        $scope.viewportWidth = $scope.viewportSize +'px';
        $scope.procedureWidth = $scope.procedureSize +'px';
        $scope.graphWidth = $scope.graphSize +'px';
        $scope.toolkitWidth = $scope.toolkitSize + 'px';

        $scope.consoleHeight = 150;
        $scope.height = document.getElementById('layout').offsetHeight;
        $scope.graphHeight = ($scope.height - $scope.consoleHeight);
        $scope.procedureHeight =  $scope.height;
        //$scope.interfaceHeight = 0;

        // templates not in use
        $scope.showGraph = function(){
            if($scope.graphHeight !== $scope.height - 150){
                $scope.graphHeight = ($scope.height -  150);
                $scope.consoleHeight = 150;
            }else{
                $scope.graphHeight = ($scope.height - 150);
                $scope.consoleHeight = 150;
            }
        };

        // console and graph are tied together
        $scope.showConsole = function(){
            if($scope.consoleHeight !== $scope.height - 32){
                $scope.consoleHeight = $scope.height;
                $scope.graphHeight = 0;
            }else{
                $scope.consoleHeight = $scope.height;
                $scope.graphHeight = 0;
            }
        };


        $scope.interfaceHeight = document.getElementById("interface").offsetHeight;

        $scope.$watch(
            function () {
                return document.getElementById("interface").offsetHeight;
            },
            function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.interfaceHeight = document.getElementById("interface").offsetHeight;
                }
            }
        );



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



        // $scope.$watch(function(){
        //     return document.getElementById('c').offsetHeight;
        // },function(){
        //     document.getElementById("interface").style.bottom =  document.getElementById('c').offsetHeight + "px";
        // });

        /*$scope.$on('showProcedure', function(){
            if($scope.graphHeight !== 32 + $scope.interfaceHeight){
                $scope.graphHeight = 32 + $scope.interfaceHeight ;
                $scope.procedureHeight = $scope.height - 32-$scope.interfaceHeight;
            }else{
                $scope.graphHeight = 33 + $scope.interfaceHeight;
                $scope.procedureHeight = $scope.height - 33 -$scope.interfaceHeight;
            }
        });*/

        /*$scope.$watch(function(){
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
        })*/
    }]);