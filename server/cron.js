
var everyDay = function () {
  console.log('everyDay!');
  Chitchats.remove({});
}

var cron = new Meteor.Cron( {
  events:{
    "0 5 * * *" : everyDay
  }
});