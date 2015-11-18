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
var mObj_geom = function( geometry, material ){
	
	mObj.call(this, 'geometry');

	var geometry = geometry; 
    var material = material;

    var self = this;

    var data = undefined;

    var topology, threeGeometry, threeTopology;

    //
    // update function when some property of the object changes
    //
    var update = function(){
        threeGeometry = undefined;
        threeTopology = undefined;

        // recompute topology
        topology = computeTopology( self );

        //
        // expose topology to the user
        // 
        if(topology){  
            for(var property in topology){ 
                if(topology.hasOwnProperty( property ))
                    this[property] = topology[property];
            }

        }
    }

    //
    // Functions used by Mobius or Module for the different viewers
    //

    //
    // Converts the geometry of the MobiusDataObject - to three.js Mesh by calling a bridging function 'convertGeomtoThreeMesh' in the module
    //
    this.extractThreeGeometry = function(){

        // if threeGeometry hasn't been computed before or native geometry has been transformed so that new conversion is required
        // the function defines it and caches it
        if( threeGeometry == undefined ){
            if( geometry instanceof Array){
                var threeGeometry = new THREE.Object3D(); 
                for(var srf=0; srf < geometry.length; srf++){
                    var geom = geometry[srf];
                    threeGeometry.add( geom.extractThreeGeometry() ); 
                }
            }else
                threeGeometry = convertGeomToThree( geometry );  // calls a function in the module to convert native geom into accepted three format
        }
			 

        // if material has been assigned to this data object, assigns the same material to the converted geometry
        if(material)
            threeGeometry.material = material;

        threeGeometry.is_mObj = true;

        return threeGeometry;
    }


    //
    // Converts the topology defined in native elements to three.js format
    this.extractTopology = function(){

        // if threeGeometry hasn't been computed before or native geometry has been transformed so that new conversion is required
        // the function defines it and caches it
        if( threeTopology == undefined )
             threeTopology = convertTopoToThree( topology );  // calls a function in the module to convert native geom into accepted three format

        threeTopology.is_mObj = true;

        return threeTopology;
    }

    //
    // Extracts data at MobiusDataObject level and topology level, converts it into a JSON object and returns it to the calling function
    // Doesnot require any bridging functions from the module
    //
    this.extractData = function(){

        var dataTable = [];

        // LIMITATION - Data can only be added to the topology
        if( topology == undefined && data == undefined )
            return dataTable;
        else{
            if (data != undefined){
                for(var property in data){
                    var jsonObject = {
                        'attachedTo' : 'Object',
                        'Property' : property,
                        'Value' : data[property]
                    };
                    dataTable.push(jsonObject);
                }
            }

            // generalized - irrespective of topology object configuration
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
    // get & set functions
    //
    this.getGeometry = function(){
        return geometry;
    }

	this.setGeometry = function( new_geometry ){
		geometry = new_geometry;
        update( true );
	}

    this.getTopology = function(){
        return topology;
    }
    
	this.getData = function(){
		return data;
	}
	
	this.setData = function( new_data ){
		data = new_data;
	}

    this.getMaterial = function(){
        return material;
    }

    this.setMaterial = function( new_material ){

        material = new_material;
        if( threeGeometry )
            threeGeometry.material = new_material;
    }

    // topology is always computed 
    update();
	
}

var mObj_geom_Curve = function( geometry ){
	
    var defaultCurveMaterial = new THREE.LineBasicMaterial({
    side: THREE.DoubleSide,
    linewidth: 100,
    color: 0x003399
    });
	
    mObj_geom.call( this, geometry, defaultCurveMaterial ); 
	
}

var mObj_geom_Surface = function( geometry ){
	
    var defaultSurfaceMaterial = new THREE.MeshLambertMaterial( {
    side: THREE.DoubleSide,
    wireframe: false,
    shading: THREE.SmoothShading,
    transparent: false,
    color: 0x003399
    } );

	mObj_geom.call( this, geometry, defaultSurfaceMaterial );

}

var mObj_geom_Solid = function( geometry ){
	
    var defaultSolidMaterial = new THREE.MeshLambertMaterial( {
    side: THREE.DoubleSide,
    wireframe: false,
    shading: THREE.SmoothShading,
    transparent: false,
    color: 0xCC0000
    } );

	mObj_geom.call( this, geometry, defaultSolidMaterial );

}
