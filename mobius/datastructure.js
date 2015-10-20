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
	this.extractGeometry = function(){
		
		// if undefined, defines it and saves it
		if(convertedGeometry == undefined)
			convertedGeometry = convertGeomToThreeMesh(this.geometry);
		
		// if material has been assigned to this data object, assigns the same material to the converted geometry
		if(this.material)
			convertedGeometry.material = this.material;
		
		return convertedGeometry;
	}
	
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
	
	this.extractData = function(){
		// parse topology object, extract data and return as three.js table
		
		// LIMITATION - Data can only be added to the topology
		if( topology == undefined && this.data == undefined )
			console.log("No data exists for this object!");
		else{
			if (this.data != undefined)
				console.log("Object Properties: ", JSON.stringify(this.data));
			
			for(property in topology){ 
				if(topology.hasOwnProperty(property)){
					for( var index=0; index < topology[property].length; index++){
					if (topology[property][index].data != undefined)
						console.log("Properties of ", property , index, ":", JSON.stringify(topology[property][index].data));
					else
						console.log("No data defined for ", property);
					}
				} 
			}
		}
		return "JSON Data Object";
	}
}
