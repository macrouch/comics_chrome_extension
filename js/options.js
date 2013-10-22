// var comics_url = 'http://localhost:3000/';
var comics_url = 'http://comics.sleekcoder.com/';

function save_options() {
  var token = document.getElementById("token").value;
  var username = '';

  $.getJSON(comics_url + 'get_username.json?token=' + token, function(data) {
    username = data.username;
  });

  chrome.storage.sync.set({'token': token, 'username': username}, function() {
    var status = document.getElementById("status");
    status.innerHTML = "Token Saved.";
    setTimeout(function() {
      status.innerHTML = "";
    }, 2000);
  });

  show_username();
}

function show_username() {
  chrome.storage.sync.get('token', function(result) {
    var token = result.token;
    var username = '';
    $.getJSON(comics_url + 'get_username.json?token=' + token, function(data) {
      username = data.username;
      $('#username').text(username);
    });


    chrome.storage.sync.set({'username': username}, function() {

    });
  });
}

document.querySelector('#save').addEventListener('click', save_options);

document.addEventListener('DOMContentLoaded', show_username);