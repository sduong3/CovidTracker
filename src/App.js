import React, { Component } from 'react';
import MapComponent from './components/Map/MapComponent';
import Header from './components/Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';


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
        <MapComponent ref={this.mapTest} />

      </div>
    );
  }
}

export default App;
