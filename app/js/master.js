requirejs.config({
    paths : {   
        root: '../',
        jquery: '../bower_components/jquery/dist/jquery',
        mustache: '../bower_components/mustache/mustache',
        greensock: '../bower_components/greensock/src/minified',
        text: '../bower_components/text/text',
        FLOCK: '../bower_components/flock-utils',
        sections: 'FLOCK/sections',
        app: 'FLOCK/app',
        utils: 'FLOCK/utils',
        html: '../html',
        jsonFolder: '../json'
    },
    map: {
        "*": { 
            'TweenLite': 'greensock/TweenMax.min',
            'greensock/TweenLite.min': 'greensock/TweenMax.min',
            'greensock/TimelineLite.min': 'greensock/TweenMax.min',
            'greensock/easing/EasePack.min': 'greensock/TweenMax.min',
            'greensock/plugins/CSSPlugin.min': 'greensock/TweenMax.min'
        }
    },
    shim: {
    }
});

require([
    'jquery',
    'FLOCK/utils/Polyfills',
    'FLOCK/utils/SectionLoader',
    'FLOCK/utils/Preloader',
    'FLOCK/utils/ArrayExecuter',
    'FLOCK/utils/PageVisibility',
    'FLOCK/utils/DeviceDetect',
    'app/OblioLoader',
    'app/UserList',
    'app/IOMaster',
    'app/SlideManager'
    ], function($) {

    FLOCK = FLOCK || {};
    FLOCK.app = FLOCK.app || {};

    var preloader = FLOCK.utils.Preloader,
        arrayExecuter = new FLOCK.utils.ArrayExecuter(),
        currLoader;

    function Main () {
        this.elements = {
            shell: $('#shell'),
            window: $(window)
        }

        FLOCK.settings = FLOCK.settings || {};
        FLOCK.settings.header_height = 0;
        FLOCK.settings.footer_height = 0;
        
        FLOCK.settings.window_dimensions = {
            width: this.elements.shell.width(),
            height: this.elements.shell.height()
        };       
        
        /* debug logs*/
        // arrayExecuter.verbose = true;

        window.onresize = handleResize.bind(this);
        window.onorientationchange = handleResize.bind(this);

        var function_arr =  [
                { fn: FLOCK.utils.SectionLoader.loadJSON, scope:FLOCK.utils.SectionLoader, vars: [FLOCK.settings.base_url + 'json/en.json', arrayExecuter.stepComplete.bind(arrayExecuter)] },
                { fn: init, scope:this, vars: null }
            ];

        arrayExecuter.execute(function_arr);
    }

    function init() {
        console.log('init!');
        
        this.currentSlide = 0;
        this.slides = FLOCK.app.dataSrc.slides;        
        updateLabel.call(this);
        
        this.userList = new FLOCK.app.UserList();
        this.io = new FLOCK.app.IOMaster("OBLIO_OP");
        
        $('#prevBtn').on('click', function(){ changeSlide.call(this, -1); }.bind(this) );
        $('#nextBtn').on('click', function(){ changeSlide.call(this, 1); }.bind(this) );
        
        
        handleResize.call(this);
        
    }
    
    function changeSlide(num){
        console.log('changeSlide: '+num);  
        this.currentSlide = (this.currentSlide+this.slides.length+num) % this.slides.length;
        this.io.sendMessage('slideChange', this.currentSlide);
        updateLabel.call(this);
    }
    
    function updateLabel(){
        document.getElementById("slideLabel").innerHTML = this.slides[this.currentSlide].id || this.currentSlide;
    }
    
    function handleResize (e, callbackFn) {
        
        var w, h;

        FLOCK.settings.window_dimensions = {
            width: this.elements.window.width(),
            height: this.elements.window.height()
        }

        w = FLOCK.settings.window_dimensions.width;
        h = FLOCK.settings.window_dimensions.height;
        
        if(currLoader)currLoader.resize(w, h);
        if(this.slideManager)this.slideManager.resize(w, h);

        if(callbackFn)callbackFn();
    }


    // call init on document ready
    $(function () {
        FLOCK.app.main = new Main();
    });

});
