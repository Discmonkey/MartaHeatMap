/**
 * Created by maxg on 10/29/16.
 */
console.log('here')
var myLatlng = new google.maps.LatLng(33.7490, -84.3880);
    // map options,
var myOptions = {
    zoom: 10,
    maxZoom: 20, // for zooming in
    minZoom: 9, // for zooming out
    center: myLatlng
};
console.log('here');
var marker;
// standard map
map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
// heatmap layer
console.log('here');
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
            valueField: 'count'
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

var testData = {
    max: 0,
    data: [{lat: 33.7707, lng: -84.4141, count: 1990},{lat: 33.7707, lng: -84.39670000000001, count: 1664},{lat: 33.7707, lng: -84.3793, count: 1969},{lat: 33.7707, lng: -84.3619, count: 2119},{lat: 33.7707, lng: -84.34450000000001, count: 1707},{lat: 33.7707, lng: -84.3271, count: 2101},{lat: 33.7562, lng: -84.4141, count: 694},{lat: 33.7562, lng: -84.39670000000001, count: 306},{lat: 33.7562, lng: -84.3793, count: 742},{lat: 33.7562, lng: -84.3619, count: 1225},{lat: 33.7562, lng: -84.34450000000001, count: 1378},{lat: 33.7562, lng: -84.3271, count: 925},{lat: 33.741699999999994, lng: -84.4141, count: 1503},{lat: 33.741699999999994, lng: -84.39670000000001, count: 951},{lat: 33.741699999999994, lng: -84.3793, count: 673},{lat: 33.741699999999994, lng: -84.3619, count: 1248},{lat: 33.741699999999994, lng: -84.34450000000001, count: 1592},{lat: 33.741699999999994, lng: -84.3271, count: 1151},{lat: 33.727199999999996, lng: -84.4141, count: 1758},{lat: 33.727199999999996, lng: -84.39670000000001, count: 1663},{lat: 33.727199999999996, lng: -84.3793, count: 1222},{lat: 33.727199999999996, lng: -84.3619, count: 953},{lat: 33.727199999999996, lng: -84.34450000000001, count: 1931},{lat: 33.727199999999996, lng: -84.3271, count: 1806},{lat: 33.7127, lng: -84.4141, count: 2118},{lat: 33.7127, lng: -84.39670000000001, count: 1972},{lat: 33.7127, lng: -84.3793, count: 1253},{lat: 33.7127, lng: -84.3619, count: 1605},{lat: 33.7127, lng: -84.34450000000001, count: 1702},{lat: 33.7127, lng: -84.3271, count: 1844},{lat: 33.6982, lng: -84.4141, count: 2292},{lat: 33.6982, lng: -84.39670000000001, count: 2304},{lat: 33.6982, lng: -84.3793, count: 1724},{lat: 33.6982, lng: -84.3619, count: 2378},{lat: 33.6982, lng: -84.34450000000001, count: 2343},{lat: 33.6982, lng: -84.3271, count: 2399}]
};
heatmap.setData(testData);
