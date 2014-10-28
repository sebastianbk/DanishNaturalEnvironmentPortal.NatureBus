/// <reference path="jquery-2.1.0-vsdoc.js" />
/// <reference path="Microsoft.Maps-vsdoc.js" />

var map = new Microsoft.Maps.Map(document.getElementById('map'), {
    credentials: "Al2U6WGyqjAdPM5tKRwHofbHAMIIMCLpLWbYn7mgDIFUEZSqa-o-osVooiQ6xDOf",
    mapTypeId: Microsoft.Maps.MapTypeId.birdseye,
    zoom: 15,
    center: new Microsoft.Maps.Location(47, -122)
});

var angle = 0;

function getNewLocation(distance, location, moveAngle) {
    var latitude = location.latitude;
    var longitude = location.longitude;
    var distanceNorth = Math.sin(moveAngle) * distance;
    var distanceEast = Math.cos(moveAngle) * distance;
    var earthRadius = 6371000;
    var newLatitude = latitude + (distanceNorth / earthRadius) * 180 / Math.PI;
    var newLongitude = longitude + (distanceEast / (earthRadius * Math.cos(newLatitude * 180 / Math.PI))) * 180 / Math.PI;

    var result = new Microsoft.Maps.Location(newLatitude, newLongitude);
    //console.log(result);
    return result;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setMapCenter);
    } else {
        alert("Geolocation is not supported by this browser. Please move to your current location manually.");
    }
}

function setMapCenter(position) {
    var newCenter = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
    //console.log(newCenter);
    map.setView({ center: newCenter, zoom: 15, animate: true });
}

function turnArrow(newAngle) {
    angle += newAngle;
    var degrees = 90 + angle;
    $("#arrow").css("transform", "rotate(" + degrees + "deg)");
}

function loadData(latitude, longitude) {
    $.ajax({
        url: "http://dmpservices.azurewebsites.net/api/species/?latitude=" + latitude + "&longitude=" + longitude + "&radiusInMeters=500",
        success: function (data) {
            var json = JSON.parse(data);

            for (var species in json) {
                console.log(species);
            }
        }
    });
}

function move(distance, direction) {
    var moveAngle = angle + direction;
    if (moveAngle < 0) {
        moveAngle = 360 + moveAngle;
    }
    console.log(moveAngle);
    var result = getNewLocation(distance, map.getCenter(), moveAngle)
    map.setView({ center: result, zoom: 15, animate: true });
    //loadData(result.latitude, result.longitude);
}

function initPins() {
    map.entities.clear();

    $.getJSON("/data/dummy.txt", function(json) {
        for (var species in json) {
            //console.log(json[species]);
            var pushpinOptions = { width: null, height: null, htmlContent: "<div style='font-family:Arial;color:black;font-size:14px;font-weight:bold;border:1px solid #999;background-color:white;padding:2px;'>" + json[species].Name + "</div>" };
            var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(json[species].FallbackLatitude, json[species].FallbackLongitude), pushpinOptions);
            //console.log(pushpin);
            map.entities.push(pushpin);
        }
    });
}

getLocation();
initPins();

$(document).keypress(function (event) {
    switch (event.keyCode) {
        case 119:
            // w
            move(10, 90);
            break;
        case 97:
            // a
            move(10, 0);
            break;
        case 100:
            // d
            move(10, 180);
            break;
        case 115:
            // s
            move(10, 270);
            break;
        case 113:
            // q
            turnArrow(-10);
            break;
        case 101:
            // e
            turnArrow(10);
            break;
    }
});