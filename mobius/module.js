//
// VIDAMO module, open for editing by Module Developer
//

var VIDAMO = ( function (mod){

	/*
	 *
	 * General Functions,
	 * Input - according to requirements; Output - non-geometric primitives
	 *
	 */

	//
	// Input: String
	// Output: NULL, prints to console
	//
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
	
	mod.showObject = function( object ){
		return JSON.stringify(object);
	};

	//
	//
	//
	//
	mod.convertDegreesToRadians = function( degrees ){
		return 0.01745*degrees;
	};
	
	//
	//
	//
	//
	mod.convertRadiansToDegrees = function( radians ){
		return 57.29*radians;
	};
	
	/*
	 * 
	 * List Operations
	 *
	 */
	
	//
	// Input: Numeric
	// Output: Number Array
	//
	mod.makeSequence = function(start, end, stepSize){

		var arr = [];
		for(var i = start; i <= end; i = i + stepSize)
			arr.push(i);
		return arr;
	};

	//
	// Input: Array, Object
	// Output: Modified Array
	//
	mod.addToList = function( list, object ){
		return list.push( object );
	};
	
	//
	//
	//
	//
	mod.indexOfObject = function( list, object ){
		return list.indexOf( object );
	};
	
	//
	//
	//
	//
	mod.removeIndexFromList = function( list, index ){
		list.splice(index, 1);
		return list;
	}; 
	
	//
	//
	//
	//
	mod.getMaxValue = function( valueList ){
		var maxValue = valueList[0];
		for(var i=0; i<valueList.length; i++)
			maxValue = Math.max(maxValue, valueList[i]);
		return maxValue;
	};
	
	//
	//
	//
	//
	mod.getMinValue = function( valueList ){
		var minValue = valueList[0];
		for(var i=0; i<valueList.length; i++)
			minValue = Math.min(minValue, valueList[i]);
		return minValue;
	};
	
	//
	//
	//
	//
	mod.sumList = function( valueList ){
		var sum = 0;
		for(var i=0; i<valueList.length; i++)
			sum += valueList[i];
		return sum;
	};
	
	//
	//
	//
	//
	mod.averageList = function( valueList ){
		return VIDAMO.sumList( valueList )/ valueList.length;
	};
	
	//
	//
	//
	//
	mod.rangeOfList = function( valueList ){
		return VIDAMO.getMaxValue( valueList ) - VIDAMO.getMinValue( valueList );
	};
	
	//
	//
	//
	//
	mod.getListLength = function( valueList ){
		return valueList.length
	};
	
	/*
	 *
	 *	Geometry Analysis Functions
	 * 
	 */
	
	//
	//
	//
	//
	mod.getCentre = function(mObj){
		//calculate centre based on what kind of object
		var geometry = mObj.geometry;
		
		if(geometry instanceof verb.geom.NurbsCurve)
			return geometry.point(0.5);
		else if(geometry instanceof verb.geom.NurbsSurface)
			return geometry.point(0.5, 0.5);
		else if(geometry instanceof THREE.Geometry)
			return geometry.center;
		else
			return "Invalid Input"
	};
	
	//
	//
	//
	//
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
			deltaX = pnt1[0] - pnt2[0];
			deltaY = pnt1[1] - pnt2[1];
			deltaZ = pnt1[2] - pnt2[2];
		}
		else
			return "Invalid Input"

		var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
		return distance;
	};

	//
	//
	//
	//
	mod.getLengthOfVector = function( vector ){
		var vec = vector.geometry;
		return vector.length;
	};
	
	
	/*
	 *
	 * Verbs Functions
	 * Input - according to requirements, Output - MobiusDataObject with NURBS Geometry
	 *
	 */

	//
	// Input: Number Array
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeLine = function(startPoint, endPoint){
		// input variations
		// start, end could be a vector3 - has to be converted into an array
		
		return new MobiusDataObject( new verb.geom.Line(startPoint, endPoint) );
	};
	
	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeArc = function(centerPoint, xaxis, yaxis, radius, minAngle, maxAngle){
		// input variations
		// center, axis and yaxis could be vector3
		return new MobiusDataObject( new verb.geom.Arc(centerPoint,xaxis,yaxis,radius,minAngle,maxAngle) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeBezierCurve = function(points, weights){
		// points could be vector3
		return new MobiusDataObject( new verb.geom.BezierCurve(points, weights) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeCircleBoundary = function(centerPoint,xaxis,yaxis,radius){
		return new MobiusDataObject( new verb.geom.Circle(centerPoint,xaxis,yaxis,radius) );
	};

	//
	// Input: Numeric and Numeric Array Input [centre], [xaxis], [yaxis]
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeEllipse = function ( centerPoint ,xaxis,yaxis ){
		return new MobiusDataObject( new verb.geom.Ellipse( centerPoint,xaxis,yaxis ) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeEllipseArc = function ( centerPoint,xaxis,yaxis,minAngle,maxAngle ){
		return new MobiusDataObject( new verb.geom.EllipseArc( centerPoint,xaxis,yaxis,minAngle,maxAngle ) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeCurveByPoints = function( points, degree ){
		return new MobiusDataObject( new verb.geom.NurbsCurve.byPoints( points, degree ) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeCurveByKnotsControlPointsWeights = function ( degree,knots,controlPoints,weights ){
		return new MobiusDataObject( new verb.geom.NurbsCurve.byKnotsControlPointsWeights( degree,knots,controlPoints,weights ) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceByKnotsControlPointsWeights = function ( degreeU,degreeV,knotsU,knotsV,controlPoints,weights ){
		return new MobiusDataObject( new verb.geom.NurbsSurface.byKnotsControlPointsWeights( degreeU,degreeV,knotsU,knotsV,controlPoints,weights ) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceByCorners = function ( point0, point1, point2, point3 ){
		return new MobiusDataObject( new verb.geom.NurbsSurface.byCorners ( point0,point1,point2,point3 ) );
	};

	//
	// Input: MobiusDataObject, Numeric Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceByRevolution = function ( mObj, centerPoint, axis, angle ){
		var profile = mObj.geometry;
		return new MobiusDataObject( new verb.geom.RevolvedSurface( profile, centerPoint, axis, angle )  );
	};

	//
	// Input: MobiusDataObjects with NURBS geometry
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceBySweep = function ( mObjProfile, mObjRail){
		var profile = mObjProfile.geometry;
		var rail = mObjRail.geometry;
		return new MobiusDataObject( new verb.geom.SweptSurface ( profile, rail ) );
	};

	//
	// Input: Array of MobiusDataObjects with NURBS geometry
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceByLoft = function(listOfCurves, degree){
		var deg = degree || 3;
		var curves = [];
		for(var c=0; c<listOfCurves.length; c++)
			curves.push(listOfCurves[c].geometry);
		return new MobiusDataObject( new verb.geom.NurbsSurface.byLoftingCurves( curves, deg ) );
	};

	//
	// Input: MobiusDataObjects with NURBS geometry, direction Numeric Array
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceByExtrusion = function ( mObjProfile, direction){
		var profile = mObjProfile.geometry;
		return new MobiusDataObject( new verb.geom.ExtrudedSurface( profile, direction ) );
	};

	//
	// Input: Numeric
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceAsSphere = function(centrePoint, radius){
		return new MobiusDataObject( new verb.geom.SphericalSurface(centrePoint, radius) );
	};

	//
	// Input: Numeric
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceAsCone = function( axis,xaxis,base,height,radius ){
		return new MobiusDataObject( new verb.geom.ConicalSurface( axis,xaxis,base,height,radius ) );
	};

	//
	// Input: Numeric
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceAsCylinder = function ( axis, xaxis, base, height, radius ){
		return new MobiusDataObject( new verb.geom.CylindricalSurface( axis,xaxis,base,height,radius ) );
	};
	
	//
	//
	//
	//
	mod.getPointOnSurface = function( surface, u, v ){
		var srf = surface.geometry;
		if(srf instanceof verb.geom.NurbsSurface)
			return srf.point( u, v );
		else
			return "Invalid Input"
	};
	
	//
	//
	//
	//
	mod.getPointOnCurve = function( curve, t ){
		var crv = curve.geometry;
		if( crv instanceof verb.geom.NurbsCurve)
			return crv.point( t );
		else
			return "Invalid Input"
	};
	
	//
	//
	//
	//
	mod.divideCurve = function( curve, divisions ){
		var crv = curve.geometry;
		var points = crv.divideByEqualArcLength( divisions )
							.map(function(u){ return crv.point( u.u ); } );
	
		return points; //convert these into vector points 
	};
	
	//
	//
	//
	mod.getTangentAtCurveParameter = function( curve, t ){
		var crv = curve.geometry;
		if( crv instanceof verb.geom.NurbsCurve)
			return crv.tangent(t);
		else
			return 'Invalid Input';
	};
	
	//
	//
	//
	//
	mod.getNormalAtSurfaceParameter = function( surface, u, v ){
		var srf = surface.geometry;
		if(srf instanceof verb.geom.NurbsSurface)
			return srf.normal( u, v);
		else
			return 'Invalid Input';
	};
	
	//
	//
	//
	//
	mod.getContourCurves = function( surface, countU, countV ){
		
	};

	//
	// Input: MobiusDataObject with NURBS geometry, numeric values
	// Output: Array of MobiusDataObject with NURBS geometry (four point surface)
	//
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

	//
	// Input: MobiusDataObject with NURBS geometry (line)
	// Output: MobiusDataObject with NURBS geometry (cylinderical surface)
	//
	mod.makeTubeByLine = function( mObj ){

		var line = mObj.geometry;

		var start = line.start();
		var end = line.end();

		var axis = [start[0] - end[0], start[1] - end[1], start[2] - end[2]]
			, height = 1 //this is a multiplying factor to the axis vector
			, radius = 0.1;

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

	//
	// Input: MobiusDataObject with NURBS geometry (surface)
	// Output: Numeric Array of Points
	//
	mod.getCornerPointsFromSurface = function( mObj ){

		var polygon = mObj.geometry;

		return [
			polygon.point(0,0),
			polygon.point(1,0),
			polygon.point(1,1),
			polygon.point(0,1)]
	};
	
	//
	//
	//
	//
	mod.makePoint = function(x, y, z){
		return [x, y, z];
	};

	/*
	 *
	 * Three.js Geometry Functions
	 * Input - according to requirements, Output - MobiusDataObject with Three.js or ThreeBSP geometry
	 *
	 */

	//
	//	Input: Numeric Input
	//	Outout: MobiusDataObject with Three.js geometry
	//
	mod.makePositionVector = function(x, y, z){
		if(x.constructor === Array && y == undefined && z == undefined)
			return new MobiusDataObject( new THREE.Vector3( x[0], x[1], x[2] ));
		else
			return new MobiusDataObject( new THREE.Vector3(x, y, z));
	};
	
	mod.makePositionVectorsFromPoints = function( list_of_points ){
		var mObjArr; 
		for(var i=0; i<points.length; i++){
			var obj = new MobiusDataObject( new THREE.Vector3(points[i][0], points[i][0], points[i][0]));
			mObjArr.push(obj);
		}
		return mObjArr;
	};

	mod.makeCircle = function(radius, segments){
		return new MobiusDataObject( new THREE.CircleGeometry( radius, segments ));
	};

	mod.makeCylinder = function(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded ){
		return new MobiusDataObject( new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded ));
	};
	
	//
	// Input: 
	//
	//
	mod.makePolyline = function(arrOfPoints){
		var pline = new THREE.Geometry();

		for(var point=0; point < arrOfPoints.length; point++)
			pline.vertices.push(new THREE.Vector3(arrOfPoints[point][0], arrOfPoints[point][1], arrOfPoints[point][2]));
				
		return new MobiusDataObject( pline );
	};
	

	//
	// Input: Numeric Input
	// Output: MobiusDataObject with Three.js geometry
	//
	mod.makeBox = function(length, breadth, height){
		return new MobiusDataObject ( new THREE.BoxGeometry( length, breadth, height ) ) ;
	};

	//
	// Input: Numeric Input
	// Output: MobiusDataObject with Three.js geometry
	//
	mod.makeSphere = function(radius){
		return new MobiusDataObject ( new THREE.SphereGeometry( radius , 32, 32) ) ;
	};

	//
	//
	//
	//
	mod.makePolygonByPoints = function(origin, points){

		var customShape = new THREE.Shape();

		customShape.moveTo(origin[0], origin[1]);

		for(var pointNo=0; pointNo < points.length; pointNo++)
			customShape.lineTo(points[pointNo][0], points[pointNo][1]);

		customShape.lineTo(origin[0], origin[1]);

		return new MobiusDataObject ( customShape );
	};

	//
	// dir: {x:, y:, z:}
	//
	//
	mod.extrudePolygon = function(mObj, thickness, bevel, dir ){
		//mObj has to have shape  :/
		var shape = mObj.geometry;
		
		if( shape instanceof THREE.Shape ){
			var extrudeSettings = { amount: thickness, bevelEnabled: bevel, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
			geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		
			// applying shear matrix according to extrude in direction specified
			var matrix = new THREE.Matrix4();
			var Syx = dir.x / dir.y,
				Syz = dir.z / dir.y;
			matrix.set(   1,   Syx,   0,   0,
						  0,     1,   0,   0,
						  0,   Syz,   1,   0,
						  0,     0,   0,   1  );
			geometry.applyMatrix( matrix );
			
			return new MobiusDataObject( geometry );
		}
		else
			return "Invalid Input. Please input polygon"

	};

	//
	// Array of vector3 : points
	//
	//
	mod.makeLathe = function( points, segments ){
		return new MobiusDataObject( new THREE.LatheGeometry( points, segments ) );
	};
	
	//
	//
	//
	//
	mod.makePlane = function( width, height ){
		return new MobiusDataObject( new THREE.PlaneGeometry( width, height, 1) );
	};
	
	//
	//
	//
	//
	mod.makePolyhedron = function( verticesOfCube, indicesOfFaces ){
		return new MobiusDataObject( new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 6, 2 ) );
	};
	
	//
	//
	//
	//
	mod.make2DRing = function( innerRadius, outerRadius, segments ){
		return new MobiusDataObject( new THREE.RingGeometry( innerRadius, outerRadius, segments ) );
	};
	
	//
	//
	//
	//
	mod.makeTetrahedron = function( radius ){
		return new MobiusDataObject( new THREE.TetrahedronGeometry( radius ) );
	};
	
	//
	//
	//
	//
	mod.makeTorus = function(radius, tube, radialSegments, tubularSegments){
		return new MobiusDataObject( new THREE.TorusGeometry( radius, tube, radialSegments, tubularSegments ) );
	};
	
	//
	//
	//
	//
	mod.makeTorusKnot = function( radius, tube, radialSegments, tubularSegments ){
		return new MobiusDataObject( new THREE.TorusKnotGeometry(radius, tube, radialSegments, tubularSegments) );
	};
	
	//
	//
	//
	//
	mod.getPointFromPositionVector = function( positionVector ){
		return [ positionVector.x, positionVector.y, positionVector.z ];
	};

	/*
	 *
	 *	Transformation Functions
	 *
	 */

	//
	// Input: MobiusDataObject (with any kind of geometry), numeric input
	// Output: MobiusDataObject with Three.js geometry
	// Note - modifies the convertedGeometry Mesh - needs to update topology if already created and re-link the data associated
	//
	mod.makeCopy = function(mObj, xCoord, yCoord, zCoord){
		// needs to be optimized

		// needs to cater to any kind of three.js object - mesh, lines, points - caters to just one right now
		// copies with translations
		var newCopy = new MobiusDataObject( mObj.geometry );

		var newCopyMesh = newCopy.extractGeometry( mObj.extractGeometry().clone() );
	
		newCopyMesh.position.x = xCoord;
		newCopyMesh.position.y = yCoord;
		newCopyMesh.position.z = zCoord;
		
		return newCopy; //needs to be sorted out
	};

	//
	//
	//
	//
	mod.shiftObject = function(mObj, shiftX, shiftY, shiftZ){

		// could be a face too 
		
		// if extractGeometry is called again, the translations would  be lost ..
		// original geometry interactions will not follow the translations - csg is ok, because that derieves from three.js itself
		var mesh = mObj.extractGeometry();
		mesh.translateX(shiftX);
		mesh.translateY(shiftY);
		mesh.translateZ(shiftZ);

		return mObj;
	};

	//
	//
	//
	//
	mod.moveObjectToPoint = function(mObj, xCoord, yCoord, zCoord){
		
		//could be a face too

		// if extractGeometry is called again, the translations would  be lost ..
		// original geometry interactions will not follow the translations - csg is ok, because that derieves from three.js itself
		mObj.extractGeometry().position.set(xCoord, yCoord, zCoord);

		return mObj;
	};

	//
	//
	//
	//
	mod.scaleObject = function(mObj, scaleX, scaleY, scaleZ){

		// if extractGeometry is called again, the translations would  be lost ..
		// original geometry interactions will not follow the translations - csg is ok, because that derieves from three.js itself
		mObj.extractGeometry().scale.set(scaleX, scaleY, scaleZ);

		return mObj;
	};

	//
	//
	//
	//
	mod.rotateObject = function(mObj, xAxis, yAxis, zAxis){
		// angles taken in radians
		var mesh = mObj.extractGeometry();
		mesh.rotateX(xAxis);
		mesh.rotateY(yAxis);
		mesh.rotateZ(zAxis);
	};

	//
	//
	//
	//
	mod.rotateObjectAroundAxis = function( mObj, mObjAxis, radians ){
		//mObj Axis is a vector3

		// Rotate an object around an axis in world space (the axis passes through the object's position)
		var object = mObj.extractGeometry();
		var axis = mObjAxis.geometry;

		var rotWorldMatrix = new THREE.Matrix4();
		rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

		rotWorldMatrix.multiply(object.matrix);                // pre-multiply

		object.matrix = rotWorldMatrix;

		object.rotation.setFromRotationMatrix(object.matrix);

		return mObj;
	};
	
	//
	//
	//
	//
	mod.orientObjectTowards = function( object, lookAtPoint ){
		
		var lookAtPt; 
		
		if(lookAtPoint.constructor === Array)
			lookAtPt = new THREE.Vector3( lookAtPoint[0], lookAtPoint[1], lookAtPoint[2] );
		else if(lookAtPoint instanceof THREE.Vector3)
			lookAt = lookAtPt;
		
		object.extractGeometry().lookAt( lookAtPt );
	};


	/*
	 *
	 * CSG Functions
	 * Input - MobiusDataObjects, Output - MobiusDataObject
	 *
	 */

	//
	// Input: MobiusDataObject (with any kind of geometry), numeric input
	// Output: MobiusDataObject with Three.js geometry
	//
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

	//
	// Input: MobiusDataObject (with any kind of geometry), numeric input
	// Output: MobiusDataObject with Three.js geometry
	//
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

	//
	// Input: MobiusDataObject (with any kind of geometry), numeric input
	// Output: MobiusDataObject with Three.js geometry
	//
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

	//
	// Input: Single or Array of MobiusDataObject (with any kind of geometry) or TopoGeometry, numeric input
	// Output: Modified MobiusDataObject
	//
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

	//
	//	Input : MobiusObject or Topology Object (Array or Single)
	//	Output: Modified MobiusDataObject
	//
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
				//for(var x = 0; x<tempGeom0.length; x++){
				//	geom.push(tempGeom0[x]);
				//	geomData.push(tempData0[x]);
				//}
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
	color: 0x0066CC
} );
var default_material_meshFromVerbs = new THREE.MeshLambertMaterial( {
	side: THREE.DoubleSide,
	wireframe: false,
	shading: THREE.SmoothShading,
	transparent: false,
	color: 0x999900
} );
var default_material_lineFromVerbs = new THREE.LineBasicMaterial({
	side: THREE.DoubleSide,
	linewidth: 100,
	color: 0x999900
});
var default_material_lineFromThree = new THREE.LineBasicMaterial({
	side: THREE.DoubleSide,
	linewidth: 100,
	color: 0x0066CC
});
var default_material_topology_vertex = new THREE.ParticleBasicMaterial({
	color: 0xCCCCFF,
	size: 1,
	blending: THREE.AdditiveBlending,
	transparent: true
});
var default_material_topology_edge = new THREE.LineBasicMaterial({
	side: THREE.DoubleSide,
	linewidth: 200,
	color: 0x999900
});
var default_material_topology_face = new THREE.MeshBasicMaterial({
	color:"white",
	shading: THREE.FlatShading,
	side: THREE.DoubleSide,
	vertexColors: THREE.FaceColors,
	overdraw: true,
	needsUpdate : true,
	opacity: 1
});

//
//	Function to convert native geometry into three.js Mesh geometry
//  Add another if-else condition for each new geometry
//
var convertGeomToThreeMesh = function( geom ){

	// internal function
	convertToThree = function(singleDataObject){

		if( singleDataObject instanceof THREE.Mesh ){
			return singleDataObject;
		}
		else if(singleDataObject instanceof THREE.Geometry){
			// if faces > 0 - it's a mesh
			if(singleDataObject.faces.length)
				return new THREE.Mesh( singleDataObject, default_material_meshFromThree || singleDataObject.material );
			else
				return new THREE.Line( singleDataObject, default_material_lineFromThree || singleDataObject.material ) // else line
		}
		else if(singleDataObject instanceof TOPOLOGY.Topology){
			// display topology itself
			return displayTopologyInThree(singleDataObject);
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
		else if (singleDataObject instanceof verb.geom.Intersect){
			console.log("Intersection!");
		}
		else {
			console.log("Module doesnt recognise either!", singleDataObject);
		}
	}

	var rawResult = convertToThree( geom );
	var optimizedResult = /*changeLOD(0.2, */rawResult//); // run polychop on this and reduce the number of faces needs for the desired level of LOD

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

//
// Takes topology and converts into displayable three.js Object3D
// Change content incase of change in Topology.js
//
var displayTopologyInThree = function ( topology ){

	// if topology is a single object or topology is a group of topology???

	// vertexs will be points
	// edges will lines
	// faces will be surfaces

	// could be optimized further with three.js vertex colors etc -

	// text will also be written
	var group = new THREE.Object3D();

	// vertexs
	var particles = new THREE.Geometry();

	for(var vertexNo = 0; vertexNo < topology.vertex.length; vertexNo++){
		// create a particle with random
		// position values, -250 -> 250
		var particle = topology.vertex[vertexNo].vector3
		// add it to the geometry
		particles.vertices.push(particle);

	}
	// create the particle system
	var particleSystem = new THREE.ParticleSystem(
		particles,
		default_material_topology_vertex);

	group.add(particleSystem);

	// edges
	for(var edgeNo = 0; edgeNo < topology.edge.length; edgeNo++){

		var lineGeometry = new THREE.Geometry();
		lineGeometry.vertices.push(
			topology.vertex[topology.edge[edgeNo].vertexIDs[0]].vector3,
			topology.vertex[topology.edge[edgeNo].vertexIDs[1]].vector3
		);

		lineGeometry.computeVertexNormals();
		var line = new THREE.Line( lineGeometry, default_material_topology_edge || topology.edge[edgeNo].material );

		group.add(line);
	}


	// faces
	for(var faceNo = 0; faceNo < topology.face.length; faceNo++){

		for(var i=1; i<topology.face[faceNo].vertexIDs.length-1; i++){
			var faceGeometry = new THREE.Geometry();
			faceGeometry.vertices.push( topology.vertex[topology.face[faceNo].vertexIDs[0]].vector3 );
			faceGeometry.vertices.push( topology.vertex[topology.face[faceNo].vertexIDs[i]].vector3 );
			faceGeometry.vertices.push( topology.vertex[topology.face[faceNo].vertexIDs[i+1]].vector3 );
			faceGeometry.faces.push( new THREE.Face3( 0, 1, 2 ));
			faceGeometry.computeFaceNormals();
			faceGeometry.computeVertexNormals();

			var materials = [ topology.face[faceNo].material || default_material_topology_face ];
			faceGeometry.faces[0].materialIndex = 0;
			group.add(new THREE.Mesh( faceGeometry , new THREE.MeshFaceMaterial( materials ) ));
		}
	}

	return group;
}