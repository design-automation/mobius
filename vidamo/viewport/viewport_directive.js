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

                //// add point light
                var pointLight = new THREE.PointLight(0xffff00, 1.0);
                pointLight.position.set(300,300,300);
                scene.add(pointLight);

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
                    animate();
                },
                true
            );

            // update on resize of viewport
            function resizeUpdate() {
                renderer.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
                container.appendChild(renderer.domElement);
                camera.aspect = VIEWPORT_WIDTH / VIEWPORT_HEIGHT;
                camera.updateProjectionMatrix ();
            }

            // Animate the scene
            function animate() {
                console.log('animate');
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
            

            scope.internalControl.addCurveToScene = function(geom, material){
                material = material || new THREE.LineBasicMaterial({ linewidth: 100, color: 0xff0000});
                scene.add( new THREE.Line( geom, material ) );
                scene.add( new THREE.Line( geom, material ) );
            };

            //
            // supporting function for geometry from verb to three.js
            //

            scope.internalControl.addLineToScene = function(pts, mat){
                addCurveToScene(asGeometry(asVector3(pts)), mat);
            };

            scope.internalControl.addMeshToScene =  function(mesh, material, wireframe ){
                material = material || new THREE.MeshNormalMaterial( { side: THREE.DoubleSide, wireframe: false, shading: THREE.SmoothShading, transparent: true, opacity: 0.4 } )

                scene.add( new THREE.Mesh( mesh, material ) );

                if (wireframe){
                    var material2 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide, wireframe: true } );
                    var mesh2 = new THREE.Mesh( mesh, material2 );
                    scene.add( mesh2 );
                }
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

            scope.internalControl.benchmark = function(func, runs){
                var d1 = Date.now();
                for (var i = 0 ; i < runs; i++)
                    res = func();
                var d2 = Date.now();
                return { result : res, elapsed : d2-d1, each : (d2-d1)/runs };
            };

            scope.internalControl.pointsAsGeometry = function(pts){
                return asGeometry( asVector3(pts) )
            };

            scope.internalControl.addPointsToScene = function(pts){

                var geom = asGeometry( asVector3( pts ) );
                var cloudMat2 = new THREE.PointCloudMaterial({ size: 6.5, sizeAttenuation: false, color: 0xffffff });
                var cloud2 = new THREE.PointCloud( geom, cloudMat2 );

                scene.add( cloud2 );
            }

        }
    }
});