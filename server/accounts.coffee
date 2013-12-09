Accounts.onCreateUser (options, user) ->
  username = user.services.github.username
  registrant = Meteor.users.findOne(username: username)
  
  if registrant?
    result = undefined
    profile = undefined
    
    accessToken = user.services.github.accessToken
    
    result = Meteor.http.get "https://api.github.com/user",
      params:
        access_token: accessToken
      headers:
        "User-Agent": "Meteor/1.0"
    throw result.error if result.error
    
    user.profile = _.pick(result.data, "login", "avatar_url", "url")
    
    user.profile.email = registrant.email
    user.profile.name = registrant.name
    user.profile.cohorts = registrant.cohorts
    Meteor.users.remove registrant._id
    
    user
  else
    throw "No user!"