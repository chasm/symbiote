Template.cohortsIndex.helpers
  cohorts: ->
    Cohorts.find()
  cohort: ->
    Cohorts.findOne(Session.get 'cohortId' )

# Template.cohortsList.events
#   'click .cohort-name': (e) ->
#     e.preventDefault()

#     $body = $(e.target).find('[class=cohort-page]')