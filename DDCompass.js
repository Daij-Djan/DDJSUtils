/*
2014 Dominik Pich
*/
//
// DDCompass
// based on http://null-byte.wonderhowto.com/how-to/hack-together-accelerometer-aware-mobile-website-by-accessing-motion-sensors-javascript-0134154/
//
function DDCompass() {
    "use strict";

    var compass = this;
    window.addEventListener("deviceorientation", function (e) {
         var heading;

         if (event.webkitCompassHeading != undefined) { 
             heading = (360 - event.webkitCompassHeading);
         } else if (event.alpha != null) {
             heading =  event.alpha; 
         } else {
             heading = null;
         } 
        
         $(compass).trigger('headingChanged', [heading]);
    }, false);
}

var _deviceCompass = undefined;
DDCompass.getDeviceCompass = function() {
    if (!window.DeviceOrientationEvent) {
        return null;
    }
    
    if(_deviceCompass === undefined) {
        _deviceCompass = new DDCompass();
    }
    return _deviceCompass;
}