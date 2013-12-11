Template.chitchats.helpers
  chitchats: ->
    Chitchats.find()

Template.chitchats.events
  'dragstop .chatbox': (e) ->
    e.preventDefault()
    $('.chatbox').droppable()
    console.log("dropped in chitchat")

Template.chitchats.rendered = (e) ->
  $('.chatbox').droppable
    drop: (e) ->
      console.log("Dropped! chitchatbox", $(e.target))
