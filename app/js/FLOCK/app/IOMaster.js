// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/amdWebGlobal.js

;(function (root, factory) {
    // Browser globals
    root.app = root.app || {};

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([
            ], function () {
            return (root.app.IOMaster = factory());
        });
    } else {
        root.app.IOMaster = factory();
    }
}(window.FLOCK = window.FLOCK || {}, function () {


    var IOMaster = function (channelID) {
        
        this.userManager = FLOCK.app.main.userList;
        this.channelID = channelID;
        
        this.pusher = new Pusher('d80503305bdaa3b819e5');
                
        this.pusher.connection.bind('connected', function(){
            console.log('connected!');
            // send out incase others are listening
            this.sendMessage('masterJoined', FLOCK.app.main.currentSlide);
        }.bind(this));
        
        
        console.log('join channel: '+this.channelID);
        this.channel = this.pusher.subscribe(this.channelID);    
         
                  
        this.channel.bind('userStatus', userStatus.bind(this));    
        this.channel.bind('userJoined', userJoined.bind(this));  
        
        this.channel.bind('test', testFn.bind(this));    
    }
    
    function sendMessage(type, message){
        console.log("sendMessage: "+type+" | "+message);
        
        $.post('php/sendMessage.php', { 
            channelID: this.channelID, 
            eventID: type,
            message: message 
        });
        
    }
            
    function userJoined(e){
        console.log('IO | userJoined: '+e);
        this.sendMessage('slideChange', FLOCK.app.main.currentSlide); 
        this.userManager.addUser(e);
    }
        
    function userStatus(e){
        console.log('IO | userStatus');
        console.log(e);
        console.log($.parseJSON(String(e)));   
        this.userManager.userStatus($.parseJSON(String(e)));
    }
    
    function testFn(e){
        console.log('testFn: '+e);        
    }
      
    IOMaster.prototype.sendMessage = sendMessage;
    
    return IOMaster;
}));