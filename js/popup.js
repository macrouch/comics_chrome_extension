show_username();

function clickHandler(element) {
  var issue_id = '';
  var volume_id = '';
  chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
    var url = tab[0].url;

    if (element.toElement.id == "add-volume") {
      volume_id = url.replace('http://www.comicvine.com/', '').split('/')[1];

      addVolume(volume_id)
    } else if (element.toElement.id == 'remove-volume') {
      volume_id = url.replace('http://www.comicvine.com/', '').split('/')[1];

      removeVolume(volume_id);
    } else if (element.toElement.id == 'add-issue') {
      issue_id = url.replace('http://www.comicvine.com/', '').split('/')[1];

      addIssue(issue_id);
    } else if (element.toElement.id == 'add-collected-edition') {
      collected_edition_id = url.replace('http://www.comicvine.com/', '').split('/')[1];

      addCollectedEdition(collected_edition_id);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#add-issue').addEventListener('click', clickHandler);
  document.querySelector('#add-collected-edition').addEventListener('click', clickHandler);
  document.querySelector('#add-volume').addEventListener('click', clickHandler);
  document.querySelector('#remove-volume').addEventListener('click', clickHandler);

chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
    setPopupButtons(tab);
  });

})
