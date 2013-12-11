(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function() {
  this.route('dashboard', {
    path: '/'
  });
  this.route('chattrIndex', {
    path: '/chattr'
  });
  this.route('quizillaIndex', {
    path: '/quizilla'
  });
  this.route('codrIndex', {
    path: '/codr'
  });
  this.route('modelrIndex', {
    path: '/modelr'
  });
  this.route('stylrIndex', {
    path: '/stylr'
  });
  return this.route('profilrIndex', {
    path: '/profilr'
  });
});

})();
