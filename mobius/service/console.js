mobius.factory('consoleMsg', function () {

    function autoScroll(){
        var consoleDiv = document.getElementById("log");
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    function timeMsg(){
        var d = new Date();
        return d.getHours() + ':' + d.getMinutes() + ':'+ d.getSeconds();
    }

    function runtimeMsg(){

    }

    return{
        confirmMsg:
            function(msgType){
                var printMsg;
                switch(msgType) {
                    case 'sceneImport':printMsg = 'Scene imported.';break;
                    case 'nodeImport':printMsg = 'Node imported.';break;
                    case 'typeAdded':printMsg = 'New type added.';break;
                    case 'typeOverwritten':printMsg = 'Type is overwritten.';break;
                    case 'newSceneCreated': printMsg = 'New Scene created.';break;
                    case 'exampleImport': printMsg = 'Example loaded'; break;
                }

                printMsg = timeMsg() + ":" + printMsg;
                document.getElementById('log').innerHTML += "<div style='color: green'> " + printMsg + "</div>";
                autoScroll();
            },

        errorMsg:
            function(msgType){
                var printMsg;
                switch(msgType) {
                    case 'invalidFileType':printMsg = 'Error: File type is not Json.';break;
                    case 'noNode':printMsg = 'No node selected.';break;
                    case 'invalidName':printMsg = 'invalidName.';break;
                    case 'dupName':printMsg = 'The node type name is duplicated.';break;
                    case 'notWritable': printMsg = 'This node is not overwrittable.';break;
                }

                printMsg = timeMsg() + ":" + printMsg;
                document.getElementById('log').innerHTML += "<div style='color: red'> " + printMsg + "</div>";
                autoScroll();
            },
        runtimeMsg:
            function(error){
                if(error){
                    printMsg = timeMsg() + ":" + error +".";
                    document.getElementById('log').innerHTML += "<div style='color: red'> " + printMsg + "</div>";
                }else{
                    printMsg = timeMsg() + ":" +  "Execution done.";
                    document.getElementById('log').innerHTML += "<div style='color: green'> " + printMsg + "</div>";
                }
                autoScroll();
            },
        execMsg:
            function(){
                return new Promise(function (resolve){
                    printMsg = timeMsg() + ":" + 'Executing ... Please wait ...' +".";
                    document.getElementById('log').innerHTML += "<div style='color: green'> " + printMsg + "</div>"
                    setTimeout(function(){
                        resolve(true);
                    },100);
                });
            }
    }

});
