define(() => {
  //define markers as an array
  let markers = [];
  //build the second part of google url
  const buildParameterString = paramsMap => {
    let paramString = "";
    for (const [index, value, b, c] of [...paramsMap].entries()) {
      if (index === 0) paramString += "?";
      paramString = `${paramString}${value[0]}=${value[1]}`;
      if (index < paramsMap.size - 1) paramString += "&";
    }
    return paramString;
  };
  //function that will insert the script tag into the head
  const insertScriptTag = src => {
    const head = document.getElementsByTagName("head")[0];
    const newScriptElement = document.createElement("script");

    newScriptElement.src = src;
    newScriptElement.type = "text/javascript";
    newScriptElement.async = true;
    newScriptElement.defer = true;

    head.appendChild(newScriptElement);
  };
  //function that will set your position marker
  const setMarker = (latlng, map) => {
    const marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: "Hello World!"
    });
    markers.push(marker);
  };
  //function that will delete all markers
  const clearMarkers = () => {
    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
  };
  //function that will fetch bookstores from google places
  const fetchBookStores = (lat, lng, map, callback) => {
    const service = new google.maps.places.PlacesService(map);
    const googleCoords = new google.maps.LatLng(lat, lng);
    service.nearbySearch({
      location: googleCoords,
      radius: "20000",
      type: ["book_store"]
    }, callback);
  };
  //function that will add markers for fetched places 
  const addMarkersFromPlaces = (places, map) => {
    const bounds = new google.maps.LatLngBounds();
    //for each place: get the icon, name and location.
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      //create infowindow with place name
      let infowindow = new google.maps.InfoWindow({
        content: '<div><strong>' + place.name + '</strong><br>' +
        place.vicinity + '</div>'
      });
      // Create a marker for each place.
      let newMarker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
      });
      //open info window on marker click
      newMarker.addListener('click', function() {
        infowindow.open(map, newMarker);
      });
      //add each marker to markers array
      markers.push(
        newMarker
      );
      //extend bounds if needed
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  };
  //function to add listener to searchbox
  const initSearchBoxListener = (searchBox, map) => {
    searchBox.addListener("places_changed", function() {
      const places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      } else {
        clearMarkers();
        addMarkersFromPlaces(places, map);
      }
    });
  };
  //function to place searchbox on map and initialize listener
  const drawSearchBox = map => {
    const input = document.getElementById("map-searchbox");
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
    initSearchBoxListener(searchBox, map);
  };
  //function to draw map
  const drawMap = (latitude, longitude) => {
    //coordinates to center the map
    const myLatlng = new google.maps.LatLng(latitude, longitude);
    const mapOptions = {
      zoom: 14,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //attach a map to the DOM Element, with the defined settings
    const map = new google.maps.Map(
      document.getElementById("map-canvas"),
      mapOptions
    );
    //set my position marker
    setMarker(myLatlng, map);
    document.getElementById("loader").style.display = "none";
    document.getElementById("map-searchbox").classList.remove("hidden");
    return map;
  };
  
  const module = {
    apiLoaded: new Promise((resolve, reject) => {
      window.googleMapsPromise = resolve;
    }),
    //initialize google maps
    init(apiUrl, params) {
      const parameterString = buildParameterString(params);
      const fullGoogleApiUrl = `${apiUrl}${parameterString}`;
      insertScriptTag(fullGoogleApiUrl);
    },
    //get user location
    getUserLocation(options) {
      const highAccuracyTimeout =
        (options && options.highAccuracyTimeout) || 3000;
      const lowAccuracyTimeout =
        (options && options.lowAccuracyTimeout) || 7000;
      const maximumAge = (options && options.maximumAge) || 0;

      const currentPosition = new Promise((resolve, reject) => {
        const savePosition = position => {
          resolve(position);
        };

        //try to get the position from gps otherwise fallback to the network one
        const getLowAccuracyPosition = () => {
          navigator.geolocation.getCurrentPosition(savePosition, reject, {
            enableHighAccuracy: false,
            timeout: lowAccuracyTimeout,
            maximumAge
          });
        };

        navigator.geolocation.getCurrentPosition(
          savePosition,
          getLowAccuracyPosition,
          {
            enableHighAccuracy: true,
            timeout: highAccuracyTimeout,
            maximumAge
          }
        );
      });

      return currentPosition;
    },
    //render map: drap map, then fetch bookstores and add markers and attach to dom
    renderMap({ latitude, longitude }) {
      const map = drawMap(latitude, longitude);
      fetchBookStores(latitude, longitude, map, bookStores => {
        addMarkersFromPlaces(bookStores, map);
        drawSearchBox(map);
      });
    }
  };
  return module;
});
