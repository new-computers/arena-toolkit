//----------------------------
// watch url & send to content
//----------------------------

// add listener for chrome tab changes
chrome.tabs.onUpdated.addListener( function( tabId, changeInfo, tab ) {
  // filter out loading events
  if ( changeInfo.status == 'complete' ) {
    // select the last active tab
    chrome.tabs.query(
      { 'active': true, 'lastFocusedWindow': true },
      function( tabs ) {
        // discard empty objects
        if ( tabs[ 0 ] ) {
          // continue if last focused is are.na page
          if( tabs[ 0 ].url.indexOf( 'are.na' ) > -1 ) {
            // send to globally accessible chrome storage
            chrome.storage.local.set(
              { 'url': tabs[ 0 ].url },
              function() {
                console.log(tabs[0]);
                // console.log( 'wrote ' + tabs[ 0 ].url + ' to storage')
              }
            )
          }
        }
      }
    )
  }
});


chrome.storage.local.set(

  { 'status': 'reloaded' },

  function() {
    console.log( '> background reloaded' )
  }
)


//---------------------------
// listen for storage changes
//---------------------------

chrome.storage.onChanged.addListener( function( changes, namespace ) {

  for( key in changes ) {

    let storageChange = changes[ key ];

    if( storageChange.newValue.indexOf( 'are.na' ) > -1 ) {

      // extract user/slug from url
      let user = storageChange.newValue.split( '/' )[ 3 ];
      let slug = storageChange.newValue.split( '/' )[ 4 ];

      // purescript binding
      // var Bridge = PS.Bridge_MaybeNullable;
      // Bridge.provide( storageChange.newValue );

      // log storage change
      console.log( 'key "%s" in namespace "%s" changed ' +
                   '"%s" -> "%s"',
                   key,
                   namespace,
                   storageChange.oldValue,
                   storageChange.newValue );
    }
  }
});
