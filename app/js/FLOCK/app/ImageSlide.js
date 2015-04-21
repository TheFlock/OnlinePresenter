// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/amdWebGlobal.js

;(function (root, factory) {
    // Browser globals
    root.app = root.app || {};

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.app.ImageSlide = factory());
        });
    } else {
        root.app.ImageSlide = factory();
    }
}(window.FLOCK = window.FLOCK || {}, function () {


    var ImageSlide = function (manager, data) {
        this.elem = document.createElement('div');
        this.elem.className = "slide image";
        this.loaded = false;
        this.data = data;
    }
    
    function load(callBack){
        console.log('load ImageSlide');
        if(this.loaded){            
            callBack();            
        } else {            
            this.image = new Image();            
            $(this.image).load(function(){
                if(this.loaded)return;
                this.loaded = true;
                
                callBack();
                                                
            }.bind(this));
            this.image.src = this.data.path;
        
            this.elem.appendChild(this.image);
        }
    }

    function resize (w, h) {
        
        var imgW = this.image.width || 1920,
            imgH = this.image.height || 1080;
        
        var destRatio = Math.max(w/imgW, h/imgH),
            destW = imgW*destRatio,
            destH = imgH*destRatio,
            offLeft = (w-destW)/2,
            offTop = (h-destH)/2;
        
        this.image.style.width = destW+'px';
        this.image.style.height = destH+'px';
        this.image.style.left = offLeft+'px';
        this.image.style.top = offTop+'px';

    }

    ImageSlide.prototype.load = load;
    ImageSlide.prototype.resize = resize;

    return ImageSlide;
}));