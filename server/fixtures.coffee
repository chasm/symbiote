if Meteor.users.find().count() == 0
  Meteor.users.insert
    username: "chasm"
    cohorts: [ "WDI-1", "WDI-2" ]
  Meteor.users.insert
    username: "emarnett"
    cohorts: [ "WDI-1" ]
