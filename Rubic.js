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
    *  ﹍﹍|___|___|___|/|/  X3
    *  H1 |   |   |   | /  X2
    *  ﹍﹍|___|___|___|/ X1
	*     ┆   ┆   ┆   ┆
	*     ┆V3 ┆V2 ┆V1 ┆
	*/
	
	constructor(program)
	{
		this.ROTATION_SPEED = 3
	
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
		
		
		this.randomRotationsEnabled = true
		// this.rotationQueue = [new Rotation(this, RotationSlice.X1, 90),
		// 						new Rotation(this, RotationSlice.VERTICAL2, -90),
		// 						new Rotation(this, RotationSlice.X1, 90)]
		// this.rotationQueue = [new Rotation(this, RotationSlice.X1, -90)]
		this.rotationQueue = []
		
		this.rubicArray = [ [ [ 8, 17, 26 ], [ 5, 14, 23 ], [ 2, 11, 20 ] ],
							[ [ 7, 16, 25 ], [ 4, 13, 22 ], [ 1, 10, 19 ] ],
							[ [ 6, 15, 24 ], [ 3, 12, 21 ], [ 0, 9, 18 ] ] ]
		
		this.h = [[], [], []]
		this.v = [[], [], []]
		this.x = [[], [], []]
		
		// console.log(this.rubicArray)
		this.updateSlices()
	}
	
	render()
	{
		this.cubes.forEach(cube => cube.render());
		
		if (this.rotationQueue.length > 0)
		{
			var top = this.rotationQueue[this.rotationQueue.length - 1]
			
			if (top.degrees != 0)
			{
				top.perform()
			}
			else
			{
				let lastRotation = this.rotationQueue.pop()
				this.updateSlices(lastRotation)
			}
		}
		else
		{
			if(this.randomRotationsEnabled)
			{
				this.generateRandomRotation()
			}
		}
	}
	
	/**
	 * Rotates one of the X slices based on the given input.
	 * @param xNumber a number in range 1-3, indicating the X slice to be rotated
	 * @param isNegative a boolean indicating whether the rotation is in negative direction
	 */
	rotateX(xNumber, isNegative)
	{
		if (xNumber == undefined) {
			console.log("NO V NUMBER PROVIDED")
			return
		}
		
		var x = []
		
		switch(xNumber)
		{
			case 1:
				x = this.x[0]
				break
			case 2:
				x = this.x[1]
				break
			case 3:
				x = this.x[2]
				break
		}
		
		var speed = this.ROTATION_SPEED
		if (isNegative)
		{
			speed *= -1
		}
		
		x.forEach(id => {
			this.cubes[id].translateBy(0, 0.5, 0.5)
			this.cubes[id].rotate(speed, vec3(1, 0, 0))
			this.cubes[id].translateBy(0, -0.5, -0.5)
		})
	}
	
	/**
	 * Rotates one of the V slices based on the given input.
	 * @param vNumber a number in range 1-3, indicating the V slice to be rotated
	 * @param isNegative a boolean indicating whether the rotation is in negative direction
	 */
	rotateVertical(vNumber, isNegative)
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
		
		var speed = this.ROTATION_SPEED
		if (isNegative)
		{
			speed *= -1
		}
		
		v.forEach(id => {
			this.cubes[id].translateBy(0.5, 0.5, 0)
			this.cubes[id].rotate(speed, vec3(0, 0, 1))
			this.cubes[id].translateBy(-0.5, -0.5, 0)
		})
	}
	
	/**
	 * Rotates one of the H slices based on the given input.
	 * @param hNumber a number in range 1-3, indicating the H slice to be rotated
	 * @param isNegative a boolean indicating whether the rotation is in negative direction
	 */
	rotateHorizontal(hNumber, isNegative)
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
		
		var speed = this.ROTATION_SPEED
		if (isNegative)
		{
			speed *= -1
		}
		
		h.forEach(id => {
			this.cubes[id].translateBy(0.5, 0, 0.5)
			this.cubes[id].rotate(speed, vec3(0, 1, 0))
			this.cubes[id].translateBy(-0.5, 0, -0.5)
		})
	}
	
	/**
	 * Cleans and repopulates the H and V slice arrays using position-based calculations
	 */
	updateSlices(rotation)
	{
		var yDict = {}
		var zDict = {}
		
		this.h = [[], [], []]
		this.v = [[], [], []]
		this.x = [[], [], []]
		
		var newRubic = JSON.parse(JSON.stringify(this.rubicArray)); // deep copying rubic array
		
		if (rotation != undefined) // false during initial setup
		{
			let rotSlice = rotation.slice
			let isNegative = rotation.isNegative
			
			switch(rotSlice)
			{
				case RotationSlice.VERTICAL1:
					if (isNegative)
					{
						newRubic[2][2][0] = this.rubicArray[2][2][2]				
						newRubic[2][2][1] = this.rubicArray[1][2][2]
						newRubic[2][2][2] = this.rubicArray[0][2][2]
						
						newRubic[1][2][0] = this.rubicArray[2][2][1]
						newRubic[1][2][2] = this.rubicArray[0][2][1]
						
						newRubic[0][2][0] = this.rubicArray[2][2][0]
						newRubic[0][2][1] = this.rubicArray[1][2][0]
						newRubic[0][2][2] = this.rubicArray[0][2][0]
					}
					else
					{
						newRubic[2][2][0] = this.rubicArray[0][2][0]				
						newRubic[2][2][1] = this.rubicArray[1][2][0]
						newRubic[2][2][2] = this.rubicArray[2][2][0]
						
						newRubic[1][2][0] = this.rubicArray[0][2][1]
						newRubic[1][2][2] = this.rubicArray[2][2][1]
						
						newRubic[0][2][0] = this.rubicArray[0][2][2]
						newRubic[0][2][1] = this.rubicArray[1][2][2]
						newRubic[0][2][2] = this.rubicArray[2][2][2]
					}
					break
				
				case RotationSlice.VERTICAL2:
					if(isNegative)
					{
						newRubic[0][1][0] = this.rubicArray[2][1][0]				
						newRubic[0][1][1] = this.rubicArray[1][1][0]
						newRubic[0][1][2] = this.rubicArray[0][1][0]
						
						newRubic[1][1][0] = this.rubicArray[2][1][1]
						newRubic[1][1][2] = this.rubicArray[0][1][1]
						
						newRubic[2][1][0] = this.rubicArray[2][1][2]
						newRubic[2][1][1] = this.rubicArray[1][1][2]
						newRubic[2][1][2] = this.rubicArray[0][1][2]
					}
					else
					{
						newRubic[0][1][0] = this.rubicArray[0][1][2]				
						newRubic[0][1][1] = this.rubicArray[1][1][2]
						newRubic[0][1][2] = this.rubicArray[2][1][2]
						
						newRubic[1][1][0] = this.rubicArray[0][1][1]
						newRubic[1][1][2] = this.rubicArray[2][1][1]
						
						newRubic[2][1][0] = this.rubicArray[0][1][0]
						newRubic[2][1][1] = this.rubicArray[1][1][0]
						newRubic[2][1][2] = this.rubicArray[2][1][0]
					}
					break
				
				case RotationSlice.VERTICAL3:
					if(isNegative)
					{
						newRubic[0][0][0] = this.rubicArray[2][0][0]
						newRubic[0][0][1] = this.rubicArray[1][0][0]
						newRubic[0][0][2] = this.rubicArray[0][0][0]
						
						newRubic[1][0][0] = this.rubicArray[2][0][1]
						newRubic[1][0][2] = this.rubicArray[0][0][1]
						
						newRubic[2][0][0] = this.rubicArray[2][0][2]
						newRubic[2][0][1] = this.rubicArray[1][0][2]
						newRubic[2][0][2] = this.rubicArray[0][0][2]
					}
					else
					{
						newRubic[0][0][0] = this.rubicArray[0][0][2]
						newRubic[0][0][1] = this.rubicArray[1][0][2]
						newRubic[0][0][2] = this.rubicArray[2][0][2]
						
						newRubic[1][0][0] = this.rubicArray[0][0][1]
						newRubic[1][0][2] = this.rubicArray[2][0][1]
						
						newRubic[2][0][0] = this.rubicArray[0][0][0]
						newRubic[2][0][1] = this.rubicArray[1][0][0]
						newRubic[2][0][2] = this.rubicArray[2][0][0]
					}
					break
					
				case RotationSlice.HORIZONTAL1:
					if(isNegative)
					{
						newRubic[2][0][0] = this.rubicArray[2][0][2]
						newRubic[2][0][1] = this.rubicArray[2][1][2]
						newRubic[2][0][2] = this.rubicArray[2][2][2]
						
						newRubic[2][1][0] = this.rubicArray[2][0][1]
						newRubic[2][1][2] = this.rubicArray[2][2][1]
						
						newRubic[2][2][0] = this.rubicArray[2][0][0]
						newRubic[2][2][1] = this.rubicArray[2][1][0]
						newRubic[2][2][2] = this.rubicArray[2][2][0]
					}
					else
					{
						newRubic[2][0][0] = this.rubicArray[2][2][0]
						newRubic[2][0][1] = this.rubicArray[2][1][0]
						newRubic[2][0][2] = this.rubicArray[2][0][0]
						
						newRubic[2][1][0] = this.rubicArray[2][2][1]
						newRubic[2][1][2] = this.rubicArray[2][0][1]
						
						newRubic[2][2][0] = this.rubicArray[2][2][2]
						newRubic[2][2][1] = this.rubicArray[2][1][2]
						newRubic[2][2][2] = this.rubicArray[2][0][2]	
					}
					break
					
				case RotationSlice.HORIZONTAL2:
					if(isNegative)
					{
						newRubic[1][0][0] = this.rubicArray[1][0][2]
						newRubic[1][0][1] = this.rubicArray[1][1][2]
						newRubic[1][0][2] = this.rubicArray[1][2][2]
						
						newRubic[1][1][0] = this.rubicArray[1][0][1]
						newRubic[1][1][2] = this.rubicArray[1][2][1]
						
						newRubic[1][2][0] = this.rubicArray[1][0][0]
						newRubic[1][2][1] = this.rubicArray[1][1][0]
						newRubic[1][2][2] = this.rubicArray[1][2][0]	
					}
					else
					{
						newRubic[1][0][0] = this.rubicArray[1][2][0]
						newRubic[1][0][1] = this.rubicArray[1][1][0]
						newRubic[1][0][2] = this.rubicArray[1][0][0]
						
						newRubic[1][1][0] = this.rubicArray[1][2][1]
						newRubic[1][1][2] = this.rubicArray[1][0][1]
						
						newRubic[1][2][0] = this.rubicArray[1][2][2]
						newRubic[1][2][1] = this.rubicArray[1][1][2]
						newRubic[1][2][2] = this.rubicArray[1][0][2]
					}
					break
				
				case RotationSlice.HORIZONTAL3:
					if(isNegative)
					{
						newRubic[0][0][0] = this.rubicArray[0][0][2]
						newRubic[0][0][1] = this.rubicArray[0][1][2]
						newRubic[0][0][2] = this.rubicArray[0][2][2]
						
						newRubic[0][1][0] = this.rubicArray[0][0][1]
						newRubic[0][1][2] = this.rubicArray[0][2][1]
						
						newRubic[0][2][0] = this.rubicArray[0][0][0]
						newRubic[0][2][1] = this.rubicArray[0][1][0]
						newRubic[0][2][2] = this.rubicArray[0][2][0]
					}
					else
					{
						newRubic[0][0][0] = this.rubicArray[0][2][0]
						newRubic[0][0][1] = this.rubicArray[0][1][0]
						newRubic[0][0][2] = this.rubicArray[0][0][0]
						
						newRubic[0][1][0] = this.rubicArray[0][2][1]
						newRubic[0][1][2] = this.rubicArray[0][0][1]
						
						newRubic[0][2][0] = this.rubicArray[0][2][2]
						newRubic[0][2][1] = this.rubicArray[0][1][2]
						newRubic[0][2][2] = this.rubicArray[0][0][2]	
					}
					break
				
				case RotationSlice.X1:
					if(isNegative)
					{
						newRubic[0][2][2] = this.rubicArray[0][0][2]
						newRubic[0][1][2] = this.rubicArray[1][0][2]
						newRubic[0][0][2] = this.rubicArray[2][0][2]
						
						newRubic[1][2][2] = this.rubicArray[0][1][2]
						newRubic[1][0][2] = this.rubicArray[2][1][2]
						
						newRubic[2][2][2] = this.rubicArray[0][2][2]
						newRubic[2][1][2] = this.rubicArray[1][2][2]
						newRubic[2][0][2] = this.rubicArray[2][2][2]
					}
					else
					{
						newRubic[0][2][2] = this.rubicArray[2][2][2]
						newRubic[0][1][2] = this.rubicArray[1][2][2]
						newRubic[0][0][2] = this.rubicArray[0][2][2]
						
						newRubic[1][2][2] = this.rubicArray[2][1][2]
						newRubic[1][0][2] = this.rubicArray[0][1][2]
						
						newRubic[2][2][2] = this.rubicArray[2][0][2]
						newRubic[2][1][2] = this.rubicArray[1][0][2]
						newRubic[2][0][2] = this.rubicArray[0][0][2]
					}
					break
					
				case RotationSlice.X2:
					if(isNegative)
					{
						newRubic[0][2][1] = this.rubicArray[0][0][1]
						newRubic[0][1][1] = this.rubicArray[1][0][1]
						newRubic[0][0][1] = this.rubicArray[2][0][1]
						
						newRubic[1][2][1] = this.rubicArray[0][1][1]
						newRubic[1][0][1] = this.rubicArray[2][1][1]
						
						newRubic[2][2][1] = this.rubicArray[0][2][1]
						newRubic[2][1][1] = this.rubicArray[1][2][1]
						newRubic[2][0][1] = this.rubicArray[2][2][1]
					}
					else
					{
						newRubic[0][2][1] = this.rubicArray[2][2][1]
						newRubic[0][1][1] = this.rubicArray[1][2][1]
						newRubic[0][0][1] = this.rubicArray[0][2][1]
						
						newRubic[1][2][1] = this.rubicArray[2][1][1]
						newRubic[1][0][1] = this.rubicArray[0][1][1]
						
						newRubic[2][2][1] = this.rubicArray[2][0][1]
						newRubic[2][1][1] = this.rubicArray[1][0][1]
						newRubic[2][0][1] = this.rubicArray[0][0][1]
					}
					break
				
				case RotationSlice.X3:
					if(isNegative)
					{
						newRubic[0][2][0] = this.rubicArray[0][0][0]
						newRubic[0][1][0] = this.rubicArray[1][0][0]
						newRubic[0][0][0] = this.rubicArray[2][0][0]
						
						newRubic[1][2][0] = this.rubicArray[0][1][0]
						newRubic[1][0][0] = this.rubicArray[2][1][0]
						
						newRubic[2][2][0] = this.rubicArray[0][2][0]
						newRubic[2][1][0] = this.rubicArray[1][2][0]
						newRubic[2][0][0] = this.rubicArray[2][2][0]
					}
					else
					{
						newRubic[0][2][0] = this.rubicArray[2][2][0]
						newRubic[0][1][0] = this.rubicArray[1][2][0]
						newRubic[0][0][0] = this.rubicArray[0][2][0]
						
						newRubic[1][2][0] = this.rubicArray[2][1][0]
						newRubic[1][0][0] = this.rubicArray[0][1][0]
						
						newRubic[2][2][0] = this.rubicArray[2][0][0]
						newRubic[2][1][0] = this.rubicArray[1][0][0]
						newRubic[2][0][0] = this.rubicArray[0][0][0]
					}
					break
			}
			
			// console.log("newRubic:",newRubic)
			this.rubicArray = newRubic
		}
		
		// Assigning proper values to slices (to be used by rotation functions)
		// H-slice
		this.h[0] = this.h[0].concat(this.rubicArray[2][2])
		this.h[0] = this.h[0].concat(this.rubicArray[2][1])
		this.h[0] = this.h[0].concat(this.rubicArray[2][0])
		
		this.h[1] = this.h[1].concat(this.rubicArray[1][2])
		this.h[1] = this.h[1].concat(this.rubicArray[1][1])
		this.h[1] = this.h[1].concat(this.rubicArray[1][0])
		
		this.h[2] = this.h[2].concat(this.rubicArray[0][2])
		this.h[2] = this.h[2].concat(this.rubicArray[0][1])
		this.h[2] = this.h[2].concat(this.rubicArray[0][0])
		
		// V-slice
		this.v[0] = this.v[0].concat(this.rubicArray[2][2])
		this.v[0] = this.v[0].concat(this.rubicArray[1][2])
		this.v[0] = this.v[0].concat(this.rubicArray[0][2])
		
		this.v[1] = this.v[1].concat(this.rubicArray[2][1])
		this.v[1] = this.v[1].concat(this.rubicArray[1][1])
		this.v[1] = this.v[1].concat(this.rubicArray[0][1])
		
		this.v[2] = this.v[2].concat(this.rubicArray[2][0])
		this.v[2] = this.v[2].concat(this.rubicArray[1][0])
		this.v[2] = this.v[2].concat(this.rubicArray[0][0])
		
		// X-slice
		this.x[0].push(this.rubicArray[0][2][2])
		this.x[0].push(this.rubicArray[0][1][2])
		this.x[0].push(this.rubicArray[0][0][2])
		this.x[0].push(this.rubicArray[1][2][2])
		this.x[0].push(this.rubicArray[1][1][2])
		this.x[0].push(this.rubicArray[1][0][2])
		this.x[0].push(this.rubicArray[2][2][2])
		this.x[0].push(this.rubicArray[2][1][2])
		this.x[0].push(this.rubicArray[2][0][2])
		
		this.x[1].push(this.rubicArray[0][2][1])
		this.x[1].push(this.rubicArray[0][1][1])
		this.x[1].push(this.rubicArray[0][0][1])
		this.x[1].push(this.rubicArray[1][2][1])
		this.x[1].push(this.rubicArray[1][1][1])
		this.x[1].push(this.rubicArray[1][0][1])
		this.x[1].push(this.rubicArray[2][2][1])
		this.x[1].push(this.rubicArray[2][1][1])
		this.x[1].push(this.rubicArray[2][0][1])
		
		this.x[2].push(this.rubicArray[0][2][0])
		this.x[2].push(this.rubicArray[0][1][0])
		this.x[2].push(this.rubicArray[0][0][0])
		this.x[2].push(this.rubicArray[1][2][0])
		this.x[2].push(this.rubicArray[1][1][0])
		this.x[2].push(this.rubicArray[1][0][0])
		this.x[2].push(this.rubicArray[2][2][0])
		this.x[2].push(this.rubicArray[2][1][0])
		this.x[2].push(this.rubicArray[2][0][0])
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
		
		this.rotationQueue.push(new Rotation(this, RotationSlice[randomRotationSlice], [90,-90][Math.floor(Math.random() * 2)]))
	}
	
	/**
	 * Enqueues a new positive or negative rotation for the given slice
	 * @param {RotationSlice} rotationSlice 
	 * @param {boolean} isNegative 
	 */
	enqueueRotation(rotationSlice, isNegative)
	{
		var degrees = 90
		if(isNegative) degrees *= -1
		
		this.rotationQueue.unshift(new Rotation(this, rotationSlice, degrees))
	}
}

/**
 * Describes a rotation that can be performed on a rubic's cube
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
		this.isNegative = degrees < 0
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
				rubic.rotateHorizontal(1, this.isNegative)
				break
			case RotationSlice.HORIZONTAL2:
				rubic.rotateHorizontal(2, this.isNegative)
				break
			case RotationSlice.HORIZONTAL3:
				rubic.rotateHorizontal(3, this.isNegative)
				break
			case RotationSlice.VERTICAL1:
				rubic.rotateVertical(1, this.isNegative)
				break
			case RotationSlice.VERTICAL2:
				rubic.rotateVertical(2, this.isNegative)
				break
			case RotationSlice.VERTICAL3:
				rubic.rotateVertical(3, this.isNegative)
				break
			case RotationSlice.X1:
				rubic.rotateX(1, this.isNegative)
				break
			case RotationSlice.X2:
				rubic.rotateX(2, this.isNegative)
				break
			case RotationSlice.X3:
				rubic.rotateX(3, this.isNegative)
				break
		}
		
		if(this.isNegative)
		{
			this.degrees += rubic.ROTATION_SPEED
		}
		else
		{
			this.degrees -= rubic.ROTATION_SPEED
		}
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
	
	X1:  Symbol("X1"),
	X2:  Symbol("X2"),
	X3:  Symbol("X3")
})