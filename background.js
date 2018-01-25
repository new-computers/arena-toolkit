//----------------------------
// watch url & send to content
//----------------------------

var url = 'test';
// send: background -> content
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true },
      function(tabs) {

        if(tabs[0].url && tabs[0].id) {
          //console.log(tabs[0].url);

          // send to chrome storage
          chrome.storage.local.set(
            { "url": tabs[0].url },
            function(){}
          );
        }
      })
  }
});


// listen for storage changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];

    // purescript binding
    //var sendUrl = require('sendUrl');
    //sendUrl.urlIn(storageChange.newValue);

    console.log('key "%s" in namespace "%s" changed ' +
                '"%s" -> "%s"',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});
