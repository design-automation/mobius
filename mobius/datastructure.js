//
// Mobius Data Structure definition
// Not open to editing by module developer
//

// Main mObj Class definition
// mObj maybe geometry, ifcModel, data / charts etc
var mObj = function( type ){
	
    var type = type;
	
    this.is_mObj = true; 

	this.getType = function(){
		return type;
	}
}

// mObj Geometry Class
// geometry is stored in geometry format native to module
mObj.geom = function( geometry, material ){
	
	mObj.call('geometry');

	var geometry = geometry; 
	
    // observing geometry for changes
    Object.observe(obj, function(changes) {
         
         console.log(changes[0]);
         if(changes[0].type == 'update' && changes[0].name == 'geometry'){
            // set cached threeGeometry and threeTopology to undefined
            threeGeometry = undefined;
            threeTopology = undefined;

            // recompute topology
            topology = computeTopology( this );
         }
    });
	
    var topology = undefined;
    var material = material;

    //
    // cached conversion of geometry to three.js
    //
    var threeGeometry = undefined;
    var threeTopology = undefined;

    //
    // Functions used by Mobius or Module for the different viewers
    //

    //
    // Converts the geometry of the MobiusDataObject - to three.js Mesh by calling a bridging function 'convertGeomtoThreeMesh' in the module
    //
    this.extractThreeGeometry = function( ){

        // if threeGeometry hasn't been computed before or native geometry has been transformed so that new conversion is required
        // the function defines it and caches it
        if(threeGeometry == undefined || geometryTransformed == true){
		     geometryTransformed = false;
			 threeGeometry = convertGeomToThree( geometry );  // calls a function in the module to convert native geom into accepted three format
		}

        // if material has been assigned to this data object, assigns the same material to the converted geometry
        if(material)
            threeGeometry.material = material;

        return threeGeometry;
    }


    //
    // Converts the topology defined in native elements to three.js format
    this.extractTopology = function(){

        // if threeGeometry hasn't been computed before or native geometry has been transformed so that new conversion is required
        // the function defines it and caches it
        if(threeTopology == undefined || geometryTransformed == true){
             geometryTransformed = false;
             topology = computeNativeTopology( this );
             threeTopology = convertTopoToThree( topology );  // calls a function in the module to convert native geom into accepted three format
        }

        // if material has been assigned to this data object, assigns the same material to the converted geometry
        if(material)
            threeGeometry.material = material;

        return threeTopology;
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
	

    //
    // expose topology to the user
    // 
    if(topology){
        
        for(var property in topology)
            if(topology.hasOwnProperty( property ))
                this[property] = this.topology[property];
        }

    }


    //
    // get & set functions
    //
    this.getGeometry = function(){
        return geometry;
    }

	this.setGeometry = function( new_geometry ){
		geometry = new_geometry;
		console.log('geometry changed');
	}
	
	this.geometryTransformed = function(){
		geometryTransformed = true;
	}


    this.getTopology = function(){
        return topology;
    }
    
    this.setTopology = function( native_topology ){
        topology = native_topology; // inherited topology parameter
    }
	
	this.getData = function(){
		
	}
	
	this.setData = function(){
		
	}

    this.getMaterial = function(){

    }

    this.setMaterial = function( material ){

        if(threeGeometry == undefined)
            this.extractThreeGeometry();
        threeGeometry.material = material; 
        console.log("new material set")
    }
	
}

mObj.geom.Curve = function( geometry ){
	
    var defaultCurveMaterial = new THREE.LineBasicMaterial({
    side: THREE.DoubleSide,
    linewidth: 100,
    color: 0x003399
    });
	
    mObj.geom.call( this, geometry, defaultCurveMaterial ); 
	topology = computeTopology( this );
	
}

mObj.geom.Surface = function( geometry ){
	
    var defaultSurfaceMaterial = new THREE.MeshLambertMaterial( {
    side: THREE.DoubleSide,
    wireframe: false,
    shading: THREE.SmoothShading,
    transparent: false,
    color: 0x003399
    } );

	mObj.geom.call( this, geometry, defaultSurfaceMaterial );
    topology = computeTopology( this );

}

mObj.geom.Solid = function( geometry ){
	
    var defaultSolidMaterial = new THREE.MeshLambertMaterial( {
    side: THREE.DoubleSide,
    wireframe: false,
    shading: THREE.SmoothShading,
    transparent: false,
    color: 0xCC0000
    } );

	mObj.geom.call( this, geometry, defaultSolidMaterial );
    topology = computeTopology( this );
}
