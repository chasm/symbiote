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
    
    user.profile = _.pick result.data, "name", "email", "login", "avatar_url", "url"
    user.profile.cohorts =
      asInstructor:
        asInstructor
      asStudent:
        asStudent
        
    _.each asStudent, (c) ->
      cohort = Cohorts.findOne(c._id)
      _.each cohort.students, (s) ->
        if s.username == username
          Cohorts.update c._id, $push: 
            studentIds:
              _id: user._id
              name: s.name
          user.profile.email = s.email
          user.profile.name = s.name
          Cohorts.update c._id, $pull:
            students:
              username: s.username

    _.each asInstructor, (c) ->
      cohort = Cohorts.findOne(c._id)
      _.each cohort.instructors, (s) ->
        if s.username == username
          Cohorts.update c._id, $push:
            instructorIds:
              _id: user._id
              name: s.name
          user.profile.email = s.email
          user.profile.name = s.name
          Cohorts.update c._id, $pull:
            instructors:
              name: s.name

    user
  else
    throw "No user!"