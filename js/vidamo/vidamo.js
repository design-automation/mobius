//
// VIDAMO App
//

var vidamo = angular.module('vidamo', ['ui.layout','ui.ace','ui.bootstrap','ui.select','ngSanitize','ui.tree','flowChart','panzoom'])

// Utilities

// Simple service to create a prompt.
vidamo.factory('prompt', function () {
    // Return the browsers prompt function.
    return prompt;
})

// config to add blob as safe prefix in the white list
vidamo.config( [
    '$compileProvider',
    function( $compileProvider )
    {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob|data):/);
    }
]);

// config for ui-select
vidamo.config(function(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
    uiSelectConfig.appendToBody = true;
});


//************************ Filters ************************

// filter for procedure dataName
vidamo.filter('dataNameFilter', function() {
    return function( items) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if( item.dataName){
                filtered.push(item);
            }
        });
        return filtered;
    };
});

// filter for procedure position
vidamo.filter('positionFilter', function() {
    return function( items, currentId, scope) {
        var filtered = [];
        var index = -1;

        for(var i = 0, len = scope.flattenData.length; i < len; i++) {
            if (scope.flattenData[i].id === currentId) {
                index = i;
                break;
            }
        }

        angular.forEach(items, function(item) {
            var tempIndex = -1;

            for(var i = 0, len = scope.flattenData.length; i < len; i++) {
                if (scope.flattenData[i].id === item.id) {
                    tempIndex = i;
                    break;
                }
            }

            if(tempIndex <= index){
                filtered.push(item);
            }
        });

        return filtered;
    };
});

// filter to check if the procedure is a data procedure
vidamo.filter('dataFilter', function() {
    return function( items) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if( item.title == 'Data'){
                filtered.push(item);
            }
        });
        return filtered;
    };
});

// todo such function in better angular structure
// recursively searching by id
// return target object
function updateById(id, data, cate, value){
    for (var p in data) {
        if (data[p].id === id ) {
            if(data[p].hasOwnProperty(cate)){
                data[p][cate] = value;
                console.log(data[p]);
            }
        }
        if (data[p].nodes.length > 0) {
            console.log('there are nodes!');
            updateById(id, data[p].nodes,cate,value);
        }
    }
    return null;
};