import React, { Component } from 'react';
import { Layer, Feature } from 'react-mapbox-gl'
import h3 from 'h3-js'
import reverse from 'lodash/reverse'

class Hex extends Component {
  render() {
    const { address, color } = this.props

    const paint = {
      'fill-color': color || '#eeeeee',
      'fill-opacity': 0.1,
      'fill-outline-color': '#000000',
    }

    const coordinates = h3.h3ToGeoBoundary(address).map(c => reverse(c))

    return (
      <Layer
        type="fill"
        paint={paint}
        before="waterway-label"
      >
        <Feature coordinates={[coordinates]} />
      </Layer>
    )
  }
}

export default Hex
