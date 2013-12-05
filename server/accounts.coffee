# Accounts.validateNewUser (user) ->
  #adminEntry = Meteor.users.findOne username: user.profile.login
  #user.profile.cohorts = adminEntry.cohorts

  # return true if AddedUsers.remove username: user.profile.login
  # throw new Meteor.Error 401, "You do not have access to this website"

Accounts.onCreateUser (options, user) ->

  accessToken = user.services.github.accessToken
  result = undefined
  profile = undefined
  result = Meteor.http.get("https://api.github.com/user",
    params:
      access_token: accessToken

    headers:
      "User-Agent": "Meteor/1.0"
  )
  throw result.error  if result.error
  profile = _.pick(result.data, "login", "name", "email", "avatar_url", "url")
  user.profile = profile
  user