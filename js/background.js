var issue_id = '';
var image_url = '';

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
  issue_id = url.replace('http://www.comicvine.com/', '').split('/')[1];
  image_url = encodeURIComponent(e.srcUrl);

  chrome.runtime.sendMessage({type: 'request_name'});
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
