//
// vidamo procedure controller
//

// todo value of in/out connector is not used

vidamo.controller('procedureCtrl',['$scope','$rootScope','$filter','generateCode',
    function($scope,$rootScope,$filter,generateCode) {

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

        // procedure select dropdown types
        // data types

        // control types
        $scope.controlTypes = ['for each',
                                'if else'];

        // methods types
        $scope.methods = [
            //{name:'get input', usage:'I/O'},
            {name:'set output', usage:'I/O'},
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

            // observing all data procedures, if duplicated, change type to 'assign'
            // indicating assign value to existing variable instead of creating new variable
            for(var i in $scope.flattenData){
                var previous;
                previous = $filter('positionFilter')($scope.data,$scope.flattenData[i].id,$scope);

                // if is data
                if($scope.flattenData[i].title === 'Data'){
                    for(var j in previous){
                        // with same dataName in previous
                        if(previous[j].dataName === $scope.flattenData[i].dataName){
                            for(var k in $scope.data){
                                if($scope.data[k].id ===  $scope.flattenData[i].id){
                                    $scope.data[k].type = 'assign';
                                    console.log('this is assign!')
                                }
                                if($scope.data[k].id === previous[j].id){
                                    $scope.data[k].type = 'new';
                                }
                            }
                        }
                    }
                }
            }
        }, true);

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



        $scope.newItem = function(cate,type) {
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
                    switch(type){
                        case 'print':
                            parameters.push({type:'variable', value:'variable to print'});
                            result = undefined;
                            break;
                    }

                    $scope.data.push({
                        id: $scope.data.length  + 1,
                        title:  'Action',
                        nodes: [],

                        // method name
                        method:type,

                        // method's arguments
                        parameters:parameters,

                        // method's return value
                        result:result,

                        // if the method is get data from input port, use following two as holder

                        dataType:undefined,
                        dataName:undefined,
                        dataValue:undefined,
                        inputConnectors: $scope.chartViewModel.nodes[$scope.nodeIndex].data.inputConnectors,
                        outputConnectors:$scope.chartViewModel.nodes[$scope.nodeIndex].data.outputConnectors
                    }
                );

                } else if(cate == 'Control'){
                    switch(type){
                        case 'for each':
                            $scope.data.push({
                                id: $scope.data.length  + 1,
                                title:  'Control',
                                nodes: [],
                                controlType: type,

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

                                controlType: type,

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

        //onchange write the input value

        $scope.applyValue = function (cate, value,location){
            switch (cate){

                case 'dataName':
                    location.dataName = value;;
                    break;

                //
                // ----------- cases for data procedure -----------
                //

                case 'dataValue':
                    location.dataValue = value;
                    break;

                //
                // ----------- cases for action procedure -----------
                //

                case 'method':
                    location.method = value;
                    location.dataName = undefined;
                    location.parameters[0] = undefined;
                    location.parameters[1] = undefined;
                    location.parameters[2] = undefined;
                    break;

                // set output method
                // parameters[0]:  output port
                // parameters[2]:  dataName

                case 'outputPort':
                    location.parameters[0] = value;
                    break;

                case 'outputDataName':
                    location.parameters[2] = value;
                    break;

                // get input method
                // parameters[0]: input port index
                case 'inputPort':
                    location.parameters[0] = value;
                    break;

                // print data method
                // parameters[0]: name of data to be printed
                case 'printDataName':
                    location.parameters[0] = value;
                    break;


                // list length
                // parameter[0]: target list
                // dataName: variable name to store list length

                case 'targetList':
                    location.parameters[0] = value;
                    break;


                // list item
                // parameters[0]: target list
                // parameters[1]: sorting category (alphabetic or numeric)
                // dataName: variable name to store list item
                case 'itemIndex':
                    location.parameters[1] = value;
                    break;

                // sort list
                case 'category':
                    location.parameters[1] = value;
                    break;

                // reverse list
                // parameters[0]: target list
                // dataName: variable name to store list item

                // combine list
                // parameters[0]: first list
                // parameters[1]: second list
                // dataName: variable name to store combined list
                case  'targetList1':
                    location.parameters[0] = value;
                    break;

                case 'targetList2':
                    location.parameters[1] = value;
                    break;

                //insert item to list


                //
                // ----------- control procedure -----------
                //

                case 'controlType':
                    location.controlType = value;
                    break;

                case 'forList':
                    location.forList  = value;
                    break;

                // ----------- add data to interface ------------
                // parameter0: dataValue parameter1: dataName parameter2: node id

                case 'addToInterface':
                    location.dataName = value.dataName;
                    location.dataValue = value.dataValue;
                    location.id = value.id;
                    break;

                // change data in interface and synchronize with procedure

                case 'interfaceValue':
                    location.dataValue = value;
                    updateById(location.id, $scope.data,'dataValue',value);
                    break;
            }
        };

        // add new item in interface

        $scope.newInterface = function(cate) {

            try{
                if(cate == 'Data'){
                    $scope.interface.push({
                        id: $scope.data.length  + 1,
                        title:  'Data',
                        dataName:'',
                        parameters:[],
                        dataValue:'',
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