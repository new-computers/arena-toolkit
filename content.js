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
newTool( 'arena_toolkit_radio' );
newTool( 'arena_toolkit_maps' );


//---------------
// resizing logic
//---------------

let arena_toolkit_tool = document.getElementsByClassName( 'arena_tool' );

Object.keys( arena_toolkit_tool ).map( ( key, index ) => {

  arena_toolkit_tool[ key ].onclick = function() {

    if ( arena_toolkit_tool[ key ].classList.contains( "arena_tool_closed" ) ) {

      arena_toolkit_tool[ key ].classList.add( "arena_tool_open" );
      arena_toolkit_tool[ key ].classList.remove( "arena_tool_closed" );

    } else {

      arena_toolkit_tool[ key ].classList.add( "arena_tool_closed" );
      arena_toolkit_tool[ key ].classList.remove( "arena_tool_open" );

    }
  }
});


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


chrome.storage.local.get( [ 'status' ], function( items ) {

  if ( items.status === 'reloaded' ) {

    // notification
    updateNotification( 'reloaded', 4000 );
    console.log( '> content reloaded' )

    // record reloaded message
    chrome.storage.local.set(
      { 'status': 'notified' },
      function() {
        console.log( '> notified' );
      }
    );
  }
});


//---------------------------
// listen for storage changes
//---------------------------

chrome.storage.onChanged.addListener( function( changes, namespace ) {

  for ( key in changes ) {

    let storageChange = changes[ key ];
    // log storage change
    console.log( 'key "%s" in namespace "%s" changed ' +
                 '"%s" -> "%s"',
                 key,
                 namespace,
                 storageChange.oldValue,
                 storageChange.newValue );
  }
});


//----------------------------------------
// listen for context data from page relay
//----------------------------------------

window.addEventListener( 'message', function( event ) {
  if ( event.source != window ) {
    return;
  }
  if ( event.data.type && ( event.data.type == 'arena_data' ) ) {

    var arena_data = event.data.object;
    //console.log( arena_data );

    if ( arena_data.CURRENT_ACTION ) {

      var current_path = arena_data.CURRENT_PATH;
      var current_slug = '';
      var current_title = '';

      if ( arena_data.CURRENT_ACTION == 'channel' ) {

        //console.log( 'this is a channel' );
        //console.log( arena_data.CHANNEL.slug );
        current_slug = arena_data.CHANNEL.slug;
        //console.log( arena_data.CHANNEL.id );
        //console.log( arena_data.CHANNEL.title );
        current_title = arena_data.CHANNEL.title;
        //console.log( arena_data.CHANNEL.status );
        //console.log( arena_data.CHANNEL.user.id );
        //console.log( arena_data.CHANNEL.user.slug );
        //console.log( arena_data.CHANNEL.user.full_name );


      } else if ( arena_data.CURRENT_ACTION == 'profile' ) {

        //console.log( 'this is a profile' );
        //console.log( arena_data.USER.slug );
        current_slug = arena_data.USER.slug;
        //console.log( arena_data.USER.username );
        current_title = arena_data.USER.username;
        //console.log( arena_data.USER.profile_id );
        //console.log( arena_data.USER.avatar_image.display );

      }

    }

  }


  var slugs_list = [];
  var titles_list = [];

  chrome.storage.local.get( [ 'slugs', 'titles' ], function( data ) {

    if ( data.slugs ) {
      slugs_list = [ current_slug ].concat( data.slugs );
    } else {
      slugs_list = [ current_slug ]
    }

    if ( data.titles ) {
      titles_list = [ current_title ].concat( data.titles );
    } else {
      titles_list = [ current_title ]
    }

    chrome.storage.local.set(
      { 'slugs': slugs_list, 'titles': titles_list },
      function() {}
    )

    console.log( slugs_list );
    console.log( titles_list );

    var canvas = document.getElementById( 'arena_toolkit_maps' ).getElementsByClassName( 'arena_tool_canvas' )[0];
    var canvas_list = document.createElement( 'ul' );
    var i;
    for(i = 0; i < slugs_list.length; i++) {
      console.log(slugs_list[ i ]);
      canvas_list.innerHTML += '<li><a href="https://are.na/' +  slugs_list[ i ] + '">' + titles_list[ i ] + '</a></li>';
    }
    canvas.appendChild( canvas_list );

    //chrome.storage.local.remove( [ 'slugs', 'titles' ],function(){
    //  var error = chrome.runtime.lastError;
    //  if (error) {
    //    console.error(error);
    //  }
    //})

  });

});
