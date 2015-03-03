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
    ctx.drawImage(img,10,10);
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
	document.getElementById("myCanvas").width = document.getElementById("image").width;
	document.getElementById("myCanvas").height = document.getElementById("image").height;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}