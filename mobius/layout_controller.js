
vidamo.controller('layoutCtrl',['$scope','hotkeys',
    function($scope,hotkeys) {

        hotkeys.add({
            combo: 'ctrl+`',
            description: 'Toggle procedure panel',
            callback: function(event,hotkey) {
                $scope.$emit("editProcedure");
            }
        });


        // toggle procedure
        $scope.displayProcedure = false;

        // initial layout
        $scope.viewportSize = 75;
        $scope.procedureSize = 0;
        $scope.graphSize = 25;

        $scope.viewportWidth = $scope.viewportSize +'%';
        $scope.procedureWidth = $scope.procedureSize +'%';
        $scope.graphWidth = $scope.graphSize +'%';


        // templates not in use
       $scope.procedureHTML = { name: 'procedureHTML.html', url: 'mobius/procedureHTML.html'} ;

        $scope.$on('editProcedure', function(){
            if($scope.displayProcedure === false){
                $scope.displayProcedure = true;
                if($scope.viewportSize > 25){
                    $scope.viewportSize -= 25;
                    $scope.procedureSize = 25;
                }
                else if($scope.graphWidth > 25){
                      $scope.graphSize -= 25;
                    $scope.procedureSize = 25;
                }
            }else{
                $scope.displayProcedure = false;
                $scope.viewportSize += $scope.procedureSize;
            }

            $scope.viewportWidth = $scope.viewportSize +'%';
            $scope.procedureWidth = $scope.procedureSize +'%';
            $scope.graphWidth = $scope.graphSize +'%';

        });

        $scope.$on('hideProcedure', function(){
            if($scope.displayProcedure === true){
                $scope.displayProcedure = false;
                $scope.viewportSize += $scope.procedureSize;

                $scope.viewportWidth = $scope.viewportSize +'%';
                $scope.procedureWidth = $scope.procedureSize +'%';
                $scope.graphWidth = $scope.graphSize +'%';
            }
        });

        $scope.hideProcedure =  function(){
            $scope.displayProcedure = false;
            $scope.viewportSize += $scope.procedureSize;

            $scope.viewportWidth = $scope.viewportSize +'%';
            $scope.procedureWidth = $scope.procedureSize +'%';
            $scope.graphWidth = $scope.graphSize +'%';
        };

    }]);