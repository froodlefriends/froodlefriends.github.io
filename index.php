<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" type="text/css" href="css/main.css"></link>
  <link rel="stylesheet" href="css/csphotoselector.css">

  <title>Canvas Demo</title>

  <link rel="icon" type="image/png" href="/favicon/favicon-16x16.png" sizes="16x16">
  <link rel="icon" type="image/png" href="/favicon/favicon-32x32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96">

  <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-touch-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-touch-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-touch-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-touch-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-touch-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-touch-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-touch-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-touch-icon-152x152.png">
</head>
<body>
  <img hidden id="image" src="images/w.png" width=1000 max-height=700>

  <div>
    <div class="pane big_pane">
      <div class="froodle_button" id="select">
        <span class="text">Select From Your Photos</span>
      </div>
      <div class="photo_upload_box">
        <input type="text" id="urlToUpload" placeholder="Enter photo URL"></input>
        <div class="froodle_button left_button" onclick="loadFromURL()">
          <span class="text">Upload from URL</span>
        </div>
      </div>
    </div>
    <div class="pane big_pane">
      <div class="froodle_button" onclick="post()">
        <span class="text">Save To Facebook</span>
      </div>

      <div class="photo_action_box">
        <div class="froodle_button smaller_button" onclick="resetAll()">
          <span class="text">Reset</span>
        </div>
        <div class="froodle_button smaller_button" onclick="undo()">
          <span class="text">Undo</span>
        </div>
        <div class="clear">&#160;</div>
      </div>

    </div>
    <div class="pane smalle_pane">

      <div id='test' class="photo_colour_box">
        <div class='colorwheel' onclick="setColour()"/>
          <input hidden class="color" id="colour" type='text' onchange=setColour()/>
        </div>
        <div class="froodle_button smaller_button">
          <input type="range" id="lineWidth" value=5 max=10 onchange=setLineWidth()/>
        </div>
      </div>
    </div>

    <div class="clear">&#160;</div>

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

    <div id="sign_up">
        <div>
            <div class="post_header">
                Save your Masterpiece to Facebook
            </div>
            <div class="post_content">
                <div class="post_image_wrapper">
                    <img id="lightBoxImage" src="images/w.png" class="post_preview"/>
                </div>
                <div class="post_center">
                    <div class="froodle_button smaller_button" onclick="PostImageToFacebook(accessToken)">
                        <span class="text">Save</span>
                    </div>
                    <div class="froodle_button smaller_button cancel_button" onclick="closeBox()">
                        <span class="text">Cancel</span>
                    </div>
                    <div class="clear">&#160;</div>
                </div>
            </div>
        </div>
    </div>
  
  <canvas id="myCanvas" width=3000px max-height="100%"></canvas>

  
  <script type="text/javascript" src="/js/vendor/jquery-1.7.1.min.js"></script>
  <script type="text/javascript" src="/js/vendor/raphael-min.js"></script>
  <script type="text/javascript" src="/js/vendor/qunit.min.js"></script>

  <script type="text/javascript" src="/js/JavaScriptFunctions.js"></script>
  <script type="text/javascript" src="/js/FurtherJSFunctions.js"></script>
  <script type="text/javascript" src="/js/colorwheel.js" ></script>
  <script type="text/javascript"src = "js/jquery.lightbox_me.js"></script>


  <script type="text/javascript">
  function run_tests(){
    function input_example(){
      var cw = Raphael.colorwheel($("#test .colorwheel")[0],150);
      cw.input($("#test input")[0]);
      return cw;
    }
    function callback_example(){
      var cw = Raphael.colorwheel($("#test .colorwheel")[0],150);
      cw.input($("#test input")[0]);
      return cw;
    }
    module("Color Wheel");
    var input = $("#test input");
    var cw = input_example();
    test("setting the color value updates the picker and the input", function(){
      cw.color("#FF0000");
      equal("#ff0000", cw.color().hex, "the color value is set");
      equal("#ff0000", input.val(), "input is set");
    });
    module("Callback");
    test("onchange should happen when user interaction happens", function(){
      var onchange_count = 0;
      cw.onchange(function(){ onchange_count += 1; });
      equal(onchange_count, 0, "onchange has not triggered yet");
      input.val("#FFFFFF").trigger("keyup");
      equal(onchange_count, 1, "onchange should trigger when input changed");
    });
  }
  $(run_tests);

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
  document.getElementById("image").onload = loadImage;

  //set up mouse event listeners
  document.onmousedown = globalMousedown;
  document.onmouseup = globalMouseup;
  document.getElementById('myCanvas').onmousedown = myMousedown;
  document.getElementById('myCanvas').onmouseup = myMouseup;
  document.getElementById('myCanvas').onmousemove = myMousemove;
  document.getElementById('myCanvas').onmouseleave = myMouseleave;

  </script>

</body>
</html>
