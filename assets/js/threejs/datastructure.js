//
//	Using modified Topology.js by Lee Stemkoski
//

var default_material_meshFromThree = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide, wireframe: false, shading: THREE.SmoothShading, transparent: false, color: 0x0066CC} )
var default_material_meshFromVerbs = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide, wireframe: false, shading: THREE.SmoothShading, transparent: false, color: 0x999900} )
var default_material_lineFromVerbs = new THREE.LineBasicMaterial({ linewidth: 100, color: 0x999900})
var default_material_topology_vertex = new THREE.ShaderMaterial( {

					uniforms: {
						color:   { type: "c", value: new THREE.Color( 0xffffff ) },
					},
					alphaTest: 0.9,
				} );
var default_material_topology_edge = new THREE.LineBasicMaterial({ linewidth: 200, color: 0x999900})
mat = new THREE.MeshBasicMaterial({
            color:"white",
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
            vertexColors: THREE.FaceColors, 
            overdraw: true, 
            needsUpdate : true,
            opacity: 1
    });

    mat_2 = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
            vertexColors: THREE.FaceColors, 
            overdraw: true, 
            needsUpdate : true,
            opacity: 1
    });


	var computeTopology = function( mesh ){
		
		// conversion of topology
		if( mesh.constructor != Array ){
			var topo = new TOPOLOGY.createFromGeometry( mesh.geometry );
			return topo;
			
		}
		else{
			var topoArray = [];
			for(var meshNo = 0; meshNo < mesh.length; meshNo++)
				topoArray.push( new TOPOLOGY.createFromGeometry( mesh[meshNo].geometry ) );	
			return topoArray;
		}
	}

	var convertGeometry = function( geom ){
		
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
		
		if (geom.constructor !== Array) 
			return convertToThree( geom );
	}
	
	var convertTopology = function ( topology ){
		console.log(topology);
		// if topology is a single object or topology is a group of topology???
		
		// vertexs will be points
		// edges will lines
		// faces will be surfaces
		
		// could be optimized further with three.js vertex colors etc -
		
		// text will also be written
		var group = new THREE.Object3D();
		
		// vertexs
		var particles = new THREE.Geometry(),
			pMaterial = new THREE.ParticleBasicMaterial({
		    color: 0xCCCCFF,
			size: 1,
			blending: THREE.AdditiveBlending,
			transparent: true
		});
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
			pMaterial);
			
		group.add(particleSystem);
		
		// edges
		for(var edgeNo = 0; edgeNo < topology.edge.length; edgeNo++){

			var lineGeometry = new THREE.Geometry();
			lineGeometry.vertices.push(
				topology.vertex[topology.edge[edgeNo].vertexIDs[0]].vector3,
				topology.vertex[topology.edge[edgeNo].vertexIDs[1]].vector3
			);

			lineGeometry.computeVertexNormals();
			console.log(topology.edge[edgeNo].material);
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
			
			materials = [mat, mat_2];
			faceGeometry.faces[0].materialIndex = 1;

			group.add(new THREE.Mesh( faceGeometry , new THREE.MeshFaceMaterial( materials ) ));
		}

		return group;
	}
	
var MobiusDataObject = function( geometry ){
	
	var self = this;
	
	this.geometry = geometry; 
	
	var topology = { edge:[], face:[], vertex:[] }

	var convertedGeometry = convertGeometry ( geometry ); 
	
	//
	//	trial run indicates that topology is a BIG problem! - everything works ok without topology computation - good amount of memory management has to be done. 
	//
	
	//
	// topology computations are only needed - when the user wants to feed data - or the topology structure has to be seen in the viewer
	// topology structure for the viewer will only be for final nodes - not at each step
	// conversion to topology should be called only with extract topology
	// 
	//
		/*
	for (var property in topology) {
		if (topology.hasOwnProperty(property)) {
			self[property] = topology
		}
	}*/
	
	
		
	this.extractGeometry = function(){
		if(this.material)
			convertedGeometry.material = this.material;
		return convertedGeometry;
	}
	
	this.extractTopology = function(){
		// convert topology into three.js objects with numbers and return
		if(topology.status == undefined){
			topology = computeTopology( convertedGeometry );
		}	
		return convertTopology( topology );
	}
	
	this.extractData = function(){
		// parse topology object, extract data and return as three.js table
	}
}

// use different functions to initialize the datastructure