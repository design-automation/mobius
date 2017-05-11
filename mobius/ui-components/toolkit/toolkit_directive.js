//
//  display the function list and other components for the procedure
//
mobius.directive('toolkit', [ 'consoleMsg', '$rootScope', function(consoleMsg, $rootScope) {
    
    return {
        restrict: 'E', 
        template: ' <div style="padding-left: 16px;"> \
        				<div class="doormat">\
	                    	<div style="display: inline-block;">Toolkit</div>\
	                    </div> \
	                    <div style="overflow: auto; height: 100vh;">\
		                    <div class="category-heading main-heading">Node Design</div>\
		                    <div class="category-container">\
			                    <div class="category-element" ng-click="addInterface(\'Input\')">Add Input</div>\
			                    <div class="category-element" ng-click="addInterface(\'Output\')">Add Output</div>\
								<div class="category-element" ng-click="addData()">Add Variable</div>\
		                    </div>\
		                    <div class="category-heading main-heading">Controls</div>\
		                    <div class="category-container">\
								<div class="category-element" ng-repeat="item in controlTypes" ng-click="addProcedureItem(\'Control\',item)">\
										{{item}}\
								</div>\
		                    </div>\
		                    <div class="category-heading main-heading" style="padding-bottom: 5px 2px;">Functions</div>\
		                    <div class="category-container">\
		                    	<input type="text" class="form-control" ng-model="searchTerm" style="margin: 5px;" placeholder="Search ...">\
								<div ng-repeat="item in methodList">\
									<div class="category-heading" ng-if="filtered.length>0">{{item.category}}</div>\
									<div class="category-element" ng-repeat="fn in item.methods | filter: searchTerm as filtered" ng-click="addProcedureItem(item.category, fn.name)">\
										{{fn.name}}\
									</div>\
								</div>\
		                    </div>\
		                </div>\
                    </div>',
        link: function ($scope, element, attrs) {

            // control types
	        $scope.controlTypes = ['for each',
	                                'if else'];

	        // methods types
	        $scope.getMethods = function(){

	            var props = Object.getOwnPropertyNames(MOBIUS);

	            var expression = [{category:'msc',name:'expression'}];

	            // fixme sub category temp solution
	            for(var i = 0; i < props.length; i++){
	                if(typeof MOBIUS[props[i]] != 'function' && props[i] !='TOPOLOGY_DEF'){
	                    var subProps = Object.getOwnPropertyNames(MOBIUS[props[i]]);
	                    for(var j = 0; j < subProps.length; j++){
	                        if(typeof MOBIUS[props[i]][subProps[j]] == 'function'){
	                            expression.push({category:props[i],
	                                             name:subProps[j],
	                                             return:MOBIUS[props[i]][subProps[j]].prototype.return
	                            });
	                        }
	                    }
	                }
	            }
	            return expression;
	        
	        };

	        $scope.getMethodList = function(){
	            var props = Object.getOwnPropertyNames(MOBIUS);

	            var expression = [{category:'msc',methods:[{name:'expression'}]}];

	            // fixme sub category temp solution
	            for(var i = 0; i < props.length; i++){
	                if(typeof MOBIUS[props[i]] != 'function' && props[i] !='TOPOLOGY_DEF'){
	                    var subProps = Object.getOwnPropertyNames(MOBIUS[props[i]]);

	                    if(props[i] !== 'msc'){
	                        expression.push({category:props[i],methods:[]});
	                        for(var j = 0; j < subProps.length; j++){
	                            if(typeof MOBIUS[props[i]][subProps[j]] == 'function'){
	                                expression[expression.length-1].methods.push({
	                                    name:subProps[j],
	                                    return:MOBIUS[props[i]][subProps[j]].prototype.return,
	                                    description:MOBIUS[props[i]][subProps[j]].prototype.description});
	                            }
	                        }
	                    }else{
	                        for(var j = 0; j < subProps.length; j++){
	                            if(typeof MOBIUS[props[i]][subProps[j]] == 'function'){
	                                expression[0].methods.push({name:subProps[j], description:MOBIUS[props[i]][subProps[j]].prototype.description});
	                            }
	                        }
	                    }
	                }
	            }
	            return expression;
	        };


	        // ---- Module Related 
	        var updateModuleFn = function(){
	            $scope.methods = $scope.getMethods();
	            $scope.methodList = $scope.getMethodList();
	        }
	        updateModuleFn();

	        $scope.$on('moduleChanged', function(evt, args){
	            updateModuleFn();
	        });

	        $scope.addInterface = function(value){
		        $rootScope.$emit("add-interface-item", value);	        	
	        }

	        $scope.addProcedureItem = function(cate, item){
		        $rootScope.$emit("add-procedure-item", {category: cate, name: item} );
                                            //return:method.return})
	        }

	        $scope.addData = function(){
	        	$rootScope.$emit("add-procedure-item");
	        }

        }
    }

}]);
