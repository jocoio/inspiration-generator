import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Unsplash from './unsplash/Unsplash';
import Spotify from './spotify/Spotify';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col md={6} mdOffset={3} className="text-center">
              <h1>Inspiration Generator</h1>
            </Col>
          </Row>
          <Row>
            <Spotify></Spotify>
          </Row>
          <Row>
            <Unsplash></Unsplash>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
