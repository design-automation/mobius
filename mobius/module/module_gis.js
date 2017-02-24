/*
 *	Module, for Urban Design 
 */

var MODULE_NAME = "GIS"
MOBIUS_MODULES[MODULE_NAME] = ( function (mod){

	//
	//	Requirements
	//	Function names should remain the same
	//

	mod.TOPOLOGY_DEF = {"points": [], "vertices":[], "edges":[], "wires":[], "faces":[], "objects":[]};

	/*
	 *
	 * General Functions,
	 * Input - according to requirements; Output - non-geometric primitives
	 *
	 */

	mod.urb = {};
	mod.urb.description = "Functions dealing with Urban Design and Computation."

	mod.urb.loadObj = function( filepath ){

		// instantiate a loader
	    var objLoader = new THREE.OBJLoader();
		//'http://localhost/mobius/assets/data/test_model.obj'
		var request = new XMLHttpRequest();
		request.open('GET', filepath, false);  // `false` makes the request synchronous
		request.send(null);

		if (request.status === 200) {
		  //console.log(request.responseText);
		  var container = objLoader.parse(request.responseText);

		  return new mObj_geom_Solid(container);
		}
	}
	mod.urb.loadObj.prototype.description = "Loads an OBJ file from the filepath specified.  \
	<br><i>filepath: String </i>"

	mod.urb.loadGeoJSON = function( file_or_filepath ){

		if( file_or_filepath instanceof Object ){			
		   console.log(file_or_filepath.features.length, " features loaded");
		   return new mObj_data( 'geojson', file_or_filepath );
		}
		else{
			var request = new XMLHttpRequest();
			request.open('GET', file_or_filepath, false);  // `false` makes the request synchronous
			request.send(null);

			if (request.status === 200) {
			   var data = JSON.parse(request.responseText);
			   console.log(data.features.length, " features loaded");
			   return new mObj_data( 'geojson', data);
			}			
		}

	};
	mod.urb.loadGeoJSON.prototype.description = "Loads a GEOJSON file from the filepath specified.\
	<br><i>file_or_filepath: String</i>"

	// TODO: Shift this under obj category
	mod.urb.getProperty = function( dataObject, propertyName ){

		if(dataObject.is_mObj)
			return dataObject.getData()[propertyName];
		else
			return dataObject[propertyName];

	};
	mod.urb.getProperty.prototype.description = "Extracts a particular property from a data object.\
	<br><i>dataObject: Mobius Object </i>\
	<br><i>propertyName: String</i>"

	//
	//
	// frame functions
	//
	//
	/** @namespace */
	mod.frm = {}; 
	mod.frm.description = "Functions dealing with creation of local frames for drawing geometry."
	
	/**
	 * Creates a local coordinate system with a given origin and the X-Axis and Y-Axis pointing towards the specfied points 
	 * @param {array / vertex object} origin - Origin of the local coordinate system
	 * @param {array / vertex object} xPoint - Point on the X-Axis 
	 * @param {array / vertex object} yPoint - Point on the Y-Axis
	 * @returns {frame object }  - A Frame Object
	 * @memberof frm
	 */
	mod.frm.byXYPoints = function(origin, xPoint, yPoint){

		if(origin.getGeometry != undefined)
			origin = origin.getGeometry();
	    
	    // how to you make sure the two axes are perpendicular
		var xaxis = [xPoint[0]-origin[0], xPoint[1]-origin[1], xPoint[2]-origin[2]];
		var yaxis = [yPoint[0]-origin[0], yPoint[1]-origin[1], yPoint[2]-origin[2]];

		if( mod.mtx.dot(xaxis, yaxis) != 0)
			mod.msc.print("Axes are not perpendicular");

		return new mObj_frame(origin, xaxis, yaxis, undefined);

	};
	mod.frm.byXYPoints.prototype.description = "Creates a local coordinate system with a given origin and the X-Axis and Y-Axis pointing towards the specfied points .\
	 <br><i> {array / vertex object} <b>origin</b> - Origin of the local coordinate system\
	 <br><i> {array / vertex object} <b>xPoint</b> - Point on the X-Axis \
	 <br><i> {array / vertex object} <b>yPoint</b> - Point on the Y-Axis\
	 <br> @returns {frame object }  - Mobius Object (a frame)"
	        
	/**
	 * Creates a local coordinate system with a given origin and the X-Axis and Z-Axis pointing towards the specfied points 
	 * @param {array / vertex object} origin - Origin of the local coordinate system
	 * @param {array / vertex object} xPoint - Point on the X-Axis
	 * @param {array / vertex object} zPoint - Point on the Z-Axis
	 * @returns {frame object }  - A Frame Object
	 * @memberof frm
	 */
	mod.frm.byXZPoints = function(origin, xPoint, zPoint){		

		if(origin.getGeometry != undefined)
			origin = origin.getGeometry();

		var xaxis = [xPoint[0]-origin[0], xPoint[1]-origin[1], xPoint[2]-origin[2]];
		var zaxis = [zPoint[0]-origin[0], zPoint[1]-origin[1], zPoint[2]-origin[2]];		

		if( mod.mtx.dot(xaxis, zaxis) != 0)
			mod.msc.print("Axes are not perpendicular");

		return new mObj_frame(origin, xaxis, undefined, zaxis);

	};

	/**
	 * Creates a local coordinate system with a given origin and the Y-Axis and Z-Axis pointing towards the specfied points 
	 * @param {array / vertex object} origin - Origin of the local coordinate system
	 * @param {array / vertex object} xPoint - Point on the Y-Axis
	 * @param {array / vertex object} zPoint - Point on the Z-Axis
	 * @returns {frame object }  - A Frame Object
	 * @memberof frm
	 */
	mod.frm.byYZPoints = function(origin, yPoint, zPoint){

		if(origin.getGeometry != undefined)
			origin = origin.getGeometry();

		var yaxis = [yPoint[0]-origin[0], yPoint[1]-origin[1], yPoint[2]-origin[2]];
		var zaxis = [zPoint[0]-origin[0], zPoint[1]-origin[1], zPoint[2]-origin[2]];		

		if( mod.mtx.dot(zaxis, yaxis) != 0)
			mod.msc.print("Axes are not perpendicular");

		return new mObj_frame(origin, undefined, yaxis, zaxis)
	
	};

	/**
	 * Creates a local coordinate system with a given origin and the X and Y axis Vectors. Units vectors are not neccessary. 
	 * @param {array / vertex object} origin - Origin of the local coordinate system
	 * @param {array} xAxis - X-Axis Vector in [x, y, z] format
	 * @param {array} yAxis - Y-Axis Vector in [x, y, z] format
	 * @returns {frame object }  - A Frame Object
	 * @memberof frm
	 */
	mod.frm.byXYAxes = function(origin, xAxis, yAxis){

		if(origin.getGeometry != undefined)
			origin = origin.getGeometry();

		if( mod.mtx.dot(xAxis, yAxis) != 0)
			mod.msc.print("Axes are not perpendicular");

		return new mObj_frame(origin, xAxis, yAxis, undefined);

	};

	/**
	 * Creates a local coordinate system with a given origin and the X and Y axis Vectors. Units vectors are not neccessary. 
	 * @param {array / vertex object} origin - Origin of the local coordinate system
	 * @param {array} xAxis - X-Axis Vector in [x, y, z] format
	 * @param {array} zAxis - Z-Axis Vector in [x, y, z] format
	 * @returns {frame object }  - A Frame Object
	 * @memberof frm
	 */
	mod.frm.byXZAxes = function(origin, xAxis, zAxis){

		if(origin.getGeometry != undefined)
			origin = origin.getGeometry();

		if( mod.mtx.dot(xAxis, zAxis) != 0)
			mod.msc.print("Axes are not perpendicular");

		return new mObj_frame(origin, xAxis, undefined, zAxis);

	};

	/**
	 * Creates a local coordinate system with a given origin and the Y and Z axis Vectors. Units vectors are not neccessary. 
	 * @param {array / vertex object} origin - Origin of the local coordinate system
	 * @param {array} yAxis - Y-Axis Vector in [x, y, z] format
	 * @param {array} zAxis - Z-Axis Vector in [x, y, z] format
	 * @returns {frame object }  - A Frame Object
	 * @memberof frm
	 */
	mod.frm.byYZAxes = function(origin, yAxis, zAxis){

		if(origin.getGeometry != undefined)
			origin = origin.getGeometry();

		if( mod.mtx.dot(zAxis, yAxis) != 0)
			mod.msc.print("Axes are not perpendicular");

		return new mObj_frame(origin, undefined, yAxis, zAxis);

	};

	//
	//
	// solid functions
	//
	//
	/** @namespace */
	mod.sld = {};

	/**
	 * Creates a solid object by extruding a surface along x, y, z vectors of the given local coordinate system
	 * @param { frame object } frame - Local coordinate system 
	 * @param { surface object } surface - Surface to be extruded
	 * @param { float } xDistance - Amount of extrusion in the direction of the x-Axis of the frame
	 * @param { float } yDistance - Amount of extrusion in the direction of the y-Axis of the frame
	 * @param { float } zDistance - Amount of extrusion in the direction of the z-Axis of the frame
	 * @returns { solid object }  - Solid object 
	 * @memberof sld
	 */
	mod.sld.byExtrusion = function(frame, surface, zDistance){

		// extrude path later to extrude along different directions

		// can do it only if surface is a shape

		var shape;
		if(surface.getGeometry() instanceof THREE.Shape)
			console.log("Error Case - Shape received!")
		else if(surface.getGeometry() instanceof THREE.Geometry){

			shape = surface.getGeometry();
			
			// convert to global 
			shape.applyMatrix( getThreeMatrix(shape.frame.toGlobal()) ); 

			shape = convertShapeGeometryToShape(shape)
		}

		var extrusionSettings = {
			amount: zDistance, 
			size: 1, height: 1, curveSegments: 3,
			bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
			material: 0, extrudeMaterial: 1
		};

		var exGeom = new THREE.ExtrudeGeometry( shape, extrusionSettings );
		//console.log("Processed extrudeGeom : ", exGeom);

		exGeom.boundingBox = new THREE.Box3();			
		exGeom.boundingSphere = new THREE.Sphere();
		exGeom.morphTargets = [];
		exGeom.morphNormals = [];
		exGeom.skinIndices = [];
		exGeom.skinWeights = [];


		exGeom.applyMatrix( getThreeMatrix(frame.toLocal()) );
		//console.log("Processed extrudeGeom after frame conversion : ", exGeom);


		return new mObj_geom_Solid( exGeom );

	};

	//
	//
	// surface functions
	//
	//
	/** @namespace */
	mod.srf = {};

	/**
	 * Creates a Nurbs surface using the corner-points
	 * @param {frame object} - Local coordinate system for the object
	 * @param {array} cornerpoints - Array of points / vertex objects ( [ [x1, y1, z1], [x2, y2, z2], [x3, y3, z3], [x4, y4, z4] ] )
	 * @returns { surface object }  - Surface object
	 * @memberof srf
	 */
	mod.srf.polygonByPoints = function ( frame, points, holes ){

		// check each point and convert any vertex formats to point format
		points = points.map(function(p){
			if (p instanceof mObj_geom_Vertex)
				return [p.x, p.y, p.z];
			else
				return p;
		})

		var shape = new THREE.Shape();
		shape.moveTo(points[0][0], points[0][1]);
		for(var p=1; p<points.length; p++){
			shape.lineTo(points[p][0], points[p][1]);
		}
		//shape.lineTo(points[points.length-1][0], points[points.length-1][1]);
		
		var shapeGeom = new THREE.ShapeGeometry(shape);
		var m = getThreeMatrix(frame.toLocal())
		shapeGeom.applyMatrix(m);

		// check that this shouldn't have curves.length == 0
		shapeGeom.frame = frame; 


		return new mObj_geom_Surface( shapeGeom ) ;
	};


	// TODO: Write documentation for this - analyze how scaling etc works in this
	mod.srf.offset = function( in_surface, offset, scale ){

		//
		//
		//	convert jsclipper path to shape in three.js 
		//
		//
		var convertPathToShape = function( paths ){

			//console.log("these are paths ", paths);

			// for now, lets consider only one path is passed => pathPoints lengh == 1
			pathPoints = paths.map( function( sln ){

				return sln.map( function(pnt){  
					return new THREE.Vector2(pnt.X, pnt.Y) 
				} )

			})

			var path = new THREE.Path( )
			path.fromPoints( pathPoints[0] );	

			return path.toShapes()[0];
		}

		//
		//
		//	convert shape to path in js clipper
		//
		//
		var convertShapeToPath = function( shape ){

			var subj = new ClipperLib.Paths();	
			subj[0] = shape.actions.map( function( a ){

						return { "X": a.args[0], "Y": a.args[1] }
			});
			
			return subj;
		}

		var solution = new ClipperLib.Paths();
		
		// return value
		var surface;

		// if surface is a compound - TODO: handle this case better;
		if(in_surface instanceof mObj_geom_Compound){

			//surface = surface.getGeometry()[0];
			//console.log("Compound received in offset. First geom instance has been taken.")
			console.err("Compound received in function. Unwrap the compound.");
		}

		if(	in_surface.getGeometry )
			surface = in_surface.getGeometry();
		else{
			console.err("Surface geometry not defined.")
			return;			
		}

		if(surface instanceof THREE.Geometry){
			//console.log("Geometry / ShapeGeometry in offset function; ");
			surface = convertShapeGeometryToShape(surface);
		}

		if (surface instanceof THREE.Shape == false){
			console.log("Resulting object in offset function is not a shape and cannnot be processed. Unknown case encountered.");
			return; 
		}
		else{
			//console.log("Shape being processed for offset");
		}

		var subj = convertShapeToPath( surface ); 
		
		// the scaling is required to keep the points as integers. suppose you want an offset of 0.5 - scale to 10 and then mark the offset as 5 - to get
		// the required result.
		if (scale == undefined)
			scale = 1000;
		
/*		scale = 100;
		offset = offset*100;*/
		
		ClipperLib.JS.ScaleUpPaths(subj, scale);
		var co = new ClipperLib.ClipperOffset(2, 0.25);
		co.AddPaths(subj, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);

		co.Execute(solution, offset); 
		ClipperLib.JS.ScaleDownPaths(solution, scale); 

		if(solution.length == 0){
			console.log("No solution found; Item cannot be offseted. Returning original shape.");
			return in_surface;
		}
		else{
			
			var result = convertPathToShape( solution ); 

			// to close the loop for offset
			result.lineTo( result.actions[0].args[0],  result.actions[0].args[1] );

			// convert shape to ShapeGeometry
			result = new THREE.ShapeGeometry(result);

			result.frame = in_surface.getGeometry().frame;

			return new mObj_geom_Surface( result ); //result is a three.js shape			
		}

	};

	/*
	 *	Splits a surface into four
	 */
	mod.srf.segment = function( surface ){

		
		// THREE.ShapeGeometry
		var geom = surface.getGeometry();

		// [ [], [], ...]
		var geomPoints = surface.points;

		// mObj_geom_Vertex
		var centre = MOBIUS.obj.getCentre( surface );

		var midPoints = [];
		for(var m=0; m < geomPoints.length; m++){

			var n = m+1; 

			if(n >= geomPoints.length)
				n=0;

			var pnt =  MOBIUS.pnt.midPoint( geomPoints[m], geomPoints[n] ) ;
			midPoints.push(pnt); 
		}


		var segments = [];
		for(var m=0; m < midPoints.length; m++){

			var n = m+1; 

			if(n >= midPoints.length)
				n=0;

			var shape =  MOBIUS.srf.polygonByPoints( geom.frame, [midPoints[m], geomPoints[n], midPoints[n], centre], [] ) ;
			segments.push(shape); 
		}

		return segments;
	}


	mod.srf.area = function( surface ){

		if(surface instanceof mObj_geom_Surface){

			var geom = surface.getGeometry();  // THREE.ShapeGeometry()

			var shape = convertShapeGeometryToShape(geom); // THREE.Shape()

			function calcPolygonArea(vertices) {
			    var total = 0;

			    for (var i = 0, l = vertices.length; i < l; i++) {
			      var addX = vertices[i].x;
			      var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
			      var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
			      var subY = vertices[i].y;

			      total += (addX * addY * 0.5);
			      total -= (subX * subY * 0.5);
			    }

			    return Math.abs(total);
			}


			return calcPolygonArea( shape.makeGeometry().vertices );

		}else{
			console.log("Passed argument not a surface. Area cannot be computed.");
			return 0;
		}


	}

	//
	//
	// Curves
	//
	//
	/** @namespace */
	mod.crv = {};


	/**
	 * Creates a line
	 * @param {frame object} frame - Local coordinate system
	 * @param {point / vertex} startPoint - Starting point
	 * @param {point / vertex} endPoint - Ending point
	 * @returns {curve object}  - NURBS Line Curve
	 * @memberof crv
	 */
	 // TODO: 
    mod.crv.line = function(frame, startPoint, endPoint){

        if( startPoint.getGeometry != undefined )
            startPoint = startPoint.getGeometry();
        if( endPoint.getGeometry != undefined )
            endPoint = endPoint.getGeometry();

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( startPoint[0], startPoint[1], startPoint[2] ),
            new THREE.Vector3( endPoint[0], endPoint[1], endPoint[2] )
        );

        var crv = new THREE.Line( geometry );

        return new mObj_geom_Curve( crv );

    };

	/**
	 * Divides a curve into multiple segments and gives the corresponding t-parameter on the curve
	 * @param {curve object} curve - Curve Object to be divided
	 * @param {int} numPoints - Number of divisions required
	 * @returns {array}  - List of t-parameters at the division points
	 * @memberof crv
	 */
	 //TODO: is this possible? in three.js?
	mod.crv.divideByNumber = function(curve, numPoints){

		// to check for compound and take in only the first elemetn of the array
		if(surface instanceof mObj_geom_Compound)
			surface = surface.getGeometry()[0];

		var tList = [];
		var incr = 1/(numPoints-1)
		for(var t=0; t<numPoints; t++){
			tList.push((t*incr).toFixed(1));
		}

		return tList; 

	};

	/**
	 * Returns a list of points on the curve, corresponding the list of t-parameters specified
	 * @param {curve object} curve - Curve Object 
	 * @param {array} tList - Array of t-parameters 
	 * @returns {array}  - List of vertex objects on the curve 
	 * @memberof crv
	 */
	mod.crv.getPoints = function(curve, tList){

		// to check for compound and take in only the first elemetn of the array
		if(surface instanceof mObj_geom_Compound)
			surface = surface.getGeometry()[0];		
		
		var curve = curve.getGeometry();		

		if(tList.constructor.name == "Array"){

			var points = tList.map( function( t ){
				return new mObj_geom_Vertex( curve.point( t ) );
			})
			
			return points;
		}
		else
			return new mObj_geom_Vertex( curve.point( tList ) );
	
	};

	
	/**
	 * Returns the length of the curve
	 * @param {curve object} curve - Curve Object 
	 * @returns {float}  - Length of the curve
	 * @memberof crv
	 */
	mod.crv.length = function( curve ){
		return curve.getGeometry().length();
	};

	//
	//
	// Points
	//
	//
	/** @namespace */
	mod.pnt = {};

	/**
	 * Creates a vertex object with the given point geometry
	 * @param {frame object} frame - Local Coordinate System
	 * @param {float} x - x-position
	 * @param {float} y - y-position
	 * @param {float} z - z-position
	 * @return {vertex object} Vertex object
	 * @memberof pnt
	 */
	mod.pnt.byCoords = function(x, y, z){
		return new mObj_geom_Vertex([x, y, z]);
	}

	/**
	 * Returns the mid-point between two points
	 * @param {point / vertex object} point1 - [x, y , z] or Vertex
	 * @param {point / vertex object} point2 - [x, y , z] or Vertex
	 * @returns {point} Mid Point of line between the two given points 
	 * @memberof pnt
	 */
	mod.pnt.midPoint = function(point1, point2){

		if( point1.getGeometry != undefined )
			point1 = point1.getGeometry();
		if( point2.getGeometry != undefined )
			point2 = point2.getGeometry();

		return [ (point1[0] + point2[0])/2, (point1[1] + point2[1])/2, (point1[2] + point2[2])/2 ];
	};	


	/**
	 * Returns the distance between two points or vertices
	 * @param {point / vertex object} point1 - [x, y , z] or Vertex
	 * @param {point / vertex object} point2 - [x, y , z] or Vertex
	 * @returns {float} Distance 
	 * @memberof pnt
	 */
	mod.pnt.distance = function(point1, point2){

		if( point1.getGeometry != undefined )
			point1 = point1.getGeometry();
		if( point2.getGeometry != undefined )
			point2 = point2.getGeometry();
				 
		var deltaX, deltaY, deltaZ;

		deltaX = point1[0] - point2[0];
		deltaY = point1[1] - point2[1];
		deltaZ = point1[2] - point2[2];

		var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
		return distance;
	};

	//
	//
	//	Vector functions
	//
	//
	/** @namespace */
	mod.vec= {};

	/**
	 * Returns a vector with magnitude x, y, z along the x, y, z axes
	 * @param {float} x - Magnitude along x-direction
	 * @param {float} y - Magnitude along y-direction
	 * @param {float} z - Magnitude along z-direction
	 * @returns {array} Vector 
	 * @memberof vec
	 */
	mod.vec.byCoords = function(x, y, z){
		return [x, y, z];
	};

	/**
	 * Computes angle between two vectors
	 * @param {array} vector1  - Vector 1 in [x, y, z] format
	 * @param {array} vector2  - Vector 2 in [x, y, z] format
	 * @returns {float} radians
	 * @memberof vec
	 */
	mod.vec.angle = function(vector1, vector2){
		var dotP = MOBIUS.mtx.dot( vector1,  vector2 ); 
		var cos_t = dotP / (MOBIUS.vec.length( vector1 ) * MOBIUS.vec.length( vector2 ) );
		return Math.cosh(cos_t);
	};	

	/**
	 * Computes the summation of two vectors
	 * @param {array} vector1  - Vector 1 in [x, y, z] format
	 * @param {array} vector2  - Vector 2 in [x, y, z] format
	 * @returns {array} vector
	 * @memberof vec
	 */
	mod.vec.add = function( vector1, vector2 ){
		return verb.core.Vec.add( vector1, vector2 );
	};

	/**
	 * Computes the subtraction of two vectors
	 * @param {array} vector1  - Vector 1 in [x, y, z] format
	 * @param {array} vector2  - Vector 2 in [x, y, z] format
	 * @returns {array} vector
	 * @memberof vec
	 */
	mod.vec.subtract = function( vector1, vector2 ){
		return verb.core.Vec.sub( vector1, vector2 )
	};

	/**
	 * Computes length of the vector
	 * @param {array} vector  - Vector in [x, y, z] format
	 * @returns {float} length
	 * @memberof vec
	 */
	mod.vec.length = function(vector){
		return Math.sqrt( vector[0]*vector[0] + vector[1]*vector[1] + vector[2]*vector[2] );
	};

	/**
	 * Resets the length of the given vector
	 * @param {array} vector  - Vector in [x, y, z] format 
	 * @param {float} length - New length of the vector
	 * @returns {array} Vector 
	 * @memberof vec
	 */
	mod.vec.resize = function(vector, length){

		var unitV = verb.core.Vec.normalized( vector );
		return [ length*unitV[0], length*unitV[1], length*unitV[2] ] ;
	};


	/**
	 * Scales the given vector
	 * @param {array} vector  - Vector in [x, y, z] format 
	 * @param {float} factor - Scaling factor of the vector
	 * @returns {array} Vector 
	 * @memberof vec
	 */
	mod.vec.scale = function(vector, factor){

		return [ factor*vector[0], factor*vector[1], factor*vector[2] ] ;
	}


	/**
	 * Computes unit vector
	 * @param {array} vector  - Vector in [x, y, z] format
	 * @returns {array} Unit Vector
	 * @memberof vec
	 */
	mod.vec.normalize = function(vector){
		return verb.core.Vec.normalized( vector );
	}


	// TODO: module? compound??
	mod.mod = {};

	/*  mObj_geom_Compound should never have a compound inside it - that's just complicated!
		array_of_elements can consist of various cases - 
		1. Combination of simple mObj_geoms 
		2. Combinations with mObj_geom_Compound
	*/
	mod.mod.makeModel = function(array_of_elements){

		// mObj_geom_Compound is always a container for other geometric datastructuresf

		// flatten model 
/*		array_of_elements = array_of_elements.map(function(mObj){

			// convert compound into array of mObj elements
			if(mObj instanceof mObj_geom_Compound)
				return mObj.getGeometry();
			else
				return mObj;
		
		})
		array_of_elements = array_of_elements.flatten();*/


		return new mObj_geom_Compound( array_of_elements );
	};

	mod.mod.unpackModel = function(model){

		if( model instanceof mObj_geom_Compound ){


			return model.getGeometry();
		}
		else{
			console.log("Non-model passed to unpackModel function");
			return;
		}
	};


	//
	//
	//	Objects
	//
	//
	/** @namespace */
	mod.obj = {};

	/**
	 * Creates a copy of the object with the same geometry, transformations, material and data at the same location
	 * @param {any object} mObj - Object to be cloned
	 * @returns {object} Cloned object
	 * @memberof obj
	 */
	mod.obj.copy = function( object ){

		if( object.getGeometry == undefined ){
			console.log("Module: getGeometry is not defined for the object passed to Mobius Copy Function");
			return object;
		}

		// Alert : changes ShapeGeometry into Geometry
		var getCopy = function(obj){

			if(obj instanceof THREE.ShapeGeometry){

				// frame exists at geometry level
				var newobj = obj.clone();
				newobj.frame = object.getGeometry().frame;
				return newobj; 
			}
			else if(obj instanceof THREE.Geometry){

				var obj = obj.clone();
				obj.frame = object.getGeometry().frame;
				return obj;
			}
/*			else if(obj instanceof Array){
				var newarr = [];
				for(var i=0; i < obj.length; i++){

					var org = obj[i];

					var copyObj;
					if(org instanceof mObj_geom_Compound)
						return obj; // TODO
					else
						copyObj = MOBIUS.obj.copy(org);

					newarr.push(copyObj);

				}

				return newarr; 
			}*/
			else
				return obj;
		}


		// fix: make this into one line code with 'eval'
		var newcopy;
		if(object instanceof mObj_geom_Vertex)
			newcopy = new mObj_geom_Vertex( getCopy(object.getGeometry()) );
		else if(object instanceof mObj_geom_Curve)
			newcopy = new mObj_geom_Curve( getCopy(object.getGeometry()) );
		else if(object instanceof mObj_geom_Surface)
			newcopy = new mObj_geom_Surface( getCopy(object.getGeometry()) );
		else if(object instanceof mObj_geom_Solid){
			newcopy = new mObj_geom_Solid( getCopy(object.getGeometry()) );
		}
		else if(object instanceof mObj_geom_Compound){

			var newarr = [];
			var geom_array = object.getGeometry();  // this is an array
			
			for(var i=0; i<geom_array.length; i++){
				var geom = geom_array[i];
				if(geom instanceof mObj_geom_Surface)
					newarr.push( MOBIUS.obj.copy(geom) );
				else
					newarr.push(geom);
			}


			newcopy = new mObj_geom_Compound( newarr );


		}

		newcopy.setData( Object.assign({}, object.getData() ) ); 
		newcopy.setMaterial( object.getMaterial() );	

		return newcopy;
		
	};

	/**
	 * Adds material to an object
	 * @param {object} obj - Object to which material is to be added
	 * @param {String} material_type - "MeshBasicMaterial", "MeshNormalMaterial", "MeshLambertMaterial", "LineBasicMaterial" etc... 
	 * @param {boolean} wireframe - 'True' if wireframe is required. 
	 * @param {hexCode} color - Hex Code of the color
	 * @param {boolean} transparent - 'True' if transparency is required. 
	 * @returns null
	 * @memberof obj
	 */
	mod.obj.addMaterial = function(obj, material_type, wireframe, color_hex, transparent){
		var option = {	
			wireframe: wireframe,
			color: color_hex,
			transparent: transparent,
			side: THREE.DoubleSide
		};
		var material = new THREE[material_type](option);

        obj.setHex(color_hex)
		 //obj.setMaterial(material);
		//return obj;
	};

	mod.obj.addMaterial.prototype.return  = false;

	/**
	 * Adds data to an object
	 * @param {object} obj - Object to which data is to be added
	 * @param {String} dataName - Name of the property
	 * @param {String / int / object ... } dataValue - Value of the property
	 * @returns null
	 * @memberof obj
	 */
	mod.obj.addData = function(obj, dataName, dataValue){

		if(obj.getData == undefined){
			obj[dataName] == dataValue;
			return;			
		}

		// decide on topology heirarchy also - if edge gets a property, do the vertices also get the same property?
		if(obj.constructor === Array){
			for(var i=0; i<obj.length; i++){
				if(obj[i].getData() == undefined)
					var new_data = {};
					new_data[dataName] = dataValue;
					obj[i].setData( new_data );
			}
		} else{
			var new_data = obj.getData();
			if(new_data == undefined)
				new_data = {};
			new_data[dataName] = dataValue;
			obj.setData( new_data );
		}

	};

	mod.obj.addData.prototype.return = false;
	/*
	 *	Add Data Object to the Mobius Object
	 *  Data Value is a Javascript object
	 */
	mod.obj.addPropertySet = function(obj, dataValue){

		// decide on topology heirarchy also - if edge gets a property, do the vertices also get the same property?
		if(obj.constructor === Array){
			for(var i=0; i<obj.length; i++){
				
				// recursion
				MOBIUS.obj.addPropertySet(obj[i], dataValue);
			}
		} else{
			
			var new_data = obj.getData();

			if(new_data == undefined)
				new_data = {};

			for (var propName in dataValue) {
			  
				if (dataValue.hasOwnProperty(propName)) {
				    	new_data[propName] = dataValue[propName];
						obj.setData( new_data );  //TODO: Check if new_data might be a reference; This is not required if it is.
				}
			
			}


		}

	};

	mod.obj.addPropertySet.prototype.return = false;


	/*
	 *	Add Data Object to the Mobius Object
	 *  Data Value is a Javascript object
	 */
	mod.obj.getProperty = function(obj, propertyName){


		if(obj.is_mObj){
			return obj.getData()[propertyName];
		}
		else{
			if(obj[propertyName] != undefined)
				return obj[propertyName];
			else
				return "--";
		}
	};


	/**
	 * Returns the centre of a NURBS Curve, NURBS Surface or Solid Geometry
	 * @param {object} object - Mobius object
	 * @returns {array} Point - [x, y, z]
	 * @memberof obj
	 */
	mod.obj.getCentre = function(object){

		var geometry = object.getGeometry();
		if(geometry instanceof THREE.Geometry){

			// careful with this - stupid bug in three.js or updateVertices thingy after applyMatrix
			// geom.center() has some issue - probably needs to be alerted after applyMatrix update; 
			//var c = geom.center();
			// manually compute center 

			var c = new THREE.Vector3(0,0,0);
			for ( var i = 0; i < geometry.vertices.length; i ++ ) {

			    c.x += geometry.vertices[ i ].x;
			    c.y += geometry.vertices[ i ].y;
			    c.z += geometry.vertices[ i ].z;

			} 

			c.divideScalar( geometry.vertices.length );

			if ( c != undefined)
				return new mObj_geom_Vertex( [ c.x, c.y, c.z ] );
			else
				return;
		}
		else{
			console.log("Centre case not handled. Refer to module. ")
			return; 
		}
	};


	//
	//
	//	Transformation functions
	//
	//
	/** @namespace */
	mod.trn = {};

	// !! Works
	/**
	 * Reflects the object about the XY plane of the frame
	 * @param {object} object - Object to be reflected
	 * @param {frame object} frame - Local coordinate system
	 * @param {boolean} copy - Determines if the object is to be copied before transformation
	 * @returns {object} - Transformed Object or Copy 
	 * @memberof trn
	 */
	mod.trn.reflect = function(object, frame, copy){

		

		/*
		 * Use recursion to deal with arrays
		 */
		if (object instanceof Array){

			var newobject = [];
			
			for(var obj=0; obj < object.length; obj++)
				newobject.push(MOBIUS.trn.reflect( object[obj], frame, copy ));	
			
			return newobject;
		}

		/*
		 * If to be copied, copy the object and make operations on the copy
		 */
		if( copy )
			object = MOBIUS.obj.copy( object );

		/*
		 * Final processing
		 */
		var geom; 
		if(object.getGeometry != undefined)
			geom = object.getGeometry();  // THREE.Geometry or THREE.Shape

		if(geom instanceof THREE.Shape){
			console.log("Error Case!");
			geom = new THREE.ShapeGeometry(geom);   // This gives a THREE.ShapeGeometry;
		}

		var trnMat = [ [ 1, 0, 0, 0],
						[ 0, 1, 0, 0],
							[ 0, 0, -1, 0],
								[0, 0, 0, 1]
					];


		geom.applyMatrix( getThreeMatrix(frame.toGlobal()) ); 
		geom.applyMatrix( getThreeMatrix(trnMat) );  
		geom.applyMatrix( getThreeMatrix(frame.toLocal()) );

		object.setGeometry( geom );   // geom is a THREE.Geometry / THREE.ShapeGeometry
		object.setTopology(undefined);

		return object;
	
	};


	/**
	 * Rotates the object about the axes of the frame. 
	 * @param {object} object - Object to be rotated
	 * @param {frame object} frame - Local coordinate system
	 * @param {float} angleX - Angle to be rotated about x-Axis of the frame, in degrees
	 * @param {float} angleY - Angle to be rotated about y-Axis of the frame, in degrees
	 * @param {float} angleZ - Angle to be rotated about z-Axis of the frame, in degrees
	 * @param {boolean} copy - Determines if the object is to be copied before transformation
	 * @returns {object} - Transformed Object or Copy 
	 * @memberof trn
	 */
	mod.trn.rotate = function(object, frame, angleX, angleY, angleZ, copy){

		if (object instanceof Array){

			var newobject = [];
			
			for(var obj=0; obj < object.length; obj++)
				newobject.push(MOBIUS.trn.rotate( object[obj], frame, angleX, angleY, angleZ, copy ));	
			
			return newobject;
		}

		if( copy )
			object = MOBIUS.obj.copy( object );
		

		var geom; 
		if(object.getGeometry != undefined)
			geom = object.getGeometry();

		if(geom instanceof THREE.Shape)
			geom = new THREE.ShapeGeometry(geom);   // This gives a THREE.ShapeGeometry;

		function getRotationMatrix( axis, angle){
				angle = 0.0174533*angle;
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
		

		geom.applyMatrix( getThreeMatrix(frame.toGlobal()) );

		geom.applyMatrix( getThreeMatrix(getRotationMatrix([0,0,1], angleZ)) );
		geom.applyMatrix( getThreeMatrix(getRotationMatrix([0,1,0], angleY)) );
		geom.applyMatrix( getThreeMatrix(getRotationMatrix([1,0,0], angleX)) );
				
		geom.applyMatrix( frame.toLocal() );
		
		object.setGeometry( geom ); 

		return object;
	
	};


	// !!! Works
	/**
	 * Scales the object along different axes
	 * @param {object} object - Object to be scaled
	 * @param {frame object} frame - Local coordinate system
	 * @param {float} scaleX - Scaling factor along x-Axis of the frame
	 * @param {float} scaleY - Scaling factor along y-Axis of the frame
	 * @param {float} scaleZ - Scaling factor along z-Axis of the frame
	 * @param {boolean} copy - Determines if the object is to be copied before transformation
	 * @returns {object} - Transformed Object or Copy 
	 * @memberof trn
	 */
	mod.trn.scale = function(object, frame, scaleX, scaleY, scaleZ, copy) {

		if (object instanceof Array){

			var newobject = [];
			
			for(var obj=0; obj < object.length; obj++)
				newobject.push(MOBIUS.trn.scale(object[obj], frame, scaleX, scaleY, scaleZ, copy));	
			
			return newobject;
		}

		if( copy )
			object = MOBIUS.obj.copy( object );

		var geom; 
		if(object.getGeometry != undefined)
			geom = object.getGeometry();

		var trnMat = [ [ scaleX, 0, 0, 0 ],
						[ 0, scaleY, 0, 0],
							[ 0, 0, scaleZ, 0 ],
								[ 0, 0, 0, 1 ]
					];
			
		geom.applyMatrix( getThreeMatrix(frame.toGlobal()) );
		geom.applyMatrix( getThreeMatrix(trnMat) );
		geom.applyMatrix( getThreeMatrix(frame.toLocal()) );

/*		geom.vertices.map(function(v){
			if( isNaN(v.x) || isNaN(v.x) || isNaN(v.x) )
				console.log("Problem in scaling : check : ", geom);
		})*/

		return object;			

	};

	// !! Works
	/**
	 * Shifts the object relative to its current position
	 * @param {object} object - Object to be shifted
	 * @param {frame object} frame - Local coordinate system
	 * @param {float} shiftX - Distance to be moved along x-Axis of the frame
	 * @param {float} shiftY - Distance to be moved along y-Axis of the frame
	 * @param {float} shiftZ - Distance to be moved along z-Axis of the frame
	 * @param {boolean} copy - Determines if the object is to be copied before transformation
	 * @returns {object} - Transformed Object or Copy 
	 * @memberof trn
	 */
	mod.trn.shift = function(object, frame, shiftX, shiftY, shiftZ, copy){

		if( copy )
			object = MOBIUS.obj.copy( object );

		if (object instanceof Array){

			var newobject = [];
			
			for(var obj=0; obj < object.length; obj++)
				newobject.push(MOBIUS.trn.shift( object[obj], frame, shiftX, shiftY, shiftZ, copy ));	
			
			return newobject;
		}
		
		var geom; 
		if(object.getGeometry != undefined)
			geom = object.getGeometry();

		var trnMat = [ [ 1, 0, 0, shiftX ], 
							[ 0, 1, 0, shiftY ], 
								[ 0, 0, 1, shiftZ ], 
									[ 0, 0, 0, 1 ]
					 	] 

		geom.applyMatrix( getThreeMatrix(frame.toGlobal()) );
	    geom.applyMatrix( getThreeMatrix(trnMat ) );
		geom.applyMatrix( getThreeMatrix(frame.toLocal()) );
		
		object.setGeometry(geom);

		return object;
		
	};


	/**
	 * Moves the centre of the object to a target point
	 * @param {object} object - Object to be shifted
	 * @param {point / vertex } point - Point to which the object is to be moved
	 * @param {boolean} copy - Determines if the object is to be copied before transformation
	 * @returns {object} - Transformed Object or Copy 
	 * @memberof trn
	 */
	mod.trn.move = function(object, point, copy){

		// orCenter is always an mObj_geom_Vertex
		var orCenter = MOBIUS.obj.getCentre(object); 
			

		// takes care of both cases - an array point being passed or a mobius vertex object
		var tx = (point.x || point[0]) - orCenter.x;
		var ty = (point.y || point[1]) - orCenter.y;
		var tz = (point.z || point[2]) - orCenter.z; 

		if( isNaN(tx) )
			tx = 0;
		if( isNaN(ty) )
			ty = 0;
		if( isNaN(tz) )
			tz = 0;

		return MOBIUS.trn.shift(object, GLOBAL, tx, ty, tz, copy);
		
	};


	//
	//
	// Matrix operations
	//
	//
	/** @namespace */
	mod.mtx = {};

	/**
	 * Computes dot product of two matrices
	 * @param {array} matrix1  - Matrix 1
	 * @param {array} matrix2  - Matrix 2
	 * @returns {float} 
	 * @memberof mtx
	 */
	mod.mtx.dot = function( matrix1, matrix2 ){

		return verb.core.Vec.dot(matrix1, matrix2);
	};

	/**
	 * Computes cross product of two matrices
	 * @param {array} matrix1  - Matrix 1
	 * @param {array} matrix2  - Matrix 2
	 * @returns {array} 
	 * @memberof mtx
	 */
	mod.mtx.cross = function( matrix1, matrix2 ){
		return verb.core.Vec.cross(matrix1, matrix2);
	};

	//
	//
	// Lists
	//
	//
	/** @namespace */
	mod.lst = {};


	/**
	 * Returns the length of the list 
	 * @param {array} list - List which is to be analyzed
	 * @returns {int} 
	 * @memberof lst
	 */
	mod.lst.length = function(list){
		return list.length
	};

	/**
	 * Finds the index of the first occurence of an array element. 
	 * @param {array} list  - List in which an element needs to be searched
	 * @param {array element} object - Element to be searched for
	 * @returns {int} Returns -1 if the element doesn't exist in array; else returns the index of the item
	 * @memberof lst
	 */
	mod.lst.find = function(list, item){
		return list.indexOf( item );
	};

	/**
	 * Appends the item as it is to a list
	 * @param {array} list  - List in which item is to be added
	 * @param {array / element} itemOrList - List or single element to be added to the list
	 * @returns {NULL} 
	 * @memberof lst
	 */
	mod.lst.append = function(list, itemOrList){
		list.push(itemOrList);
	};

	mod.lst.append.prototype.return = false;

	/**
	 * Inserts an item at a given index in a list
	 * @param {array} list  - List in which an element needs to be inserted
	 * @param {object} item - Element to be inserted
	 * @returns {NULL}
	 * @memberof lst
	 */
	mod.lst.insert = function(list, item, index){

		var newlist = [];
		for(var i=0; i<=list.length; i++){
			
			if(i < index)
				newlist.push(list[i]);
			else if(i == index)
				newlist.push(item);
			else
				newlist.push(list[i-1]);
		}
			
	};


	mod.lst.insert.prototype.return = false;

	/**
	 * Adds the elements of one list to another list
	 * @param {array} list  - List in which an elements need to be added
	 * @param {array} extension_list - List of elements to be added
	 * @returns {NULL}
	 * @memberof lst
	 */
	mod.lst.extend = function(list, extension_list){
		
		extension_list.map( function(t){
			list.push(t);
		});

	};

	mod.lst.extend.prototype.return = false;

	/**
	 * Removes an array element from a list by its index number
	 * @param {array} list  - List in which an element needs to be removed
	 * @param {int} index - Index to be removed
	 * @returns {null} 
	 * @memberof lst
	 */
	mod.lst.remove = function(list, index) {
		list.splice(index, 1);
	};

	mod.lst.remove.prototype.return = false;


	/**
	 * Returns a number sequence in the form of an array
	 * @param {float or int} start  - Starting value of the sequence
	 * @param {float or int} end  - Ending value of the sequence (not included in the sequence)
	 * @param {float or int} stepSize  - Increment or Decrement value to get to the 'end' value from the 'start' value
	 * @returns {array} 
	 * @memberof lst
	 */
	mod.lst.sequence = function(start, end, stepSize){

		var arr = [];
		if( start == end ){
			arr.push(start);
		}
		else if(start > end && stepSize < 0){
			for(var i = start; i > end; i = i + stepSize)
				arr.push(i);
		} 
		else{
			for(var i = start; i < end; i = i + stepSize)
				arr.push(i);
		}

		return arr;
	};

	//
	//
	// Numeric lists
	//
	//

	/**
	 * Gets the average of a numeric array
	 * @param {array} numericList - List which is to be averaged
	 * @returns {float / int} Average of the numbers in the list
	 * @memberof lst
	 */
	mod.lst.average = function(numericList){
		return MOBIUS.lst.sum( numericList )/ numericList.length;
	};


	/**
	 * Gets the minimum value in a numeric list
	 * @param {array} numericList - List from which minimum value is required
	 * @returns {float / int} Minimum value
	 * @memberof lst
	 */
	mod.lst.min = function(numericList){
		
		var minValue = numericList[0];
		
		for(var i=0; i<numericList.length; i++)
			minValue = Math.min(minValue, numericList[i]);
		
		return minValue;
	
	};

	/**
	 * Gets the maximum value in a numeric array
	 * @param {array} numericList - List from which maximum value is required
	 * @returns {float / int} Maximum value
	 * @memberof lst
	 */
	mod.lst.max = function(numericList){
		
		var maxValue = numericList[0];
		
		for(var i=0; i<numericList.length; i++)
			maxValue = Math.max(maxValue, numericList[i]);
		
		return maxValue;
	
	};


	/**
	 * Gets the sum of a numeric array
	 * @param {array} numericList - List which is to be summed
	 * @returns {float / int} Sum of the numbers in the list
	 * @memberof lst
	 */
	mod.lst.sum = function( numericList ){
		
		var sum = 0;
		
		for(var i=0; i<numericList.length; i++)
			sum += numericList[i];
		
		return sum;
	
	};

	/**
	 * Returns the span of the list - the difference between the maximum and the minimum value in the list
	 * @param {array} numericList - List which is to be analyzed
	 * @returns {float / int} Span
	 * @memberof lst
	 */
	mod.lst.range = function( numericList ){
		
		return MOBIUS.lst.max( numericList ) - MOBIUS.lst.min( numericList );
	
	};


	//
	//
	// Misc functions
	//
	//
	/** @namespace */
	mod.msc = {};

	mod.msc.saveFile = function( json, type){
		
		if(type == 'geojson'){

			if(json == undefined)
				json = {name: 'Bob', occupation: 'Plumber'}

			var data = JSON.stringify(json);
			var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
			window.open(url, '_blank');
			window.focus();			
		}

	}


	/**
	 * Converts degrees into radians
	 * @param {float} degree - Degrees to be converted
	 * @returns {float} Value in Radians
	 * @memberof msc
	 */
	mod.msc.degToRad = function(degree){
		return 0.0174533*degree;
	};

	/**
	 * Converts radians into degrees
	 * @param {float} radians - Radians to be converted
	 * @returns {float} Value in Degrees
	 * @memberof msc
	 */
	mod.msc.radToDeg = function(radians){
		return 57.29*radians;
	};	

	/**
	 * Returns the sine value of an angle
	 * @param {float} angle - Angle in degrees
	 * @returns {float} Sine value
	 * @memberof msc
	 */
	mod.msc.sin = function( angle ){
		return Math.sin( 0.0174533*angle )
	}

	/**
	 * Returns the cos value of an angle
	 * @param {float} angle - Angle in degrees
	 * @returns {float} Sine value
	 * @memberof msc
	 */
	mod.msc.cos = function( angle ){
		return Math.cos( 0.0174533*angle )
	}

	/**
	 * Returns value of a number upto significant digits
	 * @param {float} number  - Number
	 * @param {int} digits  - Number of significant digits needed
	 * @returns {float} 
	 * @memberof msc
	 */
	mod.msc.sigDig = function(number, digits){
		return number.toFixed(digits);
	};

	/**
	 * Prints to console
	 * @param {string} content - Message to be printed on the console
	 * @returns {null}
	 * @memberof msc
	 */
	mod.msc.print = function(content){
		// try to find MOBIUS web app, if found print in MOBIUS console

		this.content = content;

		try{
			var logString = "<div style='color: green;'>" + this.content + '</div>';
			document.getElementById('log').innerHTML += logString;
		}catch(err){
			console.log('warnning: MOBIUS web app not connected.');
		}
	};

	return mod;

})(MOBIUS_MODULES[MODULE_NAME] || {});


/*
 *
 * Bridging Functions for all libraries used in Module - for geometry and topology
 *
 */

//
//	Functions forming bridge between data structure, topology and modules
//	Dependent on the modules being used for geometry and topology
//

/*
 *	Function to convert module geometry into three.js Mesh geometry
 * 	Add another if-else condition for each new geometry
 * 	It is not a good idea to over-ride the .extractThreeGeometry functions in the module because there might be multiple modules loaded simulataneously
 * 	It is better that the datastructure asks the module to convert. 
 */
var convertGeomToThree = function( geom ){

	// internal function
	var convertToThree = function(singleDataObject){

		// normal three.js objects - for lines and curves
		if( singleDataObject instanceof THREE.Mesh || singleDataObject instanceof THREE.Line || singleDataObject instanceof THREE.Group || singleDataObject instanceof THREE.Object3D ){
			
			// to get lines in the mesh of the obj import
			// if(singleDataObject instanceof THREE.Group){
			// 	console.log("before edges" , singleDataObject);
			// 	var alledges = [];
			// 	for(var i=0; i<singleDataObject.children.length; i++){
			// 		var edges = new THREE.EdgesHelper( singleDataObject.children[i], "black");
			// 		edges.material.linewidth = 2;
			// 		alledges.push(edges);
			// 	}
			// 	for(var e=0; e<alledges.length; e++)
			// 		singleDataObject.add(new THREE.LineSegments(alledges[e].geometry,
			// 												 new THREE.LineBasicMaterial({
			// 												        side: THREE.DoubleSide,
			// 												        linewidth: 2,
			// 												        color: 0x000000
			// 												    })
			// 												 ));
            //
			// 	console.log("after edges", singleDataObject);
			// }
			return singleDataObject;

		}
		// three.js shapes may also be used for creating surfaces
		else if( singleDataObject instanceof THREE.Shape ){

			console.log("Shape received for conversion to Three. Error Case. ");
			//
			//	Changes shape according to frame
			//
/*			var m = new THREE.Matrix4();
			var arr = [];
			var frame = singleDataObject.frame.toLocal();
			for(var i=0; i<4; i++){
				for(var j=0; j<4; j++)
					arr.push(frame[j][i]);
			}
			m.fromArray(arr);
			var shapeGeom = new THREE.ShapeGeometry(singleDataObject);
			shapeGeom.applyMatrix( m );
			return new THREE.Mesh(shapeGeom);*/
		}
		// creating a three.js geometry from scratch - usually for solids
		else if(singleDataObject instanceof THREE.Geometry)
			return new THREE.Mesh( singleDataObject );
		// 
		else if(singleDataObject instanceof Array){
			if(singleDataObject[0] instanceof THREE.Mesh)
				return singleDataObject;
			// means it is a point
			var dotGeometry = new THREE.Geometry();
			dotGeometry.vertices.push( new THREE.Vector3(singleDataObject[0], singleDataObject[1], singleDataObject[2]) );
			return new THREE.Points( dotGeometry ); 
		}
		else {
			console.log("Module doesnt recognise either!", singleDataObject);
		}
	}

	var rawResult = convertToThree( geom );
	
	return rawResult;
}

//
// Takes native topology and converts it into three.js format
//
var convertTopoToThree = function( topology ){

	var topo = new THREE.Object3D();
	return topo;

	// convert vertices
	var topoPointMaterial = new THREE.PointsMaterial( { size: 5, sizeAttenuation: false, color:0xCC3333 } );
	var dotGeometry = new THREE.Geometry(); 
	for(var v = 0; v < topology.vertices.length; v++){
		var vertice = topology.vertices[v];
		dotGeometry.vertices.push( new THREE.Vector3( vertice.x, vertice.y, vertice.z) ); 
	}
	var allVertices = new THREE.Points( dotGeometry, topoPointMaterial ); 
	topo.add(allVertices);

 	
	// convert edges
	var topoEdgeMaterial = new THREE.LineBasicMaterial({
							    side: THREE.DoubleSide,
							    linewidth: 100,
							    color: 0x000000
							    });
	for(var e = 0; e < topology.edges.length; e++){ 
		var edge = topology.edges[e]; 
		if(edge instanceof THREE.Object3D)
			topo.add(edge);
		else
			topo.add(edge.extractThreeGeometry());

	} 

	// convert faces
	var topoSurfaceMaterial = new THREE.MeshLambertMaterial( {
									    side: THREE.DoubleSide,
									    wireframe: false,
									    transparent: false,
									    color: 0x6666FF
									    } );

	for(var f = 0; f < topology.faces.length; f++){
		var face = convertGeomToThree(topology.faces[f].getGeometry());
		
		face.material = topoSurfaceMaterial;
		if(face.geometry.vertices!=undefined && face.geometry.faces!=undefined){

			var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

			topo.add(face);
		}
			
	} 


	return topo;
}

//
//	Takes native geometry ( geometry from module ) and converts it into mobius topology - edges, faces, vertices
//
// if mObj is a solid - it gets an array of faces
var computeTopology = function( mObj ){


	var topology = {"points": [], "vertices":[], "edges":[], "wires":[], "faces":[], "objects":[]};

	if(mObj instanceof mObj_geom_Compound){

		var geom_array = mObj.getGeometry();  // array of geometric elements

		for(var objCount = 0; objCount < geom_array.length; objCount++){

			var geom =  geom_array[objCount];
			MOBIUS.obj.addData( geom, "belongsTo", [objCount] )
			topology.objects.push( geom );
	
		}
	}

	if(mObj instanceof mObj_geom_Solid){

		var geom = mObj.getGeometry(); // THREE.Geometry

		topology.faces = [ [0], [1], [2], [3], [4], [5] ];

		topology.points = geom.vertices.map( function(v){

			return [v.x, v.y, v.z];
		
		})

	}

	if(mObj instanceof mObj_geom_Surface){

		MOBIUS.obj.addData( mObj, "belongsTo", [0, null] )	
		topology.objects = [ ];	
		topology.faces = [ mObj ] ;

		topology.points = mObj.getGeometry().vertices.map( function(v){

			return [v.x, v.y, v.z];
		
		})

	}
	
	//console.log("Topology:", topology);
	return topology;
}

var getThreeMatrix = function(DS_Matrix){

	//console.log("Matrix", DS_Matrix);

	var m = new THREE.Matrix4();
	var arr = [];
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++)
			arr.push(DS_Matrix[j][i]);
	}
	m.fromArray(arr);

	//console.log("Matrix", m);

	return m;
}

var getDSMatrix = function(three_matrix){

	console.log("Matrix", m);

	var m = new THREE.Matrix4();
	var arr = [];
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++)
			arr.push(DS_Matrix[j][i]);
	}
	m.fromArray(arr);

	console.log("Matrix", m);
	
	return m;
}

Array.prototype.flatten = function() {
    var ret = [];
    for(var i = 0; i < this.length; i++) {
        if(Array.isArray(this[i])) {
            ret = ret.concat(this[i].flatten());
        } else {
            ret.push(this[i]);
        }
    }
    return ret;
};



var convertShapeGeometryToShape = function(shapeGeom){


	// iterate through vertices and check if the any of the vertices are 3D - if yes, there is a problem. 
	// alert and exit

	// convert the shapeGeom into GLOBAL first
	// all shapeGeom originates from THREE.Shape - meaning, in GLOBAL reference, they have to be 2D

	var vertices = shapeGeom.vertices; 
	var points = []; 

	vertices.map(	function(v){
		
		if(v.z != 0){
			//console.log("Error! ShapeGeometry is 3D and cannot be converted into a 2D Shape", vertices);
		}
		//else{
			//console.log("Shape processed successfully from ShapeGeometry.")
			points.push( new THREE.Vector2(v.x, v.y) );
		//}

	});

	return new THREE.Shape(points);

} 

var GLOBAL = MOBIUS_MODULES[MODULE_NAME].frm.byXYAxes( [0,0,0], [1,0,0], [0,1,0] );
MOBIUS_MODULES[MODULE_NAME]._FN = {};
MOBIUS_MODULES[MODULE_NAME]._FN.convertGeomToThree = convertGeomToThree;
MOBIUS_MODULES[MODULE_NAME]._FN.convertTopoToThree = convertTopoToThree;
MOBIUS_MODULES[MODULE_NAME]._FN.computeTopology = computeTopology;

