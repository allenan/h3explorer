import React, { Component } from 'react';
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'

class Inspector extends Component {
  render() {
    const { features } = this.props
    const orderedFeatures = sortBy(uniqBy(features, 'properties.address'), 'properties.resolution')

    return (
      <div className="Inspector">
        <table>
          <tbody>
            {orderedFeatures.map(feature => (
              <tr key={`${feature.source}-${feature.properties.address}`}>
                <td>
                  {feature.properties.address}
                </td>
                <td>
                  {feature.properties.resolution}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>
    )

  }
}

export default Inspector
