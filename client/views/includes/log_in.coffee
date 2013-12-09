Template.logIn.events
  'click #login': ->
    Meteor.loginWithGithub
      requestPermissions: ['user','repo'],
      (err) ->
        if err
          alert err
        else
          console.log Meteor.user()
          if cohorts = Meteor.user().profile.cohorts
            Session.set('cohorts', cohorts) if cohorts.length > 1
            Session.set('currentCohort', cohorts[0])