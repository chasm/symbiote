Template.chattrIndex.helpers
  resourceRoom: ->
    title: 'Resources'
    slug: 'resources'
    unit: 'resource'
    messages: []
  discussionRoom: ->
    title: 'Discussion'
    slug: 'discussions'
    unit: 'discussion'
    messages: Discussions.find()
  chitchatRoom: ->
    title: 'Chit-chat'
    slug: 'chitchats'
    unit: 'chitchat'
    messages: Chitchats.find()

Template.chattrIndex.rendered = (e) ->
  $('.chatbox').droppable
    accept: ".chat li"
    drop: (e, ui) ->
      id=ui.draggable.data('id')
      category = $(e.target).data('id')
      chitchat= Chitchats.findOne(id)
      discussion = Discussions.findOne(id)
      if category=="discussions" && chitchat
        Chitchats.remove id
        Discussions.insert chitchat
      else if category=="chitchats" && discussion
        Discussions.remove id
        Chitchats.insert discussion
      else
        revert: true



