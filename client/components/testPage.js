
module.exports = function(){
       var _ = App.lodash
    var scene, cameraFixed, renderer, origin, cameraThiredView;
    var geometry, material, mesh, elephant;

    init();
    animate();

     function init() {
        scene = new THREE.Scene();
        origin = new THREE.Vector3( 0, 0, 0 );
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        // renderer.physicallyCorrectLights = true;
        // renderer.gammaInput = true;
        // renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;  
         var poleGeo = new THREE.BoxGeometry( 5, 375, 5 );
    	var poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 100 } );
        var mesh = new THREE.Mesh( poleGeo, poleMat );
	    mesh.position.x = - 0;
	    mesh.position.y = - 0;
	    mesh.receiveShadow = true;
	    mesh.castShadow = true;
	    scene.add( mesh );
	     var loader = new THREE.TextureLoader();
	    var groundTexture = loader.load( 'textures/grasslight-big.jpg' );
	    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	    groundTexture.repeat.set( 25, 25 );
	    groundTexture.anisotropy = 16;
	    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );
	    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
	    mesh.position.y = 0;
	    mesh.rotation.x = - Math.PI / 2;
	    window.ground = mesh;
	    scene.add( mesh );
		camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.x = 1000;
		camera.position.y = 50;
		camera.position.z = 1500;
	    CamInUse = cameraThiredView = camera;
	    scene.add( new THREE.AmbientLight( 0x666666 ) );
		light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
		light.position.set( 50, 200, 100 );
		light.position.multiplyScalar( 1.3 );
		light.castShadow = true;
		light.shadow.mapSize.width = 1024;
		light.shadow.mapSize.height = 1024;
		light.shadow.camera.far = 1000;

		scene.add( light );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
       
    }
    function animate() {

        requestAnimationFrame( animate );

       
        renderer.render( scene, cameraFixed );

    }
}