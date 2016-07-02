// convert mObj to threeJS obj / data obj / topo obj
// todo factory service imeplementation

var dataConversion = (function(data){
    for(var i = 0; i < data.length; i++) {
        for (var m in data[i].value) {
            if (data[i].value[m] !== undefined) {
                if (data[i].value[m].constructor !== Array) {
                    extract(data[i].value[m],
                        data[i].geom,
                        data[i].geomData,
                        data[i].topo,m);
                }
                else if(m !== 'geomList'){
                    var tempGeom = [];
                    var tempData = [];
                    var tempTopo = [];

                    for (var n = 0; n < data[i].value[m].length; n++) {
                        extract(data[i].value[m][n],
                            tempGeom,
                            tempData,
                            tempTopo,
                            m);
                    }
                    data[i].geom.push(tempGeom);
                    data[i].geomData.push(tempData);
                    data[i].topo.push(tempTopo);
                }else if(m === 'geomList' && data[i].value[m] !== undefined){
                    dataConversion(data[i].value[m]);
                }
            }
        }
    }

    function extract (obj,geom,geomData,topo,connectorName){
        if(obj.constructor === Array){
            var tempGeom0 = [];
            var tempData0 = [];
            var tempTopo0 = [];

            for(var k = 0; k < obj.length ; k++){
                extract(obj[k],tempGeom0,tempData0,tempTopo0,connectorName);
            }

            geom.push(tempGeom0);
            geomData.push(tempData0);
            topo.push(tempTopo0);
        }
        else if(obj instanceof mObj_geom_Compound ||
            obj instanceof mObj_geom_Curve ||
            obj instanceof mObj_geom_Surface ||
            obj instanceof mObj_geom_Solid ||
            obj instanceof mObj_geom_Vertex ||
            obj instanceof mObj_frame){

            geom.push(obj.extractThreeGeometry());
            geomData.push( obj.extractData(connectorName) );
            topo.push(obj.extractTopology());

        }else{
            for(var key in obj){
                extract(obj[key],geom,geomData,topo, connectorName);
            }
        }
    }
    return data;
});
