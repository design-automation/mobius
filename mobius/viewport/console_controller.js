//
// VIDAMO middle console controller
//

vidamo.controller('consoleCtrl',[
    '$scope',
    function($scope) {
        $scope.clearConsole = function(){
            document.getElementById('log').innerHTML = '';
        }
    }
]);