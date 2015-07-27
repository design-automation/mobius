vidamo.controller('menuCtrl',['$scope','generateCode','$http',
    function($scope,generateCode,$http){

        // store json url
        $scope.sceneUrl= '';
        $scope.jsUrl = '';
        $scope.libUrl = '';

        // open and read json file for scene
        $scope.openSceneJson = function(){

            document.getElementById('openSceneJson').click();

            procedureJsonObj = null;

            function handleFileSelect(evt) {
                var files = evt.target.files;
                var f = files[0];
                var jsonString;
                var graphJsonString;
                var procedureJsonString;
                var graphJsonObj;
                var procedureJsonObj;

                var reader = new FileReader();

                reader.onload = (function () {
                    return function (e) {
                        if(f.name.split('.').pop() == 'json') {
                            jsonString = e.target.result;

                            graphJsonString = jsonString.split("//procedure json")[0];
                            procedureJsonString = jsonString.split("//procedure json")[1];

                            graphJsonObj = JSON.parse(graphJsonString);
                            procedureJsonObj = JSON.parse(procedureJsonString);

                            // update the graph
                            generateCode.setChartViewModel(new flowchart.ChartViewModel(graphJsonObj));

                            // update the procedure
                            generateCode.setDataList(procedureJsonObj);

                            document.getElementById('log').innerHTML += "<div style='color: green'>Scene imported!</div>";
                        }else{
                            document.getElementById('log').innerHTML += "<div style='color: red'>Error: File type is not Json!</div>";
                        }
                    };
                })(f);

                reader.readAsText(f);
            }

            document.getElementById('openSceneJson').addEventListener('change', handleFileSelect, false);
        };


        // save json file for scene
        $scope.saveSceneJson = function(){

            var graphJson = JSON.stringify(generateCode.getChartViewModel().data, null, 4);

            var procedureJson = JSON.stringify(generateCode.getDataList(), null, 4);

            var sceneBlob = new Blob([graphJson + '\n\n' + '//procedure json\n' + procedureJson], {type: "application/json"});

            $scope.sceneUrl = URL.createObjectURL(sceneBlob);
        };

        // import pre-defined node
        // todo

        $scope.importNode = function () {

        };

        // export selected node
        // todo
        $scope.exportNode = function (){

        };


        // save generated js file
        $scope.downloadJs = function(){

            var jsBlob = new Blob([generateCode.getJavascriptCode()], {type: "application/javascript"});

            $scope.jsUrl = URL.createObjectURL(jsBlob);
        };

        // save vidamo library file
        $scope.downloadLib = function(){
            $http.get("js/vidamo/module.js")
                .success(
                function(response) {
                    var libBlob = new Blob([response], {type: "application/javascript"});
                    $scope.libUrl = URL.createObjectURL(libBlob);
                }
            );
        };

    }]);