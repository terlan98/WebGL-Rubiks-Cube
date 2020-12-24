class Cube extends _3DObject {
	constructor(program, id, position, size = 1) {
		super(program, position);
		this.position = position;
		this.size = size;
		this.id = id
		
		this.initVertices = [
			vec4( -0.5, -0.5,  0.5, 1.0 ),
			vec4( -0.5,  0.5,  0.5, 1.0 ),
			vec4( 0.5,  0.5,  0.5, 1.0 ),
			vec4( 0.5, -0.5,  0.5, 1.0 ),
			vec4( -0.5, -0.5, -0.5, 1.0 ),
			vec4( -0.5,  0.5, -0.5, 1.0 ),
			vec4( 0.5,  0.5, -0.5, 1.0 ),
			vec4( 0.5, -0.5, -0.5, 1.0 )
		]
		
		// this.material.ambient = vec3(Math.random(), Math.random(), Math.random())
	}

	quad(a, b, c, d) 
	{
		var t1 = subtract(this.initVertices[b], this.initVertices[a]);
		var t2 = subtract(this.initVertices[c], this.initVertices[b]);
		var normal = cross(t1, t2);
		var normal = vec4(normal,0)
   
   
		this.vertices.push(this.initVertices[a]); 
		this.normals.push(normal); 
		this.vertices.push(this.initVertices[b]); 
		this.normals.push(normal); 
		this.vertices.push(this.initVertices[c]); 
		this.normals.push(normal);   
		this.vertices.push(this.initVertices[a]);  
		this.normals.push(normal); 
		this.vertices.push(this.initVertices[c]); 
		this.normals.push(normal); 
		this.vertices.push(this.initVertices[d]); 
		this.normals.push(normal);   
   	}
	
	loadData() {
		this.quad( 1, 0, 3, 2 );
		this.quad( 2, 3, 7, 6 );
		this.quad( 3, 0, 4, 7 );
		this.quad( 6, 5, 1, 2 );
		this.quad( 4, 5, 6, 7 );
		this.quad( 5, 4, 0, 1 );
	}
}