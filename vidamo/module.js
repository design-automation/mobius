//
// VIDAMO module
//

var VIDAMO = ( function (mod){

	var default_material_meshFromThree = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide, wireframe: false, shading: THREE.SmoothShading, transparent: false, color: 0x0066CC} )
	var default_material_meshFromVerbs = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide, wireframe: false, shading: THREE.SmoothShading, transparent: false, color: 0x999900} )
	var default_material_lineFromVerbs = new THREE.LineBasicMaterial({ linewidth: 100, color: 0x999900})
	
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
        return new verb.geom.Line(start, end);
    };
	
	mod.makeArc = function(center,xaxis,yaxis,radius,minAngle,maxAngle){
		return new verb.geom.Arc(center,xaxis,yaxis,radius,minAngle,maxAngle);
	};
	
	mod.makeBezierCurve = function(points, weights){
		return new verb.geom.BezierCurve(points, weights);
	};
	
	mod.makeCircle = function(center,xaxis,yaxis,radius){
		return new verb.geom.Circle(center,xaxis,yaxis,radius);
	};
	
	mod.makeEllipse = function ( center,xaxis,yaxis ){
		return new verb.geom.Ellipse( center,xaxis,yaxis );
	};
	
	mod.makeEllipseArc = function ( center,xaxis,yaxis,minAngle,maxAngle ){
		return new verb.geom.EllipseArc( center,xaxis,yaxis,minAngle,maxAngle );
	};

    mod.makeCurve = function(points){
        //console.log(verb.geom.NurbsCurve.byPoints( points, points.length - 1));
        return new verb.geom.NurbsCurve.byPoints( points );

    };
	
	mod.makeCurveByKnotsControlPointsWeights = function ( degree,knots,controlPoints,weights ){
		return new verb.geom.NurbsCurve.byKnotsControlPointsWeights( degree,knots,controlPoints,weights )
	};

	//
	// makes a NURBS Surfaces by different methods
	//
	mod.makeSurfaceByKnotsControlPointsWeights = function ( degreeU,degreeV,knotsU,knotsV,controlPoints,weights ){
		return new verb.geom.NurbsSurface.byKnotsControlPointsWeights( degreeU,degreeV,knotsU,knotsV,controlPoints,weights )
	};
	
	mod.makeSurfaceByCorners = function ( point0,point1,point2,point3 ){
		return new verb.geom.NurbsSurface.byCorners ( point0,point1,point2,point3 )
	};
	
	mod.makeSurfaceByRevolution = function ( profile, centre, axis, angle ){
		return new verb.geom.RevolvedSurface( profile, centre, axis, angle ) 
	};
	
	mod.makeSurfaceBySweep = function ( profile, rail){
		return new verb.geom.SweptSurface ( profile, rail )
	};
	
    mod.makeSurfaceByLoft = function(curves){
		// find out about this 3? represents degreeV
        return verb.geom.NurbsSurface.byLoftingCurves( curves, 3 );
    };
	
	mod.makeSurfaceByExtrusion = function ( profile, direction){
		return new verb.geom.ExtrudedSurface( profile, direction );
	};
	
	mod.makeSurfaceAsSphere = function(centre, radius){
		return new verb.geom.SphericalSurface(centre, radius);
	};
	
	mod.makeSurfaceAsCone = function( axis,xaxis,base,height,radius ){
		return new verb.geom.ConicalSurface( axis,xaxis,base,height,radius );
	};
	
	mod.makeSurfaceAsCylinder = function ( axis,xaxis,base,height,radius	){
		return new verb.geom.CylindricalSurface( axis,xaxis,base,height,radius	);
	};	
		
	//
	//	helper functions for NURBS surfaces and curves
	//
	
	//
	// takes a NURBS surface and outputs and array of NURBS Surfaces (polysurface)
	//
    mod.makeMeshBySubdivision = function(surface, ugrid, vgrid){
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
                div_surfaces.push(new verb.geom.NurbsSurface.byCorners(gridPoints[i], gridPoints[i+1],  gridPoints[i+vgrid+2], gridPoints[i+vgrid+1]))
            }
        }

        return div_surfaces
    };
	
	//
	//	takes a NURBS Line and returns a NURBS surface - better to make something that follows a NURBS curve path too - more generalised? 
	//
    mod.makeTubeByLine = function(line){
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

        return tube;
    };
	
	//
	// takes in a NURBS Surface and gets the extreme points - polygon is a NURBS Four Point Surface
	//
    mod.getPointsFromPolygon = function(polygon){
        return [
                polygon.point(0,0),
                polygon.point(1,0),
                polygon.point(1,1),
                polygon.point(0,1)]
    };
	
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
	}

	
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
	}
	
	/* 
	 * ThreeCSG Functions, Akshata
	 * Take input as primitives or Mesh, give output as Mesh
	 */
	
	//
	// Trial function to simplify geometry
	//
	mod.simplifyGeometry = function(mesh, lod){
		
		var ori_geometry = mesh.geometry; //console.log( "original", mesh.geometry.faces.length );
		var modifier = new THREE.SubdivisionModifier(0);
		var smooth = ori_geometry.clone();
		smooth.mergeVertices();
		modifier.modify(smooth);
		var simplify = new THREE.SimplifyModifier(400);
		sortedGeometry=simplify.modify(smooth);
		
		// changing LOD
		var map=sortedGeometry.map;
		var permutations=sortedGeometry.sortedGeometry;
		var sortedVertices=sortedGeometry.vertices;
		var t=sortedVertices.length-1;
		t=t*(lod)|0;   //change LOD here - from 0 to 1
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
		simplifiedFaces=numFaces;
		simplifiedVertices=t;
		geometry.computeFaceNormals(); console.log( "original", geometry.vertices.length );
		geometry.verticesNeedUpdate=true;
		geometry.normalsNeedUpdate=true;	
		
		return new THREE.Mesh(geometry, mesh.material);
	}
	
	mod.makeBox = function(length, breadth, height){
		return new THREE.Mesh( new THREE.BoxGeometry( length, breadth, height ), default_material_meshFromThree ) ;
	}
	
	mod.makeSphere = function(radius){
		return new THREE.Mesh( new THREE.SphereGeometry( radius , 32, 32), default_material_meshFromThree ) ; // gives call stack exceeded error with segments > 80x80
	}	

	/** TODO: Merge the translation functions below into 1 **/
	mod.translateX = function(geom1, translation_value){
		// if three.js geometry, convert to mesh
		if(geom1 instanceof THREE.Geometry){
			geom1 = new THREE.Mesh( geom  );
		}
		var clone = new THREE.Mesh( geom1.geometry, geom1.material );
		return clone.translateX( translation_value )
	}

	mod.translateY = function(geom1, translation_value){
		// discuss and check other software if remove original option is to be given - copy function removed?
		// if three.js geometry, convert to mesh
		if(geom1 instanceof THREE.Geometry){
			geom1 = new THREE.Mesh( geom );
		}
		var clone = new THREE.Mesh( geom1.geometry, geom1.material );  //if you clone it - the original will remain when you put both statements in the same node - again, the function on particular object load
		return clone.translateY( translation_value )
	} 

	mod.translateZ = function(geom1, translation_value){
		// if three.js geometry, convert to mesh
		if(geom1 instanceof THREE.Geometry){
			geom1 = new THREE.Mesh( geom );
		}
		var clone = new THREE.Mesh( geom1.geometry, geom1.material );
		return clone.translateZ( translation_value )
	}

	//
	//	takes a mesh - creates a new mesh from the reference geometry, reference material and coordinates given
	//
	mod.makeCopy = function(geom, transX, transY, transZ){
		var newCopy = new THREE.Mesh( geom.geometry, geom.material);
		newCopy.translateX(transX);
		newCopy.translateY(transY);
		newCopy.translateZ(transZ);
		return newCopy;
	}
	
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
		if(geom1 instanceof THREE.Mesh)
			geom1 = new ThreeBSP( geom1 ); 
		if(geom2 instanceof THREE.Mesh)
				geom2 = new ThreeBSP ( geom2 );
		
		var result; 
		
		if(geom2.constructor !== Array){ 
			result = geom1[operation]( geom2 );
		} /*else {
			    // doesn't work with arrays - need to correct
				for(var index = 1; index <= geom2.length; index++){
					result = result[operation]( new ThreeBSP( geom2[index]) );
				} 
		}*/
		
		if(!bsp){
			mesh_geom = result.toMesh( default_material_meshFromThree );
			mesh_geom.geometry.computeVertexNormals(); 
			console.log("returned non bsp")
			return mesh_geom; 
		}else{
			console.log("returned bsp")
			return result;
		}
	};
	
	// interconversion between verbs and three.js Surface
	mod.convertVerbsToThree = function( vSurface , directMethod ){ 
		
		if(!directMethod){	
			var surfaceData = vSurface.asNurbs();
			var controlPoints = surfaceData.controlPoints;
			
			for(var controlPnt = 0; controlPnt < controlPoints.length; controlPnt++) { 
				for(var coordArr=0; coordArr < controlPoints[controlPnt].length; coordArr++){
					var points = controlPoints[controlPnt][coordArr];
					controlPoints[controlPnt][coordArr] = new THREE.Vector4 ( points[0], points[1], points[2], points[3] ) // could be Vector2, 3 or 4 - correct later
				}
			} 
			
			var nurbsSurface = new THREE.NURBSSurface(surfaceData.degreeU, surfaceData.degreeV, surfaceData.knotsU, surfaceData.knotsV, controlPoints); 
			
			getSurfacePoint = function(u, v) {
						return nurbsSurface.getPoint(u, v);
					};

			var geometry = new THREE.ParametricGeometry( getSurfacePoint, 60, 60 );  //only retains vertices - all the NURBS related data is lost : 60 represents smoothness of the model
			geometry.originalNurbsSurface = nurbsSurface; 
			
			return new THREE.Mesh( geometry, default_material_meshFromThree);
	    }else{
			var mesh = new THREE.Mesh( vSurface.toThreeGeometry(), default_material_meshFromVerbs);
			mesh.geometry.dynamic = true
			mesh.geometry.__dirtyVertices = true;
			mesh.geometry.__dirtyNormals = true;

			mesh.flipSided = true;

			//flip every vertex normal in mesh by multiplying normal by -1
			for(var i = 0; i<mesh.geometry.faces.length; i++) {
				mesh.geometry.faces[i].normal.x = -1*mesh.geometry.faces[i].normal.x;
				mesh.geometry.faces[i].normal.y = -1*mesh.geometry.faces[i].normal.y;
				mesh.geometry.faces[i].normal.z = -1*mesh.geometry.faces[i].normal.z;
			}

			mesh.geometry.computeVertexNormals();
			mesh.geometry.computeFaceNormals();
			return mesh  // Works well with simple geometry - the method above as well as this - however works badly for complex geometry
		}		
	};
	
	mod.convertThreeToVerbs = function( threeNurbsSurface ){

	if (threeNurbsSurface instanceof THREE.Mesh)
		threeNurbsSurface = threeNurbsSurface.geometry.originalNurbsSurface;
	
	var controlPoints = threeNurbsSurface.controlPoints; 
	var weights = [];
		
		for(var controlPnt = 0; controlPnt < controlPoints.length; controlPnt++) { 
			for(var coordArr=0; coordArr < controlPoints[controlPnt].length; coordArr++){
				var points = controlPoints[controlPnt][coordArr];
				controlPoints[controlPnt][coordArr] = [points[0], points[1], points[2], points[3]]
				weights.push(1);
			}
		} 
		
		var verbGeom = new verb.geom.NurbsSurface.byKnotsControlPointsWeights( threeNurbsSurface.degree1, threeNurbsSurface.degree2, threeNurbsSurface.knots1, threeNurbsSurface.knots2, controlPoints ); // what happens to weights??
		//console.log(verbGeom);
		return verbGeom;
	};

	 
    // convert all objects to types recognized by Vidamo - tables, text, numbers, three.js mesh
    mod.dataConversion = function(data){
		
		//internal function - without 'mod' to segregate data 
		conversionByDataType = function(singleDataObject){
			
			// first if case to return primitives that VIDAMO recognizes
			if( singleDataObject instanceof THREE.Mesh ){
				return singleDataObject
			}/*
			else if( singleDataObject instanceof THREE.Geometry){
				return ( new THREE.Mesh( singleDataObject, singleDataObject.material) )
			}
			else if( singleDataObject instanceof ThreeBSP){   //will hardly ever be the case - remove later - only for testing purposes
				var result = singleDataObject.toMesh( default_material_mesh ); console.log("here")
				result.geometry.computeVertexNormals();
				return result;
			}*/
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
			else if (singleDataObject instanceof verb.geom.Intersect){
				console.log("Interection!");
			}
			else {
				console.log("Module doesnt recognise either!", singleDataObject);	
			}			
		}
		
		// actual processing
        for(var i = 0; i < data.length; i++) {
            for (var m in data[i].value) {
                var geoms = [];
                if (data[i].value[m].constructor !== Array) {
					data[i].geom.push( conversionByDataType( data[i].value[m] ) )
                }
                else {
                    for (var n = 0; n < data[i].value[m].length; n++) {
						geoms.push( conversionByDataType( data[i].value[m][n] ) )
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