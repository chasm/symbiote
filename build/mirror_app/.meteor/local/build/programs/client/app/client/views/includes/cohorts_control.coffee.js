(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.cohortsControl.helpers({
  cohorts: function() {
    return Session.get('cohorts');
  },
  currentCohort: function() {
    return Session.get('currentCohort');
  }
});

})();

//# sourceMappingURL=b778d1e50b703103276bf82524c9a31a3d2467d1.map
