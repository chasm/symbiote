//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/istanbul-middleware-port/client-coverage-poster.js       //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
document.postCoverage = function () {                                // 1
                                                                     // 2
    var postMethod = Meteor.http.post?Meteor.http.post:HTTP.post;    // 3
    postMethod("http://localhost:8000/coverage/client", {            // 4
        content: JSON.stringify(__coverage__),                       // 5
        headers: {                                                   // 6
            'Content-type': 'application/json'                       // 7
        }                                                            // 8
    }, function (error, result) {                                    // 9
        console.log(error, JSON.stringify(result));                  // 10
    });                                                              // 11
                                                                     // 12
};                                                                   // 13
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['istanbul-middleware-port'] = {};

})();

//# sourceMappingURL=f5b512601ba906e4b95642ddc2f9ef27e837ed54.map
