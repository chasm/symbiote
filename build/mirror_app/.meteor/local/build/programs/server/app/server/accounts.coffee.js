(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Accounts.onCreateUser(function(options, user) {
  var accessToken, asInstructor, asStudent, flds, iqry, profile, result, sqry, username;
  username = user.services.github.username;
  flds = {
    fields: {
      name: true
    }
  };
  iqry = {
    instructors: {
      $elemMatch: {
        username: username
      }
    }
  };
  sqry = {
    students: {
      $elemMatch: {
        username: username
      }
    }
  };
  asInstructor = Cohorts.find(iqry, flds).fetch();
  asStudent = Cohorts.find(sqry, flds).fetch();
  if (asInstructor.length > 0 || asStudent.length > 0) {
    result = void 0;
    profile = void 0;
    accessToken = user.services.github.accessToken;
    result = Meteor.http.get("https://api.github.com/user", {
      params: {
        access_token: accessToken
      },
      headers: {
        "User-Agent": "Meteor/1.0"
      }
    });
    if (result.error) {
      throw result.error;
    }
    user.profile = _.pick(result.data, "name", "email", "login", "avatar_url", "url");
    user.profile.cohorts = {
      asInstructor: asInstructor,
      asStudent: asStudent
    };
    _.each(asStudent, function(c) {
      var cohort;
      cohort = Cohorts.findOne(c._id);
      return _.each(cohort.students, function(s) {
        if (s.username === username) {
          Cohorts.update(c._id, {
            $push: {
              studentIds: {
                _id: user._id,
                name: s.name
              }
            }
          });
          user.profile.email = s.email;
          user.profile.name = s.name;
          return Cohorts.update(c._id, {
            $pull: {
              students: {
                username: s.username
              }
            }
          });
        }
      });
    });
    _.each(asInstructor, function(c) {
      var cohort;
      cohort = Cohorts.findOne(c._id);
      return _.each(cohort.instructors, function(s) {
        if (s.username === username) {
          Cohorts.update(c._id, {
            $push: {
              instructorIds: {
                _id: user._id,
                name: s.name
              }
            }
          });
          user.profile.email = s.email;
          user.profile.name = s.name;
          return Cohorts.update(c._id, {
            $pull: {
              instructors: {
                name: s.name
              }
            }
          });
        }
      });
    });
    return user;
  } else {
    throw Error("No user!");
  }
});

})();
