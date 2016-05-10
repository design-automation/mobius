/*
 *	Module, for Urban Design 
 */

var MOBIUS = ( function (mod){	

	/*
	 *
	 * General Functions,
	 * Input - according to requirements; Output - non-geometric primitives
	 *
	 */


	//
	//
	//
	mod.urb = {};

	mod.urb.readJSON = function(){

		var finalGeom = [];

	    var translateLat = function(lat){
	        if(!lat){lat = 0;}
	        return (lat-13.36)*100;
	    },
	    translateLng = function(lng){
	        if(!lng){lng = 0;}
	        return (lng-52.53)*100;
	    };

		var json = {
			"type": "FeatureCollection",
			"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
			                                                                                
			"features": [
			{ "type": "Feature", "properties": { "gml_id": "re_einwohnerdichte2013.0100980011000100", "spatial_name": "0100980011000100", "spatial_alias": "0100980011000100", "spatial_type": "Polygon", "EW2013": "3", "EW2012": "9", "EW2011": "3", "EW2010": "7", "HA2013": "0.42", "EW_HA2013": "7", "EW_HA2012": "21", "EW_HA2011": "7", "EW_HA2010": "16" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 13.368439352519529, 52.534489409577496 ], [ 13.369045216183748, 52.533947864074662 ], [ 13.37009288810971, 52.534403813817548 ], [ 13.369753440055828, 52.53469081532878 ], [ 13.36900239882087, 52.534376070911009 ], [ 13.368979254136494, 52.534400566315703 ], [ 13.368745103892127, 52.53461571044825 ], [ 13.368439352519529, 52.534489409577496 ] ] ] } },
			{ "type": "Feature", "properties": { "gml_id": "re_einwohnerdichte2013.0100980011000200", "spatial_name": "0100980011000200", "spatial_alias": "0100980011000200", "spatial_type": "Polygon", "EW2013": null, "EW2012": null, "EW2011": null, "EW2010": null, "HA2013": null, "EW_HA2013": null, "EW_HA2012": null, "EW_HA2011": null, "EW_HA2010": null }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 13.368439352519529, 52.534489409577496 ], [ 13.368745103892127, 52.53461571044825 ], [ 13.368979254136494, 52.534400566315703 ], [ 13.36900239882087, 52.534376070911009 ], [ 13.369753440055828, 52.53469081532878 ], [ 13.369097508383989, 52.535268940951809 ], [ 13.369078134645068, 52.535285534407592 ], [ 13.368414417034556, 52.535868381912614 ], [ 13.368261823488456, 52.536001930110523 ], [ 13.367271583161246, 52.535570544612305 ], [ 13.368439352519529, 52.534489409577496 ] ] ] } }
			]}

		var features = json.features; 
		for(var s=0; s < features.length; s++){
			
			var feature = features[s]; 
			var coords = feature.geometry.coordinates;  //[ [ [], [], [], ... ],  coords[0]... <= actual shape
														// 	[ [], [], [], ... ],  coords[1]... <= holes in the shape
														//  [ [], [], [], ... ] ... ]   

			var points = [];
			for(var i=0; i<coords.length; i++){

				// processing for the main shape
				if(i==0){
					for(var j=0; j<coords[i].length; j++){
						if(json.features[s].geometry.coordinates[0][i][0] && json.features[s].geometry.coordinates[0][i][1] && json.features[s].geometry.coordinates[0][i][0]>0 && json.features[s].geometry.coordinates[0][i][1]>0){
							points.push( new THREE.Vector2 ( translateLat(json.features[s].geometry.coordinates[0][i][0]), translateLng(json.features[s].geometry.coordinates[0][i][1])) );	
						}
					}			
				}
			}
			finalGeom.push( new mObj_geom_Solid( new THREE.Mesh( new THREE.Shape( points ) ) ) );
		} 

		return finalGeom;

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
	mod.sld.byExtrusion = function(surface, frame, xDistance, yDistance, zDistance){


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
	 * Creates a Nurbs surface from user-specified data
	 * @param {frame object} - Local coordinate system for the object
	 * @param {int} degreeU - Degree of the surface in the u-Direction 
	 * @param {int} degreeV - Degree of the surface in the v-Direction 
	 * @param {array} knotsU - Knots in the u-Direction 
	 * @param {array} knotsV - Knots in the v-Direction 
	 * @param {array} controlPoints - Array of points / vertex objects through which the curve passes ( [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3], [x4, y4, z4], ...] )
	 * @param {array} weights - Weights ( optional parameter; maybe 'undefined' )
	 * @returns { surface object }  - Surface object
	 * @memberof srf
	 */
	mod.srf.nurbsByData = function ( frame, degreeU, degreeV, knotsU, knotsV, controlPoints, weights ){
		
	};


	/**
	 * Creates a Nurbs surface using the corner-points
	 * @param {frame object} - Local coordinate system for the object
	 * @param {array} cornerpoints - Array of points / vertex objects ( [ [x1, y1, z1], [x2, y2, z2], [x3, y3, z3], [x4, y4, z4] ] )
	 * @returns { surface object }  - Surface object
	 * @memberof srf
	 */
	mod.srf.nurbsByCorners = function ( cornerpoints ){

		return new mObj_geom_Surface( srf ) ;
	};

	/**
	 * Creates a surface by extruding a curve along x, y, z vectors of the given local coordinate system
	 * @param { frame object } frame - Local coordinate system 
	 * @param { curve object } curve - Curve to be extruded
	 * @param { float } xDistance - Amount of extrusion in the direction of the x-Axis of the frame
	 * @param { float } yDistance - Amount of extrusion in the direction of the y-Axis of the frame
	 * @param { float } zDistance - Amount of extrusion in the direction of the z-Axis of the frame
	 * @returns { surface object }  - Surface object 
	 * @memberof sld
	 */
	mod.srf.nurbsByExtrusion  = function(frame, curve, xDistance, yDistance, zDistance){

		return new mObj_geom_Surface( srf ) ;

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

		// fix: make this into one line code with 'eval'
		var newcopy;
		if(object instanceof mObj_geom_Vertex)
			newcopy = new mObj_geom_Vertex( object.getGeometry() );
		else if(object instanceof mObj_geom_Curve)
			newcopy = new mObj_geom_Curve( object.getGeometry() );
		else if(object instanceof mObj_geom_Surface)
			newcopy = new mObj_geom_Surface( object.getGeometry() );
		else if(object instanceof mObj_geom_Solid)
			newcopy = new mObj_geom_Solid( object.getGeometry() );

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
			if(obj.getData() == undefined)
				var new_data = {};
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
		else if(geometry instanceof verb.geom.NurbsCurve)
			return geometry.point(0.5);
		else if(geometry instanceof verb.geom.NurbsSurface)
			return geometry.point(0.5, 0.5);
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

		if (object instanceof mObj_geom_Solid)
			object = object.getGeometry();

		if (object instanceof Array){

			var newobject = [];
			
			for(var obj=0; obj < object.length; obj++)
				newobject.push(MOBIUS.trn.reflect( object[obj], frame, copy ));	
			
			return newobject;
		}

		if( copy )
			object = MOBIUS.obj.copy( object );

		var geom = object.getGeometry();

		var trnMat = [ [ 1, 0, 0, 0],
						[ 0, 1, 0, 0],
							[ 0, 0, -1, 0],
								[0, 0, 0, 1]
					];
						

		geom = geom.transform( frame.toGlobal() );
		geom = geom.transform( trnMat ); 
		geom = geom.transform( frame.toLocal() );
		
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

		if (object instanceof mObj_geom_Solid)
			object = object.getGeometry();

		if (object instanceof Array){

			var newobject = [];
			
			for(var obj=0; obj < object.length; obj++)
				newobject.push(MOBIUS.trn.rotate( object[obj], frame, angleX, angleY, angleZ, copy ));	
			
			return newobject;
		}

		if( copy )
			object = MOBIUS.obj.copy( object );

		var geom = object.getGeometry();

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
		

		geom = geom.transform( frame.toGlobal() );

		geom = geom.transform( getRotationMatrix([0,0,1], angleZ) );
		geom = geom.transform( getRotationMatrix([0,1,0], angleY) );
		geom = geom.transform( getRotationMatrix([1,0,0], angleX) );
				
		geom = geom.transform( frame.toLocal() );
		
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

		if (object instanceof mObj_geom_Solid)
			object = object.getGeometry();

		if (object instanceof Array){

			var newobject = [];
			
			for(var obj=0; obj < object.length; obj++)
				newobject.push(MOBIUS.trn.scale(object[obj], frame, scaleX, scaleY, scaleZ, copy));	
			
			return newobject;
		}

		if( copy )
			object = MOBIUS.obj.copy( object );

		var geom = object.getGeometry();
			
		var trnMat = [ [ scaleX, 0, 0, 0 ],
						[ 0, scaleY, 0, 0],
							[ 0, 0, scaleZ, 0 ],
								[ 0, 0, 0, 1 ]
					];
			
		geom = geom.transform( frame.toGlobal() );
		geom = geom.transform( trnMat );
		geom = geom.transform( frame.toLocal() );
	
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

		if (object instanceof mObj_geom_Solid)
			object = object.getGeometry();

		if (object instanceof Array){

			var newobject = [];
			
			for(var obj=0; obj < object.length; obj++)
				newobject.push(MOBIUS.trn.shift( object[obj], frame, shiftX, shiftY, shiftZ, copy ));	
			
			return newobject;
		}
		
		if( copy )
			object = MOBIUS.obj.copy( object );

		var geom = object.getGeometry();

		var trnMat = [ [ 1, 0, 0, shiftX ], 
							[ 0, 1, 0, shiftY ], 
								[ 0, 0, 1, shiftZ ], 
									[ 0, 0, 0, 1 ]
					 	] 
	
		geom = geom.transform( frame.toGlobal() );
		geom = geom.transform( trnMat );
		geom = geom.transform( frame.toLocal() );
		
		object.setGeometry( geom ); 

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

		if (object instanceof mObj_geom_Solid)
			object = object.getGeometry();
	
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
//	Requirements
//	Function names should remain the same
//

var TOPOLOGY_DEF = {"vertices":[], "edges":[], "faces":[]}
//
//	Function to convert module geometry into three.js Mesh geometry
//  Add another if-else condition for each new geometry
//
var convertGeomToThree = function( geom ){

	// internal function
	var convertToThree = function(singleDataObject){

		if( singleDataObject instanceof THREE.Mesh )
			return singleDataObject;
		else if(singleDataObject instanceof Array){

			if(singleDataObject[0] instanceof THREE.Mesh)
				return singleDataObject;
			// means it is a point
			var dotGeometry = new THREE.Geometry();
			dotGeometry.vertices.push( new THREE.Vector3(singleDataObject[0], singleDataObject[1], singleDataObject[2]) ); console.log("here");
			return new THREE.PointCloud( dotGeometry );
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

	return topo;

}

//
//	Takes native geometry ( geometry from module ) and converts it into native topology - edges, faces, vertices
//
var computeTopology = function( mObj ){

	return topology;
}



var GLOBAL = MOBIUS.frm.byXYAxes( [0,0,0], [1,0,0], [0,1,0] );