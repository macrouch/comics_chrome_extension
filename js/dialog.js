document.forms[0].onsubmit = function(e) {
  e.preventDefault();
  var name = document.getElementById('name').value;
  var issue_id = '';
  var image_url = '';
  chrome.runtime.getBackgroundPage(function(bgWindow) {
    issue_id = bgWindow.issue_id;
    image_url = bgWindow.image_url;
    addVariant(name, issue_id, image_url);
    // window.close();
  });
};
