Template.chitchatSubmit.events
  'keyup textarea#chitchat-body': (e, template) ->

    e.preventDefault()
    if e.which == 13 
      
      form = $('#chitchat-submit')
      id = form.data('id')
      body = form.find('[name=body]')
      chatbox = $('#chitchats')
      chatUl = chatbox.find('.chat')

      if !id
        chitchat = body: body.val()
        Meteor.call 'chitchat', chitchat, (error, chitchatId) ->
          if error
            alert error.reason
          else 
            form[0].reset()
            form.removeData('id')
      else
        chitchat = 
          body: body.val()
          submittedAt: new Date().getTime()
        
        Chitchats.update id, $set: chitchat, (error) ->
          if error
            alert error.reason
          else
            form[0].reset()
            form.removeData('id')
            Router.go 'chattrIndex'
      
      chatbox.animate
        scrollTop: chatUl.innerHeight(), 300
  
 
    