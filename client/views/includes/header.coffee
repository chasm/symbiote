# Template.user_loggedout.events 'click #login' : ->
#   Meteor.loginWithGithub
#     requestPermissions : ['user','repo']
#   , (err) ->
#     if err
#       #error handling
#     else
#       #ok
# 
# Template.user_loggedin.events 'click #logout' : ->
#   Meteor.logout (err) ->
#     if err
# 
#     else


