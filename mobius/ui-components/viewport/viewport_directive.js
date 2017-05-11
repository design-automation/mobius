//
// Three JS View Port Directive
//

/* todo */
// 1.2 geometry control
// 2. gird toggle
// 3. extend view
// 5. set view position


mobius.directive('viewport', function factory() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
            viewModel: "="
        },

        link: function (scope, elem, attrs) {

            if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

            scope.internalControl = scope.control || {};
            scope.internalControl.currentCate = 'Perspective';
            scope.internalControl.currentView = 'Perspective';

            scope.internalControl.LTcurrentCate = 'Top';
            scope.internalControl.LTcurrentView = 'Top';

            scope.internalControl.RTcurrentCate = 'Perspective';
            scope.internalControl.RTcurrentView = 'Perspective';

            scope.internalControl.LBcurrentCate = 'Front';
            scope.internalControl.LBcurrentView = 'Front';

            scope.internalControl.RBcurrentCate = 'Right';
            scope.internalControl.RBcurrentView = 'Right';

            // retrieve the viewport dom element
            var container = elem[0];
            var VIEWPORT_WIDTH = container.offsetWidth ;
            var VIEWPORT_HEIGHT = container.offsetHeight ;



            //var scene;
            var camera,cameraLT, cameraLB, cameraRT, cameraRB;
            var  orthoCamera, orthoCameraLT, orthoCameraLB, orthoCameraRT, orthoCameraRB;

            var renderer, rendererLT,rendererLB,rendererRT,rendererRB;

            var controls,controlsPerspective, controlsOrtho;
            var controlsLT,controlsPerspectiveLT, controlsOrthoLT;
            var controlsRT,controlsPerspectiveRT, controlsOrthoRT;
            var controlsLB,controlsPerspectiveLB, controlsOrthoLB;
            var controlsRB,controlsPerspectiveRB, controlsOrthoRB;

            var orthographic = false;
            var orthographicLT = true;  // start with top
            var orthographicRT = false; // start with perspective
            var orthographicLB = true;  // start with front
            var orthographicRB = true;  // start with right

            var wireframe = false;
            var gridHelper;

            // var stats = new Stats();
            // container.appendChild( stats.dom );
            // stats.dom.style.top = "50px";

            var mergedGeometry = new THREE.Geometry();
            var displayObj = new THREE.Object3D();

            // Initialization
            function init(){
                // create scene
                scene = new THREE.Scene();

                // prepare camera
                var VIEW_ANGLE = 45,
                    ASPECT = VIEWPORT_WIDTH / VIEWPORT_HEIGHT,
                    NEAR = 1,
                    FAR = 100000;

                camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                camera.position.set(-200, -200, 60);
                camera.up.set( 0, 0, 1 );
                camera.lookAt( scene.position );

                cameraLT = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                cameraLT.position.set(-120, -200, 60);
                cameraLT.up.set( 0, 0, 1 );
                cameraLT.lookAt( scene.position );

                cameraLB = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                cameraLB.position.set(-120, -200, 60);
                cameraLB.up.set( 0, 0, 1 );
                cameraLB.lookAt( scene.position );

                cameraRT = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                cameraRT.position.set(-120, -200, 60);
                cameraRT.up.set( 0, 0, 1 );
                cameraRT.lookAt( scene.position );

                cameraRB = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                cameraRB.position.set(-120, -200, 60);
                cameraRB.up.set( 0, 0, 1 );
                cameraRB.lookAt( scene.position );

                orthoCamera = new THREE.OrthographicCamera(
                    VIEWPORT_WIDTH / -2,		// Left
                    VIEWPORT_WIDTH / 2,		    // Right
                    VIEWPORT_HEIGHT / 2,		// Top
                    VIEWPORT_HEIGHT / -2,	    // Bottom
                    NEAR,            			// Near
                    FAR );           			// Far
                orthoCamera.up.set( 0, 0, 1 );

                orthoCameraLT = new THREE.OrthographicCamera(
                    VIEWPORT_WIDTH / -2,		// Left
                    VIEWPORT_WIDTH / 2,		    // Right
                    VIEWPORT_HEIGHT / 2,		// Top
                    VIEWPORT_HEIGHT / -2,	    // Bottom
                    NEAR,            			// Near
                    FAR );           			// Far
                orthoCameraLT.up.set( 0, 0, 1 );

                orthoCameraLB = new THREE.OrthographicCamera(
                    VIEWPORT_WIDTH / -2,		// Left
                    VIEWPORT_WIDTH / 2,		    // Right
                    VIEWPORT_HEIGHT / 2,		// Top
                    VIEWPORT_HEIGHT / -2,	    // Bottom
                    NEAR,            			// Near
                    FAR );           			// Far
                orthoCameraLB.up.set( 0, 0, 1 );

                orthoCameraRT = new THREE.OrthographicCamera(
                    VIEWPORT_WIDTH / -2,		// Left
                    VIEWPORT_WIDTH / 2,		    // Right
                    VIEWPORT_HEIGHT / 2,		// Top
                    VIEWPORT_HEIGHT / -2,	    // Bottom
                    NEAR,            			// Near
                    FAR );           			// Far
                orthoCameraRT.up.set( 0, 0, 1 );

                orthoCameraRB = new THREE.OrthographicCamera(
                    VIEWPORT_WIDTH / -2,		// Left
                    VIEWPORT_WIDTH / 2,		    // Right
                    VIEWPORT_HEIGHT / 2,		// Top
                    VIEWPORT_HEIGHT / -2,	    // Bottom
                    NEAR,            			// Near
                    FAR );           			// Far
                orthoCameraRB.up.set( 0, 0, 1 );


                // prepare renderers
                renderer = new THREE.WebGLRenderer({antialias:true, alpha: false});
                renderer.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
                renderer.setClearColor(0xe0e0e0);

                rendererLT = new THREE.WebGLRenderer({antialias:true, alpha: false});
                rendererLT.setSize(VIEWPORT_WIDTH/2, VIEWPORT_HEIGHT/2);
                rendererLT.setClearColor(0xe0e0e0);

                rendererLB = new THREE.WebGLRenderer({antialias:true, alpha: false});
                rendererLB.setSize(VIEWPORT_WIDTH/2, VIEWPORT_HEIGHT/2);
                rendererLB.setClearColor(0xe0e0e0);

                rendererRB = new THREE.WebGLRenderer({antialias:true, alpha: false});
                rendererRB.setSize(VIEWPORT_WIDTH/2, VIEWPORT_HEIGHT/2);
                rendererRB.setClearColor(0xe0e0e0);

                rendererRT = new THREE.WebGLRenderer({antialias:true, alpha: false});
                rendererRT.setSize(VIEWPORT_WIDTH/2, VIEWPORT_HEIGHT/2);
                rendererRT.setClearColor(0xe0e0e0);

                rendererLT.domElement.id = 'viewLT';
                rendererLB.domElement.id = 'viewLB';
                rendererRT.domElement.id = 'viewRT';
                rendererRB.domElement.id = 'viewRB';
                renderer.domElement.id = 'viewSingle';

                // prepare controls (OrbitControls)
                controlsPerspective = new THREE.OrbitControls(camera, renderer.domElement);
                controlsPerspective.enableKeys = false;

                controlsOrtho = new THREE.OrbitControls(orthoCamera, renderer.domElement);
                controlsOrtho.enableKeys = false;

                controls = controlsPerspective;

                controlsPerspectiveLT = new THREE.OrbitControls(cameraLT, rendererLT.domElement);
                controlsPerspectiveLT.enableKeys = false;

                controlsOrthoLT = new THREE.OrbitControls(orthoCameraLT, rendererLT.domElement);
                controlsOrthoLT.enableKeys = false;

                controlsLT = controlsPerspectiveLT;

                controlsPerspectiveRT = new THREE.OrbitControls(cameraRT, rendererRT.domElement);
                controlsPerspectiveRT.enableKeys = false;

                controlsOrthoRT = new THREE.OrbitControls(orthoCameraRT, rendererRT.domElement);
                controlsOrthoRT.enableKeys = false;

                controlsRT = controlsPerspectiveRT;

                controlsPerspectiveLB = new THREE.OrbitControls(cameraLB, rendererLB.domElement);
                controlsPerspectiveLB.enableKeys = false;

                controlsOrthoLB = new THREE.OrbitControls(orthoCameraLB, rendererLB.domElement);
                controlsOrthoLB.enableKeys = false;

                controlsLB = controlsPerspectiveLB;

                controlsPerspectiveRB = new THREE.OrbitControls(cameraRB, rendererRB.domElement);
                controlsPerspectiveRB.enableKeys = false;

                controlsOrthoRB = new THREE.OrbitControls(orthoCameraRB, rendererRB.domElement);
                controlsOrthoRB.enableKeys = false;

                controlsRB = controlsPerspectiveRB;

                //container.appendChild(renderer.domElement);

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
                gridHelper = new THREE.GridHelper(100, 10); // 100 is grid size, 10 is grid step
                gridHelper.name = 'helper';
                gridHelper.setColors(0x999999,0xaaaaaa);
                gridHelper.rotation.x = Math.PI/2;//new THREE.Euler(0, 0 ,   0);
                gridHelper.position = new THREE.Vector3(0, 0, 0);
                scene.add(gridHelper);

                renderer.domElement.addEventListener( 'mousemove', onchange );
                renderer.domElement.addEventListener( 'wheel', onchange);

                rendererLT.domElement.addEventListener( 'mousemove', onchange );
                rendererLB.domElement.addEventListener( 'mousemove', onchange );
                rendererRT.domElement.addEventListener( 'mousemove', onchange );
                rendererRB.domElement.addEventListener( 'mousemove', onchange );

                rendererLT.domElement.addEventListener( 'wheel', onchange );
                rendererLB.domElement.addEventListener( 'wheel', onchange );
                rendererRT.domElement.addEventListener( 'wheel', onchange );
                rendererRB.domElement.addEventListener( 'wheel', onchange );
            }

            init();
            render();

            function onchange() {
                requestAnimationFrame(render);
                update();
            }

            scope.internalControl.onchange = function (){
                requestAnimationFrame(render);
                update();
            };

            // perspective view
            scope.internalControl.perspectiveView = function(view){
                switch (view){
                    case 'main':
                        scope.internalControl.currentView = 'Perspective';
                        scope.internalControl.currentCate = 'Perspective';
                        controls = controlsPerspective;
                        controlsPerspective.reset();
                        orthographic = false;
                        //controlsOrtho.enableRotate = true;
                        break;
                    case 'LT':
                        scope.internalControl.LTcurrentView = 'Perspective';
                        scope.internalControl.LTcurrentCate = 'Perspective';
                        controlsLT = controlsPerspectiveLT;
                        controlsPerspectiveLT.reset();
                        orthographicLT = false;
                        //controlsOrthoLT.enableRotate = true;
                        break;
                    case 'RT':
                        scope.internalControl.RTcurrentView = 'Perspective';
                        scope.internalControl.RTcurrentCate = 'Perspective';
                        controlsPerspectiveRT.reset();
                        controlsRT = controlsPerspectiveRT;
                        orthographicRT = false;
                        //controlsOrthoRT.enableRotate = true;
                        break;
                    case 'LB':
                        scope.internalControl.LBcurrentView = 'Perspective';
                        scope.internalControl.LBcurrentCate = 'Perspective';
                        controlsLB = controlsPerspectiveLB;
                        controlsPerspectiveLB.reset();
                        orthographicLB = false;
                        //controlsOrthoLB.enableRotate = true;
                        break;
                    case 'RB':
                        scope.internalControl.RBcurrentView = 'Perspective';
                        scope.internalControl.RBcurrentCate = 'Perspective';
                        controlsRB = controlsPerspectiveRB;
                        controlsPerspectiveRB.reset();
                        orthographicRB = false;
                        //controlsOrthoRB.enableRotate = true;
                        break;
                }

            };

            // top view
            scope.internalControl.topView = function(view){
                switch (view){
                    case 'main':
                        scope.internalControl.currentView = 'Top';
                        scope.internalControl.currentCate = 'Top';
                        controlsOrtho.reset();
                        controls = controlsOrtho;
                        scene.add(orthoCamera);
                        controlsOrtho.enableRotate = false;
                        orthoCamera.position.set(0,0,1000);
                        orthoCamera.lookAt( scene.position );
                        orthographic = true;
                        break;
                    case 'LT':
                        scope.internalControl.LTcurrentView = 'Top';
                        scope.internalControl.LTcurrentCate = 'Top';
                        controlsOrthoLT.reset();
                        scene.add(orthoCameraLT);
                        controlsOrthoLT.enableRotate = false;
                        orthoCameraLT.position.set(0,0,1000);
                        orthoCameraLT.lookAt( scene.position );
                        orthographicLT = true;
                        break;
                    case 'RT':
                        scope.internalControl.RTcurrentView = 'Top';
                        scope.internalControl.RTcurrentCate = 'Top';
                        controlsOrthoRT.reset();
                        scene.add(orthoCameraRT);
                        controlsOrthoRT.enableRotate = false;
                        orthoCameraRT.position.set(0,0,1000);
                        orthoCameraRT.lookAt( scene.position );
                        orthographicRT = true;
                        break;
                    case 'LB':
                        scope.internalControl.LBcurrentView = 'Top';
                        scope.internalControl.LBcurrentCate = 'Top';
                        controlsOrthoLB.reset();
                        scene.add(orthoCameraLB);
                        controlsOrthoLB.enableRotate = false;
                        orthoCameraLB.position.set(0,0,1000);
                        orthoCameraLB.lookAt( scene.position );
                        orthographicLB = true;
                        break;
                    case 'RB':
                        scope.internalControl.RBcurrentView = 'Top';
                        scope.internalControl.RBcurrentCate = 'Top';
                        controlsOrthoRB.reset();
                        scene.add(orthoCameraRB);
                        controlsOrthoRB.enableRotate = false;
                        orthoCameraRB.position.set(0,0,1000);
                        orthoCameraRB.lookAt( scene.position );
                        orthographicRB = true;
                        break;
                }
            };

            // bottom view
            scope.internalControl.bottomView = function(view){
                switch (view){
                    case 'main':
                        scope.internalControl.currentView = 'Bottom';
                        scope.internalControl.currentCate = 'Bottom';
                        controlsOrtho.reset();
                        controls = controlsOrtho;
                        scene.add(orthoCamera);
                        controlsOrtho.enableRotate = false;
                        orthoCamera.position.set(0,0,-1000);
                        orthoCamera.lookAt( scene.position );
                        orthographic = true;
                        break;
                    case 'LT':
                        scope.internalControl.LTcurrentView = 'Bottom';
                        scope.internalControl.LTcurrentCate = 'Bottom';
                        controlsOrthoLT.reset();
                        scene.add(orthoCameraLT);
                        controlsOrthoLT.enableRotate = false;
                        orthoCameraLT.position.set(0,0,-1000);
                        orthoCameraLT.lookAt( scene.position );
                        orthographicLT = true;
                        controlsOrthoLT.update()
                        break;
                    case 'RT':
                        scope.internalControl.RTcurrentView = 'Bottom';
                        scope.internalControl.RTcurrentCate = 'Bottom';
                        controlsOrthoRT.reset();
                        scene.add(orthoCameraRT);
                        controlsOrthoRT.enableRotate = false;
                        orthoCameraRT.position.set(0,0,-1000);
                        orthoCameraRT.lookAt( scene.position );
                        orthographicRT = true;
                        controlsOrthoRT.update()
                        break;
                    case 'LB':
                        scope.internalControl.LBcurrentView = 'Bottom';
                        scope.internalControl.LBcurrentCate = 'Bottom';
                        controlsOrthoLB.reset();
                        scene.add(orthoCameraLB);
                        controlsOrthoLB.enableRotate = false;
                        orthoCameraLB.position.set(0,0,-1000);
                        orthoCameraLB.lookAt( scene.position );
                        orthographicLB = true;
                        controlsOrthoLB.update()
                        break;
                    case 'RB':
                        scope.internalControl.RBcurrentView = 'Bottom';
                        scope.internalControl.RBcurrentCate = 'Bottom';
                        controlsOrthoRB.reset();
                        scene.add(orthoCameraRB);
                        controlsOrthoRB.enableRotate = false;
                        orthoCameraRB.position.set(0,0,-1000);
                        orthoCameraRB.lookAt( scene.position );
                        orthographicRB = true;
                        controlsOrthoRB.update()
                        break;
                }
            };

            //  front view
            scope.internalControl.frontView = function(view){
                switch (view){
                    case 'main':
                        scope.internalControl.currentView = 'Front';
                        scope.internalControl.currentCate = 'Front';
                        controlsOrtho.reset();
                        orthoCamera.position.set(0,-1000,0);
                        orthoCamera.lookAt( scene.position );
                        scene.add(orthoCamera);
                        controlsOrtho.enableRotate = false;
                        orthographic = true;
                        break;
                    case 'LT':
                        scope.internalControl.LTcurrentView = 'Front';
                        scope.internalControl.LTcurrentCate = 'Front';
                        controlsOrthoLT.reset();
                        orthoCameraLT.position.set(0,-1000,0);
                        orthoCameraLT.lookAt( scene.position );
                        scene.add(orthoCameraLT);
                        controlsOrthoLT.enableRotate = false;
                        orthographicLT = true;
                        break;
                    case 'RT':
                        scope.internalControl.RTcurrentView = 'Front';
                        scope.internalControl.RTcurrentCate = 'Front';
                        controlsOrthoRT.reset();
                        orthoCameraRT.position.set(0,-1000,0);
                        orthoCameraRT.lookAt( scene.position );
                        scene.add(orthoCameraRT);
                        controlsOrthoRT.enableRotate = false;
                        orthographicRT = true;
                        break;
                    case 'LB':
                        scope.internalControl.LBcurrentView = 'Front';
                        scope.internalControl.LBcurrentCate = 'Front';
                        controlsOrthoLB.reset();
                        orthoCameraLB.position.set(0,-1000,0);
                        orthoCameraLB.lookAt( scene.position );
                        scene.add(orthoCameraLB);
                        controlsOrthoLB.enableRotate = false;
                        orthographicLB = true;
                        break;
                    case 'RB':
                        scope.internalControl.RBcurrentView = 'Front';
                        scope.internalControl.RBcurrentCate = 'Front';
                        controlsOrthoRB.reset();
                        orthoCameraRB.position.set(0,-1000,0);
                        orthoCameraRB.lookAt( scene.position );
                        scene.add(orthoCameraRB);
                        controlsOrthoRB.enableRotate = false;
                        orthographicRB = true;
                        break;
                }

            };

            // back view
            scope.internalControl.backView = function(view){
                switch (view){
                    case 'main':
                        scope.internalControl.currentView = 'Back';
                        scope.internalControl.currentCate = 'Back';
                        controlsOrtho.reset();
                        orthoCamera.position.set(0,1000,0);
                        orthoCamera.lookAt( scene.position );
                        scene.add(orthoCamera);
                        controlsOrtho.enableRotate = false;
                        orthographic = true;
                        break;
                    case 'LT':
                        scope.internalControl.LTcurrentView = 'Back';
                        scope.internalControl.LTcurrentCate = 'Back';
                        controlsOrthoLT.reset();
                        orthoCameraLT.position.set(0,1000,0);
                        orthoCameraLT.lookAt( scene.position );
                        scene.add(orthoCameraLT);
                        controlsOrthoLT.enableRotate = false;
                        orthographicLT = true;
                        break;
                    case 'RT':
                        scope.internalControl.RTcurrentView = 'Back';
                        scope.internalControl.RTcurrentCate = 'Back';
                        controlsOrthoRT.reset();
                        orthoCameraRT.position.set(0,1000,0);
                        orthoCameraRT.lookAt( scene.position );
                        scene.add(orthoCameraRT);
                        controlsOrthoRT.enableRotate = false;
                        orthographicRT = true;
                        break;
                    case 'LB':
                        scope.internalControl.LBcurrentView = 'Back';
                        scope.internalControl.LBcurrentCate = 'Back';
                        controlsOrthoLB.reset();
                        orthoCameraLB.position.set(0,1000,0);
                        orthoCameraLB.lookAt( scene.position );
                        scene.add(orthoCameraLB);
                        controlsOrthoLB.enableRotate = false;
                        orthographicLB = true;
                        break;
                    case 'RB':
                        scope.internalControl.RBcurrentView = 'Back';
                        scope.internalControl.RBcurrentCate = 'Back';
                        controlsOrthoRB.reset();
                        orthoCameraRB.position.set(0,1000,0);
                        orthoCameraRB.lookAt( scene.position );
                        scene.add(orthoCameraRB);
                        controlsOrthoRB.enableRotate = false;
                        orthographicRB = true;
                        break;
                }
            };

            // left view
            scope.internalControl.leftView = function(view){
                switch (view){
                    case 'main':
                        scope.internalControl.currentView = 'Left';
                        scope.internalControl.currentCate = 'Left';
                        controlsOrtho.reset();
                        orthoCamera.position.set(-1000,0,0);
                        orthoCamera.lookAt( scene.position );
                        scene.add(orthoCamera);
                        controlsOrtho.enableRotate = false;
                        orthographic = true;
                        break;
                    case 'LT':
                        scope.internalControl.LTcurrentView = 'Left';
                        scope.internalControl.LTcurrentCate = 'Left';
                        controlsOrthoLT.reset();
                        orthoCameraLT.position.set(-1000,0,0);
                        orthoCameraLT.lookAt( scene.position );
                        scene.add(orthoCameraLT);
                        controlsOrthoLT.enableRotate = false;
                        orthographicLT = true;
                        break;
                    case 'RT':
                        scope.internalControl.RTcurrentView = 'Left';
                        scope.internalControl.RTcurrentCate = 'Left';
                        controlsOrthoRT.reset();
                        orthoCameraRT.position.set(-1000,0,0);
                        orthoCameraRT.lookAt( scene.position );
                        scene.add(orthoCameraRT);
                        controlsOrthoRT.enableRotate = false;
                        orthographicRT = true;
                        break;
                    case 'LB':
                        scope.internalControl.LBcurrentView = 'Left';
                        scope.internalControl.LBcurrentCate = 'Left';
                        controlsOrthoLB.reset();
                        orthoCameraLB.position.set(-1000,0,0);
                        orthoCameraLB.lookAt( scene.position );
                        scene.add(orthoCameraLB);
                        controlsOrthoLB.enableRotate = false;
                        orthographicLB = true;
                        break;
                    case 'RB':
                        scope.internalControl.RBcurrentView = 'Left';
                        scope.internalControl.RBcurrentCate = 'Left';
                        controlsOrthoRB.reset();
                        orthoCameraRB.position.set(-1000,0,0);
                        orthoCameraRB.lookAt( scene.position );
                        scene.add(orthoCameraRB);
                        controlsOrthoRB.enableRotate = false;
                        orthographicRB = true;
                        break;
                }
            };

            // right view
            scope.internalControl.rightView = function(view){
                switch (view){
                    case 'main':
                        scope.internalControl.currentView = 'Right';
                        scope.internalControl.currentCate = 'Right';
                        controlsOrtho.reset();
                        orthoCamera.position.set(1000,0,0);
                        orthoCamera.lookAt( scene.position );
                        scene.add(orthoCamera);
                        controlsOrtho.enableRotate = false;
                        orthographic = true;
                        break;
                    case 'LT':
                        scope.internalControl.LTcurrentView = 'Right';
                        scope.internalControl.LTcurrentCate = 'Right';
                        controlsOrthoLT.reset();
                        orthoCameraLT.position.set(1000,0,0);
                        orthoCameraLT.lookAt( scene.position );
                        scene.add(orthoCameraLT);
                        controlsOrthoLT.enableRotate = false;
                        orthographicLT = true;
                        break;
                    case 'RT':
                        scope.internalControl.RTcurrentView = 'Right';
                        scope.internalControl.RTcurrentCate = 'Right';
                        controlsOrthoRT.reset();
                        orthoCameraRT.position.set(1000,0,0);
                        orthoCameraRT.lookAt( scene.position );
                        scene.add(orthoCameraRT);
                        controlsOrthoRT.enableRotate = false;
                        orthographicRT = true;
                        break;
                    case 'LB':
                        scope.internalControl.LBcurrentView = 'Right';
                        scope.internalControl.LBcurrentCate = 'Right';
                        controlsOrthoLB.reset();
                        orthoCameraLB.position.set(1000,0,0);
                        orthoCameraLB.lookAt( scene.position );
                        scene.add(orthoCameraLB);
                        controlsOrthoLB.enableRotate = false;
                        orthographicLB = true;
                        break;
                    case 'RB':
                        scope.internalControl.RBcurrentView = 'Right';
                        scope.internalControl.RBcurrentCate = 'Right';
                        controlsOrthoRB.reset();
                        orthoCameraRB.position.set(1000,0,0);
                        orthoCameraRB.lookAt( scene.position );
                        scene.add(orthoCameraRB);
                        controlsOrthoRB.enableRotate = false;
                        orthographicRB = true;
                        break;
                }
            };

            var wireframeMain = false;
            var wireframeLT = false;
            var wireframeRT = false;
            var wireframeLB = false;
            var wireframeRB = false;

            scope.internalControl.wireframeOption = function (view){
                switch (view){
                    case 'main':
                        wireframeMain = true;
                        break;
                    case 'LT':
                        wireframeLT = true;
                        break;
                    case 'RT':
                        wireframeRT = true;
                        break;
                    case 'LB':
                        wireframeLB = true;
                        break;
                    case 'RB':
                        wireframeRB = true;
                        break;
                }
            };

            scope.internalControl.renderOption = function (view){
                switch (view){
                    case 'main':
                        wireframeMain = false;
                        break;
                    case 'LT':
                        wireframeLT = false;
                        break;
                    case 'RT':
                        wireframeRT = false;
                        break;
                    case 'LB':
                        wireframeLB = false;
                        break;
                    case 'RB':
                        wireframeRB = false;
                        break;
                }
            };

            scope.internalControl.toggleWireframe = function(view){
                switch (view){
                    case 'main' : wireframe = true;
                        break;
                    case 'LT':wireframeLT = true;
                        break;
                    case 'RT':wireframeRT = true;
                        break;
                    case 'LB':wireframeLB = true;
                        break;
                    case 'RB':wireframeRB = true;
                        break;
                }

                for(var i =0; i < scene.children.length; i++){
                    if( scene.children[i].name !== 'helper'){
                        traverse(scene.children[i]);
                    }
                }
                function traverse(obj){
                    if(obj.children){
                        for(var j = 0;j < obj.children.length;j++){
                            if(obj.children[j] instanceof  THREE.Mesh){
                                obj.children[j].material.wireframe = true;
                            }else if(obj.children[j].children.length>0){
                                traverse(obj.children[j])
                            }
                        }
                    }
                }
            };

            scope.internalControl.toggleRender = function(view){
                switch (view){
                    case 'main' : wireframe = false;
                        break;
                    case 'LT':wireframeLT = false;
                        break;
                    case 'RT':wireframeRT = false;
                        break;
                    case 'LB':wireframeLB = false;
                        break;
                    case 'RB':wireframeRB = false;
                        break;
                }
                for(var i =0; i < scene.children.length; i++){
                    if( scene.children[i].name !== 'helper'){
                        traverse(scene.children[i]);
                        function traverse(obj){
                            for(var j = 0;j < obj.children.length;j++){
                                if(obj.children[j] instanceof  THREE.Mesh){
                                    obj.children[j].material.wireframe = false;
                                }else if(obj.children[j].children.length>0){
                                    traverse(obj.children[j])
                                }
                            }
                        }
                    }
                }
            };

            scope.internalControl.toggleGrid = function(){
                gridHelper.visible = !gridHelper.visible;
                onchange()
            };


            // monitoring viewport size change
            scope.$watch(
                function () {
                    return {
                        width: elem[0].clientWidth,
                        height: elem[0].clientHeight
                    }
                },
                function (newValue, oldValue) {
                        VIEWPORT_WIDTH = container.clientWidth;
                        VIEWPORT_HEIGHT = container.clientHeight;
                        resizeUpdate();
                },
                true
            );

            scope.$watch(function(){return scope.internalControl.layout}, function(newValue, oldValue){
                if(newValue !== oldValue){
                    onchange()
                }
            });

            // update on resize of viewport
            function resizeUpdate() {
                onchange();
                var VIEWPORT_WIDTH = container.clientWidth;
                var VIEWPORT_HEIGHT = container.clientHeight;

                camera.aspect = VIEWPORT_WIDTH / VIEWPORT_HEIGHT;
                camera.updateProjectionMatrix ();

                cameraLT.aspect = VIEWPORT_WIDTH / VIEWPORT_HEIGHT;
                cameraLT.updateProjectionMatrix ();

                cameraRT.aspect = VIEWPORT_WIDTH / VIEWPORT_HEIGHT;
                cameraRT.updateProjectionMatrix ();

                cameraLB.aspect = VIEWPORT_WIDTH / VIEWPORT_HEIGHT;
                cameraLB.updateProjectionMatrix ();

                cameraRB.aspect = VIEWPORT_WIDTH / VIEWPORT_HEIGHT;
                cameraRB.updateProjectionMatrix ();

                //VIEWPORT_HEIGHT
                orthoCamera.left = VIEWPORT_WIDTH / -2;
                orthoCamera.right = VIEWPORT_WIDTH / 2;
                orthoCamera.top = VIEWPORT_HEIGHT / 2;
                orthoCamera.bottom = VIEWPORT_HEIGHT / -2;
                orthoCamera.updateProjectionMatrix ();

                orthoCameraLT.left = VIEWPORT_WIDTH / -2;
                orthoCameraLT.right = VIEWPORT_WIDTH / 2;
                orthoCameraLT.top = VIEWPORT_HEIGHT / 2;
                orthoCameraLT.bottom = VIEWPORT_HEIGHT / -2;
                orthoCameraLT.updateProjectionMatrix ();

                orthoCameraRT.left = VIEWPORT_WIDTH / -2;
                orthoCameraRT.right = VIEWPORT_WIDTH / 2;
                orthoCameraRT.top = VIEWPORT_HEIGHT / 2;
                orthoCameraRT.bottom = VIEWPORT_HEIGHT / -2;
                orthoCameraRT.updateProjectionMatrix ();

                orthoCameraLB.left = VIEWPORT_WIDTH / -2;
                orthoCameraLB.right = VIEWPORT_WIDTH / 2;
                orthoCameraLB.top = VIEWPORT_HEIGHT / 2;
                orthoCameraLB.bottom = VIEWPORT_HEIGHT / -2;
                orthoCameraLB.updateProjectionMatrix ();

                orthoCameraRB.left = VIEWPORT_WIDTH / -2;
                orthoCameraRB.right = VIEWPORT_WIDTH / 2;
                orthoCameraRB.top = VIEWPORT_HEIGHT / 2;
                orthoCameraRB.bottom = VIEWPORT_HEIGHT / -2;
                orthoCameraRB.updateProjectionMatrix ();


                rendererLT.setSize(VIEWPORT_WIDTH/2, VIEWPORT_HEIGHT/2);
                rendererLB.setSize(VIEWPORT_WIDTH/2, VIEWPORT_HEIGHT/2);
                rendererRT.setSize(VIEWPORT_WIDTH/2, VIEWPORT_HEIGHT/2);
                rendererRB.setSize(VIEWPORT_WIDTH/2, VIEWPORT_HEIGHT/2);
                renderer.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);


                if(scope.internalControl.layout === 'singleView' && scope.internalControl.showGeometry){
                    if( document.getElementById("viewLT")){
                        document.getElementById("viewLT").remove();
                        document.getElementById("viewLB").remove();
                        document.getElementById("viewRT").remove();
                        document.getElementById("viewRB").remove();
                    }

                    container.appendChild(renderer.domElement);
                    document.getElementById("viewSingle").style.display = "inline";


                }else if(scope.internalControl.layout === 'fourViews'){
                    if(document.getElementById("singleView")) {
                        document.getElementById("singleView").style.display = "none";
                }
                    scope.internalControl.topView('LT');
                    scope.internalControl.frontView('LB');
                    scope.internalControl.rightView('RB');

                    document.getElementById("LT").appendChild(rendererLT.domElement);
                    document.getElementById("RT").appendChild(rendererRT.domElement);
                    document.getElementById("LB").appendChild(rendererLB.domElement);
                    document.getElementById("RB").appendChild(rendererRB.domElement);
                }
            }

            // Animate the scene
            function animate() {
                requestAnimationFrame(animate);
                // stats.update();
                render();
                update();
            }

            // Update controls and stats
            function update() {
                controls.update();
                // fixme only update the current control
                controlsLT.update();
                controlsLB.update();
                controlsRT.update();
                controlsRB.update();
            }

            // Render the scene
            function render() {
                if(scope.internalControl.layout === 'singleView' && scope.internalControl.showGeometry){
                    if(document.getElementById("viewLT")){
                        document.getElementById("viewLT").remove();
                        document.getElementById("viewLB").remove();
                        document.getElementById("viewRT").remove();
                        document.getElementById("viewRB").remove();
                    }
                    container.appendChild(renderer.domElement);
                    document.getElementById("viewSingle").style.display = "inline";
                    renderer.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

                    //if(wireframeMain){
                    //    scope.internalControl.toggleWireframe();
                    //}else{
                    //    scope.internalControl.toggleRender();
                    //}

                    if(!orthographic){
                        renderer.render(scene, camera);
                    }
                    else{
                        renderer.render(scene, orthoCamera);
                    }
                }
                else if(scope.internalControl.layout === 'fourViews'){

                    if(document.getElementById("viewSingle")) {
                        document.getElementById("viewSingle").style.display = "none";
                    }

                    document.getElementById("LT").appendChild(rendererLT.domElement);
                    document.getElementById("RT").appendChild(rendererRT.domElement);
                    document.getElementById("LB").appendChild(rendererLB.domElement);
                    document.getElementById("RB").appendChild(rendererRB.domElement);

                    if(wireframeLT){
                        scope.internalControl.toggleWireframe();
                    }else{
                        scope.internalControl.toggleRender();
                    }

                    if(!orthographicLT){
                        rendererLT.render(scene, cameraLT);
                    }
                    else{
                        rendererLT.render(scene, orthoCameraLT);
                    }

                    if(wireframeRT){
                        scope.internalControl.toggleWireframe();
                    }else{
                        scope.internalControl.toggleRender();
                    }

                    if(!orthographicRT){
                        rendererRT.render(scene, cameraRT);
                    }
                    else{
                        rendererRT.render(scene, orthoCameraRT);
                    }

                    if(wireframeLB){
                        scope.internalControl.toggleWireframe();
                    }else{
                        scope.internalControl.toggleRender();
                    }

                    if(!orthographicLB){
                        rendererLB.render(scene, cameraLB);
                    }
                    else{
                        rendererLB.render(scene, orthoCameraLB);
                    }

                    if(wireframeRB){
                        scope.internalControl.toggleWireframe();
                    }else{
                        scope.internalControl.toggleRender();
                    }

                    if(!orthographicRB){
                        rendererRB.render(scene, cameraRB);
                    }
                    else{
                        rendererRB.render(scene, orthoCameraRB);
                    }
                }
            }

            // clear geometries in scene when run
            scope.internalControl.refreshView = function(){
                for(var i = 0; i < scene.children.length; i++){
                    if( scene.children[i].name !== 'helper' &&
                        !(scene.children[i] instanceof THREE.AmbientLight) &&
                        !(scene.children[i] instanceof THREE.PointLight) ) {
                        scene.remove(scene.children[i]);
                        i--;
                    }
                }
                displayObj = new THREE.Object3D();
                onchange();
            };

            scope.internalControl.refreshData = function(){
                scope.internalControl.geometryData = [];
            };

            //
            // supporting function for geometry from verb to three.js
            //
            scope.internalControl.addGeometryToScene = function(geom){
                for(var i = 0; i< geom.length; i++){
                    if(geom[i] instanceof Array){
                        scope.internalControl.addGeometryToScene( geom[i] )
                    }else{
                        displayObj.add( geom[i] );
                    }
                }
                scene.add(displayObj);
                onchange();
            };


            scope.internalControl.addDataToScene = function(geom,value,geomData,connectorName){
                if(value !== undefined){
                    if(value.constructor === Array){
                        for(var i = 0; i< value.length ;i++){
                            scope.internalControl.displayObject(value[i],geomData[i],connectorName);
                        }
                    } else {
                        scope.internalControl.displayObject(value,geomData,connectorName);
                    }
                }
            };

            //
            // takes in single data object and categorizes and displays accordingly
            //
            scope.internalControl.displayObject = function(singleGeomObject, singleGeomDataObject,connectorName){
                if(singleGeomDataObject.length !== 0){
                    scope.internalControl.geometryData[connectorName] = scope.internalControl.geometryData[connectorName].concat(singleGeomDataObject);
                }
            };

            //
            // zoom to extend
            //
            scope.internalControl.zoomToExtend = function(view){
                if(displayObj.children.length > 0){
                    var cam,control, newPos,newLookAt;
                    var boxHelper = new THREE.BoundingBoxHelper(displayObj, 0xff0000);
                    boxHelper.update();
                    var boundingSphere = boxHelper.box.getBoundingSphere();
                    var center = boundingSphere.center;
                    var radius = boundingSphere.radius;

                    var fov = camera.fov * ( Math.PI / 180 );

                    switch (view){
                        case 'main':
                            if( scope.internalControl.currentView === 'Perspective'){
                                cam = camera;
                                control = controls;
                                newPos = perspectiveNewPos();
                                newLookAt = new THREE.Vector3(center.x,center.y,center.z)
                            }else{
                                cam = orthoCamera;
                                control = controlsOrtho;
                                newPos = orthoNewPos(scope.internalControl.currentView);
                                newLookAt = orthoNewLookAt(scope.internalControl.currentView);
                            }
                            break;
                        case 'LT':
                            if( scope.internalControl.LTcurrentView === 'Perspective'){
                                cam = cameraLT;
                                newPos = perspectiveNewPos();
                                control = controlsLT;
                                newLookAt = new THREE.Vector3(center.x,center.y,center.z)
                            }else{
                                cam = orthoCameraLT;
                                control = controlsOrthoLT;
                                newPos = orthoNewPos(scope.internalControl.LTcurrentView);
                                newLookAt = orthoNewLookAt(scope.internalControl.LTcurrentView);
                            }
                            break;
                        case 'RT':
                            if( scope.internalControl.RTcurrentView === 'Perspective'){
                                cam = cameraRT;
                                control = controlsRT;
                                newPos = perspectiveNewPos();
                                newLookAt = new THREE.Vector3(center.x,center.y,center.z)
                            }else{
                                cam = orthoCameraRT;
                                control = controlsOrthoRT;
                                newPos = orthoNewPos(scope.internalControl.RTcurrentView);
                                newLookAt = orthoNewLookAt(scope.internalControl.RTcurrentView);
                            }
                            break;
                        case 'LB':
                            if( scope.internalControl.LBcurrentView === 'Perspective'){
                                cam = cameraLB;
                                control = controlsLB;
                                newPos = perspectiveNewPos();
                                newLookAt = new THREE.Vector3(center.x,center.y,center.z)
                            }else{
                                cam = orthoCameraLB;
                                control = controlsOrthoLB;
                                newPos = orthoNewPos( scope.internalControl.LBcurrentView);
                                newLookAt = orthoNewLookAt(scope.internalControl.LBcurrentView);
                            }
                            break;
                        case 'RB':
                            control = controlsRB;
                            if( scope.internalControl.RBcurrentView === 'Perspective'){
                                cam = cameraRB;
                                newPos = perspectiveNewPos();
                                newLookAt = new THREE.Vector3(center.x,center.y,center.z)
                            }else{
                                cam = orthoCameraRB;
                                control = controlsOrthoRB;
                                newPos = orthoNewPos(scope.internalControl.RBcurrentView);
                                newLookAt = orthoNewLookAt(scope.internalControl.RBcurrentView);
                            }
                            break;
                    }

                    function perspectiveNewPos() {
                        return new THREE.Vector3(center.x + Math.abs( radius / Math.sin( fov / 2 )),
                            center.y + Math.abs( radius / Math.sin( fov / 2 ) ),
                            center.z + Math.abs( radius / Math.sin( fov / 2 )));
                    }

                    function orthoNewLookAt(view){
                        control.enableRotate = false;
                        switch (view){
                            case 'Top':
                                return new THREE.Vector3(center.x, center.y, 0);
                                break;
                            case 'Bottom':
                                return new THREE.Vector3(center.x, center.y, 0);
                                break;
                            case 'Left':
                                return new THREE.Vector3(0,center.y,center.z);
                                break;
                            case 'Right':
                                return new THREE.Vector3(0,center.y,center.z);
                                break;
                            case 'Front':
                                return new THREE.Vector3(center.x,0,center.z);
                                break;
                            case 'Back':
                                return new THREE.Vector3(center.x,0,center.z);
                                break;
                        }
                    }

                    function  orthoNewPos (view){
                        switch (view){
                            case 'Top':
                                return new THREE.Vector3(center.x, center.y, center.z + Math.abs( radius / Math.sin( fov / 2 )));
                                break;
                            case 'Bottom':
                                return new THREE.Vector3(center.x, center.y, -(center.z + Math.abs( radius / Math.sin( fov / 2 ))));
                                break;
                            case 'Left':
                                return new THREE.Vector3(-(center.x + Math.abs( radius / Math.sin( fov / 2 ))),center.y,center.z);
                                break;
                            case 'Right':
                                return new THREE.Vector3(center.x + Math.abs( radius / Math.sin( fov / 2 )),center.y,center.z);
                                break;
                            case 'Front':
                                return new THREE.Vector3(center.x, -(center.y + Math.abs( radius / Math.sin( fov / 2 ) )), center.z);
                                break;
                            case 'Back':
                                return new THREE.Vector3(center.x, center.y + Math.abs( radius / Math.sin( fov / 2 ) ), center.z);
                                break;
                        }
                    }

                    cam.position.copy(newPos);
                    cam.updateProjectionMatrix();

                    cam.lookAt(newLookAt);
                    cam.updateProjectionMatrix();
                    cam.zoom = 1;
                    cam.updateProjectionMatrix();

                    control.target.set(newLookAt.x, newLookAt.y,newLookAt.z);

                    onchange();
                }
            };


        }
    }
});

