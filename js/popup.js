function clickHandler(element) {
  var issue_id = '';
  chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
    var url = tab[0].url;
    issue_id = url.replace('http://www.comicvine.com/', '').split('/')[1].split('-')[1];

    chrome.storage.sync.get('token', function(result) {
      var token = result.token;
      $.post('http://localhost:3000/add_issue', 'token=' + token + '&id=' + issue_id)
        .fail(function(json) {
          $('#error').text(json.responseJSON.error);
        })
        .success(function(json) {
          $('#num-issues').text(json.num_issues);
        });
    })
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#add-issue').addEventListener('click', clickHandler);
  chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
    chrome.storage.sync.get('token', function(result) {
      var token = result.token;
      
      var url = tab[0].url;
      issue_id = url.replace('http://www.comicvine.com/', '').split('/')[1].split('-')[1];

      $.getJSON('http://localhost:3000/get_number_of_issues.json?token=' + token + '&issue_id=' + issue_id, function(data) {
        $('#num-issues').text(data.number);
      });

    });
  });
  
})