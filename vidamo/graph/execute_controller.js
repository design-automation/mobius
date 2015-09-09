//
// Execute generated code ('run' button)
//

vidamo.controller('executeCtrl',['$scope','generateCode',
    function($scope,generateCode) {

        // one-way binding of generated javascript code

        //$scope.javascriptCode = generateCode.getJavascriptCode();

        $scope.$watch(function () { return generateCode.getJavascriptCode(); }, function () {
            $scope.javascriptCode = generateCode.getJavascriptCode();
        });

        $scope.$watch(function () { return generateCode.getGeomListCode(); }, function () {
            $scope.geomListCode = generateCode.getGeomListCode();
        });

        $scope.outputs = [];

        $scope.run = function(){

            setTimeout(function(){
                    var scope = angular.element(document.getElementById('threeViewport')).scope();
                    scope.$apply(function(){scope.viewportControl.refresh();} );
                }
                ,0);

            // declare start running in console
            document.getElementById('log').innerHTML += "<div></br> Executing generated code ... </div>";

            try{
                // eval( $scope.javascriptCode);
                $scope.outputs = new Function(   $scope.javascriptCode + $scope.geomListCode + 'return geomList;')();
                console.log($scope.outputs);
            }catch (e) {
                document.getElementById('log').innerHTML +=     "<div style='color:red'>" +  e.message + "</div>";
                alert(e.stack);
            }

            document.getElementById('log').innerHTML += "<div> Execution done </div>";
        }
    }]);

