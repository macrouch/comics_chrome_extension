// var comics_url = 'http://localhost:3000/';
var comics_url = 'http://comics.sleekcoder.com/';

function save_options() {
  var token = document.getElementById("token").value;
  var username = '';

  $.getJSON(comics_url + 'get_username.json?token=' + token, function(data) {
    username = data.username;

    chrome.storage.sync.set({'token': token, 'username': username}, function() {
      var status = document.getElementById("status");
      status.innerHTML = "Token Saved.";
      $("#token").val('');
      setTimeout(function() {
        status.innerHTML = "";
      }, 2000);
    });

    show_username();
  });
};

function show_username() {
  chrome.storage.sync.get('username', function(result) {
    username = result.username;
    $('#username').text(username);

    if (username.length == 0) {
      get_username();
    }
  })
};

function get_username() {
  var username = '';

  chrome.storage.sync.get('token', function(result) {
    var token = result.token;
    $.getJSON(comics_url + 'get_username.json?token=' + token, function(data) {
      username = data.username;
      $('#username').text(username);
    });


    chrome.storage.sync.set({'username': username}, function() {
      alert("set username as " + username)
    });
  });
};

function addVariant(name) {
  chrome.storage.sync.get('token', function(result) {
      var token = result.token;
      $.post(comics_url + 'add_variant', 'token=' + token + '&id=' + issue_id + '&image=' + image_url + '&name=' + name)
        .fail(function(json) {
          alert(json.responseJSON.error);
        })
        .success(function(json) {
          alert('Success, you now have ' + json.num_issues + ' issues');
        });
    });
};

function addIssue(issue_id) {
  chrome.storage.sync.get('token', function(result) {
    var token = result.token;
    $.post(comics_url + 'add_issue', 'token=' + token + '&id=' + issue_id)
      .fail(function(json) {
        $('#error').text(json.responseJSON.error);
      })
      .success(function(json) {
        $('#num-issues').text(json.num_issues);
      });
  });
};

function addVolume(volume_id) {
  chrome.storage.sync.get('token', function(result) {
    var token = result.token;
    $.post(comics_url + 'add_volume', 'token=' + token + '&id=' + volume_id)
      .fail(function(json) {
        $('#error').text(json.responseJSON.error);
      })
      .success(function(json) {
        $('#add-volume').hide();
        $('#remove-volume').show();
      })
  });
};

function removeVolume(volume_id) {
  chrome.storage.sync.get('token', function(result) {
    var token = result.token;
    $.post(comics_url + 'remove_volume', 'token=' + token + '&id=' + volume_id)
      .fail(function(json) {
        $('#error').text(json.responseJSON.error);
      })
      .success(function(json) {
        $('#add-volume').show();
        $('#remove-volume').hide();
      })
  });
};

function setPopupButtons(tab) {
  chrome.storage.sync.get('token', function(result) {
    var token = result.token;

    var url = tab[0].url;
    if (url.indexOf('4000-') != -1) {
      var issue_id = url.replace('http://www.comicvine.com/', '').split('/')[1];

      $('#volume-actions').hide();

      $.getJSON(comics_url + 'get_number_of_issues.json?token=' + token + '&issue_id=' + issue_id, function(data) {
        $('#num-issues').text(data.number);
      });
    } else if (url.indexOf('4050-') != -1) {
      var volume_id = url.replace('http://www.comicvine.com/', '').split('/')[1];

      $("#issue-actions").hide();

      $.getJSON(comics_url + 'volume_subscribed.json?token=' + token + '&volume_id=' + volume_id, function(data) {
        if (data.result) {
          $('#add-volume').hide();
          $('#remove-volume').show();
        } else {
          $('#add-volume').show();
          $('#remove-volume').hide();
        }
      });
    }

  });
};
