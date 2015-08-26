//
// Three JS View Port Directive
//

/* todo */
// 1.2 geometry control
// 1.3 integration with verbs.js
// 2. gird toggle
// 3. extend view
// 4. shading mode
// 5. set view position


vidamo.directive('viewport', function() {
    return {
        restrict: 'ACE',

        link: function (scope, elem) {

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
                camera.position.set(-1200, 600, 1600);
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