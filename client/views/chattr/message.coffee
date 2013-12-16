Template.message.helpers
  submittedAt: -> new Date( @.submittedAt ).toString()
  ownChitchat: -> @.userId == Meteor.userId()

Template.message.events

  'click .edit': (e) ->
    e.preventDefault()
    id = $(e.target).data('id')
    

    chitchat = Chitchats.findOne(id) 
    discussion= Discussions.findOne(id)
    if chitchat
      message=chitchat
      form = $('#chitchat-submit')
    if discussion 
      message=discussion
      form = $('#discussion-submit')

    textarea = form.find('textarea[name=body]')
    textarea.val(message.body)
    form.data('id', message._id)

  'click .delete': (e) ->
    e.preventDefault()
    id = $(e.target).data('id')
    if confirm("Delete this chat?")
      Chitchats.remove id 
      Discussions.remove id


Template.message.rendered = (e) ->
  $('.draggable').draggable
    helper: 'clone',
    revert: 'invalid',
    appendTo: 'body'
    drag: (e,ui) -> 
      id=$(e.target).data('id')
      chat=Chitchats.findOne(id) || Discussions.findOne(id)
      chat.userId == Meteor.userId()
      


    
