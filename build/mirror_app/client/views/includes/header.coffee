Template.header.helpers
  dashboard: -> Router.current().template == 'dashboard'
  chattr: -> Router.current().template == 'chattrIndex'
  codr: -> Router.current().template == 'codrIndex'
  modelr: -> Router.current().template == 'modelrIndex'
  profilr: -> Router.current().template == 'profilrIndex'
  quizilla: -> Router.current().template == 'quizillaIndex'
  stylr: -> Router.current().template == 'stylrIndex'