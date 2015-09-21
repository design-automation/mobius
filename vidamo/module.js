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

    mod.getPointsFromPolygon = function(polygon){
        return [
                polygon.point(0,0),
                polygon.point(1,0),
                polygon.point(1,1),
                polygon.point(0,1)]
    };

    // convert all function return data into vidamo display format
    // three.js geometry for 3d viewport visualization
    mod.dataConversion = function(data){

        // convert geometry into three.js geometry
        for(var i = 0; i < data.length; i++) {

            for (var m in data[i].value) {
                var geoms = [];
                if (data[i].value[m].constructor !== Array) {
                    data[i].geom.push(data[i].value[m].toThreeGeometry());
                }
                else {
                    for (var n = 0; n < data[i].value[m].length; n++) {
                        geoms.push(data[i].value[m][n].toThreeGeometry());
                    }
                }
                data[i].geom.push(geoms);
            }
        }
        return data;
    };

    return mod;

})(window.VIDAMO || {});