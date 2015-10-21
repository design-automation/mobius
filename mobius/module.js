//
// VIDAMO module, open for editing by Module Developer
//

var VIDAMO = ( function (mod, pvt){

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
	mod.addToArray = function(originalArr, newObj){
		return originalArr.push(newObj)
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
	mod.makeLine = function(start, end){
		return new MobiusDataObject( new verb.geom.Line(start, end) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeArc = function(center,xaxis,yaxis,radius,minAngle,maxAngle){
		return new MobiusDataObject( new verb.geom.Arc(center,xaxis,yaxis,radius,minAngle,maxAngle) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeBezierCurve = function(points, weights){
		return new MobiusDataObject( new verb.geom.BezierCurve(points, weights) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeCircle = function(center,xaxis,yaxis,radius){
		return new MobiusDataObject( new verb.geom.Circle(center,xaxis,yaxis,radius) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeEllipse = function ( center,xaxis,yaxis ){
		return new MobiusDataObject( new verb.geom.Ellipse( center,xaxis,yaxis ) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeEllipseArc = function ( center,xaxis,yaxis,minAngle,maxAngle ){
		return new MobiusDataObject( new verb.geom.EllipseArc( center,xaxis,yaxis,minAngle,maxAngle ) );
	};

	//
	// Input: Numeric and Numeric Array Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeCurve = function(points){
		return new MobiusDataObject( new verb.geom.NurbsCurve.byPoints( points ) );
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
	mod.makeSurfaceByCorners = function ( point0,point1,point2,point3 ){
		return new MobiusDataObject( new verb.geom.NurbsSurface.byCorners ( point0,point1,point2,point3 ) );
	};

	//
	// Input: MobiusDataObject, Numeric Input
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceByRevolution = function ( mObj, centre, axis, angle ){
		var profile = mObj.geometry;
		return new MobiusDataObject( new verb.geom.RevolvedSurface( profile, centre, axis, angle )  );
	};

	//
	// Input: MobiusDataObjects with NURBS geometry
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceBySweep = function ( mObjProfile, mbObjRail){
		var profile = mObjProfile.geometry;
		var rail = mObjRail.geometry;
		return new MobiusDataObject( new verb.geom.SweptSurface ( profile, rail ) );
	};

	//
	// Input: Array of MobiusDataObjects with NURBS geometry
	// Output: MobiusDataObject with NURBS geometry
	//
	mod.makeSurfaceByLoft = function(arrOfCurves){
		var curves = [];
		for(var c=0; c<arrOfCurves.length; c++)
			curves.push(arrOfCurves[c].geometry);
		return new MobiusDataObject( new verb.geom.NurbsSurface.byLoftingCurves( curves, 3 ) );
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
	mod.makeSurfaceAsSphere = function(centre, radius){
		return new MobiusDataObject( new verb.geom.SphericalSurface(centre, radius) );
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
	// Input: MobiusDataObject with NURBS geoemtry, numeric values
	// Output: Array of MobiusDataObject with NURBS geometry (four point surface)
	//
	mod.makeMeshBySubdivision = function( mObj, ugrid, vgrid ){

		var surface = mObj.geometry;

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
	};

	//
	// Input: MobiusDataObject with NURBS geoemtry (line)
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
	mod.getPointsFromPolygon = function( mObj ){

		var polygon = mObj.geometry;

		return [
			polygon.point(0,0),
			polygon.point(1,0),
			polygon.point(1,1),
			polygon.point(0,1)]
	};

	//
	// Input: MobiusDataObjects with NURBS geoemtry (curve & surface)
	// Output: ??
	//
	mod.intersectCurveAndSurface = function ( mObjCurve, mObjSurface, tolerance, Async ){
		var curve = mObjCurve.geometry;
		var surface = mObjSurface.geometry;

		if(Async)
			return new verb.geom.Intersect.curveAndSurfaceAsync( curve, surface, tolerance );
		else
			return new verb.geom.Intersect.curveAndSurface( curve, surface, tolerance );
	};

	//
	// Input: MobiusDataObjects with NURBS geometry (curve & curve)
	// Output: ??
	//
	mod.intersectCurves = function (mObjCurve1, mObjCurve2, tolerance, Async){
		var curve1 = mObjCurve1.geometry;
		var curve2 = mObjCurve2.geometry;

		if(Async)
			return new verb.geom.Intersect.curvesAsync( curve1, curve2, tolerance );
		else
			return new verb.geom.Intersect.curves( curve1, curve2, tolerance );
	};

	//
	// Input: MobiusDataObjects with NURBS geometry (surface & surface)
	// Output: ??
	//
	mod.intersectSurfaces	= function (mObjSurface1, mObjSurface2, tolerance, Async){
		var surface1 = mObjSurface1.geometry;
		var surface2 = mObjSurface2.geometry;

		if(Async)
			return new verb.geom.Intersect.surfacesAsync( surface1, surface2, tolerance );
		else
			return new verb.geom.Intersect.surfaces( surface1, surface2, tolerance );
	};

	/*
	 *
	 * Three and CSG Functions
	 * Input - according to requirements, Output - MobiusDataObject with Three.js or ThreeBSP geometry
	 *
	 */

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
	//	Input: Numeric Input
	//	Outout: MobiusDataObject with Three.js geometry
	//
	mod.makePoint = function(x, y, z){
		return new MobiusDataObject( new THREE.Vector3(x, y, z));
	}

	//
	// Input: MobiusDataObject (with any kind of geometry), numeric input
	// Output: MobiusDataObject with Three.js geometry
	//
	mod.makeCopy = function(mObj, transX, transY, transZ){
		// needs to be optimized

		var newCopy = new THREE.Mesh( mObj.extractGeometry().geometry );   // this interconversion takes a very long time
		newCopy.translateX(transX);
		newCopy.translateY(transY);
		newCopy.translateZ(transZ);
		//return newCopy;
		return new MobiusDataObject( newCopy ); //needs to be sorted out
	};

	//
	// Input: MobiusDataObject (with any kind of geometry), numeric input
	// Output: MobiusDataObject with Three.js geometry
	//
	mod.booleanOperation = function( mObj1, mObj2, operation ){
		//operation should be a string - "union", "subtract", "intersect"
		// TODO : returns BSP is only for testing purpose - fix this to return error whenever it doesn't return required values
		var a = new ThreeBSP( mObj1.extractGeometry() );
		var b = new ThreeBSP( mObj2.extractGeometry() );

		var result;

		if(a.constructor !== Array){
			result = a[operation]( b );
		}

		return new MobiusDataObject( result );
	};

	/*
	 *	Topology Functions
	 *
	 */

	//
	//	Input :
	//	Output : MobiusDataObject with Topology geometry
	//
	mod.makeTopology = function(){
		return new MobiusDataObject( new TOPOLOGY.Topology() );
	};

	//
	//	Input : MobiusDataObject with Topology Geometry, MobiusDataObject with three.js point geometry
	//	Output : Topology Vertex ID (should this be the whole vertex instead?)
	//
	mod.addVertexToTopology = function(topologyObject, pointObject){
		var topology = topologyObject.geometry;
		var vector3 = pointObject.geometry;

		var newVertex = topology.create('vertex');
		newVertex.vector3 = vector3;

		return newVertex.ID;
	};

	//
	//	Input : MobiusDataObject with Topology Geometry, Number Array (should this be the vertices instead?)
	//	Output : Topology Edge ID (should this be the whole vertex instead?)
	//
	mod.addEdgeToTopology = function(topologyObject, vertexIDs){
		var topology = topologyObject.geometry;

		var newEdge = topology.create('edge');
		topology.addIncidenceData( "edge", newEdge.ID , "vertex", vertexIDs)

		return newEdge.ID;
	};

	//
	//	Input : MobiusDataObject with Topology Geometry, Number Array (should this be the edges and the vertices instead)
	//	Output : Topology Edge ID (should this be the whole vertex instead?)
	//
	mod.addFaceToTopology = function(topologyObject, vertexIDs, edgeIDs){
		var topology = topologyObject.geometry;

		var newFace = topology.create('face');

		topology.addIncidenceData("face", newFace.ID, "vertex", vertexIDs)
		topology.addIncidenceData( "face", newFace.ID, "edge", edgeIDs)

		return newFace.ID;
	};

	//	UNDER CONSTRUCTION
	//	Input : Array of MobiusDataObject with Topology Geometry
	//	Output : Topology Edge ID (should this be the whole vertex instead?)
	//
	mod.makeSolid = function(arr_mObj){

		var solidTopo = new TOPOLOGY.Topology();

		// takes in the array and combines all into one topological element
		for(var i=0; i<arr_mObj.length; i++){
			solidTopo.add
		}
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
	mod.addMaterial = function(obj, material_type, options){

		var material = new THREE[material_type](options);
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


	/*
	 *
	 * Data conversion function
	 *
	 */


	//
	// Could be shifted to MobiusSide
	//
	mod.dataConversion = function(data){

		// actual processing
		for(var i = 0; i < data.length; i++) {
			for (var m in data[i].value) {
				var geoms = [];
				if (data[i].value[m].constructor !== Array) {
					// switch of data type
					data[i].geom.push( data[i].value[m].extractGeometry() );
					//data[i].geom.push( data[i].value[m].extractTopology() );
					console.log( data[i].value[m].extractData() );
				}
				else {
					for (var n = 0; n < data[i].value[m].length; n++) {
						geoms.push( data[i].value[m][n].extractGeometry() );
						//geoms.push( data[i].value[m][n].extractTopology() );
						console.log( data[i].value[m][n].extractData() );
					}
				}
				data[i].geom.push(geoms);
			}
		}
		//console.log("ConvertedData", data)
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

		if( singleDataObject instanceof THREE.Mesh )
			return singleDataObject;
		else if(singleDataObject instanceof THREE.Geometry)
			return new THREE.Mesh( singleDataObject, singleDataObject.material );
		else if(singleDataObject instanceof TOPOLOGY.Topology)
			return new THREE.Mesh( singleDataObject.convertToGeometry(), default_material_meshFromThree );
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

			var geometry = singleDataObject.toThreeGeometry();

			if ( singleDataObject.material )
				return ( new THREE.Line( geometry, singleDataObject.material ) );
			else
				return ( new THREE.Line( geometry, default_material_lineFromVerbs ) );

		}
		else if(singleDataObject instanceof TOPOLOGY.Topology)
			return singleDataObject.convertToGeometry();
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
};

/* to be implemented later - to enable topology to scale
 function changeLOD(k, actualGeometry){

 var subdivisions = 0
 var modifier=new THREE.SubdivisionModifier(subdivisions);

 //geometry is the actual geometry
 smooth=actualGeometry.geometry.clone(); console.log(smooth);
 smooth.mergeVertices();
 modifier.modify(smooth);
 var simplify=new THREE.SimplifyModifier(400);
 sortedGeometry=simplify.modify(smooth);

 var map=sortedGeometry.map;
 var permutations=sortedGeometry.sortedGeometry;
 var sortedVertices=sortedGeometry.vertices;
 var t=sortedVertices.length-1;
 t=t*k|0;
 var numFaces=0;
 var face;
 var geometry=smooth;
 for(i=0;i<geometry.faces.length;i++){
 face=geometry.faces[i];
 var oldFace=sortedGeometry.faces[i];
 face.a=oldFace.a;
 face.b=oldFace.b;
 face.c=oldFace.c;
 while(face.a>t)
 face.a=map[face.a];
 while(face.b>t)
 face.b=map[face.b];
 while(face.c>t)
 face.c=map[face.c];
 if(face.a!==face.b&&face.b!==face.c&&face.c!==face.a)
 numFaces++;
 }
 geometry.computeFaceNormals();
 geometry.verticesNeedUpdate=true;
 geometry.normalsNeedUpdate=true;
 console.log(actualGeometry.geometry.faces.length);
 console.log(geometry.faces.length);
 return geometry;
 }
 */