/**
 * Represents a light source.
 * Note: This class is taken from the OOP sample project provided by Farid R. Ahmadov and modified for this project. 
 */
class Light {
    constructor(program, position, id) {
        this.program = program;
        this.position = position;
        this.intensity = {
            ambient: vec3(1.0, 1.0, 1.0),
            diffuse: vec3(1.0, 1.0, 1.0),
            specular: vec3(1.0, 1.0, 1.0)
        }
        this.id = id
    }

    render() {
        var pos = gl.getUniformLocation(this.program, "v_Light" + this.id);
        gl.uniform4fv(pos, flatten(this.position));

        // sending light properties
        var ambient = gl.getUniformLocation(this.program, "light_Ambient" + this.id);
        gl.uniform3fv(ambient, flatten(this.intensity.ambient));

        var diffuse = gl.getUniformLocation(this.program, "light_Diffuse" + this.id);
        gl.uniform3fv(diffuse, flatten(this.intensity.diffuse));

        var specular = gl.getUniformLocation(this.program, "light_Specular" + this.id);
        gl.uniform3fv(specular, flatten(this.intensity.specular));
    }

    rotate(angle) {
        this.position = mult_v(rotate(angle, vec3(0, 1, 0)), this.position);
    }
}