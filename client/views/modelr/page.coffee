Template.modelrPage.helpers
  model: -> 
  	Wireframes.findOne Session.get( 'currentModelId' )
  members: ->
  	wireframe = Wireframes.findOne Session.get( 'currentModelId' )
  	members = new Array()
  	_.each wireframe.memberIds, (c) ->
  	  member = Meteor.users.findOne c
  	  members.push member.profile.name
  	members
  pendingMembers: ->
  	wireframe = Wireframes.findOne Session.get( 'currentModelId' )
  	members = new Array()
  	_.each wireframe.pendingMemberIds, (c) ->
  	  member = Meteor.users.findOne c
  	  members.push member.profile.name
  	members

# Template.modelrPage.events
#   'click #addMember': ->
#   	$("#memberForm").html Template.memberForm
  	# Meteor.call 'addPendingMember', Session.get( 'currentModelId' )
  	# , (error, id) ->
  	# 	if error
   #      throwError error.reason
   #    else
   #      Router.go 'modelrPage', _id: id

# Template.memberForm.settings ->
# 	return {

# 	}

# Template.modelrPage.labelClass ->
# 	if @ == Meteor.userId
#     "label-warning"
#   else if @.profile.online == true
#     "label-success"
#   else
#     ""

Template.memberForm.rendered = ->
  # flds =
  #   fields:
  #     'profile.name': true
  #     'profile.login': true

  # userNames = new Array()
  # userList = Meteor.users.find({}, flds).fetch()
  # _.each userList, (u) ->
  # 	userNames.push u.profile.name

  users = {}
  userLabels = []

  userNames = new Array()
  userList = Meteor.users.find({},{fields: {'profile.name': 1, 'profile.login': 1}}).fetch()

  users = {}
  userLabels = []

  _.each(userList, ( item, ix, list ) ->
    item.profile.name = item.profile.name + ' (' + item.profile.login + ')'

    userLabels.push item.profile.name

    users[ item.profile.name ] = item._id
  )

  $('input#addMember').typeahead
    source: userLabels
    updater: (item) ->
    	wireframe = Wireframes.findOne Session.get( 'currentModelId' )
    	alreadyMember = false
    	_.each wireframe.memberIds, (m) ->
    		alreadyMember = true if m == users[ item ]
    	_.each wireframe.pendingMemberIds, (p) ->
    		alreadyMember = true if p == users[ item ]
    	Meteor.call 'addPendingMember', users[ item ], Session.get( 'currentModelId' ) unless alreadyMember
      

    highlighter: (userName) ->
      usr = '' + "<div class='typeahead_primary'>" + userName + "</div>" 
      

