// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/amdWebGlobal.js

;(function (root, factory) {
    // Browser globals
    root.app = root.app || {};

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([
            'app/ImageSlide',
            'app/VideoSlide',
            'app/IFrameSlide',
            'greensock/TweenMax.min',
            'greensock/plugins/CSSRulePlugin.min'
        ], function () {
            return (root.app.SlideManager = factory());
        });
    } else {
        root.app.SlideManager = factory();
    }
}(window.FLOCK = window.FLOCK || {}, function () {


    var SlideManager = function (data, loader) {
        this.currentSlide = null;
        this.previousSlide = null;
        this.slides = [];
        this.loader = loader;
        
        this.container = document.getElementById('shell');
        this.backgroundContainer = document.getElementById('backgroundContainer');
        this.io = FLOCK.app.main.io;
        
        // create the slide objects
        for(var s=0; s<data.length; s++){
            var slideData = data[s],
                slideClass = null;
            switch (slideData.type){
                case "image": slideClass = FLOCK.app.ImageSlide; break;
                case "video": slideClass = FLOCK.app.VideoSlide; break;
                case "iframe": slideClass = FLOCK.app.IFrameSlide; break;
            }
            if(slideClass !== null){
                var slideObj = new slideClass(this, slideData);
                slideObj.index = this.slides.length;
                slideObj.id = slideData.id || "slide_"+slideObj.index;
                this.slides.push(slideObj);
            }
        }
    }
        
    function transitionTo(_to){
        
        if(Number(_to) !== NaN)_to = Number(_to);
        if(typeof _to == "string")_to = this.lookupSlideIndex(_to);
        if(!this.slides[_to] || this.slides[_to] == this.currentSlide)return;
                
        console.log(this.slides[_to]);
        this.previousSlide = this.currentSlide;
        // set new slide
        this.currentSlide = this.slides[_to];
        
        // load new slide
        if(!this.currentSlide.loaded){
            this.loader.show();
            this.io.updateStatus( {slide:this.currentSlide.id, status:'load'} );
            this.currentSlide.load(function(){                
                this.loader.hide(transitionStart.bind(this));
                // transitionStart.bind(this)
            }.bind(this));
        } else {
            transitionStart.call(this)
        }
        
    }
    
    function transitionStart(){
        console.log('transitionStart');
        // add new slide
        this.backgroundContainer.appendChild(this.currentSlide.elem);
        this.currentSlide.resize(this.w, this.h);
        
        if(this.currentSlide.startup)this.currentSlide.startup();
        if(this.previousSlide && this.previousSlide.deactivate)this.previousSlide.deactivate();
        
        // transition slides
        var t = 1.25,
            easeFn = Power4.easeInOut;
            
        if(this.previousSlide)TweenMax.to(this.previousSlide.elem, t, {left: -this.w, ease:easeFn} );
        
        this.currentSlide.elem.style.left = this.w+'px';
        TweenMax.to(this.currentSlide.elem, t, { left: 0, ease:easeFn, onComplete:transitionEnd.bind(this) } );
    }
    
    function transitionEnd(){
        // remove old slide
        console.log('transitionEnd');
        this.io.updateStatus( {slide:this.currentSlide.id, status:'isIn'} );
        if(this.currentSlide.activate)this.currentSlide.activate();
        if(this.previousSlide){
            if(this.previousSlide.shutdown)this.previousSlide.shutdown();
            this.backgroundContainer.removeChild(this.previousSlide.elem);
        }
        
        // this.io.updateStatus( 'isIn' );
        
    }
    
    function lookupSlideIndex(id){
        for(var s=0; s<this.slides.length; s++){
            if(this.slides[s].id == id)return this.slides[s].index;
        }
        return -1;
    }
        
    function resize (w, h) {
        // console.log('SlideManager resize: '+w+", "+h);
        this.w = w;
        this.h = h;
        
        if(this.currentSlide)this.currentSlide.resize(w, h);
    }

    SlideManager.prototype.lookupSlideIndex = lookupSlideIndex;
    SlideManager.prototype.transitionTo = transitionTo;
    SlideManager.prototype.resize = resize;

    return SlideManager;
}));