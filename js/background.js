// var comics_url = 'http://localhost:3000/';
var comics_url = 'http://comics.sleekcoder.com/';

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf('comicvine.com') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);


function contextHandler(e) {
  var url = e.pageUrl;
  var issue_id = url.replace('http://www.comicvine.com/', '').split('/')[1].split('-')[1];
  var image_url = e.srcUrl;
  var name = 'Testing Variant';

  chrome.storage.sync.get('token', function(result) {
      var token = result.token;
      $.post(comics_url + 'add_variant', 'token=' + token + '&id=' + issue_id + '&image=' + image_url + '&name=' + name)
        .fail(function(json) {
          // $('#error').text(json.responseJSON.error);
          alert('error');
        })
        .success(function(json) {
          alert(json.num_issues);
          // $('#num-issues').text(json.num_issues);
        });
    });
};

chrome.contextMenus.create({
  "title": 'Add This Variant',
  "contexts": ["image"],
  "onclick": contextHandler
});