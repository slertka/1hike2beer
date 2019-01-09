// API KEYS
const hikeAPIKey = '200405472-b58f2be71509e5cbbac487a794df0b61';
const mapsAPIKey = 'AIzaSyA2pbng72aHFW9jfZ7wmXT8H12MNpTerW8';
var coordinates = {
  "lat": 47.6062095,
  "lng": -122.3320708
};

// BASE API URLS
const hikeURL = 'https://www.hikingproject.com/data/get-trails?';
const yelpURL = 'https://api.yelp.com/v3/businesses/search?categories=breweries,all&';
const geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?';

// Function converts location entered in search to lattitude and longitude
function convertLocToLatLong(location){
  let searchURL = geocodeURL + `address=${encodeURIComponent(location)}&key=${mapsAPIKey}` ;
  console.log(searchURL);
  
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
      getHikeResults(searchCoord);
    })
    .catch(err => console.log(err.message))
}

function displayHikeResults(responseJSON){
  $('.js-hike-results').empty();
  for (let i=0; i<responseJSON.trails.length; i++) {
    $('.js-hike-results').append(`
      <li>
        <img src="${responseJSON.trails[i].imgSqSmall}">
        <h4>${responseJSON.trails[i].name}</h4>
        <p>Location: ${responseJSON.trails[i].location}
        <br>Distance: ${responseJSON.trails[i].length} miles
        <br>Rating: ${responseJSON.trails[i].stars}/5 stars based on ${responseJSON.trails[i].starVotes}</p>
      </li>
    `)
  }
}

function getHikeResults(coordinates){
  let hikeSearchURL = hikeURL + `lat=${coordinates.lat}&lon=${coordinates.lng}&key=${hikeAPIKey}`;
  console.log( `running Hiking project API... ${hikeSearchURL}`)

  fetch(hikeSearchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJSON => displayHikeResults(responseJSON))
}

function watchForm(){
  $('form').submit(event => {
    event.preventDefault();
    let searchLoc = $('form').find('#search-loc').val();
    convertLocToLatLong(searchLoc);
  })
};

watchForm();