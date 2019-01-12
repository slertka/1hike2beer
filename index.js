// API KEYS
const hikeAPIKey = '200405472-b58f2be71509e5cbbac487a794df0b61';
const mapsAPIKey = 'AIzaSyA2pbng72aHFW9jfZ7wmXT8H12MNpTerW8';

// BASE API URLS
const hikeURL = 'https://www.hikingproject.com/data/get-trails?maxResults=50&';
const geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?';

var map;

// Function converts location entered in search to lattitude and longitude
function convertLocToLatLong(location, dist){
  let searchURL = geocodeURL + `address=${encodeURIComponent(location)}&key=${mapsAPIKey}` ;

  fetch(searchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText)
    }
      )
    .then(responseJSON => {
      let searchCoord = responseJSON.results[0].geometry.location;
      getHikeResults(searchCoord, dist);
      initPlaceMap(searchCoord, dist);
    })
    .catch(err => console.log(err.message))
}

function displayHikeResults(responseJSON){
  $('.js-hike-results').empty();
  if (responseJSON.trails.length !== 0) {
    for (let i=0; i<responseJSON.trails.length; i++) {
      $('.js-hike-results').append(`
        <li>
          <img src="${responseJSON.trails[i].imgSqSmall}">
          <h4>${responseJSON.trails[i].name}</h4>
          <p>Location: ${responseJSON.trails[i].location}
          <br>Distance: ${responseJSON.trails[i].length} miles
          <br>Rating: ${responseJSON.trails[i].stars}/5 stars based on ${responseJSON.trails[i].starVotes} reviews</p>
        </li>
      `)
      var hikeMarker = new google.maps.Marker({position: {'lat': responseJSON.trails[i].latitude, 'lng': responseJSON.trails[i].longitude}, 
      icon: 'sml-hiker.png',
      map: map}
    }
  }
  $('.js-hike-results').html(`
      <p>or not! Looks like we couldn't find any hikes in that area. Try increasing your search distance or entering a new address.</p>
    `)
}

function getHikeResults(coordinates, dist){
  let hikeSearchURL = hikeURL + `lat=${coordinates.lat}&lon=${coordinates.lng}&key=${hikeAPIKey}&maxDistance=${dist}`;
  console.log(hikeSearchURL)
  fetch(hikeSearchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJSON => displayHikeResults(responseJSON))
}

function displayBeerResults(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) { 
    $('.js-beer-results').empty();
    for (let i=0; i<results.length; i++) {
      $('.js-beer-results').append(`
        <li>
          <h4>${results[i].name}</h4>
          <p>Rating: ${results[i].rating}/5 stars based on ${results[i].user_ratings_total} reviews</p>
        </li>
      `);
    var beerMarker = new google.maps.Marker({position: results[i].geometry.location, 
      icon: 'sml-beer.png',
      map: map})
    }
  }
}

function initPlaceMap(coordinates, dist) {
  let searchArea = new google.maps.LatLng(coordinates.lat, coordinates.lng);
  map = new google.maps.Map(document.getElementById('map'), {
    center: coordinates,
    zoom: 10
  });

  var request = {
    location: searchArea,
    radius: dist*1609,
    keyword: 'brewpub'
  };

  let service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, displayBeerResults)
}

function watchForm(){
  $('form').submit(event => {
    event.preventDefault();
    let searchLoc = $('form').find('#search-loc').val();
    let searchDist = $('form').find('#max-distance').val();
    convertLocToLatLong(searchLoc, searchDist);
    $('.results').removeClass('hidden');
  })
};

watchForm();