# Add Symbiote fixtures here
if AddedUsers.find().count() == 0
  AddedUsers.insert username: "emarnett" unless Meteor.users.findOne profile: {login: "emarnett"}
		
# if Meteor.users.findOne profile: {login: "emarnett"}
#   adminUser = Meteor.users.findOne profile: {login: "emarnett"}
#   adminId = adminUser._id
#   Roles.addUsersToRoles(adminId, ['admin'])
