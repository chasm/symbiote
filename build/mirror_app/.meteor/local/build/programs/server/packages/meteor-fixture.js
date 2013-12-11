(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Email = Package.email.Email;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

/* Package-scope variables */
var Fixture;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/meteor-fixture/meteor-fixture.js                                                                //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
/*jshint -W020 */                                                                                           // 1
                                                                                                            // 2
Fixture = {};                                                                                               // 3
                                                                                                            // 4
(function () {                                                                                              // 5
    "use strict";                                                                                           // 6
                                                                                                            // 7
    // You can access this from your own fixture.js so you can create routes for selenium to do things with // 8
    Fixture.createRoute = function (route, handler) {                                                       // 9
        var connectHandlers;                                                                                // 10
        if (typeof __meteor_bootstrap__.app !== 'undefined') {                                              // 11
            connectHandlers = __meteor_bootstrap__.app;                                                     // 12
        } else {                                                                                            // 13
            connectHandlers = WebApp.connectHandlers;                                                       // 14
        }                                                                                                   // 15
        connectHandlers.stack.splice(0, 0, {                                                                // 16
            route: '/' + route,                                                                             // 17
            handle: function (req, res) {                                                                   // 18
                res.writeHead(200, {'Content-Type': 'text/plain'});                                         // 19
                handler(req, res);                                                                          // 20
                res.end(route + ' complete');                                                               // 21
            }.future()                                                                                      // 22
        });                                                                                                 // 23
    };                                                                                                      // 24
                                                                                                            // 25
    var createEmailInterceptor = function () {                                                              // 26
                                                                                                            // 27
        var emailMessages = [],                                                                             // 28
            actualSend = Email.send;                                                                        // 29
        Email.send = function (options) {                                                                   // 30
            options.id = emailMessages.length;                                                              // 31
            emailMessages.push(options);                                                                    // 32
            actualSend(options);                                                                            // 33
        };                                                                                                  // 34
                                                                                                            // 35
        Fixture.createRoute('showEmails', function (req, res) {                                             // 36
            res.end(JSON.stringify(emailMessages));                                                         // 37
        });                                                                                                 // 38
    };                                                                                                      // 39
                                                                                                            // 40
    if (Email !== undefined) {                                                                              // 41
        createEmailInterceptor();                                                                           // 42
    }                                                                                                       // 43
                                                                                                            // 44
                                                                                                            // 45
})();                                                                                                       // 46
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteor-fixture'] = {
  Fixture: Fixture
};

})();
