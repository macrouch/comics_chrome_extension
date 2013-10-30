document.forms[0].onsubmit = function(e) {
  e.preventDefault();
  var name = document.getElementById('name').value;
  chrome.runtime.getBackgroundPage(function(bgWindow) {
    bgWindow.addVariant(name);
    window.close();
  });
};
