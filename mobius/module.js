//
// VIDAMO module
//

var VIDAMO = ( function (mod){


    // print data method
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
	
	/* 
	 * Verbs Functions 
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
	//	helper functions for NURBS surfaces and curves
	//
	
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
	// Input: MobiusDataObject with NURBS geoemtry (surface)
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
	// Input: MobiusDataObjects with NURBS geoemtry (curve & curve)
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
	// Input: MobiusDataObjects with NURBS geoemtry (surface & surface)
	// Output: ??
	//	
	mod.intersectCurves = function (mObjSurface1, mObjSurface2, tolerance, Async){
		var surface1 = mObjSurface1.geometry;
		var surface2 = mObjSurface2.geometry;
		
		if(Async)
			return new verb.geom.Intersect.surfacesAsync( surface1, surface2, tolerance );
		else
			return new verb.geom.Intersect.surfaces( surface1, surface2, tolerance );
	};

	
	/* 
	 * Numeric Functions, Akshata
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
	mod.addToArray = function(originalArr, newObj){
		return originalArr.push(newObj)
	};
	
	/* 
	 * ThreeCSG Functions
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
	// Input: Single or Array of MobiusDataObject (with any kind of geometry), numeric input
	// Output: MobiusDataObject with Three.js geometry
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
	//	Output: Modified object with data
	//
	mod.addData = function(obj, dataName, dataValue){
		
		// decide on topology heirarchy also - if edge gets a property, do the vertices also get the same property?
		if(obj.constructor === Array){
			for(var i=0; i<obj.length; i++)
				obj[i].dataName = dataValue;
		}else
			obj.dataName = dataValue;
		
	}
	
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
	 
    // convert all objects to types recognized by Vidamo - tables, text, numbers, three.js mesh
	//
	// Obsolete function - by implementation of data structure
	//
	// TODO - remove this and directly integrate in VIDAMO
    mod.dataConversion = function(data){

		// actual processing
        for(var i = 0; i < data.length; i++) {
            for (var m in data[i].value) {
                var geoms = [];
                if (data[i].value[m].constructor !== Array) { 
					// compute topology if not already calculated of the mbObj
					
					//data[i].geom.push( data[i].value[m].extractGeometry() );
					data[i].geom.push( data[i].value[m].extractTopology() );
                }
                else {
                    for (var n = 0; n < data[i].value[m].length; n++) { 		
						// compute topology if not already calculated of the mbObj
						//geoms.push( data[i].value[m][n].extractGeometry() );
						geoms.push( data[i].value[m][n].extractTopology() );
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