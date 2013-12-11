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

Template.discussion.rendered = (e) ->
  $('.discussion').draggable
    helper: 'clone',
    revert: 'invalid',
    appendTo: 'body'
    drag: (e,ui) -> 
      id=$(e.target).data('id')
      chat = Discussions.findOne(id)
      chat.userId == Meteor.userId()

