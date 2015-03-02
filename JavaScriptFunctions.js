//drawing stuff
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

//colour stuff
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var currColour = colorPurple;
var clickColor = new Array();

//functions!
function hello(){
	alert("hello world");
}

function myMousedown(e){
	  var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;
	  
	  paint = true;
	  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	  redraw();
}

function myMousemove(e){
	  if(paint){
	    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
	    redraw();
	  }
}

function myMouseup(){
	  paint = false;
}

function myMouseleave(){
	  paint = false;
}

function redraw(){
	context = document.getElementById('myCanvas').getContext("2d");
	  //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	  
	  context.strokeStyle = "#df4b26";
	  context.lineJoin = "round";
	  context.lineWidth = 5;
				
	  for(var i=0; i < clickX.length; i++) {		
	    context.beginPath();
	    if(clickDrag[i] && i){
	      context.moveTo(clickX[i-1], clickY[i-1]);
	     }else{
	       context.moveTo(clickX[i]-1, clickY[i]);
	     }
	     context.lineTo(clickX[i], clickY[i]);
	     context.closePath();
	     context.strokeStyle = clickColor[i];
	     context.stroke();
	  }
}

function addClick(x, y, dragging){
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(currColour);
}

function loadImage() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("scream");
    ctx.drawImage(img,10,10);
}

function reset(){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	loadImage();
}

function setColour(){
	 var r = document.getElementById("redRange").value;
	 var b = document.getElementById("blueRange").value;
	 var g = document.getElementById("greenRange").value;
	 r = parseInt(r);
	 b = parseInt(b);
	 g = parseInt(g);
	 //alert("Red: " + r + " Green: " + g + " Blue: " + b + " Hex: " + rgbToHex(r, g, b));
	 currColour = rgbToHex(r, g, b);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}