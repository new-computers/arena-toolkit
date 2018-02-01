//-------------------
// append toolkit div
//-------------------

const arena_toolkit = document.createElement( 'div' );
arena_toolkit.setAttribute( 'id', 'arena_toolkit' );
document.body.appendChild( arena_toolkit );


//--------------
// attatch tools
//--------------

function newTool( tool_name ) {

  let arena_tool = document.createElement( 'div' );

  arena_tool.setAttribute( 'class', 'arena_tool arena_tool_closed' );
  arena_tool.setAttribute( 'id', tool_name );

  arena_tool.innerHTML = '<a class="arena_tool_resize" <a class="modalize-close js-modalize-close"><span class="iconic iconic-sm" data-glyph="x" title="x" aria-hidden="true"></span></a><div class="arena_tool_canvas"></div>';

  arena_toolkit.appendChild( arena_tool );

}

newTool( 'arena_toolkit_print' );
newTool( 'arena_toolkit_maps' );
newTool( 'arena_toolkit_history' );


//------------------------
// attatch settings button
//------------------------

let arena_toolkit_settings = document.createElement( 'div' );

arena_toolkit_settings.setAttribute( 'id', 'arena_toolkit_settings' );

arena_toolkit.appendChild( arena_toolkit_settings );

arena_toolkit_settings.innerHTML = '<h6 class="arena_toolkit_settings_text">debug</h6>';


//---------------
// resizing logic
//---------------

let arena_toolkit_tool = document.getElementsByClassName( 'arena_tool' );

Object.keys( arena_toolkit_tool ).map( ( key, index ) => {

  // shamefully hacky way to retain window state
  chrome.storage.local.get( [ 'tool_state' ], function( settings ) {

    if( settings.tool_state[ 1 ] == 'open' ) {
      arena_toolkit_tool[ settings.tool_state[ 0 ] ].classList.remove( 'arena_tool_closed' );
      arena_toolkit_tool[ settings.tool_state[ 0 ] ].classList.add( 'arena_tool_open' );
    }

  });

  // add listener to monitor
  arena_toolkit_tool[ key ].getElementsByClassName( 'arena_tool_resize' )[ 0 ].onclick = function() {

    if ( arena_toolkit_tool[ key ].classList.contains( "arena_tool_closed" ) ) {

      arena_toolkit_tool[ key ].classList.add( "arena_tool_open" );
      arena_toolkit_tool[ key ].classList.remove( "arena_tool_closed" );

      chrome.storage.local.set(
        { tool_state: [ key, 'open' ] },
        function() {}
      )

    } else {

      arena_toolkit_tool[ key ].classList.add( "arena_tool_closed" );
      arena_toolkit_tool[ key ].classList.remove( "arena_tool_open" );

      chrome.storage.local.set(
        { tool_state: [ key, 'closed' ] },
        function() {}
      )

    }
  }
});


//-------------------
// debug toggle logic
//-------------------

chrome.storage.local.get( [ 'dev_state' ], function( settings ) {

  if( settings.dev_state == 'dev' ) {
    arena_toolkit_settings.classList.add( 'arena_toolkit_settings_dev' );
  } else {
    arena_toolkit_settings.classList.remove( 'arena_toolkit_settings_dev' );
  }

});


var dev_state;

arena_toolkit_settings.onclick = function() {

  if ( arena_toolkit_settings.classList.contains( 'arena_toolkit_settings_dev' ) ) {

    arena_toolkit_settings.classList.remove( 'arena_toolkit_settings_dev' );

    chrome.storage.local.set(
      { dev_state: 'default' },
      function() {}
    )
  } else {
    arena_toolkit_settings.classList.add( 'arena_toolkit_settings_dev' );

    chrome.storage.local.set(
      { dev_state: 'dev' },
      function() {}
    )
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

chrome.storage.local.get( [ 'status', 'dev_state' ], function( settings ) {

  if ( settings.status == 'reloaded' && settings.dev_state == 'dev' ) {

    // notification
    updateNotification( 'reloaded', 4000 );
    console.log( '> content reloaded' )

    // record reloaded message
    chrome.storage.local.set(
      { 'status': 'notified' },
      function() {
        // console.log( '> notified' );
      }
    );
  }
});


//----------------------------------------
// listen for context data from page relay
//----------------------------------------

window.addEventListener( 'message', function( event ) {

  // only window data
  if ( event.source != window ) { return; }

  if ( event.data.type && event.data.type == 'arena_data' ) {

    var arena_data   = event.data.object;
    var current_path = arena_data.CURRENT_PATH;

    if ( arena_data.CURRENT_ACTION ) {

      var current_slug  = '';
      var current_title = '';

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

  var slugs  = [''];
  var titles = [''];

  function getStored( callback ) {
    chrome.storage.local.get(
      [ 'slugs', 'titles' ],

      function ( data ) {

        if ( data.slugs && data.titles && current_slug && current_title ) {
          slugs  = [ current_slug ].concat( data.slugs );
          titles = [ current_title ].concat( data.titles );
        } else if ( current_slug && current_title ) {
          slugs  = [ current_slug ]
          titles = [ current_title ]
        } else {
          slugs  = data.slugs;
          titles = data.titles;
        }

        callback( { slugs: slugs, titles: titles } )
      }
    )
  }

  var canvas      = document.getElementById( 'arena_toolkit_history' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];
  var canvas_list = document.createElement( 'ul' );

  getStored(
    function( data ) {

      if ( data.slugs && data.titles ) {

        var slugs  = data.slugs;
        var titles = data.titles;

        chrome.storage.local.set(
          { 'slugs': slugs, 'titles': titles },
          function() {}
        )

        for( var i = 0; i < slugs.length; i++ ) {
          canvas_list.innerHTML += '<li><a href="https://are.na/' +  slugs[ i ] + '">' + titles[ i ] + '</a></li>';
        }

        canvas.appendChild( canvas_list );
      }
    }
  );

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

    canvas_list.innerHTML = '';
  }

});
