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
		
		this.texCoordsArray = []
		this.texture = []
		// this.texCoord = [
		// 	vec2(0, 0),
		// 	vec2(0, 1),
		// 	vec2(1, 1),
		// 	vec2(1, 0)
		// ]
		
		this.greenTexCoord = [
			vec2(0.0, 0.375),
			vec2(0.0, 0.625),
			vec2(0.25, 0.625),
			vec2(0.25, 0.375)
		]
		
		this.redTexCoord = [
			vec2(0.25, 0.375),
			vec2(0.25, 0.625),
			vec2(0.5, 0.625),
			vec2(0.5, 0.375)
		]
		
		this.blueTexCoord = [
			vec2(0.5, 0.375),
			vec2(0.5, 0.625),
			vec2(0.75, 0.625),
			vec2(0.75, 0.375)
		]
		
		this.orangeTexCoord = [
			vec2(0.75, 0.375),
			vec2(0.75, 0.625),
			vec2(1.0, 0.625),
			vec2(1.0, 0.375)
		]
		
		this.yellowTexCoord = [
			vec2(0.25, 0.375),
			vec2(0.25, 0.12),
			vec2(0.5, 0.12),
			vec2(0.5, 0.375)
		]
		
		this.whiteTexCoord = [
			vec2(0.25, 0.88),
			vec2(0.25, 0.625),
			vec2(0.5, 0.625),
			vec2(0.5, 0.88)
		]
		
		// var maxX = 0.5
		// var minX = 0.25
		// var maxY = 0.625
		// var minY = 0.88
		// this.texCoord = [
		// 	vec2(minX, minY),
		// 	vec2(minX, maxY),
		// 	vec2(maxX, maxY),
		// 	vec2(maxX, minY)
		// ]
		
		// this.material.ambient = vec3(Math.random(), Math.random(), Math.random())
	}

	init()
	{
		super.init()
		
		this.tBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.tBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(this.texCoordsArray), gl.STATIC_DRAW );
		
		// var image = new Image();
		// image.onload = function() { 
		// 	this.configureTexture( image );
		// }
		// image.src = "test.jpg"
		
		var image = document.getElementById("texImage");
		this.configureTexture( image );
	}
	
	render()
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		
		var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
		gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vTexCoord );
		
		super.render()
	}
	
	/**
	 * Generates vertices and normals for a single face of cube.
	 * @param {number} a index of vertex 1
	 * @param {number} b index of vertex 2
	 * @param {number} c index of vertex 3
	 * @param {number} d index of vertex 4
	 * @param {number} faceNum a number in range 1-6 indicating which face this is
	 */
	quad(a, b, c, d, faceNum) 
	{
		var t1 = subtract(this.initVertices[b], this.initVertices[a]);
		var t2 = subtract(this.initVertices[c], this.initVertices[b]);
		var normal = cross(t1, t2);
		var normal = vec4(normal,0)
		var texCoord = []
		
		switch(faceNum)
		{
			case 1:
				texCoord = this.blueTexCoord
				break
			case 2:
				texCoord = this.redTexCoord
				break
			case 3:
				texCoord = this.whiteTexCoord
				break
			case 4:
				texCoord = this.yellowTexCoord
				break
			case 5:
				texCoord = this.greenTexCoord
				break
			case 6:
				texCoord = this.orangeTexCoord
				break
		}
   
		this.vertices.push(this.initVertices[a]); 
		this.normals.push(normal); 
		this.texCoordsArray.push(texCoord[0]);
		
		this.vertices.push(this.initVertices[b]); 
		this.normals.push(normal);
		this.texCoordsArray.push(texCoord[1]);
		
		this.vertices.push(this.initVertices[c]); 
		this.normals.push(normal);
		this.texCoordsArray.push(texCoord[2]);
		
		this.vertices.push(this.initVertices[a]);  
		this.normals.push(normal);
		this.texCoordsArray.push(texCoord[0]);

		this.vertices.push(this.initVertices[c]);
		this.normals.push(normal);
		this.texCoordsArray.push(texCoord[2]);

		this.vertices.push(this.initVertices[d]); 
		this.normals.push(normal);
		this.texCoordsArray.push(texCoord[3]);
   	}
	
	loadData() {
		this.quad( 1, 0, 3, 2, 1 );
		this.quad( 2, 3, 7, 6, 2 );
		this.quad( 3, 0, 4, 7, 3 );
		this.quad( 6, 5, 1, 2, 4 );
		this.quad( 4, 5, 6, 7, 5 );
		this.quad( 5, 4, 0, 1, 6 );
	}
	
	configureTexture( image ) {
		this.texture = gl.createTexture();
		gl.bindTexture( gl.TEXTURE_2D, this.texture );
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
		gl.generateMipmap( gl.TEXTURE_2D );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
						  gl.NEAREST_MIPMAP_LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	}
}