//
// Three JS View Port Directive
//

/* todo */
// 1.2 geometry control1
// 2. gird toggle
// 3. extend view
// 4. shading mode
// 5. set view position


vidamo.directive('topoViewport', function factoryTopo() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
        },

        link: function (scope, elem) {

            scope.internalControlTopo = scope.control || {};

            console.log(scope);

            // retrieve the viewport dom element
            var container1 = elem[0];
            var VIEWPORT_WIDTH = container1.offsetWidth;
            var VIEWPORT_HEIGHT = container1.offsetHeight;

            var scene1,
                camera1,
                renderer1,
                controls1;

            initTopo();
            animateTopo();

            // Initialization
            function initTopo(){
                // create scene1
                scene1 = new THREE.Scene();

                // prepare camera1
                var VIEW_ANGLE = 45,
                    ASPECT = VIEWPORT_WIDTH / VIEWPORT_HEIGHT,
                    NEAR = 1,
                    FAR = 10000;

                camera1 = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                scene1.add(camera1);
                camera1.position.set(-120, 60, 200);
                camera1.lookAt(new THREE.Vector3(0,0,0));

                // prepare renderer1
                renderer1 = new THREE.WebGLRenderer({antialias:true, alpha: false});
                renderer1.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
                renderer1.setClearColor(0xffffff);

                renderer1.shadowMapEnabled = true;
                renderer1.shadowMapSoft = true;

                // prepare controls1 (OrbitControls)
                controls1 = new THREE.OrbitControls(camera1, renderer1.domElement);
                controls1.target = new THREE.Vector3(0, 0, 0);
                container1.appendChild(renderer1.domElement);

                var ambientLight = new THREE.AmbientLight( 0xbbbbbb );
                scene1.add( ambientLight );

                var lights1 = [];
                lights1[0] = new THREE.PointLight( 0xececec, 0.25, 0 );
                lights1[1] = new THREE.PointLight( 0xececec, 0.25, 0 );
                lights1[2] = new THREE.PointLight( 0xececec, 0.25, 0 );

                lights1[0].position.set( 0, 100, 0 );
                lights1[1].position.set( 100, 200, 100 );
                lights1[2].position.set( -100, -200, -100 );

                scene1.add( lights1[0] );
                scene1.add( lights1[1] );
                scene1.add( lights1[2] );

                // add helpers:

                // GridHelper
                var gridHelper1 = new THREE.GridHelper(100, 10); // 100 is grid size, 10 is grid step
                gridHelper1.setColors(0x999999,0xaaaaaa);
                gridHelper1.position = new THREE.Vector3(0, 0, 0);
                gridHelper1.rotation = new THREE.Euler(0, 0, 0);
                scene1.add(gridHelper1);
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
                    VIEWPORT_WIDTH = container1.offsetWidth;
                    VIEWPORT_HEIGHT = container1.offsetHeight;
                    resizeUpdateTopo();
                },
                true
            );

            // update on resize of viewport
            function resizeUpdateTopo() {
                container1.appendChild(renderer1.domElement);
                camera1.aspect = VIEWPORT_WIDTH / VIEWPORT_HEIGHT;
                camera1.updateProjectionMatrix ();
                renderer1.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
            }

            // Animate the scene1
            function animateTopo() {
                requestAnimationFrame(animateTopo);
                renderTopo();
                updateTopo();
            }

            // Update controls1 and stats
            function updateTopo() {
                controls1.update();
            }

            // Render the scene1
            function renderTopo() {
                renderer1.render(scene1, camera1);
            }

            // clear geometries in scene1 when run
            scope.internalControlTopo.refresh = function(){
                for(var i = 0; i < scene1.children.length; i++){
                    if(scene1.children[i].id > 7){
                        scene1.remove( scene1.children[i]);
                        i--;
                    }
                }
            };

            //
            // supporting function for geometry from verb to three.js
            //
            scope.internalControlTopo.addGeometryToscene1 = function(geom,value,geomData){
                if(geom.constructor === Array){
                    for(var i = 0; i< geom.length ;i++){
                        scope.internalControlTopo.displayObject(value[i],geomData[i]);
                    }
                } else {
                    scope.internalControlTopo.displayObject(value,geomData);
                }
            };

            //
            // takes in single data object and categorizes and displays accordingly
            //
            scope.internalControlTopo.displayObject = function(singleGeomObject, singleGeomDataObject){

                // update the 3d topo viewport
                if(singleGeomObject instanceof THREE.Mesh
                    || singleGeomObject instanceof THREE.Line
                    || singleGeomObject instanceof THREE.Object3D){
                    scene1.add(singleGeomObject);
                }
                else{
                    console.log("Vidamo doesn't recognise this type!");
                }

            };


            //// anyone tells me what the hell is this
            //// fixme
            scope.internalControlTopo.benchmark = function(func, runs){
                var d1 = Date.now();
                for (var i = 0 ; i < runs; i++)
                    res = func();
                var d2 = Date.now();
                return { result : res, elapsed : d2-d1, each : (d2-d1)/runs };
            };
        }
    }
});