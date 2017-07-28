/*
 2014 Dominik Pich
 */
//
// DDMiscHelpers Functions
//
var DDMiscHelpers = DDMiscHelpers || {};

//
// DDMiscHelpers.hashCodeFromString
//
// makes a hashcode from a string
//
DDMiscHelpers.hashCodeFromString = function(s) {
    "use strict";

    function reduceMethod(a,b){
        /* jshint ignore:start */
        a = ((a<<5)-a) + b.charCodeAt(0);
        return a&a;
        /* jshint ignore:end */
    }
    
    return s.split("").reduce(reduceMethod,0);
};

//
// DDMiscHelpers.isoDuration
//
// the function returns an iso DURATION for a time Str hh:mm (e.g. PT30M for 0:30)
//
DDMiscHelpers.isoDuration = function(timeStr) {
    var comps = timeStr.split(":");
    var hours = parseInt(comps[0]);
    var minutes = parseInt(comps[1]);

    if(hours > 0 && minutes > 0) {
        return "PT"+hours+"H"+minutes+"M";
    }
    else if(hours > 0) {
        return "PT"+hours+"H";
    }
    else {
        return "PT"+minutes+"M";
    }
}

//
// DDMiscHelpers.getParameterByName
//
// the function returns an url query parameter by name
//
DDMiscHelpers.getParameterByName = function(name, url) {
   "use strict"
 
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//
// DDMiscHelpers.copyInputValuesFromID
//
// the function return associative array with inputs' values under the DOM element with the id 'form'
//
DDMiscHelpers.copyInputValuesFromID = function(form) {
    "use strict";

    // get all the inputs into an array.
    var $inputs = $('#'+form+' :input');

    // get an associative array of just the values.
    var values = {};
    $inputs.each(function() {
        var store = true;
        
        //skip unchecked radios or checkboxes
        if($(this).attr('type') === "checkbox" || $(this).attr('type') === "radiobutton") {
            if(!($(this).prop("checked"))) {
                store = false;
            }
        }
                
        if(store) {
            if(values[this.name] === undefined) {
                values[this.name] = $(this).val();
            }
            else {
                values[this.name] = "" + values[this.name] + "|" + $(this).val();
            }
        }
    });
    return values;
};

//
// DDMiscHelpers.addTimeToDate
//
DDMiscHelpers.addTimeToDate = function(date, timeStr) {
    "use strict";

    var comps = timeStr.split(":");
    date.setTime(date.getTime() + (comps[0]*60*60*1000));
    date.setTime(date.getTime() + (comps[1]*60*1000));
    
    return date;
};

//
// DDMiscHelpers.sizeOfAssociativeArray
//
DDMiscHelpers.sizeOfAssociativeArray = function(obj) {
    "use strict";

    if(obj.length === undefined) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size+=1;
            }
        }
        return size;
    }
    else {
        return obj.length;
    }
};

//
// DDMiscHelpers.checkValuesAreSet
//
// obj must be an associative array with values being strings :D this function will then return true if ALL values are set
//
DDMiscHelpers.checkValuesAreSet = function(obj) {
    "use strict";

    var key;
    for (key in obj) {
        if (key.length && obj.hasOwnProperty(key)) {
            if(obj[key].length===0) {
                return false;
            }
        }
    }
    return true;
};

//
// DDMiscHelpers.areDatesOverlapping
//
// check if two date ranges overlap, start, end & start2, end2
//
DDMiscHelpers.areDatesOverlapping = function(e1, e1b, e2, e2b) {
    "use strict";

    var e1start = e1.getTime();
    var e1end = e1b.getTime();
    var e2start = e2.getTime();
    var e2end = e2b.getTime();

    return ((e1start <= e2end) && (e1end >= e2start));
};

//
// DDMiscHelpers.showDialog
//
// show an alert view or a confirmation via jquery dialog
//
DDMiscHelpers.showDialog = function(title, msg, okButtonTitle, okFunction, alternateButtonTitle, alternateFunction) {
    "use strict";

    var buttons = [];
    
    //add ok
    buttons.push({
        text: okButtonTitle,
        click: function() {
            if(okFunction) {
                okFunction();
            }
            $( this ).dialog( "close" );
        }
    });

    //add alternate if there is a title specified
    if(alternateButtonTitle) {
        buttons.push({
            text: alternateButtonTitle,
            click: function() {
                if(alternateFunction) {
                    alternateFunction();
                }
                $( this ).dialog( "close" );
            }
        });
    }
        
    $('#controller').append('<div id="dialog" title="'+title+'">'+msg+'</div>');
    $('#dialog').dialog({
        autoOpen: true,
        dialogClass: "no-close",
        buttons: buttons,
        close: function( event, ui ) {
            $( "#dialog" ).remove();
        }
    });
};

//
// DDMiscHelpers.makeScrollableTable
//
DDMiscHelpers.makeScrollableTable = function(selector) {
    "use strict";

    function updateTableHeaders() {
        $("div.divTableWithFloatingHeader").each(function() {
            var originalHeaderRow = $(".tableFloatingHeaderOriginal", this);
            var floatingHeaderRow = $(".tableFloatingHeader", this);
            var offset = $(this).offset();
            var scrollTop = $(window).scrollTop();
            if ((scrollTop > offset.top) && (scrollTop < offset.top + $(this).height())) {
                floatingHeaderRow.css("visibility", "visible");
                floatingHeaderRow.css("top", Math.min(scrollTop - offset.top, $(this).height() - floatingHeaderRow.height()) + "px");

                // Copy cell widths from original header
                $("th", floatingHeaderRow).each(function(index) {
                    var cellWidth = $("th", originalHeaderRow).eq(index).css('width');
                    $(this).css('width', cellWidth);
                });

                // Copy row width from whole table
                floatingHeaderRow.css("width", $(this).css("width"));
            }
            else {
                floatingHeaderRow.css("visibility", "hidden");
                floatingHeaderRow.css("top", "0px");
            }
        });
    }
    
    $(selector).each(function() {
        $(this).wrap("<div class=\"divTableWithFloatingHeader\" style=\"position:relative\"></div>");

        var originalHeaderRow = $("tr:first", this);
        originalHeaderRow.before(originalHeaderRow.clone());
        var clonedHeaderRow = $("tr:first", this);

        clonedHeaderRow.addClass("tableFloatingHeader");
        clonedHeaderRow.css("position", "absolute");
        clonedHeaderRow.css("top", "0px");
        clonedHeaderRow.css("left", $(this).css("margin-left"));
        clonedHeaderRow.css("visibility", "hidden");
        clonedHeaderRow.css("z-index", "9");
        originalHeaderRow.addClass("tableFloatingHeaderOriginal");
    });
    updateTableHeaders();
    if(!DDMiscHelpers.makeScrollableTable.first) {
        $(window).scroll(updateTableHeaders);
        $(window).resize(updateTableHeaders);
        DDMiscHelpers.makeScrollableTable.first = true;
    }
};
