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
                            'ui.bootstrap.contextMenu',
                                'cfp.hotkeys']);

    // Simple service to create a prompt.
    // todo replace with customizable one
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


    // check for the various browser support.
    function checkBrowser(){
        // html5 file api
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log('File APIs are fully supported in this browser.');
        } else {
            alert('File APIs are not fully supported in this browser.');
        }

        // html5 localstorage
        if( 'localStorage' in window && window['localStorage'] !== null){
            console.log('Local storage is supported in this browser.');
        } else {
            alert('Local storage is not supported in this browser');
        }
    }

    // regex to get parameter names
    // solution found in http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
    // fixme should there be a way to do it in angularjs?
    var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    function getParamNames(func) {
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if(result === null)
            result = [];
        return result;
    }

    checkBrowser();
