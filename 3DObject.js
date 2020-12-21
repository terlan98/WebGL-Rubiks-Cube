/**
 * _3DObject class represents an abstract structure to define 3D objects.
 * Objects should be initialized by passing program id for compiled shaders.
 * Object holds internally references to buffers, vertices, indices and other attributes of an object.
 * Position is a vec3(x, y, z) structure.
 * Model matrix is object transformation matrix, which initially is identity matrix. 
 * Child classes should override loadData method and implement specific vertex, index loading mechanism.
 * TODO: add texture
 */
class _3DObject {
	constructor(program, position = vec3(0, 0, 0)) {
		this.program = program;
		this.bufVertex = 0;
		this.bufIndex = 0;
		this.bufNormal = 0;
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.position = position;
		this.matModel = mat4();
		this.material = {
			ambient: vec3(0.2, 0.3, 0.4),
			diffuse: vec3(0.1, 0.3, 0.2),
			specular: vec3(0.0, 0.0, 0.0),
			shininess: 250.0
		}
	}

	loadData() {
		// should be overridden
	}

	init() {
		this.matModel = translate(this.position[0], this.position[1], this.position[2]);
		this.loadData();

		// creating buffer for vertex positions
		this.bufVertex = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufVertex);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW);

		// creating another buffer for vertex normals
		this.bufNormal = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNormal);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);

		// creating buffer for element indices
		this.bufIndex = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIndex);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
	}

	render() {
		// sending material properties
		var ambient = gl.getUniformLocation(this.program, "col_Ambient");
		gl.uniform3fv(ambient, flatten(this.material.ambient));

		var diffuse = gl.getUniformLocation(this.program, "col_Diffuse");
		gl.uniform3fv(diffuse, flatten(this.material.diffuse));

		var specular = gl.getUniformLocation(this.program, "col_Specular");
		gl.uniform3fv(specular, flatten(this.material.specular));

		var shininess = gl.getUniformLocation(this.program, "col_Shininess");
		gl.uniform1f(shininess, this.material.shininess);

		var model = gl.getUniformLocation(this.program, "m_Model");
		gl.uniformMatrix4fv(model, false, flatten(this.matModel));

		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufVertex);

		var pos = gl.getAttribLocation(this.program, "v_Pos");
		gl.vertexAttribPointer(pos, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(pos);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNormal);

		var norm = gl.getAttribLocation(this.program, "v_Norm");
		gl.vertexAttribPointer(norm, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(norm);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIndex);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0)
	}

	translateBy(x, y, z) {
		this.matModel = mult(translate(x, y, z), this.matModel);
	}

	rotate(angle) {
		this.matModel = mult(rotate(angle, vec3(0, 1, 0)), this.matModel);
	}
	
	rotate(angle, axis) {
		this.matModel = mult(rotate(angle, axis), this.matModel);
	}
}