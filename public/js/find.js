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

function HomeViewModel() {
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
  /*
    self.usersInRoomCount = function(data) {
      var usersInRoom = new Firebase(FirebaseChatRoomUrl + data.id + '/users/');
      usersInRoom.on("value", function(snapshot) {
        var count = snapshot.numChildren();
        console.log(count);
      });
      return 'test';
    };
    */
    self.usersInRoomCount = function(node) {
      return Object.size(loadedUsers[node.id]);;
    }
    self.loadDetails = function(node) {
        /* When clicking a node, redirect to node's url by id */

        location.href = "/find/#/" + node.id;
    };
    self.refreshGroups = function(event) {
        /* Refresh groups when 'Refresh' button is clicked */

        // Refresh groups array by updating model with a fresh get request
        $.getJSON("/api/groups/", self.findData);
    };
    self.copyURL = function(event) {
        /* Copy URL to clipboard when link input text is clicked */

        clip.setText("asdfasdfasd");
        alert("Copied to clipboard");
    };
    self.joinGroup = function(event) {
        /* Join match button on node */

        //alert(event.id);
        location.href = '/group/#/' + event.id;
        self.selectedGroup("/group/#/" + event.id);
    };
    self.leaveGroup = function(event) {
      /* Leave group button on match view */

      room = $('#room').val();
      location.hash = '#/find/';
      self.selectedGroup(null);
    };

    // Client-side routes and SPA views
    Sammy(function() {
        this.get('find', function() {
            self.selectedPage('find');
            self.selectedHeaderLink('find');
            $.get("/api/groups/", self.findData);
            $.get(FirebaseUsersUrl + ".json", function(users) {
              loadedUsers = users;
            });

        });
        this.get('/find/#/:id', function() {

            // Switch to Find view and update dom
            self.selectedPage('find');
            self.selectedHeaderLink('find');

            // Update infobox div view with selected node
            var id = this.params['id'];
            self.selectedNode(id);

            // Only fire GET request if groups array have been loaded
            if (!self.groupsLoaded) {
            $.getJSON("/api/groups/", function(groups) {
                self.findData(groups);

                // Set groupsLoaded so json request is not made again
                self.groupsLoaded = true;
            });
            }

            // GET selected match json
            $.getJSON("/api/group/" + id, function(data) {
                self.selectedData(data.group);
            });

            var userListRef = new Firebase(FirebaseUsersUrl + id);
            userListRef.on("value", function(snapshot) {
              var users = [];
              var user = snapshot.val();
              for (var key in user) {
                users.push({ key: key, value: user[key] });
              }
              self.usersInRoom(users);
            });
        });

        // Redirect index to #/find
        //this.get('/', function() { this.redirect('#/find') });

        // Prevent sammy.js from redirect form submissions
        this._checkFormSubmission = function(form) {
            return (false);
        };
    }).run();

};

// Apply all KO bindings to Model
ko.applyBindings(new HomeViewModel());
