Router.configure
  layoutTemplate: 'layout'
  loadingTemplate: 'loading'
  waitOn: -> [
    Meteor.subscribe('chitchats')
    Meteor.subscribe('discussions')
  ]

Router.map ->
  @.route 'dashboard', path: '/'

  @.route 'chattrIndex', path: '/chattr'
  @.route 'quizillaIndex', path: '/quizilla'
  @.route 'codrIndex', path: '/codr'

  @.route 'modelrIndex', path: '/modelr'
  @.route 'modelrPage', 
    path: '/modelr/:_id'  
    waitOn: ->
    	Meteor.subscribe 'wireframes', @.params._id
    	Meteor.subscribe 'users'
    data: -> 
      Session.set('currentModelId', @.params._id)

  @.route 'stylrIndex', path: '/stylr'
  @.route 'profilrIndex', path: '/profilr'

