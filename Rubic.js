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
	
		this.H3_Y_COORDINATE =  1
		this.H2_Y_COORDINATE = -1
		this.H1_Y_COORDINATE = -3
		
		this.V1_Z_COORDINATE = -3
		this.V2_Z_COORDINATE = -1
		this.V3_Z_COORDINATE =  1
		
		this.program = program
		this.cubes = []
		
		this.cubes = this.cubes.concat(this.createRubicSlice(vec4(-1.5, -1.5, -1.5, 1.0), 0))
		this.cubes = this.cubes.concat(this.createRubicSlice(vec4(-0.5, -1.5, -1.5, 1.0), 9))
		this.cubes = this.cubes.concat(this.createRubicSlice(vec4(0.5, -1.5, -1.5, 1.0), 18))
		// console.log(this.cubes[0].position, this.cubes[0].matModel)
		// this.remainingRotationDegrees = 90
		this.rotationQueue = [new Rotation(this, RotationSlice.VERTICAL1, 90),
								new Rotation(this, RotationSlice.HORIZONTAL2, 90)]
		
		this.h = [[], [], []]
		this.v = [[], [], []]
		
		this.updateSlices()
		
		// this.v3.forEach(cube => console.log(cube.id))
	}
	
	render()
	{
		this.cubes.forEach(cube => cube.render());
		
		// this.rotateHorizontal(2)
		// this.rotateVertical(1)
		
		if (this.rotationQueue.length > 0)
		{
			// console.log(this.rotationQueue)

			var top = this.rotationQueue[this.rotationQueue.length - 1]
			// console.log(top)
			if (top.degrees != 0)
			{
				top.perform()
			}
			else
			{
				this.rotationQueue.pop()
				this.updateSlices()
			}
		}
		else
		{
			// this.generateRandomRotation()
		}
		
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
				v = this.v[0]
				break
			case 2:
				v = this.v[1]
				break
			case 3:
				v = this.v[2]
				break
		}
		
		
		v.forEach(cube => {
			let i = cube.id
			this.cubes[i].translateBy(0.5, 0.5, 0)
			this.cubes[i].rotate(this.ROTATION_SPEED, vec3(0, 0, 1))
			this.cubes[i].translateBy(-0.5, -0.5, 0)
		})	
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
				h = this.h[0]
				break
			case 2:
				h = this.h[1]
				break
			case 3:
				h = this.h[2]
				break
		}

		
		h.forEach(cube => {
			let i = cube.id
			this.cubes[i].translateBy(0.5, 0, 0.5)
			this.cubes[i].rotate(this.ROTATION_SPEED, vec3(0, 1, 0))
			this.cubes[i].translateBy(-0.5, 0, -0.5)
		})
	}
	
	/**
	 * Cleans and repopulates the H and V slice arrays using position-based calculations
	 */
	updateSlices()
	{
		var yDict = {}
		var zDict = {}
		
		this.h = [[], [], []]
		this.v = [[], [], []]
		
		this.cubes.forEach(cube => {			
			var currentPos = mult_v(cube.matModel, cube.position)
			
			// var currentPos = cube.position
			var currentY = currentPos[1]
			var currentZ = currentPos[2]
			// console.log(cube.id, currentY)
			
			currentY = Number(currentY.toFixed(4)); // rounding
			currentZ = Number(currentZ.toFixed(4)); // rounding
			
			
			if (yDict[currentY] == undefined)
			{
				yDict[currentY] = new Array()
			}
			if (zDict[currentZ] == undefined)
			{
				zDict[currentZ] = new Array()
			}
			
			yDict[currentY].push(cube)
			zDict[currentZ].push(cube)
		})
		
		var i = 0
		Object.keys(yDict).sort((a, b) => a - b).forEach(key => {
			this.h[i] = yDict[key]
			i++
		})
		
		i = 0
		Object.keys(zDict).sort((a, b) => a - b).forEach(key => {
			this.v[i] = zDict[key]
			i++
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
	
	/**
	 * Generates a random rotation instance and pushes it to the rotation queue
	 */
	generateRandomRotation()
	{
		let possibleRotations = Object.keys(RotationSlice)
		let randomRotationSlice = possibleRotations[Math.floor(Math.random() * possibleRotations.length)]
		
		this.rotationQueue.push(new Rotation(this, RotationSlice[randomRotationSlice], 90))
		// console.log(this.rotationQueue)
	}
}

/**
 * Describes a rotation that needs to be performed on the rubic's cube
 */
class Rotation 
{	
	/**
	 * @param {RotationSlice} slice 
	 * @param {number} degrees 
	 */
	constructor(rubic, slice, degrees)
	{
		this.rubic = rubic
		this.slice = slice
		this.degrees = degrees
	}
	
	/**
	 * Performs the rotation partially. This needs to be called repeatedly in render()
	 * Changes this.degrees accordingly
	 */
	perform()
	{
		switch(this.slice)
		{
			case RotationSlice.HORIZONTAL1:
				rubic.rotateHorizontal(1)
				break
			case RotationSlice.HORIZONTAL2:
				rubic.rotateHorizontal(2)
				break
			case RotationSlice.HORIZONTAL3:
				rubic.rotateHorizontal(3)
				break
			case RotationSlice.VERTICAL1:
				rubic.rotateVertical(1)
				break
			case RotationSlice.VERTICAL2:
				rubic.rotateVertical(2)
				break
			case RotationSlice.VERTICAL3:
				rubic.rotateVertical(3)
				break
		}
		
		this.degrees -= rubic.ROTATION_SPEED
	}
}

// Enum that contains the types of rotation
const RotationSlice = Object.freeze({
	HORIZONTAL1:   Symbol("H1"),
	HORIZONTAL2:   Symbol("H2"),
	HORIZONTAL3:   Symbol("H3"),
	
	VERTICAL1:  Symbol("V1"),
	VERTICAL2:  Symbol("V2"),
	VERTICAL3:  Symbol("V3"),
})