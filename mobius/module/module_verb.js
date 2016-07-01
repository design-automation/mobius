/*
 *	Module, for Urban Design 
 */

var MOBIUS = ( function (mod){

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

	//
	//
	//loadGeoJSON
	//getFeatures
	//for feature in Features
	//	getGeometry
	//  ?offset
	//  ?subdivide
	//	extrude
	//	makeComposite
	mod.urb = {};

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

	mod.urb.loadGeoJSON = function( filepath ){

		var request = new XMLHttpRequest();
		request.open('GET', filepath, false);  // `false` makes the request synchronous
		request.send(null);

		if (request.status === 200) {

		   var data = JSON.parse(request.responseText);
		   return new mObj_data( 'geojson', data);
		}

	};

	mod.urb.getProperty = function( dataObject, propertyName ){

		if(dataObject.is_mObj)
			return dataObject.getData()[propertyName];
		else
			return dataObject[propertyName];

	};

	//
	//
	// frame functions
	//
	//
	/** @namespace */
	mod.frm = {}; 
	
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
	mod.sld.byExtrusion = function(frame, surface, xDistance, yDistance, zDistance){

		// extrude path later to extrude along different directions

		// can do it only if surface is a shape

		var extrusionSettings = {
			amount: yDistance, 
			size: 1, height: 1, curveSegments: 3,
			bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
			material: 0, extrudeMaterial: 1
		};

		var exGeom = new THREE.ExtrudeGeometry( surface.getGeometry(), extrusionSettings );

		exGeom.boundingBox = new THREE.Box3();			
		exGeom.boundingSphere = new THREE.Sphere();
		exGeom.morphTargets = [];
		exGeom.morphNormals = [];
		exGeom.skinIndices = [];
		exGeom.skinWeights = [];

		var m = new THREE.Matrix4();
		var arr = [];
		var frameArr = frame.toLocal();
		for(var i=0; i<4; i++){
			for(var j=0; j<4; j++)
				arr.push(frameArr[j][i]);
		}

		m.fromArray(arr)

		exGeom.applyMatrix( m );

		return new mObj_geom_Solid( exGeom );

	};

	/**
	 * Creates a single solid object from a list of surfaces 
	 * @param { array } listOfSurfaces - List of surface objects which form the solid
	 * @returns { solid object }  - Solid object 
	 * @memberof sld
	 */
	mod.sld.bySurfaces = function (listOfSurfaces){

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

		// if vertex is passed
		if(points[0] instanceof mObj_geom_Vertex){
			points = points.map( function( vert ){
				return [vert.x, vert.y, vert.z];
			})
		}

		points = points.map( function(coordinate){
			return new THREE.Vector2(coordinate[0], coordinate[1]);
		});

/*		var holes = holes.map( function(hole){
			return hole.map(function(coordinate){
				return new THREE.Vector2(coordinate[0], coordinate[1]);
			});
		});*/

		var shape = new THREE.Shape( points );
		
/*		for(hole in holes){
			
			punchedHole = new THREE.Path(hole);
			shape.holes.push(punchedHole);		
	
		}*/
		//console.log(shape);

		// check that this shouldn't have curves.length == 0
		shape.frame = frame; 
		return new mObj_geom_Surface( shape ) ;
	};

	mod.srf.offset = function( surface, offset, scale ){

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
		convertShapeToPath = function( shape ){

			var subj = new ClipperLib.Paths();	
			subj[0] = shape.actions.map( function( a ){

						return { "X": a.args[0], "Y": a.args[1] }
			});
			
			return subj;
		}

		var solution = new ClipperLib.Paths();
		//subj is an array
		var subj = convertShapeToPath( surface.getGeometry() ); 
		
		if (scale == undefined)
			scale = 1000;
		ClipperLib.JS.ScaleUpPaths(subj, scale);
		var co = new ClipperLib.ClipperOffset(2, 0.25);
		co.AddPaths(subj, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
		co.Execute(solution, offset); 
		ClipperLib.JS.ScaleDownPaths(solution, scale);

		if(solution.length == 0)
			return null;
		else{
			
			var result = convertPathToShape( solution ); 
			result.frame = surface.getGeometry().frame;

			return new mObj_geom_Surface( result ); //result is a three.js shape			
		}

	};


	/**
	 * Divides the surface into a grid, based number of divisions in the u and v directions and  
	 * returns the uv-Parameters for the corresponding grid points
	 * @param { surface object } surface  - Surface Object for which the uv-Parameters are required
	 * @param { int } uSegments  - Number of divisions required in the u-Direction
	 * @param { int } vSegments  - Number of divisions required in the v-Direction
	 * @returns {2D array}  - List of UV positions [ [ u1, v1 ], [ u2, v2 ], [ u3, v3 ] ...]; Length of list is equal to uSegments*vSegments
	 * @memberof srf	 
	 */
	mod.srf.uvGridByNumber = function(surface, uSegments, vSegments){
		
		var uvList = [];

		var uincr = 1/(uSegments); 
		var vincr = 1/(vSegments); 
		for(var u=0; u<= uSegments; u++){
			for(var v=0; v<= vSegments; v++){
				uvList.push([u*uincr, v*vincr]);
			}
		}

		uvList.push(uSegments); 
		uvList.push(vSegments);

		return uvList;

	};


/*	mod.srf.uvGridByDistance = function(surface, uDistance, vDistance){

	};*/

	/**
	 * Returns the actual points on the surface, given a corresponding list of uv-parameters or a single [u, v] point
	 * @param { surface object } surface  - Surface Object for which the uv-Parameters are required
	 * @param { 2D array / array } uvList  - List of UV positions [ [ u1, v1 ], [ u2, v2 ], [ u3, v3 ] ...] or single [u, v]
	 * @returns {array}  - List of vertex objects
	 * @memberof srf
	 */
	mod.srf.getPoints = function(surface, uvList){
		
		var srf = surface.getGeometry();		

		if(uvList.constructor.name == "Array"){

			var points = uvList.map( function(p){
				return new mobj_geom_Vertex( srf.point( p[0], p[1] ) );
			})
			
			return points;
		}
		else
			return new mobj_geom_Vertex( srf.point( u, v ) );

	};


	/**
	 * Subdivides a surface into a grid of smaller surfaces - a mesh solid
	 * @param {surface object} surface - Surface Object 
	 * @param {int} uvGrid - UV positions with u & v dimensions [ [ u1, v1 ], ... [ un, vn ], uDimension, vDimension ]
	 * @returns {solid object} Solid object  
	 * @memberof srf
	 */
	mod.srf.divide = function(surface, uvGrid){
		
		var srf = surface.getGeometry(); 
		
		var div_surfaces = [];

		var vgrid = uvGrid.pop();
		var ugrid = uvGrid.pop();

		//uvGrid should be an ordered set of points - u direction first
		for(var uv=0; uv < uvGrid.length - vgrid - 2; uv++){
			
			if( (uv+1)%(vgrid+1) == 0 && uv!=0)
				continue;

			var point1 = srf.point( uvGrid[uv][0], uvGrid[uv][1] )
			var point2 = srf.point( uvGrid[uv+1][0], uvGrid[uv+1][1] )
			var point3 = srf.point( uvGrid[uv+vgrid+2][0], uvGrid[uv+vgrid+2][1] )
			var point4 = srf.point( uvGrid[uv+vgrid+1][0], uvGrid[uv+vgrid+1][1] )

			var sub_srf =  new mObj_geom_Surface( 
								new verb.geom.NurbsSurface.byCorners( point1, point2, point3, point4 ));
			div_surfaces.push(sub_srf); 
		}

		return new mObj_geom_Solid( div_surfaces );

	};


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
	mod.crv.line = function(frame, startPoint, endPoint){

		if( startPoint.getGeometry != undefined )
			startPoint = startPoint.getGeometry();
		if( endPoint.getGeometry != undefined )
			endPoint = endPoint.getGeometry();

		var crv = new verb.geom.Line(startPoint, endPoint);
		crv = crv.transform( frame.toLocal() );
	
		return new mObj_geom_Curve( crv );

	};

	/**
	 * Divides a curve into multiple segments and gives the corresponding t-parameter on the curve
	 * @param {curve object} curve - Curve Object to be divided
	 * @param {int} numPoints - Number of divisions required
	 * @returns {array}  - List of t-parameters at the division points
	 * @memberof crv
	 */
	mod.crv.divideByNumber = function(curve, numPoints){

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
	mod.vec.add = function( vector1, vector2){
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

	mod.mod = {};

	mod.mod.makeModel = function(array_of_elements){
		return new mObj_geom_Compound( array_of_elements );
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
			console.log("Non-Mobius passed to copy function");
			return object;
		}

		var getCopy = function(obj){

			if(obj instanceof THREE.Geometry)
				return obj.clone();
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

		newcopy.setData( object.getData() );
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
		
		obj.setMaterial(material);


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

	/**
	 * Returns the centre of a NURBS Curve, NURBS Surface or Solid Geometry
	 * @param {object} object - Mobius object
	 * @returns {array} Point - [x, y, z]
	 * @memberof obj
	 */
	mod.obj.getCentre = function(object){
		//calculate centre based on what kind of object
		var geometry = object;
		if(object.getGeometry != undefined)
			geometry = object.getGeometry();  

		// object is a solid
		if(geometry.constructor == Array ){

			var centres  = []
			for( var obj = 0; obj < geometry.length; obj++ )
				centres.push( MOBIUS.obj.getCentre( geometry[obj]) );

			var x = [];
			var y = [];
			var z = [];
			for( var i=0; i<centres.length; i++){
				x.push( centres[i][0] );
				y.push( centres[i][1] );
				z.push( centres[i][2] );
			}

			x = MOBIUS.lst.average( x );
			y = MOBIUS.lst.average( y );
			z = MOBIUS.lst.average( z );

			return [x, y, z]
		}

		if(geometry.center != undefined)
			return geometry.center();
		else if(geometry.vertices != undefined){
			var x = 0, y = 0, z = 0;
			for(var vert=0; vert < geometry.vertices.length; vert++ ){

				x += vert.x; 
				y += vert.y;
				z += vert.z;
			}

			x = x/geometry.vertices.length; 
			y = y/geometry.vertices.length; 
			z = z/geometry.vertices.length; 
			
			return [x, y, z]

		}
		else
			return "Invalid Input"
	};


	//
	//
	//	Transformation functions
	//
	//
	/** @namespace */
	mod.trn = {};

	/**
	 * Reflects the object about the XY plane of the frame
	 * @param {object} object - Object to be reflected
	 * @param {frame object} frame - Local coordinate system
	 * @param {boolean} copy - Determines if the object is to be copied before transformation
	 * @returns {object} - Transformed Object or Copy 
	 * @memberof trn
	 */
	mod.trn.reflect = function(object, frame, copy){

		if (object instanceof Array){

			var newobject = [];
			
			for(var obj=0; obj < object.length; obj++)
				newobject.push(MOBIUS.trn.reflect( object[obj], frame, copy ));	
			
			return newobject;
		}

		if( copy )
			object = MOBIUS.obj.copy( object );

		var geom; 
		if(object.getGeometry != undefined)
			geom = object.getGeometry();  // THREE.Geometry

		var trnMat = [ [ 1, 0, 0, 0],
						[ 0, 1, 0, 0],
							[ 0, 0, -1, 0],
								[0, 0, 0, 1]
					];
		console.log("geom", geom);


		geom.applyMatrix( getThreeMatrix(frame.toGlobal()) );
		geom.applyMatrix( getThreeMatrix(trnMat) ); 
		geom.applyMatrix( getThreeMatrix(frame.toLocal()) );
		
		object.setGeometry( geom ); 

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
	
		object.setGeometry( geom ); 

		return object;			

	};

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
		
		console.log(object);
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

		if( copy )
			object = MOBIUS.obj.copy( object );

		var geom; 
		if(object.getGeometry != undefined)
			geom = object.getGeometry();

		var orCenter = MOBIUS.obj.getCentre(object); 
			
		// frame definition
		var frame = MOBIUS.frm.byXYAxes([0,0,0], [1,0,0], [0,1,0])

		if( point.getGeometry != undefined )
			point = point.getGeometry()


		// translation required
		var tx = point[0] - orCenter[0];
		var ty = point[1] - orCenter[1];
		var tz = point[2] - orCenter[2]; 
		
		return MOBIUS.trn.shift( object, frame, tx, ty, tz, copy );		
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

})(MOBIUS || {});


/*
 *
 * Bridging Functions for all libraries used in Module - for geometry and topology
 *
 */

//
//	Functions forming bridge between data structure, topology and modules
//	Dependent on the modules being used for geometry and topology
//

//
//	Function to convert module geometry into three.js Mesh geometry
//  Add another if-else condition for each new geometry
//
var convertGeomToThree = function( geom ){

	// internal function
	var convertToThree = function(singleDataObject){

		// normal three.js objects - for lines and curves
		if( singleDataObject instanceof THREE.Mesh || singleDataObject instanceof THREE.Line || singleDataObject instanceof THREE.Group ){
			
			// to get lines in the mesh of the obj import
			if(singleDataObject instanceof THREE.Group){
				//console.log("before edges" , singleDataObject);
				var alledges = [];
				for(var i=0; i<singleDataObject.children.length; i++){
					var edges = new THREE.EdgesHelper( singleDataObject.children[i], "black");
					edges.material.linewidth = 2;
					alledges.push(edges);				
				}
				for(var e=0; e<alledges.length; e++)
					singleDataObject.add(new THREE.LineSegments(alledges[e].geometry, 
															 new THREE.LineBasicMaterial({
															        side: THREE.DoubleSide,
															        linewidth: 2,
															        color: 0x000000
															    })
															 ));

				//console.log("after edges", singleDataObject);
			}
			return singleDataObject;

		}
		// three.js shapes may also be used for creating surfaces
		else if( singleDataObject instanceof THREE.Shape ){
			//
			//	Changes shape according to frame
			//
			var m = new THREE.Matrix4();
			var arr = [];
			var frame = singleDataObject.frame.toLocal();
			for(var i=0; i<4; i++){
				for(var j=0; j<4; j++)
					arr.push(frame[j][i]);
			}
			m.fromArray(arr);
			var shapeGeom = new THREE.ShapeGeometry(singleDataObject);
			shapeGeom.applyMatrix( m );
			return new THREE.Mesh(shapeGeom);
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

	var geom;
	if(mObj.getGeometry != undefined)
		geom = mObj.getGeometry(); // gets the original stored geometry
	else{
		// shouldn't be called 
		console.log("Warning - non Mobius object passed to computeTopology function");
		geom = mObj; 
	}

	//console.log("Native module geometry has been extracted. Proceeding to compute topology ... ");

	//console.log("Initializing Topology");
	var topology = {};
	topology.objects = [];
	topology.faces = [];
	topology.wires = [];
	topology.edges = [];
	topology.vertices = [];
	topology.points = [];

	if(mObj instanceof mObj_geom_Compound){
		
		for( var element=0; element < geom.length; element++ ){

			var elemTopo; 
			if(geom[element].getTopology() == undefined){
				console.log("Computing topology")
				elemTopo = computeTopology(geom[element]);
			}
			else{
				console.log("Topology already computed; ")
				elemTopo = geom[element].getTopology();
			}


			MOBIUS.obj.addData( geom[element], "belongsTo", [element]);

			// these will be mObj objects -  final index corresponding to model level needs to be added from MOBIUS side
			topology.objects.push(geom[element]); 

			["faces", "wires", "edges", "vertices"].map( function(el){

				elemTopo[el].map( function(wire){ 
					if(wire.getData() != undefined){
						var bTo = wire.getData()["belongsTo"];
						bTo.push(element);
						MOBIUS.obj.addData( wire, "belongsTo", bTo );									
					}
					else{ 
						console.log(el, " data not defined")
					}
				});	
				
				topology[el] = topology[el].concat(elemTopo[el]);	
				console.log(el, " added to topology");

			});

			topology.points = topology.points.concat(elemTopo.points);
		}

	}
	// geom is a native mobius geometry object - could be a vertex, curve, surface or solid
	else if(mObj instanceof mObj_geom_Solid){

		console.log("Received a solid - will compute faces... ");
		// get the faces of this solid
		if(mObj.getGeometry() instanceof THREE.Group)
			return { points:[], vertices: [], edges: [], faces: [] };

		// POINTS - has to be repeated everywhere. Isn't a added-on set.
		topology.points = [];
		var geometry = mObj.getGeometry();
		for(var i=0; i< geometry.vertices.length; i++){
			topology.points.push([geometry.vertices[i].x, 
										geometry.vertices[i].y, 
											geometry.vertices[i].z]);
		}
		console.log("Points added to solid topology");
		
		//topology.edges = [];
		var topoEdgeCombinations = {};

		// figuring out the faces for a geometry
		var normals = [];

		var vertices = geometry.vertices;

		for(var f=0; f<geometry.faces.length; f++){   

			var o= normals[geometry.faces[f].normal.x.toString()+geometry.faces[f].normal.y.toString()+geometry.faces[f].normal.z.toString()]; 
			//console.log(o);
			
			if(o==undefined) 	
				normals[geometry.faces[f].normal.x.toString()+geometry.faces[f].normal.y.toString()+geometry.faces[f].normal.z.toString()] = []

			normals[geometry.faces[f].normal.x.toString()+geometry.faces[f].normal.y.toString()+geometry.faces[f].normal.z.toString()].push([geometry.faces[f].a, geometry.faces[f].b, geometry.faces[f].c] );

		}

		var keys = Object.keys(normals);

		for(var k=0; k < keys.length; k++){
			key = keys[k];
			//console.log(key);
			var faces = normals[key];
			var geom = new THREE.Geometry();

			geom.vertices = []; 
			geom.faces = [];
			var vert_map = {};

			var face_topo = {};
			face_topo.vertices = [];
			face_topo.edges = [];
			face_topo.faces = [];

			var connections = [];

			faces.map( function(face){

				for(var c=0; c<3; c++){
					
					// if vertex doesn't exist, add the vertex in this geometry
					if(vert_map[face[c]] == undefined){
						vert_map[face[c]] = geom.vertices.length; 
						geom.vertices.push( vertices[face[c]]);

						face_topo.vertices.push(topology.vertices[face[c]]); 

					}
					
					face[c] = vert_map[face[c]]; // index of corresponding vertex in this geometry					
				}

				geom.faces.push(new THREE.Face3(face[0], face[1], face[2]));
				
				connections.push([face[0], face[1]]);
				connections.push([face[0], face[2]]);
				connections.push([face[1], face[2]]);			
				
			});

			geom.computeFaceNormals();

			var arr = {};
			for (c in connections){ 
				if(arr[connections[c]] == undefined) 
					arr[connections[c]] = 0; 
				arr[connections[c]]++; 
			}


			for(key in arr){ 
				if(isNaN(parseInt(key[0])) || isNaN(parseInt(key[2])))
					continue;
				if(arr[key]>1) 
					delete arr[key]; 
				else{
					// convert combination to real verts
					//console.log(key);
					var local1 = key[0]; 
					var local2 = key[2];
					var gl1 = undefined; 
					var gl2 = undefined;

					for(pos in vert_map){

						if(vert_map[pos] == local1){
							gl1 = pos;
							if(gl2)
								break;
						}
						else if(vert_map[pos] == local2){
							gl2 = pos;
							if(gl1)
								break;
						}
					}

					var topoEdge = undefined; 
					if(topoEdgeCombinations[[gl1,gl2]] || topoEdgeCombinations[[gl2,gl1]])
						topoEdge = topology.edges[topoEdgeCombinations[[gl1,gl2]] || topoEdgeCombinations[[gl2,gl1]]]
					//console.log("topoEdgeCombinations", topoEdgeCombinations, gl1, gl2);
					// means edge not yet present
					if(topoEdge == undefined){
						//console.log("Defining edge");
						var pnt1 = vertices[gl1]; 
						var pnt2 = vertices[gl2];

						var lineGeom = new THREE.Geometry();
						lineGeom.vertices.push(
							pnt1,
							pnt2
						);

						var line = new THREE.Line( geometry ); 
						var topoEdge = new mObj_geom_Curve(line);
						var tep = {}
						tep.vertices = [topology.vertices[gl1], topology.vertices[gl2]];
						tep.edges = [topoEdge];
						tep.faces = [];
						topoEdge.setTopology(tep);
						
						topoEdgeCombinations[[gl1, gl2]] = topology.edges.length;
						topology.edges.push(topoEdge);

						face_topo.edges.push(topoEdge);
					}
				}
			}



			var fface = new mObj_geom_Surface(geom);

			//face_topo.faces.push(fface);			
			//fface.setTopology(face_topo);
			MOBIUS.obj.addData( fface, "belongsTo", [topology.faces.length]); 


			//finalFaces.push(new mObj_geom_Surface(geom));
			topology.faces.push(fface);

		}
		
		//topology.faces = finalFaces;
		console.log("Computed ", topology.faces.length, "faces"); 
		for( var f=0; f < topology.faces.length; f++ ){

			var face_topo = computeTopology(topology.faces[f]); // this will have wires, edges, vertices, points

			console.log("Computing topology for each face and appending to solid's topology .... ");

			["wires", "edges", "vertices"].map( function(el){
				
				
				face_topo[el].map( function(wire){
					var bTo = wire.getData()["belongsTo"];
					bTo.push(f);
					MOBIUS.obj.addData( wire, "belongsTo", bTo ); 
					//console.log(el, "belongsTo:", wire.getData()["belongsTo"] );
				});	
				
				console.log(el, " added to solid topology");
				topology[el] = topology[el].concat(face_topo[el]);			


			});
		}

		//console.log("Final topology ", topology);
		return topology; 
	}
	else if(mObj instanceof mObj_geom_Surface){

		console.log("Surface received. Wires will be computed.");
		topology.faces = [ MOBIUS.obj.copy(mObj) ];
		//allot this value only if it is previous undefined - actual object is further up in the heirarchy
		if(mObj.getData() == undefined || mObj.getData()["belongsTo"] == undefined)
			MOBIUS.obj.addData(topology.faces[0], 'belongsTo', [0]);
		// first compute vertices - create vertex objects
		// use vertice objects to set topology of the edges
		for(var i=0; i<mObj.extractThreeGeometry().geometry.vertices.length; i++){
			topology.points.push([mObj.extractThreeGeometry().geometry.vertices[i].x, 
											mObj.extractThreeGeometry().geometry.vertices[i].y, 
											mObj.extractThreeGeometry().geometry.vertices[i].z]);
		}
		console.log("Points for wire have been computed.");

		if(geom instanceof THREE.Shape){
			console.log("Surface is as shape");
			var wire = new THREE.Geometry();
			mObj.getGeometry().curves.map( function(e){
			
				wire.vertices.push(
					new THREE.Vector3(e.v1.x, e.v1.y, 0)
					//new THREE.Vector3(e.v2.x, e.v2.y, 0)
				);
			});	

			wire.vertices.push(wire.vertices[0]);
			wire = new mObj_geom_Curve(new THREE.Line(wire));

			topology.wires.push(wire);
		}
		else{

			var wire = new THREE.Geometry(); 

			// TODO - IMPORTANT - ARRANGE VERTICES IN CLOCKWISE ORDER ALGORITHMICALLY
			function orderVerts(){

				var verts = geom.vertices.map( function(v){
					return [v.x, v.y, v.z];
				})

				// process and add to orderedVerts
				var centrePoint = [0,0,0];
				for(var vpt=0; vpt<verts.length; vpt++){

					centrePoint[0] += verts[vpt][0];
					centrePoint[1] += verts[vpt][1];
					centrePoint[2] += verts[vpt][2];

				}

				centrePoint[0] = centrePoint[0]/verts.length;
				centrePoint[1] = centrePoint[1]/verts.length;
				centrePoint[2] = centrePoint[2]/verts.length;

				var angles = [0];
				var vector1 = [ verts[0][0] - centrePoint[0], verts[0][1] - centrePoint[1], verts[0][2] - centrePoint[2] ]; 

				// compute and push angle 
				for(var vpt=1; vpt<verts.length; vpt++){

					var vector2 = [ verts[vpt][0] - centrePoint[0], verts[vpt][1] - centrePoint[1], verts[vpt][2] - centrePoint[2]  ];
					var angle = MOBIUS.vec.angle(vector1, vector2);

					console.log(vector2)

					angles.push(angle);
				}

				// sort angles and sort the points side-by-side
				var sortedAngles = angles.sort(function(a, b){return a-b}); 
				var oVerts = verts; 
				for(var a=0; a<angles.length; a++){

					var corrPos = sortedAngles.indexOf( angles[a] );
					if(corrPos != -1)
						oVerts[corrPos] = verts[a];
					else
						console.log("Error in coordinate-sorting.");

				}

				oVerts = oVerts.map( function(v){
					var vectVert = new THREE.Vector3(v[0], v[1], v[2]);
					wire.vertices.push(vectVert);
				})

			}

			orderVerts();

			var wire_curve = new mObj_geom_Curve(new THREE.Line(wire)); 
			topology.wires.push( wire_curve );

			//var edgehelper = new THREE.EdgesHelper( mObj.extractThreeGeometry(), 0x00ff00 );
			//topology.wires = [new mObj_geom_Curve()]; // will mObj will have THREE.Geometry geom
		}

		console.log("Computed ", topology.wires.length, " wires" );
		for(var e=0; e < topology.wires.length; e++ ){

			MOBIUS.obj.addData(topology.wires[e], "belongsTo", [e]);
			var wire_topo = computeTopology( topology.wires[e] );// this will have  edges, vertices, points
			// modify belongs to of each element of wire_topo and add to respective

			for( var f=0; f < topology.wires.length; f++ ){

				console.log("Computing topology of each wire and appending to surface topology");
				var wire_topo = computeTopology(topology.wires[f]); // this will have wires, edges, vertices, points


				["edges", "vertices"].map( function(el){
					
					wire_topo[el].map( function(wire){ 
						var bTo = wire.getData()["belongsTo"];
						bTo.push(f);
						MOBIUS.obj.addData( wire, "belongsTo", bTo );
					});	
					
					topology[el] = topology[el].concat(wire_topo[el]);	
					console.log(el, " added to surface topology");				
				
				});
			}
		}

		return topology; 
	}
	else if(mObj instanceof mObj_geom_Curve){

		//console.log("Curve received. Wires and Edges will be computed.");
		if(geom.geometry != undefined)
			geom = geom.geometry; 

		// no further topology setting needed
		if(geom.vertices.length>2){

			console.log("Wire received. Edges will be computed.")
			// break this up into edges
			topology.wires = [mObj]; // contains self
			//console.log("Wire recieved. Will proceed to break into edges.");
			
			// for each wire, compute edges, get vertices, modify belongs to 
			for(var i=0; i<geom.vertices.length-1; i++){

				topology.points.push(geom.vertices[i]);

				var new_edge = new THREE.Geometry();
				new_edge.vertices.push(new THREE.Vector3(geom.vertices[i]), new THREE.Vector3(geom.vertices[i+1]));
				new_edge = new mObj_geom_Curve(new_edge);

				MOBIUS.obj.addData(new_edge, "belongsTo", [i]);

				topology.edges.push(new_edge);				
			}

			console.log("Computed", topology.edges.length, " edges");
			for( var f=0; f < topology.edges.length; f++ ){

				var edge_topo = computeTopology(topology.edges[f]); // this will have vertices, points

				["vertices"].map( function(el){
					
					console.log("For each edge, vertices will be computed and added to Edge Topology");
					edge_topo[el].map( function(wire){
						var bTo = wire.getData()["belongsTo"];
						bTo.push(f);
						MOBIUS.obj.addData( wire, "belongsTo", bTo );
					});	
					
					console.log(el, " added to edge topology");
					topology[el] = topology[el].concat(edge_topo[el]);					
				});
			}

			//console.log("wire topo", topology);

		}
		else{

			console.log("Edge received. Vertices will be computed.");

			// no wire
			topology.edges = [mObj]; 
			//console.log("Vertices computed for the edge - ", geom.vertices.length);
			for(var i=0; i<geom.vertices.length; i++){
				var vert = new mObj_geom_Vertex([geom.vertices[i].x, 
															 geom.vertices[i].y, 
															 geom.vertices[i].z]);
				//console.log(geom.vertices[i]);
				MOBIUS.obj.addData(vert, "belongsTo", [i]);
				topology.vertices.push(vert);   // THREE.Vector3
			}
			topology.points = topology.vertices; 				
		}	
	}
	else if(mObj instanceof mObj_geom_Vertex){
		
		topology.vertices = [mObj];
		
		MOBIUS.obj.addData(topology.vertices[0], 'belongsTo', []);	

		topology.points = [[mObj.extractThreeGeometry().geometry.vertices[i].x, 
											mObj.extractThreeGeometry().geometry.vertices[i].y, 
											mObj.extractThreeGeometry().geometry.vertices[i].z]];

	}
	else 
		console.log("Unrecognised geometry passed to Module")
	
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


var GLOBAL = MOBIUS.frm.byXYAxes( [0,0,0], [1,0,0], [0,1,0] );

