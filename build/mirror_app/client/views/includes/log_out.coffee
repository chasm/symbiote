Template.logOut.events
  'click #logout': ->
    Meteor.logout (err) ->
      alert err if err
