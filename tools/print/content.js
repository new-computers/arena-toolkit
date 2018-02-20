
arenaContext.then( context => {

  if ( context.type != 'other' ) {

    newTool( 'arena_toolkit_print' );

    let print_canvas     = document.getElementById( 'arena_toolkit_print' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];

    print_canvas.innerHTML = '<iframe src="https://printarena.now.sh/?ch=' + context.slug + '" height="100%" width="100%" frameborder="0">Your browser does not support iframes<a href="https://printarena.now.sh/?ch=' + context.slug + '">' + context.title + '</a></iframe>';

  }

} );
