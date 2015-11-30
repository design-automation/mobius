/**
 * Mobius Module
 *
 *  @module open to edit
 */


( function (mod){

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
/*	mod.rgbToHex = function(red, green, blue){
		
		return '0x'+toHex(red)+toHex(green)+toHex(blue);
			
		function toHex(n) {
			 n = parseInt(n,10);
			 if (isNaN(n)) return "00";
			 n = Math.max(0,Math.min(n,255));
			 return "0123456789ABCDEF".charAt((n-n%16)/16)
				  + "0123456789ABCDEF".charAt(n%16);
		}
	};*/
	
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
	 * @param {array} mObj - MobiusDataObject containing Nurbs Geometry or 3D Geometry
	 * @returns {array} Point - [x, y, z]
	 */
	mod.getCentre = function(mObj){
		//calculate centre based on what kind of object
		var geometry = mObj.geometry;

		if(geometry instanceof verb.geom.NurbsCurve)
			return geometry.point(0.5);
		else if(geometry instanceof verb.geom.NurbsSurface)
			return geometry.point(0.5, 0.5);
		else if(geometry instanceof THREE.Geometry)
			return geometry.center();
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

		if(point1.geometry instanceof THREE.Vector3 && point2.geometry instanceof THREE.Vector3){
			pnt1 = point1.geometry;
			pnt2 = point2.geometry;
			deltaX = pnt1.x - pnt2.x;
			deltaY = pnt1.y - pnt2.y;
			deltaZ = pnt1.z - pnt2.z;
		}
		else if(point1.constructor === Array && point2.constructor === Array){
			deltaX = point1[0] - point2[0];
			deltaY = point1[1] - point2[1];
			deltaZ = point1[2] - point2[2];
		}
		else
			return "Invalid Input"

		var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
		return distance;
	};

	/**
	 * Returns the length of a MobiusDataObject containing a PositionVector or a NURBS Curve
	 * @param {MobiusDataObject} mObj - PositionVector or NURBS Curve
	 * @returns {float} Length 
	 */
	mod.getLength = function( mObj ){
		var geom = mObj.geometry;
		return geom.length();
	};


	/*
	 *
	 * Verbs Functions
	 * Input - according to requirements, Output - MobiusDataObject with NURBS Geometry
	 *
	 */

	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {array} startPoint - Starting point of the line in [x,y,z] format
	 * @param {array} endPoint - Ending point of the line in [x,y,z] format	 
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeLine = function(startPoint, endPoint){
		// input variations
		// start, end could be a vector3 - has to be converted into an array

		return new MobiusDataObject( new verb.geom.Line(startPoint, endPoint) );
		
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
		return new MobiusDataObject( new verb.geom.Arc(centerPoint,xaxis,yaxis,radius,minAngle,maxAngle) );
		
		// topology : curve class
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {array} points - Array of Control Points for the Bezier Curve ( [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3], [x4, y4, z4], ...] )
	 * @param {array} weights - Weights
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeBezierCurve = function(points, weights){
		// points could be vector3
		return new MobiusDataObject( new verb.geom.BezierCurve(points, weights) );
		
		// topology : curve class
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
		return new MobiusDataObject( new verb.geom.Circle(centerPoint,xaxis,yaxis,radius) );
		
		// topology : curve class
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {array} centerPoint - Centre point of the Ellipse in [x,y,z] formats
	 * @param {array} xaxis - Direction of X-Axis of the Ellipse in [x,y,z] format; Length of this vector determines length of x-Axis of ellipse;
	 * @param {array} yaxis - Direction of Y-Axis of the Ellipse in [x,y,z] format; Length of this vector determines length of y-Axis of ellipse;
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeEllipse = function ( centerPoint ,xaxis,yaxis ){
		return new MobiusDataObject( new verb.geom.Ellipse( centerPoint,xaxis,yaxis ) );
		
		// topology : curve class
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
		return new MobiusDataObject( new verb.geom.EllipseArc( centerPoint,xaxis,yaxis,minAngle,maxAngle ) );
		
		// topology : curve class
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Curve
	 * @param {array} points - Array of points through which the curve passes ( [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3], [x4, y4, z4], ...] )
	 * @param {int} degree - Degree of the Curve
	 * @returns {MobiusDataObject}  - NURBS Curve
	 */
	mod.makeCurveByPoints = function( points, degree ){
		return new MobiusDataObject( new verb.geom.NurbsCurve.byPoints( points, degree ) );
		
		// topology : curve class
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
		return new MobiusDataObject( new verb.geom.NurbsCurve.byKnotsControlPointsWeights( degree,knots,controlPoints,weights ) );
		
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
		return new MobiusDataObject( new verb.geom.NurbsSurface.byKnotsControlPointsWeights( degreeU,degreeV,knotsU,knotsV,controlPoints,weights ) );
		
		// topology : single surface - cant be exploded
		// brep : face -> surface (1); edges -> boundaries (4) ; vertex -> corner points (4)
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {array} point - Corner points in [x,y,z] format
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeSurfaceByCorners = function ( point0, point1, point2, point3 ){
		return new MobiusDataObject( new verb.geom.NurbsSurface.byCorners ( point0,point1,point2,point3 ) );
		
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
	mod.makeSurfaceByRevolution = function ( mObj, centerPoint, axis, angle ){
		var profile = mObj.geometry;
		return new MobiusDataObject( new verb.geom.RevolvedSurface( profile, centerPoint, axis, angle )  );
		
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
		var profile = mObjProfile.geometry;
		var rail = mObjRail.geometry;
		return new MobiusDataObject( new verb.geom.SweptSurface ( profile, rail ) );
		
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
		var curves = [];
		for(var c=0; c<listOfCurves.length; c++)
			curves.push(listOfCurves[c].geometry); demoC = curves;
		return new MobiusDataObject( new verb.geom.NurbsSurface.byLoftingCurves( curves, deg ) );
		
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
		var profile = mObjProfile.geometry;
		return new MobiusDataObject( new verb.geom.ExtrudedSurface( profile, direction ) );
		
		// topology : single surface - cant be exploded
		// brep : face -> surface (1); edges -> boundaries (4) ; vertex -> corner points (4)
	};

	/**
	 * Returns a MobiusDataObject containing a NURBS Surface
	 * @param {array} centrePoint - CentrePoint in [x,y,z] format	
	 * @param {float} radius - Radius of the Sphere 	 
	 * @returns {MobiusDataObject}  - NURBS Surface
	 */
	mod.makeSurfaceAsSphere = function(centrePoint, radius){
		return new MobiusDataObject( new verb.geom.SphericalSurface(centrePoint, radius) );
		
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
	mod.makeSurfaceAsCone = function( axis,xaxis,base,height,radius ){
		return new MobiusDataObject( new verb.geom.ConicalSurface( axis,xaxis,base,height,radius ) );
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
	mod.makeSurfaceAsCylinder = function ( axis, xaxis, base, height, radius ){
		return new MobiusDataObject( new verb.geom.CylindricalSurface( axis,xaxis,base,height,radius ) );
	};

	/**
	 * Returns a point on the surface at the given parameter values
	 * @param {MobiusDataObject} surface - MobiusDataObject with NURBS Surface
	 * @param {int} u - Parameter in u-direction
	 * @param {int} v - Parameter in v-direction
	 * @returns {array} point [x,y,z]
	 */
	mod.getPointOnSurface = function( surface, u, v ){
		var srf = surface.geometry;
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
		var crv = curve.geometry;
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
		var crv = curve.geometry;
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
		var crv = curve.geometry;
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
		var crv = curve.geometry;
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
		var srf = surface.geometry;
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

		var surface = mObj.geometry;

		if(surface instanceof verb.geom.NurbsSurface){
			var div_surfaces = [], gridPoints = [];
			var uincr = 1/ugrid;
			var vincr = 1/vgrid;

			//for uv lines
			for(var i=0; i <= ugrid; i++){
				for(var seg=0; seg <= vgrid; seg++)
					gridPoints.push(surface.point(i*uincr, seg*vincr));
			}

			// creation of polygons from the gridPoints
			for(var i=0; i< gridPoints.length-vgrid-2; i++){
				if((i+vgrid+2)%(vgrid+1) != 0 || i==0){
					// construction of the verbs four point surface
					var mbObj = new MobiusDataObject( new verb.geom.NurbsSurface.byCorners(gridPoints[i], gridPoints[i+1],  gridPoints[i+vgrid+2], gridPoints[i+vgrid+1]) )
					div_surfaces.push(mbObj)
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

		var line = mObj.geometry;

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

		return new MobiusDataObject( tube );
	};

	/**
	 * Gives the corner points of a surface
	 * @param {MobiusDataObject} surface - MobiusDataObject with NURBS Surface
	 * @returns {array} Array of Points [ [corner1], [corner2], [corner3], [corner4] ], where corner is of form - [x, y, z]
	 */
	mod.getCornerPointsFromSurface = function( mObj ){

		var polygon = mObj.geometry;

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
	 * Three.js Geometry Functions
	 * Input - according to requirements, Output - MobiusDataObject with Three.js or ThreeBSP geometry
	 *
	 */

	/**
	 * Creates a vector for a point
	 * @param {float} x - X Coordinate of the point OR {array} [x,y,z] - Point form
	 * @param {float} y - Y Coordinate of the point
	 * @param {float} z - Z Coordinate of the point
	 * @returns {MobiusDataObject} Containing vector from origin to point
	 */
	mod.makePositionVector = function(x, y, z){
		if(x.constructor === Array && y == undefined && z == undefined)
			return new MobiusDataObject( new THREE.Vector3( x[0], x[1], x[2] ));
		else
			return new MobiusDataObject( new THREE.Vector3(x, y, z));
	};

	/**
	 * Returns an array of position vectors from an array of points
	 * @param {array} list_of_points - Array of points of form - [ [ point1 ], [ point2 ], [ point3 ] ... ] where points are of form [x, y, z]
	 * @returns {array} Array of MobiusDataObjects containing position vectors
	 */
	mod.makePositionVectorsFromPoints = function( list_of_points ){
		var mObjArr = [];
		for(var i=0; i<list_of_points.length; i++){
			var obj = new MobiusDataObject( new THREE.Vector3(list_of_points[i][0], list_of_points[i][1], list_of_points[i][2]));
			mObjArr.push(obj);
		}
		return mObjArr;
	};

	/**
	 * Creates a circle of a given radius and resolution
	 * @param {float} radius - Radius of the circle
	 * @param {int} segments - Number of segments 
	 * @returns {MobiusDataObject} MobiusDataObject containing CircleGeometry
	 */
	mod.makeCircle = function(radius, segments){
		return new MobiusDataObject( new THREE.CircleGeometry( radius, segments ));
	};

	/**
	 * Creates a cylinder
	 * @param {float} radiusTop - Radius of the top of the cylinder
	 * @param {float} radiusBottom - Radius of the bottom of the cylinder
	 * @param {float} height - Height of the cylinder
	 * @param {float} radiusSegments - Segments in the radius of the cylinder
	 * @param {float} heightSegments - Segments in the height of the cylinder
	 * @param {boolean} openEnded - True or False value - if the cylinder is open at the ends
	 * @returns {MobiusDataObject} MobiusDataObject with CylinderGeometry
	 */
	mod.makeCylinder = function(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded ){
		return new MobiusDataObject( new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded ));
	};

	/**
	 * Creates a polyline from an array of points
	 * @param {array} arrOfPoints - Array of points of the form - [[x,y,z], [x,y,z], [x,y,z], [x,y,z] ...]
	 * @returns {MobiusDataObject} MobiusDataObject with Polyline (Vertice Geometry)
	 */
	mod.makePolyline = function(arrOfPoints){
		var pline = new THREE.Geometry();

		for(var point=0; point < arrOfPoints.length; point++)
			pline.vertices.push(new THREE.Vector3(arrOfPoints[point][0], arrOfPoints[point][1], arrOfPoints[point][2]));

		return new MobiusDataObject( pline );
	};


	/**
	 * Creates a box from the length, breadth and height
	 * @param {float} length - Length of the box
	 * @param {float} breadth - Breadth of the box
	 * @param {float} height - Height of the box
	 * @returns {MobiusDataObject} MobiusDataObject with BoxGeometry
	 */
	mod.makeBox = function(length, breadth, height){
		return new MobiusDataObject ( new THREE.BoxGeometry( length, breadth, height ) ) ;
	};

	/**
	 * Creates a Sphere of a given radius
	 * @param {radius} length - Length of the box
	 * @returns {MobiusDataObject} MobiusDataObject with SphereGeometry
	 */
	mod.makeSphere = function(radius){
		return new MobiusDataObject ( new THREE.SphereGeometry( radius , 32, 32) ) ;
	};

	/**
	 * Creates a polygon from 2D points - points have to be specified in anticlockwise direction
	 * @param {array} pointsXY - Array of 2D Points of form - [ [x,y], [x,y], [x,y], [x,y] ...]
	 * @returns {MobiusDataObject} MobiusDataObject with ShapeGeometry
	 */
	mod.makePolygonByPoints = function( pointsXY ){

		// shape creation
		var customShape = new THREE.Shape();
		customShape.moveTo(pointsXY[0], pointsXY[1]);
		for(var pointNo=1; pointNo < pointsXY.length; pointNo++)
			customShape.lineTo(pointsXY[pointNo][0], pointsXY[pointNo][1]);
		customShape.lineTo(pointsXY[0][0], pointsXY[0][1]);

		return new MobiusDataObject ( customShape );
	};

	/**
	 * Creates an extrusion from a polygon
	 * @param {MobiusDataObject} mObj - MobiusDataObject containing ShapeGeometry
	 * @param {float} thickness - Amount of extrusion
	 * @param {boolean} bevel - True or False for bevel or not
	 * @param {array} pathPoints -  Array of points of form [[x, y, z], [x, y, z] [x, y, z], ...] which specifies the path along which the polygon has to be extruded
	 * @returns {MobiusDataObject} MobiusDataObject with ExtrudeGeometry
	 */
	mod.extrudePolygon = function(mObj, thickness, bevel, pathPoints ){

		//mObj has to have shape  :/
		var shape = mObj.geometry;
		
		pathPoints = pathPoints || [];


		if( shape instanceof THREE.Shape ){
			var extrudeSettings = { amount: thickness, 
									bevelEnabled: bevel, 
									bevelSegments: 2, 
									steps: 2, 
									bevelSize: 1, 
									bevelThickness: 1 };
			
			// path method - object has to be centred about origin for the extrusion to work correctly - rotation is going to be arbitary
			if(pathPoints.length){
				var path;
				if(pathPoints.length == 2){
					// it's a line
					path = new THREE.LineCurve3(new THREE.Vector3( pathPoints[0][0], pathPoints[0][1], pathPoints[0][2]), 
												new THREE.Vector3( pathPoints[1][0], pathPoints[1][1], pathPoints[1][2]));
				} else{
					//path is a curve
					path = new THREE.Curve(); 
				}
				
				extrudeSettings.extrudePath = path;
			}
				
			var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
			
			// shear method - inaccurate results
			// if(direction != undefined){ console.log("inside direction", direction);
				 //applying shear matrix according to extrude in direction specified
				 // var matrix = new THREE.Matrix4();
				 // var Syx = direction.x / direction.y,
				 // Syz = direction.z / direction.y;
				 // matrix.set(   1,   Syx,   0,   0,
				 // 0,     1,   0,   0,
				 // 0,   Syz,   1,   0,
				 // 0,     0,   0,   1  );
				 // geometry.applyMatrix( matrix ); 
			// }

			return new MobiusDataObject( geometry );
		}
		else
			return "Invalid Input. Please input polygon"

	};

	/**
	 * Creates a Lathe from an array of points
	 * @param {array} points - Array of Points of form - [ [x,y,z], [x,y,z], [x,y,z], [x,y,z] ...]
	 * @param {int} segments - Number of segments in the Lathe
	 * @returns {MobiusDataObject} MobiusDataObject with LatheGeometry
	 */
	mod.makeLathe = function( points, segments ){
		var pts = [];
		for(var i=0; i<points.length; i++)
			pts.push(new THREE.Vector3(points[i][0], points[i][1], points[i][2]))
		return new MobiusDataObject( new THREE.LatheGeometry( pts, segments ) );
	};

	/**
	 * Creates a plane from the width and height
	 * @param {float} width - Width of the plane
	 * @param {float} height - Height of the plane
	 * @returns {MobiusDataObject} MobiusDataObject with PlaneGeometry
	 */
	mod.makePlane = function( width, height ){
		return new MobiusDataObject( new THREE.PlaneGeometry( width, height, 1) );
	};

	/**
	 * Creates a polyhedron geometry 
	 * @param {array} 
	 * @param {array} 
	 * @returns {MobiusDataObject} MobiusDataObject with PolyhedronGeometry
	 */
	mod.makePolyhedron = function( verticesOfCube, indicesOfFaces ){
		return new MobiusDataObject( new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 6, 2 ) );
	};

	/**
	 * Creates a 2D Ring Shape
	 * @param {float} innerRadius - Radius of the hollow portion of the ring
	 * @param {float} outerRadius - External radius of the ring
	 * @param {int} segments - Determines resolution
	 * @returns {MobiusDataObject} MobiusDataObject with 2D Ring Geometry
	 */
	mod.make2DRing = function( innerRadius, outerRadius, segments ){
		return new MobiusDataObject( new THREE.RingGeometry( innerRadius, outerRadius, segments ) );
	};

	/**
	 * Creates a Tetrahedron
	 * @param {float} radius - Radius of the tetrahedron
	 * @returns {MobiusDataObject} MobiusDataObject with TetrahedronGeometry
	 */
	mod.makeTetrahedron = function( radius ){
		return new MobiusDataObject( new THREE.TetrahedronGeometry( radius ) );
	};

	/**
	 * Creates a Torus Geometry
	 * @param {float} radius - Radius of the hollow portion of the ring
	 * @param {float} tube - 
	 * @param {int} radialSegments - Determines resolution in radial direction
	 * @param {int} tubularSegments - Determines resolution in tubular direction
	 * @returns {MobiusDataObject} MobiusDataObject with TorusGeometry
	 */
	mod.makeTorus = function(radius, tube, radialSegments, tubularSegments){
		return new MobiusDataObject( new THREE.TorusGeometry( radius, tube, radialSegments, tubularSegments ) );
	};

	/**
	 * Creates a Torus Knot Geometry
	 * @param {float} radius - Radius of the hollow portion of the ring
	 * @param {float} tube - 
	 * @param {int} radialSegments - Determines resolution in radial direction
	 * @param {int} tubularSegments - Determines resolution in tubular direction
	 * @returns {MobiusDataObject} MobiusDataObject with TorusKnotGeometry
	 */
	mod.makeTorusKnot = function( radius, tube, radialSegments, tubularSegments ){
		return new MobiusDataObject( new THREE.TorusKnotGeometry(radius, tube, radialSegments, tubularSegments) );
	};

	/**
	 * Extracts the point from a position vector
	 * @param {MobiusDataObject} positionVector - Converts position vector object back to point form
	 * @returns {array} Point of form [x, y, z]
	 */
	mod.getPointFromPositionVector = function( positionVector ){
		var pos = positionVector.geometry;
		return [ pos.x, pos.y, pos.z ];
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
		if( mObj.geometry == undefined ){
			console.log("Non-Mobius passed to copy function");
			return mObj;
		}
		
		var new_mObj = new MobiusDataObject( mObj.geometry );
		
		// attach data
		if(mObj.data != undefined)
			VIDAMO.addData(new_mObj, mObj.data);

		// if verbs object, has to be copied and translated
		if(mObj.geometry instanceof verb.geom.NurbsCurve || mObj.geometry instanceof verb.geom.NurbsSurface){
			if(xCoord != undefined && yCoord != undefined && zCoord != undefined)
				VIDAMO.moveObjectToPoint(new_mObj, xCoord, yCoord, zCoord);
		}else{
				// only required if it's a three.js object - to get the transformations on it
				var new_mObjMesh = new_mObj.extractGeometry( mObj.extractGeometry().clone() ); // sets the extractGeometry according to the original object
				new_mObjMesh.position.x = xCoord;
				new_mObjMesh.position.y = yCoord;
				new_mObjMesh.position.z = zCoord;
				new_mObjMesh.is_mObj = true; // because the mesh is not regenerated - and clone doesn't clone own properties - fix this later
		}
		
		return new_mObj; //needs to be sorted out
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

		if(mObj.geometry instanceof verb.geom.NurbsCurve || mObj.geometry instanceof verb.geom.NurbsSurface){
			var geometry = mObj.geometry; 
			var mat = [ [1,0,0, shiftX],
							[0,1,0,shiftY],
								[0,0,1, shiftZ],
									[0,0,0,1]
						];
			var transformedGeometry = geometry.transform( mat );
			mObj.geometry = transformedGeometry; 
			mObj.geometryUpdated = true;
		}else{
				var mesh = mObj.extractGeometry();
			mesh.translateX(shiftX);
			mesh.translateY(shiftY);
			mesh.translateZ(shiftZ);
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
		
		if(mObj.geometry instanceof verb.geom.NurbsCurve || mObj.geometry instanceof verb.geom.NurbsSurface){
			
			var orCenter = VIDAMO.getCentre(mObj);
			
			// translation required
			var target = [xCoord, yCoord, zCoord];
			var tx = target[0] - orCenter[0];
			var ty = target[1] - orCenter[1];
			var tz = target[2] - orCenter[2]; 
			
			VIDAMO.shiftObject( mObj, tx, ty, tz );		
		} else
			mObj.extractGeometry().position.set(xCoord, yCoord, zCoord);	

		//return mObj;
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
		if(mObj.geometry instanceof verb.geom.NurbsCurve || mObj.geometry instanceof verb.geom.NurbsSurface){
			var geom = mObj.geometry;
			var centre = VIDAMO.getCentre(mObj);
			
			var mat = [ [scaleX, 0, 0, 0],
							[0,scaleY,0,0],
								[0,0,scaleZ,0],
									[0,0,0,1]
						];
			
			mObj.geometry = geom.transform(mat);
			
			// shift to original centre point
			VIDAMO.moveObjectToPoint(mObj, centre[0], centre[1], centre[2]);
			
			mObj.geometryUpdated = true;
		}else
			mObj.extractGeometry().scale.set(scaleX, scaleY, scaleZ);

		//return mObj;
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

		if(mObj.geometry instanceof verb.geom.NurbsCurve || mObj.geometry instanceof verb.geom.NurbsSurface){
			var geom = mObj.geometry;
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
			mObj.geometry = geom;
			
			// shift to original centre point
			VIDAMO.moveObjectToPoint(mObj, centre[0], centre[1], centre[2]);
			
			mObj.geometryUpdated = true;
		}else{
				// angles taken in radians
				var mesh = mObj.extractGeometry();
				mesh.rotateX(xAxis);
				mesh.rotateY(yAxis);
				mesh.rotateZ(zAxis);
		}
	};

	/**
	 * Creates a local coordinate system
	 * @returns {MobiusDataObject} Frame
	 */
	mod.makeFrame = function(){
		return new MobiusDataObject( new THREE.Object3D() );
	};

	/**
	 * Adds an object to the local coordinate system (frame)
	 * @param {MobiusDataObject} frame - Frame
	 * @param {MobiusDataObject} object - Object to be added to frame
	 * @returns Null
	 */
	mod.addToFrame = function( frame, object ){
		var frameRef = frame.geometry

		if(frameRef instanceof THREE.Object3D){

			frameRef.add(object.extractGeometry());
		}
		else
			console.log("Invalid Frame")
	};

	/**
	 * Points the z-axis of the object towards the point specified. 
	 * @param {MobiusDataObject} object - MobiusDataObject which needs to be re-oriented. Doesn't work with MobiusDataObjects containing NURBS geometry, currently. 
	 * @param {array} lookAtPoint - Target Point in form [x, y, z]
	 * @returns Null
	 */
	mod.orientObjectTowards = function( object, lookAtPoint ){

		var lookAtPt;

		if(lookAtPoint.constructor === Array)
			lookAtPt = new THREE.Vector3( lookAtPoint[0], lookAtPoint[1], lookAtPoint[2] );
		else if(lookAtPoint instanceof THREE.Vector3)
			lookAt = lookAtPt;

		object.extractGeometry().lookAt( lookAtPt );

		return object;
	};


	/*
	 *
	 * CSG Functions
	 * Input - MobiusDataObjects, Output - MobiusDataObject
	 *
	 */

	/**
	 * Performs union operation on MobiusDataObjects with non-NURBS Geometry
	 * @param {MobiusDataObject} mObj1 - MobiusDataObject with Non-NURBS Geometry
	 * @param {MobiusDataObject} mObj2 - MobiusDataObject with Non-NURBS Geometry
	 * @returns {MobiusDataObject} MobiusDataObject containing ThreeBSP Geometry
	 */
	mod.objectUnion = function( mObj1, mObj2 ){

		if(mObj1.geometry instanceof verb.geom.NurbsSurface || mObj2.geometry instanceof verb.geom.NurbsSurface)
			return "CSG functions currently only work with Three.js objects"

		var a = new ThreeBSP( mObj1.extractGeometry() );
		var b = new ThreeBSP( mObj2.extractGeometry() );

		var result;

		if(a.constructor !== Array){
			result = a.union( b );
		}

		return new MobiusDataObject( result );
	};

	/**
	 * Performs subtract operation on MobiusDataObjects with non-NURBS Geometry
	 * @param {MobiusDataObject} mObj1 - MobiusDataObject with Non-NURBS Geometry from which subtraction is to be done
	 * @param {MobiusDataObject} mObj2 - MobiusDataObject with Non-NURBS Geometry which is to be subtracted
	 * @returns {MobiusDataObject} MobiusDataObject containing ThreeBSP Geometry
	 */
	mod.objectSubtract = function( mObj1, mObj2 ){

		if(mObj1.geometry instanceof verb.geom.NurbsSurface || mObj2.geometry instanceof verb.geom.NurbsSurface)
			return "CSG functions currently only work with Three.js objects"

		var a = new ThreeBSP( mObj1.extractGeometry() );
		var b = new ThreeBSP( mObj2.extractGeometry() );

		var result;

		if(a.constructor !== Array){
			result = a.subtract( b );
		}

		return new MobiusDataObject( result );
	};

	/**
	 * Performs intersection operation on MobiusDataObjects with non-NURBS Geometry
	 * @param {MobiusDataObject} mObj1 - MobiusDataObject with Non-NURBS Geometry
	 * @param {MobiusDataObject} mObj2 - MobiusDataObject with Non-NURBS Geometry
	 * @returns {MobiusDataObject} MobiusDataObject containing ThreeBSP Geometry
	 */
	mod.objectIntersect = function( mObj1, mObj2 ){

		if(mObj1.geometry instanceof verb.geom.NurbsSurface || mObj2.geometry instanceof verb.geom.NurbsSurface)
			return "CSG functions currently only work with Three.js objects"

		var a = new ThreeBSP( mObj1.extractGeometry() );
		var b = new ThreeBSP( mObj2.extractGeometry() );

		var result;

		if(a.constructor !== Array){
			result = a.intersect( b );
		}

		return new MobiusDataObject( result );
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
				obj[i].material = material;
		}else
			obj.material = material;

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
				if(obj[i].data == undefined)
					obj[i].data = {};
				obj[i].data[dataName] = dataValue;
			}
		}else{
			if(obj.data == undefined)
				obj.data = {};
			obj.data[dataName] = dataValue;
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
			else if(obj instanceof  MobiusDataObject){
				geom.push( obj.extractGeometry() );
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
//	Default Material Definitions
//
var default_material_meshFromThree = new THREE.MeshLambertMaterial( {
	side: THREE.DoubleSide,
	wireframe: false,
	shading: THREE.SmoothShading,
	transparent: false,
	color: 0x003399
} );
var default_material_meshFromVerbs = new THREE.MeshLambertMaterial( {
	side: THREE.DoubleSide,
	wireframe: false,
	shading: THREE.SmoothShading,
	transparent: false,
	color: 0x003399
} );
var default_material_lineFromVerbs = new THREE.LineBasicMaterial({
	side: THREE.DoubleSide,
	linewidth: 100,
	color: 0x003399
});
var default_material_lineFromThree = new THREE.LineBasicMaterial({
	side: THREE.DoubleSide,
	linewidth: 100,
	color: 0x003399
});
var default_material_pointFromThree = new THREE.PointCloudMaterial( { size: 5, sizeAttenuation: false } );
//
//	Function to convert native geometry into three.js Mesh geometry
//  Add another if-else condition for each new geometry
//
var convertGeomToThreeMesh = function( geom ){

	// internal function
	convertToThree = function(singleDataObject){

		if( singleDataObject instanceof THREE.Mesh  || singleDataObject instanceof THREE.Object3D ){
			return singleDataObject;
		}
		else if(singleDataObject instanceof THREE.Geometry || singleDataObject instanceof THREE.Curve){
			// if faces > 0 - it's a mesh
			if(singleDataObject.faces.length)
				return new THREE.Mesh( singleDataObject, default_material_meshFromThree || singleDataObject.material );
			else
				return new THREE.Line( singleDataObject, default_material_lineFromThree || singleDataObject.material ) // else line
		}
		else if(singleDataObject instanceof THREE.Vector3){
			var dotGeometry = new THREE.Geometry();
			dotGeometry.vertices.push(singleDataObject);
			return new THREE.PointCloud( dotGeometry, default_material_pointFromThree || singleDataObject.material );
		}
		else if(singleDataObject instanceof THREE.Shape){
			var geometry = new THREE.ShapeGeometry( singleDataObject );
			var mesh = new THREE.Mesh( geometry, default_material_meshFromThree || singleDataObject.material );
			return mesh;
		}
		else if(singleDataObject instanceof ThreeBSP)
			return new THREE.Mesh( singleDataObject.toGeometry(), default_material_meshFromThree );
		else if( singleDataObject instanceof verb.geom.NurbsSurface ){

			var geometry = singleDataObject.toThreeGeometry();

			if ( singleDataObject.material )
				return ( new THREE.Mesh( geometry, singleDataObject.material ) );
			else
				return ( new THREE.Mesh( geometry, default_material_meshFromVerbs ) );

		}
		else if( singleDataObject instanceof verb.geom.NurbsCurve ){
			console.log('nurbs curve detected');
			var geometry = singleDataObject.toThreeGeometry();

			if ( singleDataObject.material )
				return ( new THREE.Line( geometry, singleDataObject.material ) );
			else
				return ( new THREE.Line( geometry, default_material_lineFromVerbs ) );
		}
		else {
			console.log("Module doesnt recognise either!", singleDataObject);
		}
	}

	var rawResult = convertToThree( geom );
	var optimizedResult = /*changeLOD(0.2, */rawResult//); // run polychop on this and reduce the number of faces needs for the desired level of LOD

	optimizedResult.is_mObj = true;
	return optimizedResult;
}

//
// Takes convertedGeometry (three.js) from MobiusDataObjects and converts it to topology*
// Change content incase of change in Topology.js
//
var threeToTopology = function( convertedGeometry ){

	// conversion of topology
	if( convertedGeometry.constructor != Array ){
		var topo = new TOPOLOGY.createFromGeometry( convertedGeometry.geometry );
		return topo;
	}
	else{
		var topoArray = [];
		for(var geomNo = 0; geomNo < convertedGeometry.length; geomNo++)
			topoArray.push( new TOPOLOGY.createFromGeometry( convertedGeometry[geomNo].geometry ) );
		return topoArray;
	}
}