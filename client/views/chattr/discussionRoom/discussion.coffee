Template.discussion.helpers
  submittedText: -> new Date( @.submittedAt ).toString()
  ownDiscussion: -> @.userId == Meteor.userId()

Template.discussion.events
  'click .edit': (e) ->
    e.preventDefault()
    id = $(e.target).data('id')
    console.log id

    message = Discussions.findOne id
    form = $('#discussion-submit')
    textarea = form.find('textarea[name=body]')
    textarea.val(message.body)
    form.data('id', message._id)

  'click .delete': (e) ->
    e.preventDefault()
    id = $(e.target).data('id')
    Discussions.remove id if confirm("Delete this chat?")
