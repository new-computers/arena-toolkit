//const thesaurus = require('powerthesaurus-api');
//
//thesaurus('car')
//  .then(results => {
//    console.log(results)
//  })
//  .catch(error => {
//    console.error(error)
//  })

arenaContext.then ( context => {

  if ( context.type == 'channel' ) {

    newTool ( 'related' );

    let related_canvas     = document.getElementById( 'arena_toolkit_related' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];
    let related_canvas_div = document.createElement( 'div' );

    related_canvas_div.innerHTML = '<a target="_blank" href="https://are.na/' + context.slug + '">' + context.title + '</a>';
    related_canvas.appendChild( related_canvas_div );

  }

} );
