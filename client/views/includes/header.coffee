Template.logIn.events
  'click #login': ->
    Meteor.loginWithGithub
      requestPermissions: ['user','repo'],
      (err) ->
        if err
          alert err
        else
          console.log 'user', Meteor.user()
          if cohorts = Meteor.user().cohorts
            Session.set('cohorts', cohorts) if cohorts.length > 1
            Session.set('currentCohort', cohorts[0])
            console.log 'Cohorts!', cohorts
            console.log 'Session.cohorts', Session.get('cohorts')
            console.log 'Session.cohorts', Session.get('currentCohort')
        

Template.logOut.events
  'click #logout': ->
    Meteor.logout (err) ->
      alert err if err
