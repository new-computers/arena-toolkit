
//----------------------------
// indicate background refresh
//----------------------------

chrome.storage.local.set(
  { 'status': 'reloaded' },
  () => { console.log( '> background reloaded' ) }
)
