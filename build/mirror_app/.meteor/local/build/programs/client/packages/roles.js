//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Handlebars = Package.handlebars.Handlebars;
var Accounts = Package['accounts-base'].Accounts;

/* Package-scope variables */
var Roles;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/roles/roles_common.js                                                                         //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
;(function () {                                                                                           // 1
                                                                                                          // 2
/**                                                                                                       // 3
 * Provides functions related to user authorization. Compatible with built-in Meteor accounts packages.   // 4
 *                                                                                                        // 5
 * @module Roles                                                                                          // 6
 */                                                                                                       // 7
                                                                                                          // 8
/**                                                                                                       // 9
 * Roles collection documents consist only of an id and a role name.                                      // 10
 *   ex: { _id:<uuid>, name: "admin" }                                                                    // 11
 */                                                                                                       // 12
if (!Meteor.roles) {                                                                                      // 13
  Meteor.roles = new Meteor.Collection("roles")                                                           // 14
}                                                                                                         // 15
                                                                                                          // 16
                                                                                                          // 17
/**                                                                                                       // 18
 * <p>Role-based authorization compatible with built-in Meteor accounts package.</p>                      // 19
 * <br />                                                                                                 // 20
 * <p>Uses 'roles' collection to store existing roles with unique index on 'name' field.</p>              // 21
 * <p>Adds a 'roles' field to user objects in 'users' collection when they are added to a given role.</p> // 22
 *                                                                                                        // 23
 * @class Roles                                                                                           // 24
 * @constructor                                                                                           // 25
 */                                                                                                       // 26
if ('undefined' === typeof Roles) {                                                                       // 27
  Roles = {}                                                                                              // 28
}                                                                                                         // 29
                                                                                                          // 30
/**                                                                                                       // 31
 * Create a new role. Whitespace will be trimmed.                                                         // 32
 *                                                                                                        // 33
 * @method createRole                                                                                     // 34
 * @param {String} role Name of role                                                                      // 35
 * @return {String} id of new role                                                                        // 36
 */                                                                                                       // 37
Roles.createRole = function (role) {                                                                      // 38
  var id,                                                                                                 // 39
      match                                                                                               // 40
                                                                                                          // 41
  if (!role                                                                                               // 42
      || 'string' !== typeof role                                                                         // 43
      || role.trim().length === 0) {                                                                      // 44
    return                                                                                                // 45
  }                                                                                                       // 46
                                                                                                          // 47
  try {                                                                                                   // 48
    id = Meteor.roles.insert({'name':role.trim()})                                                        // 49
    return id                                                                                             // 50
  } catch (e) {                                                                                           // 51
    // (from Meteor accounts-base package, insertUserDoc func)                                            // 52
    // XXX string parsing sucks, maybe                                                                    // 53
    // https://jira.mongodb.org/browse/SERVER-3069 will get fixed one day                                 // 54
    if (e.name !== 'MongoError') throw e                                                                  // 55
    match = e.err.match(/^E11000 duplicate key error index: ([^ ]+)/);                                    // 56
    if (!match) throw e                                                                                   // 57
    if (match[1].indexOf('$name') !== -1)                                                                 // 58
      throw new Meteor.Error(403, "Role already exists.")                                                 // 59
    throw e                                                                                               // 60
  }                                                                                                       // 61
}                                                                                                         // 62
                                                                                                          // 63
/**                                                                                                       // 64
 * Delete an existing role.  Will throw "Role in use" error if any users                                  // 65
 * are currently assigned to the target role.                                                             // 66
 *                                                                                                        // 67
 * @method deleteRole                                                                                     // 68
 * @param {String} role Name of role                                                                      // 69
 */                                                                                                       // 70
Roles.deleteRole = function (role) {                                                                      // 71
  if (! role) {                                                                                           // 72
    return                                                                                                // 73
  }                                                                                                       // 74
                                                                                                          // 75
  var foundExistingUser = Meteor.users.findOne({roles: {$in: [role]}}, {_id: 1})                          // 76
                                                                                                          // 77
  if (foundExistingUser) {                                                                                // 78
    throw new Meteor.Error(403, 'Role in use')                                                            // 79
  }                                                                                                       // 80
                                                                                                          // 81
  var thisRole = Meteor.roles.findOne({ name: role })                                                     // 82
  if (thisRole) {                                                                                         // 83
    Meteor.roles.remove({ _id: thisRole._id })                                                            // 84
  }                                                                                                       // 85
};                                                                                                        // 86
                                                                                                          // 87
/**                                                                                                       // 88
 * Add users to roles. Will create roles as needed.                                                       // 89
 *                                                                                                        // 90
 * Makes 2 calls to database:                                                                             // 91
 *  1. retrieve list of all existing roles                                                                // 92
 *  2. update users' roles                                                                                // 93
 *                                                                                                        // 94
 * @method addUsersToRoles                                                                                // 95
 * @param {Array|String} users id(s) of users to add to roles                                             // 96
 * @param {Array|String} roles name(s) of roles to add users to                                           // 97
 */                                                                                                       // 98
Roles.addUsersToRoles = function (users, roles) {                                                         // 99
  if (!users) throw new Error ("Missing 'users' param")                                                   // 100
  if (!roles) throw new Error ("Missing 'roles' param")                                                   // 101
                                                                                                          // 102
  var existingRoles                                                                                       // 103
                                                                                                          // 104
  // ensure arrays                                                                                        // 105
  if (!_.isArray(users)) users = [users]                                                                  // 106
  if (!_.isArray(roles)) roles = [roles]                                                                  // 107
                                                                                                          // 108
  // remove invalid roles                                                                                 // 109
  roles = _.reduce(roles, function (memo, role) {                                                         // 110
    if (role &&                                                                                           // 111
        'string' === typeof role &&                                                                       // 112
        role.trim().length > 0) {                                                                         // 113
      memo.push(role.trim())                                                                              // 114
    }                                                                                                     // 115
    return memo                                                                                           // 116
  }, [])                                                                                                  // 117
                                                                                                          // 118
  if (roles.length === 0) {                                                                               // 119
    return                                                                                                // 120
  }                                                                                                       // 121
                                                                                                          // 122
  // ensure all roles exist in 'roles' collection                                                         // 123
  existingRoles = _.reduce(Meteor.roles.find({}).fetch(), function (memo, role) {                         // 124
    memo[role.name] = true                                                                                // 125
    return memo                                                                                           // 126
  }, {})                                                                                                  // 127
  _.each(roles, function (role) {                                                                         // 128
    if (!existingRoles[role]) {                                                                           // 129
      Roles.createRole(role)                                                                              // 130
    }                                                                                                     // 131
  })                                                                                                      // 132
                                                                                                          // 133
  // update all users, adding to roles set                                                                // 134
  if (Meteor.isClient) {                                                                                  // 135
    _.each(users, function (user) {                                                                       // 136
      // Iterate over each user to fulfill Meteor's 'one update per ID' policy                            // 137
      Meteor.users.update(                                                                                // 138
        {       _id: user },                                                                              // 139
        { $addToSet: { roles: { $each: roles } } },                                                       // 140
        {     multi: true }                                                                               // 141
      )                                                                                                   // 142
    })                                                                                                    // 143
  } else {                                                                                                // 144
    // On the server we can leverage MongoDB's $in operator for performance                               // 145
    Meteor.users.update(                                                                                  // 146
      {       _id: { $in: users } },                                                                      // 147
      { $addToSet: { roles: { $each: roles } } },                                                         // 148
      {     multi: true }                                                                                 // 149
    )                                                                                                     // 150
  }                                                                                                       // 151
}                                                                                                         // 152
                                                                                                          // 153
/**                                                                                                       // 154
 * Remove users from roles                                                                                // 155
 *                                                                                                        // 156
 * @method removeUsersFromRoles                                                                           // 157
 * @param {Array|String} users id(s) of users to add to roles                                             // 158
 * @param {Array|String} roles name(s) of roles to add users to                                           // 159
 */                                                                                                       // 160
Roles.removeUsersFromRoles = function (users, roles) {                                                    // 161
  if (!users) throw new Error ("Missing 'users' param")                                                   // 162
  if (!roles) throw new Error ("Missing 'roles' param")                                                   // 163
                                                                                                          // 164
  // ensure arrays                                                                                        // 165
  if (!_.isArray(users)) users = [users]                                                                  // 166
  if (!_.isArray(roles)) roles = [roles]                                                                  // 167
                                                                                                          // 168
  // update all users, remove from roles set                                                              // 169
  if (Meteor.isClient) {                                                                                  // 170
    // Iterate over each user to fulfill Meteor's 'one update per ID' policy                              // 171
    _.each(users, function (user) {                                                                       // 172
      Meteor.users.update(                                                                                // 173
        {      _id: user },                                                                               // 174
        { $pullAll: { roles: roles } },                                                                   // 175
        {    multi: true}                                                                                 // 176
      )                                                                                                   // 177
    })                                                                                                    // 178
  } else {                                                                                                // 179
    // On the server we can leverage MongoDB's $in operator for performance                               // 180
    Meteor.users.update(                                                                                  // 181
      {      _id: {   $in: users } },                                                                     // 182
      { $pullAll: { roles: roles } },                                                                     // 183
      {    multi: true}                                                                                   // 184
    )                                                                                                     // 185
  }                                                                                                       // 186
}                                                                                                         // 187
                                                                                                          // 188
/**                                                                                                       // 189
 * Check if user is in role                                                                               // 190
 *                                                                                                        // 191
 * @method userIsInRole                                                                                   // 192
 * @param {String|Object} user Id of user or actual user object                                           // 193
 * @param {String|Array} roles Name of role or Array of roles to check against.  If array, will return true if user is in _any_ role.
 * @return {Boolean} true if user is in _any_ of the target roles                                         // 195
 */                                                                                                       // 196
Roles.userIsInRole = function (user, roles) {                                                             // 197
  var id,                                                                                                 // 198
      userRoles                                                                                           // 199
                                                                                                          // 200
  // ensure array to simplify code                                                                        // 201
  if (!_.isArray(roles)) {                                                                                // 202
    roles = [roles]                                                                                       // 203
  }                                                                                                       // 204
                                                                                                          // 205
  if (!user) {                                                                                            // 206
    return false                                                                                          // 207
  } else if ('object' === typeof user) {                                                                  // 208
    userRoles = user.roles                                                                                // 209
    if (_.isArray(userRoles)) {                                                                           // 210
      return _.some(roles, function (role) {                                                              // 211
        return _.contains(userRoles, role)                                                                // 212
      })                                                                                                  // 213
    }                                                                                                     // 214
    // missing roles field, try going direct via id                                                       // 215
    id = user._id                                                                                         // 216
  } else if ('string' === typeof user) {                                                                  // 217
    id = user                                                                                             // 218
  }                                                                                                       // 219
                                                                                                          // 220
  if (!id) return false                                                                                   // 221
                                                                                                          // 222
  return Meteor.users.findOne(                                                                            // 223
    { _id: id, roles: { $in: roles } },                                                                   // 224
    { _id: 1 }                                                                                            // 225
  )                                                                                                       // 226
}                                                                                                         // 227
                                                                                                          // 228
/**                                                                                                       // 229
 * Retrieve users roles                                                                                   // 230
 *                                                                                                        // 231
 * @method getRolesForUser                                                                                // 232
 * @param {String} user Id of user                                                                        // 233
 * @return {Array} Array of user's roles, unsorted                                                        // 234
 */                                                                                                       // 235
Roles.getRolesForUser = function (user) {                                                                 // 236
  var user = Meteor.users.findOne(                                                                        // 237
    { _id: user},                                                                                         // 238
    { _id: 0, roles: 1}                                                                                   // 239
  )                                                                                                       // 240
                                                                                                          // 241
  return user ? user.roles : undefined                                                                    // 242
}                                                                                                         // 243
                                                                                                          // 244
/**                                                                                                       // 245
 * Retrieve all existing roles                                                                            // 246
 *                                                                                                        // 247
 * @method getAllRoles                                                                                    // 248
 * @return {Cursor} cursor of existing roles                                                              // 249
 */                                                                                                       // 250
Roles.getAllRoles = function () {                                                                         // 251
  return Meteor.roles.find({}, { sort: { name: 1 } })                                                     // 252
}                                                                                                         // 253
                                                                                                          // 254
/**                                                                                                       // 255
 * Retrieve all users who are in target role                                                              // 256
 *                                                                                                        // 257
 * @method getUsersInRole                                                                                 // 258
 * @param {String} role Name of role                                                                      // 259
 * @return {Cursor} cursor of users in role                                                               // 260
 */                                                                                                       // 261
Roles.getUsersInRole = function (role) {                                                                  // 262
  return Meteor.users.find(                                                                               // 263
    { roles: { $in: [role] } }                                                                            // 264
  )                                                                                                       // 265
}                                                                                                         // 266
                                                                                                          // 267
}());                                                                                                     // 268
                                                                                                          // 269
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/roles/roles_client.js                                                                         //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
;(function () {                                                                                           // 1
                                                                                                          // 2
/**                                                                                                       // 3
 * Convenience functions for use on client.                                                               // 4
 *                                                                                                        // 5
 * NOTE: You must restrict user actions on the server-side; any                                           // 6
 * client-side checks are strictly for convenience and must not be                                        // 7
 * trusted.                                                                                               // 8
 *                                                                                                        // 9
 * @module Helpers                                                                                        // 10
 */                                                                                                       // 11
                                                                                                          // 12
////////////////////////////////////////////////////////////                                              // 13
// Handlebars helpers                                                                                     // 14
//                                                                                                        // 15
// Use a semi-private variable rather than declaring Handlebars                                           // 16
// helpers directly so that we can unit test the helpers.                                                 // 17
// XXX For some reason, the Handlebars helpers are not registered                                         // 18
// before the tests run.                                                                                  // 19
//                                                                                                        // 20
Roles._handlebarsHelpers = {                                                                              // 21
                                                                                                          // 22
  /**                                                                                                     // 23
   * Handlebars helper to check if current user is in at least one                                        // 24
   * of the target roles.  For use in client-side templates.                                              // 25
   *                                                                                                      // 26
   * @method isInRole                                                                                     // 27
   * @param {String} role name of role or comma-seperated list of roles                                   // 28
   * @return {Boolean} true if current user is in at least one of the target roles                        // 29
   */                                                                                                     // 30
  isInRole: function (role) {                                                                             // 31
    var user = Meteor.user(),                                                                             // 32
      comma = role && role.indexOf(','),                                                                  // 33
      roles                                                                                               // 34
                                                                                                          // 35
    if (!user) return false                                                                               // 36
                                                                                                          // 37
    if (comma !== -1) {                                                                                   // 38
      roles = _.reduce(role.split(','), function (memo, r) {                                              // 39
        if (!r || !r.trim()) {                                                                            // 40
          return memo                                                                                     // 41
        }                                                                                                 // 42
        memo.push(r.trim())                                                                               // 43
        return memo                                                                                       // 44
      }, [])                                                                                              // 45
    } else {                                                                                              // 46
      roles = [role]                                                                                      // 47
    }                                                                                                     // 48
                                                                                                          // 49
    return Roles.userIsInRole(user, roles)                                                                // 50
  }                                                                                                       // 51
}                                                                                                         // 52
                                                                                                          // 53
                                                                                                          // 54
if ('undefined' !== typeof Handlebars) {                                                                  // 55
  _.each(Roles._handlebarsHelpers, function (func, name) {                                                // 56
    Handlebars.registerHelper(name, func)                                                                 // 57
  })                                                                                                      // 58
} else {                                                                                                  // 59
  console.log('WARNING: Roles Handlebars helpers not registered. Handlebars not defined')                 // 60
}                                                                                                         // 61
                                                                                                          // 62
}());                                                                                                     // 63
                                                                                                          // 64
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.roles = {
  Roles: Roles
};

})();

//# sourceMappingURL=38e4b3138a53ab0521fbcc653c8f078cecccd200.map
