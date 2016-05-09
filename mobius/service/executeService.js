mobius.factory('executeService', function ($q) {
    return{
        execute: function(code){
            var deferred = $q.defer();
            var outputs = new Function(code)();
            deferred.resolve(outputs);
            return deferred.promise;
        }
    }
});