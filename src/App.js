import React, { Component } from 'react';
import { Grid, Row, Col, FormControl, Button } from 'react-bootstrap';
import Image from './Image';
import { getImage } from './palette-maker';
import './App.css';
import $ from 'jquery';

class App extends Component {

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
      <div>
        <Grid>
          <Row>
            <Col md={6} mdOffset={3} className="text-center">
              <h1>Inspiration Generator</h1>
              <p>Images sourced from unsplash, palette algorithm from
                <a href="https://github.com/mattnedrich/palette-maker" rel="noopener noreferrer" target="_blank"> Matt Nedrich</a>
              </p>
            </Col>
          </Row>
          <Row>
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
        </Grid>
      </div>
    );
  }
}

export default App;
