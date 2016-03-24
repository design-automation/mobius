// angular material dialogue control
function DialogController($scope, $mdDialog) {

    $scope.inputName = '';

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.submit = function(){
        $mdDialog.hide($scope.inputName);
    }
}

