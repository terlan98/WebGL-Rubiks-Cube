class Cube extends _3DObject {
	constructor(program, id, position, size = 1) {
		super(program, position);
		this.position = position;
		this.size = size;
		this.id = id
		
		
		// this.material.ambient = vec3(Math.random(), Math.random(), Math.random())
	}

	generateNormalsForSide(a, b, c)
	{
		var t1 = subtract(this.vertices[b], this.vertices[a]);
		var t2 = subtract(this.vertices[c], this.vertices[b]);
		var normal = cross(t1, t2);
		normal = vec4(normalize(normal), 0.0)
				
		this.normals.push(normal);
		this.normals.push(normal);
		this.normals.push(normal);
		this.normals.push(normal);
		this.normals.push(normal);
		this.normals.push(normal);
	}
	
	generateNormals()
	{
		// console.log(this.vertices)
		this.normals = []
		
		var normalsToPush = [vec4(1, 1, 1, 0),
							vec4(1, 1, 1, 0),
							vec4(0, 0, 0, 0),
							vec4(0, 0, 0, 0),
							vec4(0, 0, 0, 0),
							vec4(0, 0, 0, 0)]
		
		normalsToPush = normalsToPush.reverse() // because pop() takes from the last index
		
		for(var i = 0; i < 6; i++)
		{
			var normal = normalsToPush.pop()
			
			for(var j = 0; j < 6; j++)
			{
				this.normals.push(normal);
			}
		}
		
		console.log(this.normals)
		console.log("---")
	}
	
	generateVertices()
	{
		for (var x = -0.5; x <= 0.5; x += 1)
			for (var y = -0.5; y <= 0.5; y += 1)
				for (var z = -0.5; z <= 0.5; z += 1)
					this.vertices.push(vec4(x * this.size, y * this.size, z * this.size, 1.0));
		console.log(this.vertices)
		// console.log("end of 1 cube")
	}
	
	loadData() {
		this.indices = [0, 2, 1, 1, 2, 3,
			4, 6, 5, 5, 6, 7,
			0, 1, 4, 4, 1, 5,
			2, 3, 6, 6, 3, 7,
			0, 4, 6, 6, 2, 0,
			1, 7, 5, 7, 1, 3]
		

		this.generateVertices()
		this.generateNormals()
	}
}