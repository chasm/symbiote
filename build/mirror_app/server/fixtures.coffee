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
  Cohorts.insert
    name: "WDI-2"
    description: "The BESTER WDI EVA!"
    startsOn: new Date(2014,1,14)
    endsOn: new Date(2014,4,6)
    program: "WDI"
    studentIds: []
    instructorIds: []
    students: [
      {
        username: "emarnett"
        email: "em_arnett@hotmail.com"
        name: "Emily Arnett"
      }
    ]
    instructors: [
      {
        username: "chasm"
        email: "charles.munat@gmail.com"
        name: "Charles Munat"
      }
      {
        username: "3dd13"
        email: "eddie.lau@generalassemb.ly"
        name: "Eddie Lau"
      }
    ]
