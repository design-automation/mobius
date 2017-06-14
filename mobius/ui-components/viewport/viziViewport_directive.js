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
            var VIEWPORT_WIDTH1 =  document.getElementById('viewport').offsetWidth;
            var VIEWPORT_HEIGHT1 =  document.getElementById('viewport').offsetHeight;

            // init view point for vizicities
            var coords =[1.325401, 103.684431]// [1.325401, 103.684431];
            var skyvalue =0.3;
            var turnpostprocess = false;
            var turnskybox = false;
            var world = VIZI.world('viziViewport', {
                skybox: true,
                postProcessing: true
            }).setView(coords);
            // Set position of sun in sky
            world._environment._skybox.setInclination(skyvalue);

            // Add controls
            VIZI.Controls.orbit().addTo(world);
            // Add fundamental map
            VIZI.imageTileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" >OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            }).addTo(world);

            // vizicities variables

            initVizi();

            // Initialization
            function initVizi(){

                document.getElementById("viziViewport").style.display = "none";

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
                    //document.getElementById("viziContainer").style.display = "inline";

                    document.getElementById("viziViewport").style.display = "inline";
                    window.dispatchEvent(new Event('resize'));
                }
            }

            // clear geometries in scene1 when run
            scope.internalControlVizi.refreshView = function(){
               document.getElementById("viziViewport").style.display = "none";
            };

            scope.internalControlVizi.togglevizisky = function(){
                if(skyvalue === 0.3) {
                    skyvalue = -0.4
                }else
                {
                    skyvalue = 0.3
                }
                world._environment._skybox.setInclination(skyvalue);
                //world._environment._skybox = false;

                onchange();
            };

            scope.internalControlVizi.togglevizipostprocess = function(){
                if(turnpostprocess === false) {
                    turnpostprocess = true;
                }else
                {
                    turnpostprocess = false;
                }
                world.options.postProcessing = turnpostprocess;

                onchange();
            };

            scope.internalControlVizi.toggleviziskybox = function(){
                if(turnskybox === false) {
                    turnskybox = true;
                }else
                {
                    turnskybox = false;
                }
                world.options.skybox = turnskybox;

                onchange();
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


                // Leave a single CPU for the main browser thread
                world.createWorkers(7).then(() => {
                    console.log('Workers ready');

                var jsondata = JSON.parse(geomObject);

                //building layer 'http://localhost:63342/mobius/examples/Existing Buildings_3857.json'
                VIZI.geoJSONLayer(jsondata, {
                    output: true,
                    interactive: false,
                    style: function (feature) {


                        if (feature.properties.height) {
                            height = feature.properties.height;
                        } else {
                            height = 10 + Math.random() * 10;
                        }
                        if (feature.geometry.type === 'Polygon') {
                            for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                                for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {

                                    var c = TransCoord(feature.geometry.coordinates[i][j][0], feature.geometry.coordinates[i][j][1]);
                                    feature.geometry.coordinates[i][j][0] = c.x * 57.29687;
                                    feature.geometry.coordinates[i][j][1] = c.y * 57.29687;
                                }
                            }
                        } else if (feature.geometry.type === 'MultiPolygon') {
                            for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                                for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {
                                    for (var k = 0, n = feature.geometry.coordinates[i][j].length; k < n; k++) {
                                        var c = TransCoord(feature.geometry.coordinates[i][j][k][0], feature.geometry.coordinates[i][j][k][1]);
                                        feature.geometry.coordinates[i][j][k][0] = c.x * 57.29687;
                                        feature.geometry.coordinates[i][j][k][1] = c.y * 57.29687;
                                    }
                                }
                            }
                        }

                        return {
                            height: height

                        };

                    },
                    filter: function(feature) {
                        // Don't show points
                        return feature.geometry.type !== 'Point';
                    },
                    // onEachFeature: function(feature, layer) {
                    //     layer.on('click', function(layer, point2d, point3d, intersects) {
                    //         var id = layer.feature.properties.HOUSE_BLK_;
                    //
                    //         console.log(id + ': ', layer, point2d, point3d, intersects);
                    //     });
                    // }

                }).addTo(world);

                // //building layer 'http://localhost:63342/mobius/examples/Existing Buildings_3857.json'
                    // VIZI.geoJSONLayer('http://localhost:63342/mobius/examples/HDB.json', {
                    //     output: true,
                    //     interactive: false,
                    //     style: function (feature) {
                    //         var color;
                    //
                    //         if (feature.properties.energysum) {
                    //             height = feature.properties.energysum /10;
                    //             if(height > 1000) {
                    //                 color = '#F70C05'
                    //             }else if (height > 800 & height < 1000)
                    //             {color = '#f7ce12'}
                    //             else if (height > 600 & height < 800)
                    //             {color = '#dff716'}
                    //             else if (height > 400 & height < 600)
                    //             {color = '#b7f712'}
                    //             else if (height > 200 & height < 400)
                    //             {color = '#b7f712'}
                    //             else if (height > 0 & height < 200)
                    //             {color = '#65f717'}
                    //         } else {
                    //             height = 10 + Math.random() * 10;
                    //         }
                    //
                    //
                    //         return {
                    //             height: height,
                    //             color: color
                    //         };
                    //
                    //     }
                    //
                    // }).addTo(world);

                // openspace later
                // VIZI.geoJSONLayer('examples/Existing Open Space_3857.json', {
                //     output: true,
                //     interactive: false,
                //     style: function (feature) {
                //
                //
                //         if (feature.properties.height) {
                //             height = feature.properties.height;
                //         } else {
                //             height = 10 + Math.random() * 10;
                //         }
                //         if (feature.geometry.type === 'Polygon') {
                //             for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //                 for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {
                //
                //                     var c = TransCoord(feature.geometry.coordinates[i][j][0], feature.geometry.coordinates[i][j][1]);
                //                     feature.geometry.coordinates[i][j][0] = c.x * 57.29687;
                //                     feature.geometry.coordinates[i][j][1] = c.y * 57.29687;
                //                 }
                //             }
                //         } else if (feature.geometry.type === 'MultiPolygon') {
                //             for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //                 for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {
                //                     for (var k = 0, n = feature.geometry.coordinates[i][j].length; k < n; k++) {
                //                         var c = TransCoord(feature.geometry.coordinates[i][j][k][0], feature.geometry.coordinates[i][j][k][1]);
                //                         feature.geometry.coordinates[i][j][k][0] = c.x * 57.29687;
                //                         feature.geometry.coordinates[i][j][k][1] = c.y * 57.29687;
                //                     }
                //                 }
                //             }
                //         }
                //
                //         return {
                //             height: height,
                //             color: '#09f72e'
                //         };
                //
                //     }
                //
                // }).addTo(world);
                //
                // //road layer
                // VIZI.geoJSONLayer('examples/Existing Roads_3857.json', {
                //     output: true,
                //     interactive: false,
                //     style: function (feature) {
                //
                //         if (feature.geometry.type === 'LineString') {
                //             for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //                 var c = TransCoord(feature.geometry.coordinates[i][0], feature.geometry.coordinates[i][1]);
                //                 feature.geometry.coordinates[i][0] = c.x * 57.29687;
                //                 feature.geometry.coordinates[i][1] = c.y * 57.29687;
                //
                //             }
                //         } else if (feature.geometry.type === 'MultiLineString') {
                //             for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //                 for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {
                //                     for (var k = 0, n = feature.geometry.coordinates[i][j].length; k < n; k++) {
                //                         var c = TransCoord(feature.geometry.coordinates[i][j][k][0], feature.geometry.coordinates[i][j][k][1]);
                //                         feature.geometry.coordinates[i][j][k][0] = c.x * 57.29687;
                //                         feature.geometry.coordinates[i][j][k][1] = c.y * 57.29687;
                //                     }
                //                 }
                //             }
                //         }
                //
                //         return {
                //             lineColor: '#f7c616',
                //             lineWidth: 1,
                //             lineTransparent: true,
                //             lineOpacity: 0.2,
                //             lineBlending: THREE.AdditiveBlending,
                //             lineRenderOrder: 2
                //         };
                //
                //     }
                //
                // }).addTo(world);
                //
                // // station later
                // VIZI.geoJSONLayer('examples/Existing MRT Station_3857.json', {
                //     output: true,
                //     interactive: false,
                //     style: function (feature) {
                //
                //
                //         if (feature.properties.height) {
                //             height = feature.properties.height;
                //         } else {
                //             height = 10 + Math.random() * 10;
                //         }
                //         if (feature.geometry.type === 'Polygon') {
                //             for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //                 for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {
                //
                //                     var c = TransCoord(feature.geometry.coordinates[i][j][0], feature.geometry.coordinates[i][j][1]);
                //                     feature.geometry.coordinates[i][j][0] = c.x * 57.29687;
                //                     feature.geometry.coordinates[i][j][1] = c.y * 57.29687;
                //                 }
                //             }
                //         } else if (feature.geometry.type === 'MultiPolygon') {
                //             for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //                 for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {
                //                     for (var k = 0, n = feature.geometry.coordinates[i][j].length; k < n; k++) {
                //                         var c = TransCoord(feature.geometry.coordinates[i][j][k][0], feature.geometry.coordinates[i][j][k][1]);
                //                         feature.geometry.coordinates[i][j][k][0] = c.x * 57.29687;
                //                         feature.geometry.coordinates[i][j][k][1] = c.y * 57.29687;
                //                     }
                //                 }
                //             }
                //         }
                //
                //         return {
                //             height: height,
                //             color: '#0412f7'
                //         };
                //
                //     }
                //
                // }).addTo(world);
                //
                // //mrt line layer
                // VIZI.geoJSONLayer('examples/Existing MRT Line_3857.json', {
                //     output: true,
                //     interactive: false,
                //     style: function (feature) {
                //
                //         if (feature.geometry.type === 'LineString') {
                //             for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //                 var c = TransCoord(feature.geometry.coordinates[i][0], feature.geometry.coordinates[i][1]);
                //                 feature.geometry.coordinates[i][0] = c.x * 57.29687;
                //                 feature.geometry.coordinates[i][1] = c.y * 57.29687;
                //
                //             }
                //         } else if (feature.geometry.type === 'MultiLineString') {
                //             for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //                 for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {
                //                     for (var k = 0, n = feature.geometry.coordinates[i][j].length; k < n; k++) {
                //                         var c = TransCoord(feature.geometry.coordinates[i][j][k][0], feature.geometry.coordinates[i][j][k][1]);
                //                         feature.geometry.coordinates[i][j][k][0] = c.x * 57.29687;
                //                         feature.geometry.coordinates[i][j][k][1] = c.y * 57.29687;
                //                     }
                //                 }
                //             }
                //         }
                //
                //         return {
                //             lineColor: '#08f794',
                //             lineWidth: 1,
                //             lineTransparent: true,
                //             lineOpacity: 0.2,
                //             lineBlending: THREE.AdditiveBlending,
                //             lineRenderOrder: 2
                //         };
                //
                //     }
                //
                // }).addTo(world);

                //bus point layer
                // VIZI.geoJSONLayer('examples/Existing Bus Stops_3857.json', {
                //     output: true,
                //     interactive: false,
                //     style: function (feature) {
                //
                //         if (feature.geometry.type === 'Point') {
                //             var c = TransCoord(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);
                //             feature.geometry.coordinates[0] = c.x * 57.29687;
                //             feature.geometry.coordinates[1] = c.y * 57.29687;
                //
                //         }
                //         return {
                //             pointColor: '#08f794',
                //         };
                //     },
                //     pointGeometry: function (feature) {
                //         var geometry = new THREE.SphereGeometry(4, 9, 9);
                //         return geometry;
                //     }
                // }).addTo(world);


                //for whole singapore roads
                // VIZI.geoJSONLayer('http://localhost:63342/mobius/examples/georoad-4326.json', {
                //         output: true,
                //         interactive: false,
                //         style: function (feature) {
                //
                //             // if (feature.geometry.type === 'LineString') {
                //             //     for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //             //         var c = TransCoord(feature.geometry.coordinates[i][0], feature.geometry.coordinates[i][1]);
                //             //         feature.geometry.coordinates[i][0] = c.x * 57.29687;
                //             //         feature.geometry.coordinates[i][1] = c.y * 57.29687;
                //             //
                //             //     }
                //             // } else if (feature.geometry.type === 'MultiLineString') {
                //             //     for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //             //         for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {
                //             //             for (var k = 0, n = feature.geometry.coordinates[i][j].length; k < n; k++) {
                //             //                 var c = TransCoord(feature.geometry.coordinates[i][j][k][0], feature.geometry.coordinates[i][j][k][1]);
                //             //                 feature.geometry.coordinates[i][j][k][0] = c.x * 57.29687;
                //             //                 feature.geometry.coordinates[i][j][k][1] = c.y * 57.29687;
                //             //             }
                //             //         }
                //             //     }
                //             // }
                //
                //             return {
                //                 lineColor: '#f7c616',
                //                 lineWidth: 1,
                //                 lineTransparent: true,
                //                 lineOpacity: 0.2,
                //                 lineBlending: THREE.AdditiveBlending,
                //                 lineRenderOrder: 2
                //             };
                //
                //         }
                //
                //     }).addTo(world);

                //for whole singapore building layer
                // VIZI.geoJSONLayer('http://localhost:63342/mobius/examples/salbuildings.json', {
                //         output: true,
                //         interactive: false,
                //         style: function (feature) {
                //
                //
                //             if (feature.properties.height) {
                //                 height = feature.properties.height;
                //             } else {
                //                 height = 10 + Math.random() * 10;
                //             }
                //             // if (feature.geometry.type === 'Polygon') {
                //             //     for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //             //         for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {
                //             //
                //             //             var c = TransCoord(feature.geometry.coordinates[i][j][0], feature.geometry.coordinates[i][j][1]);
                //             //             feature.geometry.coordinates[i][j][0] = c.x * 57.29687;
                //             //             feature.geometry.coordinates[i][j][1] = c.y * 57.29687;
                //             //         }
                //             //     }
                //             // } else if (feature.geometry.type === 'MultiPolygon') {
                //             //     for (var i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
                //             //         for (var j = 0, m = feature.geometry.coordinates[i].length; j < m; j++) {
                //             //             for (var k = 0, n = feature.geometry.coordinates[i][j].length; k < n; k++) {
                //             //                 var c = TransCoord(feature.geometry.coordinates[i][j][k][0], feature.geometry.coordinates[i][j][k][1]);
                //             //                 feature.geometry.coordinates[i][j][k][0] = c.x * 57.29687;
                //             //                 feature.geometry.coordinates[i][j][k][1] = c.y * 57.29687;
                //             //             }
                //             //         }
                //             //     }
                //             // }
                //
                //             return {
                //                 height: height
                //
                //             };
                //
                //         },
                //         filter: function(feature) {
                //             // Don't show points
                //             return feature.geometry.type !== 'Point';
                //         }
                //     }).addTo(world);
                });
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