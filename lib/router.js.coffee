Router.configure
  layoutTemplate: 'layout'
  loadingTemplate: 'loading'

Router.map ->
  @.route 'homePage', path: '/'

  @.route 'chattrPage', path: '/chattr'
  @.route 'codrPage', path: '/codr'
  @.route 'modelrPage', path: '/modelr'
  @.route 'stylrPage', path: '/stylr'
    

