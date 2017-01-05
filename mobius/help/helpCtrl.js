mobius.controller('helpCtrl',['$scope',  function($scope){

   	$scope.module = MOBIUS;

   	$scope.categories = []; 

	// extract the categories
	for (var property in $scope.module) {
	    if ($scope.module.hasOwnProperty(property) && property !== "TOPOLOGY_DEF") {
	        
	        var fns = [];
			for (var fn in $scope.module[property]) {
				if ( $scope.module[property].hasOwnProperty(fn) && fn !== "description") {

				    fns.push( {
				    	'name': fn, 
				    	'description': $scope.module[property][fn].prototype.description || "Missing Function Description. Please contact Module Author." 
				    })
				}
			}

	        $scope.categories.push({ 'name': property,
	        						 'description': $scope.module[property].description || "Missing Category Definition. Please contact Module Author." ,
	        						 'fns': fns
	        						});
	    }
	}

	//console.log($scope.categories);
/*	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var ARGUMENT_NAMES = /([^\s,]+)/g;
	function getParamNames(func) {
	  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	  if(result === null)
	     result = [];
	  return result;
	}*/

}]);

