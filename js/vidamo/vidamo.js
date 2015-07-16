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

vidamo.config(function(uiSelectConfig) {
    uiSelectConfig.theme = 'select2';
    uiSelectConfig.appendToBody = true;
});

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