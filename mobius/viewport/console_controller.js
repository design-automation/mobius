//
// VIDAMO middle console controller
//

vidamo.controller('consoleCtrl',[
    '$scope',
    function($scope) {

        window.setInterval(function() {
                var consoleDiv = document.getElementById("log");
                consoleDiv.scrollTop = consoleDiv.scrollHeight;
        }, 100);

        $scope.clearConsole = function(){
            document.getElementById('log').innerHTML = '';
        }
    }
]);