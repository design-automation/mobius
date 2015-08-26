//
// filter collection for vidamo
//

// filter for procedure dataName
vidamo.filter('dataNameFilter', function() {
    return function( items) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if( item.dataName){
                filtered.push(item);
            }
        });
        return filtered;
    };
});

// filter to check if the procedure is a data procedure
vidamo.filter('dataFilter', function() {
    return function( items) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if( item.title == 'Data'){
                filtered.push(item);
            }
        });
        return filtered;
    };
});

// filter for procedure position
vidamo.filter('positionFilter', function() {
    return function( items, currentId, scope) {
        var filtered = [];
        var index = -1;

        for(var i = 0, len = scope.flattenData.length; i < len; i++) {
            if (scope.flattenData[i].id === currentId) {
                index = i;
                break;
            }
        }

        angular.forEach(items, function(item) {
            var tempIndex = -1;

            for(var i = 0, len = scope.flattenData.length; i < len; i++) {
                if (scope.flattenData[i].id === item.id) {
                    tempIndex = i;
                    break;
                }
            }

            if(tempIndex < index){
                filtered.push(item);
            }
        });

        return filtered;
    };
});