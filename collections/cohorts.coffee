@Cohorts = new Meteor.Collection 'cohorts'


# ---------
# ADMIN ROLE
# Prevent non-authorized users from creating new users
# Meteor.methods validateNewCohort: ->
#   loggedInUser = Meteor.user();

#   true if Roles.userIsInRole(loggedInUser, ['admin'])    

#   throw new Meteor.Error 403, "Not authorized to create new cohorts"
