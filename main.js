
var canvas, gl, program

var camera
var light1
var light2

var lastX
var lastY

var lightRotationEnabled = true
var firstMouse = true
var trackballEnabled = false
var trackballLastX = 0
var trackballLastY = 0

window.onload = function init()
{   
	initWebGL()
	
	lastX = canvas.width / 2
	lastY = canvas.height / 2
	
	camera = new Camera(program, vec3(2, 1.7, 2), vec3(0, 0, 0), vec3(0, 1, 0))
	light1 = new Light(program, vec4(2, 3, 1, 1), 1)
	light2 = new Light(program, vec4(2, 2, 2, 1), 2)
	light2.intensity = {
		ambient: vec3(0.3, 0.3, 0.3),
		diffuse: vec3(0.3, 0.3, 0.3),
		specular: vec3(0.3, 0.3, 0.3)
	}
	
	rubic = new Rubik(program)
	
	this.setUpButtons()
	
	// EVENT LISTENERS
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
		mouseDidMove(event.clientX, event.clientY)
		
		var x = 2*event.clientX/canvas.width-1;
		var y = 2*(canvas.height-event.clientY)/canvas.height-1;
		trackBallDidMove(x, y);
	});
	
	canvas.addEventListener("mousedown", function(event){
		var x = 2*event.clientX/canvas.width-1;
		var y = 2*(canvas.height-event.clientY)/canvas.height-1;
		enableTrackball(x, y);
	});
	
	canvas.addEventListener("mouseup", function(event){
		var x = 2*event.clientX/canvas.width-1;
		var y = 2*(canvas.height-event.clientY)/canvas.height-1;
		disableTrackball();
	});
	
	render()
}

function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	camera.render()
	light1.render()
	light2.render()
	rubic.render()
	
	if (lightRotationEnabled) light2.rotate(2)
		
	requestAnimFrame( render );
}

/**
 * Enables the trackball mode
 * @param {number} x 
 * @param {number} y 
 */
function enableTrackball(x, y)
{
	trackballEnabled = true;
	trackballLastX = x
	trackballLastY = y
	this.camera.reset()
	console.log("tball enabled")
}

/**
 * Disables the trackball mode
 */
function disableTrackball()
{
	trackballEnabled = false;
}

/**
 * Performs trackball rotations based on the changes of the x and y values
 * @param {number} x
 * @param {number} y 
 */
function trackBallDidMove(x, y)
{
	if(!trackballEnabled)
	{
		return
	}
	
	var xDiff = x - trackballLastX
	var yDiff = y - trackballLastY
	
	if (xDiff > 0)
	{
		this.camera.moveLeftWithTrackBall()
	}
	else if (xDiff < 0)
	{
		this.camera.moveRightWithTrackBall()
	}
	
	if (yDiff > 0)
	{
		this.camera.moveDownWithTrackBall()
	}
	else if (yDiff < 0)
	{
		this.camera.moveUpWithTrackBall()
	}
	
	trackballLastX = x
	trackballLastY = y
}

function didPressKey(key)
{
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
		case "r":
			this.camera.reset()
			break
	  }
}

/**
 * Performs camera rotations based on mouse coordinates
 * @param {number} x
 * @param {number} y 
 */
function mouseDidMove(x, y)
{
	// return // disables this function for debugging
	
	if (trackballEnabled)
	{
		return
	}
	
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
	
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
}

/**
 * Sets onclick events of buttons
 */
function setUpButtons()
{
	document.getElementById( "switch" ).onclick = function () {
		rubic.randomRotationsEnabled = !rubic.randomRotationsEnabled
	}
	document.getElementById( "light_switch" ).onclick = function () {
		lightRotationEnabled = !lightRotationEnabled
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
