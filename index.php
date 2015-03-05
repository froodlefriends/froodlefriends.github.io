<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
<meta charset="UTF-8">
<script type="text/javascript" src="JavaScriptFunctions.js"></script>
<link rel="stylesheet" type="text/css" href="main.css"></link>

<title>Canvas Demo</title>
</head>
<body>
 
 <h1 id="fb-welcome"></h1>
 
<p hidden>Image to use:</p>
<img hidden id="image" src="https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-xpa1/v/t1.0-9/10461476_10152506437588124_6370622596565830669_n.jpg?oh=119f18951cd74eea45391ff1d37c5fd9&oe=5578DA0E&__gda__=1434538008_6a216c2d64b02a15cb3e597aabe0a1b9"
width=1000 max-height=700>

<div>
	<div>
		<button type="button" onclick=reset()>Reset</button>
		<button type="button" onclick=undo()>Undo</button>
	</div>
	<div>
		<p>R<input type="range" id="redRange" max=255 value=155 onmousemove=setColour()></input></p>
		<p>B<input type="range" id="blueRange" max=255 value=155 onmousemove=setColour()></input></p>
		<p>G<input type="range" id="greenRange" max=255 value=155 onmousemove=setColour()></input></p>
		<div id="sample" style="width:50px; height:50px; border:1px solid #000; display:inline-block;"></div>
	</div>
</div>


<canvas id="myCanvas" width="100%" max-height="100%"></canvas>

<script type="text/javascript">

document.ready = setColour();
document.ready = resizeCanvas();
document.ready = resizeImage();
window.onresize = function(){ 
								localStorage.setItem("strokeArray1", strokeArray);
								location.reload();
								strokeArray = localStorage.getItem("strokeArray1");
								drawAll();}

//load image
document.ready = initFb();
document.getElementById("image").onload = loadImage;	

//set up mouse event listeners
document.getElementById('myCanvas').onmousedown = myMousedown;
document.getElementById('myCanvas').onmouseup = myMouseup;
document.getElementById('myCanvas').onmousemove = myMousemove;
document.getElementById('myCanvas').onmouseleave = myMouseleave;

</script>

</body>
</html>