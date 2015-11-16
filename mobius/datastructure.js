//
// Mobius Data Structure definition
// Not open to editing by module developer
//

var mObj = function( type ){
	var type = type;
	
	this.getType = function(){
		return type;
	}
}

var mObj.geom = function( geometry ){
	
	mObj.call('geometry');
	
	var geometry = geometry; 
	var geometryTransformed = false;
	
    //
    // private variables to store convertedGeometry and topology
    //
    var convertedGeometry = undefined;

    //
    // Functions used by Mobius or Module for the different viewers
    //

    //
    // Converts the geometry of the MobiusDataObject - to three.js Mesh by calling a bridging function 'convertGeomtoThreeMesh' in the module
    //
    this.extractGeometry = function( setGeom ){

        // if setGeom is given, set the convertedGeom to that
        if(setGeom == undefined){
            // if undefined, defines it and saves it
            if(convertedGeometry == undefined || this.geometryUpdated == true){
				this.geometryUpdated = false;
				convertedGeometry = convertGeomToThreeMesh(this.geometry);
			}

            // if material has been assigned to this data object, assigns the same material to the converted geometry
            if(this.material)
                convertedGeometry.material = this.material;
        }
        else{
            convertedGeometry = setGeom;
        }

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
                                    'attachedTo' : topoElement+index,
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
	
	this.setGeometry = function( new_geometry ){
		geometry = new_geometry;
		console.log('geometry changed');
	}
	
	this.getGeometry = function(){
		return geometry;
	}
	
	this.geometryTransformed = function)(){
		geometryTransformed = true;
	}
	
	this.setData = function(){
		
	}
	
	this.getData = function(){
		
	}
	
}

var mObj.geom.Curve = function( geometry ){
	
	mObj.geom.call( this, geometry );
	
	var topology = {
		vertices: [ geometry.point(0), geometry.point(1) ],
		edges: geometry,
		faces: NULL
	}
	
	this.getTopology = function(){
		return topology;
	}
	
	this.setTopology = function(){
		//set topology
	}
	
}

var mObj.geom.Surface = function( geometry ){
	
	mObj.geom.call( this, geometry );
	
	var topology = {
		vertices: [ geometry.point(0,0), geometry.point(0,1), geometry(1,1), geometry(1,0) ],
		edges: geometry.boundaries(),
		faces: NULL
	}
	
	this.getTopology = function(){
		return topology;
	}
	
	this.setTopology = function(){
		//set topology
	}
}

var mObj.geom.Solid = function( geometry ){
	
	mObj.geom.call( this, geometry );
	
	// explode into different surfaces and compute the topology
	// var topology = {
		// vertices: [ geometry.point(0,0), geometry.point(0,1), geometry(1,1), geometry(1,0) ],
		// edges: geometry.boundaries(),
		// faces: NULL
	// }
	
	this.getTopology = function(){
		return topology;
	}
	
	this.setTopology = function(){
		//set topology
	}
	
}
