// angular material dialogue control
mobius.controller('DialogController',['$scope','$rootScope','$mdDialog','generateCode',
function ($scope, $rootScope, $mdDialog,generateCode) {

    $scope.inputName_new = '';
    $scope.chartViewModel = generateCode.getChartViewModel();
    $scope.inputName = $scope.chartViewModel.getSelectedNodes()[0] ? $scope.chartViewModel.getSelectedNodes()[0].data.type : '';



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
    };

    $scope.submit_new = function(){
        $mdDialog.hide($scope.inputName_new);
    }
}]);

