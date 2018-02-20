
newTool( 'arena_toolkit_print' );


arenaContext.then( context => {

  var current_slug = context.current_slug;
  var current_title = context.current_title;

  var print_canvas     = document.getElementById( 'arena_toolkit_print' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];
  print_canvas.innerHTML = '<iframe src="https://printarena.now.sh/?ch=' + current_slug + '" height="100%" width="100%" frameborder="0">Your browser does not support iframes<a href="https://printarena.now.sh/?ch=' + current_slug + '">' + current_title + '</a></iframe>';

});
