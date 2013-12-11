Template.modelrIndex.events
  'click #createModel': ->
  	Meteor.call 'createModel', (error, id) ->
  		if error
        throwError error.reason
      else
        Router.go 'modelrPage', _id: id