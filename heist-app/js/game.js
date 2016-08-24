console.log("js loaded");
initMap();
var policeStartLocation;
var endLocation;
var mapCenterLatLng;
var map;
var marker;
var airportLatLng;
var winner;
var distanceToAirport;
var criminalRandom;
var policeDistanceToHiest;
var policeRandom;
var jewelryStores = [];
var banks = [];
var policeStations = [];
var airports = [];
function initMap() {
  console.log("initializing");
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var policeDirectionsService = new google.maps.DirectionsService();
  var policeDirectionsDisplay;
  var airportDirectionsService = new google.maps.DirectionsService();
  var airportDirectionsDisplay;
  // Create a map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 51.515081, lng: -0.071966},
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}]
  });
  
  var geocoder = new google.maps.Geocoder();
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
    // Once map is loaded...
    google.maps.event.addListenerOnce(map, 'idle', function(){
    // console.log("Map is loaded fully");
    getMapMarkers();
    heistLocation = false;
    endLocation = false;
    });    
  })
function calculateAndDisplayRouteForPolice(policeDirectionsService, policeDirectionsDisplay, startPlace) {
  console.log("Police station start point: " + startPlace.geometry.location);
  var policeStation = startPlace.geometry.location
  policeDirectionsService.route({
    origin: policeStation,
    destination: heistLocation,
    travelMode: 'DRIVING',
    drivingOptions: {
        departureTime: new Date(Date.now()),
        trafficModel: 'optimistic'
      }
  }, function(response, status) {
    if (status === 'OK') {
      policeDirectionsService = new google.maps.DirectionsService();
      policeDirectionsDisplay = new google.maps.DirectionsRenderer();
      policeDirectionsDisplay.setMap(map);
      policeDirectionsDisplay.setOptions({
        preserveViewport: true
      });
      // policeDirectionsDisplay.setDirections(response);
      var waypoints = [{ location: heistLocation, stopover: false }];
      console.log("waypoints", waypoints);
      var speed = 90;
      var image = "../images/policecar.png";
      var color = "#FF0000"
      // while(airportLatLng === undefined) {};
      getDirectionsAndAnimate(policeDirectionsService, policeDirectionsDisplay, policeStation, airportLatLng, waypoints, speed, image, color);
      console.log("Time for Police to arrive: " + response.routes[0].legs[0].duration.value);
      function totalDistance(route) {
        var total= 0;
        for (i = 0; i < route.legs.length; i++) {
          total += route.legs[i].distance.value;
        }
        console.log("Total Distance for Police to the Heist: " + total);
        policeDistanceToHiest = total;
      }
      totalDistance(response.routes[0]);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
function calculateAndDisplayRouteForCriminals() {
  var airportLat;
  var airportLng;
  $.ajax({
    url: "https://airport.api.aero/airport/nearest/" + heistLocation.lat() + "/" + heistLocation.lng()+"?maxAirports=1&user_key=c6da13c45831bd2e3a96983d43065e7a",
    jsonp: "callback",
    dataType: "jsonp",
    success: function(data){
      airportLat = parseFloat(data.airports[0].lat);
      airportLng = parseFloat(data.airports[0].lng);
      airportLatLng = new google.maps.LatLng(airportLat, airportLng);
      console.log("Airport: " + airportLatLng);
      airportDirectionService = new google.maps.DirectionsService();
      airportDirectionDisplay = new google.maps.DirectionsRenderer();
      airportDirectionDisplay.setMap(map);
      var waypoints = [];
      var speed = 100;
      var image = "../images/criminal_car.png";
      var color = '#0000FF';
      getDirectionsAndAnimate(airportDirectionService, airportDirectionDisplay, heistLocation, airportLatLng, waypoints, speed, image, color);   
      }
  });
}  
function clearMarkers(markers) {
  console.log(markers);
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  return [];
}
// Markers for banks etc
function getMapMarkers() {
  jewelryStores = clearMarkers(jewelryStores);
  banks = clearMarkers(banks);
  policeStations = clearMarkers(policeStations);
  airports = clearMarkers(airports);
  // banks
  var request = {
    location: { lat: map.getCenter().lat(), lng: map.getCenter().lng() },
    radius: '8000',
    type: 'bank'
  };
  // jewelry_store
  var request2 = {
    location: { lat: map.getCenter().lat(), lng: map.getCenter().lng() },
    radius: '8000',
    type: 'jewelry_store'
  };
  // Airports
  // var request3 = {
  //   location: { lat: map.getCenter().lat(), lng: map.getCenter().lng() },
  //   // radius: '15000',
  //   rankBy : google.maps.places.RankBy.DISTANCE,
  //   type: 'airport'
  // };
  // Police
  var request4 = {
    location: { lat: map.getCenter().lat(), lng: map.getCenter().lng() },
    radius: '8000',
    type: 'police'
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, mapMarkers);
  service.textSearch(request2, mapMarkers);
  // service.textSearch(request3, mapMarkers);
  service.textSearch(request4, mapMarkers);
}
function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      // var marker = new google.maps.Marker({
      //   map: resultsMap,
      //   position: results[0].geometry.location
      // }); Creating marker for geocode search result.
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
    // mapCenterLatLng = results[0].geometry.location;
  });
}
function mapMarkers(results, status) {
  
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      
      if (place.types.includes("bank")) {
        banks.push(createMarker(results[i], "bank"));
      } else if(place.types.includes("jewelry_store")) {
        jewelryStores.push(createMarker(results[i], "jewelry_store"));
      
      } else if(place.types.includes("airport")) {
        airports.push(createMarker(results[i], "airport"));
      
      } else if(place.types.includes("police")) {
        policeStations.push(createMarker(results[i], 'police'));
      } else {
      }
    } 
  }
}
function findNearestPoliceStation(heistLocation, callback) {
  var request = {
    location: heistLocation,
    rankBy: google.maps.places.RankBy.DISTANCE,
    types: ['police']
  };
  policeService = new google.maps.places.PlacesService(map);
  policeService.nearbySearch(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log("police search results" + results[0]);
      console.log(results[0]);
      return callback(results[0]);
    } else {
      console.log("Bad search");
    }
  });
}
function findNearestAirport(heistLocation, callback) {
  console.log("HeistLocation" + heistLocation);
  var request = {
    location: heistLocation,
    rankBy: google.maps.places.RankBy.DISTANCE,
    types: ['airport']
  };
  // console.log("request made");
  airportService = new google.maps.places.PlacesService(map);
  airportService.nearbySearch(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // console.log("airport places service works");
      return callback(results[0]);
    } else {
      console.log("Bad search for police station...");
    }
  });
}
function heistMarkerListener(marker) {
  marker.addListener('click', function(event) {
    if (!heistLocation) {
      heistLocation = event.latLng;
      console.log('Start selected', event.latLng.lat(), event.latLng.lng());
      findNearestAirport(heistLocation, function(airport) {
        calculateAndDisplayRouteForCriminals();
      });
      findNearestPoliceStation(heistLocation, function(pigShop) {
        calculateAndDisplayRouteForPolice(policeDirectionsService, policeDirectionsDisplay, pigShop);
      });
    }     
  });
}
function createMarker(searchResult, type) {
  var color;
  if(type === 'bank') {
    image = "../images/bank.png";
  } else if (type === 'jewelry_store'){
    image = "../images/jewelry.png";
  } else if (type === 'police') {
    image = "../images/police.png";
  } else {
    image = "../images/airport.png";
  }
  var marker = new google.maps.Marker({
    position: searchResult.geometry.location,
    map: map,
    animation: google.maps.Animation.DROP,
    icon: image
  });
  if(type === 'bank' || type === 'jewelry_store') {
    heistMarkerListener(marker);  
  } 
  marker.addListener('click', toggleBounce);
  return marker;
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
}
function moveMarker(map, marker, latlng) {
    marker.setPosition(latlng);
    // map.panTo(latlng);
  }
  function autoRefresh(map, pathCoords, speed, image, color) {
    var i, route, marker;
    route = new google.maps.Polyline({
      path: [],
      geodesic : true,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 10,
      editable: false,
      map: map
    });
    
    marker=new google.maps.Marker({map:map, icon:image});
    for (i = 0; i < pathCoords.length; i++) {       
      setTimeout(function(coords) {
        route.getPath().push(coords);
        moveMarker(map, marker, coords);
      }, speed * i, pathCoords[i]);
      // if (!winner && i === pathCoords.length - 1) {
      //   winner = image;
      //   console.log("winner is: " + winner);
      // }
    }
}
function getDirectionsAndAnimate(directionService, directionDisplay, origin, destination, waypoints, speed, image, color) {
    console.log("getting directions", origin, destination);
    var request = {
      origin:origin,
      destination:destination,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionService.route(request, function(result, status) {
      console.log("result and status", result, status);
      if (status == google.maps.DirectionsStatus.OK) {
          console.log("this is the request", request);
          directionDisplay.setDirections(result);
          console.log("Time to get to airport: " + result.routes[0].legs[0].duration.value);
          
          function totalDistance(route) {
            var total= 0;
            for (i = 0; i < route.legs.length; i++) {
              total += route.legs[i].distance.value;
            }
            console.log("Total Distance to airport: " + total + "m");
            distanceToAirport = total;
            var criminalEstimate = Math.ceil(((distanceToAirport/1000)/80)*60);
            $(".criminal-estimate").html("You are about " +criminalEstimate + " minutes away.");
            var policeEstimate = Math.ceil((((distanceToAirport+policeDistanceToHiest)/1000)/90)*60);
            $(".police-estimate").html("The police are about " +policeEstimate + " minutes way");

            var winPercent = Math.floor((policeEstimate/criminalEstimate)*100)-30
            var winPercentModifier = Math.floor((Math.random()*10))
            if(Math.random()<.49999){
              $(".win-percent").html((winPercent-winPercentModifier)+"%")
            } else {
              $(".win-percent").html(((winPercent-winPercentModifier)-10)+"%")
            }

            if((winPercent-winPercentModifier)<10){
              $(".win-money").html("$100 million");
            }else if((winPercent-winPercentModifier)<30){
              $(".win-money").html("$50 million");
            }else if((winPercent-winPercentModifier)<50){
              $(".win-money").html("$10 million");
            }else if((winPercent-winPercentModifier)<70){
              $(".win-money").html("$1 million");
            }else if((winPercent-winPercentModifier)<90){
              $(".win-money").html("$250 thousand");
            }else if((winPercent-winPercentModifier)<95){
              $(".win-money").html("$100 thousand");
            }else{
              $(".win-money").html("$10 thousand");
            }



            $(".rob").on("click", function(){
              policeRandom = ((Math.ceil(Math.random()*100))/100);
              while(policeRandom <= .75){
                policeRandom = ((Math.ceil(Math.random()*100))/100);
              }
              criminalRandom = ((Math.ceil(Math.random()*100))/100);
              while(criminalRandom <= .9){
                criminalRandom = ((Math.ceil(Math.random()*100))/100);
              }
              var criminalTime = (distanceToAirport/1000)/(80*criminalRandom);
              //minutes = policeTime*60 remainder is seconds in decimal
              var criminalRemainder = (criminalTime*60) - (Math.floor(criminalTime*60))
              var criminalSeconds = (Math.floor(criminalRemainder*60))
              console.log("You are " + (Math.floor(criminalTime*60)) + " minutes away and " + criminalSeconds + " seconds away!");
              $(".criminalTimeTag").html("You are " + (Math.floor(criminalTime*60)) + " minutes away and " + criminalSeconds + " seconds away!");
              
              var policeTime = ((distanceToAirport+policeDistanceToHiest)/1000)/(90*policeRandom);
              //minutes = policeTime*60 remainder is seconds in decimal
              var policeRemainder = (policeTime*60) - (Math.floor(policeTime*60))
              var policeSeconds = (Math.floor(policeRemainder*60))
              console.log("The police are " + (Math.floor(policeTime*60)) + " minutes away and " + policeSeconds + " seconds away!");
              $(".policeTimeTag").html("The police are " + (Math.floor(policeTime*60)) + " minutes away and " + policeSeconds + " seconds away!");
              if(policeTime < criminalTime){
                //win
                $(".win-or-lose").html("The police find you on your way to the aiport. YOU LOSE");
              } else if(criminalTime < policeTime){
                //lose
                $(".win-or-lose").html("YOU WIN");
              } else if(policeTime = criminalTime){
                //meet the police
                $(".win-or-lose").html("You meet the police at the airport!");
              } else {
                console.error("Something went wrong when determining who wins");
              }
            })
          }
          totalDistance(result.routes[0]);
          autoRefresh(map, result.routes[0].overview_path, speed, image, color);
        } else {
          window.alert('Directions request failed due to ' + status);
      }
    });
      
}
}