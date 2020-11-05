import React, { Component } from 'react';
import MapComponent from './components/Map/MapComponent';
import MapTest from './components/Map/MapTest';
import Header from './components/Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

import Location from "./LocationComponent";
import UserForm from "./UserForm";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "San Jose"
    }
    this.mapTest = React.createRef();
  }

  updateLocations = () => {
    console.log("in updatelocations");
    this.mapTest.current.logValue(this.state.address);
  }

  onChange = (e) => {
    let address = e.target.value;
    this.setState({address});
  }


  render() {
    return (
      <div className="App">
        <Header
          updateLocations={ this.updateLocations}
          onChange={this.onChange}
          address={this.state.address}/>
        <MapTest ref={this.mapTest} />


          <h2 className="is-size-4">
              We'll use the React Context API to pass and receive data in
              any component.
            </h2>
            <div className="container">
              <UserForm />

              <h2 className="is-size-4">Display User Info Here 👇</h2>
              <p>
                These two children components will receive data. These could
                be nested components.
              </p>
              <Location />
            </div>
      </div>
    );
  }
}

export default App;
