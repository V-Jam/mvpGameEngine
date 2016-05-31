window.App = {
    threejs: require('three'),
    MTLLoader: function(){ 
    	require('./public/js/MTLLoader')
    },
    OBJLoader: function(){
    	require('./public/js/OBJLoader')
    },
    SkyLoader: function(){
        require('./public/js/Sky')
    },
    GUILoader: function(){
        require('./public/js/dat.gui.min')
    },
    jquery: require('jquery'),
    lodash: require('lodash'),
    components: require('./components/MyComponent'),
    testPage: require('./components/testPage')
};

