Accounts.onCreateUser (options, user) ->
  username = user.services.github.username
  
  flds =
    fields:
      name: true
      
  iqry = 
    instructors:
      $elemMatch:
        username: username
        
  sqry = 
    students:
      $elemMatch:
        username: username
        
  asInstructor = Cohorts.find(iqry, flds).fetch()
  asStudent = Cohorts.find(sqry, flds).fetch()
  
  if asInstructor.length > 0 or asStudent.length > 0
    result = undefined
    profile = undefined
    
    accessToken = user.services.github.accessToken
    
    result = Meteor.http.get "https://api.github.com/user",
      params:
        access_token: accessToken
      headers:
        "User-Agent": "Meteor/1.0"
    throw result.error if result.error
    
    user.profile = _.pick(result.data, "name", "email", "login", "avatar_url", "url")
    user.profile.cohorts =
      asInstructor:
        asInstructor
      asStudent:
        asStudent
        
    _.each asInstructor, (c) ->
      cohort = Cohorts.findOne(c._id)
      console.log cohort
    user
  else
    throw "No user!"