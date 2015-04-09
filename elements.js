"use strict";
var boxes = {};
var screens = {};
var pinchSet = [];

var state0CoordinatesSet = [[0, 0], [200, 0], [400, 0], [0, 200], [200, 200], [400, 200], [0, 400], [200, 400], [400, 400]];
var state1CoordinatesSet = [[50, 0], [520, 0], [520, 150], [520, 300], [520, 450], [-80, 450],[70, 450], [220, 450], [370, 450]];
var state2CoordinatesSet = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

// Box class representing a single cctv source
var Box = function(id, position, css) {
	var box = this;
	box.id = id;
	box.position = position;
	box.css = css;

	box.img = new Image();
	box.img.src = (id + 1) + ".jpg";
	box.img.onload = function() {
		box.img.style.left = position[0] + 'px';
		box.img.style.top = position[1] + 'px';
    //img.style.zIndex = 2;
    //img.style.transform = 'scale(' + scale[0] + ',' + scale[1] + ')';
    box.img.style.webkitTransform = box.img.style.MozTransform = box.img.style.msTransform = 
    box.img.style.OTransform = box.img.style.transform;
    box.img.id = "image" + id;
    box.img.style.position = 'absolute';
    box.img.style.border='2px solid #000000';
    document.getElementById("cctvScreen").appendChild(box.img);
  };

  // function setTransform is called whenever the box is transformed to new position / scale
  box.setTransform = function(position, fromState, toState, setid, css) {
  	if (fromState == 3 && toState == 3) {
  		box.img.style.left = position[0] + state2CoordinatesSet[setid][0] + 'px';
  		box.img.style.top  = position[1] + state2CoordinatesSet[setid][1] + 'px';  
  		box.position = [position[0] + state2CoordinatesSet[setid][0], position[1] + state2CoordinatesSet[setid][1]];    
  	}
  	else if (fromState == 3 && toState == 2) {
  		box.img.style.left = position[0] + state2CoordinatesSet[setid][0] + 'px';
  		box.img.style.top  = position[1] + state2CoordinatesSet[setid][1] + 'px';  
  		box.position = [position[0] + state2CoordinatesSet[setid][0], position[1] + state2CoordinatesSet[setid][1]];     
  	}
  	else if (fromState == 2 && toState == 1) {
  		box.img.style.left = position[0] + state1CoordinatesSet[setid][0] + 'px';
  		box.img.style.top  = position[1] + state1CoordinatesSet[setid][1] + 'px'; 
  		box.position = [position[0] + state1CoordinatesSet[setid][0], position[1] + state1CoordinatesSet[setid][1]];        
  	}
  	else if (fromState == 2 && toState == 3) {
  		box.img.style.left = position[0] + state2CoordinatesSet[setid][0] + 'px';
  		box.img.style.top  = position[1] + state2CoordinatesSet[setid][1] + 'px'; 
  		box.position = [position[0] + state2CoordinatesSet[setid][0],position[1] + state2CoordinatesSet[setid][1]];  
  	}
  	else if (fromState == 1 && toState === 0) {
  		box.img.style.left = position[0] + state0CoordinatesSet[setid][0] + 'px';
  		box.img.style.top  = position[1] + state0CoordinatesSet[setid][1] + 'px'; 
  		box.position = [position[0] + state0CoordinatesSet[setid][0], position[1] + state0CoordinatesSet[setid][1]];         
  	}
  	else if (fromState == 1 && toState == 2) {
  		box.img.style.left = position[0] + state2CoordinatesSet[setid][0] + 'px';
  		box.img.style.top  = position[1] + state2CoordinatesSet[setid][1] + 'px'; 
  		box.position = [position[0] + state2CoordinatesSet[setid][0], position[1] + state2CoordinatesSet[setid][1]];        
  	}
  	else if (fromState === 0) {
      // toState can only be 1
      box.img.style.left = position[0] + state1CoordinatesSet[setid][0] + 'px';
      box.img.style.top  = position[1] + state1CoordinatesSet[setid][1] + 'px'; 
      box.position = [position[0] + state1CoordinatesSet[setid][0], position[1] + state1CoordinatesSet[setid][1]];          
    }
    //img.style.transform = 'scale(' + scale[0] + ',' + scale[1] + ')';
    box.img.style.webkitTransform = box.img.style.MozTransform = box.img.style.msTransform =
    box.img.style.OTransform = box.img.style.transform;
    box.img.className = "";
    if (css !== '') {
    	box.img.classList.add(css);
    	box.css = css;
    }
  };
};

// class Screen representing a single screen with 9 boxes inside initially
// state = screen state, 0 = 9 boxes, 1 = 1 big box with 8 small boxes, 2 = 1 big box
// position = position of the left upper box
// css = css style chosen for the current state
var Screen = function(id, state, position, css) {     
	var screen = this;
	screen = document.getElementById("cctvScreen");
	//screen.id = id;
	screen.state = state;
	screen.position = position;
	screen.css = css;
	screen.selectBoxId = -1;
  // initialize 9 boxes within a screen
  for (var i = 0; i < 3; i++) {
  	for (var j = 0; j < 3; j++) {
      // 200 = original box size, 'img' = css style for the state 0
      boxes[i * 3 + j] = new Box(i * 3 + j, [state0CoordinatesSet[i * 3 + j][0] + position[0], state0CoordinatesSet[i * 3 + j][1] + position[1]], 'img');
    }
  }

  // draw a text box below the 9 boxes
  screen.canvas = document.createElement("canvas");
  screen.canvas.id = 'mycanvas';
  screen.canvas.style.position = 'absolute';
  screen.canvas.style.left = position[0] + 0 + 'px';
  screen.canvas.style.top = position[1] + 600 + 'px';
  screen.canvas.width = 600;
  screen.canvas.height = 50;
  //document.body.appendChild(screen.canvas);
  var context = screen.canvas.getContext("2d");
  context.font = "20px Georgia";
  //context.color = "black";
  context.fillText("Screen " + id, 250, 40); 
  
  // function enlarge1 is called when the original 9 boxes state is zoomed in to middle size
  screen.enlarge1 = function(boxid) {
  	console.log("enlarge1");
  	if (screen.state === 0) {
      // set the selected box to a larger size and at the upper left hand corner
      screen.selectBoxId = boxid;
      boxes[boxid].setTransform(position, screen.state, 1, 0, 'enlarge450');
      var j = 1;
      for (var i = 0; i < 9; i++) {
      	if (i != boxid) {
      		boxes[i].setTransform(position, screen.state, 1, j, 'enlarge150');
      		j++;          
      	}
      }
      screen.state = 1;
    }
  };

  screen.enlarge2 = function() {
  	console.log("enlarge2");
  	if (screen.state == 1) {
      // set the selected box to the largest size
      boxes[screen.selectBoxId].setTransform(position, screen.state, 2, 0, 'enlarge600');
      var j = 1;
      for (var i = 0; i < 9; i++) {
      	if (i != screen.selectBoxId) {
      		boxes[i].setTransform(position, screen.state, 2, j, 'invisible');
      		j++;
      	}
      }
      screen.state = 2;
    }
  };

  screen.enlarge3 = function() {
  	console.log("enlarge3");    
    // further enlarge for pan/tilt
    if (screen.state == 2) {
    	screen.position = [200, 0];
      //boxes[selectBoxId].setTransform(position, this.state, 3, 0, 'enlarge800');
      boxes[screen.selectBoxId].setTransform(screen.position, screen.state, 3, 0, 'maskmiddle800');
      var j = 1;
      for (var i = 0; i < 9; i++) {
      	if (i != screen.selectBoxId) {
      		boxes[i].setTransform(screen.position, screen.state, 3, j, 'invisible');
      		j++;
      	}
      }
      screen.state = 3;
    }
  };

  screen.reduce3 = function() {
  	console.log("reduce3");    
    // reduce to full screen mode
    if (screen.state == 3) {
    	screen.position = [300, 100];
    	boxes[screen.selectBoxId].setTransform(screen.position, screen.state, 2, 0, 'enlarge600');
    	var j = 1;
    	for (var i = 0; i < 9; i++) {
    		if (i != screen.selectBoxId) {
    			boxes[i].setTransform(screen.position, screen.state, 2, j, 'invisible');
    		}
    	}
    	screen.state = 2;
    }
  };

  screen.reduce2 = function() {
  	console.log("reduce2");    
  	if (screen.state == 2) {
      // zoom from largest single box to middle size
      boxes[screen.selectBoxId].setTransform(screen.position, screen.state, 1, 0, 'enlarge450');
      var j = 1;
      for (var i = 0; i < 9; i++) {
      	if (i != screen.selectBoxId) {
      		boxes[i].setTransform(screen.position, screen.state, 1, j, 'enlarge150');
      		j++;
      	}
      }
      screen.state = 1;
    }
  };

  screen.reduce1 = function() {
  	console.log("reduce1");    
  	if (screen.state == 1) {
      // zoom back to the original position
      screen.selectBoxId = -1;
      for (var i = 0; i < 9; i++) {
      	boxes[i].setTransform(screen.position, screen.state, 0, i, '');
      }
      screen.state = 0;
    }
  };

  screen.pantilt = function(direction) {
  	console.log("pantilt");    
  	if (screen.state == 3) {
      //var name = "image" + screen.selectBoxId.toString();
      //var pos = $('#' + name).position();
      //imgx = pos.left;
      //imgy = pos.top;
      var selectBox = boxes[screen.selectBoxId];
      var css = selectBox.css;      

      if (direction == "left") {
        // photo move to left, mask move to right
        if (css == 'maskmiddle800') {
        	selectBox.setTransform([selectBox.position[0] - 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskright800');
        }
        else if (css == 'maskup800') {
        	selectBox.setTransform([selectBox.position[0] - 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskrightup800');
        }
        else if (css == 'maskdown800') {
        	selectBox.setTransform([selectBox.position[0] - 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskrightdown800');
        }        
        else if (css == 'maskleftup800') {
        	selectBox.setTransform([selectBox.position[0] - 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskup800');
        }
        else if (css == 'maskleft800') {
        	selectBox.setTransform([selectBox.position[0] - 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskmiddle800');
        }
        else if (css == 'maskleftdown800') {
        	selectBox.setTransform([selectBox.position[0] - 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskdown800');
        }
      }
      else if (direction == "right") {
        // photo move to right, mask move to left
        if (css == 'maskmiddle800') {
        	selectBox.setTransform([selectBox.position[0] + 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskleft800');
        }
        else if (css == 'maskup800') {
        	selectBox.setTransform([selectBox.position[0] + 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskleftup800');
        }
        else if (css == 'maskdown800') {
        	selectBox.setTransform([selectBox.position[0] + 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskleftdown800');          
        }
        else if (css == 'maskrightup800') {
        	selectBox.setTransform([selectBox.position[0] + 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskup800');
        }
        else if (css == 'maskright800') {
        	selectBox.setTransform([selectBox.position[0] + 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskmiddle800');
        }
        else if (css == 'maskrightdown800') {
        	selectBox.setTransform([selectBox.position[0] + 100, selectBox.position[1]], screen.state, screen.state, 0, 'maskdown800');
        }
      }
      else if (direction == "up") {
        // photo move up, mask move down
        if (css == 'maskmiddle800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] - 100], screen.state, screen.state, 0, 'maskdown800');
        }
        else if (css == 'maskleft800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] - 100], screen.state, screen.state, 0, 'maskleftdown800');
        }
        else if (css == 'maskright800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] - 100], screen.state, screen.state, 0, 'maskrightdown800');
        } 
        else if (css == 'maskup800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] - 100], screen.state, screen.state, 0, 'maskmiddle800');
        }               
        else if (css == 'maskleftup800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] - 100], screen.state, screen.state, 0, 'maskleft800');
        }
        else if (css == 'maskrightup800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] - 100], screen.state, screen.state, 0, 'maskright800');          
        }
      }
      else if (direction == "down") {
        // photo move down, mask move up
        if (css == 'maskmiddle800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] + 100], screen.state, screen.state, 0, 'maskup800'); 
        }
        else if (css == 'maskleft800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] + 100], screen.state, screen.state, 0, 'maskleftup800'); 
        }
        else if (css == 'maskright800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] + 100], screen.state, screen.state, 0, 'maskrightup800'); 
        } 
        else if (css == 'maskdown800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] + 100], screen.state, screen.state, 0, 'maskmiddle800'); 
        }               
        else if (css == 'maskleftdown800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] + 100], screen.state, screen.state, 0, 'maskleft800'); 
        }
        else if (css == 'maskrightdown800') {
        	selectBox.setTransform([selectBox.position[0], selectBox.position[1] + 100], screen.state, screen.state, 0, 'maskright800');           
        }
      }
    }
  };
};

// initialize a new screen with 
screens[0] = new Screen(0, 0, [0, 0], 'img');
// display debug messages
var debug = false;
if (!debug) {
	document.getElementById("leapData").style.display = "none";
}
document.getElementById("btnOldSystem").onclick = function () {
	document.getElementById("oldSystem").style.display = "";
	document.getElementById("newSystem").style.display = "none";	
};
document.getElementById("btnNewSystem").onclick = function () {
	document.getElementById("oldSystem").style.display = "none";
	document.getElementById("newSystem").style.display = "";	
};

