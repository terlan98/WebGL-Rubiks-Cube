
var canvas;
var gl;
var program;

var camera;
var light;

var lastX
var lastY

var firstMouse = true

window.onload = function init()
{   
	initWebGL()
	
	lastX = canvas.width / 2
	lastY = canvas.height / 2
	
	//original cam position: vec3(4, 3.5, 4)
	// camera = new Camera(program, vec3(0, 0, 6), vec3(0, 0, 0), vec3(0, 1, 0))
	camera = new Camera(program, vec3(4, 3.5, 4), vec3(0, 0, 0), vec3(0, 1, 0))
    light = new Light(program, vec4(1, 4.5, 1, 1))
	
	rubic = new Rubic(program)
		
	camera.translateBy(-1, -1, -1)

	document.addEventListener("keydown", function(event)
	{
		// Prevent arrow keys from scrolling
		if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.key) > -1) {
			event.preventDefault();
		}
	
		didPressKey(event.key)
	});
	
	canvas.addEventListener("mousemove", function(event)
	{
		// var x = 2 * event.clientX / canvas.width-1;
		// var y = 2 * (canvas.height - event.clientY) / canvas.height-1;
		
		// mouseDidMove(x, y);
		mouseDidMove(event.clientX, event.clientY)
	});
	
	render()
}

function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	camera.render()
	light.render()
	rubic.render()
	
	requestAnimFrame( render );
}

function didPressKey(key)
{
	console.log("Key pressed: " + key)
	
	// cameraDirection = normalize(subtract(camera.target, camera.position))
	
	
	// cameraRightDirection = normalize(cross(camera.up, cameraDirection))
	
	switch(key) {
		case "w":
			camera.moveForward()
			break;
		case "s":
			camera.moveBackward()
			break;
		case "a":
			camera.moveLeft()
			break;
		case "d":
			camera.moveRight()
			break;
		case "ArrowUp":
			camera.moveUp()
			break
		case "ArrowDown":
			camera.moveDown()
			break
	  }
	

}

function mouseDidMove(x, y)
{
	// console.log([x, y])
	return
	
	if (firstMouse)
    {
        lastX = x;
        lastY = y;
        firstMouse = false;
    }
	
	var xOffset = x - lastX;
	var yOffset = lastY - y;
	lastX = x;
	lastY = y;
	
	camera.rotate(xOffset, yOffset)
}

/**
 * All the boilerplate code for setting up the WebGL lies here.
 */
function initWebGL()
{
	canvas = document.getElementById( "gl-canvas" );
		
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.1, 0.1, 0.1, 1.0 );

	gl.enable(gl.DEPTH_TEST);
	// canvas.style.cursor = 'none';
	
	
	//
	//  Load shaders and initialize attribute buffers
	//
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
}
