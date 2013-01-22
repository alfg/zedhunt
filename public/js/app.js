

function HomeViewModel() {
    // Data
    var self = this;
    self.selectedPage = ko.observable();
    self.selectedHeaderLink = ko.observable();
    self.findData = ko.observable();
    self.profileData = ko.observable();
    self.selectedDetails = ko.observable();
    self.selectedNode = ko.observable();
    self.selectedData = ko.observable();

    // Behaviours
    self.loadDetails = function(node) { 
        location.hash = '#/find/' + node.id;
    };
    self.copyURL = function(clip) {
        clip.setText("asdfasdfasd");
        alert("Copied to clipboard");
    };
    self.createMatch = function(form) {
        var platform = $('#input-platform a.btn.active').text();
        var type = $('#input-type a.btn.active').text();
        var game = $('#games-list').val();
        var title = $('#input-title').val();
        var desc = $('#input-description').val();
        var creator = 'Alf'; //TODO Grab name from session

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
                alert("Submitted" + msg);
            });

        //location.hash = '#/match/new';
    };
    
    // Client-side routes    
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


        });
        this.get('#/create', function() {

            // Switch to Create view and update dom
            self.selectedPage('create');
            self.selectedHeaderLink('create');
            
            // Enable select2 on Create page
            $('#games-list').select2();
        });
        this.get('#/match/new', function() {

            // Switch to Create view and update dom
            self.selectedPage('create');
            self.selectedHeaderLink('create');
            
        });
        this.get('#/profile/:name/friends', function() {
            var name = this.params['name'];
            self.selectedPage('profile');
            self.selectedHeaderLink('friends');
            $.get("/api/profile/" + name, self.profileData).done(function(){;
                $("[rel=popover]").popover({placement: 'bottom', trigger: 'hover'});
                $('#profile-tabs a[href$="profile-friends"]').tab('show');
            })
        });
        this.get('#/profile/:name/trophies', function() {
            var name = this.params['name'];
            self.selectedPage('profile');
            self.selectedHeaderLink('trophies');
            $.get("/api/profile/" + name, self.profileData).done(function(){;
                $("[rel=popover]").popover({placement: 'bottom', trigger: 'hover'});
                $('#profile-tabs a[href$="profile-trophies"]').tab('show');
            })
        });
        this.get('#/profile/:name', function() {
            var name = this.params['name'];
            self.selectedPage('profile');
            self.selectedHeaderLink('profile');
            $.get("/api/profile/" + name, self.profileData).done(function(){;
                $("[rel=popover]").popover({placement: 'bottom', trigger: 'hover'});
                $('#profile-tabs a[href$="profile-profile"]').tab('show');
            })

        });
        this.get('#/profile/:name/mygames', function() {
            var name = this.params['name'];
            self.selectedPage('profile');
            self.selectedHeaderLink('mygames');
            $.get("/api/profile/" + name, self.profileData).done(function(){;
                $("[rel=popover]").popover({placement: 'bottom', trigger: 'hover'});
                $('a[href$="profile-games"]').tab('show');
            })
        });
        this.get('#/about', function() {
            self.selectedHeaderLink('about');
        });
        this.get('#/terms', function() {
            self.selectedHeaderLink('terms');
        });
        this.get('#/privacy', function() {
            self.selectedHeaderLink('privacy');
        });
                
        this.get('/', function() { this.redirect('#/find') });        
    }).run();
    
};

ko.applyBindings(new HomeViewModel());
