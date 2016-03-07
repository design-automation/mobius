mobius.factory('executeService', function ($q) {
    return{
        execute: function(jsCode, geomCode){
            var deferred = $q.defer();
            var outputs = new Function(  jsCode + geomCode + '\n return dataConversion(geomList);')();
            deferred.resolve(outputs);
            return deferred.promise;
        }
    }
});
