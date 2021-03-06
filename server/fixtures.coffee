if Cohorts.find().count() == 0
  Cohorts.insert
    name: "WDI-1"
    description: "The BEST WDI EVA!"
    startsOn: new Date(2013,8,30)
    endsOn: new Date(2013,11,20)
    program: "WDI"
    studentIds: []
    instructorIds: []
    students: [
      {
        username: "emarnett"
        email: "em_arnett@hotmail.com"
        name: "Emily Arnett"
      }
      {
        username: "yytina"
        email: "yang.hyejin@gmail.com"
        name: "Hyejin Yang"
      }
      {
        username: "sudosoph"
        email: "sophiaraji@gmail.com"
        name: "Sophia Raji"
      }
      {
        username: "godelian"
        email: "deepak.jkg@gmail.com"
        name: "Deepak J"
      }
      {
        username: "wubr2000"
        email: "wubr2000@hotmail.com"
        name: "Bruno Wu"
      }
      {
        username: "stephs829"
        email: "siaw.stephanie@gmail.com"
        name: "Stephanie Siaw"
      }
      {
        username: "kingsleyman"
        email: "kingsleyman7@gmail.com"
        name: "Kingsley Man"
      }
      {
        username: "vbsiqebu"
        email: "hatch.josiah@gmail.com"
        name: "Josiah Hatch"
      }
      {
        username: "Xenos54"
        email: "ipwoconnor@gmail.com"
        name: "Ian O'Connor"
      }
    ]
    instructors: [
      {
        username: "chasm"
        email: "charles.munat@gmail.com"
        name: "Charles Munat"
      }
      {
        username: "nodu"
        email: "mnodurft@gmail.com"
        name: "Matt Nodurfth"
      }
      {
        username: "3dd13"
        email: "eddie.lau@generalassemb.ly"
        name: "Eddie Lau"
      }
    ]

if Chitchats.find().count() == 0
  now = new Date().getTime()

  # create a user
  tomId = Meteor.users.insert
    profile:
      login: 'Tom'
      firstName: 'Tom'
      lastName: 'Coleman'
  tom = Meteor.users.findOne tomId

  somId = Meteor.users.insert
    profile:
      login: 'Sacha'
      firstName: 'Sacha'
      lastName: 'Colins'
  som = Meteor.users.findOne somId


  if tom?
    Chitchats.insert
      userId: tom._id
      author: tom.profile.login
      submittedAt: now - 5 * 3600 * 1000
      body: 'Morning'

   if som?
    Chitchats.insert
      userId: som._id
      author: som.profile.login
      submittedAt: now - 5 * 3600 * 1000
      body: 'Whats up?'

if Discussions.find().count() == 0
  now = new Date().getTime()

  if tom?
    Discussions.insert
      userId: tom._id
      author: tom.profile.login
      submittedAt: now - 5 * 3600 * 1000
      body: 'Interesting project Sacha, can I get involved?'

   if som?
    Discussions.insert
      userId: som._id
      author: som.profile.login
      submittedAt: now - 5 * 3600 * 1000
      body: 'Sure, you can!'
