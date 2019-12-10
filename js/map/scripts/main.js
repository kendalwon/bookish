require(["../configs/app", "./modules/googleMaps"], ({ apiUrl, defaultPosition, parameters }, googleMaps) => {
  //HERE'S THE KICKOFF!!!!!
  googleMaps.init(apiUrl, new Map(parameters));
  googleMaps.apiLoaded.then(returnedValues => {
    //Get users location and then draw map
    googleMaps.getUserLocation()
      .then(({ coords: { latitude, longitude } }) => {
        googleMaps.renderMap({
          latitude,
          longitude
        });
      })
      .catch(error => {
        googleMaps.renderMap(defaultPosition);
      });
  });
});
