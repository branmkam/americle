// Creating map options
var mapOptions = {
   center: [38, -96],
   zoom: 5
}

// Creating a map object
var map = new L.map('map', mapOptions);

// Creating a Layer object
var layer =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
        '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 5
}).addTo(map);

window.map = map;

//Add marker
var circle = L.circleMarker(L.latLng(38, -96), {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 5
}).addTo(map);
circle.bindPopup("I am a circle.").addTo(map);