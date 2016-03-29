//
// ThreeJS Topology ViewPort Directive
//


mobius.directive('topoViewport', function factoryTopo() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
        },

        link: function (scope, elem) {

            scope.internalControlTopo = scope.control || {};

            // retrieve the viewport dom element
            var container1 = elem[0];
            var VIEWPORT_WIDTH1 =  document.getElementById('threeViewport').offsetWidth;
            var VIEWPORT_HEIGHT1 =  document.getElementById('threeViewport').offsetHeight;

            var scene1,
                camera1,camera1LT, camera1RT,camera1LB,camera1RB,
                renderer1,
                renderer1LT, renderer1RT,renderer1LB,renderer1RB,
                controls1,controls1LT,controls1RT,controls1LB,controls1RB;

            initTopo();
            animateTopo();

            // Initialization
            function initTopo(){
                // create scene1
                scene1 = new THREE.Scene();

                // prepare camera1
                var VIEW_ANGLE = 45,
                    ASPECT = VIEWPORT_WIDTH1 / VIEWPORT_HEIGHT1,
                    NEAR = 1,
                    FAR = 10000;

                camera1 = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                camera1.position.set(-120, 200, 60);
                camera1.up.set( 0, 0, 1 );
                camera1.lookAt(new THREE.Vector3(0,0,0));

                camera1LT = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                camera1LT.position.set(-120, 200, 60);
                camera1LT.up.set( 0, 0, 1 );
                camera1LT.lookAt(new THREE.Vector3(0,0,0));

                camera1RT = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                camera1RT.position.set(-120, 200, 60);
                camera1RT.up.set( 0, 0, 1 );
                camera1RT.lookAt(new THREE.Vector3(0,0,0));

                camera1LB = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                camera1LB.position.set(-120, 200, 60);
                camera1LB.up.set( 0, 0, 1 );
                camera1LB.lookAt(new THREE.Vector3(0,0,0));

                camera1RB = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                camera1RB.position.set(-120, 200, 60);
                camera1RB.up.set( 0, 0, 1 );
                camera1RB.lookAt(new THREE.Vector3(0,0,0));

                // prepare renderer1
                renderer1 = new THREE.WebGLRenderer({antialias:true, alpha: false});
                renderer1.setSize(VIEWPORT_WIDTH1, VIEWPORT_HEIGHT1);
                renderer1.setClearColor(0xffffff);

                renderer1LT = new THREE.WebGLRenderer({antialias:true, alpha: false});
                renderer1LT.setSize(VIEWPORT_WIDTH1/2, VIEWPORT_HEIGHT1/2);
                renderer1LT.setClearColor(0xffffff);

                renderer1LB = new THREE.WebGLRenderer({antialias:true, alpha: false});
                renderer1LB.setSize(VIEWPORT_WIDTH1/2, VIEWPORT_HEIGHT1/2);
                renderer1LB.setClearColor(0xffffff);

                renderer1RB = new THREE.WebGLRenderer({antialias:true, alpha: false});
                renderer1RB.setSize(VIEWPORT_WIDTH1/2, VIEWPORT_HEIGHT1/2);
                renderer1RB.setClearColor(0xffffff);

                renderer1RT = new THREE.WebGLRenderer({antialias:true, alpha: false});
                renderer1RT.setSize(VIEWPORT_WIDTH1/2, VIEWPORT_HEIGHT1/2);
                renderer1RT.setClearColor(0xffffff);

                renderer1LT.domElement.id = 'viewLT1';
                renderer1LB.domElement.id = 'viewLB1';
                renderer1RT.domElement.id = 'viewRT1';
                renderer1RB.domElement.id = 'viewRB1';
                renderer1.domElement.id = 'viewSingle1';

                controls1 = new THREE.OrbitControls(camera1, renderer1.domElement);
                controls1.target = new THREE.Vector3(0, 0, 0);

                controls1LT = new THREE.OrbitControls(camera1LT, renderer1LT.domElement);
                controls1LT.target = new THREE.Vector3(0, 0, 0);

                controls1RT = new THREE.OrbitControls(camera1RT, renderer1RT.domElement);
                controls1RT.target = new THREE.Vector3(0, 0, 0);

                controls1LB = new THREE.OrbitControls(camera1LB, renderer1LB.domElement);
                controls1LB.target = new THREE.Vector3(0, 0, 0);

                controls1RB = new THREE.OrbitControls(camera1RB, renderer1RB.domElement);
                controls1RB.target = new THREE.Vector3(0, 0, 0);

                var ambientLight1 = new THREE.AmbientLight( 0xbbbbbb );
                scene1.add( ambientLight1 );

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
                gridHelper1.name = 'helper';
                gridHelper1.setColors(0x999999,0xaaaaaa);
                gridHelper1.position = new THREE.Vector3(0, 0, 0);
                gridHelper1.rotation.x = Math.PI/2;//new THREE.Euler(0, 0 ,   0);
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
                    VIEWPORT_WIDTH1 =  document.getElementById('threeViewport').offsetWidth;
                    VIEWPORT_HEIGHT1 =  document.getElementById('threeViewport').offsetHeight;
                    resizeUpdateTopo();
                },
                true
            );

            // update on resize of viewport
            function resizeUpdateTopo() {
                if(scope.internalControlTopo.layout === 'singleView' && scope.internalControlTopo.showTopology === true) {
                    if(document.getElementById("viewLT1")){
                        document.getElementById("viewLT1").remove();
                        document.getElementById("viewLB1").remove()  ;
                        document.getElementById("viewRT1").remove();
                        document.getElementById("viewRB1").remove();
                    }

                    document.getElementById("viewSingle1").style.display = "inline";
                    document.getElementById('topoContainer').appendChild(renderer1.domElement);

                    camera1.aspect = VIEWPORT_WIDTH1 / VIEWPORT_HEIGHT1;
                    camera1.updateProjectionMatrix ();
                    renderer1.setSize(VIEWPORT_WIDTH1, VIEWPORT_HEIGHT1);
                }else{
                    if(document.getElementById("singleView1")) {
                        document.getElementById("singleView1").style.display = "none";
                    }

                    camera1LT.aspect = VIEWPORT_WIDTH1 / VIEWPORT_HEIGHT1;
                    camera1LT.updateProjectionMatrix ();
                    renderer1LT.setSize(VIEWPORT_WIDTH1/2, VIEWPORT_HEIGHT1/2);
                    //document.getElementById('LT1').appendChild(renderer1LT.domElement);

                    camera1RT.aspect = VIEWPORT_WIDTH1 / VIEWPORT_HEIGHT1;
                    camera1RT.updateProjectionMatrix ();
                    renderer1RT.setSize(VIEWPORT_WIDTH1/2, VIEWPORT_HEIGHT1/2);
                    //document.getElementById('RT1').appendChild(renderer1RT.domElement);

                    camera1LB.aspect = VIEWPORT_WIDTH1 / VIEWPORT_HEIGHT1;
                    camera1LB.updateProjectionMatrix ();
                    renderer1LB.setSize(VIEWPORT_WIDTH1/2, VIEWPORT_HEIGHT1/2);
                    //document.getElementById('LB1').appendChild(renderer1LB.domElement);

                    camera1RB.aspect = VIEWPORT_WIDTH1 / VIEWPORT_HEIGHT1;
                    camera1RB.updateProjectionMatrix ();
                    renderer1RB.setSize(VIEWPORT_WIDTH1/2, VIEWPORT_HEIGHT1/2);
                    //document.getElementById('RB1').appendChild(renderer1RB.domElement);
                }
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

                controls1LT.update();
                controls1RT.update();
                controls1LB.update();
                controls1RB.update();
            }

            // Render the scene1
            function renderTopo() {
                if(scope.internalControlTopo.layout === 'singleView' && scope.internalControlTopo.showTopology === true) {

                    if(document.getElementById("viewLT1")){
                        document.getElementById("viewLT1").remove();
                        document.getElementById("viewLB1").remove();
                        document.getElementById("viewRT1").remove();
                        document.getElementById("viewRB1").remove();
                    }

                    document.getElementById('topoContainer').appendChild(renderer1.domElement);
                    document.getElementById("viewSingle1").style.display = "inline";

                    renderer1.render(scene1, camera1);
                }else{
                    if(document.getElementById("viewSingle1")) {
                        document.getElementById("viewSingle1").style.display = "none";
                    }

                    if(scope.internalControlTopo.LT){
                        document.getElementById("LT1").appendChild(renderer1LT.domElement);
                        document.getElementById("viewLT1").style.display = 'inline';
                        renderer1LT.render(scene1, camera1LT);
                    }else{
                        if(document.getElementById("viewLT1")){
                            document.getElementById("viewLT1").remove();
                        }
                    }

                    if(scope.internalControlTopo.RT){
                        document.getElementById("RT1").appendChild(renderer1RT.domElement);
                        document.getElementById("viewRT1").style.display = 'inline';
                        renderer1RT.render(scene1, camera1RT);
                    }else{
                        if(document.getElementById("viewRT1")){
                            document.getElementById("viewRT1").remove();
                        }
                    }

                    if(scope.internalControlTopo.LB){
                        document.getElementById("LB1").appendChild(renderer1LB.domElement);
                        document.getElementById("viewLB1").style.display = 'inline';
                        renderer1LB.render(scene1, camera1LB);
                    }else{
                        if(document.getElementById("viewLB1")){
                            document.getElementById("viewLB1").remove();
                        }
                    }

                    if(scope.internalControlTopo.RB){
                        document.getElementById("RB1").appendChild(renderer1RB.domElement);
                        document.getElementById("viewRB1").style.display = 'inline';
                        renderer1RB.render(scene1, camera1RB);

                    }else{
                        if(document.getElementById("viewRB1")){
                            document.getElementById("viewRB1").remove();
                        }
                    }
                }
            }

            // clear geometries in scene1 when run
            scope.internalControlTopo.refreshView = function(){
                for(var i = 0; i < scene1.children.length; i++) {
                    if ((scene1.children[i] instanceof THREE.Mesh
                        || scene1.children[i]  instanceof THREE.Line
                        || scene1.children[i] instanceof THREE.Object3D)
                        && scene1.children[i].name !== 'helper') {
                        scene1.remove(scene1.children[i]);
                        i--;
                    }
                }
            };

            //
            // supporting function for geometry from verb to three.js
            //
            scope.internalControlTopo.addGeometryToScene = function(geom,value){
                if(geom !== undefined && value !== undefined){
                    if(geom.constructor === Array){
                        for(var i = 0; i< geom.length ;i++){
                            scope.internalControlTopo.displayObject(value[i]);
                        }
                    } else {
                        scope.internalControlTopo.displayObject(value);
                    }
                }
            };

            //
            // takes in single data object and categorizes and displays accordingly
            //
            scope.internalControlTopo.displayObject = function(singleGeomObject){

                // update the 3d topo viewport
                if(singleGeomObject instanceof THREE.Mesh
                    || singleGeomObject instanceof THREE.Line
                    || singleGeomObject instanceof THREE.Object3D){
                    scene1.add(singleGeomObject);
                }
            };
        }
    }
});