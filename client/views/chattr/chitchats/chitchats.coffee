Template.chitchatLog.helpers
  chitchats: ->
    Chitchats.find()

Template.chitchat.helpers
  submittedText: -> new Date( @.submitted ).toString()

  # not working
  'click .delete': (e) ->
    e.preventDefault()
    console.log("delete")
    if  confirm("Delete this chat?")
      currentChitchatId = $(@).data(id)
      console.log(currentChitchatId)
      Chitchats.remove currentChitchatId

      