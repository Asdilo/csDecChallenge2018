({
    generateCanvas : function(component, event, helper) {
        
        
        //var body = component.get("v.body");
        //There are a few different ways to add this canvas to the DOM either by Aura ID, class name, or regular ID. The last being the most consistent.
        var scene3d = component.find('canvas').getElement();
        
        var camera, scene, renderer;	
        
        init();
        animate();
        
        function init( ) {       
            
            
            // Create a basic perspective camera
            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
            camera.position.set( 0, - 400, 600 );
            
            //Use Orbital camera library to stare at the dead center on the 3D space. This should make it feel like you are flying around a locked target
            var controls = new THREE.OrbitControls( camera );
            controls.target.set( 0, 0, 0 );
            controls.update();
            
            
            // Set the scene, the fog helps create more depth. Set it to the same color as BG because I'm not making another damn design attribute
            scene = new THREE.Scene();
            scene.background = new THREE.Color( component.get('v.background') );
            scene.fog = new THREE.Fog(component.get('v.background'), 700, 1500 );
            
            
            // Summon a renderer with Antialiasing because that blocky shit is for suckas...or fans of pixel art
            renderer = new THREE.WebGLRenderer({antialias:true});
            
            //Configure the pixel ration to match whatever device defaults are, because a smooth consistent render on any device is for real 3D gangstas
            renderer.setPixelRatio( window.devicePixelRatio );
            
            // Configure renderer background color aka clear color according to documentation...still not sure what this does but all the pros are doing it
            renderer.setClearColor("#000000");
            
            // Configure renderer size, I want that full screen life...
            renderer.setSize( window.innerWidth * .85, window.innerHeight * .85);
            
            // Append Renderer to DOM
            document.body.appendChild( renderer.domElement );
            
            //A wee little even listener that should resize the canvas on window resize
            window.addEventListener( 'resize', onWindowResize, false );
            
            // Create font loader, geomerty text and mesh materials
            var loader = new THREE.FontLoader();
            
            loader.load( '/resource/' +component.get('v.font'), function ( font ) {
                
                var xMid, text;
                var color = component.get('v.color');
                var opacity = component.get('v.opacity');
                var material = new THREE.MeshBasicMaterial( {
                    transparent: true,
                    color: color,
                    opacity: opacity,
                } );
                
                var message = component.get('v.text');
                var geometry = new THREE.TextGeometry( message, {
                    font: font,
                    size: component.get('v.size'),
                    height: component.get('v.thickness'),
                    curveSegments: 5,
                    bevelEnabled: true,
                    bevelThickness: 2,
                    bevelSize: 3,
                    bevelSegments: 5
                } );
                geometry.computeBoundingBox();
                xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
                geometry.translate( xMid, 0, 0 );
                // make shape ( N.B. edge view not visible )
                text = new THREE.Mesh( geometry, material );
                text.position.z = - 200;
                scene.add( text );
                
            } );
            
        }
        
        //A wee little function that should resize the canvas on window resize PAPOW!
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );            
        }
        

        function animate() {
            requestAnimationFrame( animate );
            render();
        }
        function render() {
            renderer.render( scene, camera );
        }
    }
})
