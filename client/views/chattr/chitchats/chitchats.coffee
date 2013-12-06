Template.chitchatLog.helpers
  chitchats: ->
    Chitchats.find()

Template.chitchat.helpers
  submittedText: -> new Date( @.submitted ).toString()

Template.chitchat.events
  'click .edit': (e) ->
    e.preventDefault()
    console.log($(e.target).html())

  'click .delete': (e) ->
    e.preventDefault()
    Chitchats.remove $(e.target).data('id') if confirm("Delete this chat?")

      