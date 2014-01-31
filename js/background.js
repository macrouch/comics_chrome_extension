// var comics_url = 'http://localhost:3000/';
var comics_url = 'http://comics.sleekcoder.com/';

var issue_id = '';
var image_url = ''

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf('comicvine.com') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Context menu for adding variant covers
function contextHandler(e) {
  var url = e.pageUrl;
  issue_id = url.replace('http://www.comicvine.com/', '').split('/')[1]; //.split('-')[1];
  image_url = e.srcUrl;

  chrome.runtime.sendMessage({type: 'request_name'});
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

chrome.contextMenus.create({
  "title": 'Add This Variant',
  "contexts": ["image"],
  "onclick": contextHandler
});

// Popup dialog to input the name of the variant
chrome.runtime.onMessage.addListener(function(request) {
  if (request.type === 'request_name') {
    chrome.tabs.create({
      url: chrome.extension.getURL('dialog.html'),
      active: false
    }, function(tab) {
      chrome.windows.create({
        tabId: tab.id,
        type: 'popup',
        focused: true,
        width: 300,
        height: 100
      });
    });
  }
});
