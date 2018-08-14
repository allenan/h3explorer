import React, { Component } from 'react';
import ReactMapboxGl, { ZoomControl, ScaleControl, RotationControl } from "react-mapbox-gl";
import Hex from './Hex'
import h3 from 'h3-js'
import round from 'lodash/round'
import debounce from 'lodash/debounce'

const MapBase = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYWxsZW5hbiIsImEiOiJjamt0NWUxYnYwMXo0M3ZtbXc3ZHhsOTQ0In0.CpVrcaF8572K66VcvmNYDQ"
});

const getPolyfill = (bounds, resolution) => {
  const polygon = [
    [bounds._ne.lat, bounds._sw.lng],
    [bounds._ne.lat, bounds._ne.lng],
    [bounds._sw.lat, bounds._ne.lng],
    [bounds._sw.lat, bounds._sw.lng],
  ];
  return h3.polyfill(polygon, resolution)
}

class Map extends Component {
  state = {
    map: null,
    zoom: [12],
    center: [-122.4194, 37.7749],
    resolution: 8,
    hexagons: []
  }

  handleZoomEnd = e => {
    const { map } = this.state
    if (map) {
      const resolution = round(0.5 * map.getZoom() + 2)
      this.setState({ resolution }, this.fetchHexagons)
    }
  }

  handleDragEnd = e => {
    this.fetchHexagons()
  }

  fetchHexagons = debounce(() => {
    console.log("fetch hexagons")
    const { map, resolution } = this.state
    if (map) {
      const bounds = this.state.map.getBounds()
      // console.log(getPolyfill(bounds, resolution))
      // this.setState({ hexagons: getPolyfill(bounds, resolution) })
    }
  }, 1000, { leading: true, trailing: false })

  render() {
    const { hexagons } = this.state
    const { indexes } = this.props

    return (
      <MapBase
      style="mapbox://styles/mapbox/light-v9"
      center={this.state.center}
      onStyleLoad={(map) => {this.setState({map}, this.handleReposition)}}
      onZoomEnd={this.handleZoomEnd}
      onDragEnd={this.handleDragEnd}
      containerStyle={{
        height: "calc(100vh - 40px)",
        width: "100vw"
      }}>
        <Hex address="87283472bffffff" />
        {hexagons.map(address => <Hex key={address} address={address} />)}
        {indexes.map(address => <Hex key={address} address={address} color="#ff0000" />)}
        <ZoomControl />
        <RotationControl />
        <ScaleControl />
      </MapBase>
    )
  }
}

export default Map
