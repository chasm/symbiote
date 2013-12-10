Template.discussions.helpers
  discussions: ->
    Discussions.find()

Template.discussions.rendered = (e) ->   
  $('.chatbox').droppable
    drop: (e) ->
      console.log("Dropped!", $(e.target))

  


      