/*
 * Definitions to be present by the module, 
 * as required by this datastructure
 *
 * TOPOLOGY_DEF - { 'level_1': [], 'level_2': [], 'level_3': [], 'level_4': [], ....}
 * convertGeomtoThreeMesh - Function to convert the native geometry being used by the Module into three.js
 * computeTopology - Computes the geometry's topology in native geometry format encapsulated in Mobius Objects
 * convertTopoToThree - Converts the computed topology into threeJS format
 * Last Updated: August 8, 2016
 *
 */

/*
 * Mobius Data Structure Definition
 * Not open to editing by Module Developers
 * Last Updated: August 8, 2016
 *
 */


/*
 *  
 * Global identifier for objects
 * 
 */
var globalID = 0;



/*
 *  Parent object for any Mobius Object
 *  Any Mobius Object inherits from this object
 *
 *  Properties:
 *      public:
 *          is_mObj
 *      private:
 *          type
 *          guid 
 *          
 *  Methods: 
 *          getType
 *          getGUID
 *
 */



var mObj = function mObj( type ){

    /*
     *
     *  Internal function used to generate GUID
     *
     */
    function guid() {

        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }

        return randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');;

    }


    /*
     *  
     */
    var type = type;
    var guid =  guid();

    this.is_mObj = true;

    this.getType = function(){
        return type;
    }

    this.getGUID = function(){
        return guid;
    }

    mObj.count++;
};

mObj.count=0;

function getMobiusObjectCount(){
    return mObj.count; 
}


/*
 *  Mobius Data Objects
 *  Inheritance: mObj
 *
 *  Properties:
 *      private:
 *          data
 *          
 *  Methods: 
 *          getData
 */
var mObj_data = function mObj_data(type, data){

    mObj.call(this, type);

    var data = data;

    this.getData = function(){
        return data;
    }

};


/*
 *  Mobius Frame Object
 *  Inheritance: mObj
 *
 *  Any two axes can be passed and the third will be computed automatically
 *
 *  Properties:
 *      private:
 *          _xaxis, _yaxis, _zaxis, world_space_matrix, local_space_matrix 
 *          
 *  Methods: 
 *          toLocal, to Global, getPlane(id), getOrigin, getXAxis, getYAxis, getZAxis
 *          extractThreeGeometry, extractTopology, extractData
 */
var mObj_frame = function mObj_frame( origin, xaxis, yaxis, zaxis ){

    mObj.call(this, 'frame');

    // TODO: Check that atleast two axes have been passed
    var undefinedAxesCount = 0;


    // Computes the missing axes - follows cylic order to maintain consistency
    // TODO: Remove functioFTOFOns that are using verbs
    // TODO : Shift to helper functions file
    if( xaxis == undefined ){
        xaxis = verb.core.Vec.cross( yaxis, zaxis );
    }
    else if( yaxis == undefined ){
        yaxis = verb.core.Vec.cross( zaxis, xaxis );
    }
    else if( zaxis == undefined ){
        zaxis = verb.core.Vec.cross( xaxis, yaxis );
    }


    // Creating unit vectors
    // TODO: Remove functions that are using verbs
    // TODO : Shift to helper functions file
    var _xaxis = verb.core.Vec.normalized( xaxis );
    var _yaxis = verb.core.Vec.normalized( yaxis );
    var _zaxis = verb.core.Vec.normalized( zaxis );

    // Internal function to invert a matrix
    // TODO : Shift to helper functions file
    function invertMatrix(m) {

        var r = [16];

        r[0] = m[1][1]*m[2][2]*m[3][3] - m[1][1]*m[3][2]*m[2][3] - m[1][2]*m[2][1]*m[3][3] + m[1][2]*m[3][1]*m[2][3] + m[1][3]*m[2][1]*m[3][2] - m[1][3]*m[3][1]*m[2][2];
        r[1] = -m[0][1]*m[2][2]*m[3][3] + m[0][1]*m[3][2]*m[2][3] + m[0][2]*m[2][1]*m[3][3] - m[0][2]*m[3][1]*m[2][3] - m[0][3]*m[2][1]*m[3][2] + m[0][3]*m[3][1]*m[2][2];
        r[2] = m[0][1]*m[1][2]*m[3][3] - m[0][1]*m[3][2]*m[1][3] - m[0][2]*m[1][1]*m[3][3] + m[0][2]*m[3][1]*m[1][3] + m[0][3]*m[1][1]*m[3][2] - m[0][3]*m[3][1]*m[1][2] ;
        r[3] = -m[0][1]*m[1][2]*m[2][3] + m[0][1]*m[2][2]*m[1][3] + m[0][2]*m[1][1]*m[2][3] - m[0][2]*m[2][1]*m[1][3] - m[0][3]*m[1][1]*m[2][2] + m[0][3]*m[2][1]*m[1][2] ;

        r[4] = -m[1][0]*m[2][2]*m[3][3] + m[1][0]*m[3][2]*m[2][3] + m[1][2]*m[2][0]*m[3][3] - m[1][2]*m[3][0]*m[2][3] - m[1][3]*m[2][0]*m[3][2] + m[1][3]*m[3][0]*m[2][2];
        r[5] = m[0][0]*m[2][2]*m[3][3] - m[0][0]*m[3][2]*m[2][3] - m[0][2]*m[2][0]*m[3][3] + m[0][2]*m[3][0]*m[2][3] + m[0][3]*m[2][0]*m[3][2] - m[0][3]*m[3][0]*m[2][2];
        r[6] = -m[0][0]*m[1][2]*m[3][3] + m[0][0]*m[3][2]*m[1][3] + m[0][2]*m[1][0]*m[3][3] - m[0][2]*m[3][0]*m[1][3] - m[0][3]*m[1][0]*m[3][2] + m[0][3]*m[3][0]*m[1][2] ;
        r[7] = m[0][0]*m[1][2]*m[2][3] - m[0][0]*m[2][2]*m[1][3] - m[0][2]*m[1][0]*m[2][3] + m[0][2]*m[2][0]*m[1][3] + m[0][3]*m[1][0]*m[2][2] - m[0][3]*m[2][0]*m[1][2] ;

        r[8] = m[1][0]*m[2][1]*m[3][3] - m[1][0]*m[3][1]*m[2][3] - m[1][1]*m[2][0]*m[3][3] + m[1][1]*m[3][0]*m[2][3] + m[1][3]*m[2][0]*m[3][1] - m[1][3]*m[3][0]*m[2][1] ;
        r[9] = -m[0][0]*m[2][1]*m[3][3] + m[0][0]*m[3][1]*m[2][3] + m[0][1]*m[2][0]*m[3][3] - m[0][1]*m[3][0]*m[2][3] - m[0][3]*m[2][0]*m[3][1] + m[0][3]*m[3][0]*m[2][1] ;
        r[10] = m[0][0]*m[1][1]*m[3][3] - m[0][0]*m[3][1]*m[1][3] - m[0][1]*m[1][0]*m[3][3] + m[0][1]*m[3][0]*m[1][3] + m[0][3]*m[1][0]*m[3][1] - m[0][3]*m[3][0]*m[1][1] ;
        r[11] = -m[0][0]*m[1][1]*m[2][3] + m[0][0]*m[2][1]*m[1][3] + m[0][1]*m[1][0]*m[2][3] - m[0][1]*m[2][0]*m[1][3] - m[0][3]*m[1][0]*m[2][1] + m[0][3]*m[2][0]*m[1][1] ;

        r[12] = -m[1][0]*m[2][1]*m[3][2] + m[1][0]*m[3][1]*m[2][2] + m[1][1]*m[2][0]*m[3][2] - m[1][1]*m[3][0]*m[2][2] - m[1][2]*m[2][0]*m[3][1] + m[1][2]*m[3][0]*m[2][1] ;
        r[13] = m[0][0]*m[2][1]*m[3][2] - m[0][0]*m[3][1]*m[2][2] - m[0][1]*m[2][0]*m[3][2] + m[0][1]*m[3][0]*m[2][2] + m[0][2]*m[2][0]*m[3][1] - m[0][2]*m[3][0]*m[2][1] ;
        r[14] = -m[0][0]*m[1][1]*m[3][2] + m[0][0]*m[3][1]*m[1][2] + m[0][1]*m[1][0]*m[3][2] - m[0][1]*m[3][0]*m[1][2] - m[0][2]*m[1][0]*m[3][1] + m[0][2]*m[3][0]*m[1][1] ;
        r[15] = m[0][0]*m[1][1]*m[2][2] - m[0][0]*m[2][1]*m[1][2] - m[0][1]*m[1][0]*m[2][2] + m[0][1]*m[2][0]*m[1][2] + m[0][2]*m[1][0]*m[2][1] - m[0][2]*m[2][0]*m[1][1] ;

        var det = m[0][0]*r[0] + m[0][1]*r[4] + m[0][2]*r[8] + m[0][3]*r[12];
        for (var i = 0; i < 16; i++) r[i] /= det;

        return [ [ r[0], r[1], r[2], r[3]],
            [ r[4], r[5], r[6], r[7]],
            [ r[8], r[9], r[10], r[11]],
            [ r[12], r[13], r[14], r[15] ]
        ];
    };


    // Compute the translation matrix
    var mat_trans = [ [ 1, 0, 0, -origin[0] ],
        [ 0, 1, 0, -origin[1] ],
        [ 0, 0, 1, -origin[2] ],
        [ 0, 0, 0, 1 ]

    ];

    // Compute the inverse of the translation matrix (??)
    var mat_trans_inv = [ [ 1, 0, 0, origin[0] ],
        [ 0, 1, 0, origin[1] ],
        [ 0, 0, 1, origin[2] ],
        [ 0, 0, 0, 1 ]
    ];

    // Compute the world space matrix without translation
    var world_space_matrix = [ [ _xaxis[0], _xaxis[1], _xaxis[2], 0],
        [ _yaxis[0], _yaxis[1], _yaxis[2], 0],
        [ _zaxis[0], _zaxis[1], _zaxis[2], 0],
        [ 0, 0, 0, 1 ] ]


    // Compute the world space matrix
    // TODO: Remove functions that are using verbs
    // TODO : Shift to helper functions file
    world_space_matrix = verb.core.Mat.mult(world_space_matrix, mat_trans);

    

    // Computes the inverse of the world space matrix as the local space matrix
    var local_space_matrix = invertMatrix( world_space_matrix );


    // Creates objects for the planes
    var planes = { 'xy' : {'a': _zaxis[0], 'b': _zaxis[1], 'c': _zaxis[2], 'd':_zaxis[0]*origin[0] + _zaxis[1]*origin[1] + _zaxis[2]*origin[2] },
        'yz' : {'a': _xaxis[0], 'b': _xaxis[1], 'c': _xaxis[2], 'd':_xaxis[0]*origin[0] + _xaxis[1]*origin[1] + _xaxis[2]*origin[2] },
        'zx' : {'a': _yaxis[0], 'b': _yaxis[1], 'c': _yaxis[2], 'd':_yaxis[0]*origin[0] + _yaxis[1]*origin[1] + _yaxis[2]*origin[2] }
    }


    this.toLocal = function( ){
        return local_space_matrix;
    }

    this.toGlobal = function(){
        return world_space_matrix;
    }

    this.getPlane = function(id){
        return planes[id];
    }

    this.getOrigin = function(){
        return origin;
    }

    this.getXaxis = function(){
        return _xaxis;
    }

    this.getYaxis = function(){
        return _yaxis;
    }

    this.getZaxis = function(){
        return _zaxis;
    }

    this.extractThreeGeometry = function(){

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
            var pos_x = new THREE.Vector3( origin[0] + length*_xaxis[0],  origin[1]+length*_xaxis[1],  origin[2]+length*_xaxis[2] );
            var neg_x = new THREE.Vector3( origin[0] - length*_xaxis[0],  origin[1]-length*_xaxis[1],  origin[2]-length*_xaxis[2] );
            var pos_y = new THREE.Vector3( origin[0] + length*_yaxis[0],  origin[1]+length*_yaxis[1],  origin[2]+length*_yaxis[2] );
            var neg_y = new THREE.Vector3( origin[0] - length*_yaxis[0],  origin[1]-length*_yaxis[1],  origin[2]-length*_yaxis[2] );
            var pos_z = new THREE.Vector3( origin[0] + length*_zaxis[0],  origin[1]+length*_zaxis[1],  origin[2]+length*_zaxis[2] );
            var neg_z = new THREE.Vector3( origin[0] - length*_zaxis[0],  origin[1]-length*_zaxis[1],  origin[2]-length*_zaxis[2] );

            axes.add( buildAxis( or, pos_x, 0x990000, false ) ); // +X
            axes.add( buildAxis( or, neg_x, 0x990000, true ) ); // -X
            axes.add( buildAxis( or, pos_y, 0x009900, false ) ); // +Y
            axes.add( buildAxis( or, neg_y, 0x009900, true ) ); // -Y
            axes.add( buildAxis( or, pos_z, 0x0000CC, false ) ); // +Z
            axes.add( buildAxis( or, neg_z, 0x0000CC, true ) ); // -Z

            return axes;

        }

        return buildAxes( 20 );
    }

    this.extractTopology = function(){
        return null;
    }

    this.extractData = function(){
        return 'frame';
    }

}

/*
 *  Mobius Geometry Object
 *  Inheritance: mObj
 *
 *  This is a container object which stores geometry in the native format for the Module.
 *  For example, a module using verbs would create mObj_geom objects containing geometry that are verbs objects
 *
 *  Properties:
 *      private:
 *          _xaxis, _yaxis, _zaxis, world_space_matrix, local_space_matrix 
 *          
 *  Methods: 
 *          getGeometry, setGeometry, getTopology, setTopology, getData, setData
 *          extractThreeGeometry, extractTopology, extractData
 */
var mObj_geom = function mObj_geom( geometry, material ){

    mObj.call(this, 'geometry');

    var geometry = geometry;
    var material = material;

    var self = this;

    var data = undefined;
    var topology = undefined;

    var threeGeometry, threeTopology;

    /*
     *  To be called when geometry of an object is reset
     *  Sets all the cached properties of the object to undefined
     */
    var update = function(){
        
        threeGeometry = undefined;
        threeTopology = undefined;

        topology = undefined;
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
            topology = computeTopology( self, this.getGUID() );
        return topology;
    }

    this.setTopology = function(customTopo){
        topology = customTopo;
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
    }

    this.setHex = function (colorHex) {
        var hex = '0x' + colorHex.toString(16);

        if(!threeGeometry){
            this.extractThreeGeometry();
        }

        var geom = this.getGeometry();
        for (var i = 0; i < geom.faces.length; i++) {
            var face = geom.faces[i];
            face.color.setHex(hex);
        }
    }

    /*
     * Generated from the TOPOLOGY_DEF present in the Module
     * This attaches the topology directly to the object
     * For example, an object can have object.vertices, object.points etc - because of this segment 
     *
     */
    for(var property in MOBIUS.TOPOLOGY_DEF){

        var propFunc = new Function( 'return this.getTopology()["' + property + '"];' );

        Object.defineProperty(this, property,  {
            get: propFunc,
            set: undefined
        });
    }



    /*
     * Functions used by Mobius or Module for the different viewers
     */

    /*
     * Converts the geometry of the MobiusDataObject - to three.js Mesh by calling a bridging function 'convertGeomtoThreeMesh' in the module
     * This function can be overriden by the children of the mObj_geom
     */
    this.extractThreeGeometry = function(){ 

        // if threeGeometry hasn't been computed before or native geometry has been transformed so that new conversion is required
        // the function defines it and caches it
        if( threeGeometry == undefined ){
        
            threeGeometry = convertGeomToThree( geometry );  
            
            // Attaches a material 
            if(material)
                threeGeometry.material = material;

        }


        // This adds a flag which notifies Mobius that this object is a generated geometry and needs to be removed when the page is refreshed
        threeGeometry.is_mObj = true;

        return threeGeometry;
    }


    /*
     * Converts the topology defined in native elements to three.js format
     */
    this.extractTopology = function(){

        

        // if threeGeometry hasn't been computed before or native geometry has been transformed so that new conversion is required
        // the function defines it and caches it
        if(topology == undefined)
            topology = computeTopology(self);
        else
            console.log("Topology already defined");

        // calls a function in the module to convert native geom into accepted three format
        if( threeTopology == undefined )
            threeTopology = convertTopoToThree( topology );  

        threeTopology.is_mObj = true;

        //console.log(topology, threeTopology);

        return threeTopology;
    }

    /*
     * Extracts data at MobiusDataObject level and topology level, converts it into a JSON object and returns it to the calling function
     * Doesnot require any bridging functions from the module
     */
    this.extractData = function(connectorName){

        var dataTable = [];

        if(topology == undefined)
            this.extractTopology();

        // LIMITATION - Data can only be added to the topology
        if( topology == undefined /*&& data == undefined */){
            console.log("No Topology or Data.");
            return dataTable;
        }
        else{
            if (data != undefined){

                // belongsTo property only appears with the object is being displayed as part of a topology
                for(var property in data){
                    
                    if(property != 'belongsTo'){
                        var jsonObject = {
                            'attachedTo' : 'object_' + this.getGUID(),
                            'index':this.getGUID(),
                            'Property' : property,
                            'Value' : data[property],
                            'cate': 'Model',
                            'connectorName':connectorName
                        };
                        
                        dataTable.push(jsonObject);                        
                    }
                }
            }

            // generalized - irrespective of topology object configuration
            for(topoElement in topology){ 
                if(topology.hasOwnProperty(topoElement)){
                    
                    var maxInd = (topology[topoElement].length < 100 || topoElement == 'objects') ? topology[topoElement].length : 100 ;
                    
                    for( var index=0; index < maxInd; index++){ 

                        if(topoElement == "points"){

                            var jsonObject = {
                                                    'attachedTo' : topoElement + index,
                                                    'index' : index,
                                                    'cate': topoElement,
                                                    'Property' : 'Location',
                                                    'Value' : topology[topoElement][index],
                                                    'connectorName':connectorName
                                                };
                            dataTable.push(jsonObject); 
                            continue;

                        };

                        if(topology[topoElement][index] instanceof Array){ 

                            //console.log(topology[topoElement][index], topoElement);
                           
                                var jsonObject = {
                                    'attachedTo' : topoElement + index,
                                    'index' : index,
                                    'cate': topoElement,
                                    'Property' : "belongsTo",
                                    'Value' : topology[topoElement][index],
                                    'connectorName':connectorName
                                };
                                dataTable.push(jsonObject);

                        }
                        else{
                            var topoData = topology[topoElement][index].getData();
                            if (topoData != undefined){
                                for( var property in topoData ){

                                    var jsonObject = {
                                        'attachedTo' : topoElement + index,
                                        'index' : index,
                                        'cate': topoElement,
                                        'Property' : property,
                                        'Value' : topoData[property],
                                        'connectorName':connectorName
                                    };
                                    dataTable.push(jsonObject);
                                }
                            }                            
                        }

                    }
                }
            }
        }

        //console.log(dataTable);
        return dataTable;
    }


    update();

}



// Point Geometry
var mObj_geom_Vertex = function mObj_geom_Vertex( geometry ){
    var defaultVertexMaterial = new THREE.PointsMaterial( { size: 5, sizeAttenuation: false } );

    mObj_geom.call( this, geometry, defaultVertexMaterial  );

    this.x = geometry[0];
    this.y = geometry[1];
    this.z = geometry[2];
}


// 1D Geometry
var mObj_geom_Curve = function mObj_geom_Curve( geometry ){

    var defaultCurveMaterial = new THREE.LineBasicMaterial({
        side: THREE.DoubleSide,
        linewidth: 100,
        color: 0x003399
    });

    mObj_geom.call( this, geometry, defaultCurveMaterial  );

}

// 2D Geometry
var mObj_geom_Surface = function mObj_geom_Surface( geometry ){

    var defaultSurfaceMaterial = new THREE.MeshLambertMaterial( {
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: false,
        color: 0x003399
    } );

    mObj_geom.call( this, geometry, defaultSurfaceMaterial  );

}

// 3D Geometry - faces should be connected -
var mObj_geom_Solid = function mObj_geom_Solid( geometry ){

    var defaultSolidMaterial = new THREE.MeshLambertMaterial( {
        side: THREE.DoubleSide,
        wireframe: false,
        // shading: THREE.SmoothShading,
        transparent: false,
        color: 0xCC6600
    } );

    mObj_geom.call( this, geometry, defaultSolidMaterial );

}

/*
 * Combination of Geometries - array - objects might or might not be connected; it's a container
 */
var mObj_geom_Compound = function mObj_geom_Compound( geometry ){

    var defaultSolidMaterial = new THREE.MeshLambertMaterial( {
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: false,
        color: 0xCF6600
    } );

    mObj_geom.call( this, geometry, defaultSolidMaterial );


    /*
     *  Overrides the extractThreeGeometry function to accomodate arrays
     *
     */ 
    this.extractThreeGeometry = function(){ 

        var threeGeometry; 

        if( geometry instanceof Array ){

            // flatten the array
            var array_of_elements = geometry.map(function(mObj){

                // convert compound into array of mObj elements
                if(mObj instanceof mObj_geom_Compound)
                    return mObj.getGeometry();
                else
                    return mObj;
        
            })
            array_of_elements = array_of_elements.flatten();

            threeGeometry = new THREE.Object3D();
            
            for(var element=0; element < array_of_elements.length; element++){
                var geom = array_of_elements[element];
                var exGeom = geom.extractThreeGeometry();
                threeGeometry.add( exGeom );

                //
                // var edges = new THREE.EdgesHelper( exGeom, "black");
                // edges.material.linewidth = 2;
                // threeGeometry.add(edges);
            }
        
        }
        
        threeGeometry.is_mObj = true;
        // console.log(threeGeometry)
        return threeGeometry; 
    }

}


