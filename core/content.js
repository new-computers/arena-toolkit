
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


//----------------------------------------
// listen for context data from page relay
//----------------------------------------

var current_slug  = '';
var current_title = '';

window.addEventListener( 'message', function( event ) {

  // only window data
  if ( event.source != window ) { return; }

  if ( event.data.type && event.data.type == 'arena_data' ) {

    var arena_data   = event.data.object;
    var current_path = arena_data.CURRENT_PATH;

    if ( arena_data.CURRENT_ACTION ) {

      if ( arena_data.CURRENT_ACTION == 'channel' ) {

        current_slug  = arena_data.CHANNEL.slug;
        current_title = arena_data.CHANNEL.title;
        // arena_data.CHANNEL.id
        // arena_data.CHANNEL.status
        // arena_data.CHANNEL.user.id
        // arena_data.CHANNEL.user.slug
        // arena_data.CHANNEL.user.full_name

      } else if ( arena_data.CURRENT_ACTION == 'profile' ) {

        current_slug  = arena_data.USER.slug;
        current_title = arena_data.USER.username;
        // arena_data.USER.profile_id
        // arena_data.USER.avatar_image.display

      }
    }
  }

  function getStored( callback ) {
    chrome.storage.local.get(
      [ 'slugs', 'titles' ],

      function ( data ) {

        var slugs;
        var titles;

        if ( data.slugs && data.titles && current_slug && current_title ) {
          slugs  = [ current_slug ].concat( data.slugs );
          titles = [ current_title ].concat( data.titles );
        } else if ( data.slugs && data.titles ){
          slugs  = data.slugs;
          titles = data.titles;
        } else if ( current_slug && current_title ) {
          slugs  = [ current_slug ]
          titles = [ current_title ]
        }

        callback( { slugs: slugs, titles: titles } )
      }
    )
  }

  //--------
  // history
  //--------

  var history_canvas      = document.getElementById( 'arena_toolkit_history' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];
  var history_canvas_list = document.createElement( 'ul' );

  getStored( function( data ) {

    if ( data.slugs && data.titles ) {

      var slugs  = data.slugs;
      var titles = data.titles;

      chrome.storage.local.set( { 'slugs': slugs, 'titles': titles } )

      for( var i = 0; i < slugs.length; i++ ) {
        history_canvas_list.innerHTML += '<li><a href="https://are.na/' +  slugs[ i ] + '">' + titles[ i ] + '</a></li>';
      }

      history_canvas.appendChild( history_canvas_list );
    }
  } );

  var refresh = document.createElement( 'div' );
  refresh.innerHTML = '<div class="arena_toolkit_history_refresh">♺</div>';
  document.getElementById( 'arena_toolkit_history' ).appendChild( refresh );

  refresh.onclick = function() {

    chrome.storage.local.remove(
      [ 'slugs', 'titles' ],
      function() {
        var error = chrome.runtime.lastError;
        if ( error ) { console.error( error ); }
      }
    )

    history_canvas_list.innerHTML = '';
  }

  //-----------
  // show arena
  //-----------

  var show_canvas     = document.getElementById( 'arena_toolkit_show' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];
  var show_canvas_div = document.createElement( 'div' );
  show_canvas_div.innerHTML = '<strong>Show Are.na: </strong><a target="_blank" href="https://bryantwells.github.io/show-arena/' + current_slug + '">' + current_title + '</a>';
  show_canvas.appendChild( show_canvas_div );

  //-----------
  // print arena
  //-----------

  var print_canvas     = document.getElementById( 'arena_toolkit_print' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];
  var print_canvas_div = document.createElement( 'div' );
  print_canvas_div.innerHTML = '<strong>Print Are.na: </strong><a target="_blank" href="https://printarena.now.sh/?ch=' + current_slug + '">' + current_title + '</a>';
  print_canvas.appendChild( print_canvas_div );

});
