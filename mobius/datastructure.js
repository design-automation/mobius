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

    // order doesn't matter
    //var angle_x = verb.core.Vec.angleBetween([1,0,0], zaxis);
    //var angle_y = verb.core.Vec.angleBetween([0,0,1], xaxis);
    //var angle_z = -verb.core.Vec.angleBetween([1,0,0], xaxis); 
/*    var euler_alpha = Math.cosh( zaxis[2] );
    var euler_beta = Math.cosh( -zaxis[2] / Math.sin(euler_alpha) )
    var euler_gamma = Math.cosh( yaxis[2] / Math.sin(euler_alpha) )*/

    var a = -Math.atan( xaxis[2] / xaxis[0] ); 
    var b = -Math.asin( xaxis[1] ); //Math.tanh( xaxis[1] / Math.sqrt( xaxis[0]*xaxis[0] + xaxis[2]*xaxis[2] ))
    var c = Math.atan( yaxis[1] / yaxis[2])

    // compute translation
    var mat_trans = [ [ 1, 0, 0, origin[0] ],
                        [ 0, 1, 0, origin[1] ],
                            [ 0, 0, 1, origin[2] ],
                                [ 0, 0, 0, 1 ]
      
                        ]; console.log(mat_trans);

    // yaxis [0,1,0]
    var cost = Math.cos( a );
    var sint = Math.sin( a );
    var mat_rot_a = [ [ cost , 0, sint, 0 ],
                            [ 0,  1,  0, 0 ],
                                [ -sint, 0, cost, 0],
                                    [ 0, 0, 0, 1 ]
                        ];

    // zaxis [0,0,1]
    var cost = Math.cos( b );
    var sint = Math.sin( b );
    var mat_rot_b = [ [ cost, -sint, 0, 0 ],
                            [ sint, cost, 0, 0 ],
                                [ 0, 0, 1, 0 ],
                                    [ 0, 0, 0, 1 ]
                        ];
/*
    var cost = Math.cos( euler_gamma );
    var sint = Math.sin( euler_gamma );
    var mat_rot_c = [ [ cost, -sint, 0, 0 ],
                            [ sint, cost, 0, 0 ],
                                [ 0, 0, 1, 0 ],
                                    [ 0, 0, 0, 1 ]
                        ]; */
    // xaxis [1,0,0]
    var cost = Math.cos( c );
    var sint = Math.sin( c );
    var mat_rot_c = [ [ 1, 0, 0, 0 ],
                            [ 0,  cost, -sint, 0 ],
                                [ 0,  sint, cost, 0 ],
                                    [ 0, 0, 0, 1 ]
                        ];

                        /*
    var mat = verb.core.Mat.mult( mat_trans, mat_rot_z );
    mat = verb.core.Mat.mult( mat, mat_rot_y );
    mat = verb.core.Mat.mult( mat, mat_rot_x );*/

    this.applyMatrix = function( geom ){ console.log("applying");
       geom = geom.transform(mat_rot_a);
       //geom = geom.transform(mat_rot_b); 
       //geom = geom.transform(mat_rot_b);
       //geom = geom.transform( mat_trans );
       return geom;
    }

    /*var m = [];
    mat.map( function(t){
            t.map( function(u){
                m.push(u)
            })
    })

    var r = new Array(15)

    r[0] = m[5]*m[10]*m[15] - m[5]*m[14]*m[11] - m[6]*m[9]*m[15] + m[6]*m[13]*m[11] + m[7]*m[9]*m[14] - m[7]*m[13]*m[10];
    r[1] = -m[1]*m[10]*m[15] + m[1]*m[14]*m[11] + m[2]*m[9]*m[15] - m[2]*m[13]*m[11] - m[3]*m[9]*m[14] + m[3]*m[13]*m[10];
    r[2] = m[1]*m[6]*m[15] - m[1]*m[14]*m[7] - m[2]*m[5]*m[15] + m[2]*m[13]*m[7] + m[3]*m[5]*m[14] - m[3]*m[13]*m[6];
    r[3] = -m[1]*m[6]*m[11] + m[1]*m[10]*m[7] + m[2]*m[5]*m[11] - m[2]*m[9]*m[7] - m[3]*m[5]*m[10] + m[3]*m[9]*m[6];

    r[4] = -m[4]*m[10]*m[15] + m[4]*m[14]*m[11] + m[6]*m[8]*m[15] - m[6]*m[12]*m[11] - m[7]*m[8]*m[14] + m[7]*m[12]*m[10];
    r[5] = m[0]*m[10]*m[15] - m[0]*m[14]*m[11] - m[2]*m[8]*m[15] + m[2]*m[12]*m[11] + m[3]*m[8]*m[14] - m[3]*m[12]*m[10];
    r[6] = -m[0]*m[6]*m[15] + m[0]*m[14]*m[7] + m[2]*m[4]*m[15] - m[2]*m[12]*m[7] - m[3]*m[4]*m[14] + m[3]*m[12]*m[6];
    r[7] = m[0]*m[6]*m[11] - m[0]*m[10]*m[7] - m[2]*m[4]*m[11] + m[2]*m[8]*m[7] + m[3]*m[4]*m[10] - m[3]*m[8]*m[6];

    r[8] = m[4]*m[9]*m[15] - m[4]*m[13]*m[11] - m[5]*m[8]*m[15] + m[5]*m[12]*m[11] + m[7]*m[8]*m[13] - m[7]*m[12]*m[9];
    r[9] = -m[0]*m[9]*m[15] + m[0]*m[13]*m[11] + m[1]*m[8]*m[15] - m[1]*m[12]*m[11] - m[3]*m[8]*m[13] + m[3]*m[12]*m[9];
    r[10] = m[0]*m[5]*m[15] - m[0]*m[13]*m[7] - m[1]*m[4]*m[15] + m[1]*m[12]*m[7] + m[3]*m[4]*m[13] - m[3]*m[12]*m[5];
    r[11] = -m[0]*m[5]*m[11] + m[0]*m[9]*m[7] + m[1]*m[4]*m[11] - m[1]*m[8]*m[7] - m[3]*m[4]*m[9] + m[3]*m[8]*m[5];

    r[12] = -m[4]*m[9]*m[14] + m[4]*m[13]*m[10] + m[5]*m[8]*m[14] - m[5]*m[12]*m[10] - m[6]*m[8]*m[13] + m[6]*m[12]*m[9];
    r[13] = m[0]*m[9]*m[14] - m[0]*m[13]*m[10] - m[1]*m[8]*m[14] + m[1]*m[12]*m[10] + m[2]*m[8]*m[13] - m[2]*m[12]*m[9];
    r[14] = -m[0]*m[5]*m[14] + m[0]*m[13]*m[6] + m[1]*m[4]*m[14] - m[1]*m[12]*m[6] - m[2]*m[4]*m[13] + m[2]*m[12]*m[5];
    r[15] = m[0]*m[5]*m[10] - m[0]*m[9]*m[6] - m[1]*m[4]*m[10] + m[1]*m[8]*m[6] + m[2]*m[4]*m[9] - m[2]*m[8]*m[5];

    var det = m[0]*r[0] + m[1]*r[4] + m[2]*r[8] + m[3]*r[12];
    for (var i = 0; i < 16; i++) 
        r[i] /= det;

    this.matrix = mat;
    this.inverseMatrix = [ [ r[0], r[1], r[2], r[3] ],
                                [ r[4], r[5], r[6], r[7] ],
                                    [ r[8], r[9], r[10], r[11] ],
                                        [ r[12], r[13], r[14], r[15] ]  ];*/

    this.extractThreeGeometry = function(){
        return buildAxes( 20 );
    }

    this.extractData = function(){
        return "This is a frame"
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

    this.getXAxis = function(){
        return _xaxis;
    }

    this.getYAxis = function(){
        return _yaxis;
    }

    this.getZAxis = function(){
        return _zaxis;
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


