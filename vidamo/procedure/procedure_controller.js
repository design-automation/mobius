//
// vidamo procedure controller
//

// todo value of in/out connector is not used

vidamo.controller('procedureCtrl',['$scope','$rootScope','$filter','generateCode','nodeCollection',
    function($scope,$rootScope,$filter,generateCode,nodeCollection) {

        // toggle code view
        $scope.codeContent = '';
        $scope.toggleCodeContent = function(content){
            $scope.codeContent = content;
        };

        // synchronization with vidamo application data pool

        // inner function code for procedures
        $scope.innerCodeList = generateCode.getInnerCodeList();
        $scope.$watch('innerCodeList', function () {
            generateCode.setInnerCodeList($scope.innerCodeList);
        });
        $scope.$watch(function () { return generateCode.getInnerCodeList(); }, function () {
            $scope.innerCodeList = generateCode.getInnerCodeList();
        });

        // outer function code for procedures
        $scope.outerCodeList = generateCode.getOuterCodeList();
        $scope.$watch('outerCodeList', function () {
            generateCode.setOuterCodeList($scope.outerCodeList);
        });
        $scope.$watch(function () { return generateCode.getOuterCodeList(); }, function () {
            $scope.outerCodeList = generateCode.getOuterCodeList();
        });

        // procedure data list
        $scope.dataList = generateCode.getDataList();
        $scope.$watch('dataList', function () {
            generateCode.setDataList($scope.dataList);
        });
        $scope.$watch(function () { return generateCode.getDataList(); }, function () {
            $scope.dataList = generateCode.getDataList();
        });

        // interface data list
        $scope.interfaceList= generateCode.getInterfaceList();
        $scope.$watch('interfaceList', function () {
            generateCode.setInterfaceList($scope.interfaceList);
        });
        $scope.$watch(function () { return generateCode.getInterfaceList(); }, function () {
            $scope.interfaceList = generateCode.getInterfaceList();
        });

        // graph flowchart view model
        // pass by reference
        // deep watch chartViewModel.data instead of chartViewModel to prevent stack limit exceeded
        $scope.chartViewModel= generateCode.getChartViewModel();
        $scope.$watch('chartViewModel.data', function () {
            generateCode.generateCode();
        },true);

        $scope.$watch(function () { return generateCode.getChartViewModel(); }, function () {
            if(generateCode.getChartViewModel() !== $scope.chartViewModel){
                $scope.chartViewModel= generateCode.getChartViewModel();
            }
        });


        // currently selected node ID
        $scope.nodeIndex = '';

        // control types
        $scope.controlTypes = ['for each',
                                'if else'];

        // methods types
        $scope.methods = function(){
            var props = Object.getOwnPropertyNames(VIDAMO);
            var func_props = props.filter(function(property) {
                return typeof VIDAMO[property] == 'function';
            });

            var expression = ['expression'];
            return expression.concat(func_props);
        };


        // listen to the graph, when a node is clicked, update the procedure/ interface tabs
        $rootScope.$on("nodeIndex", function(event, message) {
            if(message){
                console.log(message)
                $scope.nodeIndex = message;

                $scope.currentNodeName = $scope.chartViewModel.nodes[$scope.nodeIndex].data.name;
                $scope.currentNodeType = $scope.chartViewModel.nodes[$scope.nodeIndex].data.type;

                // update the procedure tab

                $scope.data  = $scope.dataList[$scope.nodeIndex];

                // update the interface tab

                $scope.interface = $scope.interfaceList[$scope.nodeIndex];
            }
        });


        // watch change of procedure data tree, if change update the flattenData, update version
        $scope.$watch('interfaceList',function(){
            generateCode.generateCode();
        },true);

        $scope.$watch('data',function(){
            updateVersion();
            generateCode.generateCode();
            flattenData();
        } , true);


        $scope.$watch('interfaceList',function(){
            generateCode.generateCode();
            flattenData();
        },true);

        function updateVersion(){
            // compare current node procedure to original node type procedure
            // if change, update version
            if($scope.nodeIndex !== ''){
                var currentType = $scope.chartViewModel.nodes[$scope.nodeIndex].data.type;

                var currentProcedure = $scope.data;
                var typeProcedure = nodeCollection.getProcedureDataModel(currentType);

                if(!angular.equals(currentProcedure,typeProcedure)){
                    var d = new Date();
                    $scope.chartViewModel.nodes[$scope.nodeIndex].data.version = d.getTime();
                }
            }
        }
        function flattenData(){
            // flatten the procedure three for data searching
            var i, l,
                nodes=[],
                visited=[];

            function clone(n) {
                if(n['title'] == 'Data'){
                    var props=['id',
                        'title',
                        'type',
                        'dataName',
                        'dataValue',
                        'inputConnectors',
                        'outputConnectors']
                }
                else if(n['title'] == 'Action'){
                    var props=['id',
                        'title',
                        'dataName',
                        'dataValue',
                        'type',
                        'dataType',
                        'method',
                        'parameters',
                        'inputConnectors',
                        'outputConnectors']
                }
                else if(n['title'] == 'Control'){
                    var props=['id',
                        'title',
                        'controlType',
                        'nodes',
                        'type',
                        'dataName',
                        'forList',
                        'inputConnectors',
                        'outputConnectors']
                }


                var i,l,
                    result={};
                for (i = 0, l = props.length; i < l; i++) {
                    if (n[props[i]] || n[props[i]]  === undefined) {
                        result[props[i]]= n[props[i]];
                    }
                }
                return result;
            }

            function helper (node) {
                var i, limit;
                if (visited.indexOf(node.id) == -1) {
                    visited.push(node.id);
                    nodes.push(clone(node));
                    if( node.nodes) {
                        for (i = 0, limit = node.nodes.length; i < limit; i++) {
                            helper(node.nodes[i]);
                        }
                    }
                }
            }

            if($scope.data){
                for (i = 0, l = $scope.data.length; i < l; i++) {
                    helper($scope.data[i]);
                }
            }

            // object of flatten procedure data tree
            $scope.flattenData = nodes;

            // add interface data to flatten data for dropdown search
            $scope.flattenData.push.apply($scope.flattenData, $scope.interfaceList[$scope.nodeIndex]);

            $scope.checkDupDataName();
        };

        //
        // observing all procedures, if dataName duplicated, change type to 'assign'
        // indicating assign value to existing variable instead of creating new variable
        //
        $scope.checkDupDataName = function(){
            for(var i in $scope.flattenData){

                var previous;
                previous = $filter('positionFilter')($scope.data,$scope.flattenData[i].id,$scope);

                var current = $scope.flattenData[i];

                var hasDupName = false;

                // check duplication with current node's input/ouput connector
                for(var m in current.inputConnectors){
                    if(current.dataName === current.inputConnectors[m].name){
                        hasDupName = true;
                        var original;

                        for(var k in $scope.data){
                            original = $scope.data[k];

                            if(original.id ===  current.id){
                                original.type = 'assign';
                            }
                        }
                    }
                }

                for(var n in current.outputConnectors){
                    if(current.dataName === current.outputConnectors[m].name){
                        hasDupName = true;
                        var original;

                        for(var k in $scope.data){
                            original = $scope.data[k];

                            if(original.id ===  current.id){
                                original.type = 'assign';
                            }
                        }
                    }
                }


                // check duplication with previous defined dataName
                for(var j in previous){

                    if(current.dataName!= undefined && previous[j].dataName === current.dataName){

                        hasDupName = true;

                        var original;

                        for(var k in $scope.data){
                            original = $scope.data[k];

                            if(original.id ===  current.id){
                                original.type = 'assign';
                            }
                        }
                    }
                }
                if(!hasDupName){
                    var original;

                    for(var k in $scope.data){
                        original = $scope.data[k];

                        if(original.id ===  current.id){
                            original.type = 'new';
                        }
                    }
                }
            }
        };

        //
        // procedure manipulation
        //

        // remove a procedure
        $scope.remove = function(scope) {
            scope.remove();
        };

        $scope.toggle = function(scope) {
            scope.toggle();
        };

        // new parameter / procedure items
        $scope.newItem = function(cate,subCate) {
            try{
                if(cate == 'Data'){
                    $scope.data.push({
                        id: $scope.data.length  + 1,
                        title:  'Data',
                        nodes: [],
                        dataName:undefined,
                        dataValue:undefined,
                        // create new variable or assign value to existing variable
                        type:undefined
                    });
                } else if(cate == 'Action'){
                    var parameters = [];
                    var result;
                    var expression;

                    if(subCate === 'print' || subCate === 'expression'){
                        result = undefined;
                    }else{
                        result = '';
                    }

                    for(var funcName in VIDAMO) {
                        if(subCate === funcName){
                            var paraList = getParamNames(VIDAMO[funcName]);
                            for(var j = 0; j< paraList.length; j++){
                                parameters.push({value:'',type:paraList[j]});
                            }
                        }
                    }

                    $scope.data.push({
                        id: $scope.data.length  + 1,
                        title:  'Action',
                        nodes: [],
                        type:undefined,
                        expression:'',

                        // method name
                        method:subCate,

                        // method's arguments
                        parameters:parameters,

                        // method's return value
                        result:result,

                        // if the method is get data from input port, use following two as holder

                        dataName:undefined
                    }
                );

                } else if(cate == 'Control'){
                    switch(subCate){
                        case 'for each':
                            $scope.data.push({
                                id: $scope.data.length  + 1,
                                title:  'Control',
                                nodes: [],
                                // assign or create new
                                type:undefined,

                                // control type
                                controlType: subCate,

                                // for each
                                dataName:undefined,
                                forList:undefined

                            });
                            break;

                        case 'if else':
                            $scope.data.push({
                                id: $scope.data.length  + 1,
                                title:  'Control',
                                nodes: [
                                    {
                                        id: $scope.data.length  + 'if',
                                        title:  'Control',
                                        controlType:'if',
                                        nodes: [],
                                        ifExpression:undefined

                                    },
                                    {
                                        id: $scope.data.length  + 'else',
                                        title:  'Control',
                                        controlType:'else',
                                        nodes: []
                                    }
                                ],

                                controlType: subCate

                            });
                            break;
                    }
                }
            }
            catch(err){
                document.getElementById('log').innerHTML += "<div style='color: red'>Error: no node selected!</div>";
            }

        };

        // add new item in interface

        $scope.newInterface = function(cate) {

            try{
                if(cate == 'Parameter'){
                    $scope.interface.push({
                        id: $scope.interface.length  + 1,
                        title:  'Data',
                        temp: 'Parameter',

                        dataName:undefined,
                        dataValue:undefined

                    });
                }
            }
            catch(err){
                document.getElementById('log').innerHTML += "<div style='color: red'>Error: no node selected!</div>";
            }
        };
    }]);