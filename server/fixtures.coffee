# Fixture data 
if Chitchats.find().count() == 0
  now = new Date().getTime()

  # create a user
  tomId = Meteor.users.insert
    profile:
      firstName: 'Tom'
      lastName: 'Coleman'
  tom = Meteor.users.findOne tomId

  if tom?
  	Chitchats.insert
      userId: tom._id
      author: tom.profile.firstName
      submitted: now - 5 * 3600 * 1000
      body: 'Interesting project Sacha, can I get involved?'
