
var map = null;
var circle;
var markers_on_map = [];
var geocoder;
var infowindow;

//all_locations is just a sample, you will probably load those from database
//stat island and queens dont work
var all_locations = [];
var bronx_locations = [];
var brooklyn_locations = [];
var manhattan_locations = [];
var queens_locations = [];
var statenIsland_locations = [];

//initialize map on document ready
function initMap(){
    var latlng = new google.maps.LatLng(40.723080, -73.984340); //you can use any location as center on map startup
    var myOptions = {
        zoom: 10,
        center: latlng,
        mapTypeControl: true,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
            stylers: [{
                saturation: -70
            }]
        }]
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);

    $(document).ready(function(){
        $.getJSON("Bronx_walkability.json", function(bronx){
            bronx_locations = bronx.features;
        }).fail(function(){
            document.write("An error has occurred.");
        });
    });

    $(document).ready(function(){
        $.getJSON("Brooklyn_Walkability.json", function(brooklyn){
            brooklyn_locations = brooklyn.features;
        }).fail(function(){
            document.write("An error has occurred.");
        });
    });

    $(document).ready(function(){
        $.getJSON("Manhattan_Walkability.json", function(manhattan){
            manhattan_locations = manhattan.features;
        }).fail(function(){
            document.write("An error has occurred.");
        });
    });

    $(document).ready(function(){
        $.getJSON("Queens_Walkability.json", function(queens){
            queens_locations = queens.features;
        }).fail(function(){
            document.write("An error has occurred.");
        });
    });

    $(document).ready(function(){
        $.getJSON("StatenIsland_Walkability.json", function(statenIsland){
            statenIsland_locations = statenIsland.features;
        }).fail(function(){
            document.write("An error has occurred.");
        });
    });

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
    all_locations = all_locations.concat(bronx_locations, brooklyn_locations,
        manhattan_locations, queens_locations, statenIsland_locations);
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
            if (status === google.maps.GeocoderStatus.OK) {
                if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
                    var address_lat_lng = results[0].geometry.location;
                    /*var circleOptions = {
                        styles: [{

                            featureType: "water",
                            elementType: "geometry.fill",
                            stylers: [
                                { color: "#00008B" }
                                ]


                        }]
                    }*/
                    circle = new google.maps.Circle({
                        center: address_lat_lng,
                        radius: range * 1000,
                        fillColor: '#F5F5F5',
                        strokeColor: '#528BE2',
                        zIndex: 1,
                        map: map,
                        //options: circleOptions,
                        styles: [
                            {
                                featureType: "all",
                                elementType: "all",
                                stylers: [
                                    { saturation: 40 }
                                ]
                            },{
                                featureType: "road.highway",
                                elementType: "geometry",
                                stylers: [
                                    { hue: "#ff1100" },
                                    { gamma: 1 },
                                    { lightness: 30 },
                                    { saturation: -20 }
                                ]
                            },{
                                featureType: "administrative.locality",
                                elementType: "all",
                                stylers: [
                                    { hue: "#fff700" },
                                    { saturation: 100 },
                                    { lightness: 0 },
                                    { visibility: "on" },
                                    { gamma: 1 }
                                ]
                            },{
                                featureType: "road.arterial",
                                elementType: "geometry",
                                stylers: [
                                    { hue: "#ff9100" },
                                    { lightness: -20 }
                                ]
                            },{
                                featureType: "road",
                                elementType: "labels",
                                stylers: [
                                    { saturation: 10 },
                                    { visibility: "simplified" }
                                ]
                            },{
                                featureType: "poi.park",
                                elementType: "all",
                                stylers: [
                                    { saturation: -20 }
                                ]
                            },
                            {
                                featureType: "water",
                                elementType: "geometry.fill",
                                stylers: [
                                    { color: "#00008B" }
                                ]
                            }
                        ]

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
                                });
                                google.maps.event.addListener(new_marker, 'click', function () {
                                    if(infowindow){
                                        infowindow.setMap(null);
                                        infowindow = null;
                                    }
                                    infowindow = new google.maps.InfoWindow(
                                        { content: '<div style="color:red">'+location.properties.beauty_n +'</div>' + " is " + distance_from_location + " meters from my location",
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