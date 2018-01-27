//----------------------------
// watch url & send to content
//----------------------------

// add listener for chrome tab changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // filter out loading events
  if (changeInfo.status == 'complete') {
    // select the last active tab
    chrome.tabs.query(
      { 'active': true, 'lastFocusedWindow': true },
      function (tabs) {
        // discard empty objects
        if(tabs[0]) {
          // send to globally accessible chrome storage
          chrome.storage.local.set(
            { "url": tabs[0].url },
            function() {
              // console.log("wrote " + tabs[0].url + " to storage")
            }
          )
        }
      }
    )
  }
});


//---------------------------
// listen for storage changes
//---------------------------

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];

    // extract user/slug from url
    var user = storageChange.newValue.split("/")[3];
    var slug = storageChange.newValue.split("/")[4];

    // extract state from arena's sharify object
    // window.__sharifyData.USER.slug
    // window.__sharifyData.CHANNEL.slug
    // window.__sharifyData.CHANNEL.user_id
    // window.__sharifyData.CURRENT_ACTION

    // purescript binding
    var Bridge = PS.Bridge_MaybeNullable;
    Bridge.provide(storageChange.newValue);

    // log storage change
    console.log('key "%s" in namespace "%s" changed ' +
                '"%s" -> "%s"',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});
