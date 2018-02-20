
arenaContext.then( context => {

  if ( context.type != 'other' ) {

    newTool( 'arena_toolkit_show' );

    var current_slug = context.slug;
    var current_title = context.title;

    var show_canvas     = document.getElementById( 'arena_toolkit_show' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];
    var show_canvas_div = document.createElement( 'div' );

    show_canvas_div.innerHTML = '<strong>Show Are.na: </strong><a target="_blank" href="https://bryantwells.github.io/show-arena/' + current_slug + '">' + current_title + '</a>';
    show_canvas.appendChild( show_canvas_div );

  }

});
