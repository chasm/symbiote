Template.chitchatSubmit.events
  'submit form': (e, template) ->
    e.preventDefault()
    

    if !this._id

      # create
      
      $body = $(e.target).find('[name=body]')
      chitchat = 
        body: $body.val()
      

      Meteor.call 'chitchat', chitchat, (error, chitchatId) ->
        if error
          throwError(error.reason)
        else 
          $body.val('')
    else
    
      # edit
      currentChitchatId = this._id;

      chitchatProperties = 
        body: $(e.target).find('[name=body]').val()
      
      Chitchats.update currentChitchatId, $set: chitchatProperties, (error) ->
        if error
          # display the error to the user
          alert error.reason
        else
          Router.go 'chattrIndex'