import Face3 from "./Face3";
import Face4 from "./Face4";
import Vector3 from "./Vector3";

export default class Geometry {

    vertices = [];
	faces = [];
	uvs = [];

    constructor() {

    }

	computeCentroids() {

        this.faces.forEach(face => {
            face.centroid.set( 0, 0, 0 );

            if ( face instanceof Face3 ) {

				face.centroid.addSelf( this.vertices[ face.a ].position );
				face.centroid.addSelf( this.vertices[ face.b ].position );
				face.centroid.addSelf( this.vertices[ face.c ].position );
				face.centroid.divideScalar( 3 );

			} else if ( face instanceof Face4 ) {

				face.centroid.addSelf( this.vertices[ face.a ].position );
				face.centroid.addSelf( this.vertices[ face.b ].position );
				face.centroid.addSelf( this.vertices[ face.c ].position );
				face.centroid.addSelf( this.vertices[ face.d ].position );
				face.centroid.divideScalar( 4 );

			}
        })
	}

    computeNormals() {

        this.vertices.forEach(vertex => {
			vertex.normal.set( 0, 0, 0 );
        })

        this.faces.forEach(face => {

            const vA = this.vertices[ face.a ];
            const vB = this.vertices[ face.b ];
            const vC = this.vertices[ face.c ];

            const cb = new Vector3()
            const ab = new Vector3()

            cb.sub( vC.position, vB.position );
            ab.sub( vA.position, vB.position );
            cb.crossSelf( ab );

            if ( !cb.isZero() ) {

                cb.normalize();

            }

            face.normal.copy( cb );

        })

    }

	computeBoundingBox() {
        
		if ( this.vertices.length > 0 ) {
            
            this.bbox = { 'x': [ this.vertices[ 0 ].position.x, this.vertices[ 0 ].position.x ], 
                          'y': [ this.vertices[ 0 ].position.y, this.vertices[ 0 ].position.y ], 
                          'z': [ this.vertices[ 0 ].position.z, this.vertices[ 0 ].position.z ] };
            
            this.vertices.forEach(vertex => {
                
                if ( vertex.position.x < this.bbox.x[ 0 ] )
                    this.bbox.x[ 0 ] = vertex.position.x;
                else if ( vertex.position.x > this.bbox.x[ 1 ] )
                    this.bbox.x[ 1 ] = vertex.position.x;

                if ( vertex.position.y < this.bbox.y[ 0 ] )
                    this.bbox.y[ 0 ] = vertex.position.y;
                else if ( vertex.position.y > this.bbox.y[ 1 ] )
                    this.bbox.y[ 1 ] = vertex.position.y;

                if ( vertex.position.z < this.bbox.z[ 0 ] )
                    this.bbox.z[ 0 ] = vertex.position.z;
                else if ( vertex.position.z > this.bbox.z[ 1 ] )
                    this.bbox.z[ 1 ] = vertex.position.z;

            });
 
        }
	}

	toString() {
		return 'MGeometry ( vertices: ' + this.vertices + ', faces: ' + this.faces + ' )';
	}
}