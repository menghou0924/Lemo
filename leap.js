"use strict";
// Store frame for motion functions
var previousFrame = null;
var paused = false;
var pauseOnGesture = false;

// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};
var ctl = new Leap.Controller({enableGestures: true});

// to use HMD mode:
// controllerOptions.optimizeHMD = true;

// Leap Motion Detection
Leap.loop({enableGestures: true}, function(frame) {

	if (paused) {
    return; // Skip this update
  }

  var frameOutput = document.getElementById("frameData");

  // Display basic data
  var frameString = "Frame ID: " + frame.id + "<br />" + "Timestamp:" + frame.timestamp + " &micro;s<br />" + "Hands: " + frame.hands.length + "<br />" + "Fingers: " + frame.fingers.length + "<br />" + "Tools: " + frame.tools.length + "<br />" + "Gestures: " + frame.gestures.length + "<br />";

  // Frame motion factors
  if (previousFrame && previousFrame.valid) {
    var translation = frame.translation(previousFrame);
    frameString += "Translation: " + vectorToString(translation) + " mm <br />";

    var rotationAxis = frame.rotationAxis(previousFrame);
    var rotationAngle = frame.rotationAngle(previousFrame);
    frameString += "Rotation axis: " + vectorToString(rotationAxis, 2) + "<br />";
    frameString += "Rotation angle: " + rotationAngle.toFixed(2) + " radians<br />";

    var scaleFactor = frame.scaleFactor(previousFrame);
    frameString += "Scale factor: " + scaleFactor.toFixed(2) + "<br />";
  }
  frameOutput.innerHTML = "<div style='width:300px; float:left; padding:5px'>" + frameString + "</div>";

  // Display Hand object data
  var handOutput = document.getElementById("handData");
  var handString = "";
  if (frame.hands.length > 0) {
    for (var i = 0; i < frame.hands.length; i++) {
      var hand = frame.hands[i];

      handString += "<div style='width:300px; float:left; padding:5px'>";
      handString += "Hand ID: " + hand.id + "<br />";
      handString += "Type: " + hand.type + " hand" + "<br />";
      handString += "Direction: " + vectorToString(hand.direction, 2) + "<br />";
      handString += "Palm position: " + vectorToString(hand.palmPosition) + " mm<br />";
      handString += "Grab strength: " + hand.grabStrength + "<br />";
      handString += "Pinch strength: " + hand.pinchStrength + "<br />";
      handString += "Confidence: " + hand.confidence + "<br />";
      handString += "Arm direction: " + vectorToString(hand.arm.direction()) + "<br />";
      handString += "Arm center: " + vectorToString(hand.arm.center()) + "<br />";
      handString += "Arm up vector: " + vectorToString(hand.arm.basis[1]) + "<br />";

      // Hand motion factors
      if (previousFrame && previousFrame.valid) {
        var translation = hand.translation(previousFrame);
        handString += "Translation: " + vectorToString(translation) + " mm<br />";

        var rotationAxis = hand.rotationAxis(previousFrame, 2);
        var rotationAngle = hand.rotationAngle(previousFrame);
        handString += "Rotation axis: " + vectorToString(rotationAxis) + "<br />";
        handString += "Rotation angle: " + rotationAngle.toFixed(2) + " radians<br />";

        var scaleFactor = hand.scaleFactor(previousFrame);
        handString += "Scale factor: " + scaleFactor.toFixed(2) + "<br />";
      }

      // IDs of pointables associated with this hand
      if (hand.pointables.length > 0) {
        var fingerIds = [];
        for (var j = 0; j < hand.pointables.length; j++) {
          var pointable = hand.pointables[j];
          fingerIds.push(pointable.id);
        }
        if (fingerIds.length > 0) {
          handString += "Fingers IDs: " + fingerIds.join(", ") + "<br />";
        }
      }

      handString += "</div>";
    }
  }
  else {
    handString += "No hands";
  }
  handOutput.innerHTML = handString;

  // Display Pointable (finger and tool) object data
  var pointableOutput = document.getElementById("pointableData");
  var pointableString = "";
  if (frame.pointables.length > 0) {
    var fingerTypeMap = ["Thumb", "Index finger", "Middle finger", "Ring finger", "Pinky finger"];
    var boneTypeMap = ["Metacarpal", "Proximal phalanx", "Intermediate phalanx", "Distal phalanx"];
    for (var i = 0; i < frame.pointables.length; i++) {
      var pointable = frame.pointables[i];

      pointableString += "<div style='width:250px; float:left; padding:5px'>";

      if (pointable.tool) {
        pointableString += "Pointable ID: " + pointable.id + "<br />";
        pointableString += "Classified as a tool <br />";
        pointableString += "Length: " + pointable.length.toFixed(1) + " mm<br />";
        pointableString += "Width: "  + pointable.width.toFixed(1) + " mm<br />";
        pointableString += "Direction: " + vectorToString(pointable.direction, 2) + "<br />";
        pointableString += "Tip position: " + vectorToString(pointable.tipPosition) + " mm<br />"
        pointableString += "</div>";
      }
      else {
        pointableString += "Pointable ID: " + pointable.id + "<br />";
        pointableString += "Type: " + fingerTypeMap[pointable.type] + "<br />";
        pointableString += "Belongs to hand with ID: " + pointable.handId + "<br />";
        pointableString += "Classified as a finger<br />";
        pointableString += "Length: " + pointable.length.toFixed(1) + " mm<br />";
        pointableString += "Width: "  + pointable.width.toFixed(1) + " mm<br />";
        pointableString += "Direction: " + vectorToString(pointable.direction, 2) + "<br />";
        pointableString += "Extended?: "  + pointable.extended + "<br />";
        pointable.bones.forEach( function(bone){
          pointableString += boneTypeMap[bone.type] + " bone <br />";
          pointableString += "Center: " + vectorToString(bone.center()) + "<br />";
          pointableString += "Direction: " + vectorToString(bone.direction()) + "<br />";
          pointableString += "Up vector: " + vectorToString(bone.basis[1]) + "<br />";
        });
        pointableString += "Tip position: " + vectorToString(pointable.tipPosition) + " mm<br />";
        pointableString += "</div>";
      }
    }
  }
  else {
    pointableString += "<div>No pointables</div>";
  }
  //pointableOutput.innerHTML = pointableString;

  // Display Gesture object data
  var gestureOutput = document.getElementById("gestureData");
  var gestureString = "";
  if (frame.gestures.length > 0) {
    if (pauseOnGesture) {
      togglePause();
    }
    for (var i = 0; i < frame.gestures.length; i++) {
      var gesture = frame.gestures[i];
      gestureString += "Gesture ID: " + gesture.id + ", ";
      gestureString += "type: " + gesture.type + ", ";
      gestureString += "state: " + gesture.state + ", ";
      gestureString += "hand IDs: " + gesture.handIds.join(", ") + ", ";
      gestureString += "pointable IDs: " + gesture.pointableIds.join(", ") + ", ";
      gestureString += "duration: " + gesture.duration + " &micro;s, ";

      switch (gesture.type) {
        case "circle":
        gestureString += "center: " + vectorToString(gesture.center) + " mm, "
        gestureString += "normal: " + vectorToString(gesture.normal, 2) + ", "
        gestureString += "radius: " + gesture.radius.toFixed(1) + " mm, "
        gestureString += "progress: " + gesture.progress.toFixed(2) + " rotations";
        break;
        case "swipe":
        gestureString += "start position: " + vectorToString(gesture.startPosition) + " mm, "
        gestureString += "current position: " + vectorToString(gesture.position) + " mm, "
        gestureString += "direction: " + vectorToString(gesture.direction, 1) + ", "
        gestureString += "speed: " + gesture.speed.toFixed(1) + " mm/s";
        break;
        case "screenTap":
        case "keyTap":
        gestureString += "position: " + vectorToString(gesture.position) + " mm";
        break;
        default:
        gestureString += "unkown gesture type";
        break;
      }
      gestureString += "<br />";
    }
  }
  //else {
  //  gestureString += "No gestures";
  //}
  //gestureOutput.innerHTML += gestureString;

  // Store frame for motion functions
  previousFrame = frame;

	// handle enlarge1 function
  if (screens[0].state === 0) {
   if (frame.valid && frame.gestures.length > 0) {
    for(var i = 0; i < frame.gestures.length; i++) {
      var gesture = frame.gestures[i];
        // using swipe/ circle gesture to enlarge screen
        if (gesture.type == "swipe") {
          console.log(gesture.direction[0] + " " + gesture.direction[1]);
          // direction[0] = x, direction[1] = y
          if (gesture.direction[0] >= -0.25 && gesture.direction[0] <= 0.25 && gesture.direction[1] >= 0.75 && gesture.direction[1] <= 1) { 
            console.log("up");
            screens[0].enlarge1(7);
          }
          else if (gesture.direction[0] >= -0.25 && gesture.direction[0] <= 0.25 && gesture.direction[1] >= -1 && gesture.direction[1] <= -0.75) {
            console.log("down");
            screens[0].enlarge1(1); 
          } 
          else if (gesture.direction[0] >= 0.75 && gesture.direction[0] <= 1 && gesture.direction[1] >= -0.25 && gesture.direction[1] <= 0.25) {
            console.log("right");
            screens[0].enlarge1(3);  
          }
          else if (gesture.direction[0] >= -1 && gesture.direction[0] <= -0.75 && gesture.direction[1] >= -0.25 && gesture.direction[1] <= 0.25) {
            console.log("left");
            screens[0].enlarge1(5);  
          }
          else if (gesture.direction[0] >= 0.25 && gesture.direction[0] <= 0.75 && gesture.direction[1] >= 0.25 && gesture.direction[1] <= 0.75) {
            console.log("rightup");
            screens[0].enlarge1(6);  
          }
          else if (gesture.direction[0] >= 0.25 && gesture.direction[0] <= 0.75 && gesture.direction[1] >= -0.75 && gesture.direction[1] <= -0.25) {
            console.log("rightdown");
            screens[0].enlarge1(0);  
          }
          else if (gesture.direction[0] >= -0.75 && gesture.direction[0] <= -0.25 && gesture.direction[1] >= 0.25 && gesture.direction[1] <= 0.75) {
            console.log("leftup");
            screens[0].enlarge1(8);  
          }
          else if (gesture.direction[0] >= -0.75 && gesture.direction[0] <= -0.25 && gesture.direction[1] >= -0.75 && gesture.direction[1] <= -0.25) {
            console.log("leftdown");
            screens[0].enlarge1(2);  
          }   
        }
        if (gesture.type == "circle") {
         console.log("middle");
         screens[0].enlarge1(4);  
       }        
     }
   }
 }

 else if (screens[0].state == 1) {
  var debugstring = "";
    // using pinch strength to enlarge screen
    if (frame.valid && frame.hands.length > 0) {
      for (var i = 0; i < frame.hands.length; i++) {
        var hand = frame.hands[i];
        // if there are five good readings, enlarge the screen with enlarge2()
        if (pinchSet.length > 5) {
          if ((pinchSet[pinchSet.length - 1] - pinchSet[pinchSet.length - 2]) < 0) {
            // decreasing readings, i.e. enlarge
            screens[0].enlarge2();
            debugstring = "<br />success enlarge2 " + pinchSet[0] + " " + pinchSet[1] + " " + pinchSet[2] + " " + pinchSet[3] + " " + pinchSet[4];   
          } 
          else {
            // increasing readings, i.e. reduce
            screens[0].reduce1();
            debugstring = "<br />success reduce1 " + pinchSet[0] + " " + pinchSet[1] + " " + pinchSet[2] + " " + pinchSet[3] + " " + pinchSet[4]; 
          }

          while(pinchSet.length > 0) {
            pinchSet.pop();
          }
        }
        // only insert into set if the following criteria are met
        else if (hand.pinchStrength.toPrecision(2) !== 0.0 && hand.pinchStrength.toPrecision(2) != 1.0) {
          // record first reading if the set is empty
          if (pinchSet.length === 0) {
            pinchSet[0] = hand.pinchStrength.toPrecision(2);
            debugstring = "first " + pinchSet[pinchSet.length - 1] + " ";
          }
          else if (pinchSet.length == 1 && Math.abs(hand.pinchStrength.toPrecision(2) - pinchSet[pinchSet.length - 1]) > 0.1) {
            pinchSet[1] = hand.pinchStrength.toPrecision(2);
            debugstring = "second " + pinchSet[pinchSet.length - 1] + " ";
          } 
          else if (pinchSet.length > 1 && Math.abs(hand.pinchStrength.toPrecision(2) - pinchSet[pinchSet.length - 1]) > 0.1) {          
            debugstring = hand.pinchStrength.toPrecision(2) + " ";
            var diff = pinchSet[pinchSet.length - 1] - pinchSet[pinchSet.length - 2];
            if (diff > 0) {
              // increasing, i.e. reduce screen
              if (hand.pinchStrength.toPrecision(2) > pinchSet[pinchSet.length - 1]) {
                // increasing sequence -> accept
                pinchSet[pinchSet.length] = hand.pinchStrength.toPrecision(2);
                debugstring += "record ";  
              }
              else {
                while(pinchSet.length > 0) {
                  pinchSet.pop();
                }
                debugstring += "reset <br />"; 
              }
            }
            else {
              // decreasing, i.e. enlarge screen
              if (hand.pinchStrength.toPrecision(2) < pinchSet[pinchSet.length - 1]) {
                // decreasing sequence -> accept
                pinchSet[pinchSet.length] = hand.pinchStrength.toPrecision(2);
                debugstring += "record ";  
              }
              else {
                while(pinchSet.length > 0) {
                  pinchSet.pop();
                }
                debugstring += "reset <br />"; 
              }
            }        
          }
        }
        gestureOutput.innerHTML += debugstring;
        //gestureOutput.innerHTML += hand.scaleFactor(sinceFrame);
      }
    }
  }

  else if (screens[0].state == 2) {
   var debugstring = "";
   if (frame.valid) {
      // for pan/tilt
      if (frame.gestures.length > 0) {
        for(var i = 0; i < frame.gestures.length; i++) {
          var gesture = frame.gestures[i];
          if (gesture.type == "screenTap") {
            console.log("screenTap");
            screens[0].enlarge3();
          }
        }
      }
      // using pinch strength to enlarge screen      
      if (frame.hands.length > 0) {
        for (var i = 0; i < frame.hands.length; i++) {
          var hand = frame.hands[i];
          // if there are five good readings, enlarge the screen with enlarge2()
          if (pinchSet.length > 5) {
            screens[0].reduce2();
            debugstring = "<br />success reduce2 " + pinchSet[0] + " " + pinchSet[1] + " " + pinchSet[2] + " " + pinchSet[3] + " " + pinchSet[4] + "<br />";          
            while(pinchSet.length > 0) {
              pinchSet.pop();
            }
          }
          else if (hand.pinchStrength.toPrecision(2) !== 0.0 && hand.pinchStrength.toPrecision(2) != 1.0) {
            // record first reading if the set is empty
            if (pinchSet.length === 0) {
              pinchSet[0] = hand.pinchStrength.toPrecision(2);
              debugstring = "first" + pinchSet[pinchSet.length - 1] + " ";
            }
            else if (pinchSet.length > 0 && Math.abs(hand.pinchStrength.toPrecision(2) - pinchSet[pinchSet.length - 1]) > 0.1) {
              debugstring = hand.pinchStrength.toPrecision(2) + " ";
              // discard if the reading is either 0.0 or 1.0, as they are common occurances in testing
              // if (hand.pinchStrength.toPrecision(2) == 0.0 || hand.pinchStrength.toPrecision(2) == 1.0) {

              // }
              // case when the pinchstrength is smaller than the previous one
              // i.e. it's not pinching outward and all readings are discarded
              if (hand.pinchStrength.toPrecision(2) < pinchSet[pinchSet.length - 1]) {
                while(pinchSet.length > 0) {
                  pinchSet.pop();
                }
                debugstring += "reset <br />"; 
              }
              // case when the frame pinchstrength is larger than the previous one
              // i.e. the fingers are pinching out
              else {
                pinchSet[pinchSet.length] = hand.pinchStrength.toPrecision(2);
                debugstring += "record ";     
              }            
            }        
          }
        }
      }
      gestureOutput.innerHTML += debugstring;
    }
  }

  else if (screens[0].state == 3) {
   var debugstring = "";
   if (frame.valid) {
    if (frame.gestures.length > 0) {      
      for (var i = 0; i < frame.gestures.length; i++) {
        var gesture = frame.gestures[i];
        if(gesture.type == "swipe") {
            //Classify swipe as either horizontal or vertical
            var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
            //Classify as right-left or up-down
            var swipeDirection;
            if(isHorizontal){
              if(gesture.direction[0] > 0){
                swipeDirection = "right";
              } 
              else {
                swipeDirection = "left";
              }
            } 
            else { //vertical
              if(gesture.direction[1] > 0){
                swipeDirection = "up";
              } 
              else {
                swipeDirection = "down";
              }                 
            }
            console.log(swipeDirection);
            screens[0].pantilt(swipeDirection);
          }
        }
      }
      // back to full screen mode
      if (frame.gestures.length > 0) {
        for(var i = 0; i < frame.gestures.length; i++) {
          var gesture = frame.gestures[i];
          // using swipe/ circle gesture to enlarge screen
          if (gesture.type == "keyTap") {
            console.log("keyTap");
            screens[0].reduce3();
          }
        }
      }
    }
  }
});

ctl.setBackground(true);

// helpers function for the leap statistics
function vectorToString(vector, digits) {
  if (typeof digits === "undefined") {
    digits = 1;
  }
  return "(" + vector[0].toFixed(digits) + ", " + vector[1].toFixed(digits) + ", " + vector[2].toFixed(digits) + ")";
}

function togglePause() {
  paused = !paused;

  if (paused) {
    document.getElementById("pause").innerText = "Resume";
  } else {
    document.getElementById("pause").innerText = "Pause";
  }
}

function pauseForGestures() {
  if (document.getElementById("pauseOnGesture").checked) {
    pauseOnGesture = true;
  } else {
    pauseOnGesture = false;
  }
}
