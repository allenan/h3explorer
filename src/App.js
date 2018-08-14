import React, { Component } from 'react';
import Header from './Header'
import Map from './Map'
import Menu from './Menu'

class App extends Component {
  state = {
    indexes: [],
    menuOpen: false
  }

  handleIndexesChange = indexes  => {
    this.setState({ indexes })
  }

  handleToggleMenuOpen = () => {
    this.setState({ menuOpen: !this.state.menuOpen})
  }

  render() {
    const { indexes, menuOpen } = this.state

    return (
      <div className="App">
        <Header onMenuClick={this.handleToggleMenuOpen} />
        <Map indexes={indexes} />
        <Menu open={menuOpen} onIndexesChange={this.handleIndexesChange} />
      </div>
    );
  }
}

export default App;
