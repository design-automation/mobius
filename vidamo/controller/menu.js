vidamo.controller('menuCtrl',['$scope','$rootScope','generateCode','nodeCollection','$http',
    function($scope,$rootScope,generateCode,nodeCollection,$http){

        // store json url
        $scope.sceneUrl= '';
        $scope.jsUrl = '';
        $scope.libUrl = '';
        $scope.nodeUrl = '';

        // listen to graph to get current selected node
        // for export selected node
        $rootScope.$on("nodeIndex", function(event, message) {
            $scope.nodeIndex = message;
        });

        // open and read json file for scene
        $scope.openSceneJson = function(){
            // todo $apply conflict

            angular.element(document.getElementById('openSceneJson')).trigger('click');
            document.getElementById('openSceneJson').addEventListener('change', handleFileSelect, false);

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

        };

        // save json file for scene
        $scope.saveSceneJson = function(){

            var graphJson = JSON.stringify(generateCode.getChartViewModel().data, null, 4);

            var procedureJson = JSON.stringify(generateCode.getDataList(), null, 4);

            var sceneBlob = new Blob([graphJson + '\n\n' + '//procedure json\n' + procedureJson], {type: "application/json"});

            $scope.sceneUrl = URL.createObjectURL(sceneBlob);
        };

        // import pre-defined node
        $scope.importNode = function () {
            // todo $apply conflict
            document.getElementById('importNode').click();
            document.getElementById('importNode').addEventListener('change', handleFileSelect, false);

            function handleFileSelect(evt) {
                var files = evt.target.files;
                var f = files[0];

                var jsonString;

                var nodeJsonString;
                var procedureJsonString;
                var interfaceJsonString;

                var nodeJsonObj;
                var procedureJsonObj;
                var interfaceJsonObj;

                var reader = new FileReader();

                reader.onload = (function () {

                    return function (e) {
                        if(f.name.split('.').pop() == 'json') {

                            jsonString = e.target.result;

                            nodeJsonString = jsonString.split("//procedure json")[0];


                            var temp = jsonString.split("//procedure json")[1];
                            procedureJsonString = temp.split("//interface json")[0];
                            interfaceJsonString = temp.split("//interface json")[1];

                            var newNodeName = f.name.split('.')[0];
                            nodeJsonObj = JSON.parse(nodeJsonString);
                            procedureJsonObj = JSON.parse(procedureJsonString);
                            interfaceJsonObj = JSON.parse(interfaceJsonString);

                            console.log(newNodeName);
                            console.log(nodeJsonObj);
                            console.log(procedureJsonObj);
                            console.log(interfaceJsonObj);

                            nodeCollection.installNewNode(newNodeName, nodeJsonObj,procedureJsonObj,interfaceJsonObj);

                            document.getElementById('log').innerHTML += "<div style='color: green'> node imported!</div>";
                        }else{
                            document.getElementById('log').innerHTML += "<div style='color: red'>Error: File type is not Json!</div>";
                        }
                    };
                })(f);

                reader.readAsText(f);
            }

        };

        // export selected node
        $scope.exportNode = function (){
            var nodeJson = JSON.stringify(generateCode.getChartViewModel().nodes[$scope.nodeIndex].data, null, 4);

            var procedureJson = JSON.stringify(generateCode.getDataList()[$scope.nodeIndex], null, 4);

            var interfaceJson = JSON.stringify(generateCode.getInterfaceList()[$scope.nodeIndex], null, 4)

            var nodeBlob = new Blob([nodeJson + '\n\n' +
                                    '//procedure json\n' + procedureJson + '\n\n' +
                                    '//interface json\n' + interfaceJson],
                                    {type: "application/json"});

            $scope.nodeUrl = URL.createObjectURL(nodeBlob);
        };

        // save generated js file
        $scope.downloadJs = function(){

            var jsBlob = new Blob([generateCode.getJavascriptCode()], {type: "application/javascript"});

            $scope.jsUrl = URL.createObjectURL(jsBlob);
        };

        // save vidamo library file
        $scope.downloadLib = function(){
            $http.get("vidamo/module.js")
                .success(
                function(response) {
                    var libBlob = new Blob([response], {type: "application/javascript"});
                    $scope.libUrl = URL.createObjectURL(libBlob);
                }
            );
        };

    }]);