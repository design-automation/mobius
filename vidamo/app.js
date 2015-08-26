//
// VIDAMO App
//

var vidamo = angular.module('vidamo',
                            ['ui.layout',
                            'ui.ace',
                            'ui.bootstrap',
                            'ui.select',
                            'ngSanitize',
                            'ui.tree',
                            'flowChart',
                            'panzoom',
                            'xeditable',
                            'ui.bootstrap.contextMenu']);

    // Simple service to create a prompt.
    vidamo.service('prompt', function () {
        return prompt;
    });

    // configuration for angular-xeditable plugin
    // bootstrap3 theme. Can be also 'bs2', 'default'
    vidamo.run(function(editableOptions) {
        editableOptions.theme = 'bs3';
    });

    // config for ui-select plugin
    vidamo.config(function(uiSelectConfig) {
        uiSelectConfig.theme = 'bootstrap';
        uiSelectConfig.appendToBody = true;
    });

    // configuration of download files
    // config to add blob as safe prefix in the white list
    vidamo.config( [
        '$compileProvider',
        function( $compileProvider ) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob|data):/);
        }
    ]);

    // fixme not in use anymore
    // recursively searching by id
    // return target object
    function updateById(id, data, cate, value){
        for (var p in data) {
            if (data[p].id === id ) {
                if(data[p].hasOwnProperty(cate)){
                    data[p][cate] = value;
                    console.log('updatebyid: ',data[p]);
                }
            }
            if (data[p].nodes.length > 0) {
                updateById(id, data[p].nodes,cate,value);
            }
        }
        return null;
    }


    // check for the various File API support.
    function checkBrowser(){
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log('The File APIs are supported in this browser');
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    }

    checkBrowser();
