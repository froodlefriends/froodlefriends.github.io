<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
<meta charset="UTF-8">
<script type="text/javascript" src="JavaScriptFunctions.js"></script>
<script type="text/javascript" src="jscolor/jscolor.js"></script>
<link rel="stylesheet" type="text/css" href="main.css"></link>
<link rel="stylesheet" href="csphotoselector.css">

<title>Canvas Demo</title>
</head>
<body>
  
<p hidden>Image to use:</p>
<img hidden id="image" src="https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-xpa1/v/t1.0-9/10461476_10152506437588124_6370622596565830669_n.jpg?oh=119f18951cd74eea45391ff1d37c5fd9&oe=5578DA0E&__gda__=1434538008_6a216c2d64b02a15cb3e597aabe0a1b9"
width=1000 max-height=700>

<div>
	<div>
		<p>
		<input type="text" id="urlToUpload" placeholder="Enter photo URL"></input>
		<button type="button" onclick=loadFromURL()>Upload Photo</button>
		<input id="select" type="button" value="Select from Albums">
		</p>
	</div>

	<div>
		<button type="button" onclick=resetAll()>Reset</button>
		<button type="button" onclick=undo()>Undo</button>
		<button type="button" onclick=postPicture()>Post</button>
	</div>
	
	<div>
		Pick Colour:<input class="color" id="colour" value="#FFFFFF" onchange=setColour()>
	</div>
</div>

<div id="CSPhotoSelector">
      <div class="CSPhotoSelector_dialog">
        <a href="#" id="CSPhotoSelector_buttonClose">x</a>
        <div class="CSPhotoSelector_form">
          <div class="CSPhotoSelector_header">
            <p>Choose from Photos</p>
          </div>

          <div class="CSPhotoSelector_content CSAlbumSelector_wrapper">
            <p>Browse your albums until you find a picture you want to use</p>
            <div class="CSPhotoSelector_searchContainer CSPhotoSelector_clearfix">
              <div class="CSPhotoSelector_selectedCountContainer">Select an album</div>
            </div>
            <div class="CSPhotoSelector_photosContainer CSAlbum_container"></div>
          </div>

          <div class="CSPhotoSelector_content CSPhotoSelector_wrapper">
            <p>Select a new photo</p>
            <div class="CSPhotoSelector_searchContainer CSPhotoSelector_clearfix">
              <div class="CSPhotoSelector_selectedCountContainer"><span class="CSPhotoSelector_selectedPhotoCount">0</span> / <span class="CSPhotoSelector_selectedPhotoCountMax">0</span> photos selected</div>
              <a href="#" id="CSPhotoSelector_backToAlbums">Back to albums</a>
            </div>
            <div class="CSPhotoSelector_photosContainer CSPhoto_container"></div>
          </div>

          <div id="CSPhotoSelector_loader"></div>


          <div class="CSPhotoSelector_footer CSPhotoSelector_clearfix">
            <a href="#" id="CSPhotoSelector_pagePrev" class="CSPhotoSelector_disabled">Previous</a>
            <a href="#" id="CSPhotoSelector_pageNext">Next</a>
            <div class="CSPhotoSelector_pageNumberContainer">
              Page <span id="CSPhotoSelector_pageNumber">1</span> / <span id="CSPhotoSelector_pageNumberTotal">1</span>
            </div>
            <a href="#" id="CSPhotoSelector_buttonOK">OK</a>
            <a href="#" id="CSPhotoSelector_buttonCancel">Cancel</a>
          </div>
        </div>
      </div>
    </div>

<canvas id="myCanvas" width=3000px max-height="100%"></canvas>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="jquery-1.7.1.min.js"></script>

<script type = "text/javascript" src="csphotoselector.js"></script>
<script type = "text/javascript" src="FurtherJSFunctions.js"></script>

<script type="text/javascript">

document.ready = init();
document.ready = setColour();
document.ready = resizeCanvas();
//document.ready = resizeImage();
//window.onresize = function(){ 
//								localStorage.setItem("strokeArray1", strokeArray);
//								location.reload();
//								strokeArray = localStorage.getItem("strokeArray1");
//								drawAll();}

//load image
document.ready = initFb();
//document.getElementById("image").onload = loadImage;	

//set up mouse event listeners
document.getElementById('myCanvas').onmousedown = myMousedown;
document.getElementById('myCanvas').onmouseup = myMouseup;
document.getElementById('myCanvas').onmousemove = myMousemove;
document.getElementById('myCanvas').onmouseleave = myMouseleave;

</script>

</body>
</html>