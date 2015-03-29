//drawing stuff
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColor = new Array();
var paint = false;
var strokeArray = new Array();
var currStroke = new stroke();
var strokeWidth = 5;
var redoArray = new Array();

var SelectImageId = null;

var accessToken;

var img = new Image();
img .setAttribute('crossOrigin', 'anonymous');
img.src = "/images/w.png";
var img_width = 0;
var img_height = 0;
//colour stuff
var currColour;

//functions!
function hello(){
	alert("hello world");
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
			"width": 9999
			},
		function (response) {
			console.log("getting profiile picture");
			if (response && !response.error) {
			/* handle the result */
				console.log("got profiile picture");
				//var parseResponse = JSON.parse(response);
				console.log(response);

				img.onload = function(){
					loadImage();
				};
				console.log('prof pic is '+response.data.url);
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
    closeBox();
    PostImageToFacebook(accessToken);
}
function post(){
    $('#sign_up').lightbox_me({
        centered: true,
        onLoad: function() {
            console.log("opening image")
            var imageData = document.getElementById('myCanvas').toDataURL("image/png");
            $('#lightBoxImage').attr('src',imageData );
            $('#sign_up').trigger('reposition');
        }
    });
}
function closeBox(){
    console.log("closing");
    $('#sign_up').trigger('close');
}
function myMousedown(e){
	  paint = true;
	  currStroke.clickX.push(e.pageX - this.offsetLeft);
	  currStroke.clickY.push(e.pageY - this.offsetTop);
	  currStroke.clickDrag.push(true);
	  currStroke.colour.push(currColour);
	  currStroke.lineWidth.push(strokeWidth);
	  redraw();
}

function myMousemove(e){
	  if(paint){
		currStroke.clickX.push(e.pageX - this.offsetLeft);
		currStroke.clickY.push(e.pageY - this.offsetTop);
		currStroke.clickDrag.push(true);
		currStroke.colour.push(currColour);
		currStroke.lineWidth.push(strokeWidth);
	    redraw();
	  }
}

function myMouseup(){
	paint = false;
	//print(currStroke);
	if(currStroke.clickX.length > 0){
	  strokeArray.push(currStroke);
	  console.log("canvas mouse up stroke");
	  currStroke = new stroke();
	}
}

function myMouseleave(){
	//paint = false;
	if(currStroke.clickX.length > 0){
	  strokeArray.push(currStroke);
	  console.log("mouse leave stroke");
	  currStroke = new stroke();
	}
}

function globalMousedown(){
	paint = true;
}

function globalMouseup(){
	paint = false;
	if(currStroke.clickX.length > 0){
		strokeArray.push(currStroke);
		console.log("g mouse up stroke");
		currStroke = new stroke();
	}
}

function print(array) {
	for(var i=0; i<array.length; i++){
		console.log(array[i] + "\n");
	}
}

function undo() {
	redoArray.push(strokeArray.pop());
	console.log("pop!");
	reset();
	reLoadImage();
	drawAll();
}

function redo(){
	if(redoArray.length > 0){
		var temp = redoArray.pop();
		strokeArray.push(temp);
		currStroke = temp;
		redraw();
		currStroke = new stroke();
	}
}

//draws all strokes
function drawAll() {
	context = document.getElementById('myCanvas').getContext("2d");
	//context.strokeStyle = "#EA6E6E";
	context.lineJoin = "round";
	//context.lineWidth = 100; 
	  
	console.log('stroke array before drawAll: ' + strokeArray.length)
	  for(var j=0; j<strokeArray.length; j++){

	  	if(strokeArray[j].length == 1){
	  		context.fillRect(strokeArray[j].clickX[0], strokeArray[j].clickY[0], strokeArray[j].clickX[0]+1, strokeArray[j].clickY[0]+1);
	  	}

		  for(var i=0; i < strokeArray[j].clickX.length; i++) {		
		    context.beginPath();
		    context.lineWidth = strokeArray[j].lineWidth[i];
		    if(strokeArray[j].clickDrag[i] && i){
		      context.moveTo(strokeArray[j].clickX[i-1], strokeArray[j].clickY[i-1]);
		     }else{
		       context.moveTo(strokeArray[j].clickX[i]-1, strokeArray[j].clickY[i]);
		     }
		     context.lineTo(strokeArray[j].clickX[i], strokeArray[j].clickY[i]);
		     context.closePath();
		     context.strokeStyle = strokeArray[j].colour[i];
		     //context.lineWidth = strokeArray[j].lineWidth[i];
		     context.stroke();
		  }
	  }
}

//draws current stroke
function redraw(){
	context = document.getElementById('myCanvas').getContext("2d");
	//context.strokeStyle = "#EA6E6E";
	context.lineJoin = "round";
	//context.lineWidth = 100;

	  if(currStroke.length == 1){
	  	context.fillRect(currStroke.clickX[0], currStroke.clickY[0], currStroke.clickX[0]+1, currStroke.clickY[0]+1);
	  }

	for(var i=0; i < currStroke.clickX.length; i++) {
	  context.beginPath();
	  context.lineWidth = currStroke.lineWidth[i];
	  if(currStroke.clickDrag[i] && i){
	    context.moveTo(currStroke.clickX[i-1], currStroke.clickY[i-1]);
	   }else{
	     context.moveTo(currStroke.clickX[i]-1, currStroke.clickY[i]);
	   }
	   context.lineTo(currStroke.clickX[i], currStroke.clickY[i]);
	   context.closePath();
	   context.strokeStyle = currStroke.colour[i];
	   //context.lineWidth = currStroke.lineWidth[i];
	   context.stroke();
	  }
}

function stroke(x, y, dragging){
	this.clickX = new Array();
	this.clickY = new Array();
	this.colour = new Array();
	this.clickDrag = new Array();
	this.lineWidth = new Array();
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
    var loadImg = new Image();
    loadImg.src = img.src;

    //loads image to get width and height for canvas
    loadImg.onload = function(){
        var imgSize = {
            w: img.width,
            h: img.height
        };
        var c = document.getElementById("myCanvas");
        c.width = imgSize.w;
        c.height = imgSize.h;
        var ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, imgSize.w, imgSize.h);
    };
}

function reLoadImage(){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, document.getElementById("myCanvas").width, document.getElementById("myCanvas").height);
}

//reset all strokes?
function resetAll(){
	currStroke = new stroke();
	strokeArray = new Array();
	redoArray = new Array();
	reset();
	reLoadImage();
}

//reset just the current stroke?
function reset(){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	clickColor = new Array();
	currStroke = new stroke();
	//redoArray = new Array();
}

function setColour(){
	currColour = document.getElementById("colour").value;
	console.log("Colour" + currColour);
    $("body").css("background-color", currColour);
	 //console.log("Value" + document.getElementById("colour").value);
}

function setLineWidth(){
	strokeWidth = document.getElementById("lineWidth").value;
	console.log("strokeWidth set to " + strokeWidth);
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

// Post a BASE64 Encoded PNG Image to facebook
function PostImageToFacebook(authToken) {
    var canvas = document.getElementById("myCanvas");
    var imageData = canvas.toDataURL("image/png");
    try {
        blob = dataURItoBlob(imageData);
    } catch (e) {
        console.log(e);
    }
    var fd = new FormData();
    fd.append("access_token", authToken);
    fd.append("source", blob);
    fd.append("no_story", 1);
    try {
        $.ajax({
            url: "https://graph.facebook.com/me/photos?access_token=" + authToken,
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                console.log("success " + data);
                console.log(data);
                FB.api(
                    "/" + data.id ,
                    function (response) {
                        console.log("got posted picture")
                        console.log(response)
                        if (response && !response.error) {
                            FB.ui({
                                method: 'share',
                                href: response.link
                            }, function(response){});
                        }
                    }
                );
            },
            error: function (shr, status, data) {
                console.log("error " + data + " Status " + shr.status);
                alert("Post Failed")
            },
            complete: function () {
                console.log("Posted to facebook");
            }
        });

    } catch (e) {
        console.log(e);
    }
}

// Convert a data URI to blob
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
        type: 'image/png'
    });
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

/*
 * CS Photo Selector
 * @author: Carson Shold (@cshold)
*/
var CSPhotoSelector = (function(module, $) {
	
	console.log('In CSPhotoSelector');

	// Public functions
	var init, setAlbums, getAlbums, getAlbumById, getPhotoById, setPhotos, newInstance,

	// Private variables
	settings, albums, prev, photos,
	$albums, $photos, $container, $albumsContainer, $photosContainer, $selectedCount, $selectedCountMax, $pageNumber, $pageNumberTotal, $pagePrev, $pageNext, $buttonClose, $buttonOK, $buttonCancel,

	// Private functions
	$getAlbumById, $getPhotoById, buildAlbumSelector, buildPhotoSelector, sortPhotos, log, htmlEntities;

	/////////////////////////////////////////
	// PUBLIC FUNCTIONS FOR GLOBAL PLUGIN
	// They are public because they are added to module and returned
	/////////////////////////////////////////

	/**
	 * Initialise the plugin and define global options
	 */
	init = function(options) {
		console.log('In CSPhotoSelector_init');

		// Default settings
		settings = {
			speed							: 100,
			debug							: false,
			disabledClass					: 'CSPhotoSelector_disabled',
			albumSelectedClass				: 'CSPhotoSelector_photoSelected',
			albumDisabledClass				: 'CSPhotoSelector_photoDisabled',
			photoFilteredClass				: 'CSPhotoSelector_photoFiltered',
			containerSelector				: '#CSPhotoSelector',
			albumsContainerSelector			: '.CSAlbum_container',
			photosContainerSelector			: '.CSPhoto_container',
			photosWrapperSelector			: '.CSPhotoSelector_wrapper',
			selectedPhotoCountSelector		: '.CSPhotoSelector_selectedPhotoCount',
			selectedPhotoCountMaxSelector	: '.CSPhotoSelector_selectedPhotoCountMax',
			pageNumberSelector				: '#CSPhotoSelector_pageNumber',
			pageNumberTotalSelector			: '#CSPhotoSelector_pageNumberTotal',
			pagePrevSelector				: '#CSPhotoSelector_pagePrev',
			pageNextSelector				: '#CSPhotoSelector_pageNext',
			buttonBackToAlbumsSelector		: '#CSPhotoSelector_backToAlbums',
			buttonCloseSelector				: '#CSPhotoSelector_buttonClose',
			buttonOKSelector				: '#CSPhotoSelector_buttonOK',
			buttonCancelSelector			: '#CSPhotoSelector_buttonCancel',
			loader							: '#CSPhotoSelector_loader',
			pagination						: '.CSPhotoSelector_pageNumberContainer, #CSPhotoSelector_pagePrev, #CSPhotoSelector_pageNext'
		};

		// Override defaults with arguments
		$.extend(settings, options);

		// Select DOM elements
		$container			= $(settings.containerSelector);
		$albumsContainer	= $container.find(settings.albumsContainerSelector);
		$photosContainer	= $container.find(settings.photosContainerSelector);
		$photosWrapper		= $container.find(settings.photosWrapperSelector);
		$selectedCount		= $container.find(settings.selectedPhotoCountSelector);
		$selectedCountMax	= $container.find(settings.selectedPhotoCountMaxSelector);
		$pageNumber			= $container.find(settings.pageNumberSelector);
		$pageNumberTotal	= $container.find(settings.pageNumberTotalSelector);
		$pagePrev			= $container.find(settings.pagePrevSelector);
		$pageNext			= $container.find(settings.pageNextSelector);
		$backToAlbums		= $container.find(settings.buttonBackToAlbumsSelector);
		$buttonClose		= $container.find(settings.buttonCloseSelector);
		$buttonOK			= $container.find(settings.buttonOKSelector);
		$buttonCancel		= $container.find(settings.buttonCancelSelector);
		$loader				= $container.find(settings.loader);
		$pagination			= $container.find(settings.pagination);
	};

	/**
	 * If your website has already loaded the user's Facebook photos, pass them in here to avoid another API call.
	 */
	setAlbums = function(input) {
	console.log('In CSPhotoSelector_setAlbums');
		var i, len;
		if (!input || input.length === 0) {
			return;
		}
		input = Array.prototype.slice.call(input);
		input = input.sort(sortPhotos);

		albums = [];
		for (var i=0; i<input.length; i++){
			if (input[i].count){
				albums[albums.length] = input[i];
			}
		}
	};
	
	getAlbums = function() {
	console.log('In CSPhotoSelector_getAlbums');
		return albums;
	};
	
	setPhotos = function(input) {
		var i, len;
		if (!input || input.length === 0) {
			return;
		}
		input = Array.prototype.slice.call(input);
		photos = input;
	};
	
	getPhotos = function() {
		return photos;
	};

	/**
	 * Use this function if you have a photo ID and need to know their name
	 */
	getAlbumById = function(id) {
		var i, len;
		id = id.toString();
		for (i = 0, len = albums.length; i < len; i += 1) {
			if (albums[i].id === id) {
				return albums[i];
			}
		}
		return null;
	};
	
	getPhotoById = function(id) {
		var i, len;
		id = id.toString();
		for (i = 0, len = photos.length; i < len; i += 1) {
			if (photos[i].id === id) {
				return photos[i];
			}
		}
		return null;
	};

	/**
	 * Create a new instance of the photo selector
	 * @param options An object containing settings that are relevant to this particular instance
	 */
	newInstance = function(options) {
	
	console.log('In CSPhotoSelector_newInstance');
		// Public functions
		var showAlbumSelector, showPhotoSelector, hidePhotoSelector, hideAlbumSelector, getselectedAlbumIds, getselectedPhotoIds, setDisabledPhotoIds, reset,

		// Private variables
		instanceSettings, selectedAlbumIds = [], selectedPhotoIds = [], disabledPhotoIds = [],

		// Private functions
		bindEvents, unbindEvents, updateAlbumContainer, updatePhotosContainer, updatePaginationButtons, selectAlbum, selectPhotos;

		if (!settings) {
			log('Cannot create a new instance of CSPhotoSelector because the plugin not initialised.');
			return false;
		}

		// Default settings
		instanceSettings = {
			maxSelection			: 1,
			albumsPerPage			: 6,
			photosPerPage			: 10,
			autoDeselection			: false,	// Allow the user to keep on selecting once they reach maxSelection, and just deselect the first selected photo
			callbackAlbumSelected	: null,
			callbackAlbumUnselected	: null,
			callbackPhotoSelected	: null,
			callbackPhotoUnselected	: null,
			callbackMaxSelection	: null,
			callbackSubmit			: null
		};

		// Override defaults with arguments
		$.extend(instanceSettings, options);

		/////////////////////////////////////////
		// PUBLIC FUNCTIONS FOR AN INSTANCE
		/////////////////////////////////////////

		/**
		 * Call this function to show the interface
		 */
		showAlbumSelector = function(id, callback) {
			var i, len;
			log('CSPhotoSelector - show Albums');
			if (!$albums) {
				return buildAlbumSelector(id, function() {
					showAlbumSelector(id, callback);
				});
			} else {
				bindEvents();
				// Update classnames to represent the selections for this instance
				$albums.removeClass(settings.albumSelectedClass + ' ' + settings.albumDisabledClass + ' ' + settings.photoFilteredClass);
				for (i = 0, len = albums.length; i < len; i += 1) {
					if ($.inArray(albums[i].id, selectedAlbumIds) !== -1) {
						$($albums[i]).addClass(settings.albumSelectedClass);
					}
					if ($.inArray(albums[i].id, disabledPhotoIds) !== -1) {
						$($albums[i]).addClass(settings.albumDisabledClass);
					}
				}
				// Update paging
				updateAlbumContainer(1);
				updatePaginationButtons(1);
				$container.fadeIn(100);
				if (typeof callback === 'function') {
					callback();
				}
			}
		};
		
		showPhotoSelector = function(callback, albumId) {
			var i, len;
			log('CSPhotoSelector - show Photos');
			
			// show loader until we get a response
			$loader.show();
			
			if (!$photos || albumId) {
				return buildPhotoSelector(function() {
					showPhotoSelector(callback);
				}, albumId);
			} else {
				// Update classnames to represent the selections for this instance
				$photos.removeClass(settings.albumSelectedClass + ' ' + settings.albumDisabledClass + ' ' + settings.photoFilteredClass);
				for (i = 0, len = photos.length; i < len; i += 1) {
					if ($.inArray(photos[i].id, selectedPhotoIds) !== -1) {
						$($photos[i]).addClass(settings.albumSelectedClass);
					}
					if ($.inArray(photos[i].id, disabledPhotoIds) !== -1) {
						$($photos[i]).addClass(settings.albumDisabledClass);
					}
				}
				// Update paging
				$selectedCount.html(selectedPhotoIds.length);
				$selectedCountMax.html(instanceSettings.maxSelection);
				updatePhotosContainer(1);
				// updatePaginationButtons(1);
				$container.fadeIn(100);
				if (typeof callback === 'function') {
					callback();
				}
			}
		};
		
		hidePhotoSelector = function() {
			$photosWrapper.removeClass('CSPhoto_container_active');
		};
		
		hideAlbumSelector = function() {
			unbindEvents();
			$container.fadeOut(100);
		};

		getselectedAlbumIds = function() {
			return selectedAlbumIds;
		};
		
		getselectedPhotoIds = function() {
			return selectedPhotoIds;
		};

		/**
		 * Disabled photos are greyed out in the interface and are not selectable.
		 */
		setDisabledPhotoIds = function(input) {
			disabledPhotoIds = input;
		};

		/**
		 * Remove selections, clear disabled list, go to page 1, etc
		 */
		reset = function() {
			if (!albums || albums.length === 0) {
				return;
			}
			// hide the photo container
			$photosWrapper.removeClass('CSPhoto_container_active');
			$buttonOK.hide();
			$albumsContainer.empty();
			$photosContainer.empty();
			selectedAlbumIds = [];
			selectedPhotoIds = [];
			$albums = null;
			$selectedCount.html("0");
			disabledPhotoIds = [];
			updatePaginationButtons(1);
		};

		/////////////////////////////////////////
		// PRIVATE FUNCTIONS FOR AN INSTANCE
		/////////////////////////////////////////

		// Add event listeners
		bindEvents = function() {
			$buttonClose.bind('click', function(e) {
				e.preventDefault();
				hideAlbumSelector();
			});
			$buttonCancel.bind('click', function(e) {
				e.preventDefault();
				hideAlbumSelector();
			});

			$buttonOK.bind('click', function(e) {
                e.preventDefault();
                hideAlbumSelector();
                if (SelectImageId != null){
                    FB.api(
                        "/" + SelectImageId,
                        function (response) {
                            console.log("got chosen picture")
                            console.log(response)
                            if (response && !response.error) {
                                img.src = response.source;
                            }
                        }
                    );
                }

				if (typeof instanceSettings.callbackSubmit === "function") { instanceSettings.callbackSubmit(selectedPhotoIds); }
			});
			
			$backToAlbums.bind('click', function(e) {
				e.preventDefault();
				$pagination.show();
				$buttonOK.hide();
				hidePhotoSelector();
			});

			$pagePrev.bind('click', function(e) {
				var pageNumber = parseInt($pageNumber.text(), 10) - 1;
				e.preventDefault();
				if (pageNumber < 1) { return; }
				updateAlbumContainer(pageNumber);
				updatePaginationButtons(pageNumber);
			});

			$pageNext.bind('click', function(e) {
				var pageNumber = parseInt($pageNumber.text(), 10) + 1;
				e.preventDefault();
				if ($(this).hasClass(settings.disabledClass)) { return; }
				updateAlbumContainer(pageNumber);
				updatePaginationButtons(pageNumber);
			});

			$(window).bind('keydown', function(e) {
				if (e.which === 27) {
					// The escape key has the same effect as the close button
					e.preventDefault();
					e.stopPropagation();
					hideAlbumSelector();
				}
			});
		};

		// Remove event listeners
		unbindEvents = function() {
			$buttonClose.unbind('click');
			$buttonOK.unbind('click');
			$buttonCancel.unbind('click');
			$albumsContainer.children().unbind('click');
			$photosContainer.children().unbind('click');
			$pagePrev.unbind('click');
			$pageNext.unbind('click');
			$(window).unbind('keydown');
		};

		// Set the contents of the albums container
		updateAlbumContainer = function(pageNumber) {
			var firstIndex, lastIndex;
			firstIndex = (pageNumber - 1) * instanceSettings.albumsPerPage;
			lastIndex = pageNumber * instanceSettings.albumsPerPage;
			$albumsContainer.html($albums.not("." + settings.photoFilteredClass).slice(firstIndex, lastIndex));
			$albumsContainer.children().bind('click', function(e) {
				e.preventDefault();
				selectAlbum($(this));
			});
		};
		
		// Set the contents of the photos container
		updatePhotosContainer = function(pageNumber) {
			var firstIndex, lastIndex;
			firstIndex = (pageNumber - 1) * instanceSettings.photosPerPage;
			lastIndex = pageNumber * instanceSettings.photosPerPage;
			$photosContainer.html($photos.not("." + settings.photoFilteredClass).slice(firstIndex, lastIndex));
			$photosContainer.children().bind('click', function(e) {
				e.preventDefault();
				console.log('testing!!!!!!!!!!!!!!!!!');
				console.log(this["data-id"]);
				var wrapper = document.createElement('span');
				//var s = this.innerHTML;
				wrapper.innerHTML = String(this.innerHTML);
				console.log(wrapper.firstChild.firstChild);
				console.log(wrapper.firstChild.firstChild["src"]);
				console.log(wrapper.firstChild.firstChild['src']);
				//.src = wrapper.firstChild.firstChild['src'];
				selectPhotos($(this));
			});
		};

		updatePaginationButtons = function(pageNumber) {
			var numPages = Math.ceil((albums.length) / instanceSettings.albumsPerPage);
			$pageNumber.html(pageNumber);
			$pageNumberTotal.html(numPages);
			if (pageNumber === 1 || numPages === 1) {
				$pagePrev.addClass(settings.disabledClass);
			} else {
				$pagePrev.removeClass(settings.disabledClass);
			}
			if (pageNumber === numPages || numPages === 1) {
				$pageNext.addClass(settings.disabledClass);
			} else {
				$pageNext.removeClass(settings.disabledClass);
			}
		};

		selectAlbum = function($album) {
			var albumId, i, len, removedId;
			albumId = $album.attr('data-id');

			// If the album is disabled, ignore this
			if ($album.hasClass(settings.albumDisabledClass)) {
				return;
			}

			if (!$album.hasClass(settings.albumSelectedClass)) {
				// If autoDeselection is enabled and they have already selected the max number of albums, deselect the first album
				if (instanceSettings.autoDeselection && selectedAlbumIds.length === instanceSettings.maxSelection) {
					removedId = selectedAlbumIds.splice(0, 1);
					$getAlbumById(removedId).removeClass(settings.albumSelectedClass);
					$selectedCount.html(selectedAlbumIds.length);
				}
				if (selectedAlbumIds.length < instanceSettings.maxSelection) {
					// Add album to selectedAlbumIds
					if ($.inArray(albumId, selectedAlbumIds) === -1) {
						selectedAlbumIds.push(albumId);
						$album.addClass(settings.albumSelectedClass);
						$selectedCount.html(selectedAlbumIds.length);
						log('CSPhotoSelector - newInstance - selectAlbum - selected IDs: ', selectedAlbumIds);
						if (typeof instanceSettings.callbackAlbumSelected === "function") { instanceSettings.callbackAlbumSelected(albumId); }
					} else {
						log('CSPhotoSelector - newInstance - selectAlbum - ID already stored');
					}
				}

			} else {
				// Remove album from selectedAlbumIds
				for (i = 0, len = selectedAlbumIds.length; i < len; i += 1) {
					if (selectedAlbumIds[i] === albumId) {
						selectedAlbumIds.splice(i, 1);
						$album.removeClass(settings.albumSelectedClass);
						$selectedCount.html(selectedAlbumIds.length);
						if (typeof instanceSettings.callbackAlbumUnselected === "function") { instanceSettings.callbackAlbumUnselected(albumId); }
						return false;
					}
				}
			}

			if (selectedAlbumIds.length === instanceSettings.maxSelection) {
				if (typeof instanceSettings.callbackMaxSelection === "function") { instanceSettings.callbackMaxSelection(); }
			}
		};
		
		selectPhotos = function($photo) {
			var photoId, i, len, removedId;
			photoId = $photo.attr('data-id');
			//console.log($photo);
			//console.log($photo[0].innerHTML.img["src"]);
			//console.log($photo('innerHTML'));

			// If the photo is disabled, ignore this
			if ($photo.hasClass(settings.albumDisabledClass)) {
				return;
			}

			if (!$photo.hasClass(settings.albumSelectedClass)) {
				// If autoDeselection is enabled and they have already selected the max number of photos, deselect the first photo
				if (instanceSettings.autoDeselection && selectedPhotoIds.length === instanceSettings.maxSelection) {
					removedId = selectedPhotoIds.splice(0, 1);
					$getPhotoById(removedId).removeClass(settings.albumSelectedClass);
					$selectedCount.html(selectedPhotoIds.length);
				}
				if (selectedPhotoIds.length < instanceSettings.maxSelection) {
					// Add photo to selectedPhotoIds
					if ($.inArray(photoId, selectedPhotoIds) === -1) {
						selectedPhotoIds.push(photoId);
						$photo.addClass(settings.albumSelectedClass);
						$selectedCount.html(selectedPhotoIds.length);
						log('CSPhotoSelector - newInstance - selectPhoto - selected IDs: ', selectedPhotoIds);
                        console.log("image id")
                        SelectImageId = selectedPhotoIds[0];
						console.log(selectedPhotoIds[0]);
                        if (typeof instanceSettings.callbackPhotoSelected === "function") { instanceSettings.callbackPhotoSelected(photoId); }
					} else {
						log('CSPhotoSelector - newInstance - selectPhoto - ID already stored');
					}
				}

			} else {
				// Remove photo from selectedPhotoIds
				for (i = 0, len = selectedPhotoIds.length; i < len; i += 1) {
					if (selectedPhotoIds[i] === photoId) {
						selectedPhotoIds.splice(i, 1);
						$photo.removeClass(settings.albumSelectedClass);
						$selectedCount.html(selectedPhotoIds.length);
						if (typeof instanceSettings.callbackPhotoUnselected === "function") { instanceSettings.callbackPhotoUnselected(photoId); }
						return false;
					}
				}
			}

			if (selectedPhotoIds.length === instanceSettings.maxSelection) {
				if (typeof instanceSettings.callbackMaxSelection === "function") { instanceSettings.callbackMaxSelection(); }
			}
			
			 log(selectedPhotoIds);
		};

		// Return an object with access to the public members
		return {
			showAlbumSelector	: showAlbumSelector,
			showPhotoSelector	: showPhotoSelector,
			hidePhotoSelector	: hidePhotoSelector,
			hideAlbumSelector	: hideAlbumSelector,
			getselectedAlbumIds	: getselectedAlbumIds,
			getselectedPhotoIds	: getselectedPhotoIds,
			setDisabledPhotoIds	: setDisabledPhotoIds,
			reset				: reset
		};
	};

	/////////////////////////////////////////
	// PRIVATE FUNCTIONS FOR GLOBAL PLUGIN
	/////////////////////////////////////////

	$getAlbumById = function(id) {
		var i, len;
		id = id.toString();
		for (i = 0, len = albums.length; i < len; i += 1) {
			if (albums[i].id === id) {
				return $($albums[i]);
			}
		}
		return $("");
	};
	
	$getPhotoById = function(id) {
		var i, len;
		id = id.toString();
		for (i = 0, len = photos.length; i < len; i += 1) {
			if (photos[i].id === id) {
				return $($photos[i]);
			}
		}
		return $("");
	};
	
	/**
	 * Load the Facebook albums and build the markup
	 */
	buildAlbumSelector = function(id, callback) {
	
	console.log('In CSPhotoSelector_buildAlbumSelector');
		var buildMarkup, buildAlbumMarkup;
		log("buildAlbumSelector");
		$pagination.show();

		if (!FB) {
			log('The Facebook SDK must be initialised before showing the photo selector');
			return false;
		}

		// Check that the user is logged in to Facebook
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				var accessToken = response.authResponse.accessToken;
				// Load Facebook photos
				FB.api('/'+ id +'/albums',
                    function(response) {
					if (response.data.length) {
						setAlbums(response.data);
						// Build the markup
						buildMarkup(accessToken);
						// Call the callback
						if (typeof callback === 'function') { callback(); }
					} else {
						alert ('Sorry, your friend won\'t let us look through their photos');
						log('CSPhotoSelector - buildAlbumSelector - No albums returned');
						return false;
					}
				});
			} else {
				log('CSPhotoSelector - buildAlbumSelector - User is not logged in to Facebook');
				return false;
			}
		});

		// Build the markup of the album selector
		buildMarkup = function(accessToken) {
			// loop through photo albums
			var i, len, html = '';
			for (i = 0, len = albums.length; i < len; i += 1) {
				html += buildAlbumMarkup(albums[i], accessToken);
			}
			$albums = $(html);
		};

		// Return the markup for a single album
		buildAlbumMarkup = function(album, accessToken) {
			return '<a href="#" class="CSPhotoSelector_album" data-id="' + album.id + '">' +
					'<div class="CSPhotoSelector_albumWrap"><div>' +
					'<img src="https://graph.facebook.com/'+ album.id +'/picture?type=album&access_token='+ accessToken +'" alt="' + htmlEntities(album.name) + '" class="CSPhotoSelector_photoAvatar" />' +
					'</div></div>' +
					'<div class="CSPhotoSelector_photoName">' + htmlEntities(album.name) + '</div>' +
					'</a>';
		};
	};
	
	/**
	 * Load the Facebook photos and build the markup
	 */
	buildPhotoSelector = function(callback, albumId) {
	console.log('In CSPhotoSelector_buildPhotoSelector');
		var buildSecondMarkup, buildPhotoMarkup;
		log("buildPhotoSelector");

		photos = [];

		FB.api('/'+ albumId +'/photos?fields=id,picture,source,height,width,images&limit=500',
            {
                "width": 9999
            },
            function(response) {
			if (response.data) {
				setPhotos(response.data);
				// Build the markup
				buildSecondMarkup();
				// Call the callback
				if (typeof callback === 'function') {
					callback();					
					// hide the loader and pagination
					$loader.hide();
					$pagination.hide();
					// set the photo container to active
					$photosWrapper.addClass('CSPhoto_container_active');
				}
			} else {
				log('CSPhotoSelector - showPhotoSelector - No photos returned');
				return false;
			}
		});
		
		// Build the markup of the photo selector
		buildSecondMarkup = function() {
			//loop through photos
			var i, len, html = '';
			// if photos is empty, we need to try again
			
			if (!photos) {
				buildPhotoSelector(null, albumId);
			}
			for (i = 0, len = photos.length; i < len; i += 1) {
				html += buildPhotoMarkup(photos[i]);
			}
			
			$photos = $(html);
		};
		
		buildPhotoMarkup = function(photo) {
			return '<a href="#" class="CSPhotoSelector_photo CSPhotoSelector_clearfix" data-id="' + photo.id + '">' +
					'<span><img src="' + photo.picture + '" alt="" class="CSPhotoSelector_photoAvatar" /></span>' +
					'</a>';
		};
	};


	sortPhotos = function(photo1, photo2) {
		if (photo1.upperCaseName === photo2.upperCaseName) { return 0; }
		if (photo1.upperCaseName > photo2.upperCaseName) { return 1; }
		if (photo1.upperCaseName < photo2.upperCaseName) { return -1; }
	};

	log = function() {
		if (settings && settings.debug && window.console) {
			console.log(Array.prototype.slice.call(arguments));
		}
	};

	htmlEntities = function(str) {
		if (!str) return '';
		// replace HTML tags in a string with encoded entities
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	};

	module = {
		init			: init,
		setAlbums		: setAlbums,
		getAlbums		: getAlbums,
		getAlbumById	: getAlbumById,
		setPhotos		: setPhotos,
		getPhotos		: getPhotos,
		getPhotoById	: getPhotoById,
		newInstance		: newInstance
	};
	return module;

}(CSPhotoSelector || {}, jQuery));