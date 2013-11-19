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

function ProfileViewModel() {
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

    // Client-side routes and SPA views
    Sammy(function() {
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
        this.get('#/:name', function() {
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
        this.get('#/:name/mygames', function() {
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

        // Prevent sammy.js from redirect form submissions
        this._checkFormSubmission = function(form) {
            return (false);
        };
    }).run();

};

// Apply all KO bindings to Model
ko.applyBindings(new ProfileViewModel());
