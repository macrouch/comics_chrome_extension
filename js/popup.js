// var comics_url = 'http://localhost:3000/';
var comics_url = 'http://comics.sleekcoder.com/';

// TODO break this up into three click handlers
function clickHandler(element) {
  var issue_id = '';
  var volume_id = '';
  chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
    var url = tab[0].url;

    if (element.toElement.id == "add-volume") {
      volume_id = url.replace('http://www.comicvine.com/', '').split('/')[1];

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
    } else if (element.toElement.id == 'remove-volume') {
      volume_id = url.replace('http://www.comicvine.com/', '').split('/')[1];

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
    } else if (element.toElement.id == 'add-issue') {
      issue_id = url.replace('http://www.comicvine.com/', '').split('/')[1];

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
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#add-issue').addEventListener('click', clickHandler);
  document.querySelector('#add-volume').addEventListener('click', clickHandler);
  document.querySelector('#remove-volume').addEventListener('click', clickHandler);
  chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
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
  });

})
