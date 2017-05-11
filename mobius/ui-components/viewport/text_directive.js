// text editor viewport example
mobius.directive('textViewportEditor', function() {
        return {
            restrict: 'A',
            scope: {
                viewModel: "="
            },
            link: function (scope, elem, attr) {

                // Serialize the data model as json and update the textarea.
                var updateJson = function () {
                    if (scope.viewModel.geom) {
	                    var json = scope.viewModel.geom;
                        //var json = JSON.stringify(scope.viewModel.geom);

                        $(elem).val(json);
                    }
                };

                // First up, set the initial value of the textarea.
                updateJson();

                // Watch for changes in the data model and update the textarea whenever necessary.
                scope.$watch("viewModel.geom",
                    updateJson);
            }
        }
});

