if Meteor.users.find().count() == 0
  Meteor.users.insert
    username: "chasm"
    email: "charles.munat@gmail.com"
    name: "Charles Munat"
    cohorts: [ "WDI-1", "WDI-2" ]
  Meteor.users.insert
    username: "emarnett"
    email: "em_arnett@hotmail.com"
    name: "Emily Arnett"
    cohorts: [ "WDI-1" ]
  Meteor.users.insert
    username: "yytina"
    email: "yang.hyejin@gmail.com"
    name: "Hyejin Yang"
    cohorts: [ "WDI-1" ]
  Meteor.users.insert
    username: "sudosoph"
    email: "sophiaraji@gmail.com"
    name: "Sophia Raji"
    cohorts: [ "WDI-1" ]
  Meteor.users.insert
    username: "godelian"
    email: "deepak.jkg@gmail.com"
    name: "Deepak J"
    cohorts: [ "WDI-1" ]
