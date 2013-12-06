Template.chitchatLog.helpers
  chitchats: ->
    Chitchats.find()

Template.chitchat.helpers
  submittedText: -> new Date( @.submitted ).toString()

# not working from here

  'click .edit': (e) ->
    e.preventDefault()
    console.log($(e.target).html())

  'click .delete': (e) ->
    console.log("test")
    e.preventDefault()
    console.log("test")
    if confirm("Delete this chat?")
      currentChitchatId = $(e.target).data(id)
      console.log(currentChitchatId)
      Chitchats.remove currentChitchatId


      