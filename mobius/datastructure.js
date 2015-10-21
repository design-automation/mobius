//
// Mobius Data Structure definition 
// Not open to editing by module developer
//

var MobiusDataObject = function( geometry ){
	
	//
	// public property - native geometry stored in the data object
	//
	this.geometry = geometry; 
	
	//
	// private variables to store convertedGeometry and topology 
	//
	var topology = undefined;
	var convertedGeometry = undefined; 

	//
	// Adding topology variables to the main object - for direct access to the user
	//
	for (var property in TOPOLOGY.topoDef) {
		Object.defineProperty(this, property, {
		get: function(){
				if(this.geometry instanceof TOPOLOGY.Topology)
					topology = this.geometry;
				else if (topology == undefined){
					if(convertedGeometry == undefined)
							convertedGeometry = this.extractGeometry();
					topology = threeToTopology( convertedGeometry );
				} 
			return topology[property];
		},
		set: undefined
		});
	}
	
	//
	// Functions used by Mobius or Module for the different viewers
	//
	
	//
	// Converts the geometry of the MobiusDataObject - to three.js Mesh by calling a bridging function 'convertGeomtoThreeMesh' in the module 
	//
	this.extractGeometry = function(){
		
		// if undefined, defines it and saves it
		if(convertedGeometry == undefined)
			convertedGeometry = convertGeomToThreeMesh(this.geometry);
		
		// if material has been assigned to this data object, assigns the same material to the converted geometry
		if(this.material)
			convertedGeometry.material = this.material;
		
		return convertedGeometry;
	}
	
	//
	// Gets a three.js 3D Object with a Topological representation from the convertedGeometry (three.js mesh) - extracts the three.js mesh firstChild
	// Uses 'threeToTopology' bridging function defined in the module
	//
	this.extractTopology = function(){
		// convert topology into three.js objects with numbers and return
		
		// incase the topology is user-defined - it should display the user-defined topology
		// if topology has not be computed before, computes and saves
		if(topology == undefined){
			if(this.geometry instanceof TOPOLOGY.Topology){
				topology = this.geometry;
			}
			else
				topology = threeToTopology( this.extractGeometry() );
		}
		return displayTopologyInThree( topology );
	}
	
	//
	// Extracts data at MobiusDataObject level and topology level, converts it into a JSON object and returns it to the calling function
	// Doesnot require any bridging functions from the module
	//
	this.extractData = function(){
		
		var dataTable = [];
		
		// LIMITATION - Data can only be added to the topology
		if( topology == undefined && this.data == undefined )
			return dataTable;
		else{
			if (this.data != undefined){
				for(var property in this.data){
					var jsonObject = {
										'attachedTo' : 'Object',
										'Property' : property,
										'Value' : this.data[property]
									};
					dataTable.push(jsonObject);
				}	
			}

			for(topoElement in topology){ 
				if(topology.hasOwnProperty(topoElement)){
					for( var index=0; index < topology[topoElement].length; index++){
						if (topology[topoElement][index].data != undefined){
							for(var property in topology[topoElement][index].data){
								var jsonObject = {
													'attachedTo' : topoElement,
													'Property' : property,
													'Value' : topology[topoElement][index].data[property]
												};
								dataTable.push(jsonObject);
							}
						}
					}
				} 
			}
		}
		return dataTable;
	}
}
