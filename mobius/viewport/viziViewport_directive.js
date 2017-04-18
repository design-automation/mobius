/**
 * Created by yz on 28/3/17.
 */


mobius.directive('viziViewport', function factoryVizi() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '='
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

                document.getElementById("viziContainer").style.display = "inline";
                document.getElementById("viziViewport").style.display = "inline";

            }


            // monitoring viewport size change
            scope.$watch(
                function () {
                    return {
                        width: elem[0].offsetWidth,
                        height: elem[0].offsetHeight
                    };
                },
                function () {
                    VIEWPORT_WIDTH1 =  document.getElementById('viewport').offsetWidth;
                    VIEWPORT_HEIGHT1 =  document.getElementById('viewport').offsetHeight;
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
                    if(document.getElementById("viewLT1")){
                        document.getElementById("viewLT1").remove();
                        document.getElementById("viewLB1").remove()  ;
                        document.getElementById("viewRT1").remove();
                        document.getElementById("viewRB1").remove();
                    }
                    document.getElementById("viziContainer").style.display = "inline";
                    document.getElementById("viziViewport").style.display = "inline";
                }
            }

            // clear geometries in scene1 when run
            scope.internalControlVizi.refreshView = function(){
               //document.getElementById("viziContainer").style.display = "none";
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
                var coords = [1.325401, 103.684431];//[0.3418357, 0.1545416];//[1.3521, 103.8198];34115.140000001018 11404.350000000068

                var world = VIZI.world('viziContainer', {
                    skybox: true,
                    postProcessing: true
                }).setView(coords);
                // Set position of sun in sky
                world._environment._skybox.setInclination(0.3);

                // Add controls
                VIZI.Controls.orbit().addTo(world);
                //'http://localhost:63342/mobius/examples/1.json';geomObject

                VIZI.imageTileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                }).addTo(world);


                VIZI.geoJSONLayer('http://localhost:63342/mobius/examples/new.json', {
                    output: true,
                    interactive: false,
                    style: function(feature) {

                       if (feature.properties.height) {
                            height = feature.properties.height;
                        } else {
                            height = 10 + Math.random() * 10;
                        }

                        for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                            for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {

                                var c =TransCoord(feature.geometry.coordinates[i][j][0], feature.geometry.coordinates[i][j][1]);
                                feature.geometry.coordinates[i][j][0] = c.x *57.29687;
                                feature.geometry.coordinates[i][j][1] = c.y *57.29687;
                            }
                        }

                        return {
                            height: height
                        };

                    }

                }).addTo(world);

            }

            function TransCoord(x, y) {

                var EPSG3857 = new proj4.Proj('EPSG:3857');
                var EPSG4326 = new proj4.Proj('EPSG:4326');

                var result;
                if (proj4) {
                    var p = new proj4.Point(parseFloat(x), parseFloat(y));

                    proj4.transform(EPSG3857, EPSG4326, p);
                    result = {x: p.x, y: p.y};
                }
                return result;
            }
        }
    }
});