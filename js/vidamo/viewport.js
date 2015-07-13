//
// VIDAMO middle panel 3js viewport
//

var editor = new Editor();

var viewport = new Viewport(editor).setId('viewport');
document.getElementById("3dviewport").appendChild(viewport.dom);

editor.setTheme( editor.config.getKey( 'theme' ) );

editor.storage.init( function () {

    editor.storage.get( function ( state ) {

        if ( state !== undefined ) {
            var loader = new THREE.ObjectLoader();
            var scene = loader.parse( state );
            editor.setScene( scene );
        }

        var selected = editor.config.getKey( 'selected' );

        if ( selected !== undefined ) {
            editor.selectByUuid( selected );
        }
    } );


    var timeout;
    var exporter = new THREE.ObjectExporter();
    var saveState = function ( scene ) {
        clearTimeout( timeout );
        timeout = setTimeout( function () {
            editor.storage.set( exporter.parse( editor.scene ) );
        }, 1000 );

    };

    var signals = editor.signals;

    signals.objectAdded.add( saveState );
    signals.objectChanged.add( saveState );
    signals.objectRemoved.add( saveState );
    signals.materialChanged.add( saveState );
    signals.sceneGraphChanged.add( saveState );
} );

document.addEventListener( 'dragover', function ( event ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}, false );

document.addEventListener( 'drop', function ( event ) {
    event.preventDefault();
    editor.loader.loadFile( event.dataTransfer.files[ 0 ] );
}, false );

document.addEventListener( 'keydown', function ( event ) {
    switch ( event.keyCode ) {
        //case 8: // prevent browser back
        //    event.preventDefault();
        //    break;
        case 46: // delete
            var parent = editor.selected.parent;
            editor.removeObject( editor.selected );
            editor.select( parent );
            break;
    }
}, false );

var onWindowResize = function ( event ) {
    editor.signals.windowResize.dispatch();
};
window.addEventListener( 'resize', onWindowResize, false );
onWindowResize();
