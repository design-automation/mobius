mobius.factory('executeService', function ($q) {
    return{
        execute: function(code){
            var deferred = $q.defer();
            var errorMsg = '';
            try {
                var outputs = new Function(code)();
            }catch(error){
                errorMsg = error.message;
            }

            if (outputs){
                deferred.resolve(outputs);
            }
            else{
                deferred.reject('Mobius Abort: fail running generated code: \n Error: ' + errorMsg);
            }

            return deferred.promise;
        }
    }
});