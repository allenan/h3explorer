import React, { Component } from 'react';

import uniq from 'lodash/uniq';
import { connect } from 'react-redux';

import Header from './Header';
import Map from './Map';
import Menu from './Menu';
import { getAllActiveHex } from './shared/HttpService';
import WithErrorhandler from './shared/interceptor';
import { updateIndexes } from './store/action';

class App extends Component {
  state = {
    indexes: this.props.indexes,
    menuOpen: false
  }
  componentDidMount() {
    console.log("PROPS",this.props)
    getAllActiveHex().then(res => {
      console.log("RES", res);
      if (res.hasOwnProperty('success') && res.success) {
        if (res.hasOwnProperty('data') && res.data.length > 0) {
          this.setState({ indexes: res.data });
          this.props.updateIndexes(res.data)
        }
      }
    })
  }

  handleIndexesChange = indexes => {
    console.log("indexes", indexes)
    this.setState({ indexes: uniq(indexes) })
  }

  handleToggleMenuOpen = () => {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  render() {
    const { indexes, menuOpen } = this.state
    console.log("INDEXEX", indexes);
    return (
      <div className="App">
        <Header onMenuClick={this.handleToggleMenuOpen} />
        {indexes && <Map indexes={indexes} onIndexesChange={this.handleIndexesChange} />}
        <Menu open={menuOpen} onIndexesChange={this.handleIndexesChange} />
      </div>
    );
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
export default connect(mapStateToProps, mapDispatchToProps)(WithErrorhandler(App));
