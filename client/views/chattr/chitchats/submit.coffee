Template.chitchatSubmit.events
  'submit form': (e, template) ->
    e.preventDefault()

    $body = $(e.target).find('[name=body]')
    chitchat = {
      body: $body.val()
    }

    Meteor.call 'chitchat', chitchat, (error, chitchatId) ->
      if error
        throwError(error.reason)
      else 
        $body.val('')
