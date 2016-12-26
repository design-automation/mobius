mobius.factory('executeService', function ($q) {
    return{
        execute: function(code){
            var deferred = $q.defer();
            var errorMsg = '';

            try {
                //var outputs = new Function(code)();
                //var outputs = eval("try{\n (function(){" +
                //                                        code +
                //                                    "}());\n}catch(e){console.log(e.stack);}");

                var outputs = eval(" (function(){" + code + "}())");
            }catch(error){
                errorMsg = error.message;
                var stack = ErrorStackParser.parse(error);

                var functionList = [];
                var graphTrace = [];

                for(var i = 0; i < stack.length; i++){
                    if(stack[i].functionName !== undefined){
                        var functionName = stack[i].functionName.split(" ")[0];

                        if(functionName === 'eval'){
                            break;
                        }

                        functionList.push(functionName);
                    }
                }

                for(var i = functionList.length-1; i >= 0; i=i-2){
                    graphTrace.push(
                        {
                            nodeName:functionList[i],
                            typeName:functionList[i-1]
                        }
                    )
                }
            }

            if (outputs){
                deferred.resolve(outputs);
            }else{
                deferred.reject([graphTrace,errorMsg]);
            }

            return deferred.promise;
        }
    }
});