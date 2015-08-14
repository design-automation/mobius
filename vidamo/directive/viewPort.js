//
// Three JS View Port Directive
//

/* todo */
// 1.2 elem
// 1.3 raycaster
// 1.1.1 size
// 1.1 zoom/pan/spin
// 1.2 one windows resize
// 1.3 lighting
// 1.4 geometry control
// 1.5 integration with verbs.js
// 1.6 clean original 3.js files
// 2. gird toggle
// 3. extend view
// 4. shading mode
// 5. set view position

vidamo.directive('viewport', function() {
    return {
        restrict: 'ACE',

        link: function (scope, elem) {
            var scene,
                camera,
                renderer,
                container,
                controls;

            init();
            animate();

            function init() { // Initialization

                // create scene
                scene = new THREE.Scene();

                var VIEWPORT_WIDTH = window.innerWidth,
                    VIEWPORT_HEIGHT = window.innerHeight;

                // prepare camera
                var VIEW_ANGLE = 45, ASPECT = VIEWPORT_WIDTH / VIEWPORT_HEIGHT, NEAR = 1, FAR = 10000;
                camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                scene.add(this.camera);
                camera.position.set(-1200, 600, 1600);
                camera.lookAt(new THREE.Vector3(0,0,0));

                // prepare renderer
                renderer = new THREE.WebGLRenderer({antialias:true, alpha: false});
                renderer.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
                renderer.setClearColor(0xffffff);

                renderer.shadowMapEnabled = true;
                renderer.shadowMapSoft = true;

                // prepare container
                container = elem[0];
                container.appendChild(renderer.domElement);

                // events
                THREEx.WindowResize(renderer, camera);

                // prepare controls (OrbitControls)
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.target = new THREE.Vector3(0, 0, 0);

                // add point light
                var pointLight = new THREE.PointLight(0xffff00, 1.0);
                pointLight.position.set(300,300,300);
                scene.add(pointLight);

                // add helpers:

                // GridHelper
                var gridHelper = new THREE.GridHelper(500, 40); // 500 is grid size, 20 is grid step
                gridHelper.position = new THREE.Vector3(0, 0, 0);
                gridHelper.rotation = new THREE.Euler(0, 0, 0);
                scene.add(gridHelper);

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
        }
    }
});