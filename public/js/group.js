/*
 * ZedHunt - Squad Matchmaking for DayZ.
 * Powered by Express.js, MongoDB, and Knockout.js.
 *
 * Author: Alf
 *
 * Copyright (c) 2013 Alfred Gutierrez http://alfg.co
 *
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://github.com/alfg/zedhunt
 */

/*
 * All Knockout views, routes, logic.
 */

FirebaseUrl = 'https://zombies.firebaseio.com/';
FirebaseChatRoomUrl = 'https://zombies.firebaseio.com/chat/rooms/';
FirebaseUsersUrl = 'https://zombies.firebaseio.com/chat/users/';

function GroupViewModel() {
    // Data
    var self = this;
    loadedUsers = [];

    // All arbitrary observables
    self.selectedPage = ko.observable();
    self.selectedHeaderLink = ko.observable();
    self.selectedGroup = ko.observable();
    self.findData = ko.observable();
    self.profileData = ko.observable();
    self.selectedDetails = ko.observable();
    self.selectedNode = ko.observable();
    self.selectedData = ko.observable();
    self.gamersOnline = ko.observable();
    self.usersInRoomCount = ko.observable();
    self.usersInRoom = ko.observableArray();

    // Behaviours/Functions
    self.gamersOnline = ko.computed(function() {
        /* Users online count from stats API */

        var userCount = [];
        $.ajax({
            url: "/api/stats",
            async: false,
            dataType: "json",
            success: function (json) {
                userCount = json.usersonline;
            }
        });
        return userCount;
    });

    self.usersInRoomCount = function(node) {
      return Object.size(loadedUsers[node.id]);;
    }
    self.loadDetails = function(node) {
        /* When clicking a node, redirect to node's url by id */

        location.hash = '#/find/' + node.id;
    };
    self.copyURL = function(event) {
        /* Copy URL to clipboard when link input text is clicked */

        clip.setText("asdfasdfasd");
        alert("Copied to clipboard");
    };
    self.joinGroup = function(event) {
        /* Join match button on node */

        //alert(event.id);
        location.hash = '#/group/' + event.id;
        self.selectedGroup("#/group/" + event.id);
    };
    self.leaveGroup = function(event) {
      /* Leave group button on match view */

      room = $('#room').val();
      location.hash = '#/find/';
      self.selectedGroup(null);
    };
    self.sendMessage = function(formElement) {
        /* Sends chat messages in chatrooms */
        var msg = $('#chat-message').val();
        var room = $('#room').val();
        var messagesRef = new Firebase(FirebaseChatRoomUrl + room + '/messages');
        messagesRef.push({name: user, text:msg});

        $('#chat-message').val('');
        //$('#conversation').scrollTop($('#conversation')[0].scrollHeight);
    };

    // Client-side routes and SPA views
    Sammy(function() {
        this.get('#:id', function() {
            var id = this.params['id'];

            // Switch to Create view and update dom
            self.selectedPage('group');
            self.selectedHeaderLink('group');

            // GET selected match json
            $.getJSON("/api/group/" + id, function(data) {
                self.selectedData(data.group);
            });

            // Add firebase callback for messages stored and added
            var messagesRef = new Firebase(FirebaseChatRoomUrl + id + '/messages');

            //var onlineRef = new Firebase(FirebaseChatRoomUrl + id + '/users/' + user + '/online');
            //var userListRef = new Firebase(FirebaseChatRoomUrl + id + '/users');
            //var lastOnlineRef = new Firebase(FirebaseChatRoomUrl + id + '/users/' + user + '/lastOnline');

            var onlineRef = new Firebase(FirebaseUsersUrl + id + '/' + user + '/online');
            var userListRef = new Firebase(FirebaseUsersUrl + id);
            var lastOnlineRef = new Firebase(FirebaseUsersUrl + id + '/' + user + '/lastOnline');

            var connectedRef = new Firebase(FirebaseUrl + '/.info/connected');

            connectedRef.on('value', function(snap) {
                if (snap.val() === true) {
                    // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)

                    // add this device to my connections list
                    // this value could contain info about the device or a timestamp too
                    onlineRef.set(true);

                    // when I disconnect, remove this device
                    onlineRef.onDisconnect().remove();


                    // when I disconnect, update the last time I was seen online
                    lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
                }
            });


            messagesRef.limit(20).on('child_added', function (snapshot) {
              var message = snapshot.val();
              $('<div/>').text(message.text).prepend($('<em/>')
                .text(message.name+': ')).appendTo($('#messages'));
              $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
            });

            userListRef.on("value", function(snapshot) {
              var users = [];
              var user = snapshot.val();
              for (var key in user) {
                users.push({ key: key, value: user[key] });
              }
              self.usersInRoom(users);
            });
        });

        // Prevent sammy.js from redirect form submissions
        this._checkFormSubmission = function(form) {
            return (false);
        };
    }).run();

};

// Apply all KO bindings to Model
ko.applyBindings(new GroupViewModel());
