Template.chatroom.events
  'dragstop .chatbox': (e) ->
    e.preventDefault()
    $('.chatbox').droppable()
    console.log("dropped in chitchat")

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
        console.log('exisintg chat')
        console.log(id)
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

Template.chatroom.rendered = (e) ->
  $('.chatbox').droppable
    drop: (e) ->
      console.log("Dropped! chitchatbox", $(e.target))
