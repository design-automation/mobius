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