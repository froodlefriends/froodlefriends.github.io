//drawing stuff
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColor = new Array();
var paint;
var strokeArray = new Array();
var currStroke = new stroke();

var accessToken;

var img = new Image();
img .setAttribute('crossOrigin', 'anonymous');
img.src = "https://scontent-ams.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/10629703_837270849663201_5201753390617732430_n.jpg?oh=ccc2a462bf92f548c0146b02a7fa690b&oe=558A7A4E";

//colour stuff
var currColour = "#9b9b9b";

//functions!
function hello(){
	alert("hello world");
}

function init(){
	if ( XMLHttpRequest.prototype.sendAsBinary === undefined ) {
    XMLHttpRequest.prototype.sendAsBinary = function(string) {
        var bytes = Array.prototype.map.call(string, function(c) {
            return c.charCodeAt(0) & 0xff;
        });
        this.send(new Uint8Array(bytes).buffer);
    };
}
	
}

function initFb(){
	window.fbAsyncInit = function() {
		FB.init({
		  appId      : '776638695748072',
		  xfbml      : true,
		  version    : 'v2.2'
		});
	
	function onLogin(response) {
	  if (response.status == 'connected') {
		
		accessToken = response.authResponse.accessToken
		
		FB.api(
		"/me/picture",
			{
			"redirect": false,
			"type": "large"
			},
		function (response) {
			console.log("getting profiile picture");
			if (response && !response.error) {
			/* handle the result */
				console.log("got profiile picture");
				//var parseResponse = JSON.parse(response);
				console.log(response.data.url);
				
				img.onload = function(){
					var c = document.getElementById("myCanvas");
					var ctx = c.getContext("2d");
					ctx.drawImage(img, 0, 0, document.getElementById("myCanvas").width, document.getElementById("myCanvas").height);
					console.log("set image");
				};
				img.src = response.data.url;
				
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
		}, {scope: 'user_friends, email, publish_stream, publish_actions  , user_photos '});
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

function postPicture(){
	// assuming your canvas drawing has already exported to dataUrl
	var canvas = document.getElementById("myCanvas");
	 
	var c = canvas.toDataURL('image/png');
	var encodedPng = c.substring(c.indexOf(',')+1,c.length);
	var decodedPng = Base64Binary.decode(encodedPng);

	PostImageToFacebook(accessToken, 'shareImage.png', 'image/png', decodedPng, '');
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
	  
	  
	console.log('stroke array before drawAll: ' + strokeArray.length)
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

function loadFromURL() {
	console.log('am here');
	var imageURL = document.getElementById("urlToUpload").value;
	console.log(imageURL);
	img.src = imageURL;
	resetAll();
}

function loadImage() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, document.getElementById("myCanvas").width, document.getElementById("myCanvas").height);
}

function resetAll(){
	console.log('stroke array before set to 0: ' + strokeArray.length)
	strokeArray.length = 0;
	console.log('stroke array after set to 0: ' + strokeArray.length)
	currStroke.length = 0;
	reset();
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
	 currColour = '#' + document.getElementById("colour").color;
	 //console.log("Colour" + currColour);
	 //console.log("Value" + document.getElementById("colour").value);
}

function resizeCanvas() {
	console.log("width: " + document.getElementById("image").width + " height: " + document.getElementById("image").height);
	document.getElementById("myCanvas").width = window.innerWidth;
	document.getElementById("myCanvas").height = window.innerHeight;
	console.log("resized canvas!!");
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


function PostImageToFacebook( authToken, filename, mimeType, imageData, message )
{
    // this is the multipart/form-data boundary we'll use
    var boundary = '----ThisIsTheBoundary1234567890';
    
    // let's encode our image file, which is contained in the var
    var formData = '--' + boundary + '\r\n'
    formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
    formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
    for ( var i = 0; i < imageData.length; ++i )
    {
        formData += String.fromCharCode( imageData[ i ] & 0xff );
    }
    formData += '\r\n';
    formData += '--' + boundary + '\r\n';
    formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
    formData += message + '\r\n'
    formData += '--' + boundary + '--\r\n';
    
    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true );
    xhr.onload = xhr.onerror = function() {
        console.log( xhr.responseText );
		alert("Your Picture has Been Added to FACEBOOK");
    };
    xhr.setRequestHeader( "Content-Type", "multipart/form-data; boundary=" + boundary );
    xhr.sendAsBinary( formData );
}

var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = (input.length/4) * 3;
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);
		
		return ab;
	},
	
	decode: function(input, arrayBuffer) {
		//get last chars to see if are valid
		var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));		 
		var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));		 
	
		var bytes = (input.length/4) * 3;
		if (lkey1 == 64) bytes--; //padding chars, so skip
		if (lkey2 == 64) bytes--; //padding chars, so skip
		
		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;
		
		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);
		
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}
	
		return uarray;	
	}
}