Template.chatroom.events
  'dragstop .chatbox': (e) ->
    e.preventDefault()
    $('.chatbox').droppable()
    console.log("dropped in chitchat")

  'keyup textarea.chat-body': (e, template) ->

    e.preventDefault()
    if e.which == 13
      box = e.target.id.split('-')[0]
      form = $('#' + box + '-submit')
      id = form.data('id')
      body = form.find('[name=body]')
      chatbox = $('#' + box + 's')
      chatUl = chatbox.find('.chat')

      if !id
        chatbody= body: body.val()
        Meteor.call box, chatbody, (error) ->
          if error
            alert error.reason
          else
            form[0].reset()
            form.removeData('id')
      else
        console.log('exisintg chat')
        console.log(id)
        message =
          body: body.val()
          submittedAt: new Date().getTime()

        callback = (error) ->
          if error
            alert error.reason
          else
            form[0].reset()
            form.removeData('id')
            Router.go 'chattrIndex'

        switch box
          when "chitchat" then Chitchats.update id, $set: message, callback
          when "discussion" then Discussions.update id, $set: message, callback
          when "resource" then Resources.update id, $set: message, callback

      chatbox.animate
        scrollTop: chatUl.innerHeight(), 300


