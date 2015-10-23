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
            control: '=',
        },

        link: function (scope, elem) {

            scope.internalControl = scope.control || {};
            console.log(scope)

            // retrieve the viewport dom element
            var container = elem[0];
            var VIEWPORT_WIDTH = container.offsetWidth;
            var VIEWPORT_HEIGHT = container.offsetHeight;

            var //scene,
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
            scope.internalControl.addGeometryToScene = function(geom,value,geomData){
                scope.internalControl.geometryData = [{Property:'', Value:'',attachedTo:''}];
                console.log('before: ', scope.internalControl.geometryData);

                if(geom.constructor === Array){
                    for(var i = 0; i< geom.length ;i++){
                        scope.internalControl.displayObject(value[i],geomData[i]);
                    }
                } else {
                    scope.internalControl.displayObject(value,geomData);
                }
                console.log('after: ', scope.internalControl.geometryData);
            };

            //
            // takes in single data object and categorizes and displays accordingly
            //
            scope.internalControl.displayObject = function(singleGeomObject, singleGeomDataObject){

                // update the 3d viewport
                if(singleGeomObject instanceof THREE.Mesh
                    || singleGeomObject instanceof THREE.Line
                    || singleGeomObject instanceof THREE.Object3D){
                    scene.add(singleGeomObject);
                }
                // update the data table viewport

                if(singleGeomDataObject.length !== 0){
                    console.log('single; ',singleGeomDataObject);
                    //scope.internalControl.geometryData = [];
                    scope.internalControl.geometryData = scope.internalControl.geometryData.concat(singleGeomDataObject);
                }
                else{
                    console.log("Vidamo doesn't recognise this type!");
                }

            };


            // anyone tells me what the hell is this
            // fixme
            scope.internalControl.benchmark = function(func, runs){
                var d1 = Date.now();
                for (var i = 0 ; i < runs; i++)
                    res = func();
                var d2 = Date.now();
                return { result : res, elapsed : d2-d1, each : (d2-d1)/runs };
            };
        }
    }
});