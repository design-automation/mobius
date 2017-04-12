/**
 * Created by yz on 28/3/17.
 */


mobius.directive('viziViewport', function factoryVizi() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
        },

        link: function (scope, elem) {

            scope.internalControlVizi = scope.control || {};

            // retrieve the viewport dom element
            var container1 = elem[0];
            var VIEWPORT_WIDTH1 =  document.getElementById('threeViewport').offsetWidth;
            var VIEWPORT_HEIGHT1 =  document.getElementById('threeViewport').offsetHeight;


            // vizicities variables

            initVizi();
            animateVizi();

            // Initialization
            function initVizi(){

               // document.getElementById("viziContainer").style.display = "inline";

            }


            // monitoring viewport size change
            scope.$watch(
                function () {
                    return {
                        width: elem[0].offsetWidth,
                        height: elem[0].offsetHeight
                    }
                },
                function () {
                    VIEWPORT_WIDTH1 =  document.getElementById('threeViewport').offsetWidth;
                    VIEWPORT_HEIGHT1 =  document.getElementById('threeViewport').offsetHeight;
                    resizeUpdateVizi();
                },
                true
            );


            function animateVizi() {
               requestAnimationFrame(animateVizi);
               resizeUpdateVizi();
            }

            // update on resize of viewport
            function resizeUpdateVizi() {
                if(scope.internalControlVizi.layout === 'singleView' && scope.internalControlVizi.showVizicities === true) {

                    document.getElementById("viziContainer").style.display = "inline";
                    document.getElementById("viziViewport").style.width = VIEWPORT_WIDTH1;
                    document.getElementById("viziViewport").style.height = VIEWPORT_HEIGHT1;
                }
            }

            // clear geometries in scene1 when run
            scope.internalControlVizi.refreshView = function(){
                document.getElementById("viziContainer").innerHTML = "";
                document.getElementById("viziContainer").style.display = "none";
            };

            //
            // supporting function for geometry from verb to three.js
            //
            scope.internalControlVizi.addGeometryToScene = function(geom){

                displayObject( geom );

            };

            //
            // takes in single data object and categorizes and displays accordingly
            //
            function displayObject (geomObject){
                // update the 3d viewport
                var coords = [0.3418357, 0.1545416];//[1.3521, 103.8198];

                var world = VIZI.world('viziContainer', {
                    skybox: true,
                    postProcessing: true,
                }).setView(coords);
                // Set position of sun in sky
                world._environment._skybox.setInclination(0.3);
                var mm = [];
                // Add controls
                VIZI.Controls.orbit().addTo(world);
                //'http://localhost:63342/mobius/examples/1.json';geomObject

                if (geomObject === 'string')
                {
                    alert("yes")
                }
                VIZI.geoJSONLayer('http://localhost:63342/mobius/examples/2.json', {
                    output: true,
                    interactive: false,
                    style: function(feature) {

                        if (feature.properties.height) {
                            height = feature.properties.height;
                        } else {
                            height = 0;
                        }

                        for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                            for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {

                                feature.geometry.coordinates[i][j][0] = feature.geometry.coordinates[i][j][0] / 100000;
                                feature.geometry.coordinates[i][j][1] = feature.geometry.coordinates[i][j][1] / 100000;
                            }
                        }

                        return {
                            height: height
                        };

                    }

                }).addTo(world);

            };


        }
    }
});