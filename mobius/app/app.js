// @mobius app module


// for the module
var MOBIUS = {}; 
var MOBIUS_MODULES = {};

var mobius = angular.module('mobius',
                            [
                                'ui.layout',
                                'ui.ace',
                                'ui.bootstrap',
                                'ui.select',
                                'ngSanitize',
                                'ui.tree',
                                'ui.grid',
                                'ui.grid.grouping',
                                'flowChart',
                                'panzoom',
                                'xeditable',
                                'ui.grid.resizeColumns',
                                'ui.grid.autoResize',
                                'cfp.hotkeys',
                                'ngMaterial',
                                'ngRoute',
                                'ng-context-menu',
                                'decipher.history',
                                'angularSpinner'
                            ]);

    mobius.filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function(item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    });

    // Simple service to create a prompt.
    // fixme not using
    mobius.service('prompt', function () {
        return prompt;
    });

    // configuration for angular-xeditable plugin
    // bootstrap3 theme. Can be also 'bs2', 'default'
    mobius.run(function(editableOptions) {
        editableOptions.theme = 'bs3';
    });

    // config for ui-select plugin
    mobius.config(function(uiSelectConfig) {
        uiSelectConfig.theme = 'bootstrap';
        uiSelectConfig.appendToBody = false;
    });

    // configuration of download files
    // config to add blob as safe prefix in the white list
    mobius.config( [
        '$compileProvider',
        function( $compileProvider ) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob|data):/);
        }
    ]);

    // modules
    mobius.service('moduleList', function($rootScope) {

        var o = {
            moduleList : [],
            selected : {}
        }

        o.changeModule = function(index_or_name){
            
            var flag = false;

            for(var i=0; i < o.moduleList.length; i++){
                if(i==index_or_name || o.moduleList[i].name == index_or_name){
                    o.moduleList[i].selected = true;
                    o.selected = o.moduleList[i];
                    flag = true;
                }
                else{
                    o.moduleList[i].selected = false;
                }
            }

            if(flag){
                MOBIUS = MOBIUS_MODULES[o.selected.name]; 
                $rootScope.$broadcast('moduleChanged');
            }
            else{
                alert("Error! Module requested not found.");
            }

        }


        for(p in MOBIUS_MODULES){ 
            if(MOBIUS_MODULES.hasOwnProperty(p)){
                o.moduleList.push({name: p, selected: false});
            }
        }

        // default option
        o.changeModule(0); 

        return o;
    })


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
        // file api
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log('File APIs are fully supported in this browser.');
        } else {
            alert('File APIs are not fully supported in this browser.');
        }

        // localstorage
        if( 'localStorage' in window && window['localStorage'] !== null){
            console.log('Local storage is supported in this browser.');
        } else {
            alert('Local storage is not supported in this browser');
        }

        if(typeof(Worker) !== "undefined") {
            console.log('Web Worker is supported in this browser.');
        } else {
            alert('Web Worker is not supported in this browser');
        }

        var ua= navigator.userAgent, tem,
            M= ua.match(/(opera|chrome|safari|firefox|msie|trident|Edge(?=\/))\/?\s*(\d+)/i) || [];

        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            console.log('Chrome detected, your browser is supported.')
        }else{
            if(/trident/i.test(M[1])){
                tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                 var browserId = 'IE '+(tem[1] || '');
            }
            else{
                M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
                if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
                var browserId = M.join(' ');
            }
            alert('Your browser is ' + browserId +', Mobius currently only supports chrome.');
            window.location.href = "../../index.html"
        }
    }



    // regex to get parameter names
    // solution found in http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
    var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    function getParamNames(func) {
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if(result === null)
            result = [];
        return result;
    }



    $(document).keydown(function(e) {
        var doPrevent;
        if (e.keyCode == 8) {
            var d = e.srcElement || e.target;
            if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
                doPrevent = d.readOnly || d.disabled;
            }
            else
                doPrevent = true;
        }
        else
            doPrevent = false;


        if (doPrevent)
            e.preventDefault();
    });

    // customized file input tag with data binding
    mobius.directive("fileread", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            var d = new Date();
                            var fileName =  "file_" +  d.getTime();
                            MOBIUS[fileName]=  JSON.parse(loadEvent.target.result);
                            scope.fileread = 'MOBIUS.' + fileName;
                        });
                    }
                    reader.readAsText(changeEvent.target.files[0]);
                });
            }
        }
    }]);

    checkBrowser();


    //
    //  For the Help Dialog
    //
    mobius.config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
            .primaryPalette('grey')
            .accentPalette('blue-grey');
    });









