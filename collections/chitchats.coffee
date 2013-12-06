@Chitchats = new Meteor.Collection 'chitchats'

Meteor.methods
  chitchat: (chitchatAttributes) -> 
    user = Meteor.user()
    # ensure the user is logged in
    if !user
      throw new Meteor.Error 401, "You need to login to make comments"
    if !chitchatAttributes.body
      throw new Meteor.Error 422, 'Please write some content'
    chitchat = _.extend(_.pick(chitchatAttributes, 'body'), {
      userId: user._id,
      author: user.profile.login,
      submitted: new Date().getTime()
    })
    # create the chitchat, save the id
    chitchat._id = Chitchats.insert chitchat
    chitchat._id