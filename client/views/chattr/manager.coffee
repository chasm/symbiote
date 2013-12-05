Template.chatSubmit.helpers
  submittedText: -> new Date( @.submitted ).toString()
Template.chatSubmit.events
  'submit form': (e, template) ->
    e.preventDefault()

    $body = $(e.target).find('[name=body]')
    chat = {
      body: $body.val()
    }

    Meteor.call 'chat', chat, (error, chatId) ->
      if error
        throwError(error.reason)
      else 
        $body.val('')
