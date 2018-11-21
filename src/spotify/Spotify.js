import React, { Component } from 'react';
import { Row, Col, FormControl, Button } from 'react-bootstrap';
import $ from 'jquery';

class Spotify extends Component {

  constructor() {
    super()
    this.getSongs = this.getSongs.bind(this);
  }

  getSongs() {
    var request = require('request'); // "Request" library

    var client_id = ''; // Your client id
    var client_secret = ''; // Your secret

    // your application requests authorization
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    };

    console.log("reached");

    request.post(authOptions, function (error, response, body) {
      console.log("here");
      if (!error && response.statusCode === 200) {

        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var options = {
          url: 'https://api.spotify.com/v1/users/jmperezperez',
          headers: {
            'Authorization': 'Bearer ' + token,
          },
          json: true
        };
        request.get(options, function (error, response, body) {
          console.log(body)
          return body
        });
      }
      else {
        console.log("Error calling API:");
        console.log(error);
      }
    });


    console.log("reached");
  }

  render() {
    console.log(this.getSongs())
    return (
      <>
        <Row>
          <Col md={6} mdOffset={3}>
            <h3>Spotify Song Selector</h3>
            <p>Grabs a variety of songs, with audio previews</p>
          </Col>
          <Col md={6} mdOffset={3} className="input-group">
            <FormControl
              id="term"
              type="text"
              placeholder="search for a song"
            />
            <div className="input-group-btn">
              <Button bsStyle="primary" onClick={this.getSongs} >Search</Button>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

export default Spotify;
