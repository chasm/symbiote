# Template.notifications.helpers
#   notifications: ->
#     Notifications.find
#       userId: Meteor.userId()
#       read: false


#   notificationCount: ->
#     Notifications.find(
#       userId: Meteor.userId()
#       read: false
#     ).count()

# Template.notification.helpers notificationWireframePath: ->
#   Router.routes.modelrPage.path _id: @wireframeId

# Template.notification.events "click a": ->
#   Notifications.update @_id,
#     $set:
#       read: true