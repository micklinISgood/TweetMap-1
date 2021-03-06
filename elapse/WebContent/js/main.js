


var curr_sec;
var map, heatmap, infowindow, input, geo_marker, red_circle, blue_circle, white_circle ;
var careerarc = [];
var want = [];
var good_morning = [];
var london =[];
var tokyo = [];
var job = [];
var wind = [];
var rain = [];
var love = [];
var turkey = [];
var geo = [];
var all =[];
var live_m =[];
var index = 0;
var keywords =["careerarc",
      "want",
      "good",
      "london",
      "tokyo",
      "job",
      "wind",
      "rain",
      "love",
      "turkey"]
var histroy_data =[];
for(var i=0; i<10 ;i++){
  histroy_data.push(false);
}

var Chat = {};
Chat.socket = null;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: {lat: 25, lng: 0},
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });
  //map.setOptions({styles: styles});
  var s = document.getElementById("curtime");
  s.innerHTML = new Date().toString().substring(0,21);
  curr_sec = new Date().getTime() / 1000;



  Chat.initialize();
  input = document.getElementById('pac-input');
  live = document.getElementById('live');
  live.onclick = Golive;

  infowindow= new google.maps.InfoWindow({
    maxWidth: 150
  });

  geo_marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

 var searchBox = new google.maps.places.SearchBox(input);
 google.maps.event.addListener(searchBox,'places_changed', function(){

    infowindow.close();
    geo_marker.setVisible(false);

    var place = searchBox.getPlaces()[0];

    if (!place.geometry) {
      return;
    }
    if(Chat.socket != null){
      //console.log(place.geometry.location.lat()+""+place.geometry.location.lng());
      var obj = new Object();
      obj.action = "geo_search";
      obj.lat = place.geometry.location.lat();
      obj.lng = place.geometry.location.lng();
      Chat.sendMessage(JSON.stringify(obj));
    }else{
      Chat.initialize();
      return;
    }
    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
    	 map.setCenter(place.geometry.location);
         map.setZoom(3);
      //map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(3);  // Why 17? Because it looks good.
    }
    geo_marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    geo_marker.setPosition(place.geometry.location);
    geo_marker.setVisible(true);
    



    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, geo_marker);
  });
    map.addListener('click', function(e) {
      geo_marker.setPosition(e.latLng);
      map.setZoom(4); 
      map.panTo(e.latLng);
      geo_marker.setVisible(true);
      if(Chat.socket != null){
      //console.log(place.geometry.location.lat()+""+place.geometry.location.lng());
      var obj = new Object();
      obj.action = "geo_search";
      obj.lat = e.latLng.lat();
      obj.lng = e.latLng.lng();
      Chat.sendMessage(JSON.stringify(obj));
      }else{
      Chat.initialize();
      return;
    }
    });
    red_circle ={
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#ff6666',
    strokeColor: '#ff6666',
    scale: 4.5,
    fillOpacity: .8,
    strokeWeight: 1
  };
    white_circle ={
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#ffff66',
    strokeColor: '#ffff66',
    scale: 4.5,
    fillOpacity: .8,
    strokeWeight: 1
  };
    blue_circle ={
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#99d6ff',
    strokeColor: '#99d6ff',
    scale: 4.5,
    fillOpacity: .8,
    strokeWeight: 1
  };
  var legend = document.getElementById('legend');
  var div = document.createElement('div');
  var sv = document.createElement('span');
  sv.style.backgroundColor='#ff6666';
  sv.style.color='#ff6666';
  sv.innerHTML="1";
  div.appendChild(sv);
  div.innerHTML+=" Negative"; 
  legend.appendChild(div);
  var div = document.createElement('div');
  var sv = document.createElement('span');
  sv.style.backgroundColor='#ffff66';
  sv.style.color='#ffff66';
  sv.innerHTML="1";
  div.appendChild(sv);
  div.innerHTML+=" Neutral"; 
  legend.appendChild(div);
  var div = document.createElement('div');
  var sv = document.createElement('span');
  sv.style.backgroundColor='#99d6ff';
  sv.style.color='#99d6ff';
  sv.innerHTML="1";
  div.appendChild(sv);
  div.innerHTML+=" Positive"; 
  legend.appendChild(div);

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
  //console.log(getPoints());

   heatmap = new google.maps.visualization.HeatmapLayer({
     data: [],
     map: map,
     radius: 10
   });

}



Chat.connect = (function(host) {
    if ('WebSocket' in window) {
        Chat.socket = new WebSocket(host);
    } else if ('MozWebSocket' in window) {
        Chat.socket = new MozWebSocket(host);
    } else {
        console.log('Error: WebSocket is not supported by this browser.');
        return;
    }
    Chat.socket.onopen = function () {
         // console.log('Info: WebSocket connection opened.');
       
         
       
    };

    Chat.socket.onclose = function () {
    	
    	Chat.socket = null;
      setTimeout(function() {
        Chat.initialize();
      },60000);
    };

    Chat.socket.onmessage = function (message) {
    	 var action = JSON.parse(message.data);
    	 
    	 if(action["elapse"] != null) plotPoints(action["elapse"]);
    	 if(action["update"] != null) setMarkers(action["update"]);
       if(action["geo_res"] != null) setGeoMarkers(action["geo_res"]);
        // console.log(action);
         
        //Chat.sendMessage(message.data);
        return false;
    };

});
  

Chat.initialize = function() {
    if (window.location.protocol == 'http:') {
        Chat.connect('ws://' + window.location.host + '/elapse/conn');
    } else {
        Chat.connect('wss://' + window.location.host + '/elapse/conn');
    }
};

Chat.sendMessage = (function(message) {
   
        Chat.socket.send(message);
 
});

function elapseRequest(){
	if(Chat.socket == null) Chat.initialize();
	var obj = new Object();
	obj.action = "ELAPSE";
	Chat.sendMessage(JSON.stringify(obj));
}
function cleanGeoMarkers(){
   for(var i in geo){
      geo[i].setMap(null);
   }
   geo = [];
}
function setGeoMarkers(data){
    cleanGeoMarkers();

    for(var i in data){
      _data = data[i]["_source"];
      // console.log(data[i]["_source"]);
      var myLatLng = {lat: _data["latitude"], lng: _data["longitude"]};
      var marker = new google.maps.Marker({
        position: myLatLng,
        labelContent: _data["message"],
        map: map,
        title: _data["message"],
        animation: google.maps.Animation.DROP
      });
      google.maps.event.addListener(marker, 'click', (function (marker) {
      return function () {
        infowindow.setContent(marker.labelContent);
        infowindow.open(map, marker);
          setTimeout(function() {
            infowindow.close();
          },10000);
        }
      })(marker));
      geo.push(marker);
    }
    // console.log(data);
}

function setMarkers(data){
  Object.keys(data).forEach(function(key) {
    // console.log(data[key])
    var myLatLng = {lat: parseFloat(data[key]["latitude"]), lng: parseFloat(data[key]["longitude"])};
    var d = new Date(0);
    d.setUTCSeconds(data[key]["epoch"]);

    if(data[key]["sentiment"]==0){
      circle = white_circle;
    }else if (data[key]["sentiment"]>0){
      circle = blue_circle;
    }else {
      circle = red_circle;
    }

    var marker = new google.maps.Marker({
        position: myLatLng,
        labelContent: data[key]["status"]+d,
        map: map,
        icon: circle,
        title: data[key]["status"],
        animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(marker, 'click', (function (marker) {
    return function () {
        infowindow.setContent(marker.labelContent);
        infowindow.open(map, marker);
          setTimeout(function() {
            infowindow.close();
          },10000);
        }
    })(marker));
    // console.log(index);
    marker.setMap(null);
    if(index==0){
        marker.setMap(map);
    }
    var s = document.getElementById("ALL_count");
    s.innerHTML = parseInt(s.innerHTML)+1;
    all.push(marker);
    if(data[key]["epoch"] > curr_sec){
       live_m.push(marker);
    }

    if(data[key]["key"]=="careerarc"){
      if(index==1){
        marker.setMap(map);
      }

      careerarc.push(marker);
      var s = document.getElementById("careerarc_count");
      s.innerHTML = parseInt(s.innerHTML)+1;

    }else if(data[key]["key"]=="want"){
      if(index==2){
        marker.setMap(map);
      }
      var s = document.getElementById("want_count");
      s.innerHTML = parseInt(s.innerHTML)+1;
      want.push(marker);
    }else if(data[key]["key"]=="good"){
      if(index==3){
        marker.setMap(map);
      }
      var s = document.getElementById("good_morning_count");
      s.innerHTML = parseInt(s.innerHTML)+1;
      good_morning.push(marker);

    }else if(data[key]["key"]=="london"){
      if(index==4){
        marker.setMap(map);
      }
      var s = document.getElementById("london_count");
      s.innerHTML = parseInt(s.innerHTML)+1;
      london.push(marker);

    }else if(data[key]["key"]=="tokyo"){
      if(index==5){
        marker.setMap(map);
      }
      var s = document.getElementById("tokyo_count");
      s.innerHTML = parseInt(s.innerHTML)+1;
      tokyo.push(marker);

    }else if(data[key]["key"]=="job"){
      if(index==6){
        marker.setMap(map);
      }
      var s = document.getElementById("job_count");
      s.innerHTML = parseInt(s.innerHTML)+1;
      job.push(marker);

    }else if(data[key]["key"]=="wind"){
      if(index==7){
        marker.setMap(map);
      }
      var s = document.getElementById("wind_count");
      s.innerHTML = parseInt(s.innerHTML)+1;
      wind.push(marker);

    }else if(data[key]["key"]=="rain"){
      if(index==8){
        marker.setMap(map);
      }
      var s = document.getElementById("rain_count");
      s.innerHTML = parseInt(s.innerHTML)+1;
      rain.push(marker);

    }else if(data[key]["key"]=="love"){
      if(index==9){
        marker.setMap(map);
      }
      var s = document.getElementById("love_count");
      s.innerHTML = parseInt(s.innerHTML)+1;
      love.push(marker);

    }else if(data[key]["key"]=="turkey"){
      if(index==10){
        marker.setMap(map);
      }
      var s = document.getElementById("turkey_count");
      s.innerHTML = parseInt(s.innerHTML)+1;
      turkey.push(marker);

    }
  });

}
function clearMarkers(){
   //clean all markers first
    for (var i = 0; i < all.length; i++) {
        all[i].setMap(null);
    }
}
function resetMap(){
    geo_marker.setVisible(false);
    map.setZoom(2);
    infowindow.close();
}
function queryHistory(index){

    if(Chat.socket == null) Chat.initialize();
    var obj = new Object();
    obj.action = "key_search";
    obj.keyword = keywords[index-1];
    // console.log(obj);
    Chat.sendMessage(JSON.stringify(obj));
    histroy_data[index-1] = true;
}
function setKeyWord(data){
    resetMap();
    cleanGeoMarkers();
    clearMarkers();
    index = parseInt(data)
    if(histroy_data[index-1]==false){
        queryHistory(index);
    }


    //add markers for corresponding keyword
    if(data=="0"){

      for (var i = 0; i < all.length; i++) {
          all[i].setMap(map);
          all[i].setAnimation(google.maps.Animation.DROP);

   
      }
    }else if(data=="1"){
   
      for (var i = 0; i < careerarc.length; i++) {
   
            careerarc[i].setMap(map);
            careerarc[i].setAnimation(google.maps.Animation.DROP);
     
      }
    }else if(data=="2"){
    
      for (var i = 0; i < want.length; i++) {
    
            want[i].setMap(map);
            want[i].setAnimation(google.maps.Animation.DROP);

        
      }
    }else if(data=="3"){

      for (var i = 0; i < good_morning.length; i++) {
        
           good_morning[i].setMap(map);
           good_morning[i].setAnimation(google.maps.Animation.DROP);
    
        
      }
    }else if(data=="4"){
   
      for (var i = 0; i < london.length; i++) {
  
           london[i].setMap(map);
           london[i].setAnimation(google.maps.Animation.DROP);
        
      }
    }else if(data=="5"){

      for (var i = 0; i < tokyo.length; i++) {
  
           tokyo[i].setMap(map);
           tokyo[i].setAnimation(google.maps.Animation.DROP);
 
      }
    }else if(data=="6"){

      for (var i = 0; i < job.length; i++) {
     
           job[i].setMap(map);
           job[i].setAnimation(google.maps.Animation.DROP);

        
      }
    }else if(data=="7"){
  
      for (var i = 0; i < wind.length; i++) {
        
           wind[i].setMap(map);
           wind[i].setAnimation(google.maps.Animation.DROP);
     
      }
    }else if(data=="8"){
     
      for (var i = 0; i < rain.length; i++) {
        
             rain[i].setMap(map);
             rain[i].setAnimation(google.maps.Animation.DROP);

    
      }
    }else if(data=="9"){
  
      for (var i = 0; i < love.length; i++) {
         
            love[i].setMap(map);
            love[i].setAnimation(google.maps.Animation.DROP);
 
        
      }
    }else if(data=="10"){
    
      for (var i = 0; i < turkey.length; i++) {
        
             turkey[i].setMap(map);
             turkey[i].setAnimation(google.maps.Animation.DROP);
    
        
      }
    }


}
function plotPoints(data) {
    resetMap();
    clearMarkers();
    var keys = [];
    var layers = [];
    //console.log(data);
    Object.keys(data).forEach(function(key) {
 
    
        keys.push(key);
        var points = [];


        for( var index in data[key]){
 
            
            points.push( new google.maps.LatLng(data[key][index]["latitude"], data[key][index]["longitude"]));
  
        }
  
        layers.push(points);

    });


    var ptr = 0;
    var id = setInterval(frame, 100);
    function frame() {
        if (ptr == keys.length) {
            clearInterval(id);
            var s = document.getElementById("curtime");
            s.innerHTML = new Date().toString().substring(0,21);
            heatmap.setData([]);
            setKeyWord("0");
        } else {
       
            var s = document.getElementById("curtime");
            var d = new Date(0);
            d.setUTCSeconds(keys[ptr]);
            s.innerHTML = d.toString().substring(0,21);
            heatmap.setData(layers[ptr]);
            ptr++;

        }
  }
  
    

}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}


