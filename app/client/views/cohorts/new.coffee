Template.cohortsNew.rendered =
  $("#rootwizard").bootstrapWizard
    onTabShow: (tab, navigation, index) ->
      $total = navigation.find("li").length
      $current = index + 1
      $percent = ($current / $total) * 100
      $("#rootwizard").find(".bar").css width: $percent + "%"
