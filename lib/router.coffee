Router.configure
  layoutTemplate: 'layout'
  loadingTemplate: 'loading'

Router.map ->
  @.route 'dashboard', path: '/'

  @.route 'chattrIndex', path: '/chattr'
  @.route 'quizillaIndex', path: '/quizilla'
  @.route 'codrIndex', path: '/codr'
  @.route 'modelrIndex', path: '/modelr'
  @.route 'stylrIndex', path: '/stylr'
  @.route 'profilrIndex', path: '/profilr'

