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

function convertLocToLatLong(location){
  let searchURL = geocodeURL + `address=${encodeURIComponent(location)}&key=${mapsAPIKey}` ;
  console.log(searchURL);
  let searchLat = fetch(searchURL)
    .then(response => response.json())
    .then(responseJSON => responseJSON.results[0].geometry.location.lat);
  let searchLng = fetch(searchURL)
    .then(response => response.json())
    .then(responseJSON => responseJSON.results[0].geometry.location.lng);
  let locArr = [searchLat, searchLng];
  return locArr;
}

function watchForm(){
  $('form').submit(event => {
    event.preventDefault();
    let searchLoc = $('form').find('#search-loc').val();
    convertLocToLatLong(searchLoc);
    console.log('it works')
  })
};

watchForm();