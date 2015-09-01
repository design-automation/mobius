//
// vidamo procedure controller
//

// todo value of in/out connector is not used

vidamo.controller('procedureCtrl',['$scope','$rootScope','$filter','generateCode',
    function($scope,$rootScope,$filter,generateCode) {

        $scope.codeContent = '';
        $scope.toggleCodeContent = function(content){
            $scope.codeContent = content;
        };

        // synchronization with vidamo application data pool

        // function code for procedures
        $scope.codeList = generateCode.getCodeList();
        $scope.$watch('codeList', function () {
            generateCode.setCodeList($scope.codeList);
        });
        $scope.$watch(function () { return generateCode.getCodeList(); }, function () {
            $scope.codeList = generateCode.getCodeList();
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
        $scope.chartViewModel= generateCode.getChartViewModel();
        $scope.$watch('chartViewModel', function () {
            generateCode.setChartViewModel($scope.chartViewModel);
        });
        $scope.$watch(function () { return generateCode.getChartViewModel(); }, function () {
            $scope.chartViewModel = generateCode.getChartViewModel();
        });


        // currently selected node ID
        $scope.nodeIndex = '';

        // control types
        $scope.controlTypes = ['for each',
                                'if else'];

        // methods types
        $scope.methods = [
            //{name:'get input', usage:'I/O'},
            //{name:'set output', usage:'I/O'},
            {name: 'print', usage:'General'},
            //{name: 'list length', usage:'List'},
            //{name: 'list item', usage:'List'},
            //{name: 'sort list', usage:'List'},
            //{name: 'reverse list', usage:'List'},
            //{name: 'combine lists', usage:'List'}
        ];

        // listen to the graph, when a node is clicked, update the procedure/ interface tabs
        $rootScope.$on("nodeIndex", function(event, message) {
            $scope.nodeIndex = message;

            $scope.currentNodeName = $scope.chartViewModel.nodes[$scope.nodeIndex].data.name;

            // update the procedure tab

            $scope.data  = $scope.dataList[$scope.nodeIndex];

            // update the interface tab

            $scope.interface = $scope.interfaceList[$scope.nodeIndex];
        });


        // watch change of procedure data tree, if change update the flattenData

        $scope.$watch('interfaceList',function(){
            generateCode.generateCode();
        },true);

        $scope.$watch('data', function(){
            //update generatedCodd
            generateCode.generateCode();

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
            $scope.checkDupDataName();
        }, true);

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
                                console.log('yes');
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
                        type:undefined,
                        inputConnectors: $scope.chartViewModel.nodes[$scope.nodeIndex].data.inputConnectors,
                        outputConnectors:$scope.chartViewModel.nodes[$scope.nodeIndex].data.outputConnectors
                    });
                } else if(cate == 'Action'){
                    var parameters = [];
                    var result;
                    switch(subCate){
                        case 'print':
                            parameters.push({type:'variable', value:'variable to print'});
                            result = undefined;
                            break;
                    }

                    $scope.data.push({
                        id: $scope.data.length  + 1,
                        title:  'Action',
                        nodes: [],
                        type:undefined,

                        // method name
                        method:subCate,

                        // method's arguments
                        parameters:parameters,

                        // method's return value
                        result:result,

                        // if the method is get data from input port, use following two as holder

                        dataName:undefined,
                        inputConnectors: $scope.chartViewModel.nodes[$scope.nodeIndex].data.inputConnectors,
                        outputConnectors:$scope.chartViewModel.nodes[$scope.nodeIndex].data.outputConnectors
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
                                forList:undefined,

                                inputConnectors: $scope.chartViewModel.nodes[$scope.nodeIndex].data.inputConnectors,
                                outputConnectors:$scope.chartViewModel.nodes[$scope.nodeIndex].data.outputConnectors
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

                                controlType: subCate,

                                inputConnectors: $scope.chartViewModel.nodes[$scope.nodeIndex].data.inputConnectors,
                                outputConnectors:$scope.chartViewModel.nodes[$scope.nodeIndex].data.outputConnectors
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

                        //overwrite:false,

                        dataName:undefined,
                        dataValue:undefined,

                        inputConnectors: $scope.chartViewModel.nodes[$scope.nodeIndex].data.inputConnectors,
                        outputConnectors:$scope.chartViewModel.nodes[$scope.nodeIndex].data.outputConnectors,
                    });
                }
            }
            catch(err){
                document.getElementById('log').innerHTML += "<div style='color: red'>Error: no node selected!</div>";
            }
        };

    }]);