
arenaContext.then ( context => {

  if ( context.type == 'channel' || context.type == 'user' ) {

    newTool ( 'print' );

    let print_canvas     = document.getElementById( 'arena_toolkit_print' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];
    let print_canvas_div = document.createElement( 'div' );

    print_canvas_div.innerHTML = '<a target="_blank" href="https://printarena.now.sh/?ch=' + context.slug + '">' + context.title + '</a>';
    print_canvas.appendChild( print_canvas_div );

  }

} );
