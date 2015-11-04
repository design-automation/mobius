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

	//
	//
	//
	//
	mod.getAbsoluteValue = function( number ){
		return Math.abs( number );
	};

	//
	//
	//
	//
	mod.getSignificantDigits = function( number, digits){
		return number.toFixed(digits);
	};

	//
	//
	//
	//
	mod.getDotProduct = function( mat1, mat2 ){
		return verb.core.Vec.dot(mat1, mat2);
	};

	//
	//
	//
	//
	mod.getCrossProduct = function( mat1, mat2 ){
		return verb.core.Vec.cross(mat1, mat2);
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
			return geometry.center();
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
			deltaX = point1[0] - point2[0];
			deltaY = point1[1] - point2[1];
			deltaZ = point1[2] - point2[2];
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
			curves.push(listOfCurves[c].geometry); demoC = curves;
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
	mod.divideCurveByEqualArcLength = function( curve, divisions ){
		var crv = curve.geometry;
		var points = crv.divideByEqualArcLength( divisions )
			.map(function(u){ return ( u.u ); } );

		return points;
	};

	//
	//
	//
	//
	mod.divideCurveByArcLength = function( curve, arcLength ){
		var crv = curve.geometry;
		var points = crv.divideByArcLength( arcLength )
			.map(function(u){ return ( u.u ); } );

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

	//
	//
	//
	//
	mod.makePositionVectorsFromPoints = function( list_of_points ){
		var mObjArr = [];
		for(var i=0; i<list_of_points.length; i++){
			var obj = new MobiusDataObject( new THREE.Vector3(list_of_points[i][0], list_of_points[i][1], list_of_points[i][2]));
			mObjArr.push(obj);
		}
		return mObjArr;
	};

	//
	//
	//
	//
	mod.makeCircle = function(radius, segments){
		return new MobiusDataObject( new THREE.CircleGeometry( radius, segments ));
	};

	//
	//
	//
	//
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

	//	points need to be defined anti-clockwise
	//
	//
	//
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
	 * @requires dir: {x:, y:, z:}
	 *
	 */
	mod.extrudePolygon = function(mObj, thickness, bevel ){
		//mObj has to have shape  :/
		var shape = mObj.geometry;

		if( shape instanceof THREE.Shape ){
			var extrudeSettings = { amount: thickness, bevelEnabled: bevel, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
			geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

			/*
			 // applying shear matrix according to extrude in direction specified
			 var matrix = new THREE.Matrix4();
			 var Syx = dir.x / dir.y,
			 Syz = dir.z / dir.y;
			 matrix.set(   1,   Syx,   0,   0,
			 0,     1,   0,   0,
			 0,   Syz,   1,   0,
			 0,     0,   0,   1  );
			 geometry.applyMatrix( matrix ); */

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
		var pts = [];
		for(var i=0; i<points.length; i++)
			pts.push(new THREE.Vector3(points[i][0], points[i][1], points[i][2]))
		return new MobiusDataObject( new THREE.LatheGeometry( pts, segments ) );
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
		var pos = positionVector.geometry;
		return [ pos.x, pos.y, pos.z ];
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
			
			var new_mObj = new MobiusDataObject( mObj.geometry );
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

	//
	//
	//
	//
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

	//
	//
	//
	//
	mod.moveObjectToPoint = function(mObj, xCoord, yCoord, zCoord){


		// if extractGeometry is called again, the translations would  be lost ..
		// original geometry interactions will not follow the translations - csg is ok, because that derieves from three.js itself
		
		if(mObj.geometry instanceof verb.geom.NurbsCurve || mObj.geometry instanceof verb.geom.NurbsSurface){
			
			var orCenter = VIDAMO.getCentre(mObj);
			
			// translation required
			var target = [xCoord, yCoord, zCoord];
			var tx = target[0] - orCenter[0];
			var ty = target[1] - orCenter[1];
			var tz = target[2] - orCenter[2]; console.log(tx, ty, tz);
			
			VIDAMO.shiftObject( mObj, tx, ty, tz );		
		} else
			mObj.extractGeometry().position.set(xCoord, yCoord, zCoord);	

		//return mObj;
	};

	//
	//
	//
	//
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
	mod.makeFrame = function(){
		return new MobiusDataObject( new THREE.Object3D() );
	};

	//
	//
	//
	//
	mod.addToFrame = function( frame, object ){
		var frameRef = frame.geometry

		if(frameRef instanceof THREE.Object3D){

			frameRef.add(object.extractGeometry());
		}
		else
			console.log("Invalid Frame")
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

		return object;
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
		else if(singleDataObject instanceof THREE.Geometry){
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