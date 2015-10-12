//
// Three JS View Port Directive
//

/* todo */
// 1.2 geometry control
// 2. gird toggle
// 3. extend view
// 4. shading mode
// 5. set view position


vidamo.directive('viewport', function factory() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '='
        },

        link: function (scope, elem) {

            scope.internalControl = scope.control || {};

            // retrieve the viewport dom element
            var container = elem[0];
            var VIEWPORT_WIDTH = container.offsetWidth;
            var VIEWPORT_HEIGHT = container.offsetHeight;

            var scene,
                camera,
                renderer,
                controls;

            init();
            animate();

            // Initialization
            function init(){
                // create scene
                scene = new THREE.Scene();

                // prepare camera
                var VIEW_ANGLE = 45,
                    ASPECT = VIEWPORT_WIDTH / VIEWPORT_HEIGHT,
                    NEAR = 1,
                    FAR = 10000;

                camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                scene.add(camera);
                camera.position.set(-120, 60, 200);
                camera.lookAt(new THREE.Vector3(0,0,0));

                // prepare renderer
                renderer = new THREE.WebGLRenderer({antialias:true, alpha: false});
                renderer.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
                renderer.setClearColor(0xe0e0e0);

                renderer.shadowMapEnabled = true;
                renderer.shadowMapSoft = true;

                // prepare controls (OrbitControls)
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.target = new THREE.Vector3(0, 0, 0);
                container.appendChild(renderer.domElement);

                var ambientLight = new THREE.AmbientLight( 0xbbbbbb );
                scene.add( ambientLight );

                var lights = [];
                lights[0] = new THREE.PointLight( 0xececec, 0.25, 0 );
                lights[1] = new THREE.PointLight( 0xececec, 0.25, 0 );
                lights[2] = new THREE.PointLight( 0xececec, 0.25, 0 );

                lights[0].position.set( 0, 100, 0 );
                lights[1].position.set( 100, 200, 100 );
                lights[2].position.set( -100, -200, -100 );

                scene.add( lights[0] );
                scene.add( lights[1] );
                scene.add( lights[2] );

                // add helpers:

                // GridHelper
                var gridHelper = new THREE.GridHelper(100, 10); // 100 is grid size, 10 is grid step
                gridHelper.setColors(0x999999,0xaaaaaa);
                gridHelper.position = new THREE.Vector3(0, 0, 0);
                gridHelper.rotation = new THREE.Euler(0, 0, 0);
                scene.add(gridHelper);
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
                    VIEWPORT_WIDTH = container.offsetWidth;
                    VIEWPORT_HEIGHT = container.offsetHeight;
                    resizeUpdate();
                    //animate();
                },
                true
            );

            // update on resize of viewport
            function resizeUpdate() {
                container.appendChild(renderer.domElement);
                camera.aspect = VIEWPORT_WIDTH / VIEWPORT_HEIGHT;
                camera.updateProjectionMatrix ();
                renderer.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
            }

            // Animate the scene
            function animate() {
                requestAnimationFrame(animate);
                render();
                update();
            }

            // Update controls and stats
            function update() {
                controls.update();
            }

            // Render the scene
            function render() {
                renderer.render(scene, camera);
            }

            // clear geometries in scene when run
            scope.internalControl.refresh = function(){
                for(var i = 0; i < scene.children.length; i++){
                    if(scene.children[i].id > 7){
                        scene.remove( scene.children[i]);
                        i--;
                    }
                }
            };

            //
            // supporting function for geometry from verb to three.js
            //
            scope.internalControl.addGeometryToScene = function(geom,value){ 
				if(geom.constructor === Array){
					for(var i = 0; i< geom.length ;i++){
						scope.internalControl.displayObject(value[i]);
					}
				} else {
						scope.internalControl.displayObject(value)
				}
            };
			
			//
			// takes in single data object and categorizes and displays accordingly
			//
			scope.internalControl.displayObject = function(singleDataObject){
				if(singleDataObject instanceof THREE.Mesh || singleDataObject instanceof THREE.Line)
					scene.add(singleDataObject)
				else if(singleDataObject instanceof Number)
					console.log(singleDataObject)
				else
					console.log("Vidamo doesn't recognise this type!")
			};
			
			scope.internalControl.benchmark = function(func, runs){
                var d1 = Date.now();
                for (var i = 0 ; i < runs; i++)
                    res = func();
                var d2 = Date.now();
                return { result : res, elapsed : d2-d1, each : (d2-d1)/runs };
            };

			/* TODO - Work out if all THREE Geometry objects that can directly be added to scene are covered - especially points
            scope.internalControl.addCurveToScene = function(geom, material){
                material = material || new THREE.LineBasicMaterial({ linewidth: 100, color: 0x000000});
                scene.add( new THREE.Line( geom, material ) );
            };

            scope.internalControl.addLineToScene = function(pts, mat){
                addCurveToScene(asGeometry(asVector3(pts)), mat);
            };


            scope.internalControl.asVector3 = function(pts){
                return pts.map(function(x){
                    return new THREE.Vector3(x[0],x[1],x[2]);
                });
            };

            scope.internalControl.asGeometry = function(threePts){
                var geometry = new THREE.Geometry();
                geometry.vertices.push.apply( geometry.vertices, threePts );
                return geometry;
            };

            scope.internalControl.pointsAsGeometry = function(pts){
                return asGeometry( asVector3(pts) )
            };

            scope.internalControl.addPointsToScene = function(pts){

                var geom = asGeometry( asVector3( pts ) );
                var cloudMat2 = new THREE.PointCloudMaterial({ size: 6.5, sizeAttenuation: false, color: 0xffffff });
                var cloud2 = new THREE.PointCloud( geom, cloudMat2 );

                scene.add( cloud2 );
            } */

        }
    }
});