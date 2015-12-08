//
// Mobius Data Structure definition
// Not open to editing by module developer
//

// Main mObj Class definition
// mObj maybe geometry, ifcModel, data / charts etc
var mObj = function mObj( type ){
	
    var type = type;
	
    this.is_mObj = true; 

	this.getType = function(){
		return type;
	}
}

var mObj_frame = function mObj( origin, xaxis, yaxis, zaxis ){

    //mObj.call(this, 'frame');


    // compute missing axes 
    if( xaxis == undefined )
        xaxis = verb.core.Vec.cross( yaxis, zaxis );
    else if( yaxis == undefined )
        yaxis = verb.core.Vec.cross( xaxis, zaxis );
    else if( zaxis == undefined )
        zaxis = verb.core.Vec.cross( yaxis, xaxis );

    this.origin = origin;
    _xaxis = verb.core.Vec.normalized( xaxis ); this.xaxis = _xaxis; 
    _yaxis = verb.core.Vec.normalized( yaxis ); this.yaxis = _yaxis;
    _zaxis = verb.core.Vec.normalized( zaxis ); this.zaxis = _zaxis;


    var a = -Math.atan( _xaxis[2] / _xaxis[0] ); 
    var b = -Math.asin( _xaxis[1] ); //Math.tanh( )
    var c = Math.atan( zaxis[1] / Math.sqrt( zaxis[0]*zaxis[0] + zaxis[2]*zaxis[2] ) )

    // compute translation
    var mat_trans = [ [ 1, 0, 0, origin[0] ],
                        [ 0, 1, 0, origin[1] ],
                            [ 0, 0, 1, origin[2] ],
                                [ 0, 0, 0, 1 ]
      
                        ]; 

    function getRotationMatrix( axis, angle){
        var cost = Math.cos(angle);
        var sint = Math.sin(angle);
        var ux = axis[0];
        var uy = axis[1];
        var uz = axis[2];

        return [ [ cost + ux*ux*(1-cost), ux*uy*(1-cost) - uz*sint, ux*uz*(1-cost) + uy*sint, 0 ],
                    [ ux*uy*(1-cost) + uz*sint,  cost + uy*uy*(1-cost),  uy*uz*(1-cost) - ux*sint, 0 ],
                        [ ux*uz*(1-cost) - uy*sint, uy*uz*(1-cost) + ux*sint, cost + uz*uz*(1-cost), 0 ],
                            [ 0, 0, 0, 1 ]
                ];

    }

    // yaxis [0,1,0]
    var mat_rot_a = getRotationMatrix( [0,1,0], a); 

    // zaxis [0,0,1]
    var mat_rot_b = getRotationMatrix( _zaxis, b);

    // xaxis [1,0,0]
    var mat_rot_c = getRotationMatrix( _xaxis, c);

                        

    this.applyMatrix = function( geom ){ 
       geom = geom.transform(mat_rot_a); 
       geom = geom.transform(mat_rot_b); 
       geom = geom.transform(mat_rot_c);
       geom = geom.transform( mat_trans );
       return geom;
    }


    this.extractThreeGeometry = function(){
        return buildAxes( 20 );
    }

    this.extractData = function(){
        return 'frame';
    }

    function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat; 

        if(dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() ); 
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LineSegments );

        return axis;

    }

    function buildAxes( length ) {
        var axes = new THREE.Object3D();
        axes.is_mObj = true;

        var or = new THREE.Vector3( origin[0], origin[1], origin[2] )
        var pos_x = new THREE.Vector3( origin[0] + length*xaxis[0],  origin[1]+length*xaxis[1],  origin[2]+length*xaxis[2] );
        var neg_x = new THREE.Vector3( origin[0] - length*xaxis[0],  origin[1]-length*xaxis[1],  origin[2]-length*xaxis[2] );
        var pos_y = new THREE.Vector3( origin[0] + length*yaxis[0],  origin[1]+length*yaxis[1],  origin[2]+length*yaxis[2] );
        var neg_y = new THREE.Vector3( origin[0] - length*yaxis[0],  origin[1]-length*yaxis[1],  origin[2]-length*yaxis[2] );
        var pos_z = new THREE.Vector3( origin[0] + length*zaxis[0],  origin[1]+length*zaxis[1],  origin[2]+length*zaxis[2] );
        var neg_z = new THREE.Vector3( origin[0] - length*zaxis[0],  origin[1]-length*zaxis[1],  origin[2]-length*zaxis[2] );

        axes.add( buildAxis( or, pos_x, 0x990000, false ) ); // +X
        axes.add( buildAxis( or, neg_x, 0x990000, true ) ); // -X
        axes.add( buildAxis( or, pos_y, 0x009900, false ) ); // +Y
        axes.add( buildAxis( or, neg_y, 0x009900, true ) ); // -Y
        axes.add( buildAxis( or, pos_z, 0x0000CC, false ) ); // +Z
        axes.add( buildAxis( or, neg_z, 0x0000CC, true ) ); // -Z

        return axes;

    }

}

// mObj Geometry Class
// geometry is stored in geometry format native to module
var mObj_geom = function mObj_geom( geometry, material ){
	
	mObj.call(this, 'geometry');

	var geometry = geometry; 
    var material = material;

    var self = this;

    var data = undefined;
    var topology = undefined;

    var threeGeometry, threeTopology;

    //
    // update function when some property of the object changes
    //
    var update = function(){
        threeGeometry = undefined;
        threeTopology = undefined;
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
        if(topology == undefined)
            topology = computeTopology( self );       
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
        else
            update();
        console.log("Material updated");
    }

    // Dynamic Topology !
   for(var property in TOPOLOGY_DEF){
       
        var propFunc = new Function( 'return this.getTopology()["' + property + '"];' );
       
        Object.defineProperty(this, property,  {
                get: propFunc,
                set: undefined
        });
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
            
            // means it is a solid
            if( geometry instanceof Array){
                var threeGeometry = new THREE.Object3D(); 
                for(var srf=0; srf < geometry.length; srf++){
                    var geom = geometry[srf];
                    var exGeom = geom.extractThreeGeometry();
                    if(material)
                        exGeom.material = material;
                    threeGeometry.add( exGeom ); 
                }
            }else{
                threeGeometry = convertGeomToThree( geometry );  // calls a function in the module to convert native geom into accepted three format
                if(material)
                    threeGeometry.material = material;
            }
                
        }
			 

        // if material has been assigned to this data object, assigns the same material to the converted geometry
        threeGeometry.is_mObj = true;

        return threeGeometry;
    }


    //
    // Converts the topology defined in native elements to three.js format
    this.extractTopology = function(){

        // if threeGeometry hasn't been computed before or native geometry has been transformed so that new conversion is required
        // the function defines it and caches it
        if(topology == undefined)
            topology = computeTopology(self);

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
                        'attachedTo' : self,
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
                        var topoData = topology[topoElement][index].getData(); 
                        if (topoData != undefined){
                            for( var property in topoData ){
                                var jsonObject = {
                                    'attachedTo' : topoElement+index,
                                    'Property' : property,
                                    'Value' : topoData[property]
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


   

    // topology is always computed 
    update();
	
}

var mObj_geom_Vertex = function mObj_geom_Vertex( geometry ){
   var defaultVertexMaterial = new THREE.PointsMaterial( { size: 5, sizeAttenuation: false } );
    
    mObj_geom.call( this, geometry, defaultVertexMaterial  ); 
}
 
var mObj_geom_Curve = function mObj_geom_Curve( geometry ){
    
    var defaultCurveMaterial = new THREE.LineBasicMaterial({
    side: THREE.DoubleSide,
    linewidth: 100,
    color: 0x003399
    });
	
    mObj_geom.call( this, geometry, defaultCurveMaterial  ); 
	
}

var mObj_geom_Surface = function mObj_geom_Surface( geometry ){
	
    var defaultSurfaceMaterial = new THREE.MeshLambertMaterial( {
    side: THREE.DoubleSide,
    wireframe: false,
    shading: THREE.SmoothShading,
    transparent: false,
    color: 0x003399
    } );

	mObj_geom.call( this, geometry, defaultSurfaceMaterial  );

}

var mObj_geom_Solid = function mObj_geom_Solid( geometry){
	
    var defaultSolidMaterial = new THREE.MeshLambertMaterial( {
    side: THREE.DoubleSide,
    wireframe: false,
    shading: THREE.SmoothShading,
    transparent: false,
    color: 0xCC6600
    } );

	mObj_geom.call( this, geometry, defaultSolidMaterial );

}


