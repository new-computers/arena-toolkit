
//---------------------------------------------------
// record background.js refresh flagging notification
//---------------------------------------------------

chrome.storage.local.set(
  { 'status': 'reloaded' },
  () => { console.log( '> background reloaded' ) }
)
