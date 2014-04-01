/*
2014 Dominik Pich
*/
//
// DDGPSDistance
//
// expresses the distance betwwen to points
// loosly based on http://pietschsoft.com/post/2008/02/Calculate-Distance-Between-Geocodes-in-C-and-JavaScript
//
function DDGPSDistance(pos1, pos2) {
    "use strict";

    //
    // toRadian
    //
    // helper function to convert deg to rad
    //
    this.toRadian = function(v) {
        return v * (Math.PI / 180);
    };

    //
    // diffDegrees
    //
    // helper function to get the delta between to degrees given in DEG
    //
    this.diffDegrees = function(v1, v2) {
        return this.toRadian(v2) - this.toRadian(v1);
    };

    //
    // distanceBetweenRaw
    //
    // calculates the distance (in meters) between to locations specified by their lat & lon
    //
    this.distanceBetweenRaw = function(lat1, lng1, lat2, lng2) {
//      var EarthRadiusInMiles = 3956.0;
        var EarthRadiusInKilometers = 6367.0;
        var radius = EarthRadiusInKilometers;
        return radius * 2 * Math.asin(Math.min(1, Math.sqrt((Math.pow(Math.sin((this.diffDegrees(lat1, lat2)) / 2.0), 2.0) + Math.cos(this.toRadian(lat1)) * Math.cos(this.toRadian(lat2)) * Math.pow(Math.sin((this.diffDegrees(lng1, lng2)) / 2.0), 2.0)))));
    };

    //instance vars
    this.position1 = pos1;
    this.position2 = pos2;
    this.distance = this.distanceBetweenRaw(pos1.latitude, pos1.longitude, pos2.latitude, pos2.longitude);
}