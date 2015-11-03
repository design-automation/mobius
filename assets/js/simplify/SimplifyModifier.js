/*
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
 *
 *	Simplification Geometry Modifier
 *    - based on code and technique
 *	  - by Stan Melax in 1998
 *	  - Progressive Mesh type Polygon Reduction Algorithm
 *    - http://www.melax.com/polychop/
 */

THREE.SimplifyModifier = function() {

};

(function() {
	var cb = new THREE.Vector3(), ab = new THREE.Vector3();

	function pushIfUnique( array, object ) {

		if ( array.indexOf( object ) === -1 ) array.push( object );

	}

	function computeEdgeCollapseCost( u, v ) {

		// if we collapse edge uv by moving u to v then how
		// much different will the model change, i.e. the "error".

		var edgelength = v.position.distanceTo( u.position );

		var curvature = 0;


		var sideFaces = [];
		var i, uFaces = u.faces, il = u.faces.length, face, sideFace;
		
		// find the "sides" triangles that are on the edge uv
		for ( i = 0 ; i < il; i ++ ) {

			face = u.faces[ i ];

			if ( face.hasVertex(v) ) {

				sideFaces.push( face );

			}

		}

		// use the triangle facing most away from the sides
		// to determine our curvature term
		for ( i = 0 ; i < il; i ++ ) {
		
			var minCurvature = 1;
			face = u.faces[ i ];

			for( var j = 0; j < sideFaces.length; j ++ ) {

				sideFace = sideFaces[ j ];
				// use dot product of face normals.
				var dotProd = face.normal.dot( sideFace.normal );
				minCurvature = Math.min( minCurvature, ( 1 - dotProd ) / 2);
			}

			curvature = Math.max( curvature, minCurvature );
		}

		if (u.isBorder() && sideFaces.length > 1) {
			curvature = 1;
		}

		return edgelength * curvature;

	}

	function computeEdgeCostAtVertex( v ) {

		if ( v.neighbors.length === 0 ) {
			
			// collpase if no neighbors.
			v.collapse = null;
			v.cost = - 0.01;
			
			return;

		}

		v.cost = 1000000;
		v.collapse = null;

		// search all neighboring edges for “least cost” edge
		for( var i = 0; i < v.neighbors.length; i ++ ) {

			var c;
			c = computeEdgeCollapseCost( v, v.neighbors[ i ] );

			if ( c < v.cost ) {

				v.collapse = v.neighbors[i];
				v.cost = c;

			}

		}

	}

	function removeVertex( v, vertices ) {

		console.assert( v.faces.length === 0 );

		while ( v.neighbors.length ) {

			var n = v.neighbors.pop();
			n.neighbors.splice( n.neighbors.indexOf( v ), 1 );

		}

		vertices.splice( vertices.indexOf( v ), 1 );

	}

	function removeFace( f, faces ) {

		faces.splice( faces.indexOf( f ), 1 );

		if ( f.v1 ) f.v1.faces.splice( f.v1.faces.indexOf( f ), 1 );
		if ( f.v2 ) f.v2.faces.splice( f.v2.faces.indexOf( f ), 1 );
		if ( f.v3 ) f.v3.faces.splice( f.v3.faces.indexOf( f ), 1 );

		var vs = [this.v1, this.v2, this.v3];
		var v1, v2;
		for(var i=0;i<3;i++) {
			v1 = vs[i];
			v2 = vs[(i+1)%3]
			if(!v1 || !v2) continue;
			v1.removeIfNonNeighbor(v2);
			v2.removeIfNonNeighbor(v1);
		}

	}

	function collapse( vertices, faces, u, v ) { // u and v are pointers to vertices of an edge

		// Collapse the edge uv by moving vertex u onto v

		if ( !v ) {

			// u is a vertex all by itself so just delete it..
			removeVertex( u, vertices );
			return;

		}

		var i;
		var tmpVertices = [];

		for( i = 0 ; i < u.neighbors.length; i ++ ) {
			
			tmpVertices.push( u.neighbors[ i ] );

		}


		// delete triangles on edge uv:
		for( i = u.faces.length - 1; i >= 0; i -- ) {
			
			if ( u.faces[ i ].hasVertex( v ) ) {

				removeFace( u.faces[ i ], faces );

			}

		}

		// update remaining triangles to have v instead of u
		for( i = u.faces.length -1 ; i >= 0; i -- ) {
			
			u.faces[i].replaceVertex( u, v );

		}


		removeVertex( u, vertices );

		// recompute the edge collapse costs in neighborhood
		for( i = 0; i < tmpVertices.length; i ++ ) {

			computeEdgeCostAtVertex( tmpVertices[ i ] );

		}

	}



	function minimumCostEdge( vertices ) {

		// O(n * n) approach. TODO optimize this

		var least = vertices[ 0 ];

		for (var i = 0; i < vertices.length; i ++ ) {

			if ( vertices[ i ].cost < least.cost ) {

				least = vertices[ i ];

			}
		}

		return least;

	}

	// we use a triangle class to represent structure of face slightly differently

	function Triangle( v1, v2, v3 ) {

		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;

		this.normal = new THREE.Vector3();

		this.computeNormal();

		v1.faces.push( this );
		v1.addUniqueNeighbor( v2 );
		v1.addUniqueNeighbor( v3 );

		v2.faces.push( this );
		v2.addUniqueNeighbor( v1 );
		v2.addUniqueNeighbor( v3 );


		v3.faces.push( this );
		v3.addUniqueNeighbor( v1 );
		v3.addUniqueNeighbor( v2 );

	}

	Triangle.prototype.computeNormal = function() {

		var vA = this.v1.position;
		var vB = this.v2.position;
		var vC = this.v3.position;

		cb.subVectors( vC, vB );
		ab.subVectors( vA, vB );
		cb.cross( ab ).normalize();

		this.normal.copy( cb );

	};

	Triangle.prototype.hasVertex = function( v ) {

		return v === this.v1 || v === this.v2 || v === this.v3;

	};

	Triangle.prototype.replaceVertex = function( oldv, newv ) {

		if ( oldv === this.v1 ) this.v1 = newv;
		else if ( oldv === this.v2 ) this.v2 = newv;
		else if ( oldv === this.v3 ) this.v3 = newv;

		oldv.faces.splice( oldv.faces.indexOf( this ), 1 );

		newv.faces.push( this );


		oldv.removeIfNonNeighbor( this.v1 );
		this.v1.removeIfNonNeighbor( oldv );

		oldv.removeIfNonNeighbor( this.v2 );
		this.v2.removeIfNonNeighbor( oldv );

		oldv.removeIfNonNeighbor( this.v3 );
		this.v3.removeIfNonNeighbor( oldv );

		this.v1.addUniqueNeighbor( this.v2 );
		this.v1.addUniqueNeighbor( this.v3 );

		this.v2.addUniqueNeighbor( this.v1 );
		this.v2.addUniqueNeighbor( this.v3 );

		this.v3.addUniqueNeighbor( this.v1 );
		this.v3.addUniqueNeighbor( this.v2 );

		this.computeNormal();

	};

	function Vertex( v, id ) {

		this.position = v;

		this.id = id; // old index id

		this.faces = []; // faces vertex is connected
		this.neighbors = []; // neighbouring vertices
		
		// these will be computed in computeEdgeCostAtVertex()
		this.cost = 0; // cost of collapsing this vertex, the less the better
		this.collapse = null; // best candinate for collapsing

	}

	Vertex.prototype.addUniqueNeighbor = function( vertex ) {
		pushIfUnique(this.neighbors, vertex);
	}


	Vertex.prototype.removeIfNonNeighbor = function( n ) {

		var neighbors = this.neighbors;
		var faces = this.faces;

		var offset = neighbors.indexOf( n );
		if ( offset === -1 ) return;
		for ( var i = 0; i < faces.length; i ++ ) {

			if ( faces[ i ].hasVertex( n ) ) return;

		}

		neighbors.splice( offset, 1 );
	}

	Vertex.prototype.isBorder = function() {
		var len = this.neighbors.length;
		for (var i = 0; i < len; i++) {
			var count = 0;
			var face_len = this.faces.length;
			for (var j = 0;j < face_len; j++) {
				if (this.faces[j].hasVertex(this.neighbors[i])) {
					count++;
				}
			}
			if (count === 1) return true;
		}
		return false;
	};


	THREE.SimplifyModifier.prototype.modify = function( geometry ) {
		
		var oldVertices = geometry.vertices;
		var oldFaces = geometry.faces;

		var newGeometry = new THREE.Geometry();

		var vertices = new Array( oldVertices.length );
		var faces = new Array( oldFaces.length );
		
		var i, il, face;

		//
		// put data of original geometry in different data structures
		//

		// add vertices
		for ( i = 0, il = oldVertices.length; i < il; i ++ ) {

			vertices[ i ] = new Vertex( oldVertices[ i ], i );

		}

		// add faces
		for ( i = 0, il = oldFaces.length; i < il; i ++ ) {

			face = oldFaces[ i ];
			faces[ i ] = new Triangle( vertices[ face.a ], vertices[ face.b ], vertices[ face.c ] );

		}

		// compute all edge collapse costs
		for ( i = 0, il = vertices.length; i < il; i ++ ) {

			computeEdgeCostAtVertex( vertices[ i ] );

		}

		var permutation = new Array( vertices.length );
		var map = new Array( vertices.length );

		var nextVertex;

		// reduce the object down to nothing:
		var z = 0;
		z = vertices.length * 0.25 | 0;
		z = 300;

		// while( z-- ) {
		// nextVertex = minimumCostEdge( vertices );
		// collapse( vertices, faces, nextVertex, nextVertex.collapse );
		// }

		while( vertices.length > 0 ) {
		
			// get the next vertex to collapse
			nextVertex = minimumCostEdge( vertices );
			
			// keep track of this vertex, i.e. the collapse ordering
			permutation[ nextVertex.id ] = vertices.length - 1;

			// keep track of vertex to which we collapse to
			map[ vertices.length - 1 ] = nextVertex.collapse ? nextVertex.collapse.id : -1;

			// console.log('b4 vertices', vertices.length, 'faces', faces.length);
			// console.log( nextVertex.id, '>', nextVertex.collapse.id)

			// Collapse this edge (nextVertex will go into nextVertex.collapse)
			collapse( vertices, faces, nextVertex, nextVertex.collapse );

			// console.log('after vertices', vertices.length, 'faces', faces.length);
			// console.log('.', map);
			// console.log('*', permutation);
			// permutation [7, 6, 5, 2, 1, 4, 3, 0, 11, 10, 9, 8]
		}


		var sortedVertices = new Array(vertices.length);
		
		for (i = 0; i < map.length; i ++ ) {

			map[i] = ( map[i] === - 1 ) ? 0 : permutation[ map[ i ] ];

			sortedVertices[ permutation[ i ] ] = oldVertices[ i ];

		}

		// console.log('after vertices', vertices.length, 'faces', faces.length);

		// console.log('map', map);
		// console.log('permutation', permutation);

		var sortedGeometry = new THREE.Geometry();

		for (i=0; i < sortedVertices.length; i++) {

			sortedGeometry.vertices.push( sortedVertices[ i ] );

		}


		for (i = 0; i < oldFaces.length; i++) {

			face = oldFaces[ i ];

			var a = permutation[ face.a ];
			var b = permutation[ face.b ];
			var c = permutation[ face.c ];

			sortedGeometry.faces.push( new THREE.Face3( a, b, c ) );


		}

		// geometry.vertices = [];
		// geometry.faces = [];

		geometry.vertices = sortedGeometry.vertices.concat();
		sortedGeometry.map = map;
		sortedGeometry.permutation = permutation;
		
		return sortedGeometry;


	};
})()