/*
 *	Module, with verb.js
 */
 
var VIDAMO = ( function (mod){	

	/*
	 *
	 * General Functions,
	 * Input - according to requirements; Output - non-geometric primitives
	 *
	 */

	/**
	 * Prints to console
	 * @param {string} content - Message to be printed on the console
	 * @returns {null}
	 */
	mod.print = function(content){
		// try to find vidamo web app, if found print in vidamo console

		this.content = content;

		try{
			var logString = "<div style='color: green;'>" + this.content + '</div>';
			document.getElementById('log').innerHTML += logString;
		}catch(err){
			console.log('warnning: vidamo web app not connected.');
		}
	};

	/**
	 * Converts RGB values into Hex color code
	 * @param {int} red - Value between 0-255 for red color
	 * @param {int} green - Value between 0-255 for green color
	 * @param {int} blue - Value between 0-255 for blue color
	 * @returns {string} - HexValue
	 */
	mod.rgbToHex = function(red, green, blue){
		
		return '0x'+toHex(red)+toHex(green)+toHex(blue);
			
		function toHex(n) {
			 n = parseInt(n,10);
			 if (isNaN(n)) return "00";
			 n = Math.max(0,Math.min(n,255));
			 return "0123456789ABCDEF".charAt((n-n%16)/16)
				  + "0123456789ABCDEF".charAt(n%16);
		}
	};
	
	/**
	 * Converts degrees into radians
	 * @param {float} degree - Degrees to be converted
	 * @returns {float} 
	 */
	mod.convertDegreesToRadians = function( degrees ){
		return 0.01745*degrees;
	};

	/**
	 * Converts radians into degrees
	 * @param {float} radians - Radians to be converted
	 * @returns {float} 
	 */
	mod.convertRadiansToDegrees = function( radians ){
		return 57.29*radians;
	};

	/**
	 * Returns absolute (positive) value of a number
	 * @param {float} number  
	 * @returns {float} Positive value
	 */
	mod.getAbsoluteValue = function( number ){
		return Math.abs( number );
	};

	/**
	 * Returns value of a number upto significant digits
	 * @param {float} number  - Number
	 * @param {int} number  - Number of significant digits needed
	 * @returns {float} 
	 */
	mod.getSignificantDigits = function( number, digits){
		return number.toFixed(digits);
	};

	/**
	 * Computes dot product of two matrices
	 * @param {array} mat1  - Matrix 1
	 * @param {array} mat2  - Matrix 2
	 * @returns {float} 
	 */
	mod.getDotProduct = function( mat1, mat2 ){
		return verb.core.Vec.dot(mat1, mat2);
	};

	/**
	 * Computes cross product of two matrices
	 * @param {array} mat1  - Matrix 1
	 * @param {array} mat2  - Matrix 2
	 * @returns {array} 
	 */
	mod.getCrossProduct = function( mat1, mat2 ){
		return verb.core.Vec.cross(mat1, mat2);
	};
	

	/*
	 *
	 * List Operations
	 *
	 */

	/**
	 * Returns a number sequence in the form of an array
	 * @param {float or int} start  - Starting value of the sequence
	 * @param {float or int} end  - Ending value of the sequence
	 * @param {float or int} stepSize  - Increment or Decrement value to get to the 'end' value from the 'start' value
	 * @returns {array} 
	 */
	mod.makeSequence = function(start, end, stepSize){

		var arr = [];
		for(var i = start; i <= end; i = i + stepSize)
			arr.push(i);
		return arr;
	};

	/**
	 * Adds an element to a list
	 * @param {array} list  - List to which an element needs to be pushed
	 * @param {array element} object - Element to be pushed into the list
	 * @returns {null} 
	 */
	mod.addToList = function( list, object ){
		list.push( object );
	};

	/**
	 * Finds the index of the first occurence of an array element. 
	 * @param {array} list  - List in which an element needs to be searched
	 * @param {array element} object - Element to be searched for
	 * @returns {int} Returns -1 if the element doesn't exist in array. 
	 */
	mod.indexOfObject = function( list, object ){
		return list.indexOf( object );
	};

	/**
	 * Removes an array element from a list by it's index number
	 * @param {array} list  - List in which an element needs to be removed
	 * @param {int} index - Index to be removed
	 * @returns {null} 
	 */
	mod.removeIndexFromList = function( list, index ){
		list.splice(index, 1);
	};

	/**
	 * Gets the maximum value in a numeric array
	 * @param {array} valueList - List from which maximum value is required
	 * @returns {float / int} 
	 */
	mod.getMaxValue = function( valueList ){
		var maxValue = valueList[0];
		for(var i=0; i<valueList.length; i++)
			maxValue = Math.max(maxValue, valueList[i]);
		return maxValue;
	};

	/**
	 * Gets the minimum value in a numeric array
	 * @param {array} valueList - List from which minimum value is required
	 * @returns {float / int} 
	 */
	mod.getMinValue = function( valueList ){
		var minValue = valueList[0];
		for(var i=0; i<valueList.length; i++)
			minValue = Math.min(minValue, valueList[i]);
		return minValue;
	};

	/**
	 * Gets the sum of a numeric array
	 * @param {array} valueList - List which is to be summed
	 * @returns {float / int} 
	 */
	mod.sumList = function( valueList ){
		var sum = 0;
		for(var i=0; i<valueList.length; i++)
			sum += valueList[i];
		return sum;
	};

	/**
	 * Gets the avaerage of a numeric array
	 * @param {array} valueList - List which is to be averaged
	 * @returns {float / int} 
	 */
	mod.averageList = function( valueList ){
		return VIDAMO.sumList( valueList )/ valueList.length;
	};

	/**
	 * Returns the span of the list - the difference between the maximum and the minimum value in the list
	 * @param {array} valueList - List which is to be analyzed
	 * @returns {float / int} 
	 */
	mod.rangeOfList = function( valueList ){
		return VIDAMO.getMaxValue( valueList ) - VIDAMO.getMinValue( valueList );
	};

	/**
	 * Returns the length of the list 
	 * @param {array} valueList - List which is to be analyzed
	 * @returns {int} 
	 */
	mod.getListLength = function( valueList ){
		return valueList.length
	};


	/*
	 *
	 *	Geometry Analysis Functions
	 *
	 */

	/**
	 * Returns the centre of a NURBS Curve, NURBS Surface or a 3D Geometry
	 * @param {array} mObj - MobiusDataObject containing Nurbs Geometry
	 * @returns {array} Point - [x, y, z]
	 */
	mod.getCentre = function(mObj){
		//calculate centre based on what kind of object
		var geometry = mObj.getGeometry();

		if(geometry instanceof verb.geom.NurbsCurve)
			return geometry.point(0.5);
		else if(geometry instanceof verb.geom.NurbsSurface)
			return geometry.point(0.5, 0.5);
		else
			return "Invalid Input"
	};

	/**
	 * Returns the distance between two points or position vectors
	 * @param {point / MobiusDataObject} point - [x, y , z] or MobiusDataObject with PositionVector
	 * @returns {float} Distance 
	 */
	mod.distanceBetweenTwoPoints = function( point1, point2){
		var deltaX, deltaY, deltaZ;

		deltaX = point1[0] - point2[0];
		deltaY = point1[1] - point2[1];
		deltaZ = point1[2] - point2[2];

		var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
		return distance;
	};

	/**
	 * Returns the length of a MobiusDataObject containing a PositionVector or a NURBS Curve
	 * @param {MobiusDataObject} mObj - NURBS Curve
	 * @returns {float} Length 
	 */
	mod.getLength = function( mObj ){
		var geom = mObj.getGeometry();
		return geom.length();
	};


	/*
	 *
	 * Verbs Functions
	 * Input - according to requirements, Output - MobiusDataObject with NURBS Geometry
	 *
	 */
	
	//
	//	Curve Functions
	//
	//
	
	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {array} startPoint - Starting point of the line in [x,y,z] format
	 * @param {array} endPoint - Ending point of the line in [x,y,z] format	 
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeLine = function(startPoint, endPoint){
		// input variations
		// start, end could be a vector3 - has to be converted into an array
	
		return new mObj_geom_Curve( new verb.geom.Line(startPoint, endPoint) );
		
		// topology : curve class
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {array} centerPoint - Centre point of the Arc in [x,y,z] format
	 * @param {array} xaxis - Direction of X-Axis of the Arc in [x,y,z] format 
	 * @param {array} yaxis - Direction of Y-Axis of the Arc in [x,y,z] format 
	 * @param {array} radius - Radius of the Arc
	 * @param {float} minAngle - Minimum Angle in Radians
	 * @param {float} maxAngle - Maximum Angle in Radians
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeArc = function(centerPoint, xaxis, yaxis, radius, minAngle, maxAngle){
		// input variations
		// center, axis and yaxis could be vector3
		return new mObj_geom_Curve( new verb.geom.Arc(centerPoint,xaxis,yaxis,radius,minAngle,maxAngle) ) ;

	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {array} points - Array of Control Points for the Bezier Curve ( [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3], [x4, y4, z4], ...] )
	 * @param {array} weights - Weights
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeBezierCurve = function(points, weights){
		return new mObj_geom_Curve( new verb.geom.BezierCurve(points, weights) ) 
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {array} centerPoint - Centre point of the Circle in [x,y,z] format
	 * @param {array} xaxis - Direction of X-Axis of the Circle in [x,y,z] format 
	 * @param {array} yaxis - Direction of Y-Axis of the Circle in [x,y,z] format 
	 * @param {array} radius - Radius of the Arc
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeCircleBoundary = function(centerPoint,xaxis,yaxis,radius){
		return new mObj_geom_Curve( new verb.geom.Circle(centerPoint,xaxis,yaxis,radius) ) 
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {array} centerPoint - Centre point of the Ellipse in [x,y,z] formats
	 * @param {array} xaxis - Direction of X-Axis of the Ellipse in [x,y,z] format; Length of this vector determines length of x-Axis of ellipse;
	 * @param {array} yaxis - Direction of Y-Axis of the Ellipse in [x,y,z] format; Length of this vector determines length of y-Axis of ellipse;
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeEllipse = function ( centerPoint ,xaxis,yaxis ){

		return new mObj_geom_Curve( new verb.geom.Ellipse( centerPoint,xaxis,yaxis ) ) 
		
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {array} centerPoint - Centre point of the EllipseArc in [x,y,z] formats
	 * @param {array} xaxis - Direction of X-Axis of the EllipseArc in [x,y,z] format; Length of this vector determines length of x-Axis of ellipse;
	 * @param {array} yaxis - Direction of Y-Axis of the EllipseArc in [x,y,z] format; Length of this vector determines length of y-Axis of ellipse;
	 * @param {float} minAngle - Minimum Angle in Radians
	 * @param {float} maxAngle - Maximum Angle in Radians
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeEllipseArc = function ( centerPoint,xaxis,yaxis,minAngle,maxAngle ){
		return new mObj_geom_Curve( new verb.geom.EllipseArc( centerPoint,xaxis,yaxis,minAngle,maxAngle ) ) 
		// topology : curve class
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {array} points - Array of points through which the curve passes ( [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3], [x4, y4, z4], ...] )
	 * @param {int} degree - Degree of the Curve
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeCurveByPoints = function( points, degree ){
		return new mObj_geom_Curve( new verb.geom.NurbsCurve.byPoints( points, degree ) ) ;
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {int} degree - Degree of the Curve
	 * @param {array} knots - Knots
	 * @param {array} controlPoints - Array of points through which the curve passes ( [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3], [x4, y4, z4], ...] )
	 * @param {array} weights - Weights
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeCurveByKnotsControlPointsWeights = function ( degree,knots,controlPoints,weights ){
		return new mObj_geom_Curve( new verb.geom.NurbsCurve.byKnotsControlPointsWeights( degree,knots,controlPoints,weights ) ) ;
		// topology : curve class
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {int} degreeU - DegreeU of the Surface
	 * @param {int} degreeV - DegreeV of the Surface
	 * @param {array} knotsU - Knots in U Direction
	 * @param {array} knotsV - Knots in V Direction
	 * @param {array} controlPoints - Array of points through which the curve passes ( [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3], [x4, y4, z4], ...] )
	 * @param {array} weights - Weights
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeSurfaceByKnotsControlPointsWeights = function ( degreeU,degreeV,knotsU,knotsV,controlPoints,weights ){
		
		return new mObj_geom_Surface( new verb.geom.NurbsSurface.byKnotsControlPointsWeights( degreeU,degreeV,knotsU,knotsV,controlPoints,weights ) ) ;
		// topology : single surface - cant be exploded
		// brep : face -> surface (1); edges -> boundaries (4) ; vertex -> corner points (4)
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {array} point - Corner points in [x,y,z] format
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeSurfaceByCorners = function ( point0, point1, point2, point3 ){
		return new mObj_geom_Surface( new verb.geom.NurbsSurface.byCorners ( point0,point1,point2,point3 ) ) ;
		// topology : single surface - cant be exploded
		// brep : face -> surface (1); edges -> boundaries (4) ; vertex -> corner points (4)
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {MobiusDataObject} mObj - MobiusDataObject with NURBS Curve Geometry
	 * @param {array} centerPoint - CentrePoint in [x,y,z] format
	 * @param {array} axis - Axis of revolution in [x,y,z] format	 
	 * @param {float} angle - Angle of revolution in radians
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeSurfaceByRevolution = function ( mobiusGeometry, centerPoint, axis, angle ){
		var profile = mobiusGeometry.getGeometry();
		return new mObj_geom_Surface( new verb.geom.RevolvedSurface( profile, centerPoint, axis, angle ) ) ;
	
		// topology : single surface - cant be exploded
		// brep : face -> surface (1); edges -> boundaries (4) ; vertex -> corner points (4) - if incomplete circle, else one boundary, one vertex
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {MobiusDataObject} mObj - MobiusDataObject with NURBS Curve Geometry
	 * @param {MobiusDataObject} mObj - MobiusDataObject with NURBS Curve Geometry
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeSurfaceBySweep = function ( mObjProfile, mObjRail){
		var profile = mObjProfile.getGeometry();
		var rail = mObjRail.getGeometry();
		return new mObj_geom_Surface( new verb.geom.SweptSurface ( profile, rail ) ) ;
		// topology : single surface - cant be exploded
		// brep : face -> surface (1); edges -> boundaries (4) ; vertex -> corner points (4)
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {array} listOfCurves - Array of MobiusDataObject with NURBS Curve Geometry
	 * @param {int} degree - Degree of the Surface
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeSurfaceByLoft = function(listOfCurves, degree){
		var deg = degree || 3;
		var curves = []; l = listOfCurves;
		for(var c=0; c<listOfCurves.length; c++)
			curves.push(listOfCurves[c].getGeometry()); 
		return new mObj_geom_Surface( new verb.geom.NurbsSurface.byLoftingCurves( curves, deg ) ) ;
		
		// topology : single surface - cant be exploded
		// brep : face -> surface (1); edges -> boundaries (4) ; vertex -> corner points (4)
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {MobiusDataObject} mObjProfile - Array of MobiusDataObject with NURBS Curve Geometry
	 * @param {array} direction - Direction of Sweep in [x,y,z] format	 
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeSurfaceByExtrusion = function ( mObjProfile, direction){
		var profile = mObjProfile.getGeometry();
		return new mObj_geom_Surface(  new verb.geom.ExtrudedSurface( profile, direction ) ) ;
		
		// topology : single surface - cant be exploded
		// brep : face -> surface (1); edges -> boundaries (4) ; vertex -> corner points (4)
	};

	
	//
	// Surface Functions - Applications
	//
	//
	
	
	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {array} centrePoint - CentrePoint in [x,y,z] format	
	 * @param {float} radius - Radius of the Sphere 	 
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeSphere = function(centrePoint, radius){
		return new mObj_geom_Surface(  new verb.geom.SphericalSurface(centrePoint, radius) ) ;
		// topology : single surface - cant be exploded
		// brep : face -> surface (1); edges -> arc (1) ; vertex -> corner point (1)
		// revolution surface - will contain the same details
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {array} axis - Axis Direction of the cone in [x,y,z] format
	 * @param {array} xaxis - Direction of x-axis of cone in [x,y,z] format
	 * @param {float} base - Radius of cone base
	 * @param {float} height - Height of the cone
	 * @param {float} radius - Radius of cone
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeCone = function( axis,xaxis,base,height,radius ){
		return new mObj_geom_Surface( new verb.geom.ConicalSurface( axis,xaxis,base,height,radius ) ) ;
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {array} axis - Axis Direction of the cylinder in [x,y,z] format
	 * @param {array} xaxis - Direction of x-axis of cylinder in [x,y,z] format
	 * @param {float} base - Radius of cylinder base
	 * @param {float} height - Height of the cylinder
	 * @param {float} radius - Radius of cylinder
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeCylinder = function ( axis, xaxis, base, height, radius, capped ){
		if(capped){
			//return a solid			
		}
		else
			return new mObj_geom_Surface( new verb.geom.CylindricalSurface( axis,xaxis,base,height,radius ))  ;
	};
	
	//
	//	Solid Functions
	//
	//
	
	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {array} axis - Axis Direction of the cylinder in [x,y,z] format
	 * @param {array} xaxis - Direction of x-axis of cylinder in [x,y,z] format
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeBox = function( centrePoint, length, breadth, height){
		
		var allSurfaces = []; 
		
		var topFace = VIDAMO.makeSurfaceByCorners([length/2, height/2, breadth/2],[length/2, height/2, -breadth/2],[-length/2, height/2, -breadth/2],[-length/2, height/2, breadth/2]);
		var bottomFace = VIDAMO.makeSurfaceByCorners([length/2, -height/2, breadth/2],[length/2, -height/2, -breadth/2],[-length/2, -height/2, -breadth/2],[-length/2, -height/2, breadth/2]);
		var frontFace = VIDAMO.makeSurfaceByCorners([-length/2, -height/2, breadth/2],[length/2, -height/2, breadth/2],[ length/2, height/2, breadth/2],[ -length/2, height/2, breadth/2]);
		var backFace = VIDAMO.makeSurfaceByCorners([-length/2, -height/2, -breadth/2],[length/2, -height/2, -breadth/2],[ length/2, height/2, -breadth/2],[ -length/2, height/2, -breadth/2]);
		var rightFace = VIDAMO.makeSurfaceByCorners([length/2, -height/2, breadth/2],[length/2, -height/2, -breadth/2],[length/2, height/2, -breadth/2],[length/2, height/2, breadth/2]);
		var leftFace = VIDAMO.makeSurfaceByCorners([-length/2, -height/2, breadth/2],[-length/2, -height/2, -breadth/2],[-length/2, height/2, -breadth/2],[-length/2, height/2, breadth/2]);
		
		allSurfaces = [topFace, bottomFace, frontFace, backFace, leftFace, rightFace];
		
		return new mObj_geom_Solid( allSurfaces );
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {array} axis - Axis Direction of the cylinder in [x,y,z] format
	 * @param {array} xaxis - Direction of x-axis of cylinder in [x,y,z] format
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */	
	mod.makeTube = function( centrePoint, innerRadius, outerRadius, height){
		
	};	

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {array} axis - Axis Direction of the cylinder in [x,y,z] format
	 * @param {array} xaxis - Direction of x-axis of cylinder in [x,y,z] format
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */	
	mod.makeBRep = function( arrayOfSurfaces ){
		
	};

	//
	// Analysis Functions
	//
	//
	
	/**
	 * Returns a point on the surface at the given parameter values
	 * @param {MobiusDataObject} surface - MobiusDataObject with NURBS Surface
	 * @param {int} u - Parameter in u-direction
	 * @param {int} v - Parameter in v-direction
	 * @returns {array} point [x,y,z]
	 */
	mod.getPointOnSurface = function( surface, u, v ){
		var srf = surface.getGeometry();
		if(srf instanceof verb.geom.NurbsSurface)
			return srf.point( u, v );
		else
			return "Invalid Input"
	};

	/**
	 * Returns a point on the curve at the given parameter value
	 * @param {MobiusDataObject} curve - MobiusDataObject with NURBS Curve
	 * @param {int} t - Parameter in u-direction
	 * @returns {array} point [x,y,z]
	 */
	mod.getPointOnCurve = function( curve, t ){
		var crv = curve.getGeometry();
		if( crv instanceof verb.geom.NurbsCurve)
			return crv.point( t );
		else
			return "Invalid Input"
	};

	/**
	 * Returns an array of 't' values which divide the curve equally
	 * @param {MobiusDataObject} curve - MobiusDataObject with NURBS Curve
	 * @param {int} divisons - Number of divisions in which the curve should be divided
	 * @returns {array} curve parameters [t1, t2, t3 ...]
	 */
	mod.divideCurveByEqualArcLength = function( curve, divisions ){
		var crv = curve.getGeometry();
		var points = crv.divideByEqualArcLength( divisions )
			.map(function(u){ return ( u.u ); } );

		return points;
	};

	/**
	 * Returns an array of 't' values which divide the curve by length
	 * @param {MobiusDataObject} curve - MobiusDataObject with NURBS Curve
	 * @param {float} arcLength - Length 
	 * @returns {array} curve parameters [t1, t2, t3 ...]
	 */
	mod.divideCurveByArcLength = function( curve, arcLength ){
		var crv = curve.getGeometry();
		var points = crv.divideByArcLength( arcLength )
			.map(function(u){ return ( u.u ); } );

		return points; //convert these into vector points
	};

	/**
	 * Returns a tangent on the curve at the given parameter value
	 * @param {MobiusDataObject} curve - MobiusDataObject with NURBS Curve
	 * @param {int} t - Parameter in u-direction
	 * @returns {array} tangent [x,y,z]
	 */
	mod.getTangentAtCurveParameter = function( curve, t ){
		var crv = curve.getGeometry();
		if( crv instanceof verb.geom.NurbsCurve)
			return crv.tangent(t);
		else
			return 'Invalid Input';
	};

	/**
	 * Returns a tangent on the surface at the given parameter values
	 * @param {MobiusDataObject} surface - MobiusDataObject with NURBS Surface
	 * @param {int} u - Parameter in u-direction
	 * @param {int} v - Parameter in v-direction
	 * @returns {array} tangent [x,y,z]
	 */
	mod.getNormalAtSurfaceParameter = function( surface, u, v ){
		var srf = surface.getGeometry();
		if(srf instanceof verb.geom.NurbsSurface)
			return srf.normal( u, v);
		else
			return 'Invalid Input';
	};


	/**
	 * Subdivides a surface into smaller surfaces
	 * @param {MobiusDataObject} surface - MobiusDataObject with NURBS Surface
	 * @param {int} ugrid - Divisions in u-direction
	 * @param {int} vgrid - Divisions in v-direction
	 * @returns {array} Array of MobiusDataObjects with NURBS Surfaces
	 */
	mod.makeMeshBySubdivision = function( mObj, ugrid, vgrid ){

		var srf = mObj.getGeometry(); 
		
		if(srf instanceof verb.geom.NurbsSurface){
			var div_surfaces = [], gridPoints = [];
			var uincr = 1/ugrid;
			var vincr = 1/vgrid;

			//for uv lines
			for(var i=0; i <= ugrid; i++){
				for(var seg=0; seg <= vgrid; seg++)
					gridPoints.push(srf.point(i*uincr, seg*vincr)); 
			}

			// creation of polygons from the gridPoints
			for(var i=0; i< gridPoints.length-vgrid-2; i++){
				if((i+vgrid+2)%(vgrid+1) != 0 || i==0){
					// construction of the verbs four point surface
					var mbObj =  new mObj_geom_Surface( new verb.geom.NurbsSurface.byCorners(gridPoints[i], gridPoints[i+1],  gridPoints[i+vgrid+2], gridPoints[i+vgrid+1]) );
					div_surfaces.push(mbObj); 
				}
			}

			return div_surfaces
		}
		else
			return "Invalid Input"
	};

	/**
	 * Creates a tube of a given radius, from a given line
	 * @param {MobiusDataObject} line - MobiusDataObject with NURBS Line
	 * @param {float} radius - Radius of the tube
	 * @returns {MobiusDataObject} MobiusDataObject with NURBS Surface
	 */
	mod.makeTubeByLine = function( mObj, radius ){

		var line = mObj.getGeometry();

		var start = line.start();
		var end = line.end();

		var axis = [start[0] - end[0], start[1] - end[1], start[2] - end[2]]
			, height = 1 //this is a multiplying factor to the axis vector
			, radius = radius;

		//construction of a perpendicular vector
		var xaxis = [1, 1, 1];
		if(axis[0] * axis[1] * axis[2] != 0)
			xaxis = [ -axis[1]/axis[0], 1, 0]
		else if(axis.reduce(function(n, val) {
				return n + (val === 0);
			}, 0) > 1)
			xaxis = [0, 0, 0]
		else{
			//is there a better way??
			var flag = 0
			xaxis[axis.indexOf(0)] = 0
			for(var i=0; i < 3; i++){
				if(xaxis[i] == 0)
					continue;
				else if(!flag)
					flag = axis[i]
				else
					xaxis[i] = -(flag/axis[i])
			}
		}

		var tube = new verb.geom.CylindricalSurface( axis, xaxis, end, height, radius );

		return new mObj_geom_Surface( tube );
	};

	/**
	 * Gives the corner points of a surface
	 * @param {MobiusDataObject} surface - MobiusDataObject with NURBS Surface
	 * @returns {array} Array of Points [ [corner1], [corner2], [corner3], [corner4] ], where corner is of form - [x, y, z]
	 */
	mod.getCornerPointsFromSurface = function( mObj ){

		var polygon = mObj.getGeometry();

		return [
			polygon.point(0,0),
			polygon.point(1,0),
			polygon.point(1,1),
			polygon.point(0,1)]
	};

	/**
	 * Makes a point from the coordinates
	 * @param {float} x - X Coordinate of the point
	 * @param {float} y - Y Coordinate of the point
	 * @param {float} z - Z Coordinate of the point
	 * @returns {array} Point of form - [x, y, z]
	 */
	mod.makePoint = function(x, y, z){
		return [x, y, z];
	};

	/*
	 *
	 *	Transformation Functions
	 *
	 */

	/**
	 * Creates a unique copy of the object with the same geometry, transformations, material and data
	 * @param {MobiusDataObject} mObj - Object to be cloned
	 * @param {float} xCoord - x-coordinate of the point where the clone appears
	 * @param {float} yCoord - y-coordinate of the point where the clone appears
	 * @param {float} zCoord - z-coordinate of the point where the clone appears
	 * @returns {MobiusDataObject} Cloned object
	 */
	mod.makeCopy = function(mObj, xCoord, yCoord, zCoord){

		// for output cloning
		if( mObj.getGeometry == undefined ){
			console.log("Non-Mobius passed to copy function");
			return mObj;
		}
		
		var clone = new Object();
		return Object.assign( clone, mObj );
		
		// var new_mObj = new MobiusDataObject( mObj.getGeometry() );
		
		// attach data
		// if(mObj.data != undefined)
			// VIDAMO.addData(new_mObj, mObj.data);

		// if verbs object, has to be copied and translated
		// if(mObj.getGeometry() instanceof verb.geom.NurbsCurve || mObj.getGeometry() instanceof verb.geom.NurbsSurface){
			// if(xCoord != undefined && yCoord != undefined && zCoord != undefined)
				// VIDAMO.moveObjectToPoint(new_mObj, xCoord, yCoord, zCoord);
		// }
		
		// return new_mObj; //needs to be sorted out
	};

	/**
	 * Shifts the object relative to its current position
	 * @param {MobiusDataObject} mObj - Object to be moved
	 * @param {float} shiftX - Distance to be moved in x-direction
	 * @param {float} shiftY - Distance to be moved in y-direction
	 * @param {float} shiftZ - Distance to be moved in z-direction
	 * @returns Null
	 */
	mod.shiftObject = function(mObj, shiftX, shiftY, shiftZ){

		// could be a face too

		// if extractGeometry is called again, the translations would  be lost ..
		// original geometry interactions will not follow the translations - csg is ok, because that derieves from three.js itself
		var geometry = mObj.getGeometry(); 
		if(geometry instanceof verb.geom.NurbsCurve || geometry instanceof verb.geom.NurbsSurface){

			var mat = [ [1,0,0, shiftX],
							[0,1,0,shiftY],
								[0,0,1, shiftZ],
									[0,0,0,1]
						];
			var transformedGeometry = geometry.transform( mat );
			mObj.setGeometry(transformedGeometry); 
		}
		
		//return mObj;
	};

	/**
	 * Moves the object to a target point
	 * @param {MobiusDataObject} mObj - Object to be moved
	 * @param {float} xCoord - x-coordinate of the target point where the clone appears
	 * @param {float} yCoord - y-coordinate of the target point where the clone appears
	 * @param {float} zCoord - z-coordinate of the target point where the clone appears
	 * @returns Null
	 */
	mod.moveObjectToPoint = function(mObj, xCoord, yCoord, zCoord){


		// if extractGeometry is called again, the translations would  be lost ..
		// original geometry interactions will not follow the translations - csg is ok, because that derieves from three.js itself
		
		if(mObj.getGeometry() instanceof verb.geom.NurbsCurve || mObj.getGeometry() instanceof verb.geom.NurbsSurface){
			
			var orCenter = VIDAMO.getCentre(mObj);
			
			// translation required
			var target = [xCoord, yCoord, zCoord];
			var tx = target[0] - orCenter[0];
			var ty = target[1] - orCenter[1];
			var tz = target[2] - orCenter[2]; 
			
			VIDAMO.shiftObject( mObj, tx, ty, tz );		
		}
	};

	/**
	 * Scales the object along different axes
	 * @param {MobiusDataObject} mObj - Object to be scaled
	 * @param {float} scaleX - Scaling-factor along the x-direction; Should be set to '1' if no scaling is required.
	 * @param {float} scaleY - Scaling-factor along the y-direction; Should be set to '1' if no scaling is required.
	 * @param {float} scaleZ - Scaling-factor along the z-direction; Should be set to '1' if no scaling is required.
	 * @returns Null
	 */
	mod.scaleObject = function(mObj, scaleX, scaleY, scaleZ){
			
		// if extractGeometry is called again, the translations would  be lost ..
		// original geometry interactions will not follow the translations - csg is ok, because that derieves from three.js itself
		var geom = mObj.getGeometry();
		if(geom instanceof verb.geom.NurbsCurve || geom instanceof verb.geom.NurbsSurface){

			var centre = VIDAMO.getCentre(mObj);
			
			var mat = [ [scaleX, 0, 0, 0],
							[0,scaleY,0,0],
								[0,0,scaleZ,0],
									[0,0,0,1]
						];
			
			mObj.setGeometry(  geom.transform(mat) );
			
			// shift to original centre point
			VIDAMO.moveObjectToPoint(mObj, centre[0], centre[1], centre[2]);

		}
	};

	/**
	 * Rotates the object about different axes
	 * @param {MobiusDataObject} mObj - Object to be rotated
	 * @param {float} xAxis - Angle (in Radians) about x-axis
	 * @param {float} yAxis - Angle (in Radians) about y-axis
	 * @param {float} zAxis - Angle (in Radians) about z-axis
	 * @returns Null
	 */
	mod.rotateObject = function(mObj, xAxis, yAxis, zAxis){

		var geom = mObj.getGeometry();
		if(geom instanceof verb.geom.NurbsCurve || geom instanceof verb.geom.NurbsSurface){

			var centre = VIDAMO.getCentre(mObj);
			
			var mat_x = [ [1, 0, 0, 0],
							[0,	Math.cos(xAxis), -Math.sin(xAxis),0],
								[0,	Math.sin(xAxis), Math.cos(xAxis),0],
									[0,0,0,1]
						];
						
			var mat_y = [ [Math.cos(yAxis), 0, Math.sin(yAxis), 0],
							[0,1,0,0],
								[-Math.sin(yAxis), 0, Math.cos(yAxis),0],
									[0,0,0,1]
						];
						
			var mat_z = [ [Math.cos(zAxis), -Math.sin(zAxis), 0, 0],
							[Math.sin(zAxis),	Math.cos(zAxis),0,	0],
								[0,	0,	1,	0],
									[0,	0,	0,	1]
						];
			
			geom = geom.transform(mat_x);
			geom = geom.transform(mat_y);
			geom = geom.transform(mat_z);
			mObj.setGeometry( geom );
			
			// shift to original centre point
			VIDAMO.moveObjectToPoint(mObj, centre[0], centre[1], centre[2]);
		}
	};


	/*
	 *	Data Functions
	 *	Input: MobiusDataObject or Topology Object; Output: Modified Object
	 *
	 */

	/**
	 * Adds material to an object
	 * @param {MobiusDataObject} obj - Object to which material is to be added
	 * @param {String} material_type - "MeshBasicMaterial", "MeshNormalMaterial", "MeshLambertMaterial", "LineBasicMaterial" etc... 
	 * @param {boolean} wireframe - 'True' if wireframe is required. 
	 * @param {hexCode} color - Hex Code of the color
	 * @param {boolean} transparent - 'True' if transparency is required. 
	 * @returns null
	 */
	mod.addMaterial = function(obj, material_type, wireframe, color, transparent){
		var option = {	wireframe: wireframe,
			color: color,
			transparent: transparent,
			side: THREE.DoubleSide
		};
		var material = new THREE[material_type](option);
		if(obj.constructor === Array){
			for(var i=0; i<obj.length; i++)
				obj[i].setMaterial(material);
		}else
			obj.setMaterial(material);

		return obj;
	};

	/**
	 * Adds data to an object
	 * @param {MobiusDataObject} obj - Object to which data is to be added
	 * @param {String} dataName - Name of the property
	 * @param {String / int / object ... } dataValue - Value of the property
	 * @returns null
	 */
	mod.addData = function(obj, dataName, dataValue){

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


	//Could be shifted to MobiusSide

	mod.dataConversion = function(data){

		for(var i = 0; i < data.length; i++) {
			for (var m in data[i].value) {

				if (data[i].value[m] !== undefined) {

					if (data[i].value[m].constructor !== Array) {
						extract(data[i].value[m],
							data[i].geom,
							data[i].geomData);
					}
					else {
						var tempGeom = [];
						var tempData = [];

						for (var n = 0; n < data[i].value[m].length; n++) {

							extract(data[i].value[m][n],
								tempGeom,
								tempData);
						}
						data[i].geom.push(tempGeom);
						data[i].geomData.push(tempData);
					}
					console.log(data[i].geom);

				}
			}
		}

		function extract (obj,geom,geomData){
			if(obj.constructor === Array){
				var tempGeom0 = [];
				var tempData0 = [];

				for(var k = 0; k < obj.length ; k++){
					extract(obj[k],tempGeom0,tempData0);
				}

				geom.push(tempGeom0);
				geomData.push(tempData0);
			}
			else if(obj instanceof  mObj_geom_Curve || 
					obj instanceof mObj_geom_Surface ||
					obj instanceof mObj_geom_Solid ){ 
				geom.push( obj.extractThreeGeometry() );
				geomData.push( obj.extractData() );
			}else{
				for(var key in obj){
					extract(obj[key],geom,geomData);
				}
			}
		}

		return data;
	};

	return mod;

})(window.VIDAMO || {});








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


//
//	Function to convert module geometry into three.js Mesh geometry
//  Add another if-else condition for each new geometry
//
var convertGeomToThree = function( geom ){

	// internal function
	convertToThree = function(singleDataObject){

		if( singleDataObject instanceof verb.geom.NurbsSurface )
			return ( new THREE.Mesh( singleDataObject.toThreeGeometry() ) );
		else if( singleDataObject instanceof verb.geom.NurbsCurve )
			return ( new THREE.Line( singleDataObject.toThreeGeometry() ) );
		else if(singleDataObject instanceof verb.geom.Point){

			var default_material_pointFromThree = new THREE.PointCloudMaterial( { size: 5, sizeAttenuation: false } );
			var dotGeometry = new THREE.Geometry();
			dotGeometry.vertices.push( new THREE.Vector3(singleDataObject[0], singleDataObject[1], singleDataObject[2]) );
			return new THREE.PointCloud( dotGeometry, default_material_pointFromThree );
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
	var dotGeometry = new THREE.Geometry(); console.log(topology);
	for(var v = 0; v < topology.vertices.length; v++){
		var vertex = topology.vertices[v]
		dotGeometry.vertices.push( new THREE.Vector3(vertex[0], vertex[1], vertex[2]) );
	}
	var allVertices = new THREE.Points( dotGeometry, topoPointMaterial );
	topo.add(allVertices);

 	
	// convert edges
	for(var e = 0; e < topology.edges.length; e++){ console.log('this is a face', f);
		var edge = convertGeomToThree(topology.edges[e].getGeometry());
		topo.add(edge);
	}

	// convert faces
	for(var f = 0; f < topology.faces.length; f++){ console.log('this is a face', f);
		var face = convertGeomToThree(topology.faces[f].getGeometry());
		topo.add(face);
	} 

	return topo;

}

//
//	Takes native geometry ( geometry from module ) and converts it into native topology - edges, faces, vertices
//
var computeTopology = function( mObj ){

	var geom = mObj.getGeometry(); 
	var topology = {};


	if(geom instanceof verb.geom.NurbsCurve){
		topology.vertices = [ geom.point(0) , geom.point(1) ];
		topology.edges = mObj;
		topology.faces = [];
	}	
	else if(geom instanceof verb.geom.NurbsSurface){
		topology.vertices = [geom.point(0,0), geom.point(1,0), geom.point(1,1), geom.point(0,1)];
		topology.edges = geom.boundaries().map( function( boundary ) { return new mObj_geom_Curve( boundary )} );
		topology.faces = mObj;
	}	
	else if(geom instanceof Array){
		// means it is a solid - collection of surfaces
		topology.vertices = [];
		topology.edges = [];
		topology.faces = [];

		for(var srf=0; srf < geom.length; srf++){
			var subTopo = computeTopology(geom[srf]);
			topology.faces.concat(subTopo.faces);
			topology.edges.concat(subTopo.edges);
			topology.vertices.concat(subTopo.vertices);		
		}
	}
	else
		topology = undefined;	

	return topology;
}