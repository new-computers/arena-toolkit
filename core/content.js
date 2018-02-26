
//-----------------------------------
// debug logic & refresh notification
//-----------------------------------

// attatch debug button
const arena_toolkit_debug = document.createElement( 'div' );

arena_toolkit_debug.setAttribute( 'id', 'arena_toolkit_debug' );
arena_toolkit.appendChild( arena_toolkit_debug );
arena_toolkit_debug.innerHTML = '<h6 class="arena_toolkit_debug_text">debug</h6>';


// notification display function
const updateNotification = ( message, duration ) => {

  let updated = document.createElement( 'h3' );

  updated.setAttribute('class', 'arena_toolkit_updated arena_toolkit_updated_hidden');
  updated.innerHTML = message;

  setTimeout( () => {
    updated.classList.remove( 'arena_toolkit_updated_hidden' );
    updated.classList.add( 'arena_toolkit_updated_visible' );
  }, 100 );

  setTimeout( () => {
    updated.classList.add( 'arena_toolkit_updated_hidden' )
  }, duration - 1000 );

  setTimeout( () => {
    updated.parentNode.removeChild( updated );
  }, duration );

  document.body.appendChild( updated );
}


// fetch and reconstitute debug state
chrome.storage.local.get( [ 'status', 'dev_state' ], ( settings ) => {

  if( settings.dev_state == 'dev' ) {

    arena_toolkit_debug.classList.add( 'arena_toolkit_debug_dev' );

  } else {

    arena_toolkit_debug.classList.remove( 'arena_toolkit_debug_dev' );

  }

  if ( settings.status == 'reloaded' && settings.dev_state == 'dev' ) {

    // notification
    updateNotification( 'reloaded', 4000 );
    console.log( '> content reloaded' )

    // record reloaded message
    chrome.storage.local.set( { status: 'notified' } );
  }
});


// add debug button listener
arena_toolkit_debug.onclick = () => {

  if ( arena_toolkit_debug.classList.contains( 'arena_toolkit_debug_dev' ) ) {

    arena_toolkit_debug.classList.remove( 'arena_toolkit_debug_dev' );

    chrome.storage.local.set( { dev_state: 'default' } )

  } else {

    arena_toolkit_debug.classList.add( 'arena_toolkit_debug_dev' );

    chrome.storage.local.set( { dev_state: 'dev' } )

  }
}


//------------------------------
// tool container resizing logic
//------------------------------

arenaContext.then( () => {  // perform after Are.na info fetched & tools loaded

  // toggle tool state function
  let toggleTool = ( tool, state ) => {

    if ( state == 'open' ) {

      tool.classList.add( "arena_tool_open" );
      tool.classList.remove( "arena_tool_closed" );

      document.body.classList.add( tool.id + '_open' );
      document.body.classList.remove( tool.id + '_closed' );

    } else {

      tool.classList.add( "arena_tool_closed" );
      tool.classList.remove( "arena_tool_open" );

      document.body.classList.add( tool.id + '_closed' );
      document.body.classList.remove( tool.id + '_open' );

    }
  }

  let arena_toolkit_tools = document.getElementsByClassName( 'arena_tool' );

  // iterate through tools
  [].forEach.call( arena_toolkit_tools, ( tool ) => {

    let current_tool = tool.id;

    // restore saved tool state
    chrome.storage.local.get( current_tool , ( settings ) => {

     if( settings[ current_tool ] && settings[ current_tool ] == 'open' ) {

       toggleTool( tool, 'open' );

     } else {

       toggleTool( tool, 'closed' );

     }

    });

    // add listener to toggle and save tool state
    tool.getElementsByClassName( 'arena_tool_resize' )[ 0 ].onclick = () => {

      if ( tool.classList.contains( "arena_tool_closed" ) ) {

        chrome.storage.local.set({ [ current_tool ]: 'open' })

        toggleTool( tool, 'open' );

      } else {

        chrome.storage.local.set({ [ current_tool ]: 'closed' })

        toggleTool( tool, 'closed' );

      }

    }

  });

});
