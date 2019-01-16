// API KEYS
const hikeAPIKey = '200405472-b58f2be71509e5cbbac487a794df0b61';
const mapsAPIKey = 'AIzaSyA2pbng72aHFW9jfZ7wmXT8H12MNpTerW8';

// BASE API URLS
const hikeURL = 'https://www.hikingproject.com/data/get-trails?maxResults=50&';
const geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?';

var map;

// Function converts location entered in search to lattitude and longitude
// The hike API runs from this function since lat & long are required parameters
function convertLocToLatLong(location, dist){
  // Creates URL for geocoding a location
  let searchURL = geocodeURL + `address=${encodeURIComponent(location)}&key=${mapsAPIKey}` ;

  // Fetch for the geocode data
  fetch(searchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText)
    }
      )
    .then(responseJSON => {
      // Define variable for object returned from geocode API {lat: num, lng: num}
      let searchCoord = responseJSON.results[0].geometry.location;

      // Runs and displays hike results
      getHikeResults(searchCoord, dist);

      // Displays map and beer results
      // Beer results are loaded from the Maps API with the Places library loaded
      initPlaceMap(searchCoord, dist);

      // Remove classes for formatting of initial page vs. results page
      $('.results').removeClass('hidden');
      $('.header').removeClass('h-100 align-items-center').addClass('align-items-start');
      $('#main-search').removeClass('header-before').addClass('header-after')  
      $('#slogan').empty().html(`Go on a hike. Treat yo'self with a beer`).addClass('after-results')    
    })
    .catch(err => {
      console.log(err.message)
      alert('Enter a valid address');
    })
}

// Function to display the hike results with markers
function displayHikeResults(responseJSON){
  // Empty the current results if user refreshes results changing location or distance
  $('.js-hike-results').empty();

  // Creates HTML to display results
  // Checks if there are any hikes returned from search
  if (responseJSON.trails.length !== 0) {
    for (let i=0; i<responseJSON.trails.length; i++) {
      $('.js-hike-results').append(`
        <li class='ind-hike-result'>
          <h4><a href='${responseJSON.trails[i].url}' target='blank'>${responseJSON.trails[i].name}</a></h4>
          <p><i>${responseJSON.trails[i].location}</i>
          <br>Length: ${responseJSON.trails[i].length} miles
          <br>${responseJSON.trails[i].stars}/5 stars based on ${responseJSON.trails[i].starVotes} reviews</p>
        </li>
      `)
      var hikeMarker = new google.maps.Marker({position: {'lat': responseJSON.trails[i].latitude, 'lng': responseJSON.trails[i].longitude}, 
      icon: 'sml-boots.png',
      map: map})
    }
  } else {
    // Successful response but there are no hikes found in the given location
    $('.js-hike-results').html(`
    <p>or not! Looks like we couldn't find any hikes in that area. Try increasing your search distance or entering a new location.</p>
  `)
  }
}

// Function uses coordinates from convertLocToLatLong() to run search API
function getHikeResults(coordinates, dist){

  // Create hike search URL
  let hikeSearchURL = hikeURL + `lat=${coordinates.lat}&lon=${coordinates.lng}&key=${hikeAPIKey}&maxDistance=${dist}`;
  console.log(hikeSearchURL)

  // When response is successful, loads hike results into HTML
  fetch(hikeSearchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJSON => displayHikeResults(responseJSON))
}

// Works the same way as displayHikeResults()
function displayBeerResults(results, status) {
  $('.js-beer-results').empty();

  if (status == google.maps.places.PlacesServiceStatus.OK) { 
    for (let i=0; i<results.length; i++) {
      $('.js-beer-results').append(`
        <li class='ind-beer-result'>
          <h4>${results[i].name}</h4>
          <p>${results[i].rating}/5 stars based on ${results[i].user_ratings_total} reviews</p>
        </li>
      `);

    // Uses beer icon
    var beerMarker = new google.maps.Marker({position: results[i].geometry.location, 
      icon: 'sml-beer.png',
      map: map})
    }
  } else {
    $('.js-beer-results').html(`<p>but, we couldn't find any breweries! Try increasing your search distance or entering a new location.</p>`)
  }
}

// Loads Map and displays Beer Results with a Marker and HTML
function initPlaceMap(coordinates, dist) {
  let searchArea = new google.maps.LatLng(coordinates.lat, coordinates.lng);
  map = new google.maps.Map(document.getElementById('map'), {
    center: coordinates,
    zoom: 10
  });

  // Set required parameters for .nearbySearch method
  var request = {
    location: searchArea,
    radius: dist*1609,
    keyword: 'brewpub'
  };

  // Places beer marker
  let service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, displayBeerResults)
}

// Listens to submit form event to display results for user
function watchForm(){
  $('form').submit(event => {
    event.preventDefault();
    let searchLoc = $('form').find('#search-loc').val();
    let searchDist = $('form').find('#max-distance').val();
    validateSearchRadius(searchLoc, searchDist);
    // convertLocToLatLong(searchLoc, searchDist);
  })
};

// Validate Search Radius for between 0 and 200 miles
function validateSearchRadius(location, dist) {
  if (dist > 0 && dist <= 200) {
    convertLocToLatLong(location, dist);
  } else {
    alert('Enter a valid search radius between 1 and 200 miles.')
  }
}

watchForm();