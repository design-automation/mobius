//
//	Functions forming bridge between data structure, topology and modules
//	Dependent on the modules being used for geometry and topology
//

//
//	Requirements
//	Function names should remain the same
//

//
//	Default Material Definitions
//
var default_material_meshFromThree = new THREE.MeshLambertMaterial( { 
											side: THREE.DoubleSide, 
											wireframe: false, 
											shading: THREE.SmoothShading, 
											transparent: false, 
											color: 0x0066CC
										} );
var default_material_meshFromVerbs = new THREE.MeshLambertMaterial( { 
											side: THREE.DoubleSide, 
											wireframe: false, 
											shading: THREE.SmoothShading, 
											transparent: false, 
											color: 0x999900
										} );
var default_material_lineFromVerbs = new THREE.LineBasicMaterial({ 
											linewidth: 100, 
											color: 0x999900
										});
var default_material_topology_vertex = new THREE.ParticleBasicMaterial({
											color: 0xCCCCFF,
											size: 1,
											blending: THREE.AdditiveBlending,
											transparent: true
										});
var default_material_topology_edge = new THREE.LineBasicMaterial({ 
											linewidth: 200, 
											color: 0x999900
										});
var default_material_topology_face = new THREE.MeshBasicMaterial({            
			color:"white",
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
            vertexColors: THREE.FaceColors, 
            overdraw: true, 
            needsUpdate : true,
            opacity: 1
    });

//
//	Function to convert native geometry into three.js Mesh geometry 
//  Add another if-else condition for each new geometry
//
var convertGeomToThreeMesh = function( geom ){
		
		// internal function
		convertToThree = function(singleDataObject){
			
		if( singleDataObject instanceof THREE.Mesh )
			return singleDataObject
		else if(singleDataObject instanceof THREE.Geometry)
			return new THREE.Mesh( singleDataObject, singleDataObject.material )
		else if(singleDataObject instanceof ThreeBSP)
			return new THREE.Mesh( singleDataObject.toGeometry(), default_material_meshFromThree );
		else if( singleDataObject instanceof verb.geom.NurbsSurface ){
			
			var geometry = singleDataObject.toThreeGeometry(); 
			
			if ( singleDataObject.material )
				return ( new THREE.Mesh( geometry, singleDataObject.material ) ); 
			else
				return ( new THREE.Mesh( geometry, default_material_meshFromVerbs ) );
			
		}
		else if( singleDataObject instanceof verb.geom.NurbsCurve ){
			
			var geometry = singleDataObject.toThreeGeometry(); 
			
			if ( singleDataObject.material )
				return ( new THREE.Line( geometry, singleDataObject.material ) );
			else
				return ( new THREE.Line( geometry, default_material_lineFromVerbs ) );
		
		}
		else if (singleDataObject instanceof verb.geom.Intersect){
			console.log("Intersection!");
		}
		else {
			console.log("Module doesnt recognise either!", singleDataObject);	
		} 	
	}
		
	
	var rawResult = convertToThree( geom );
	var optimizedResult = /*changeLOD(0.2, */rawResult//); // run polychop on this and reduce the number of faces needs for the desired level of LOD
	
	return optimizedResult;
}

//
// Takes convertedGeometry (three.js) from MobiusDataObjects and converts it to topology*
// Change content incase of change in Topology.js
//
var threeToTopology = function( convertedGeometry ){
		
	// conversion of topology
	if( convertedGeometry.constructor != Array ){
		var topo = new TOPOLOGY.createFromGeometry( convertedGeometry.geometry );
		return topo;			
	}
	else{
		var topoArray = [];
		for(var geomNo = 0; geomNo < convertedGeometry.length; geomNo++)
			topoArray.push( new TOPOLOGY.createFromGeometry( convertedGeometry[geomNo].geometry ) );	
			return topoArray;
	}
}

//
// Takes topology and converts into displayable three.js Object3D
// Change content incase of change in Topology.js
//
var displayTopologyInThree = function ( topology ){

	// if topology is a single object or topology is a group of topology???
		
	// vertexs will be points
	// edges will lines
	// faces will be surfaces
		
	// could be optimized further with three.js vertex colors etc -
		
	// text will also be written
	var group = new THREE.Object3D();
		
	// vertexs
	var particles = new THREE.Geometry();
			
	for(var vertexNo = 0; vertexNo < topology.vertex.length; vertexNo++){
		  // create a particle with random
		  // position values, -250 -> 250
		  var particle = topology.vertex[vertexNo].vector3
		  // add it to the geometry
		  particles.vertices.push(particle);

		  }
	// create the particle system
	var particleSystem = new THREE.ParticleSystem(
		particles,
		default_material_topology_vertex);
			
	group.add(particleSystem);
	
	// edges
	for(var edgeNo = 0; edgeNo < topology.edge.length; edgeNo++){

		var lineGeometry = new THREE.Geometry();
		lineGeometry.vertices.push(
		topology.vertex[topology.edge[edgeNo].vertexIDs[0]].vector3,
		topology.vertex[topology.edge[edgeNo].vertexIDs[1]].vector3
		);

		lineGeometry.computeVertexNormals();
		var line = new THREE.Line( lineGeometry, default_material_topology_edge || topology.edge[edgeNo].material );
		
		group.add(line);
	}
		
		
	// faces
	for(var faceNo = 0; faceNo < topology.face.length; faceNo++){
		
		var faceGeometry = new THREE.Geometry();
		faceGeometry.vertices.push( topology.vertex[topology.face[faceNo].vertexIDs[0]].vector3 );
		faceGeometry.vertices.push( topology.vertex[topology.face[faceNo].vertexIDs[1]].vector3 );
		faceGeometry.vertices.push( topology.vertex[topology.face[faceNo].vertexIDs[2]].vector3 );

		faceGeometry.faces.push( new THREE.Face3( 0, 1, 2 ));

		faceGeometry.computeFaceNormals();
		faceGeometry.computeVertexNormals();
		
		var materials = [ topology.face[faceNo].material || default_material_topology_face ];
		faceGeometry.faces[0].materialIndex = 0;

		group.add(new THREE.Mesh( faceGeometry , new THREE.MeshFaceMaterial( materials ) ));
	}

	return group;
}

/* to be implemented later - to enable topology to scale
function changeLOD(k, actualGeometry){
	
	var subdivisions = 0
	var modifier=new THREE.SubdivisionModifier(subdivisions);
	
	//geometry is the actual geometry
	smooth=actualGeometry.geometry.clone(); console.log(smooth);
	smooth.mergeVertices();
	modifier.modify(smooth);
	var simplify=new THREE.SimplifyModifier(400);
	sortedGeometry=simplify.modify(smooth);

	var map=sortedGeometry.map;
	var permutations=sortedGeometry.sortedGeometry;
	var sortedVertices=sortedGeometry.vertices;
	var t=sortedVertices.length-1;
	t=t*k|0;
	var numFaces=0;
	var face;
	var geometry=smooth;
	for(i=0;i<geometry.faces.length;i++){
		face=geometry.faces[i];
		var oldFace=sortedGeometry.faces[i];
		face.a=oldFace.a;
		face.b=oldFace.b;
		face.c=oldFace.c;
		while(face.a>t)
			face.a=map[face.a];
		while(face.b>t)
			face.b=map[face.b];
		while(face.c>t)
			face.c=map[face.c];
		if(face.a!==face.b&&face.b!==face.c&&face.c!==face.a) 
			numFaces++;
	}
	geometry.computeFaceNormals();
	geometry.verticesNeedUpdate=true;
	geometry.normalsNeedUpdate=true;
	console.log(actualGeometry.geometry.faces.length);
	console.log(geometry.faces.length);
	return geometry;
}			
*/		
