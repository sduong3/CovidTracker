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
  const defaultZoom = 12;
  const [currentZoom, setZoom] = useState(13);
  var location = [];

  const [locations, setLocations] = useState([]);

  const [ selected, setSelected ] = useState({});
  const onSelect = item => {
    setSelected(item);
    setCaseCount(item.confirmed);
  }
  const [ currentPosition, setCurrentPosition ] = useState([]);
  const [ markers, setMarkers ] = useState([]);
  const [ hotspotCoord, setHotspotCoord] = useState(defaultCenter);
  const [ caseCount, setCaseCount ] = useState(0);
  const [dictionary, setDictionary] = useState({});

  // Workaround to pass function reference from child to parent
  // function logValue() {}
  useImperativeHandle(ref, () => ({
     logValue
    }));

    function logValue (appAddress) {
     getCoordinates(appAddress);
   }

   const [launchFlag, setLaunchFlag] = useState(true);
   getLocationsOnLaunch();


   // Only runs at launch.
   // First, retrieve the values in the database.
   // Then,
   function getLocationsOnLaunch() {
     if (launchFlag) {
       updateCovidCountFromDatabase();
       getLocations("California");
       setLaunchFlag(false);
     }
   }


  function getLocations(state) {
    fetch("https://covid-api.com/api/reports?date=2020-04-16&iso=USA&region_province=" + state)
      .then(response => response.json())
      .then(data => {
        //location.push(data.data[0].region.cities);
        for(var x = 0; x < data.data[0].region.cities.length; x++) {
            data.data[0].region.cities[x].location = {lat: data.data[0].region.cities[x].lat, lng: data.data[0].region.cities[x].long};

            console.log(data.data[0].region.cities[x]);
            if (dictionary[data.data[0].region.cities[x].fips]) {
              data.data[0].region.cities[x].confirmed = dictionary[data.data[0].region.cities[x].fips].cases;
            }

            data.data[0].region.cities[x].location.lat = parseFloat(data.data[0].region.cities[x].location.lat);
            data.data[0].region.cities[x].location.lng = parseFloat(data.data[0].region.cities[x].location.lng);

            location.push(data.data[0].region.cities[x]);
        }

        setLocations(location);
        // console.log("location is ");
        // console.log(location);
        //setZoom(19);
      })
      .catch(errpr => alert("Please enter a city or state in the United States"));
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


// NOTE: Do not click on landmarks or buildings. NOT USED AT THE Moment
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
  }

  // Fetch all data in firebase and store data in array.
  // Then, convert to dictionary
  function updateCovidCountFromDatabase() {
    axios.get('/locations.json')
      .then(response => {
        console.log(response.data);
        const fetchedResults = [];
        for (let key in response.data) {

          fetchedResults.push(
            {
              ...response.data[key],
              id: key
            }
          )
        }

        for (let x = 0; x < fetchedResults.length; x++) {
          dictionary[fetchedResults[x].fips] = fetchedResults[x];
        }
        setDictionary(dictionary);
      })
      .catch(error => console.log(error));
  }


// Section: Hotspot logic
const [radius, setRadius] = useState(1200);
const [hotspot, setHotspot] = useState(false);

let btn_hotspot_class = hotspot ? "blueBorder" : "blackBorder";
;



function createHotSpot(mapProps, map, clickEvent) {
  console.log(currentPosition);
  console.log(mapProps);

  setHotspotCoord(
    {lat: mapProps.latLng.lat(), lng: mapProps.latLng.lng()}
  );
}

function onChangeInput() {

}

function updateCountAtLocation() {
  let data = {
    name: selected.name,
    cases: caseCount,
    fips: selected.fips
  }

  // Simple test to see if pushed to database
  console.log(selected);
  selected.confirmed = caseCount;

  axios.post('/locations.json', data)
    .then(response => console.log(response))
    .catch(error => console.log(error));

  alert("Updated case count at " + selected.name);
  //store all updated values in array
  // create new markers

}

// TODO: Still need to handle edge cases (do not allow user to search empty string and display alert that search found nothing if not in US)
function onMarkerDelete(selectedMarker) {
  console.log("DELETE ME");
  console.log(selectedMarker);

  setCaseCount(0);
  selectedMarker.confirmed = 0;
  // need to push to database

  let data = {
    name: selected.name,
    cases: caseCount
  }
  axios.post('/locations.json', data)
    .then(response => console.log(response))
    .catch(error => console.log(error));
  alert("Cleared case count at " + selected.name);

}


  return (
    <div style={{"top": "5000px"}}>
    <form>
        <label>
          Radius:
          <input
            type="number"
            value={radius}
            onChange={e => setRadius(+e.target.value)}
            placeholder="1200" />
        </label>
      </form>
     <LoadScript
       googleMapsApiKey='AIzaSyD8Dy_5tEaquXe9u861bwg0C-78KOrBC4o'>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={currentZoom ? currentZoom : defaultZoom}
          center={currentPosition.lat ? currentPosition : defaultCenter}
          onRightClick={mapClicked}
          onClick={createHotSpot}
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

          // updated case values in county markers

         // TODO: placeholder for radius
         <Circle
            radius={radius}
            center={hotspotCoord}
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
                 <Marker key={index} position={marker.location} onClick={() => onSelect(marker)}/>
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
                    {selected.name}
                  </p>
                  <p>
                    <label>Confirmed Cases: </label>
                    <input type="number" value={caseCount} onChange={e => setCaseCount(+e.target.value)}></input>
                  </p>

                  <button onClick={updateCountAtLocation}>Confirm Changes</button>
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
