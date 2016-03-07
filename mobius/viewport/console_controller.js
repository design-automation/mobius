//
// mobius middle console controller
//

mobius.controller('consoleCtrl',[
    '$scope',
    function($scope) {
        $scope.clearConsole = function(){
            document.getElementById('log').innerHTML = '';
        }
    }
]);