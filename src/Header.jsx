import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Header extends Component {
  render() {
    return (
      <header className="Header">
        <h1 className="App-title">H3Explorer</h1>
        <div className="Header-actions">
          <button className="Header-btn" onClick={this.props.onMenuClick}>menu</button>
        </div>
      </header>
    )
  }
}

export default Header
