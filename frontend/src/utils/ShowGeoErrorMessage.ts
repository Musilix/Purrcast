const showGeoErrorMessage = (error: GeolocationPositionError) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.error('User denied the request for Geolocation.');
      break;
    case error.POSITION_UNAVAILABLE:
      console.error('Location information is unavailable.');
      break;
    case error.TIMEOUT:
      console.error('The request to get user location timed out.');
      break;
    default:
      console.error('An unknown error occurred.');
      break;
  }
};

export default showGeoErrorMessage;
