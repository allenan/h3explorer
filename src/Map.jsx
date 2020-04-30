import React, { Component } from 'react';

import {
  geoToH3,
  polyfill,
} from 'h3-js';
import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import remove from 'lodash/remove';
import round from 'lodash/round';
import some from 'lodash/some';
import throttle from 'lodash/throttle';
import uniq from 'lodash/uniq';
import ReactMapboxGl, {
  RotationControl,
  ZoomControl,
} from 'react-mapbox-gl';
import { connect } from 'react-redux';

import Hex from './Hex';
import Inspector from './Inspector';
import { saveHex } from './shared/HttpService';
import WithErrorhandler from './shared/interceptor';
import { updateIndexes } from './store/action';

let isRemoving = false;
const MapBase = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_KEY,
  minZoom: 4,
  maxZoom: 16
});
var v3 = [[-73.9876, 40.7661], [-73.9397, 40.8002]];

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
    zoom: [10],
    center: [77.216721, 28.644800],
    resolution: 7,
    hexagons: [],
    hexagon: null,
    hoverHexagon: null,
    hoverFeatures: []
  }
  componentDidMount() {
    if (!navigator.geolocation) {
      alert("Location is not Supported")
    } else {
      navigator.geolocation.getCurrentPosition(res => {
        console.log(res);
        const { latitude, longitude } = res.coords;
        this.setState({ center: [longitude, latitude] })
      }, err => {
        console.log("ERRR", err)
      });
    }
    console.log("this.props", this.props)
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
    console.log("hexagon", hexagon)
    isRemoving = true;
    let param = {
      "h3_index": hexagon.address,
      "is_koino_active": 0,
      "is_wonderland": 0
    }
    saveHex(param).then(res => {
      if (res.hasOwnProperty('success') && res.success) {
        const indexes = [...this.props.indexes];
        let removedIndxes = remove(indexes,(v)=>{
          return v!==hexagon.address
        });
        this.props.updateIndexes(uniq(removedIndxes))
        console.log("save res", res);
      }
    })
    this.setState({ hexagon })
  }

  handleHoverHexagonClick = hexagon => {
    if (!isRemoving) {
      let param = {
        "h3_index": hexagon.address,
        "is_koino_active": 1,
        "is_wonderland": 0
      }
      saveHex(param).then(res => {
        if (res.hasOwnProperty('success') && res.success) {
        
          let address = hexagon.address;
          const indexes = [...this.props.indexes,address]
          this.props.updateIndexes(uniq(indexes))
  
          console.log("save res", res);
        }
      })
    }
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
    console.log("demo", map)
    const features = map.queryRenderedFeatures(e.point);
    if (features.length > 0) {
      const [a] = features;
      if (this.props.indexes.filter(v => v !== a.properties.address)) {
        isRemoving = false;
      }

    }
    if (!some(features, { properties: { class: 'hexagon' } })) {
      this.setState({ hexagon: null })
    }
  }

  getH3Address = lngLat => (
    geoToH3(lngLat.lat, lngLat.lng, this.state.resolution)
  )

  handleMapHover = throttle((map, e) => {
    const hoverFeatures = filter(map.queryRenderedFeatures(e.point), { properties: { type: 'hexagon' } })
    console.log(hoverFeatures)
    const hoverHexagon = { address: this.getH3Address(e.lngLat) }
    this.setState({ hoverHexagon, hoverFeatures })
  }, 100)

  render() {
    const { hexagons, hexagon, hoverHexagon, hoverFeatures } = this.state
    const { indexes } = this.props

    return (
      <MapBase
        style="mapbox://styles/mapbox/light-v9"
        center={this.state.center}
        onStyleLoad={(map) => { this.setState({ map }, this.handleReposition) }}
        onZoomEnd={this.handleZoomEnd}
        onDragEnd={this.handleDragEnd}
        onClick={this.handleMapClick}
        onMouseMove={this.handleMapHover}
        containerStyle={{
          height: "calc(100vh - 40px)",
          width: "100vw"
        }}
      // maxBounds={[68.1766451354, 7.96553477623, 97.4025614766, 35.4940095078]}
      >
        {/* {hexagons.map(address => <Hex key={address} address={address} />)} */}
        {indexes && indexes.map(address => (
          <Hex
            key={address}
            address={address}
            color="#006400"
            onClick={this.hexagonClick}
            onHover={this.handleHexagonHover}
            onHoverOff={this.handleHexagonHoverOff}
          />
        ))}
        {/* {hoverHexagon &&
          <Hex address={hoverHexagon.address} color="#999999" mapClass="hover-hexagon" onClick={this.handleHoverHexagonClick} />
        }
        {hoverFeatures.length > 0 &&
          <Inspector features={hoverFeatures} />
        } */}
        <ZoomControl />
        <RotationControl />
      </MapBase>
    )
  }
}
const mapStateToProps = ({ explorer }) => {
  return {
    indexes: explorer.indexes
  }
}
const mapDispatchToProps = {
  updateIndexes
}
export default connect(mapStateToProps, mapDispatchToProps)(WithErrorhandler(Map))
