
//----------------------------
// indicate background refresh
//----------------------------

chrome.storage.local.set(
  { 'status': 'reloaded' },
  function() { console.log( '> background reloaded' ) }
)


//---------------------------
// listen for storage changes
//---------------------------

chrome.storage.onChanged.addListener( function( changes, namespace ) {

  for( key in changes ) {

    let storageChange = changes[ key ];

    if( storageChange.newValue.indexOf( 'are.na' ) > -1 ) {

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
