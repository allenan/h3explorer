import React, { Component } from 'react';

class Menu extends Component {
  handleIndexesChange = e => {
    const indexes = e.target.value
      .split(/\s+/g)
      .map(value => value.replace(/[^a-fA-F0-9]/g, ''))
    this.props.onIndexesChange(indexes)
  }

  render() {
    const { open } = this.props
    const menuClasses = ["Menu"]
    if (open) menuClasses.push("Menu-open")

    return (
      <div className={menuClasses.join(" ")}>
        <h4 className="Menu-label">H3 Indexes:</h4>
        <textarea className="Menu-indexControl" onChange={this.handleIndexesChange}></textarea>
      </div>
    )
  }
}

export default Menu
