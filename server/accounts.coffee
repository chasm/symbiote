Accounts.onCreateUser (options, user) ->
  username = user.services.github.username
  registrant = Meteor.users.findOne(username: username)
  if registrant?
    accessToken = user.services.github.accessToken
    user.cohorts = registrant.cohorts
    result = undefined
    profile = undefined
    result = Meteor.http.get "https://api.github.com/user",
      params:
        access_token: accessToken
      headers:
        "User-Agent": "Meteor/1.0"
  
    throw result.error if result.error
    user.profile = _.pick(result.data, "login", "name", "email", "avatar_url", "url")
    Meteor.users.remove registrant._id
    user
  else
    throw "No friggin' user!"