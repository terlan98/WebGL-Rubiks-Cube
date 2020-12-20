class Camera {	
    SENSITIVITY = 0.3
    SPEED = 0.08
    
    yaw = -134.0
    pitch = -27.0
    
    constructor(program, position, target, up) {
        this.program = program;
        this.position = position;
        this.target = target;
        this.up = up;
        this.front = normalize(subtract(this.target, this.position))
    }

    render() {
        this.front = normalize(subtract(this.target, this.position))
        
        var pos = gl.getUniformLocation(this.program, "v_Camera");
        gl.uniform4fv(pos, flatten(vec4(this.position, 1.0)));

        var view = gl.getUniformLocation(this.program, "m_View");
        var matView = lookAt(this.position, this.target, this.up);
        gl.uniformMatrix4fv(view, false, flatten(matView));

        var proj = gl.getUniformLocation(this.program, "m_Proj");
        var matProj = perspective(90, 1.0, 0.0001, 1000);
		gl.uniformMatrix4fv(proj, false, flatten(matProj));
    }
    
    rotate(xOffset, yOffset)
    {
	    xOffset *= this.SENSITIVITY;
        yOffset *= this.SENSITIVITY;
        
        this.yaw += xOffset
        this.pitch += yOffset
        
        if(this.pitch > 89.0) this.pitch = 89.0
        if(this.pitch < -89.0) this.pitch = -89.0
        
        // console.log(this.pitch, this.yaw)
        
        var directionX = Math.cos(radians(this.yaw)) * Math.cos(radians(this.pitch))
        var directionY = Math.sin(radians(this.pitch));
        var directionZ = Math.sin(radians(this.yaw)) * Math.cos(radians(this.pitch))
        var direction = vec3(directionX, directionY, directionZ)
        
        this.target = add(this.position, normalize(direction))
        // console.log(this.front)
    }

	// rotate(angle) 
	// {
    //     this.position = vec3(mult_v(rotate(angle, vec3(0, 1, 0)), vec4(this.position)));
	// }
	
	/**
	 * 
	 * @param {vec3} dVector – vec3, indicating the dx, dy, and dz
	 */
	translateBy(x, y, z) 
	{
		this.position = vec3(mult_v(translate(x, y, z), vec4(this.position)));
    }
    
    moveForward()
    {
        // this.translateBy(this.front)
        // this.target = add(this.position, this.front)
        
        var delta = scale(this.SPEED, this.front)        
        this.translateBy(delta)
        this.target = add(this.position, delta)
    }
    
    moveBackward()
    {
        var delta = scale(this.SPEED, this.front) 
        this.translateBy(negate(delta))
        this.target = add(this.position, delta)
    }
    
    moveRight()
    {
        var cameraRight = normalize(cross(this.front, this.up))
        
        this.translateBy(scale(this.SPEED, cameraRight))
        this.target = add(this.position, scale(this.SPEED, this.front))
    }
    
    moveLeft()
    {
        var cameraLeft = normalize(cross(this.up, this.front))
        
        this.translateBy(scale(this.SPEED, cameraLeft))
        this.target = add(this.position, scale(this.SPEED, this.front))
    }
    
    moveUp()
    {    
        this.translateBy(scale(this.SPEED, this.up))
        this.target = add(this.position, scale(this.SPEED, this.front))
    }
    
    moveDown()
    {        
        this.translateBy(negate(scale(this.SPEED, this.up)))
        this.target = subtract(this.position, negate(scale(this.SPEED, this.front)))
    }
}

//TODO: Make a new common js file for such functions, which may be needed by more classes
function mult_v(m, v) {
    if (!m.matrix) {
        return "trying to multiply by non matrix";
    }

    var result;
    if (v.length == 2) result = vec2();
    else if (v.length == 3) result = vec3();
    else if (v.length == 4) result = vec4();
    
    for (var i = 0; i < m.length; i++) {
        if (m[i].length != v.length) 
            return "dimensions do not match";
        
        result[i] = 0;
        for (var j = 0; j < m[i].length; j++)
            result[i] += m[i][j] * v[j];
    }
    return result;
}