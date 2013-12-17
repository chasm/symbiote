Meteor.publish 'cohorts', -> Cohorts.find()
Meteor.publish 'chitchats', -> Chitchats.find()
Meteor.publish 'discussions', -> Discussions.find()
Meteor.publish 'wireframes', -> Wireframes.find()
Meteor.publish 'users', -> Meteor.users.find()
Meteor.publish 'notifications', ->
  Notifications.find userId: @.userId