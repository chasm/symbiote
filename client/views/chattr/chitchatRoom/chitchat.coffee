Template.chitchat.helpers
  submittedText: -> new Date( @.submitted ).toString()
  ownChitchat: -> @.userId == Meteor.userId()

Template.chitchat.events
  'click .edit': (e) ->
    e.preventDefault()
    console.log($(e.target).data('id'))

    message = Chitchats.findOne $(e.target).data('id')
    textarea = $('.chitchat-form textarea[name=body]')
    textarea.val(message.body)
    $('.chitchat-form').attr('data-id', message._id)

  'click .delete': (e) ->
    e.preventDefault()
    Chitchats.remove $(e.target).data('id') if confirm("Delete this chat?")
