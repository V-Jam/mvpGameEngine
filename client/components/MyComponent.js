var CONSTANT_VELOCITY = 10;
var KEYSTATE = {};
var JUMPCYCLE = 0;
var CamInUse
var THIRD_PERSON_VIEW = false;
module.exports = function(){
    var keypressDirections = {
      "left": 97, // a
      "right": 100, // d
      "enter": 13,
      "forward": 119, // w
      "back": 115, // s
      "space": 32
    }
    var keydownDirections = {
      "left": 65, // a
      "right": 68, // d
      "enter": 13,
      "forward": 87, // w
      "back": 83, // s
      "space": 32,
      "one": 49,
      "two": 50,
      "leftArrow": 37,
      "rightArrow": 39
    }
    var _ = App.lodash
    var charCode_to_name = _.invert(keydownDirections)
    
    var scene, cameraFixed, renderer, origin, cameraThiredView;
    var geometry, material, mesh, elephant;

    init();
    animate();

    var onProgress = function ( xhr ) {
                    if ( xhr.lengthComputable ) {
                        var percentComplete = xhr.loaded / xhr.total * 100;
                        console.log( Math.round(percentComplete, 2) + '% downloaded' );
                    }
                };
    var onError = function ( xhr ) {
        console.warn('OOPS')

     };

    function init() {
        scene = new THREE.Scene();
        origin = new THREE.Vector3( 0, 0, 0 );


        geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
        mesh.name = "redBox"

        renderer = new THREE.WebGLRenderer();
        renderer.shadowMap.enabled = true;
        renderer.setSize( window.innerWidth, window.innerHeight );

        initCameras();
        initElephant();
        initSky();
        initGround();
        initLight();
        document.body.appendChild( renderer.domElement );
       
    }
function initCameras(){
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    window.cameraThiredView = cameraThiredView =  new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    cameraThiredView.zoom = 1;
    cameraThiredView.position.z = -10;
    cameraThiredView.position.y = 3;
    cameraThiredView.rotateX(-50);
    window.cameraFixed = cameraFixed = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
    cameraFixed.zoom = 1;
    cameraFixed.position.z = 1000;
    CamInUse = cameraThiredView;
}

function initElephant(){
    var mtlLoader = new THREE.MTLLoader();
        // mtlLoader.setPath( 'obj/male02/' );
    mtlLoader.load( 'elephant.mtl', function( materials ) {
        materials.preload(); 
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( 'elephant.obj', function ( object ) {
            object.position.y = 0;
            object.position.z = 0;
            object.position.x = 0;
            object.scale.x=  100;
            object.scale.z=  100;
            object.scale.y=  100;
            object.castShadow = true;

            scene.add( object );
            window.elephant =  elephant = object;
            elephant.add(cameraThiredView);
            cameraThiredView.lookAt(elephant.position);
        }, onProgress, onError );
    });
    var poleGeo = new THREE.BoxGeometry( 5, 375, 5 );
    var poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 100 } );
    var mesh = new THREE.Mesh( poleGeo, poleMat );
    mesh.position.x = - 0;
    mesh.position.y = - 0;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    debugger; 
    scene.add( mesh );
}

function initSky() {
    // Add Sky Mesh
    sky = new THREE.Sky();
    scene.add( sky.mesh );
    // Add Sun Helper
    sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 20000, 16, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.position.y = - 700000;
    sunSphere.visible = false;
    scene.add( sunSphere );
    /// GUI
    var effectController  = {
        turbidity: 10,
        reileigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.49, // elevation / inclination
        azimuth: 0.25, // Facing front,
        sun: ! true
    };
    var distance = 400000;
    function guiChanged() {
        var uniforms = sky.uniforms;
        uniforms.turbidity.value = effectController.turbidity;
        uniforms.reileigh.value = effectController.reileigh;
        uniforms.luminance.value = effectController.luminance;
        uniforms.mieCoefficient.value = effectController.mieCoefficient;
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
        var theta = Math.PI * ( effectController.inclination - 0.5 );
        var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
        sunSphere.position.x = distance * Math.cos( phi );
        sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
        sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
        sunSphere.visible = effectController.sun;
        sky.uniforms.sunPosition.value.copy( sunSphere.position );
        renderer.render( scene, cameraFixed );
    }
    var gui = new dat.GUI();
    gui.add( effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange( guiChanged );
    gui.add( effectController, "reileigh", 0.0, 4, 0.001 ).onChange( guiChanged );
    gui.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, "luminance", 0.0, 2 ).onChange( guiChanged );
    gui.add( effectController, "inclination", 0, 1, 0.0001 ).onChange( guiChanged );
    gui.add( effectController, "azimuth", 0, 1, 0.0001 ).onChange( guiChanged );
    gui.add( effectController, "sun" ).onChange( guiChanged );
    guiChanged();
}

function initGround(){
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
    mesh.receiveShadow = true;
}

function initLight(){
    scene.add( new THREE.AmbientLight( 0x555555 ) );
    // d1
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    var d = 0;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right =  d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.position.set( 0, 1, 0 );
    scene.add( directionalLight );
    // // d2
    // var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.2 );
    // directionalLight2.position.set( 1, -1, 0 );
    // scene.add( directionalLight2 );
    // // d3
    // var directionalLight3 = new THREE.DirectionalLight( 0xffffff, 0.2 );
    // directionalLight3.position.set( -1, -1, 1 );
    // scene.add( directionalLight3 );
}

    function animate() {

        requestAnimationFrame( animate );

        if(KEYSTATE['forward']){
            elephant.position.z+=CONSTANT_VELOCITY;
        }
        if( KEYSTATE["left"]){    
            !THIRD_PERSON_VIEW ? elephant.position.x-=CONSTANT_VELOCITY : elephant.position.x+=CONSTANT_VELOCITY;
        }
        if(KEYSTATE["right" ]){
            THIRD_PERSON_VIEW ? elephant.position.x-=CONSTANT_VELOCITY : elephant.position.x+=CONSTANT_VELOCITY;   
        }
        if(KEYSTATE["enter"]){

        }
        if(KEYSTATE["leftArrow"]){
            elephant.rotation.y+=0.1
            // THIRD_PERSON_VIEW ? camera.rotation.y+=0.1 : false;

        }
        if(KEYSTATE["rightArrow"]){
            elephant.rotation.y-=0.1
            // THIRD_PERSON_VIEW ? camera.rotation.y-=0.1 : false;

        }           
        if(KEYSTATE[ "back"]){

            elephant.position.z-=CONSTANT_VELOCITY
        }
            
        if(KEYSTATE[ "space"]){
            if(JUMPCYCLE === 0){
                JUMPCYCLE = 60
            }
        }

        if(KEYSTATE["one"]){
            CamInUse = cameraFixed;
            cameraFixed.lookAt(origin);
        }

        if(KEYSTATE["two"]){
            CamInUse = cameraThiredView;
        }
    
                
        jump()
        renderer.render( scene, CamInUse );

    }
    function jump(){
         if(JUMPCYCLE > 0 ){
            elephant.position.y +=  ( 3 * ( JUMPCYCLE -  30 )) * CONSTANT_VELOCITY/50;
            JUMPCYCLE--
        } else {
                // if(elephant){
                //     elephant.position.y = 20;
                // }
        }
    }
     window.addEventListener('keydown', function(event){
        KEYSTATE[charCode_to_name[event.keyCode]] = true;
    })
    window.addEventListener('keyup', function(event){
        KEYSTATE[charCode_to_name[event.keyCode]] = false;
    })
}