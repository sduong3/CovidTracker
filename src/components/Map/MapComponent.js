import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import axios from '../../axios-markers';
import classes from './MapComponent.module.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';


const MapComponent = forwardRef((props, ref) => {

  const mapStyles = {
    height: "100vh",
    width: "100%"};

  const defaultCenter = {
    // middle of San Francisco
    lat: 36.9915,
    lng: -119.7889
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

  // Relative information regarding aggregated data section
  const [searchedLocation, setSearchedLocation] = useState("San Francisco");
  const [searchedState, setSearchedState] = useState("California");

  const [stateConfirmedCases, setStateConfirmedCases] = useState("N/A");
  const [stateDeaths, setStateDeaths] = useState("N/A");
  const [stateRecovered, setStateRecovered] = useState("N/A");
  const [stateDate, setStateDate] = useState("N/A");
  const [stateLastUpdate, setStateLastUpdate] = useState("N/A");

  const [cityConfirmedCases, setCityConfirmedCases] = useState("N/A");
  const [cityDeaths, setCityDeaths] = useState("N/A");
  const [cityRecovered, setCityRecovered] = useState("N/A");
  const [cityDate, setCityDate] = useState("N/A");
  const [cityLastUpdate, setCityLastUpdate] = useState("N/A");

  //const [foundStateFlag, setFoundStateFlag] = useState(false);
  //const [foundCityFlag, setFoundCityFlag] = useState(false);

  let foundCityFlag = false;
  let foundStateFlag = false;
  let searchedAddress = "";

  // Workaround to pass function reference from child to parent
  // function logValue() {}
  useImperativeHandle(ref, () => ({
     logValue
    }));

    function logValue (appAddress) {
      setSearchedLocation(appAddress);
      getCoordinates(appAddress);
   }

   const [launchFlag, setLaunchFlag] = useState(true);

   // Only runs at launch.
   // First, retrieve the values in the database.
   // Then,
   function getLocationsOnLaunch() {
     if (launchFlag) {
       updateCovidCountFromDatabase();

       getLocations(searchedState, "San Francisco");
       setLaunchFlag(false);
     }
   }

   useEffect(() => {
     getLocationsOnLaunch();
   })

  function getLocations(state, address) {
//  setFoundCityFlag(false);
//    setFoundStateFlag(false);
    foundCityFlag = false;

    fetch("https://covid-api.com/api/reports?date=2020-04-16&iso=USA&region_province=" + state)
      .then(response => response.json())
      .then(data => {
        // first block contains state specific data
        // store these fields in hooks to be used in aggregated data
        let tempState = data.data[0];
        setStateConfirmedCases(tempState.confirmed);
        setStateDeaths(tempState.deaths);
        setStateRecovered(tempState.recovered);
        setStateDate(tempState.date);
        setStateLastUpdate(tempState.last_update);

        for(var x = 0; x < data.data[0].region.cities.length; x++) {
            let tempCity = data.data[0].region.cities[x];


            tempCity.location = {lat: tempCity.lat, lng: tempCity.long};

            if (dictionary[tempCity.fips]) {
              tempCity.confirmed = dictionary[tempCity.fips].cases;
            }

            tempCity.location.lat = parseFloat(tempCity.location.lat);
            tempCity.location.lng = parseFloat(tempCity.location.lng);

            location.push(tempCity);


              if (tempCity.name == address) {
                setCityConfirmedCases(tempCity.confirmed);
                setCityDeaths(tempCity.deaths);
                setCityRecovered(tempCity.recovered);
                setCityDate(tempCity.date);
                setCityLastUpdate(tempCity.last_update);
                foundCityFlag = true;
            }
        }

        if (foundCityFlag == false) {
            setCityConfirmedCases("N/A");
            setCityDeaths("N/A");
            setCityRecovered("N/A");
            setCityDate("N/A");
            setCityLastUpdate("N/A");
        }

        // TODO: search for specified city if exist
        // use react hooks to save relative data


        setLocations(location);
        setZoom(7);
      })
      .catch(error => {
        alert("Please enter a location in the United States");

        setSearchedState("N/A");
        setSearchedLocation("N/A");
        setStateConfirmedCases("N/A");
        setStateDeaths("N/A");
        setStateRecovered("N/A");
        setStateDate("N/A");
        setStateLastUpdate("N/A");

        setCityConfirmedCases("N/A");
        setCityDeaths("N/A");
        setCityRecovered("N/A");
        setCityDate("N/A");
        setCityLastUpdate("N/A");
      });
  }

// This simply retrieves the correct state name from the entered search
  function getCoordinates(address){
    // console.log("in getcoordinares, address is " + address);
    // setSearchedLocation(address);
    // console.log("in getCoordinates, searchedAddress1 is " + searchedLocation);
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyD8Dy_5tEaquXe9u861bwg0C-78KOrBC4o")
      .then(response => response.json())
      .then(data => {
        setCurrentPosition(data.results[0].geometry.location) // Note: Look into making this marker a diff color
        var state = "";
        for(var x = 0; x < data.results[0].address_components.length; x++) {
          if(data.results[0].address_components[x].types[0] == 'administrative_area_level_1') {
            state = data.results[0].address_components[x].long_name;
            break;
          }
        }
        //setSearchedLocation(address);
        //console.log("in getCoordinates, searchedAddress is " + searchedLocation);

        setSearchedState(state);
        getLocations(state, address);
      })
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



function createHotSpot(mapProps, map, clickEvent) {
  console.log(currentPosition);
  console.log(mapProps);

  setHotspotCoord(
    {lat: mapProps.latLng.lat(), lng: mapProps.latLng.lng()}
  );
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


      <Container style={{ padding: 20 }}>
  <Row>
    <Col xs={12} md={8}>
      <LoadScript
        googleMapsApiKey='AIzaSyD8Dy_5tEaquXe9u861bwg0C-78KOrBC4o'>
         <GoogleMap
           mapContainerStyle={mapStyles}
           zoom={currentZoom ? currentZoom : defaultZoom}
           center={currentPosition.lat ? currentPosition : defaultCenter}
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


    </Col>
    <Col xs={6} md={4}>
      <Row>
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
      </Row>
      <Row>
        <div>
          <h4>State Statistics for {searchedState}</h4>
            <ListGroup>
              <ListGroup.Item><strong>Confirmed cases: </strong>{stateConfirmedCases}</ListGroup.Item>
              <ListGroup.Item><strong>Deaths: </strong>{stateDeaths}</ListGroup.Item>
              <ListGroup.Item><strong>Recovered: </strong>{stateRecovered}</ListGroup.Item>
              <ListGroup.Item><strong>Date: </strong>{stateDate}</ListGroup.Item>
              <ListGroup.Item><strong>Last Update: </strong>{stateLastUpdate}</ListGroup.Item>
            </ListGroup>

          <h4>City Specific Statistics for {searchedLocation}</h4>
            <ListGroup>
              <ListGroup.Item><strong>Confirmed cases: </strong>{cityConfirmedCases}</ListGroup.Item>
              <ListGroup.Item><strong>Deaths: </strong>{cityDeaths}</ListGroup.Item>
              <ListGroup.Item><strong>Recovered: </strong>{cityRecovered}</ListGroup.Item>
              <ListGroup.Item><strong>Date: </strong>{cityDate}</ListGroup.Item>
              <ListGroup.Item><strong>Last Update: </strong>{cityLastUpdate}</ListGroup.Item>
            </ListGroup>
        </div>


      </Row>

    </Col>
  </Row>

</Container>




  )
})

export default MapComponent;
