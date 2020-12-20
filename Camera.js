class Camera {	
    constructor(program, position, target, up) {
        this.program = program;
        this.position = position;
        this.target = target;
        this.up = up;
    }

    render() {
        var pos = gl.getUniformLocation(this.program, "v_Camera");
        gl.uniform4fv(pos, flatten(vec4(this.position, 1.0)));

        var view = gl.getUniformLocation(this.program, "m_View");
        var matView = lookAt(this.position, this.target, this.up);
        gl.uniformMatrix4fv(view, false, flatten(matView));

        var proj = gl.getUniformLocation(this.program, "m_Proj");
        var matProj = perspective(90, 1.0, 0.0001, 1000);
		gl.uniformMatrix4fv(proj, false, flatten(matProj));
    }

	rotate(angle) 
	{
        this.position = vec3(mult_v(rotate(angle, vec3(0, 1, 0)), vec4(this.position)));
	}
	
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
        var cameraDirection = normalize(subtract(this.target, this.position))
        this.translateBy(cameraDirection)
        this.target = add(this.position, cameraDirection)
    }
    
    moveBackward()
    {
        var negativeCameraDirection = normalize(subtract(this.position, this.target))
        this.translateBy(negativeCameraDirection)
        this.target = add(this.position, negate(negativeCameraDirection))
    }
    
    moveRight()
    {
        var cameraDirection = normalize(subtract(this.target, this.position))
        var cameraRight = normalize(cross(cameraDirection, this.up))
        
        this.translateBy(cameraRight)
        this.target = add(this.position, cameraDirection)
    }
    
    moveLeft()
    {
        var cameraDirection = normalize(subtract(this.target, this.position))
        var cameraLeft = normalize(cross(this.up, cameraDirection))
        
        this.translateBy(cameraLeft)
        this.target = add(this.position, cameraDirection)
    }
    
    moveUp()
    {
        var cameraDirection = this.getCameraDirectionVector()
        
        this.translateBy(this.up)
        this.target = add(this.position, cameraDirection)
    }
    
    moveDown()
    {
        var negativeCameraDirection = this.getNegativeCameraDirectionVector()
        
        this.translateBy(negate(this.up))
        this.target = subtract(this.position, negativeCameraDirection)
    }
    
    getCameraDirectionVector()
    {
        return normalize(subtract(this.target, this.position))
    }
    
    getNegativeCameraDirectionVector()
    {
        return normalize(subtract(this.position, this.target))
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