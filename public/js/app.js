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

function HomeViewModel() {
    // Data
    var self = this;

    // All arbitrary observables
    self.selectedPage = ko.observable();
    self.selectedHeaderLink = ko.observable();
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
    };
    self.sendMessage = function(event) {
        /* Sends chat messages in chatrooms */

        msg = $('#chat-message').val();
        io.emit('message', {user: user, msg: msg + '<br />', room: event.id});
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

        $.ajax({
            type: "POST",
            url: "/match/create",
            data: { platform: platform,
                    type: type,
                    game: game,
                    title: title,
                    desc: desc,
                    creator: creator }
        
            }).done(function (msg) {
                location.hash = '#/find';
            });

        //location.hash = '#/match/new';
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
                    steamid: steamid }
        }).done(function (msg) {
            if (msg == true) {
              location.reload();
            }
            else {
              // If errors, construct errors messages into a list
              var json = [];
              $.each(msg.errors, function(i, v) {
                  json.push(v.message); 
              });
              
              // Register errors list to display on client
              self.registerErrors(json);
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
              location.reload();
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

            /* Old method of just using loaded array to load single match
            // Fetch latest json data and push to findData binding
            $.getJSON("/api/matches/", function(data) { 
                self.findData(data);

                // Using fetched data, find selected node's details
                $.each(data.groups, function(i, v) {
                    if (v.id == id) {
                        self.selectedData(v);
                    }
                });
            });
            */

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
    
            // Broadcast socket.io message of user entering room
            io.emit('ready', {user: user, room: id});

/*
              var io = io.connect('http://battlestation.local:3000');
              alert('test');
              
              io.emit('ready', 'test123');
              io.on('announce', function(data) {
                $('#conversation').append(data.message);
              });
*/

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
    }).run();
    
};

// Apply all KO bindings to Model
ko.applyBindings(new HomeViewModel());
