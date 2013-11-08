/*
 * MatchMoblin - A social gaming and matchmaking platform.
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
FirebaseChatRoomUrl = 'https://zombies.firebaseio.com/chat/room/';

function HomeViewModel() {
    // Data
    var self = this;

    // All arbitrary observables
    self.selectedPage = ko.observable();
    self.selectedHeaderLink = ko.observable();
    self.selectedMatch = ko.observable();
    self.findData = ko.observable();
    self.profileData = ko.observable();
    self.selectedDetails = ko.observable();
    self.selectedNode = ko.observable();
    self.selectedData = ko.observable();
    self.gamersOnline = ko.observable();

    // Registration/Login observable forms
    self.registerErrors = ko.observable();
    self.regUsername = ko.observable();
    self.regEmail = ko.observable();
    self.regPassword = ko.observable();
    self.regConfirmPassword = ko.observable();
    self.regSteamID = ko.observable();
    self.loginUsername = ko.observable();
    self.loginPassword = ko.observable();
    self.loginMessage = ko.observable();

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
    self.loadDetails = function(node) { 
        /* When clicking a node, redirect to node's url by id */

        location.hash = '#/find/' + node.id;
    };
    self.refreshMatches = function(event) {
        /* Refresh matches when 'Refresh' button is clicked */

        // Refresh matches array by updating model with a fresh get request
        $.getJSON("/api/matches/", self.findData);
    };
    self.copyURL = function(event) {
        /* Copy URL to clipboard when link input text is clicked */

        clip.setText("asdfasdfasd");
        alert("Copied to clipboard");
    };
    self.joinMatch = function(event) {
        /* Join match button on node */

        //alert(event.id);
        location.hash = '#/match/' + event.id;
        self.selectedMatch("#/match/" + event.id);
    };
    self.leaveMatch = function(event) {
      /* Leave match button on match view */

      room = $('#room').val();
      location.hash = '#/find/';
      self.selectedMatch(null);
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
    self.createMatch = function(name) {
        /* Post request for when creating a match */

        var platform = $('#input-platform a.btn.active').text();
        var type = $('#input-type a.btn.active').text();
        var game = $('#games-list').val();
        var title = $('#input-title').val();
        var desc = $('#input-description').val();
        var creator = name; //TODO Grab name from session
        var playstyle = $('#play-style').val();

        $.ajax({
            type: "POST",
            url: "/match/create",
            data: { platform: platform,
                    type: type,
                    game: game,
                    title: title,
                    desc: desc,
                    creator: creator,
                    playstyle: playstyle }
        
            }).done(function (msg) {
              if (msg.errors) {
                console.log("error");
                $("#create-error").text("Something went wrong!");
                return false;

              }
              else
              {
                location.hash = '#/match/' + msg;
                self.selectedMatch("#/match/" + msg);
              }
            });

        //location.hash = '#/match/new';
      return false;
    };
    self.registerUser = function(form) {
        /* Registration POST request when user clicks and posts Register form */

        var username = self.regUsername();
        var email = self.regEmail();
        var password = self.regPassword();
        var confirmPassword = self.regConfirmPassword();
        var steamid = self.regSteamID();

        /*
        var username = $('#register-form #RegisterUsername').val();
        var email = $('#register-form #RegisterEmail').val();
        var password = $('#register-form #RegisterPassword').val();
        var confirmPassword = $('#register-form #RegisterConfirmPassword').val();
        var steamid = $('#register-form #RegisterSteamID').val();
        */

        $.ajax({
            type: "POST",
            url: "/register",
            data: { username: username,
                    email: email,
                    password: password,
                    steamid: steamid },
            success: function(response) {
              location.reload();
            },
            error: function(xhr, options, err) {
              // If errors, construct errors messages into a list
              var jsonResponse = $.parseJSON(xhr.responseText);
              console.log(jsonResponse.errors);

              // Register errors list to display on client
              self.registerErrors(jsonResponse.errors);
            }
        });
    };
    self.loginUser = function(form) {
        /* Login Ajax Form on home */
        var username = self.loginUsername();
        var password = self.loginPassword();

        $.ajax({
            type: "POST",
            url: "/login",
            data: { username: username, password: password }
        }).done(function (msg) {
            if (msg == true) {
              window.location.reload();
            }
            else {
              self.loginMessage("Username and/or Password are incorrect");
            }
        });
    };
    
    // Client-side routes and SPA views
    Sammy(function() {
        this.get('#/find', function() {
            self.selectedPage('find');
            self.selectedHeaderLink('find');
            $.get("/api/matches/", self.findData);
        });
        this.get('#/find/:id', function() {

            // Switch to Find view and update dom
            self.selectedPage('find');
            self.selectedHeaderLink('find');

            // Update infobox div view with selected node 
            var id = this.params['id'];
            self.selectedNode(id);

            // Only fire GET request if matches array have been loaded
            if (!self.matchesLoaded) {
            $.getJSON("/api/matches/", function(matches) {
                self.findData(matches);

                // Set matchesLoaded so json request is not made again
                self.matchesLoaded = true;
            });
            }

            // GET selected match json
            $.getJSON("/api/match/" + id, function(data) { 
                self.selectedData(data.match);
            });
        });
        this.get('#/create', function() {

            // Switch to Create view and update dom
            self.selectedPage('create');
            self.selectedHeaderLink('create');
            
            // Enable select2 on Create page
            $('#games-list').select2();
        });
        this.get('#/match/:id', function() {
            var id = this.params['id'];

            // Switch to Create view and update dom
            self.selectedPage('match');
            self.selectedHeaderLink('match');

            // GET selected match json
            $.getJSON("/api/match/" + id, function(data) { 
                self.selectedData(data.match);
            });

            // Add firebase callback for messages stored and added
            var messagesRef = new Firebase(FirebaseChatRoomUrl + id + '/messages');
            var onlineRef = new Firebase(FirebaseChatRoomUrl + id + '/users/' + user + '/online');

            // stores the timestamp of my last disconnect (the last time I was seen online)
            var lastOnlineRef = new Firebase(FirebaseChatRoomUrl + id + '/users/' + user + '/lastOnline');

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

            messagesRef.limit(10).on('child_added', function (snapshot) {
              var message = snapshot.val();
              $('<div/>').text(message.text).prepend($('<em/>')
                .text(message.name+': ')).appendTo($('#messages'));
              //$('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
            });
        });
        this.get('#/profile/:name/friends', function() {
            var name = this.params['name'];

            // Set selected page and link to apply css underline
            self.selectedPage('profile');
            self.selectedHeaderLink('friends');

            // Load profile json, enable popovers on trophies, pre-select friends tab
            $.get("/api/profile/" + name, self.profileData).done(function(){;
                $("[rel=popover]").popover({placement: 'bottom', trigger: 'hover'});
                $('#profile-tabs a[href$="profile-friends"]').tab('show');
            })
        });
        this.get('#/profile/:name/trophies', function() {
            var name = this.params['name'];

            // Set selected page and link to apply css underline
            self.selectedPage('profile');
            self.selectedHeaderLink('trophies');

            // Load profile json, enable popovers on trophies, pre-select trophies tab
            $.get("/api/profile/" + name, self.profileData).done(function(){;
                $("[rel=popover]").popover({placement: 'bottom', trigger: 'hover'});
                $('#profile-tabs a[href$="profile-trophies"]').tab('show');
            })
        });
        this.get('#/profile/:name', function() {
            var name = this.params['name'];

            // Set selected page and link to apply css underline
            self.selectedPage('profile');
            self.selectedHeaderLink('profile');

            // Load profile json, enable popovers on trophies, pre-select profile tab
            $.get("/api/profile/" + name, self.profileData).done(function(){;
                $("[rel=popover]").popover({placement: 'bottom', trigger: 'hover'});
                $('#profile-tabs a[href$="profile-profile"]').tab('show');
            })

        });
        this.get('#/profile/:name/mygames', function() {
            var name = this.params['name'];

            // Set selected page and link to apply css underline
            self.selectedPage('profile');
            self.selectedHeaderLink('mygames');

            // Enable select2 on Create page
            $('#add-games').select2({
            });

            // Load profile json, enable popovers on trophies, pre-select games tab
            $.get("/api/profile/" + name, self.profileData).done(function(){;
                $("[rel=popover]").popover({placement: 'bottom', trigger: 'hover'});
                $('a[href$="profile-games"]').tab('show');
            })
        });
        this.get('#/about', function() {

            // Set selected page and link to apply css underline
            self.selectedHeaderLink('about');
        });
        this.get('#/terms', function() {

            // Set selected page and link to apply css underline
            self.selectedHeaderLink('terms');
        });
        this.get('#/privacy', function() {

            // Set selected page and link to apply css underline
            self.selectedHeaderLink('privacy');
        });
                
        // Redirect index to #/find
        this.get('/', function() { this.redirect('#/find') });

        // Prevent sammy.js from redirect form submissions
        this._checkFormSubmission = function(form) {
            return (false);
        };
    }).run();
    
};

// Apply all KO bindings to Model
ko.applyBindings(new HomeViewModel());
