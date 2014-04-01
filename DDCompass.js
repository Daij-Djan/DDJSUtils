/*
2014 Dominik Pich
*/
//
// DDCompass
//
function DDCompass() {
    "use strict";

    var compass = this;
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", function (e) {
            var deg = (e.alpha);
            $(compass).trigger('headingChanged', [deg]);
        }, false);
        return this;
    }
    else {
        return null;
    }
}

var _deviceCompass = undefined;
DDCompass.getDeviceCompass = function() {
    if(_deviceCompass === undefined) {
        _deviceCompass = new DDCompass();
    }
    return _deviceCompass;
}