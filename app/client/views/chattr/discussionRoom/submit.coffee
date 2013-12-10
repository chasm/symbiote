Template.discussionSubmit.events
  'keyup textarea#discussion-body': (e, template) ->

    e.preventDefault()
    if e.which == 13 
      
      form = $('#discussion-submit')
      id = form.data('id')
      body = form.find('[name=body]')
      chatbox = $('#discussions')
      chatUl = chatbox.find('.chat')

      if !id
        discussion = body: body.val()
        Meteor.call 'discussion', discussion, (error, discussionId) ->
          if error
            alert error.reason
          else 
            form[0].reset()
            form.removeData('id')
      else
        discussion = 
          body: body.val()
          submittedAt: new Date().getTime()
        
        Discussions.update id, $set: discussion, (error) ->
          if error
            alert error.reason
          else
            form[0].reset()
            form.removeData('id')
            Router.go 'chattrIndex'
      
      chatbox.animate
        scrollTop: chatUl.innerHeight(), 300
  
 
    