
//---------------------
// attatch debug button
//---------------------

let arena_toolkit_debug = document.createElement( 'div' );

arena_toolkit_debug.setAttribute( 'id', 'arena_toolkit_debug' );
arena_toolkit.appendChild( arena_toolkit_debug );
arena_toolkit_debug.innerHTML = '<h6 class="arena_toolkit_debug_text">debug</h6>';


//-------------------
// debug toggle logic
//-------------------

chrome.storage.local.get( [ 'dev_state' ], function( debug ) {

  if( debug.dev_state == 'dev' ) {

    arena_toolkit_debug.classList.add( 'arena_toolkit_debug_dev' );

  } else {

    arena_toolkit_debug.classList.remove( 'arena_toolkit_debug_dev' );

  }

});

// debug button listener
arena_toolkit_debug.onclick = function() {

  if ( arena_toolkit_debug.classList.contains( 'arena_toolkit_debug_dev' ) ) {

    arena_toolkit_debug.classList.remove( 'arena_toolkit_debug_dev' );

    chrome.storage.local.set( { dev_state: 'default' } )

  } else {

    arena_toolkit_debug.classList.add( 'arena_toolkit_debug_dev' );

    chrome.storage.local.set( { dev_state: 'dev' } )

  }
}


//----------------------
// reloaded notification
//----------------------

function updateNotification( message, duration ) {

  let updated = document.createElement( 'h3' );

  updated.setAttribute('class', 'arena_toolkit_updated arena_toolkit_updated_hidden');
  updated.innerHTML = message;

  setTimeout( function() {
    updated.classList.remove( 'arena_toolkit_updated_hidden' );
    updated.classList.add( 'arena_toolkit_updated_visible' );
  }, 100 );

  setTimeout( function() {
    updated.classList.add( 'arena_toolkit_updated_hidden' )
  }, duration - 1000 );

  setTimeout( function() {
    updated.parentNode.removeChild( updated );
  }, duration );

  document.body.appendChild( updated );
}


// on content.js evaluation, retreive saved dev state
chrome.storage.local.get( [ 'status', 'dev_state' ], function( settings ) {

  if ( settings.status == 'reloaded' && settings.dev_state == 'dev' ) {

    // notification
    updateNotification( 'reloaded', 4000 );
    console.log( '> content reloaded' )

    // record reloaded message
    chrome.storage.local.set( { status: 'notified' } );
  }
});


//---------------
// resizing logic
//---------------

function toggleTool( tool ) {

  if ( tool.classList.contains( "arena_tool_closed" ) ) {

    tool.classList.add( "arena_tool_open" );
    tool.classList.remove( "arena_tool_closed" );

  } else {

    tool.classList.add( "arena_tool_closed" );
    tool.classList.remove( "arena_tool_open" );

  }
}

var arena_toolkit_tools = document.getElementsByClassName( 'arena_tool' );

// iterate through tools
[].forEach.call( arena_toolkit_tools, function ( tool ) {

  var current_tool = tool.id;

  // restore saved tool state
  chrome.storage.local.get( current_tool , function( settings ) {

   if( settings[ current_tool ] && settings[ current_tool ] == 'open' ) {

     toggleTool( tool );

   }

  });

  // add listener to toggle and save tool state
  tool.getElementsByClassName( 'arena_tool_resize' )[ 0 ].onclick = function() {

    if ( tool.classList.contains( "arena_tool_closed" ) ) {

      chrome.storage.local.set({ [ current_tool ]: 'open' })

    } else {

      chrome.storage.local.set({ [ current_tool ]: 'closed' })

    }

    toggleTool( tool );
  }

});
