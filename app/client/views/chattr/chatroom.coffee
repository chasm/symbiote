Template.chatroom.events
  'dragstop .chatbox': (e) ->
    e.preventDefault()
    $('.chatbox').droppable()
    console.log("dropped in chitchat")

Template.chatroom.rendered = (e) ->
  $('.chatbox').droppable
    drop: (e) ->
      console.log("Dropped! chitchatbox", $(e.target))
