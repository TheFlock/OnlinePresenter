// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/amdWebGlobal.js

;(function (root, factory) {
    // Browser globals
    root.app = root.app || {};

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.app.IOClient = factory());
        });
    } else {
        root.app.IOClient = factory();
    }
}(window.FLOCK = window.FLOCK || {}, function () {


    var IOClient = function (channelID) {
        
        this.channelID = channelID;
        
        this.pusher = new Pusher('d80503305bdaa3b819e5');
        
        
        this.pusher.connection.bind('connected', function(){
            // this.socketId = this.pusher.connection.socket_id;
            this.socketId = generateString(10);
            this.sendMessage('userJoined', this.socketId);
        }.bind(this));
        
        console.log('join channel: '+this.channelID);
        this.channel = this.pusher.subscribe(this.channelID);                
        
        
        this.channel.bind('masterJoined', function(e){
            console.log("masterJoined: "+e);
            this.updateStatus(this.status);
            gotoSlide.call(this, e);
        }.bind(this));
        
        this.channel.bind('slideChange', gotoSlide.bind(this));
        this.channel.bind('test', testFn.bind(this));    
        
        // this.pusher.connection.bind('connected', function() {
        //     this.socketId = pusher.connection.socket_id;
        //     sendMessage('userJoined', pusher.connection.socket_id);
        // });
        
        // channel.bind('circle_update', function(data) {
        //   camRotateAngle(Number(data));
        // });
    }
    
    function generateString(len){
        var chars = "abcdefghijklmnopqrstuvwxyz123456789",
            str = "";
        for(var i=0; i<len; i++) str += chars.charAt(Math.floor(Math.random()*chars.length));
        return str;
    }
    
    function sendMessage(type, message){
        console.log("sendMessage: "+type+" | "+message);
        $.post('php/sendMessage.php', { 
            channelID: this.channelID, 
            eventID: type,
            message: String(message) 
        });
        
    }
            
    function updateStatus(_status){
        this.status = _status;
        this.sendMessage('userStatus', JSON.stringify( {id:this.socketId, status:_status} ) );
    }
    
    function gotoSlide(e){
        console.log("gotoSlide: "+e);
        FLOCK.app.main.slideManager.transitionTo(e);
    }
    
    function testFn(e){
        console.log('testFn: '+e);        
    }
    
    IOClient.prototype.sendMessage = sendMessage;
    IOClient.prototype.updateStatus = updateStatus;
    
    return IOClient;
}));