
vidamo.controller('keyCtrl',['$scope',
    function($scope) {
        var ctrlDown = false;

        //// Event handler for key-down on the flowchart.
        $scope.keyDown = function (evt) {
            if (evt.keyCode === 17) {
                ctrlDown = true;
                evt.stopPropagation();
                evt.preventDefault();
            }
        };

        // Event handler for key-up on the flowchart.
        $scope.keyUp = function (evt) {
            if (evt.keyCode === 46) {
                // Delete key.
                $scope.$broadcast("deleteSelected");
            }

            if (evt.keyCode === 192 && ctrlDown) {
                // backquote key "`".
                $scope.$broadcast("editProcedure");
            }


            if (evt.keyCode == 17 && ctrlDown) {
                // Ctrl + A
                $scope.$broadcast("selectAll");
            }

            if (evt.keyCode == 27) {
                // Escape.
                $scope.$broadcast("deselectAll");
            }

            if (evt.keyCode === 65) {
                ctrlDown = false;

                evt.stopPropagation();
                evt.preventDefault();
            }
        };
    }]);