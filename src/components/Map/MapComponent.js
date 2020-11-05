import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import axios from '../../axios-markers';
import classes from './MapComponent.module.css';


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
  const [ markers, setMarkers ] = useState([]);


  // const success = position => {
  //     const currentPosition = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     }
  //     setCurrentPosition(currentPosition);
  //   };
  //
  //   useEffect(() => {
  //      navigator.geolocation.getCurrentPosition(success);
  //    })


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
        console.log("location is ");
        console.log(location);
        setLocations(location);

        setZoom(19);
      })
  }

  function getCoordinates(address){
    console.log(address);
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyD8Dy_5tEaquXe9u861bwg0C-78KOrBC4o")
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

  //let markers = [];


// NOTE: Do not click on landmarks or buildings
  function mapClicked(mapProps, map, clickEvent) {
    console.log(mapProps);


    if (mapProps != undefined && mapProps != null) {
      let old = [...markers];
      old.push({
        name: 'custom region',
        key: mapProps.latLng.lat() + "," + mapProps.latLng.lng(),
        location: {lat: mapProps.latLng.lat(), lng: mapProps.latLng.lng()},
        cases: 0
      });

      console.log("markers are ");
      //console.log(markers);
      setMarkers(old);
      console.log(markers);
    }
    else {
      console.log("undefined bs");
    }

    //
    // const tempLocation = {
    //   latitude: mapProps.hb.x,
    //   longitude: mapProps.hb.y,
    //   cases: 1000,
    //   deaths: 40
    // }
    // axios.post('/locations.json', tempLocation)
    //   .then(response => console.log(response))
    //   .catch(error => console.log(error));



  }

  // TODO: Still need to handle edge cases (do not allow user to search empty string and display alert that search found nothing if not in US)
  function onMarkerDelete(selectedMarker) {
    console.log("DELETE ME");
    console.log(markers);

    // Add to list of markers to hide/remove from firebase
    console.log(selectedMarker);
    setSelected({});
  }

let defaultTemp = {
  lat: 37.6423231, lng:-121.8111
}

  const coords = { lat: -21.805149, lng: -49.0921657 };


// Section: Hotspot logic
const [radius, setRadius] = useState(1200);
const [hotspot, setHotspot] = useState(false);

let btn_hotspot_class = hotspot ? "blueBorder" : "blackBorder";
;

function onEnableHotspot(e) {
  e.preventDefault();
  console.log("hotspot enabled");
  setHotspot(!hotspot);
  console.log("current status of hotspot is " + hotspot);
}


function onChangeInput() {

}

  return (
    <div style={{"top": "5000px"}}>
    <form>
        <label>
          Radius:
          <input
            type="number"
            value={radius}
            onChange={e => setRadius(e.target.value)}
            placeholder="1200" />
        </label>
        <button className={btn_hotspot_class} onClick={onEnableHotspot}>Enable Hotspot</button>
      </form>
     <LoadScript
       googleMapsApiKey='AIzaSyD8Dy_5tEaquXe9u861bwg0C-78KOrBC4o'>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={currentZoom ? currentZoom : defaultZoom}
          center={currentPosition.lat ? currentPosition : defaultCenter}
          onRightClick={mapClicked}
        >

        // Generates all markers in the state of the searched region
        {
            locations.map(item => {
              return (
              <Marker key={item.lat + "," + item.long} position={item.location} onClick={() => onSelect(item)}/>
              )
            })
         }
         // TODO: This should be able to generate all markers in markers array
         {
           markers.map((marker, index) => {
              return (
                <Marker
                 key={marker.key} position={marker.location} onClick={() => onSelect(marker)}
                   />
              );
            })
          }


         // TODO: placeholder for radius
         <Circle
            radius={1200}
            center={defaultCenter}
            onMouseover={() => console.log('mouseover')}
            onClick={() => console.log('click')}
            onMouseout={() => console.log('mouseout')}
            strokeColor='transparent'
            strokeOpacity={0}
            strokeWeight={5}
            fillColor='#FF0000'
            fillOpacity={0.2}
      />




           {
               markers.map((marker, index) => {
                 return (
                 <Marker key={marker.lat + "," + marker.long} position={marker.location} onClick={() => onSelect(marker)}/>
                 )
               })
            }


         // Display a popup InfoWindow if user clicks on a marker
         {
          selected.location &&
          (
            <InfoWindow
              position={selected.location}
              clickable={true}
              onCloseClick={() => setSelected({})}
              >
                <div className={classes.label}>
                  <p>
                    <label>County: </label>
                    <input type="text" value={selected.name} onChange={onChangeInput}></input>
                  </p>
                  <p>
                    <label>Confirmed Cases: </label>
                    <input type="text" value={selected.confirmed} onChange={onChangeInput}></input>
                  </p>
                  <p>
                    <label>Confirmed Deaths: </label>
                    <input type="text" value={selected.deaths} onChange={onChangeInput}></input>
                  </p>
                  <p>
                    <label>Confirmed Difference: </label>
                    <input type="text" value={selected.confirmed_diff} onChange={onChangeInput}></input>
                  </p>
                  <button>Confirm Changes</button>
                  <button onClick={() => onMarkerDelete(selected)}>Delete</button>
                </div>
            </InfoWindow>
          )
       }

       // Display all markers in firebase
       {

       }

       // Generates a marker on current location.
       {
          currentPosition.lat ?
          <Marker
            position={currentPosition}
            label="Current Location"
            /> :
          null
        }

        </GoogleMap>
     </LoadScript>
</div>
  )
})

export default MapComponent;
