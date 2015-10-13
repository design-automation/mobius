//
// VIDAMO module
//

var VIDAMO = ( function (mod){


    // print data method
    mod.print = function(content){
        // try to find vidamo web app, if found print in vidamo console
        // todo will there be an error?

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
	// makes a NURBS Curves of different shapes
	//
    mod.makeLine = function(start, end){
        return new MobiusDataObject( new verb.geom.Line(start, end) );
    };
	
	mod.makeArc = function(center,xaxis,yaxis,radius,minAngle,maxAngle){
		return new MobiusDataObject( new verb.geom.Arc(center,xaxis,yaxis,radius,minAngle,maxAngle) );
	};
	
	mod.makeBezierCurve = function(points, weights){
		return new MobiusDataObject( new verb.geom.BezierCurve(points, weights) );
	};
	
	mod.makeCircle = function(center,xaxis,yaxis,radius){
		return new MobiusDataObject( new verb.geom.Circle(center,xaxis,yaxis,radius) );
	};
	
	mod.makeEllipse = function ( center,xaxis,yaxis ){
		return new MobiusDataObject( new verb.geom.Ellipse( center,xaxis,yaxis ) );
	};
	
	mod.makeEllipseArc = function ( center,xaxis,yaxis,minAngle,maxAngle ){
		return new MobiusDataObject( new verb.geom.EllipseArc( center,xaxis,yaxis,minAngle,maxAngle ) );
	};

    mod.makeCurve = function(points){
        return new MobiusDataObject( new verb.geom.NurbsCurve.byPoints( points ) );
    };
	
	mod.makeCurveByKnotsControlPointsWeights = function ( degree,knots,controlPoints,weights ){
		return new MobiusDataObject( new verb.geom.NurbsCurve.byKnotsControlPointsWeights( degree,knots,controlPoints,weights ) );
	};

	//
	// makes a NURBS Surfaces by different methods
	//
	mod.makeSurfaceByKnotsControlPointsWeights = function ( degreeU,degreeV,knotsU,knotsV,controlPoints,weights ){
		return new MobiusDataObject( new verb.geom.NurbsSurface.byKnotsControlPointsWeights( degreeU,degreeV,knotsU,knotsV,controlPoints,weights ) );
	};
	
	mod.makeSurfaceByCorners = function ( point0,point1,point2,point3 ){
		return new MobiusDataObject( new verb.geom.NurbsSurface.byCorners ( point0,point1,point2,point3 ) );
	};
	
	mod.makeSurfaceByRevolution = function ( mbObj, centre, axis, angle ){
		var profile = mbObj.geometry;
		return new MobiusDataObject( new verb.geom.RevolvedSurface( profile, centre, axis, angle )  );
	};
	
	mod.makeSurfaceBySweep = function ( mbObjProfile, mbObjRail){
		var profile = mbObjProfile.geometry; 
		var rail = mbObjRail.geometry;
		return new MobiusDataObject( new verb.geom.SweptSurface ( profile, rail ) );
	};
	
    mod.makeSurfaceByLoft = function(arrOfCurves){
		var curves = []; 
		for(var c=0; c<arrOfCurves.length; c++)
			curves.push(arrOfCurves[c].geometry);	
		return new MobiusDataObject( new verb.geom.NurbsSurface.byLoftingCurves( curves, 3 ) );
    };
	
	mod.makeSurfaceByExtrusion = function ( mbObjProfile, mbObjDirection){
		var profile = mbObjProfile.geometry;
		var direction = mbObjDirection.geometry;
		return new MobiusDataObject( new verb.geom.ExtrudedSurface( profile, direction ) ); 
	};
	
	mod.makeSurfaceAsSphere = function(centre, radius){
		return new MobiusDataObject( new verb.geom.SphericalSurface(centre, radius) ); 
	};
	
	mod.makeSurfaceAsCone = function( axis,xaxis,base,height,radius ){
		return new MobiusDataObject( new verb.geom.ConicalSurface( axis,xaxis,base,height,radius ) ); 
	};
	
	mod.makeSurfaceAsCylinder = function ( axis, xaxis, base, height, radius ){
		return new MobiusDataObject( new verb.geom.CylindricalSurface( axis,xaxis,base,height,radius ) ); 
	};	
		
	//
	//	helper functions for NURBS surfaces and curves
	//
	
	//
	// takes a Mobius Object with NURBS geoemtry and outputs and array of mobius objects with NURBS Surface geometry (polysurface)
	//
    mod.makeMeshBySubdivision = function( mobiusObject, ugrid, vgrid ){
		
		var surface = mobiusObject.geometry;
        
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
	//	takes a Mobius Object with NURBS Line geometry and returns a Mobius object with NURBS surface geoemtry - better to make something that follows a NURBS curve path too - more generalised? 
	//
    mod.makeTubeByLine = function( mbObject ){
		
		var line = mbObject.geometry;
		
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
	// takes in a NURBS Surface and gets the extreme points - polygon is a NURBS Four Point Surface
	//
    mod.getPointsFromPolygon = function( mbObject ){
		
		var polygon = mbObject.geometry;
        
		return [
                polygon.point(0,0),
                polygon.point(1,0),
                polygon.point(1,1),
                polygon.point(0,1)]
    };
	
	/* to be generalised 
	mod.intersectCurveAndSurface = function ( curve, surface, tolerance, Async ){
		if(Async)
			return new verb.geom.Intersect.curveAndSurfaceAsync( curve, surface, tolerance );
		else
			return new verb.geom.Intersect.curveAndSurface( curve, surface, tolerance );
	}
	
	mod.intersectCurves = function (curve, curve, tolerance, Async){
		if(Async)
			return new verb.geom.Intersect.curvesAsync( curve, curve, tolerance );
		else
			return new verb.geom.Intersect.curves( curve, curve, tolerance );
	}
	
	mod.intersectCurves = function (surface, surface, tolerance, Async){
		if(Async)
			return new verb.geom.Intersect.surfacesAsync( surface, surface, tolerance );
		else
			return new verb.geom.Intersect.surfaces( surface, surface, tolerance );
	} */

	
	/* 
	 * Numeric Functions, Akshata
	 */
	 
	//
	// makes a sequence from start value, end value and stepsize - returns a numeric array
	//
	mod.makeSequence = function(start, end, stepSize){
		var arr = [];
		for(var i = start; i <= end; i = i + stepSize)
			arr.push(i);
		return arr;
	};	
	
	//
	// Adds a single new object to array
	// 
	mod.addToArray = function(originalArr, newObj){
		return originalArr.push(newObj)
	};
	
	/* 
	 * ThreeCSG Functions, Akshata
	 * Take input as primitives or Mesh, give output as Mesh
	 */
	
	mod.makeBox = function(length, breadth, height){
		//return new THREE.Mesh( new THREE.BoxGeometry( length, breadth, height ), default_material_meshFromThree ) ;
		return MobiusDataObject ( new THREE.BoxGeometry( length, breadth, height ) ) ;
	};
	
	mod.makeSphere = function(radius){
		return MobiusDataObject ( new THREE.SphereGeometry( radius , 32, 32) ) ;
	};	

	/** TODO: Merge the translation functions below into 1 **/
	mod.translateX = function(geom1, translation_value){
		// if three.js geometry, convert to mesh
		if(geom1 instanceof THREE.Geometry){
			geom1 = new THREE.Mesh( geom  );
		}
		var clone = new THREE.Mesh( geom1.geometry, geom1.material );
		//return clone.translateX( translation_value )
		return TOPOLOGY.createFromGeometry( clone.translateX( translation_value ).geometry )
	};

	mod.translateY = function(geom1, translation_value){
		// discuss and check other software if remove original option is to be given - copy function removed?
		// if three.js geometry, convert to mesh
		if(geom1 instanceof THREE.Geometry){
			geom1 = new THREE.Mesh( geom );
		}
		var clone = new THREE.Mesh( geom1.geometry, geom1.material );  //if you clone it - the original will remain when you put both statements in the same node - again, the function on particular object load
		//return clone.translateY( translation_value )
		return TOPOLOGY.createFromGeometry( clone.translateY( translation_value ).geometry )
	};
	
	mod.translateZ = function(geom1, translation_value){
		// if three.js geometry, convert to mesh
		if(geom1 instanceof THREE.Geometry){
			geom1 = new THREE.Mesh( geom );
		}
		var clone = new THREE.Mesh( geom1.geometry, geom1.material );
		//return clone.translateZ( translation_value )
		return TOPOLOGY.createFromGeometry( clone.translateZ( translation_value ).geometry )
	};

	//
	//	takes a mesh - creates a new mesh from the reference geometry, reference material and coordinates given
	//
	mod.makeCopy = function(geom, transX, transY, transZ){
		// needs to be optimized
		var newCopy = new THREE.Mesh( geom.convertToGeometry() );   // this interconversion takes a very long time
		newCopy.translateX(transX);
		newCopy.translateY(transY);
		newCopy.translateZ(transZ);
		//return newCopy;
		return TOPOLOGY.createFromGeometry( newCopy.geometry )
	};
	
	//
	//	creates a THREE Material from user input - applies it to the object in the .material property - returns the object; [irrespective of any input]
	//
	mod.addMaterial = function(object, material_type, options){

		var material = new THREE[material_type](options);
		
		//check if array of objects
		if(object.constructor === Array){
			for(var i=0; i<object.length; i++)
				object[i].material = material
		}else
			object.material = material;

		return object;
	};
	
	/* 
     * ThreeCSG Functions, Akshata
	 * Take input as Mesh or BSP, give output as Mesh
	 */
	mod.booleanOperation = function(geom1, geom2, operation, bsp){
		//operation should be a string - "union", "subtract", "intersect"
		// TODO : returns BSP is only for testing purpose - fix this to return error whenever it doesn't return required values
		var a = new ThreeBSP( new THREE.Mesh( geom1.convertToGeometry() ) );
		var b = new ThreeBSP( new THREE.Mesh( geom2.convertToGeometry() ) );
		
		var result; 
		
		if(a.constructor !== Array){ 
			result = a[operation]( b );
		}
		
		if(!bsp){
			mesh_geom = result.toMesh( default_material_meshFromThree );
			mesh_geom.geometry.computeVertexNormals(); 
			console.log("returned non bsp")
			// converting mesh to Topology
			return new TOPOLOGY.createFromGeometry( mesh_geom.geometry )
		}else{
			console.log("returned bsp")
			return result;
		}
	};
	 
    // convert all objects to types recognized by Vidamo - tables, text, numbers, three.js mesh
	//
	// Obsolete function - by implementation of data structure
	//
    mod.dataConversion = function(data){

		// actual processing
        for(var i = 0; i < data.length; i++) {
            for (var m in data[i].value) {
                var geoms = [];
                if (data[i].value[m].constructor !== Array) { 
					data[i].geom.push( data[i].value[m].extractGeometry() );
                }
                else {
                    for (var n = 0; n < data[i].value[m].length; n++) { 		
						geoms.push( data[i].value[m][n].extractGeometry() );
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