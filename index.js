// API KEYS
const optionsYelp = {
  headers: new Headers({
    "Authorization": "Bearer RmMsWvol035kM7ht-6SV01nZVEvkRAeyzJhr1bQrCUNSW-NkzzNeJIZt0YgEj7PWbRW4Xr654ylbHYxxxYWcGpoTZlWtoSb8E0AQzFmYWIkWa01I4Cm8p5waur4yXHYx"
  })
};
const hikeAPIKey = '200405472-b58f2be71509e5cbbac487a794df0b61';
const mapsAPIKey = 'AIzaSyA2pbng72aHFW9jfZ7wmXT8H12MNpTerW8';

// BASE API URLS
const hikeURL = 'https://www.hikingproject.com/data/get-trails?';
const yelpURL = 'https://api.yelp.com/v3/businesses/search?';
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
    .then(responseJSON => JSON.stringify(responseJSON.results[0].geometry.location))
    .catch(err => console.log(err.message))
}

function watchForm(){
  $('form').submit(event => {
    event.preventDefault();
    let searchLoc = $('form').find('#search-loc').val();
    convertLocToLatLong(searchLoc);
  })
};

watchForm();