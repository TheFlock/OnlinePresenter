// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/amdWebGlobal.js

;(function (root, factory) {
    // Browser globals
    root.app = root.app || {};

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.app.VideoSlide = factory());
        });
    } else {
        root.app.VideoSlide = factory();
    }
}(window.FLOCK = window.FLOCK || {}, function () {
    
    function filesToPreload(){
        var toLoad = []
        
        if(Modernizr.video.webm == "probably"){
            // assume webm will be used
            toLoad.push(this.data.path+"webm");
        } else {
            // assume mp4 will be used
            toLoad.push(this.data.path+"mp4");
        }
        
        return toLoad;
    }

    var VideoSlide = function (manager, data) {
        this.elem = document.createElement('div');   
        this.elem.className = "slide video";
        this.data = data;
        this.dimensions = {
            width: this.data.width || 1920,
            height: this.data.height || 1080
        };
    }
    
    function load(callBack){        
        var vidUrl = this.data.path
        var video = document.createElement( 'video' );
        this.video = video;
        var mp4Source = document.createElement('source');
            mp4Source.type="video/mp4";
            mp4Source.src=vidUrl+".mp4";
        var webmSource = document.createElement('source');
            webmSource.type="video/webm";
            webmSource.src=vidUrl+".webm";

        if(Modernizr.video.webm == "probably"){
            // add webm first, so it's preferred
            video.appendChild(webmSource);
            video.appendChild(mp4Source);
        } else {
            // add mp4 first, so it's preferred
            video.appendChild(mp4Source);
            video.appendChild(webmSource);
        }
        video.loop = true;
        this.video = video;

        if(this.loaded){            
            callBack();            
        } else {
            this.video.addEventListener("canplay", function(){
                if(this.loaded)return;
                this.loaded = true;
                
                callBack();
                                                
            }.bind(this));            
            this.elem.appendChild(this.video);
        }
        
        video.load(); // must call after setting/changing source
        video.pause();
        
    }
    
    function activate(){
        this.video.play();
    }
    function deactivate(){
        this.video.pause();
    }

    function resize (w, h) {
        var imgW = this.dimensions.width,
            imgH = this.dimensions.height;
        
        console.log(imgW+" | "+imgH);
        console.log(w+" | "+h);
        
        var destRatio = Math.max(w/imgW, h/imgH),
            destW = imgW*destRatio,
            destH = imgH*destRatio,
            offLeft = (w-destW)/2,
            offTop = (h-destH)/2;
        
        this.video.style.width = destW+'px';
        this.video.style.height = destH+'px';
        this.video.style.left = offLeft+'px';
        this.video.style.top = offTop+'px';
    }

    VideoSlide.prototype.filesToPreload = filesToPreload;
    VideoSlide.prototype.load = load;
    VideoSlide.prototype.activate = activate;
    VideoSlide.prototype.deactivate = deactivate;
    VideoSlide.prototype.resize = resize;

    return VideoSlide;
}));