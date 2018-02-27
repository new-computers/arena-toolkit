
arenaContext.then( context => {

  if ( context.type == 'channel' || context.type == 'user' ) {

    newTool( 'show' );

    let show_canvas     = document.getElementById( 'arena_toolkit_show' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];

    show_canvas.innerHTML = '<iframe src="https://bryantwells.github.io/show-arena/' + context.slug + '" height="100%" width="100%" frameborder="0">Your browser does not support iframes<a href="https://bryantwells.github.io/show-arena/' + context.slug + '">' + context.title + '</a></iframe>';

  }

} );
