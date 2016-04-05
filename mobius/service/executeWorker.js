self.addEventListener('message', function(e) {
    importScripts('../../assets/js/verb/verb.js');
    importScripts('../../assets/js/verb/verbToThreeConversion.js');
    importScripts('../../mobius/app/datastructure.js');
    importScripts('../../assets/js/threejs/three.js');
    importScripts('../../mobius/service/dataConversion.js');
    importScripts('../../mobius/module/module_verb.js');

    var output = new Function(e.data)();
    var outputString = JSON.stringify(output);

    self.postMessage(outputString);
}, false);