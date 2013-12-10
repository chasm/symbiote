Template.chitchat.helpers
  submittedText: -> new Date( @.submittedAt ).toString()
  ownChitchat: -> @.userId == Meteor.userId()

Template.chitchat.events
  'click .edit': (e) ->
    e.preventDefault()
    id = $(e.target).data('id')
    console.log id

    message = Chitchats.findOne id
    form = $('#chitchat-submit')
    textarea = form.find('textarea[name=body]')
    textarea.val(message.body)
    form.data('id', message._id)

  'click .delete': (e) ->
    e.preventDefault()
    id = $(e.target).data('id')
    Chitchats.remove id if confirm("Delete this chat?")
