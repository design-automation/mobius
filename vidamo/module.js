//
// VIDAMO module
//


// code to invoke controller functions outside angularjs
//var scope = angular.element(document.getElementById('threeViewport')).scope();
//scope.$apply(function(){scope.viewportControl.ready();} );

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

    mod.makeLine = function(start, end){
        var line = new verb.geom.Line(start, end);

        setTimeout(function(){
                var scope = angular.element(document.getElementById('threeViewport')).scope();
                scope.$apply(function(){scope.viewportControl.addCurveToScene( line.toThreeGeometry() );} );
            }
        ,0);
        return line;
    };

    mod.makeCurve = function(points){
        // makes a verbs curve
        //degree is one less than the number of points specified for a point
        var curve = new verb.geom.NurbsCurve.byPoints( points, points.length - 1);

        setTimeout(function(){
                var scope = angular.element(document.getElementById('threeViewport')).scope();
                scope.$apply(function(){scope.viewportControl.addCurveToScene( curve.toThreeGeometry() );} );
            }
            ,0);

        return curve
    };

    mod.makeSurfaceByLoft = function(curves){

        var surface_loft = verb.geom.NurbsSurface.byLoftingCurves( curves, 3 );

        setTimeout(function(){
                var scope = angular.element(document.getElementById('threeViewport')).scope();
                scope.$apply(function(){scope.viewportControl.addMeshToScene( surface_loft.toThreeGeometry() );} );
            }
            ,0);

        return surface_loft;
    };

    mod.makeMeshBySubdivision = function(surface, ugrid, vgrid){

        var mesh = {
            gridPoints : [],
            faces : [],
            ucurves : [],
            vcurves : []
        };

        var uincr = 1/ugrid;
        var vincr = 1/vgrid;

        //for uv lines
        for(var i = 0; i <= Math.max(ugrid, vgrid); i++){

            var uline = [], vline = [];

            for(var seg=0; seg <= Math.max(ugrid, vgrid); seg++){

                if(seg <= vgrid && i <= ugrid){
                    var point = surface.point(i*uincr, seg*vincr);
                    uline.push(point);
                    mesh.gridPoints.push(point);
                }

                if(seg <= ugrid && i <= vgrid){
                    vline.push(surface.point(seg*uincr, i*vincr))
                }
            }

            if(uline.length > 0 )
                mesh.ucurves.push(verb.geom.NurbsCurve.byPoints(uline));
            if(vline.length > 0 )
                mesh.vcurves.push(verb.geom.NurbsCurve.byPoints(vline))
        }

        // creation of polygons from the mesh.gridPoints
        for(var i = 0; i< mesh.gridPoints.length-vgrid-2; i++){
            if((i+vgrid+2)%(vgrid+1) != 0 || i==0){

                // construction of the polygon object
                var polygon = {
                        vertices : [mesh.gridPoints[i],
                        mesh.gridPoints[i+1],
                        mesh.gridPoints[i+vgrid+2],
                        mesh.gridPoints[i+vgrid+1]]
                };

                mesh.faces.push(polygon);
            }
        }

        setTimeout(function(){
                var scope = angular.element(document.getElementById('threeViewport')).scope();
                mesh.ucurves.forEach(
                    function(c){
                        scope.$apply(function(){
                            scope.viewportControl.addCurveToScene( c.toThreeGeometry() );
                        });
                    });
            }
            ,0);

        setTimeout(function(){
                var scope = angular.element(document.getElementById('threeViewport')).scope();
                mesh.vcurves.forEach(
                    function(c){
                        scope.$apply(function(){
                            scope.viewportControl.addCurveToScene( c.toThreeGeometry() );
                        });
                    });
            }
            ,0);

        return mesh;
    };

    mod.makeTubeByLine = function(line, transparent){

        var start = line.start();
        var end = line.end();

        var axis = [start[0] - end[0],start[1] - end[1],start[2] - end[2]]
            , xaxis = [1,0,0]
            , base = end
            , height = 1 //this is a multiplying factor to the axis vector
            , radius = 0.1;

        var tube = new verb.geom.CylindricalSurface( axis, xaxis, base, height, radius );
        var material = new THREE.MeshNormalMaterial( { side: THREE.DoubleSide, wireframe: false, shading: THREE.SmoothShading, transparent: transparent, opacity: 0.5} )

        setTimeout(function(){
                var scope = angular.element(document.getElementById('threeViewport')).scope();
                scope.$apply(function(){scope.viewportControl.addMeshToScene( tube.toThreeGeometry(), material );} );
            }
            ,0);

        return tube;
    };

    mod.getPolygonsFromMesh = function(mesh){
        return mesh.faces
    };

    mod.getPointsFromPolygon = function(polygon){
        return polygon.vertices
    };

    return mod;

})(window.VIDAMO || {});