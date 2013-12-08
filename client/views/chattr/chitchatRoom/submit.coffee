Template.chitchatSubmit.events
  'submit form': (e, template) ->
    e.preventDefault()
    id=$(e.target).data('id')  
    console.log(id)  
    
    # removeAttr not working? 
    $(e.target).removeAttr('data-id')
    $('.chitchat-form').attr('data-id', '')

    if !id

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
      currentChitchatId = id;

      chitchatProperties = 
        body: $(e.target).find('[name=body]').val()
        submitted: new Date().getTime()
      
      Chitchats.update currentChitchatId, $set: chitchatProperties, (error) ->
        if error
          # display the error to the user
          alert error.reason
        else
          $(e.target).find('[name=body]').val('')
          Router.go 'chattrIndex'
