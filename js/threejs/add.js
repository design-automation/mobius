//keep track of the total number of meshes
var meshCount = 0;

// refresh view port
function onNewOptionClick () {

    if ( confirm( 'Are you sure?' ) ) {
        editor.config.clear();
        editor.storage.clear( function () {
            location.href = location.pathname;
        } );
    }
}

// event handlers for adding geometry
function addGeo(geo_type,x,y,z,w,h,d){
    if(geo_type == "plane"){
        onPlaneOptionClick ();
    }
    if(geo_type == "box"){
        onBoxOptionClick (x,y,z,w,h,d);
    }
    if(geo_type == "circle"){
        onCircleOptionClick ();
    }
    if(geo_type == "cylinder" ){
        onCylinderOptionClick ();
    }
    if(geo_type == "sphere"){
        onSphereOptionClick ()
    }
    if(geo_type == "icosahedron"){
        onIcosahedronOptionClick ()
    }
    if(geo_type == "torus"){
        onTorusOptionClick ();
    }
    if(geo_type == "torusknot"){
        onTorusKnotOptionClick();
    }
}


function onPlaneOptionClick () {
    var width = 200;
    var height = 200;

    var widthSegments = 1;
    var heightSegments = 1;

    var geometry = new THREE.PlaneGeometry( width, height, widthSegments, heightSegments );
    var material = new THREE.MeshPhongMaterial();
    var mesh = new THREE.Mesh( geometry, material );
    mesh.name = 'Plane ' + ( ++ meshCount );

    editor.addObject( mesh );
    editor.select( mesh );

}


function onCircleOptionClick () {

    var radius = 20;
    var segments = 8;

    var geometry = new THREE.CircleGeometry( radius, segments );
    var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
    mesh.name = 'Circle ' + ( ++ meshCount );

    editor.addObject( mesh );
    editor.select( mesh );

}

function onCylinderOptionClick () {

    var radiusTop = 20;
    var radiusBottom = 20;
    var height = 100;
    var radiusSegments = 8;
    var heightSegments = 1;
    var openEnded = false;

    var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
    var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
    mesh.name = 'Cylinder ' + ( ++ meshCount );

    editor.addObject( mesh );
    editor.select( mesh );

}

function onSphereOptionClick () {

    var radius = 75;
    var widthSegments = 32;
    var heightSegments = 16;

    var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
    var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
    mesh.name = 'Sphere ' + ( ++ meshCount );

    editor.addObject( mesh );
    editor.select( mesh );

}

function onIcosahedronOptionClick () {

    var radius = 75;
    var detail = 2;

    var geometry = new THREE.IcosahedronGeometry ( radius, detail );
    var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
    mesh.name = 'Icosahedron ' + ( ++ meshCount );

    editor.addObject( mesh );
    editor.select( mesh );

}

function onTorusOptionClick () {

    var radius = 100;
    var tube = 40;
    var radialSegments = 8;
    var tubularSegments = 6;
    var arc = Math.PI * 2;

    var geometry = new THREE.TorusGeometry( radius, tube, radialSegments, tubularSegments, arc );
    var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
    mesh.name = 'Torus ' + ( ++ meshCount );

    editor.addObject( mesh );
    editor.select( mesh );

}

function onTorusKnotOptionClick () {

    var radius = 100;
    var tube = 40;
    var radialSegments = 64;
    var tubularSegments = 8;
    var p = 2;
    var q = 3;
    var heightScale = 1;

    var geometry = new THREE.TorusKnotGeometry( radius, tube, radialSegments, tubularSegments, p, q, heightScale );
    var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
    mesh.name = 'TorusKnot ' + ( ++ meshCount );

    editor.addObject( mesh );
    editor.select( mesh );

}





