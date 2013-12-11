(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.header.helpers({
  dashboard: function() {
    return Router.current().template === 'dashboard';
  },
  chattr: function() {
    return Router.current().template === 'chattrIndex';
  },
  codr: function() {
    return Router.current().template === 'codrIndex';
  },
  modelr: function() {
    return Router.current().template === 'modelrIndex';
  },
  profilr: function() {
    return Router.current().template === 'profilrIndex';
  },
  quizilla: function() {
    return Router.current().template === 'quizillaIndex';
  },
  stylr: function() {
    return Router.current().template === 'stylrIndex';
  }
});

})();

//# sourceMappingURL=60433befb101b45589856f5e7df3d02ab99eb9d8.map
