
newTool( 'arena_toolkit_history' );


arenaContext.then( context => {

  let history_canvas      = document.getElementById( 'arena_toolkit_history' ).getElementsByClassName( 'arena_tool_canvas' )[ 0 ];
  let history_canvas_list = document.createElement( 'ul' );

  let updateHistory = ( data ) => {

    chrome.storage.local.get(

      [ 'slugs', 'titles' ],

      ( data ) => {

        let slugs;
        let titles;

        if ( data.slugs && data.titles && context.slug && context.title ) {

          slugs  = [ (context.full_slug || context.slug) ].concat( data.slugs );
          titles = [ context.title ].concat( data.titles );

        } else if ( data.slugs && data.titles ){

          slugs  = data.slugs;
          titles = data.titles;

        } else if ( context.slug && context.title ) {

          slugs  = [ context.slug ]
          titles = [ context.title ]

        }

        for( let i = 0; i < slugs.length; i++ ) {
          history_canvas_list.innerHTML += '<li><a href="/' +  slugs[ i ] + '">' + titles[ i ] + '</a></li>';
        }

        history_canvas.appendChild( history_canvas_list );

        chrome.storage.local.set( { 'slugs': slugs, 'titles': titles } )

      }
    )}

  updateHistory();


  let refresh = document.createElement( 'div' );
  refresh.innerHTML = '<div class="arena_toolkit_history_refresh">♺</div>';
  document.getElementById( 'arena_toolkit_history' ).appendChild( refresh );

  refresh.onclick = () => {

    chrome.storage.local.remove(
      [ 'slugs', 'titles' ],
      () => {
        let error = chrome.runtime.lastError;
        if ( error ) { console.error( error ); }
      }
    )

    history_canvas_list.innerHTML = '';
  }

} );
