
// query files in toolkit directory
const filesInDirectory = dir => new Promise ( resolve => {
  dir.createReader ().readEntries ( entries =>
    Promise.all ( entries.filter ( e => e.name[ 0 ] !== '.' ).map ( e =>
      e.isDirectory
        ? filesInDirectory ( e )
        : new Promise ( resolve => e.file ( resolve ) )
      ) )
      .then ( files => [].concat ( ...files ) )
      .then ( resolve )
  )
});


// fetch last modified timestamps
const timestampForFilesInDirectory = dir =>
  filesInDirectory ( dir ).then (
    files => files.map ( f => f.name + f.lastModifiedDate ).join ()
  )


// reload Are.na tab if (last focused)
const reload = () => {

  chrome.tabs.query (
    { active: true, lastFocusedWindow: true },
    tabs => {
      if ( tabs[ 0 ] && tabs[ 0 ].url.indexOf( "are.na" ) > -1 ) {
        chrome.tabs.reload ( tabs[ 0 ].id );
      }
      chrome.runtime.reload ()
    }
  )

}


// watch for timestamp changes
const watchChanges = ( dir, lastTimestamp ) => {
  timestampForFilesInDirectory ( dir ).then (
    timestamp => {
      if ( !lastTimestamp || ( lastTimestamp === timestamp ) ) {
        setTimeout ( () => watchChanges ( dir, timestamp ), 1000 ) // retry after 1s
      } else {
        reload ()
        console.log( 'reloaded' );
      }
    }
  )
}


// initialize timestamp watch in development mode
chrome.management.getSelf ( self => {
  if ( self.installType === 'development' ) {
    chrome.runtime.getPackageDirectoryEntry ( dir => watchChanges ( dir ) )
  }
} );
