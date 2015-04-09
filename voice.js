// voice control
// flickr album: https://www.flickr.com/photos/40812391@N07/sets/72157651267567745/
// available keywords: hkust, atrium, california, car park, jasmine ng, koala tang
// raymond api key: 2e1114d55ba07373636c39530b58e7c5, setid = 72157651267567745, userid = 40812391@N07
// jasmine api key: 83067725446bbd03aa614fb6114302ce, setid = 72157651301395002, userid = 130057464@N07
"use strict";
if (annyang) {
  var key = "83067725446bbd03aa614fb6114302ce";
  var setid = "72157651301395002";
  var userid = "130057464@N07";
  var tagArray = [];
  var i = 0;      
  var photoIDAndPhotoURLArray = new Array(); // [photoID, photoURL]

  var showImage = function(tag) {
    $('#voiceMsg p').text('Searching for ' + tag);
    tagArray = tag.split(" ");
    $.each(tagArray, function(j, item) {
      tagArray[j] = item.toLowerCase();
    });
    var flickrGetAllContent = "//api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=" + key + "&photoset_id=" + setid + "&user_id=" + userid + "&format=json&jsoncallback=?"; //&callback=jsonFlickrApi";

    $.getJSON(flickrGetAllContent, function(data) {        
      //loop through the results with the following function
      $.each(data.photoset.photo, function(k,item) {        
        //build the url of the photo in order to link to it
        var photoURL = '//farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
        
        //turn the photo id into a variable
        var photoID = item.id;                

        //use another ajax request to get the tags of the image
        var flickrGetPhotoInfo = "//api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + key + "&photo_id=" + photoID + "&format=json&jsoncallback=?"; 
        $.getJSON(flickrGetPhotoInfo, function(data) {              
          //if the image has tags
          if(data.photo.tags.tag !== '') {
            $.each(data.photo.tags.tag, function(j, item) {
              if ($.inArray(item.raw.toLowerCase(), tagArray) > -1 && i < 9) {
                boxes[i].img.src = photoURL;
                i++;
                return false;
              }
            });
          }                        
        }); 
        if (i > 8) {
          return false;
        }   
      });
    });
    $('#voiceMsg p').fadeOut('slow');
    i = 0;
  };

  var commands = {
    //msg to be recognized
    //'*abc': showImage,
    'show me *place': showImage
  };
  annyang.debug();
  annyang.addCommands(commands);
  annyang.start();    
}
else {
  $(document).ready(function() {
    $('#unsupported').fadeIn('fast');
  });
}