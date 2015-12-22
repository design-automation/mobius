//
// Three JS View Port Directive
//

/* todo */
// 1.2 geometry control
// 2. gird toggle
// 3. extend view
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
            scope.internalControl.currentCate = 'Perspective';
            scope.internalControl.currentView = 'Perspective';

            // retrieve the viewport dom element
            var container = elem[0];
            var VIEWPORT_WIDTH = container.offsetWidth;
            var VIEWPORT_HEIGHT = container.offsetHeight;

            var //scene,
                camera, orthoCamera,
                renderer,
                controls,controlsPerspective, controlsOrtho;

            var orthographic = false;
            var wireframe = false;

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
                camera.position.set(-120, -200, 60);
                // z up
                camera.up.set( 0, 0, 1 );
                camera.lookAt( scene.position );


                orthoCamera = new THREE.OrthographicCamera(
                    VIEWPORT_WIDTH / -2,		// Left
                    VIEWPORT_WIDTH / 2,		    // Right
                    VIEWPORT_HEIGHT / 2,		// Top
                    VIEWPORT_HEIGHT / -2,	    // Bottom
                    -2000,            			// Near
                    5000 );           			// Far
                orthoCamera.up.set( 0, 0, 1 );


                // prepare renderer
                renderer = new THREE.WebGLRenderer({antialias:true, alpha: false});
                renderer.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
                renderer.setClearColor(0xe0e0e0);

                renderer.shadowMapEnabled = true;
                renderer.shadowMapSoft = true;

                // prepare controls (OrbitControls)
                controlsPerspective = new THREE.OrbitControls(camera, renderer.domElement);
                controlsPerspective.enableKeys = false;

                controlsOrtho = new THREE.OrbitControls(orthoCamera, renderer.domElement);
                controlsOrtho.enableKeys = false;

                controls = controlsPerspective;

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
                gridHelper.name = 'helper';
                gridHelper.setColors(0x999999,0xaaaaaa);
                gridHelper.rotation.x = Math.PI/2;//new THREE.Euler(0, 0 ,   0);
                gridHelper.position = new THREE.Vector3(0, 0, 0);
                scene.add(gridHelper);
            }

            // perspective view
            scope.internalControl.perspectiveView = function(){
                scope.internalControl.currentView = 'Perspective';
                scope.internalControl.currentCate = 'Perspective';

                controlsPerspective.reset();

                orthographic = false;
                controlsOrtho.enableRotate = true;
            };

            // top view
            scope.internalControl.topView = function(){
                scope.internalControl.currentView = 'Top';
                scope.internalControl.currentCate = 'Top';


                controlsOrtho.reset();
                controls = controlsOrtho;
                scene.add(orthoCamera);
                controlsOrtho.enableRotate = false;
                orthoCamera.position.set(0,0,1000);
                orthoCamera.lookAt( scene.position );
                orthographic = true;
            };

            // bottom view
            scope.internalControl.bottomView = function(){
                scope.internalControl.currentView = 'Bottom';
                scope.internalControl.currentCate = 'Bottom';

                controlsOrtho.reset();

                orthoCamera.position.set(0,0,-1000);
                orthoCamera.lookAt( scene.position );
                scene.add(orthoCamera);
                controlsOrtho.enableRotate = false;
                orthographic = true;
            };

            //  front view
            scope.internalControl.frontView = function(){
                scope.internalControl.currentView = 'Front';
                scope.internalControl.currentCate = 'Front';

                controlsOrtho.reset();

                orthoCamera.position.set(0,-1000,0);
                orthoCamera.lookAt( scene.position );
                scene.add(orthoCamera);
                controlsOrtho.enableRotate = false;
                orthographic = true;
            };

            // back view
            scope.internalControl.backView = function(){
                scope.internalControl.currentView = 'Back';
                scope.internalControl.currentCate = 'Back';

                controlsOrtho.reset();

                orthoCamera.position.set(0,1000,0);
                orthoCamera.lookAt( scene.position );
                scene.add(orthoCamera);
                controlsOrtho.enableRotate = false;
                orthographic = true;
            };

            // left view
            scope.internalControl.leftView = function(){
                scope.internalControl.currentView = 'Left';
                scope.internalControl.currentCate = 'Left';

                controlsOrtho.reset();

                orthoCamera.position.set(-1000,0,0);
                orthoCamera.lookAt( scene.position );
                scene.add(orthoCamera);
                controlsOrtho.enableRotate = false;
                orthographic = true;
            };

            // right view
            scope.internalControl.rightView = function(){
                scope.internalControl.currentView = 'Right';
                scope.internalControl.currentCate = 'Right';

                controlsOrtho.reset();

                orthoCamera.position.set(1000,0,0);
                orthoCamera.lookAt( scene.position );
                scene.add(orthoCamera);
                controlsOrtho.enableRotate = false;
                orthographic = true;
            };

            scope.internalControl.toggleWireframe = function(){
                wireframe = true;
                for(var i =0; i < scene.children.length; i++){
                    if((scene.children[i] instanceof THREE.Mesh
                        || scene.children[i]  instanceof THREE.Line )&& scene.children[i].name !== 'helper'){
                        scene.children[i].material.wireframe = true;
                    }
                }
            };

            scope.internalControl.toggleRender = function(){
                wireframe = false;
                for(var i =0; i < scene.children.length; i++){
                    if((scene.children[i] instanceof THREE.Mesh
                        || scene.children[i]  instanceof THREE.Line )&& scene.children[i].name !== 'helper'){
                        scene.children[i].material.wireframe = false;
                    }
                }
            };


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

                //VIEWPORT_HEIGHT
                orthoCamera.left = VIEWPORT_WIDTH / -2;
                orthoCamera.right = VIEWPORT_WIDTH / 2;
                orthoCamera.top = VIEWPORT_HEIGHT / 2;
                orthoCamera.bottom = VIEWPORT_HEIGHT / -2;
                orthoCamera.updateProjectionMatrix ();


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
                if(!orthographic){
                    renderer.render(scene, camera);
                }
                else{
                    renderer.render(scene, orthoCamera);
                }
            }

            // clear geometries in scene when run
            scope.internalControl.refreshView = function(){
                for(var i = 0; i < scene.children.length; i++){
                    if( /*akm - (scene.children[i] instanceof THREE.Mesh
                         || scene.children[i]  instanceof THREE.Line
                         || scene.children[i]  instanceof THREE.Object3D
                         || scene.children[i]  instanceof THREE.PointCloud) && scene.children[i].name !== 'helper'*/ scene.children[i].is_mObj == true){
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

                if(value !== undefined){
                    if(value.constructor === Array){
                        for(var i = 0; i< value.length ;i++){
                            scope.internalControl.displayObject(value[i],geomData[i]);
                        }
                    } else {
                        scope.internalControl.displayObject(value,geomData);
                    }
                }

                if(wireframe){
                    for(var i =0; i < scene.children.length; i++){
                        if((scene.children[i] instanceof THREE.Mesh)&& scene.children[i].name !== 'helper'){
                            scene.children[i].material.wireframe = true;
                        }
                    }
                }
            };

            //
            // takes in single data object and categorizes and displays accordingly
            //
            scope.internalControl.displayObject = function(singleGeomObject, singleGeomDataObject){

                // update the 3d viewport
                if(singleGeomObject instanceof THREE.Mesh
                    || singleGeomObject instanceof THREE.Line
                    || singleGeomObject instanceof THREE.PointCloud
                    || singleGeomObject instanceof THREE.Object3D){
                    scene.add(singleGeomObject);
                }
                // update the data table viewport
                if(singleGeomDataObject.length !== 0){
                    scope.internalControl.geometryData = scope.internalControl.geometryData.concat(singleGeomDataObject);
                }
                else{
                    console.log("Mobius doesn't recognise this type!");
                }
            };
        }
    }
});