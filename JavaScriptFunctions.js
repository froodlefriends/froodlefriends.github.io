//drawing stuff
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColor = new Array();
var paint;
var strokeArray = new Array();
var currStroke = new stroke();

//colour stuff
var currColour = "#9b9b9b";

//functions!
function hello(){
	alert("hello world");
}

function initFb(){
	window.fbAsyncInit = function() {
		FB.init({
		  appId      : '779940605417881',
		  xfbml      : true,
		  version    : 'v2.2'
		});

		
		
	function onLogin(response) {
	  if (response.status == 'connected') {
		FB.api('/me?fields=first_name', function(data) {
		  var welcomeBlock = document.getElementById('fb-welcome');
		  welcomeBlock.innerHTML = 'Hello, ' + data.first_name + '!';
		});
		
		FB.api(
		"/me/picture",
			{
			"redirect": false
			},
		function (response) {
			console.log("getting profiile picture");
			if (response && !response.error) {
			/* handle the result */
				console.log("got profiile picture");
				//var parseResponse = JSON.parse(response);
				console.log(response['url']);
			}
			else{
				console.log("error getting picture");
			}
		});
	  }
	}

	FB.getLoginStatus(function(response) {
	  // Check login status on load, and if the user is
	  // already logged in, go directly to the welcome message.
	  if (response.status == 'connected') {
		onLogin(response);
	  } else {
		// Otherwise, show Login dialog first.
		FB.login(function(response) {
		  onLogin(response);
		}, {scope: 'user_friends, email'});
	  }
	});


		// ADD ADDITIONAL FACEBOOK CODE HERE
	  };

	  (function(d, s, id){
		 var js, fjs = d.getElementsByTagName(s)[0];
		 if (d.getElementById(id)) {return;}
		 js = d.createElement(s); js.id = id;
		 js.src = "//connect.facebook.net/en_US/sdk.js";
		 fjs.parentNode.insertBefore(js, fjs);
	   }(document, 'script', 'facebook-jssdk'));
}

function myMousedown(e){
	  var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;
	  
	  paint = true;
	  currStroke.clickX.push(e.pageX - this.offsetLeft);
	  currStroke.clickY.push(e.pageY - this.offsetTop);
	  currStroke.clickDrag.push(true);
	  currStroke.colour.push(currColour);
	  redraw();
}

function myMousemove(e){
	  if(paint){
		currStroke.clickX.push(e.pageX - this.offsetLeft);
		currStroke.clickY.push(e.pageY - this.offsetTop);
		currStroke.clickDrag.push(true);
		currStroke.colour.push(currColour);
	    redraw();
	  }
}

function myMouseup(){
	  paint = false;
	  print(currStroke);
	  strokeArray.push(currStroke);
	  currStroke = new stroke();
}

function myMouseleave(){
	  paint = false;
}

function print(array) {
	for(var i=0; i<array.length; i++){
		console.log(array[i] + "\n");
	}
}

function undo() {
	strokeArray.pop();
	console.log("pop!");
	reset();
	drawAll();
}

function drawAll() {
	context = document.getElementById('myCanvas').getContext("2d");
	  //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	  
	  context.strokeStyle = "#df4b26";
	  context.lineJoin = "round";
	  context.lineWidth = 5;
	  for(var j=0; j<strokeArray.length; j++){
		  for(var i=0; i < strokeArray[j].clickX.length; i++) {		
		    context.beginPath();
		    if(strokeArray[j].clickDrag[i] && i){
		      context.moveTo(strokeArray[j].clickX[i-1], strokeArray[j].clickY[i-1]);
		     }else{
		       context.moveTo(strokeArray[j].clickX[i]-1, strokeArray[j].clickY[i]);
		     }
		     context.lineTo(strokeArray[j].clickX[i], strokeArray[j].clickY[i]);
		     context.closePath();
		     context.strokeStyle = strokeArray[j].colour[i];
		     context.stroke();
		  }
	  }
}

function redraw(){
	context = document.getElementById('myCanvas').getContext("2d");
	  //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	  
	  context.strokeStyle = "#df4b26";
	  context.lineJoin = "round";
	  context.lineWidth = 5;
				
	  for(var i=0; i < currStroke.clickX.length; i++) {		
	    context.beginPath();
	    if(currStroke.clickDrag[i] && i){
	      context.moveTo(currStroke.clickX[i-1], currStroke.clickY[i-1]);
	     }else{
	       context.moveTo(currStroke.clickX[i]-1, currStroke.clickY[i]);
	     }
	     context.lineTo(currStroke.clickX[i], currStroke.clickY[i]);
	     context.closePath();
	     context.strokeStyle = currStroke.colour[i];
	     context.stroke();
	  }
}

function stroke(x, y, dragging){
	this.clickX = new Array();
	this.clickY = new Array();
	this.colour = new Array();
	this.clickDrag = new Array();
}

function addStroke(myStroke) {
	strokeArray.add(myStroke);
}

function loadImage() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("image");
    ctx.drawImage(img, 0, 0, document.getElementById("myCanvas").width, document.getElementById("myCanvas").height);
}

function reset(){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	clickColor = new Array();
	loadImage();
}

function setColour(){
	 var r = parseInt(document.getElementById("redRange").value);
	 var b = parseInt(document.getElementById("blueRange").value);
	 var g = parseInt(document.getElementById("greenRange").value);
	 //alert("Red: " + r + " Green: " + g + " Blue: " + b + " Hex: " + rgbToHex(r, g, b));
	 currColour = rgbToHex(r, g, b);
	 document.getElementById("sample").style.backgroundColor = currColour;
}

function resizeCanvas() {
	console.log("width: " + document.getElementById("image").width + " height: " + document.getElementById("image").height);
	document.getElementById("myCanvas").width = window.innerWidth;
	document.getElementById("myCanvas").height = window.innerHeight;
}

function resizeImage() {
	document.getElementById("image").width = document.getElementById("myCanvas").width;
	document.getElementById("image").height = document.getElementById("myCanvas").height;
	console.log("width: " + document.getElementById("image").width + " height: " + document.getElementById("image").height);
	loadImage();
}

function resizeWindow() {
	
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}