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
            var VIEWPORT_WIDTH = container.offsetWidth;
            var VIEWPORT_HEIGHT = container.offsetHeight;

            var scene;
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
                    -2000,            			// Near
                    5000 );           			// Far
                orthoCamera.up.set( 0, 0, 1 );

                orthoCameraLT = new THREE.OrthographicCamera(
                    VIEWPORT_WIDTH / -2,		// Left
                    VIEWPORT_WIDTH / 2,		    // Right
                    VIEWPORT_HEIGHT / 2,		// Top
                    VIEWPORT_HEIGHT / -2,	    // Bottom
                    -2000,            			// Near
                    5000 );           			// Far
                orthoCameraLT.up.set( 0, 0, 1 );

                orthoCameraLB = new THREE.OrthographicCamera(
                    VIEWPORT_WIDTH / -2,		// Left
                    VIEWPORT_WIDTH / 2,		    // Right
                    VIEWPORT_HEIGHT / 2,		// Top
                    VIEWPORT_HEIGHT / -2,	    // Bottom
                    -2000,            			// Near
                    5000 );           			// Far
                orthoCameraLB.up.set( 0, 0, 1 );

                orthoCameraRT = new THREE.OrthographicCamera(
                    VIEWPORT_WIDTH / -2,		// Left
                    VIEWPORT_WIDTH / 2,		    // Right
                    VIEWPORT_HEIGHT / 2,		// Top
                    VIEWPORT_HEIGHT / -2,	    // Bottom
                    -2000,            			// Near
                    5000 );           			// Far
                orthoCameraRT.up.set( 0, 0, 1 );

                orthoCameraRB = new THREE.OrthographicCamera(
                    VIEWPORT_WIDTH / -2,		// Left
                    VIEWPORT_WIDTH / 2,		    // Right
                    VIEWPORT_HEIGHT / 2,		// Top
                    VIEWPORT_HEIGHT / -2,	    // Bottom
                    -2000,            			// Near
                    5000 );           			// Far
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
                var gridHelper = new THREE.GridHelper(100, 10); // 100 is grid size, 10 is grid step
                gridHelper.name = 'helper';
                gridHelper.setColors(0x999999,0xaaaaaa);
                gridHelper.rotation.x = Math.PI/2;//new THREE.Euler(0, 0 ,   0);
                gridHelper.position = new THREE.Vector3(0, 0, 0);
                scene.add(gridHelper);
            }

            // perspective view
            scope.internalControl.perspectiveView = function(view){
                switch (view){
                    case 'main':
                        scope.internalControl.currentView = 'Perspective';
                        scope.internalControl.currentCate = 'Perspective';
                        controlsPerspective.reset();
                        orthographic = false;
                        controlsOrtho.enableRotate = true;
                        break;
                    case 'LT':
                        scope.internalControl.LTcurrentView = 'Perspective';
                        scope.internalControl.LTcurrentCate = 'Perspective';
                        controlsPerspectiveLT.reset();
                        orthographicLT = false;
                        controlsOrthoLT.enableRotate = true;
                        break;
                    case 'RT':
                        scope.internalControl.RTcurrentView = 'Perspective';
                        scope.internalControl.RTcurrentCate = 'Perspective';
                        controlsPerspectiveRT.reset();
                        orthographicRT = false;
                        controlsOrthoRT.enableRotate = true;
                        break;
                    case 'LB':
                        scope.internalControl.LBcurrentView = 'Perspective';
                        scope.internalControl.LBcurrentCate = 'Perspective';
                        controlsPerspectiveLB.reset();
                        orthographicLB = false;
                        controlsOrthoLB.enableRotate = true;
                        break;
                    case 'RB':
                        scope.internalControl.RBcurrentView = 'Perspective';
                        scope.internalControl.RBcurrentCate = 'Perspective';
                        controlsPerspectiveRB.reset();
                        orthographicRB = false;
                        controlsOrthoRB.enableRotate = true;
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
                        controls = controlsOrthoLT;
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
                        controls = controlsOrthoRT;
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
                        controls = controlsOrthoLB;
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
                        controls = controlsOrthoRB;
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
                        orthoCamera.position.set(0,0,-1000);
                        orthoCamera.lookAt( scene.position );
                        scene.add(orthoCamera);
                        controlsOrtho.enableRotate = false;
                        orthographic = true;
                        break;
                    case 'LT':
                        scope.internalControl.LTcurrentView = 'Bottom';
                        scope.internalControl.LTcurrentCate = 'Bottom';
                        controlsOrthoLT.reset();
                        orthoCameraLT.position.set(0,0,-1000);
                        orthoCameraLT.lookAt( scene.position );
                        scene.add(orthoCameraLT);
                        controlsOrthoLT.enableRotate = false;
                        orthographicLT = true;
                        break;
                    case 'RT':
                        scope.internalControl.RTcurrentView = 'Bottom';
                        scope.internalControl.RTcurrentCate = 'Bottom';
                        controlsOrthoRT.reset();
                        orthoCameraRT.position.set(0,0,-1000);
                        orthoCameraRT.lookAt( scene.position );
                        scene.add(orthoCameraRT);
                        controlsOrthoRT.enableRotate = false;
                        orthographicRT = true;
                        break;
                    case 'LB':
                        scope.internalControl.LBcurrentView = 'Bottom';
                        scope.internalControl.LBcurrentCate = 'Bottom';
                        controlsOrthoLB.reset();
                        orthoCameraLB.position.set(0,0,-1000);
                        orthoCameraLB.lookAt( scene.position );
                        scene.add(orthoCameraLB);
                        controlsOrthoLB.enableRotate = false;
                        orthographicLB = true;
                        break;
                    case 'RB':
                        scope.internalControl.RBcurrentView = 'Bottom';
                        scope.internalControl.RBcurrentCate = 'Bottom';
                        controlsOrthoRB.reset();
                        orthoCameraRB.position.set(0,0,-1000);
                        orthoCameraRB.lookAt( scene.position );
                        scene.add(orthoCameraRB);
                        controlsOrthoRB.enableRotate = false;
                        orthographicRB = true;
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
                console.log(view);
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

            scope.internalControl.topView('LT');
            scope.internalControl.frontView('LB');
            scope.internalControl.rightView('RB');


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
                    if(document.getElementById("viewLT")){
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

                    document.getElementById("LT").appendChild(rendererLT.domElement);
                    document.getElementById("RT").appendChild(rendererRT.domElement);
                    document.getElementById("LB").appendChild(rendererLB.domElement);
                    document.getElementById("RB").appendChild(rendererRB.domElement);
                }
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
            // fixme geom here is not used
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
            };
        }
    }
});