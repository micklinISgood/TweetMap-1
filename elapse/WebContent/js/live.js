
function Golive () {

	resetMap();
    cleanGeoMarkers();
    clearMarkers();
    index = 0;
    for (var i = 0; i <  live_m.length; i++) {
          live_m[i].setMap(map);
          live_m[i].setAnimation(google.maps.Animation.DROP);

     }

}
