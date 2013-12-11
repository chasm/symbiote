(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.logIn.events({
  'click #login': function() {
    return Meteor.loginWithGithub({
      requestPermissions: ['user', 'repo']
    }, function(err) {
      var cohorts;
      if (err) {
        return alert(err);
      } else {
        if (cohorts = Meteor.user().profile.cohorts) {
          if (cohorts.length > 1) {
            Session.set('cohorts', cohorts);
          }
          return Session.set('currentCohort', cohorts[0]);
        }
      }
    });
  }
});

})();

//# sourceMappingURL=2f4cf96dbff0b4d39f600ebac3fa4bb4ccd4fa47.map
