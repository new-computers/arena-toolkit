
arenaContext.then( context => {

  if ( context.type != 'other' ) {

    newTool( 'arena_toolkit_show' );

    let show_canvas     = document.getElementById( 'arena_toolkit_show' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];
    let show_canvas_div = document.createElement( 'div' );

    show_canvas_div.innerHTML = '<strong>Show Are.na: </strong><a target="_blank" href="https://bryantwells.github.io/show-arena/' + context.slug + '">' + context.title + '</a>';
    show_canvas.appendChild( show_canvas_div );

  }

} );
