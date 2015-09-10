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
        return new verb.geom.Line(start, end);
    };

    mod.makeCurve = function(points){
        console.log(verb.geom.NurbsCurve.byPoints( points, points.length - 1));
        return verb.geom.NurbsCurve.byPoints( points, points.length - 1);

    };

    mod.makeSurfaceByLoft = function(curves){
        return verb.geom.NurbsSurface.byLoftingCurves( curves, 3 );
    };

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

        return tube;
    };

    mod.getPointsFromPolygon = function(polygon){
        return [
                polygon.point(0,0),
                polygon.point(1,0),
                polygon.point(1,1),
                polygon.point(0,1)]
    };

    return mod;

})(window.VIDAMO || {});