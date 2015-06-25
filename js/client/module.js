//
// VIDAMO module
//

var VIDAMO= ( function (mod){

    // print data method

    mod.print_data = function(content){
        console.log('from VIDAMO: ', content);

        // try to find vidamo web app, if found print in vidamo console
        //todo will there be an error?
        try{
            var logString = "<div style='color: green;'>" + content + '</div>';
            document.getElementById('log').innerHTML += logString;
        }catch(err){
            console.log('warnning: vidamo web app not connected.');
        }
    }

    return mod;

})(window.VIDAMO || {});