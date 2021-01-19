
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
    light = new Light(program, vec4(2, 3, 1, 1))
	
	rubic = new Rubic(program)
		
	camera.translateBy(-1, -1, -1)
	
	this.setUpButtons()
		
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
	
	// light.rotate(1)
	
	requestAnimFrame( render );
}

function setUpButtons()
{
	document.getElementById( "switch" ).onclick = function () {
		rubic.randomRotationsEnabled = !rubic.randomRotationsEnabled
	}
	
	document.getElementById( "btn_x1_pos" ).onclick = function () {
		didPressRotateButton("btn_x1_pos")
	}
	document.getElementById( "btn_x1_neg" ).onclick = function () {
		didPressRotateButton("btn_x1_neg")
	}
	document.getElementById( "btn_x2_pos" ).onclick = function () {
		didPressRotateButton("btn_x2_pos")
	}
	document.getElementById( "btn_x2_neg" ).onclick = function () {
		didPressRotateButton("btn_x2_neg")
	}
	document.getElementById( "btn_x3_pos" ).onclick = function () {
		didPressRotateButton("btn_x3_pos")
	}
	document.getElementById( "btn_x3_neg" ).onclick = function () {
		didPressRotateButton("btn_x3_neg")
	}
	
	document.getElementById( "btn_h1_pos" ).onclick = function () {
		didPressRotateButton("btn_h1_pos")
	}
	document.getElementById( "btn_h1_neg" ).onclick = function () {
		didPressRotateButton("btn_h1_neg")
	}
	document.getElementById( "btn_h2_pos" ).onclick = function () {
		didPressRotateButton("btn_h2_pos")
	}
	document.getElementById( "btn_h2_neg" ).onclick = function () {
		didPressRotateButton("btn_h2_neg")
	}
	document.getElementById( "btn_h3_pos" ).onclick = function () {
		didPressRotateButton("btn_h3_pos")
	}
	document.getElementById( "btn_h3_neg" ).onclick = function () {
		didPressRotateButton("btn_h3_neg")
	}
	
	document.getElementById( "btn_v1_pos" ).onclick = function () {
		didPressRotateButton("btn_v1_pos")
	}
	document.getElementById( "btn_v1_neg" ).onclick = function () {
		didPressRotateButton("btn_v1_neg")
	}
	document.getElementById( "btn_v2_pos" ).onclick = function () {
		didPressRotateButton("btn_v2_pos")
	}
	document.getElementById( "btn_v2_neg" ).onclick = function () {
		didPressRotateButton("btn_v2_neg")
	}
	document.getElementById( "btn_v3_pos" ).onclick = function () {
		didPressRotateButton("btn_v3_pos")
	}
	document.getElementById( "btn_v3_neg" ).onclick = function () {
		didPressRotateButton("btn_v3_neg")
	}
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
 * Calls the rotate function of rubic based on the pressed button
 * @param {string} buttonID 
 */
function didPressRotateButton(buttonID)
{
	if(document.getElementById("switch").checked) // disable infinite animation if enabled
	{
		document.getElementById("switch").click()
	}
	
	switch(buttonID)
	{
		case "btn_x1_pos":
			rubic.enqueueRotation(RotationSlice.X1, false)
			break
		case "btn_x1_neg":
			rubic.enqueueRotation(RotationSlice.X1, true)
			break
		case "btn_x2_pos":
			rubic.enqueueRotation(RotationSlice.X2, false)
			break
		case "btn_x2_neg":
			rubic.enqueueRotation(RotationSlice.X2, true)
			break
		case "btn_x3_pos":
			rubic.enqueueRotation(RotationSlice.X3, false)
			break
		case "btn_x3_neg":
			rubic.enqueueRotation(RotationSlice.X3, true)
			break
		
		case "btn_h1_pos":
			rubic.enqueueRotation(RotationSlice.HORIZONTAL1, false)
			break
		case "btn_h1_neg":
			rubic.enqueueRotation(RotationSlice.HORIZONTAL1, true)
			break
		case "btn_h2_pos":
			rubic.enqueueRotation(RotationSlice.HORIZONTAL2, false)
			break
		case "btn_h2_neg":
			rubic.enqueueRotation(RotationSlice.HORIZONTAL2, true)
			break
		case "btn_h3_pos":
			rubic.enqueueRotation(RotationSlice.HORIZONTAL3, false)
			break
		case "btn_h3_neg":
			rubic.enqueueRotation(RotationSlice.HORIZONTAL3, true)
			break
			
		case "btn_v1_pos":
			rubic.enqueueRotation(RotationSlice.VERTICAL1, false)
			break
		case "btn_v1_neg":
			rubic.enqueueRotation(RotationSlice.VERTICAL1, true)
			break
		case "btn_v2_pos":
			rubic.enqueueRotation(RotationSlice.VERTICAL2, false)
			break
		case "btn_v2_neg":
			rubic.enqueueRotation(RotationSlice.VERTICAL2, true)
			break
		case "btn_v3_pos":
			rubic.enqueueRotation(RotationSlice.VERTICAL3, false)
			break
		case "btn_v3_neg":
			rubic.enqueueRotation(RotationSlice.VERTICAL3, true)
			break
	}
	console.log(buttonID + " pressed")
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
