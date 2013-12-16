@Discussions = new Meteor.Collection 'discussions'

Meteor.methods
  discussion: (discussionAttributes) -> 
    user = Meteor.user()
    # ensure the user is logged in
    if !user
      throw new Meteor.Error 401, "You need to login to make chats"
    if !discussionAttributes.body
      throw new Meteor.Error 422, 'Please write some content'
    discussion = _.extend(_.pick(discussionAttributes, 'body'), {
      userId: user._id,
      author: user.profile.login,
      submittedAt: new Date().getTime()
    })
    # create the discussion, save the id
    discussion._id = Discussions.insert discussion
    discussion._id