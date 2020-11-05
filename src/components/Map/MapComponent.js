import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
//import axios from 'axios';

// const mapStyles = {
//   height: "100vh",
//   width: "100%"
// }
//
// const defaultCenter = {
//   // middle of San Jose
//   lat: 37.3382,
//   lng: -121.8863
// }
//
// const defaultZoom = 12;
//
// const tempLocations = [{latitude: 37.49855629475769, longitude: -100.14184416996333},
//               {latitude: 38.2872, longitude: -121.949959},
//               {latitude: 37.3541, longitude: -121.9552},
//               {latitude: 37.3230, longitude: -122.0322},
//               {latitude: 39.3084488, longitude: -122.2140121},
//               {latitude: 39.5524695, longitude: -122.0425407}];
//
// const url = "https://covid-api.com/api/regions";



const MapContainer = () => {

  // Initial map at center of San Jose
  // Retrieve aall zip codes in this area
  //    Calculate
  // state = {
  //   locations: tempLocations
  // }

  const mapStyles = {
    height: "100vh",
    width: "100%"
  }

  const defaultCenter = {
    // middle of San Jose
    lat: 37.3382,
    lng: -121.8863
  }

  const defaultZoom = 12;

  const tempLocations = [{latitude: 37.49855629475769, longitude: -100.14184416996333},
                {latitude: 38.2872, longitude: -121.949959},
                {latitude: 37.3541, longitude: -121.9552},
                {latitude: 37.3230, longitude: -122.0322},
                {latitude: 39.3084488, longitude: -122.2140121},
                {latitude: 39.5524695, longitude: -122.0425407}];

  const url = "https://covid-api.com/api/regions";

  const [currentZoom, setZoom] = useState(13);
  let location = [];
  const [locations, setLocations] = useState(tempLocations);
  const [address, setAddress] = useState("");

  const handleSearch = event => {
    setAddress(event.target.value);
  }
  const [ selected, setSelected ] = useState({});
  const onSelect = item => {
    setSelected(item);
  }

  const [ currentPosition, setCurrentPosition ] = useState([]);

// Where are we passing in position???
  // const success = position => {
  //   const currentPosition = {
  //     lat: position.coords.latitude,
  //     lng: position.coords.longitude
  //   }
  //   setCurrentPosition(currentPosition);
  // }
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(success);
  // })

  const logValue = () => {
    getCoordinates(address);
  }

  function getCoordinates(address) {
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyD5BfSc3VnjoKFB1ORmG8V-0fgN5PfX5Kk")
      .then(response => response.json())
      .then(data => {
        setCurrentPosition(data.results[0].geometry.location)
        let state = "";
        for (let x = 0; x < data.results[0].address_components.length; x++) {
          if (data.results[0].address_components[x].types[0] == 'administrative_area_level_1') {
            state = data.results[0].address_components[x].long_name;
            break;
          }
        }
        getLocationsInState(state);
      })
  }



  function getLocationsInState(state) {
    fetch("https://covid-api.com/api/reports?date=2020-04-16&iso=USA&region_province=" + state)
      .then(response => response.json())
      .then(data => {
        for (let x = 0; x < data.data[0].region.cities.length; x++) {
          data.data[0].region.cities[x].location = {
            lat: data.data[0].region.cities[x].lat,
            lng: data.data[0].region.cities[x].long};
          data.data[0].region.cities[x].location.lat = parseFloat(data.data[0].region.cities[x].location.lat);
          data.data[0].region.cities[x].location.lng = parseFloat(data.data[0].region.cities[x].location.lng);

          location.push(data.data[0].region.cities[x]);
        }
        setLocations(location);
        setZoom(19);
      })
  }

  function mapClicked(mapProps, map, clickEvent) {
    console.log(mapProps);
  }
  // constructor(props) {
  //   super(props);
  //   this.getNewHotspot = this.getNewHotspot.bind(this);
  // }

  // componentDidMount() {
  //   console.log("mounted");
  //
  //   // Fetch COVID-19 counts based on zip code
  //   axios.get(url)
  //     .then(res => {
  //       const temp = res.data;
  //       console.log(temp);
  //     })
  //     .catch(() => console.log("Can't access response. Blocked by browser?" ))
  //
  // }

  // getNewHotspot() {
  //   //alert("Getting new hotspot using radius");
  //   console.log("clicked");
  //   let tempLocations2 = [{latitude: 37.3230, longitude: -122.0322}];
  //   tempLocations2[0].circle = {
  //     radius: 3000,
  //     options: {
  //       strokeColor: "#ff0000"
  //     }
  //   };
  //
  //   this.setState({
  //     locations : tempLocations2
  //   })
  //   //console.log(this.state.locations);
  // };


// Note: not used atm
  function displayMarkers() {
    //console.log(this.state.locations);

    return locations.map((location, index) => {
      return <Marker key={index} id={index} position={{
        lat: location.latitude,
        lng: location.longitude
      }}
      onClick={() => console.log("You clicked me!")} />
    })
  }

    return (
      // initialize map
      <>
      <div className="input-group mb-3">
                <input onChange={handleSearch} className="form-control border-0 shadow-0 bg-gray-200" id="search_search" placeholder="Search" aria-label="Search"/>
                <div className="input-group-append">
                  <button onClick={logValue} className="btn btn-secondary" type="reset">Search</button>
                </div>
        </div>
      <LoadScript
        googleMapsApiKey='AIzaSyD8Dy_5tEaquXe9u861bwg0C-78KOrBC4o'>
          <GoogleMap
            mapContainerStyle= {mapStyles}
            zoom={defaultZoom}
            center={defaultCenter}
          >
           {
             //displayMarkers

             locations.map((location, index) => {
               return <Marker key={index} id={index} position={{
                 lat: location.latitude,
                 lng: location.longitude
               }}
               onClick={() => console.log("You clicked me!")} />
             })
          }
         </GoogleMap>
        </LoadScript>
        </>
    )
}

export default MapContainer;
