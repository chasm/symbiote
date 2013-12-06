Template.chitchatLog.helpers
  chitchats: ->
    Chitchats.find()

Template.chitchat.helpers
  submittedText: -> new Date( @.submitted ).toString()