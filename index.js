

/*function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 40.7282, lng: -73.7949},
        zoom: 13,
    });*/


    /*map.data.loadGeoJson('Queens_Walkability.json');
    map.data.setStyle({visible: false});
    map.data.setStyle({
        strokeColor: 'green',
        strokeWeight: 1
    }) */

var map = null;
var circle;
var markers_on_map = [];
var geocoder;
var infowindow;

//all_locations is just a sample, you will probably load those from database

var all_locations = [];
var queens_locations = [];
var bronx_locations = [];




//initialize map on document ready
function initMap(){
    var latlng = new google.maps.LatLng(40.723080, -73.984340); //you can use any location as center on map startup
    var myOptions = {
        zoom: 10,
        center: latlng,
        mapTypeControl: true,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    //var markers = [];




    /*$(document).ready(function(){
        $.getJSON("Queens_Walkability.json", function(queens){
            all_locations = queens.features;
            //all_locations.pushArray(queens_locations);
        }).fail(function(){
            document.write("An error has occurred.");
        });
    });*/



    $(document).ready(function(){
        $.getJSON("Bronx_walkability.json", function(bronx){
             all_locations = bronx.features;
            //all_locations.pushArray(bronx_locations);
        }).fail(function(){
            document.write("An error has occurred.");
        });
    });

    /*$(document).ready(function(){
        $.getJSON("Bronx_walkability.json", function(bronx){
            all_locations = bronx.features;
            //all_locations.pushArray(bronx_locations);
        }).fail(function(){
            document.write("An error has occurred.");
        });
    });*/



    //all_locations = queens_locations.extend(bronx_locations);



    geocoder = new google.maps.Geocoder();
    google.maps.event.addListener(map, 'click', function(){
        if(infowindow){
            infowindow.setMap(null);
            infowindow = null;
        }
    });

    var input = document.getElementById('address');
    var autocomplete = new google.maps.places.Autocomplete(input);

};

function showCloseLocations() {
    var i;
    var range = $('#range').val();
    var address = $('#address').val();

    //remove all radii and markers from map before displaying new ones
    if (circle) {
        circle.setMap(null);
        circle = null;
    }
    for (i = 0; i < markers_on_map.length; i++) {
        if (markers_on_map[i]) {
            markers_on_map[i].setMap(null);
            markers_on_map[i] = null;
        }
    }

    if (geocoder) {
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                    var address_lat_lng = results[0].geometry.location;
                    circle = new google.maps.Circle({
                        center: address_lat_lng,
                        radius: range * 1000,
                        clickable: false,
                        map: map
                    });
                    if (circle) map.fitBounds(circle.getBounds());
                    for (var j = 0; j < all_locations.length; j++) {
                        (function (location) {
                            var marker_lat_lng = new google.maps.LatLng(location["geometry"]["coordinates"][0][0][1], location["geometry"]["coordinates"][0][0][0]);
                            var distance_from_location = google.maps.geometry.spherical.computeDistanceBetween(address_lat_lng, marker_lat_lng); //distance in meters between your location and the marker
                            if (distance_from_location <= range * 1000) {
                                var new_marker = new google.maps.Marker({
                                    position: marker_lat_lng,
                                    map: map,
                                    title: location.properties["beauty_n"]
                                });                             google.maps.event.addListener(new_marker, 'click', function () {
                                    if(infowindow){
                                        infowindow.setMap(null);
                                        infowindow = null;
                                    }
                                    infowindow = new google.maps.InfoWindow(
                                        { content: '<div style="color:red">'+location.properties.uid +'</div>' + " is " + distance_from_location + " meters from my location",
                                            size: new google.maps.Size(150,50),
                                            pixelOffset: new google.maps.Size(0, -30)
                                            , position: marker_lat_lng, map: map});
                                });
                                markers_on_map.push(new_marker);
                            }
                        })(all_locations[j]);
                    }
                } else {
                    alert("No results found while geocoding!");
                }
            } else {
                alert("Geocode was not successful: " + status);
            }
        });
    }
}







/*

    $(document).ready(function () {
        $.getJSON("Manhattan_Walkability.json", function (data) {
            let markers = data.features;
            for (let i = 0; i < 50; i++) {
                markers[i].setMap(null);
                let score = markers[i].properties["beauty_n"];
                let latitude = markers[i]["geometry"]["coordinates"][0][0][1];
                let longitude = markers[i]["geometry"]["coordinates"][0][0][0];
                dropMarker(latitude, longitude, score);
            }

            function dropMarker(lat, lng, score) {
                let location = {lat: lat, lng: lng};
                let contentString = "<h4>" + score + "</h4>";
                let infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
                let marker = new google.maps.Marker({position: location, map: map, title: score});
                marker.addListener('click', function () {
                    infoWindow.open(map, marker);
                });

            }
        }).fail(function () {
            document.write("An error has occurred.");
        });
    });

    $(document).ready(function () {
        $.getJSON("Brooklyn_Walkability.json", function (data) {
            let markers = data.features;
            for (let i = 0; i < 50; i++) {
                markers[i].setMap(null);
                let score = markers[i].properties["beauty_n"];
                let latitude = markers[i]["geometry"]["coordinates"][0][0][1];
                let longitude = markers[i]["geometry"]["coordinates"][0][0][0];
                dropMarker(latitude, longitude, score);
            }

            function dropMarker(lat, lng, score) {
                let location = {lat: lat, lng: lng};
                let contentString = "<h4>" + score + "</h4>";
                let infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
                let marker = new google.maps.Marker({position: location, map: map, title: score});
                marker.addListener('click', function () {
                    infoWindow.open(map, marker);
                });

            }
        }).fail(function () {
            document.write("An error has occurred.");
        });
    });

    $(document).ready(function () {
        $.getJSON("StatenIsland_Walkability.json", function (data) {
            let markers = data.features;
            for (let i = 0; i < 50; i++) {
                markers[i].setMap(null);
                let score = markers[i].properties["beauty_n"];
                let latitude = markers[i]["geometry"]["coordinates"][0][0][1];
                let longitude = markers[i]["geometry"]["coordinates"][0][0][0];
                dropMarker(latitude, longitude, score);
            }

            function dropMarker(lat, lng, score) {
                let location = {lat: lat, lng: lng};
                let contentString = "<h4>" + score + "</h4>";
                let infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
                let marker = new google.maps.Marker({position: location, map: map, title: score});
                marker.addListener('click', function () {
                    infoWindow.open(map, marker);
                });

            }
        }).fail(function () {
            document.write("An error has occurred.");
        });
    });

    $(document).ready(function () {
        $.getJSON("Bronx_walkability.json", function (data) {
            let markers = data.features;
            for (let i = 0; i < 50; i++) {
                markers[i].setMap(null);
                let score = markers[i].properties["beauty_n"];
                let latitude = markers[i]["geometry"]["coordinates"][0][0][1];
                let longitude = markers[i]["geometry"]["coordinates"][0][0][0];
                dropMarker(latitude, longitude, score);
            }

            function dropMarker(lat, lng, score) {
                let location = {lat: lat, lng: lng};
                let contentString = "<h4>" + score + "</h4>";
                let infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
                let marker = new google.maps.Marker({position: location, map: map, title: score});
                marker.addListener('click', function () {
                    infoWindow.open(map, marker);
                });

            }
        }).fail(function () {
            document.write("An error has occurred.");
        });
    });

//}
*/