
newTool( 'maps' );


arenaContext.then( context => {

  // purescript binding
  var Bridge = PS.Bridge_MaybeNullable;
  Bridge.provide( storageChange.newValue );

} );
