
//--------------------------------
// inject relay.js into Are.na DOM
//--------------------------------

const injectScript = ( file_path, tag ) => {

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

const newTool = ( tool_name ) => {

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

  window.addEventListener( 'message', ( event ) => {

    if ( event.source == window && event.data.type && event.data.type == 'arena_data' ) {

      let context   = event.data.object;

      if ( context.CURRENT_ACTION && context.CURRENT_ACTION == 'channel' ) {

        resolve( {
          type:      'channel',
          slug:      context.CHANNEL.slug,
          title:     context.CHANNEL.title,
          id:        context.CHANNEL.id,
          status:    context.CHANNEL.status,
          id:        context.CHANNEL.user.id,
          user_slug: context.CHANNEL.user.slug,
          user_name: context.CHANNEL.user.full_name,
          full_slug: [context.CHANNEL.user.slug, context.CHANNEL.slug].join('/')
        } );

      } else if ( context.CURRENT_ACTION && context.CURRENT_ACTION == 'profile' ) {

        resolve( {
          type:      'profile',
          slug:      context.USER.slug,
          title:     context.USER.username,
          id:        context.USER.profile_id,
          avatar:    context.USER.avatar_image.display
        } );

      } else {

        resolve( { type: 'other' } );

      }

    }

  })

});
