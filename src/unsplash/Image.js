import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

const colStyles = {
  backgroundColor: "#eeeeee",
  minHight: '50px',
  borderRadius: '5px',
  boxShadow: '0 3px 6px rgba(0,0,0,0.16)'
}

class Image extends Component {

  render() {
    return (
      <Col className="un-container" md={4}>
        <img style={colStyles} className="un-image" alt="unsplash"></img>
        <div id="histogram-output">
          <div id="histogram-palette"></div>
        </div>
      </Col>
    );
  }
}

export default Image;
