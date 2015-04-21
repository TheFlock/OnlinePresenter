// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/amdWebGlobal.js

;(function (root, factory) {
    // Browser globals
    root.app = root.app || {};

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.app.OblioLoader = factory());
        });
    } else {
        root.app.OblioLoader = factory();
    }
}(window.FLOCK = window.FLOCK || {}, function () {

    var myName = "OblioLoader";

    var OblioLoader = function () {

        this.id = "OblioLoader";

        this.elem = document.getElementById('oblioLoader');
        this.elem.style.opacity = 0;
        this.rings = [];
        this.isIn = false;
        
        var numRings = 8,
            startRadius = 35,
            spacer = 10,
            currRadius = startRadius;
            
        for(var i = 0; i<numRings; i++){
            
            var ringElem = document.createElement('div');
            ringElem.className = "logoRing";
            ringElem.style.width = currRadius*2+'px';
            ringElem.style.height = currRadius*2+'px';
            ringElem.style.marginLeft = -currRadius+'px';
            ringElem.style.marginTop = -currRadius+'px';
            ringElem.style.opacity = 0;
            
            currRadius += spacer;
            this.elem.appendChild(ringElem);
            
            this.rings.push({
                elem: ringElem,
                radius: currRadius,
                scale:0,
                active: false
            });
        }
        
        $('body').append($(this.elem));

    }

    function show(){
        if(this.isIn)return;
        this.transitioning = true;
        this.isIn = true;
        
        TweenLite.to(this.elem.style, 1, {opacity:1});
        
        for(var i=0; i<this.rings.length; i++){
            // TweenLite.to(this.rings[(this.rings.length-i)-1], 1, {scale:1, ease:Power4.easeOut, delay: i*0.10});
            var d = i*0.025,
                t = 0.5,
                del = Math.pow(1+d, 2)-1;
                
            this.rings[i].scale = 4-(3*i/this.rings.length);
            TweenLite.to(this.rings[i], t, {scale:1, ease:Power4.easeOut, delay: del});
            this.rings[i].elem.style.opacity = 0;
            var tw = TweenLite.to(this.rings[i].elem.style, t, {opacity:1, ease:Power4.easeOut, delay: del});
            if(i == this.rings.length-1)tw.vars.onComplete = function(){
                console.log('isIn');
                this.transitioning = false;
            }.bind(this);
        }
        ringsUpdate.call(this);
    }
    
    
    function ringsUpdate(){
        
        for(var i=0; i<this.rings.length; i++){
            
            currElem = this.rings[i].elem;
            currRadius = Math.abs(this.rings[i].radius*(this.rings[i].scale));
            // currRadius = this.rings[i].radius*this.rings[i].scale;
            currElem.style.width = currRadius*2+'px';
            currElem.style.height = currRadius*2+'px';
            currElem.style.marginLeft = -currRadius+'px';
            currElem.style.marginTop = -currRadius+'px';
        }
        
        if(this.transitioning)window.requestAnimationFrame(ringsUpdate.bind(this));
    }
    
    function hide(callback){
        // if intro is still playing, loop until is done
        if(this.transitioning){
            window.requestAnimationFrame(function(){
                hide.call(this, callback);
            }.bind(this));
            return;
        }
        
        this.transitioning = true;
        
        for(var i=0; i<this.rings.length; i++){
            // TweenLite.to(this.rings[(this.rings.length-i)-1], 1, {scale:1, ease:Power4.easeOut, delay: i*0.10});
            var d = i*0.025,
                t = 0.35,
                del = Math.pow(1+d, 2)-1, 
                e = Power2.easeOut;
                            
            TweenLite.to(this.rings[i], t, {scale: 4-(3*i/this.rings.length), ease:e, delay: del});
            var tw = TweenLite.to(this.rings[i].elem.style, t, {opacity:0, ease:e, delay: del});
            
            if(i == this.rings.length-1)tw.vars.onComplete = function(){
                console.log('isOut');
                this.transitioning = false;
                this.isIn = false;
                TweenLite.to(this.elem.style, 1, {opacity:0});
                if(callback)callback();
            }.bind(this);
        }
        
        ringsUpdate.call(this);
        
    }
    
    
    function reset(){
        for(var i=0; i<this.rings.length; i++){
            this.rings[i].active = false;
            this.rings[i].radius = 25;
            
            currElem.style.opacity = 0;
        }
    }
    
    
    function resize () {

    }

    OblioLoader.prototype.show = show;
    OblioLoader.prototype.hide = hide;
    OblioLoader.prototype.resize = resize;

    return OblioLoader;
}));