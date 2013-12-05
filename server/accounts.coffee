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
  profile = _.pick(result.data, "login", "name", "avatar_url", "url", "email")
  user.profile = profile
  user