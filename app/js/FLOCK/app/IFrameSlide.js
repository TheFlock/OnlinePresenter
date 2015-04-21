// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/amdWebGlobal.js

;(function (root, factory) {
    // Browser globals
    root.app = root.app || {};

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.app.IFrameSlide = factory());
        });
    } else {
        root.app.IFrameSlide = factory();
    }
}(window.FLOCK = window.FLOCK || {}, function () {


    var IFrameSlide = function (manager, data) {
        this.elem = document.createElement('div');        
        this.elem.className = "slide iframe";       
    }
    
    function load(callBack){
        
    }

    function resize (w, h) {
        
    }

    IFrameSlide.prototype.load = load;
    IFrameSlide.prototype.resize = resize;

    return IFrameSlide;
}));