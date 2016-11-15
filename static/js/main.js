/**
 * Created by maxg on 10/29/16.
 */
var rectangle;
var myLatlng = new google.maps.LatLng(33.7490, -84.3880);
    // map options,
var currentLatlng = {
    lat: 33.7490,
    lng: -84.3880
};

var myOptions = {
    zoom: 13,
    maxZoom: 16, // for zooming in
    minZoom: 11, // for zooming out
    center: myLatlng
};

var marker;
// standard map
map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
 //heatmap layer


heatmap = new HeatmapOverlay(map,
        {
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            "radius": 0.02,
            "maxOpacity": 0.4,
            // scales the radius based on map zoom
            "scaleRadius": true,
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": true,
            // which field name in your data represents the latitude - default "lat"
            latField: 'lat',
            // which field name in your data represents the longitude - default "lng"
            lngField: 'lng',
            // which field name in your data represents the data value - default "value"
            valueField: 'count',
            //make everything above 90min red
            max: '5400'
        }
);

google.maps.event.addListener(map, 'click', function (event) {
    <!-- for reverse geocoding -->
    placeMarker(event.latLng);
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();
    console.log(latitude);
    console.log(longitude);
});
function placeMarker(location) {
    if (marker) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
}
// Create the search box and link it to the UI element.
var input = document.getElementById("pac-input");
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
// Bias the SearchBox results towards current map's viewport.
map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
});
var markers = [];
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener('places_changed', function () {
    var place = searchBox.getPlaces()[0]; // gets first result if there are multiple
    if (place == null || place.length == 0) {
        return;
    }
    // Clear out the old markers.
    markers.forEach(function (marker) {
        marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    // var bounds = new google.maps.LatLngBounds();

    if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
    }

    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();

    // if searchBar location is out of bounds, sets marker and lat/lng to center of ATL
    if (place.geometry.location.lat() > allowedBounds.getNorthEast().lat()
            || place.geometry.location.lat() < allowedBounds.getSouthWest().lat()
            || place.geometry.location.lng() > allowedBounds.getNorthEast().lng()
            || place.geometry.location.lng() < allowedBounds.getSouthWest().lng()) {
        lat = myLatlng.lat();
        lng = myLatlng.lng();
        placeMarker(myLatlng);
        map.panTo(myLatlng);
    } else {
        placeMarker(place.geometry.location);
        currentLatlng.lat = place.geometry.location.lat()
        currentLatlng.lng = place.geometry.location.lng()
    }
    console.log("lat: " + lat + " lng: " + lng)
    // <!-- if (place.geometry.viewport) { -->
    // <!-- bounds.union(place.geometry.viewport); -->
    // <!-- } else { -->
    // <!-- bounds.extend(place.geometry.location); -->
    // <!-- } -->
    // <!-- map.fitBounds(bounds); -->

});

// Makes sure the map doesn't stray too far away from ATL
google.maps.event.addListener(map, 'center_changed', function () {
    checkBounds();
});

var allowedBounds = new google.maps.LatLngBounds(new google.maps.LatLng(33.535, -84.68), new google.maps.LatLng(34.03, -84.037));

function checkBounds() {
    if (!allowedBounds.contains(map.getCenter())) {
        var C = map.getCenter();
        var X = C.lng();
        var Y = C.lat();

        var AmaxX = allowedBounds.getNorthEast().lng();
        var AmaxY = allowedBounds.getNorthEast().lat();
        var AminX = allowedBounds.getSouthWest().lng();
        var AminY = allowedBounds.getSouthWest().lat();

        if (X < AminX) {
            X = AminX;
        }
        if (X > AmaxX) {
            X = AmaxX;
        }
        if (Y < AminY) {
            Y = AminY;
        }
        if (Y > AmaxY) {
            Y = AmaxY;
        }

        map.setCenter(new google.maps.LatLng(Y, X));
    }
}
function getHeatMap() {
    $('#button-text').hide();
    $('.fa-spinner').show()
    console.log("lat", currentLatlng.lat);
    console.log("lng", currentLatlng.lng);
    $.post({
            url: '/getMap',
            data: {
                lat: currentLatlng.lat,
                lng: currentLatlng.lng,
                length: 3 //parseInt($('#lengths').val())
            }
        }
    ,function(data) {
        $('#button-text').show();
        $('.fa-spinner').hide();
        var testData = {
            max: 0,
            data: data['heatmap']
        };
        heatmap.setData(testData);
        map.setCenter(new google.maps.LatLng(currentLatlng.lat, currentLatlng.lng));
        var top_left = data['top_left'];
        var bottom_right = data['bottom_right'];

        if (rectangle) {
            rectangle.setMap(null);
        }
        rectangle = new google.maps.Rectangle({
           strokeColor: '#ff7500',
           strokeOpacity: 1,
           strokeWeight: 0,
           fillColor: '#222',
           fillOpacity: 0.95,
           map: map,
           bounds: {
             north: bottom_right[0],
             south: top_left[0],
             west:  bottom_right[1],
             east: top_left[1]
           }
        });
    })
}

google.maps.event.addListenerOnce(map, 'idle', function(){
  //loaded fully

 $('#pac-input').after($('#MapButton'));

});
