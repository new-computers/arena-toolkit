
//--------------------------------
// inject relay.js into Are.na DOM
//--------------------------------

function injectScript( file_path, tag ) {

  var node   = document.getElementsByTagName( tag )[ 0 ];
  var script = document.createElement( 'script' );

  script.setAttribute( 'type', 'text/javascript' );
  script.setAttribute( 'src', file_path );

  node.appendChild( script );

}

injectScript( chrome.extension.getURL( 'core/relay.js' ), 'body' );


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

//----------------------------------------
// listen for context data from page relay
//----------------------------------------

const arenaContext = new Promise( ( resolve, reject ) => {

  var current_slug  = '';
  var current_title = '';

  window.addEventListener( 'message', function( event ) {

    if ( event.source == window && event.data.type && event.data.type == 'arena_data' ) {

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

    resolve( { current_slug: current_slug, current_title: current_title } );

  });

});
