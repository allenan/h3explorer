import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

const MapBase = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYWxsZW5hbiIsImEiOiJjamt0NWUxYnYwMXo0M3ZtbXc3ZHhsOTQ0In0.CpVrcaF8572K66VcvmNYDQ"
});

class Map extends Component {
  render() {
    return (
      <MapBase
      style="mapbox://styles/mapbox/light-v9"
      center={[-122.4194, 37.7749]}
      containerStyle={{
        height: "100vh",
        width: "100vw"
      }}>
      </MapBase>
    )
  }
}

export default Map
