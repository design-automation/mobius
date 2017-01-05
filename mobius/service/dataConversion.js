// convert mObj to threeJS obj / data obj / topo obj
var dataConversion = (function(data){

    for(var i = 0; i < data.length; i++) {
        for (var m in data[i].value) {
            if (data[i].value[m] !== undefined && m !== 'FUNC_OUTPUT') {
                if (data[i].value[m].constructor !== Array ) {
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
            obj instanceof mObj_geom_Compound ||
            obj instanceof mObj_geom_Vertex ||
            obj instanceof mObj_frame){

            geom.push(obj.extractThreeGeometry().clone());
            geomData.push( obj.extractData(connectorName) );
            topo.push(obj.extractTopology());

        }else{
            for(var key in obj){
                extract(obj[key],geom,geomData,topo, connectorName);
            }
        }
    }

    // merge geometry in geom entity for rendering in 3js renderer
    var otherGeometry = [];
    mergeGeom(data);


    function mergeGeom(unmerged){
        for(var i = 0; i < unmerged.length; i++){
            unmerged[i].geom = getMergedGeometry(unmerged[i].geom);
            otherGeometry = [];

            for(k in unmerged[i].value){
                if(k === 'geomList' && unmerged[i].value[k] !== undefined){
                    mergeGeom(unmerged[i].value[k])
                }
            }
        }
    }


    function getMergedGeometry(unmergedGeomList){
        var mergedGeometry = new THREE.Geometry();

        if(unmergedGeomList !== undefined ){
            if(unmergedGeomList instanceof Array){
                for(var i = 0; i< unmergedGeomList.length ;i++){
                    mergeGeometry(unmergedGeomList[i],mergedGeometry);
                    getMergedGeometry(unmergedGeomList[i])
                }
            } else {
                var temp = mergeGeometry(unmergedGeomList,mergedGeometry);
                otherGeometry.push(temp);
            }

            var meshMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                shading: THREE.SmoothShading,
                vertexColors: true,
                side: THREE.DoubleSide
            });

            var edge = new THREE.EdgesGeometry( mergedGeometry );
            var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1} );
            var wireframe = new THREE.LineSegments( edge , mat);

            var mergedMesh = new THREE.Mesh(mergedGeometry,meshMaterial);
            // todo line wireframe should it be merged
            console.log([mergedMesh,wireframe,otherGeometry])
            return [mergedMesh,wireframe,otherGeometry];
        }
    };

    function mergeGeometry (singleGeomObject,mergedGeometry){
        var geometry =[];
        if(singleGeomObject instanceof THREE.Mesh) {
             mergedGeometry.mergeMesh(singleGeomObject, singleGeomObject.matrix)
        }else if(singleGeomObject instanceof THREE.Line || singleGeomObject instanceof THREE.PointCloud){
            otherGeometry.push(singleGeomObject)
        }else if(singleGeomObject instanceof THREE.Object3D) {
            for (var i = 0; i < singleGeomObject.children.length; i++) {
                if(singleGeomObject.children[i] instanceof THREE.Mesh) {
                    mergedGeometry.mergeMesh(singleGeomObject.children[i], singleGeomObject.children[i].matrix)
                }else if(singleGeomObject.children[i] instanceof THREE.Line || singleGeomObject.children[i] instanceof THREE.PointCloud){
                    otherGeometry.push(singleGeomObject.children[i])
                }
            }
        }
        return geometry;
    };

    return data;
});











