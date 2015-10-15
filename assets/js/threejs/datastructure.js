//
//	Using modified Topology.js by Lee Stemkoski
//

var default_material_meshFromThree = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide, wireframe: false, shading: THREE.SmoothShading, transparent: false, color: 0x0066CC} )
var default_material_meshFromVerbs = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide, wireframe: false, shading: THREE.SmoothShading, transparent: false, color: 0x999900} )
var default_material_lineFromVerbs = new THREE.LineBasicMaterial({ linewidth: 100, color: 0x999900})

var MobiusDataObject = function( geometry ){
	
	var computeTopology = function( mesh ){
		if( mesh.geometry.faces > 1000 )
			return;
		// conversion of topology
		if( mesh.constructor != Array )
			return new TOPOLOGY.createFromGeometry( mesh.geometry );
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
			return convertToThree( geom ) /*
        else {
			var convertedGeoms;
            for (var n = 0; n < geom.length; n++) 
			   convertedGeoms.push( convertToThree( geom[n] ) );
			return convertedGeoms;
        }*/
	}
	
	this.geometry = geometry; 

	var convertedGeometry = convertGeometry ( geometry ); 
	
	//
	//	trial run indicates that topology is a BIG problem! - everything works ok without topology computation - good amount of memory management has to be done. 
	//
	//var topology = computeTopology( convertedGeometry ); 
	var topology = { edge:[], face:[], vertex:[] }
		
	for (var property in topology) {
	  if (topology.hasOwnProperty(property)) 
		  this[property] = topology[property];
	}
		
	this.extractGeometry = function(){
		if(this.material)
			convertedGeometry.material = this.material;
		return convertedGeometry;
	}
	
	this.extractTopology = function(){
		// convert topology into three.js objects with numbers and return
	}
	
	this.extractData = function(){
		// parse topology object, extract data and return as three.js table
	}
}

// use different functions to initialize the datastructure