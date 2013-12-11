(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.logOut.events({
  'click #logout': function() {
    return Meteor.logout(function(err) {
      if (err) {
        return alert(err);
      }
    });
  }
});

})();

//# sourceMappingURL=9c389818a6c39980a2daf3ebfeaaa3ccc9396540.map
