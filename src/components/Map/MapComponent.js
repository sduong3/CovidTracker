import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapComponent = forwardRef((props, ref) => {

  const mapStyles = {
    height: "100vh",
    width: "100%"};

  const defaultCenter = {
    // middle of San Jose
    lat: 37.3382,
    lng: -121.8863
  }
  const defaultZoom = 13;
  const [currentZoom, setZoom] = useState(13);
  var location = [];

  const [locations, setLocations] = useState([]);

  const [ selected, setSelected ] = useState({});
  const onSelect = item => {
    setSelected(item);
  }
  const [ currentPosition, setCurrentPosition ] = useState([]);


  // Workaround to pass function reference from child to parent
  // function logValue() {}
  useImperativeHandle(ref, () => ({
     logValue
    }));

    function logValue (appAddress) {
     getCoordinates(appAddress);
   }

  function getLocations(state) {
    fetch("https://covid-api.com/api/reports?date=2020-04-16&iso=USA&region_province=" + state)
      .then(response => response.json())
      .then(data => {
        //location.push(data.data[0].region.cities);
        for(var x = 0; x < data.data[0].region.cities.length; x++) {
            data.data[0].region.cities[x].location = {lat: data.data[0].region.cities[x].lat, lng: data.data[0].region.cities[x].long};
            data.data[0].region.cities[x].location.lat = parseFloat(data.data[0].region.cities[x].location.lat);
            data.data[0].region.cities[x].location.lng = parseFloat(data.data[0].region.cities[x].location.lng);

            location.push(data.data[0].region.cities[x]);
        }
        setLocations(location);
        setZoom(19);
      })
  }

  function getCoordinates(address){
    console.log(address);
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyD5BfSc3VnjoKFB1ORmG8V-0fgN5PfX5Kk")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCurrentPosition(data.results[0].geometry.location) // Note: Look into making this marker a diff color
        var state = "";
        for(var x = 0; x < data.results[0].address_components.length; x++) {
          if(data.results[0].address_components[x].types[0] == 'administrative_area_level_1') {
            state = data.results[0].address_components[x].long_name;
            break;
          }
        }
        getLocations(state);


      })
  }

  function mapClicked(mapProps, map, clickEvent) {
    console.log(mapProps);
  }

  // TODO: Still need to handle edge cases (do not allow user to search empty string and display alert that search found nothing if not in US)

  return (

     <LoadScript
       googleMapsApiKey='AIzaSyD8Dy_5tEaquXe9u861bwg0C-78KOrBC4o'>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={currentZoom ? currentZoom : defaultZoom}
          center={currentPosition.lat ? currentPosition : defaultCenter}
          onClick={mapClicked}
        >
        {
            locations.map(item => {
              return (
              <Marker key={item.lat + "," + item.long} position={item.location} onClick={() => onSelect(item)}/>
              )
            })
         }
         {
          selected.location &&
          (
            <InfoWindow
            position={selected.location}
            clickable={true}
            onCloseClick={() => setSelected({})}
          >
            <div>
              <p><b>County: </b>{selected.name}</p>
              <p><b>Confirmed Cases: </b>{selected.confirmed}</p>
              <p><b>Confirmed Deaths: </b>{selected.deaths}</p>
              <p><b>Confirmed Difference: </b>{selected.confirmed_diff}</p>

            </div>
          </InfoWindow>
          )
       }

       {
          currentPosition.lat ?
          <Marker
          position={currentPosition}
          /> :
          null
        }

        </GoogleMap>
     </LoadScript>

  )
})

export default MapComponent;
