//
// Controller for menubar
//

mobius.controller('menuCtrl',['$scope','$rootScope','$timeout','consoleMsg','generateCode','nodeCollection','$http','hotkeys','$mdDialog',
    function($scope,$rootScope,$timeout,consoleMsg,generateCode,nodeCollection,$http,hotkeys,$mdDialog){

        // store json url
        $scope.sceneUrl= '';
        $scope.jsUrl = '';
        $scope.libUrl = '';
        $scope.nodeUrl = '';
        $scope.nodeLibUrl = '';
        $scope.outputHolder = undefined;

        // listen to graph to get current selected node
        // for export selected node
        $rootScope.$on("nodeIndex", function(event, message) {
            $scope.nodeIndex = message;
        });

        // create new scene

        $scope.newScene = function () {

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'mobius/template/newScene_dialog.tmpl.html',
                parent: angular.element(document.body),
                //targetEvent: ev,
                clickOutsideToClose:false
            })
                .then(function(answer) {
                    if(answer === 'save'){
                        $scope.sceneUrl= '';

                        setTimeout(function(){
                            document.getElementById('saveSceneJson').click();
                        },0);

                        setTimeout(function(){

                            if($scope.sceneUrl !== ''){
                                newScene();
                            }
                        },250);
                    }else{
                        newScene();
                    }


                    },
                function() {});

            function newScene(){
                $rootScope.$broadcast('clearProcedure');

                // reset procedure / interface / graph and refresh viewport
                generateCode.setChartViewModel(new flowchart.ChartViewModel({
                        "nodes": [],
                        "connections": []
                    }
                ));
                generateCode.setDataList([]);
                generateCode.setInterfaceList([]);

                var scope = angular.element(document.getElementById('threeViewport')).scope();
                var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

                setTimeout(function(
                ){
                    scope.$apply(function(){scope.viewportControl.refreshView();} );
                    scopeTopo.$apply(function(){scopeTopo.topoViewportControl.refreshView();} );
                },0);

                consoleMsg.confirmMsg('newSceneCreated');
                //$rootScope.$broadcast('runNewScene');
            }
        };

        $scope.loadExample = function(exampleFile){
            $http({
                method: 'GET',
                url: 'examples/' + exampleFile,
                data: {},
                transformResponse: function (data) {
                    // since example files is not standard .json and can't parse correctly by $http
                    // overwrite the default response
                    return data;
                }
            }).success(
                function(response) {

                    $rootScope.$broadcast('clearProcedure');

                    var graphJsonString;
                    var procedureJsonString;
                    var interfaceJsonString;
                    var graphJsonObj;
                    var procedureJsonObj;
                    var interfaceJsonObj;

                    graphJsonString = response.split("//procedure json")[0];
                    var secondhalf = response.split("//procedure json")[1];
                    procedureJsonString = secondhalf.split("//interface json")[0];
                    interfaceJsonString = secondhalf.split("//interface json")[1];

                    graphJsonObj = JSON.parse(graphJsonString);
                    procedureJsonObj = JSON.parse(procedureJsonString);
                    interfaceJsonObj = JSON.parse(interfaceJsonString);

                    generateCode.setChartViewModel(new flowchart.ChartViewModel(graphJsonObj));
                    generateCode.setDataList(procedureJsonObj);
                    generateCode.setInterfaceList(interfaceJsonObj);

                    // fixme modulization need
                    // dynamically link input and output from graph and procedure
                    for(var i =0; i < generateCode.getChartViewModel().nodes.length; i++){
                        for(var j = 0 ; j < generateCode.getChartViewModel().nodes[i].outputConnectors.length; j++ ){
                            $scope.outputHolder = undefined;
                            if( generateCode.getChartViewModel().nodes[i].outputConnectors[j].data.name !== 'FUNC_OUTPUT') {
                                $scope.searchOutput(generateCode.getDataList()[i],generateCode.getChartViewModel().nodes[i].outputConnectors[j].data);
                                generateCode.getChartViewModel().nodes[i].outputConnectors[j].data = $scope.outputHolder;
                            }
                        }
                    }


                    for(var i =0; i < generateCode.getChartViewModel().nodes.length; i++) {
                        for (var j = 0; j < generateCode.getChartViewModel().nodes[i].inputConnectors.length; j++) {
                            for (var k = 0; k < generateCode.getInterfaceList()[i].length; k++) {
                                if (generateCode.getInterfaceList()[i][k].title === 'Input') {
                                    if (generateCode.getChartViewModel().nodes[i].inputConnectors[j].data.id
                                        === generateCode.getInterfaceList()[i][k].id) {
                                        generateCode.getChartViewModel().nodes[i].inputConnectors[j].data =
                                            generateCode.getInterfaceList()[i][k];
                                    }
                                }
                            }
                        }
                    }

                    consoleMsg.confirmMsg('exampleImport');
                    generateCode.generateCode();

                    var scope = angular.element(document.getElementById('threeViewport')).scope();
                    var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

                    setTimeout(function(
                    ){
                        scope.$apply(function(){scope.viewportControl.refreshView();} );
                        scopeTopo.$apply(function(){scopeTopo.topoViewportControl.refreshView();} );
                       // $rootScope.$broadcast('runNewScene');
                    },0);
                }
            );
        };


        // open and read json file for scene
        $scope.openSceneJson = function(files){
            var f = files[0];
            var jsonString;
            var graphJsonString;
            var procedureJsonString;
            var interfaceJsonString;
            var graphJsonObj;
            var procedureJsonObj;
            var interfaceJsonObj;

            var reader = new FileReader();

            $rootScope.$broadcast('clearProcedure');

            reader.onload = (function () {
                return function (e) {

                    if(f.name.split('.').pop() == 'json') {

                        jsonString = e.target.result;

                        graphJsonString = jsonString.split("//procedure json")[0];
                        var secondhalf = jsonString.split("//procedure json")[1];
                        procedureJsonString = secondhalf.split("//interface json")[0];
                        interfaceJsonString = secondhalf.split("//interface json")[1];

                        graphJsonObj = JSON.parse(graphJsonString);
                        procedureJsonObj = JSON.parse(procedureJsonString);
                        interfaceJsonObj = JSON.parse(interfaceJsonString);


                        // update the graph
                        generateCode.setChartViewModel(new flowchart.ChartViewModel(graphJsonObj));

                        // update the procedure
                        generateCode.setDataList(procedureJsonObj);

                        // update the interface
                        generateCode.setInterfaceList(interfaceJsonObj);

                        // dynamically link input and output from graph and procedure
                        // recursive search for node outputs
                        for(var i =0; i < generateCode.getChartViewModel().nodes.length; i++){
                            for(var j = 0 ; j < generateCode.getChartViewModel().nodes[i].outputConnectors.length; j++ ){
                                $scope.outputHolder = undefined;
                                if( generateCode.getChartViewModel().nodes[i].outputConnectors[j].data.name !== 'FUNC_OUTPUT'){
                                    $scope.searchOutput(generateCode.getDataList()[i],generateCode.getChartViewModel().nodes[i].outputConnectors[j].data);
                                    generateCode.getChartViewModel().nodes[i].outputConnectors[j].data = $scope.outputHolder;
                                }
                            }
                        }

                        for(var i =0; i < generateCode.getChartViewModel().nodes.length; i++) {
                            for (var j = 0; j < generateCode.getChartViewModel().nodes[i].inputConnectors.length; j++) {
                                for (var k = 0; k < generateCode.getInterfaceList()[i].length; k++) {
                                    if (generateCode.getInterfaceList()[i][k].title === 'Input') {
                                        if (generateCode.getChartViewModel().nodes[i].inputConnectors[j].data.id
                                            === generateCode.getInterfaceList()[i][k].id) {
                                            generateCode.getChartViewModel().nodes[i].inputConnectors[j].data =
                                                generateCode.getInterfaceList()[i][k];
                                        }
                                    }
                                }
                            }
                        }


                        consoleMsg.confirmMsg('sceneImport');
                    }else{
                        consoleMsg.errorMsg('invalidFileType');
                    }
                    generateCode.generateCode();
                };
            })(f);


            reader.readAsText(f);

            var scope = angular.element(document.getElementById('threeViewport')).scope();
            var scopeTopo = angular.element(document.getElementById('topoViewport')).scope();

            setTimeout(function(
            ){
                scope.$apply(function(){scope.viewportControl.refreshView();} );
                scopeTopo.$apply(function(){scopeTopo.topoViewportControl.refreshView();} );
                //$rootScope.$broadcast('runNewScene');
            },0);

        };



        // support function to dynamiclly link output connectors
        $scope.searchOutput = function(tree, nodeData){
            if(tree.length > 0){
                for(var i = 0; i <tree.length; i++){
                    if(tree[i].title === 'Output' && nodeData.id === tree[i].id){
                        $scope.outputHolder = tree[i];
                    }else{
                        if(tree[i].nodes){
                            $scope.searchOutput(tree[i].nodes,nodeData);
                        }
                    }
                }
            }
        };

        // save json file for scene
        $scope.saveSceneJson = function(){

            var graphJson = JSON.stringify(generateCode.getChartViewModel().data, null, 4);

            var procedureJson = JSON.stringify(generateCode.getDataList(), null, 4);

            var interfaceJson = JSON.stringify(generateCode.getInterfaceList(), null, 4);


            var sceneBlob = new Blob([graphJson + '\n\n' + '//procedure json\n'
                                    + procedureJson + '\n\n' + '//interface json\n'
                                    + interfaceJson], {type: "application/json"});

            $scope.sceneUrl = URL.createObjectURL(sceneBlob);
            return true;
        };


        // redo / undo emit to graph controller
        // fixme seperate module for undo/redo

        $scope.undo = function(){
            $rootScope.$broadcast('undo')
        };

        $scope.redo = function(){
            $rootScope.$broadcast('redo')
        };

        // import pre-defined node
        // fixme potentially malfunction since input and output are not dynamically linked
        // fixme so far so good
        $scope.importNode = function (files) {

            var jsonString;
            var nodeJsonString;
            var procedureJsonString;
            var interfaceJsonString;

            var nodeJsonObj;
            var procedureJsonObj;
            var interfaceJsonObj;

            for(var i = 0; i < files.length ; i ++ ){
                var f = files[i];

                var reader = new FileReader();

                reader.onload = (function () {

                    return function (e) {
                        if(f.name.split('.').pop() == 'json') {

                            jsonString = e.target.result;

                            nodeJsonString = jsonString.split("//procedure json")[0];

                            var temp = jsonString.split("//procedure json")[1];
                            procedureJsonString = temp.split("//interface json")[0];
                            interfaceJsonString = temp.split("//interface json")[1];

                            nodeJsonObj = JSON.parse(nodeJsonString);
                            procedureJsonObj = JSON.parse(procedureJsonString);
                            interfaceJsonObj = JSON.parse(interfaceJsonString);
                            var newNodeName = nodeJsonObj.type;

                            // install new imported node into nodeCollection
                            nodeCollection.installNewNodeType(newNodeName,
                                                                nodeJsonObj.inputConnectors,
                                                                nodeJsonObj.outputConnectors,
                                                                procedureJsonObj,
                                                                interfaceJsonObj);

                            consoleMsg.confirmMsg('nodeImport');
                        }else{
                            consoleMsg.errorMsg('invalidFileType');
                        }
                    };
                })(f);

                reader.readAsText(f);
            }
        };

        // export selected node
        // nodeType follows the original node name
        $scope.exportNode = function (){

            if($scope.nodeIndex === undefined){
                consoleMsg.errorMsg('noNode');
            }

            var nodeJson = JSON.stringify(generateCode.getChartViewModel().nodes[$scope.nodeIndex].data, null, 4);

            var procedureJson = JSON.stringify(generateCode.getDataList()[$scope.nodeIndex], null, 4);

            var interfaceJson = JSON.stringify(generateCode.getInterfaceList()[$scope.nodeIndex], null, 4)

            var nodeBlob = new Blob([nodeJson + '\n\n' +
                                    '//procedure json\n' + procedureJson + '\n\n' +
                                    '//interface json\n' + interfaceJson +'\n\n\n\n'],
                                    {type: "application/json"});

            $scope.nodeUrl = URL.createObjectURL(nodeBlob);
        };

        // export node library in current local storage
        $scope.exportNodeLib = function (){
            var allType = JSON.parse(localStorage.mobiusNodeTypes);
            var typeToExport = [];

            for(var i =0; i< allType.length ; i++){
                if(allType[i].overwrite !== false){
                    typeToExport.push(allType[i]);
                }
            }

            var typesJson = JSON.stringify(typeToExport,null,4);
            var typesBlob = new Blob([typesJson], {type: "application/json"});

            $scope.nodeLibUrl = URL.createObjectURL(typesBlob);
        };


        // import node library to current local storage
        $scope.importNodeLib = function(files){

            for(var i = 0; i < files.length ; i ++ ){
                var f = files[i];

                var reader = new FileReader();

                reader.onload = (function () {

                    return function (e) {
                        if(f.name.split('.').pop() == 'json') {
                            var jsonString = e.target.result;
                            var types = JSON.parse(jsonString);

                            var currentTypes = JSON.parse(localStorage.mobiusNodeTypes);
                            for(var i = 0; i < types.length; i++ ){
                                currentTypes.push(types[i]);
                            }

                            localStorage.mobiusNodeTypes = JSON.stringify(currentTypes);

                            nodeCollection.syncNodeTpyeStorage();

                            consoleMsg.confirmMsg('nodeImport');
                        }else{
                            consoleMsg.errorMsg('invalidFileType');
                        }
                    };
                })(f);

                reader.readAsText(f);
            }

        }

        // save generated js file
        $scope.downloadJs = function(){

            var jsBlob = new Blob([generateCode.getJavascriptCode()], {type: "application/javascript"});

            $scope.jsUrl = URL.createObjectURL(jsBlob);
        };

        // save mobius library file
        $scope.downloadLib = function(){
            $http.get("mobius/module.js")
                .success(
                function(response) {
                    var libBlob = new Blob([response], {type: "application/javascript"});
                    $scope.libUrl = URL.createObjectURL(libBlob);
                }
            );
        };

        $scope.toggleCheatSheet = function(){
            hotkeys.toggleCheatSheet();
        };


        // emit to viewport controller for view splitting
        $scope.singleView = function(){
            $rootScope.$broadcast('singleView');
        };

        $scope.fourViews = function(){
            $rootScope.$broadcast('fourViews');
        }
    }]);