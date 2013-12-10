@Wireframes = new Meteor.Collection 'wireframes'

Meteor.methods
  createModel: ->
    user = Meteor.user()
    throw new Meteor.Error 401, 'You need to login to create a model' if !user
      
    wireframe = Wireframes.insert {projectTitle: "New Model", creatorId: user._id}