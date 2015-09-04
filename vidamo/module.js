//
// VIDAMO module
//

var VIDAMO = ( function (mod){

    // print data method

    mod.print = function(content){
        // try to find vidamo web app, if found print in vidamo console
        // todo will there be an error?
        this.content = content;
        try{
            var logString = "<div style='color: green;'>" + this.content + '</div>';
            document.getElementById('log').innerHTML += logString;
        }catch(err){
            console.log('warnning: vidamo web app not connected.');
        }
    }

    return mod;

})(window.VIDAMO || {});