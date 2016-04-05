mobius.factory('executeService', function ($q) {

    var worker = new Worker('mobius/service/executeWorker.js');
    var defer = $q.defer();

    worker.addEventListener('message', function(e) {
        defer.resolve(e.data);
    }, false);


    return{
        execute: function(code){
            worker.postMessage(code);
            return defer.promise;
        }
    }
});

