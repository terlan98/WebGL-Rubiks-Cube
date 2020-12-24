class Rubic {
	/*
	*        RUBIC'S CUBE
    *  	      ___ ___ ___
    *  	    /___/___/___/|
    *  	   /___/___/___/||
    *  ﹍﹍/___/___/__ /|/|
    *  H3 |   |   |   | /||
    *  ﹍﹍|___|___|___|/|/|
    *  H2 |   |   |   | /||---------(-z axis)
    *  ﹍﹍|___|___|___|/|/
    *  H1 |   |   |   | /
    *  ﹍﹍|___|___|___|/ 
	*     ┆   ┆   ┆   ┆
	*     ┆V3 ┆V2 ┆V1 ┆
	*/
	
	constructor(program)
	{
		this.ROTATION_SPEED = 2
	
		this.H3_Y_COORDINATE =  0.5
		this.H2_Y_COORDINATE = -0.5
		this.H1_Y_COORDINATE = -1.5
		
		this.V1_Z_COORDINATE = -1.5
		this.V2_Z_COORDINATE = -0.5
		this.V3_Z_COORDINATE =  0.5
		
		this.program = program
		this.cubes = []
		this.remainingRotationDegrees = 90

		this.cubes = this.cubes.concat(this.createRubicSlice(vec4(-1.5, -1.5, -1.5, 1.0), 0))
		this.cubes = this.cubes.concat(this.createRubicSlice(vec4(-0.5, -1.5, -1.5, 1.0), 9))
		this.cubes = this.cubes.concat(this.createRubicSlice(vec4(0.5, -1.5, -1.5, 1.0), 18))
		
		this.h3 = []
		this.h2 = []
		this.h1 = []
		
		this.v3 = []
		this.v2 = []
		this.v1 = []
		
		this.updateSlices()
		
		// this.v3.forEach(cube => console.log(cube.id))
	}
	
	render()
	{
		this.cubes.forEach(cube => cube.render());
		
		// this.rotateHorizontal(2)
		this.rotateVertical(1)
		
		// console.log(this.cubes[6].position[2])
		
		// this.cubes[24].translateBy(0.5, 0.5, 0)
		// this.cubes[24].rotate(1, vec3(0, 0, 1))
		// this.cubes[24].translateBy(-0.5, -0.5, 0)
		
	}
	
	/**
	 * Rotates one of the V slices based on the given input.
	 * @param vNumber a number in range 1-3, indicating the V slice to be rotated
	 */
	rotateVertical(vNumber)
	{
		if (vNumber == undefined) {
			console.log("NO V NUMBER PROVIDED")
			return
		}
		
		var v = []
		
		switch(vNumber)
		{
			case 1:
				v = this.v1
				break
			case 2:
				v = this.v2
				break
			case 3:
				v = this.v3
				break
		}
		
		if(this.remainingRotationDegrees > 0)
		{
			v.forEach(cube => {
				let i = cube.id
				this.cubes[i].translateBy(0.5, 0.5, 0)
				this.cubes[i].rotate(this.ROTATION_SPEED, vec3(0, 0, 1))
				this.cubes[i].translateBy(-0.5, -0.5, 0)
			})
			
			this.remainingRotationDegrees -= this.ROTATION_SPEED
		}
	}
	
	/**
	 * Rotates one of the H slices based on the given input.
	 * @param hNumber a number in range 1-3, indicating the H slice to be rotated
	 */
	rotateHorizontal(hNumber)
	{
		if (hNumber == undefined) {
			console.log("NO H NUMBER PROVIDED")
			return
		}
		
		var h = []
		
		switch(hNumber)
		{
			case 1:
				h = this.h1
				break
			case 2:
				h = this.h2
				break
			case 3:
				h = this.h3
				break
		}
		
		if(this.remainingRotationDegrees > 0)
		{
			h.forEach(cube => {
				let i = cube.id
				this.cubes[i].translateBy(0.5, 0, 0.5)
				this.cubes[i].rotate(this.ROTATION_SPEED, vec3(0, 1, 0))
				this.cubes[i].translateBy(-0.5, 0, -0.5)
			})
			
			this.remainingRotationDegrees -= this.ROTATION_SPEED
		}
	}
	
	/**
	 * Cleans and repopulates the H and V slice arrays using position-based calculations
	 */
	updateSlices()
	{
		this.h1 = []
		this.h2 = []
		this.h3 = []
		this.v1 = []
		this.v2 = []
		this.v3 = []
		
		this.cubes.forEach(cube => {
			
			switch(cube.position[1]) // y coordinate check for H slices
			{
				case this.H3_Y_COORDINATE:
					this.h3.push(cube)
					break
				case this.H2_Y_COORDINATE:
					this.h2.push(cube)
					break
				case this.H1_Y_COORDINATE:
					this.h1.push(cube)
					break
			}
			
			switch(cube.position[2]) // z coordinate check for V slices
			{
				case this.V1_Z_COORDINATE:
					this.v1.push(cube)
					break
				case this.V2_Z_COORDINATE:
					this.v2.push(cube)
					break
				case this.V3_Z_COORDINATE:
					this.v3.push(cube)
					break
			}
		})
	}
	
	
	/**
	 * Creates a single slice (9 cubes) at the given position.
	 * This method is created with the idea that a Rubic's Cube consists of 3 slices.
	 * Therefore, this function should be called thrice to get a rubic's cube.
	 * @param position - vec4
	 */
	createRubicSlice(position, startId)
	{
		var cubes = []
		
		let x = position[0]
		let y = position[1]
		let z = position[2]
		let alpha = position[3]
		
		var cubeId = startId
		
		for (var i = 0; i < 3; i++) 
		{
			for (var j = 0; j < 3; j++, cubeId++)
			{
				var cubePosition = vec4(x, y + j, z + i, alpha)
							
				var cube = new Cube(program, cubeId, cubePosition, 1)
				cube.init()
				cubes.push(cube)
			}
		}
		
		return cubes
	}
}