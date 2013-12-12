Template.cohortsNew.rendered = ->
  $("#rootwizard").bootstrapWizard
    onNext: (tab, navigation, index) ->
      if index is 1
        unless $("#name").val()
          alert "You must enter a cohort name"
          $("#name").focus()
          return false
      $("#tab3").html + $("#name").val()
      if index is 2
        unless $("#instructor-name").val()
          alert "You must enter a name"
          $("#instructor-name").focus()
          return false
        unless $("#instructor-email").val()
          alert "You must enter an email"
          $("#instructor-email").focus()
          return false
        unless $("#instructor-github").val()
          alert "You must enter a github username"
          $("#instructor-github").focus()
          return false
      if index is 3
        unless $("#student-name").val()
          alert "You must enter a name"
          $("#student-name").focus()
          return false
        unless $("#student-email").val()
          alert "You must enter an email"
          $("#student-email").focus()
          return false
        unless $("#student-github").val()
          alert "You must enter a github username"
          $("#student-github").focus()
          return false

    onTabShow: (tab, navigation, index) ->
      $total = navigation.find("li").length
      $current = index + 1
      $percent = ($current / $total) * 100
      $("#rootwizard").find(".bar").css width: $percent + "%"