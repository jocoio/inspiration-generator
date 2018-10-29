var playlistSource = document.getElementById('playlist-template').innerHTML,
playlistTemplate = Handlebars.compile(playlistSource),
playlistPlaceholder = document.getElementById('playlist');

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

var search = function (query) {

  // Search for playlists call
  var params = getHashParams();
  var access_token = params.access_token

  $.ajax({
    url: 'https://api.spotify.com/v1/search',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      q: query,
      type: 'playlist'
    },
    success: function (response) {
      playlistPlaceholder.innerHTML = playlistTemplate(response);
      getImage();
    }
  });
};

document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  search(document.getElementById('query').value);
}, false);