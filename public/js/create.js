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

function CreateViewModel() {
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
    self.passwordProtectCheckbox = ko.observable(false);

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
    self.createGroup = function(name) {
        /* Post request for when creating a group */

        var creator = name; //TODO Grab name from session
        var game = $('#input-game').val();
        var size = $('#input-size').val();
        var playstyle = $('#play-style').val();
        var title = $('#input-title').val();
        var desc = $('#input-description').val();
        var serverAddress = $('#server-address').val();
        var experience = $('#input-experience').val();
        var voipType = $('#voip-type').val();
        var voipAddress = $('#voip-address').val();
        var voipPort = $('#voip-port').val();
        var voipPassword = $('#voip-password').val();
        var groupPassword = $('#group-password').val();

        $.ajax({
            type: "POST",
            url: "/group/create",
            data: { game: game,
                    size: size,
                    playstyle: playstyle,
                    title: title,
                    desc: desc,
                    serverAddress: serverAddress,
                    experience: experience,
                    voipType: voipType,
                    voipAddress: voipAddress,
                    voipPassword: voipPassword,
                    groupPassword: groupPassword,
                    creator: creator }

            }).done(function (msg) {
              if (msg.errors) {
                console.log("error");
                $("#create-error").text("Something went wrong!");
                return false;

              }
              else
              {
                window.location = '/group/#/' + msg;
              }
            });

        //location.hash = '#/match/new';
      return false;
    };

    // Client-side routes and SPA views
    Sammy(function() {
        this.get('/create', function() {

            // Switch to Create view and update dom
            self.selectedPage('create');
            self.selectedHeaderLink('create');

            // Enable select2 on Create page
            $('#games-list').select2();
        });

        // Prevent sammy.js from redirect form submissions
        this._checkFormSubmission = function(form) {
            return (false);
        };
    }).run();

};

// Apply all KO bindings to Model
ko.applyBindings(new CreateViewModel());
