//----------------------------
// watch url & send to content
//----------------------------

// send: background -> content
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.tabs.query(
      { 'active': true, 'currentWindow': true },
      function(tabs) {
        const send_background_content = tabs[0].url;
        // console.log(send_background_content);
        chrome.tabs.sendMessage(
          tabs[0].id,
          { "message": send_background_content },
          function(response, sender, sendResponse) {
            console.log(response.message);
          }
        )
      }
    )
  }
});

// listen: content -> background
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request.message);
  const receipt_background_content = "receipt: background -> content"
  sendResponse({ message: receipt_background_content });
});
