import React, { Component } from 'react';
import ReactMapboxGl, { ZoomControl,RotationControl} from "react-mapbox-gl";
import Hex from './Hex'
import {polyfill,geoToH3,} from 'h3-js'
import round from 'lodash/round'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import some from 'lodash/some'
import filter from 'lodash/filter'
import Inspector from './Inspector'

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
  return polyfill(polygon, resolution)
}

class Map extends Component {
  state = {
    map: null,
    zoom: [12],
    center: [-122.4194, 37.7749],
    resolution: 7,
    hexagons: [],
    hexagon: null,
    hoverHexagon: null,
    hoverFeatures: []
  }

  handleZoomEnd = e => {
    const { map } = this.state
    if (map) {
      const resolution = Math.min(Math.max(round(-0.978 + 0.683 * map.getZoom()), 0), 15)
      this.setState({ resolution }, this.fetchHexagons)
    }
  }

  handleDragEnd = e => {
    this.fetchHexagons()
  }

  fetchHexagons = debounce(() => {
    const { map, resolution } = this.state
    if (map) {
      const bounds = this.state.map.getBounds()
    }
  }, 1000, { leading: true, trailing: false })

  hexagonClick = hexagon => {
    this.setState({ hexagon })
  }

  handleHoverHexagonClick = hexagon => {
    const indexes = [...this.props.indexes, hexagon.address]
    this.props.onIndexesChange(indexes)
  }

  handleHexagonHover = () => {
    const { map } = this.state
    map.getCanvas().style.cursor = 'pointer'
  }

  handleHexagonHoverOff = () => {
    const { map } = this.state
    map.getCanvas().style.cursor = ''
  }

  handleMapClick = (map, e) => {
    const features = map.queryRenderedFeatures(e.point)
    if (!some(features, {properties: {class: 'hexagon'}})) {
      this.setState({hexagon: null})
    }
  }

  getH3Address = lngLat => (
    geoToH3(lngLat.lat, lngLat.lng, this.state.resolution)
  )

  handleMapHover = throttle((map, e) => {
    const hoverFeatures = filter(map.queryRenderedFeatures(e.point), {properties: {type: 'hexagon'}})
    console.log(hoverFeatures)
    const hoverHexagon = {address: this.getH3Address(e.lngLat)}
    this.setState({ hoverHexagon, hoverFeatures })
  }, 100)

  render() {
    const { hexagons, hexagon, hoverHexagon, hoverFeatures } = this.state
    const { indexes } = this.props

    return (
      <MapBase
        style="mapbox://styles/mapbox/light-v9"
        center={this.state.center}
        onStyleLoad={(map) => {this.setState({map}, this.handleReposition)}}
        onZoomEnd={this.handleZoomEnd}
        onDragEnd={this.handleDragEnd}
        onClick={this.handleMapClick}
        onMouseMove={this.handleMapHover}
        containerStyle={{
          height: "calc(100vh - 40px)",
          width: "100vw"
        }}
      >
        {hexagons.map(address => <Hex key={address} address={address} />)}
        {indexes.map(address => (
          <Hex
            key={address}
            address={address}
            color="#ff0000"
            onClick={this.hexagonClick}
            onHover={this.handleHexagonHover}
            onHoverOff={this.handleHexagonHoverOff}
          />
        ))}
        {hoverHexagon &&
          <Hex address={hoverHexagon.address} color="#999999" mapClass="hover-hexagon" onClick={this.handleHoverHexagonClick} />
        }
        {hoverFeatures.length > 0 &&
          <Inspector features={hoverFeatures} />
        }
        <ZoomControl />
        <RotationControl />
      </MapBase>
    )
  }
}

export default Map
