vidamo.controller('executeCtrl',['$scope','generateCode',
    function($scope,generateCode) {

        // one-way binding of generated javascript code

        $scope.javascriptCode = generateCode.getJavascriptCode();

        $scope.$watch(function () { return generateCode.getJavascriptCode(); }, function () {
            $scope.javascriptCode = generateCode.getJavascriptCode();
        });


        $scope.run = function(){

            // declare start running in console
            document.getElementById('log').innerHTML += "<div></br> Executing generated code ... </div>";

            try{
                eval( $scope.javascriptCode);
            }catch (e) {
                document.getElementById('log').innerHTML +=     "<div style='color:red'>" +  e.message + "</div>";
                alert(e.stack);
            }

            document.getElementById('log').innerHTML += "<div> Execution done </div>";
        }
    }]);

