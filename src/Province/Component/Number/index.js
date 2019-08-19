

import React, { Component } from 'react';
import './index.css';


class Number extends Component {

  state = {
  }
  render() {
    const { value } = this.props;
    return (
      <div className="number-wrap">
        {value}
      </div>
    );
  }
}

export default Number;