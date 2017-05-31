//
//  display the parameters of the selected node
//
mobius.directive('console', [ 'consoleMsg', function(consoleMsg) {
    
    return {
        restrict: 'E', 
        template: '<div class="doormat" ng-dblclick="showConsole()">\
                                    <div style="display: inline-block;">Console</div>\
                                    <button class="button"\
                                            id = "clear"\
                                            title="clear console"\
                                            ng-click="clearConsole()"\
                                            style="position: absolute; right: 2px;">\
                                        <i class="fa fa-eraser"></i>\
                                    </button>\
                                 </div>\
                                 <div class="tree-container"><div class="console" id ="log">\
                        </div>',
        link: function ($scope, element, attrs) {
            $scope.clearConsole = function(){
                document.getElementById('log').innerHTML = '';
            }
        }
    }

}]);
