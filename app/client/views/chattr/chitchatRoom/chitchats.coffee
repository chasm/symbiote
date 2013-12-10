Template.chitchats.helpers
  chitchats: ->
    Chitchats.find()

Template.chitchats.rendered ->
  
  $('.draggable').draggable();
  'dragover .chat' : (e) ->
    e.preventDefault()
    console.log('dragover')
    $(e.currentTarget).addClass('dragover')


  'dragleave .chat' : (e) ->
    $(e.currentTarget).removeClass('dragover')
    console.log('dragleave')

  'drop .chat' : (e, ui) ->
    e.preventDefault()
    console.log('drop!')

      