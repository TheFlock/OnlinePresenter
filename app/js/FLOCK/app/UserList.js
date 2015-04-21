// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/amdWebGlobal.js

;(function (root, factory) {
    // Browser globals
    root.app = root.app || {};

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([
                'mustache'
            ], function () {
            return (root.app.UserList = factory());
        });
    } else {
        root.app.UserList = factory();
    }
}(window.FLOCK = window.FLOCK || {}, function () {


    var UserList = function () {
        console.log('UserList!');
        this.members = {};
        this.container = document.getElementById("userList");
    }
        
    function addUser(id){
        console.log('addUser: '+id);
        var newElement = document.createElement('li'),
            userIDElem = document.createElement('span'),
            userStatusElem = document.createElement('span');
        
        userIDElem.className = "user_id";
        newElement.appendChild(userIDElem);
        userIDElem.innerHTML = id;
        
        userStatusElem.className = "user_status";        
        newElement.appendChild(userStatusElem);
        
        this.container.appendChild(newElement);
        
        this.members[id] = {
            elem: newElement,
            userIDElem: userIDElem,
            statusElem: userStatusElem,
            loaded: 0,
            slide: '',
            status: ''
        }
        
    }
    
    function userStatus(data){
        if(!data.id)return;
        if(!this.members[data.id]){
            this.addUser(data.id);
            window.requestAnimationFrame( function(){
                userStatus.call(this, data);
            }.bind(this) );
            return;
        }
        console.log('userStatus: '+data.id);
        if(data.status && data.status.slide)this.members[data.id].slide = data.status.slide;
        if(data.status && data.status.status)this.members[data.id].status = data.status.status;
        this.members[data.id].statusElem.innerHTML = this.members[data.id].slide+" | "+this.members[data.id].status;
    }
        
      
    UserList.prototype.addUser = addUser;
    UserList.prototype.userStatus = userStatus;
    
    return UserList;
}));