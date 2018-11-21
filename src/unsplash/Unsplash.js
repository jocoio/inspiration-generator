import React, { Component } from 'react';
import { Row, Col, FormControl, Button } from 'react-bootstrap';
import Image from './Image';
import { getImage } from './palette-maker';
import $ from 'jquery';

class Unsplash extends Component {

  constructor() {
    super()
    this.getImages = this.getImages.bind(this);
  }

  getImages() {
    var searchterm = document.getElementById("term").value;

    $(".un-container")[0].firstChild.src = "https://source.unsplash.com/random/?" + searchterm + "/" + Math.random();
    getImage($(".un-container")[0].firstChild, $(".un-container")[0].childNodes[1]);

    $(".un-container")[1].firstChild.src = "https://source.unsplash.com/random/?" + searchterm + "/" + Math.random();
    getImage($(".un-container")[1].firstChild, $(".un-container")[1].childNodes[1]);

    $(".un-container")[2].firstChild.src = "https://source.unsplash.com/random/?" + searchterm + "/" + Math.random();
    getImage($(".un-container")[2].firstChild, $(".un-container")[2].childNodes[1]);
  }

  render() {
    return (
      <>
        <Row>
          <Col md={6} mdOffset={3}>
            <h3>Color Pallette Generator</h3>
            <p>Images sourced from unsplash, palette algorithm from
                <a href="https://github.com/mattnedrich/palette-maker" rel="noopener noreferrer" target="_blank"> Matt Nedrich</a>
            </p>
          </Col>
          <Col md={6} mdOffset={3} className="input-group">
            <FormControl
              id="term"
              type="text"
              placeholder="love, nature, etc."
            />
            <div className="input-group-btn">
              <Button bsStyle="primary" onClick={this.getImages} >Search</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Image />
          <Image />
          <Image />
        </Row>
      </>
    );
  }
}

export default Unsplash;
