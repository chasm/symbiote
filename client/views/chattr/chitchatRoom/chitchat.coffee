Template.chitchat.helpers
  submittedText: -> new Date( @.submitted ).toString()
  ownChitchat: -> @.userId == Meteor.userId()

Template.chitchat.events
  'click .edit': (e) ->
    e.preventDefault()
    console.log($(e.target).data('id'))
    
    # how to send this chitchat to submit form?


  'click .delete': (e) ->
    e.preventDefault()
    Chitchats.remove $(e.target).data('id') if confirm("Delete this chat?")
