(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

/* Package-scope variables */
var context, Fiber, core, ZipWriter, express, createHandler, createClientHandler, hookLoader;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/istanbul-middleware-port/router_server.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var connectHandlers, connect;                                                                                          // 1
                                                                                                                       // 2
if (typeof(Npm) == "undefined") {                                                                                      // 3
    connect = __meteor_bootstrap__.require("connect");                                                                 // 4
} else {                                                                                                               // 5
    connect = Npm.require("connect");                                                                                  // 6
}                                                                                                                      // 7
                                                                                                                       // 8
if (typeof __meteor_bootstrap__.app !== 'undefined') {                                                                 // 9
    connectHandlers = __meteor_bootstrap__.app;                                                                        // 10
} else {                                                                                                               // 11
    connectHandlers = WebApp.connectHandlers;                                                                          // 12
}                                                                                                                      // 13
                                                                                                                       // 14
                                                                                                                       // 15
var RRouter = function() {                                                                                             // 16
    this._routes = [];                                                                                                 // 17
    this._config = {                                                                                                   // 18
        requestParser: connect.bodyParser                                                                              // 19
    };                                                                                                                 // 20
    this._started = false;                                                                                             // 21
};                                                                                                                     // 22
                                                                                                                       // 23
// simply match this path to this function                                                                             // 24
RRouter.prototype.add = function(path, method, endpoint)  {                                                            // 25
    var self = this;                                                                                                   // 26
                                                                                                                       // 27
    // Start serving on first add() call                                                                               // 28
    if(!this._started){                                                                                                // 29
        this._start();                                                                                                 // 30
    }                                                                                                                  // 31
                                                                                                                       // 32
    if (_.isObject(path) && ! _.isRegExp(path)) {                                                                      // 33
        _.each(path, function(endpoint, p) {                                                                           // 34
            self.add(p, endpoint);                                                                                     // 35
        });                                                                                                            // 36
    } else {                                                                                                           // 37
        if (! endpoint) {                                                                                              // 38
            // no http method was supplied so 2nd parameter is the endpoint                                            // 39
            endpoint = method;                                                                                         // 40
            method = null;                                                                                             // 41
        }                                                                                                              // 42
        if (! _.isFunction(endpoint)) {                                                                                // 43
            endpoint = _.bind(_.identity, null, endpoint);                                                             // 44
        }                                                                                                              // 45
        self._routes.push([new Meteor.RRouter.Route(path, method), endpoint]);                                         // 46
    }                                                                                                                  // 47
};                                                                                                                     // 48
                                                                                                                       // 49
RRouter.prototype.match = function(request, response) {                                                                // 50
    for (var i = 0; i < this._routes.length; i++) {                                                                    // 51
        var params = [], route = this._routes[i];                                                                      // 52
                                                                                                                       // 53
        if (route[0].match(request.url, request.method, params)) {                                                     // 54
            context = {request: request, response: response, params: params};                                          // 55
                                                                                                                       // 56
            var args = [];                                                                                             // 57
            for (var key in context.params)                                                                            // 58
                args.push(context.params[key]);                                                                        // 59
                                                                                                                       // 60
            return route[1].apply(context, args);                                                                      // 61
        }                                                                                                              // 62
    }                                                                                                                  // 63
                                                                                                                       // 64
    return false;                                                                                                      // 65
};                                                                                                                     // 66
                                                                                                                       // 67
RRouter.prototype.configure = function(config) {                                                                       // 68
    if(this._started){                                                                                                 // 69
        throw new Error("RRouter.configure() has to be called before first call to RRouter.add()");                    // 70
    }                                                                                                                  // 71
                                                                                                                       // 72
    this._config = _.extend(this._config, config);                                                                     // 73
};                                                                                                                     // 74
                                                                                                                       // 75
RRouter.prototype._start = function(){                                                                                 // 76
    var self = this;                                                                                                   // 77
                                                                                                                       // 78
    if(this._started){                                                                                                 // 79
        throw new Error("RRouter has already been started");                                                           // 80
    }                                                                                                                  // 81
                                                                                                                       // 82
    this._started = true;                                                                                              // 83
                                                                                                                       // 84
    // hook up the serving                                                                                             // 85
    connectHandlers                                                                                                    // 86
        .use(connect.query()) // <- XXX: we can probably assume accounts did this                                      // 87
        .use(this._config.requestParser(this._config.bodyParser))                                                      // 88
        .use(function(req, res, next) {                                                                                // 89
            // need to wrap in a fiber in case they do something async                                                 // 90
            // (e.g. in the database)                                                                                  // 91
            if(typeof(Fiber)=="undefined") Fiber = Npm.require('fibers');                                              // 92
                                                                                                                       // 93
            Fiber(function() {                                                                                         // 94
                var output = Meteor.RRouter.match(req, res);                                                           // 95
                                                                                                                       // 96
                if (output === false) {                                                                                // 97
                    return next();                                                                                     // 98
                } else {                                                                                               // 99
                    // parse out the various type of response we can have                                              // 100
                                                                                                                       // 101
                    // array can be                                                                                    // 102
                    // [content], [status, content], [status, headers, content]                                        // 103
                    if (_.isArray(output)) {                                                                           // 104
                        // copy the array so we aren't actually modifying it!                                          // 105
                        output = output.slice(0);                                                                      // 106
                                                                                                                       // 107
                        if (output.length === 3) {                                                                     // 108
                            var headers = output.splice(1, 1)[0];                                                      // 109
                            _.each(headers, function(value, key) {                                                     // 110
                                res.setHeader(key, value);                                                             // 111
                            });                                                                                        // 112
                        }                                                                                              // 113
                                                                                                                       // 114
                        if (output.length === 2) {                                                                     // 115
                            res.statusCode = output.shift();                                                           // 116
                        }                                                                                              // 117
                                                                                                                       // 118
                        output = output[0];                                                                            // 119
                    }                                                                                                  // 120
                                                                                                                       // 121
                    if (_.isNumber(output)) {                                                                          // 122
                        res.statusCode = output;                                                                       // 123
                        output = '';                                                                                   // 124
                    }                                                                                                  // 125
                                                                                                                       // 126
                    return res.end(output);                                                                            // 127
                }                                                                                                      // 128
            }).run();                                                                                                  // 129
        });                                                                                                            // 130
};                                                                                                                     // 131
                                                                                                                       // 132
// Make the router available                                                                                           // 133
Meteor.RRouter = new RRouter();                                                                                        // 134
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/istanbul-middleware-port/router_common.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function() {                                                                                                          // 1
    // Route object taken from page.js, slightly stripped down                                                         // 2
    //                                                                                                                 // 3
    // Copyright (c) 2012 TJ Holowaychuk &lt;tj@vision-media.ca&gt;                                                    // 4
    //                                                                                                                 // 5
    /**                                                                                                                // 6
     * Initialize `Route` with the given HTTP `path`, HTTP `method`,                                                   // 7
     * and an array of `callbacks` and `options`.                                                                      // 8
     *                                                                                                                 // 9
     * Options:                                                                                                        // 10
     *                                                                                                                 // 11
     *   - `sensitive`    enable case-sensitive routes                                                                 // 12
     *   - `strict`       enable strict matching for trailing slashes                                                  // 13
     *                                                                                                                 // 14
     * @param {String} path                                                                                            // 15
     * @param {String} method                                                                                          // 16
     * @param {Object} options.                                                                                        // 17
     * @api private                                                                                                    // 18
     */                                                                                                                // 19
                                                                                                                       // 20
    Meteor.RRouter.Route = function(path, method, options) {                                                           // 21
        options = options || {};                                                                                       // 22
        this.path = path;                                                                                              // 23
        this.method = method;                                                                                          // 24
        this.regexp = pathtoRegexp(path                                                                                // 25
            , this.keys = []                                                                                           // 26
            , options.sensitive                                                                                        // 27
            , options.strict);                                                                                         // 28
    }                                                                                                                  // 29
                                                                                                                       // 30
    /**                                                                                                                // 31
     * Check if this route matches `path` and optional `method`, if so                                                 // 32
     * populate `params`.                                                                                              // 33
     *                                                                                                                 // 34
     * @param {String} path                                                                                            // 35
     * @param {String} method                                                                                          // 36
     * @param {Array} params                                                                                           // 37
     * @return {Boolean}                                                                                               // 38
     * @api private                                                                                                    // 39
     */                                                                                                                // 40
                                                                                                                       // 41
    Meteor.RRouter.Route.prototype.match = function(path, method, params){                                             // 42
        var keys, qsIndex, pathname, m;                                                                                // 43
                                                                                                                       // 44
        if (this.method && this.method.toUpperCase() !== method) return false;                                         // 45
                                                                                                                       // 46
        keys = this.keys;                                                                                              // 47
        qsIndex = path.indexOf('?');                                                                                   // 48
        pathname = ~qsIndex ? path.slice(0, qsIndex) : path;                                                           // 49
        m = this.regexp.exec(pathname);                                                                                // 50
                                                                                                                       // 51
        if (!m) return false;                                                                                          // 52
                                                                                                                       // 53
        for (var i = 1, len = m.length; i < len; ++i) {                                                                // 54
            var key = keys[i - 1];                                                                                     // 55
                                                                                                                       // 56
            var val = 'string' == typeof m[i]                                                                          // 57
                ? decodeURIComponent(m[i])                                                                             // 58
                : m[i];                                                                                                // 59
                                                                                                                       // 60
            if (key) {                                                                                                 // 61
                params[key.name] = undefined !== params[key.name]                                                      // 62
                    ? params[key.name]                                                                                 // 63
                    : val;                                                                                             // 64
            } else {                                                                                                   // 65
                params.push(val);                                                                                      // 66
            }                                                                                                          // 67
        }                                                                                                              // 68
                                                                                                                       // 69
        return true;                                                                                                   // 70
    };                                                                                                                 // 71
                                                                                                                       // 72
    /**                                                                                                                // 73
     * Normalize the given path string,                                                                                // 74
     * returning a regular expression.                                                                                 // 75
     *                                                                                                                 // 76
     * An empty array should be passed,                                                                                // 77
     * which will contain the placeholder                                                                              // 78
     * key names. For example "/user/:id" will                                                                         // 79
     * then contain ["id"].                                                                                            // 80
     *                                                                                                                 // 81
     * @param  {String|RegExp|Array} path                                                                              // 82
     * @param  {Array} keys                                                                                            // 83
     * @param  {Boolean} sensitive                                                                                     // 84
     * @param  {Boolean} strict                                                                                        // 85
     * @return {RegExp}                                                                                                // 86
     * @api private                                                                                                    // 87
     */                                                                                                                // 88
                                                                                                                       // 89
    function pathtoRegexp(path, keys, sensitive, strict) {                                                             // 90
        if (path instanceof RegExp) return path;                                                                       // 91
        if (path instanceof Array) path = '(' + path.join('|') + ')';                                                  // 92
        path = path                                                                                                    // 93
            .concat(strict ? '' : '/?')                                                                                // 94
            .replace(/\/\(/g, '(?:/')                                                                                  // 95
            .replace(/\+/g, '__plus__')                                                                                // 96
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){       // 97
                keys.push({ name: key, optional: !! optional });                                                       // 98
                slash = slash || '';                                                                                   // 99
                return ''                                                                                              // 100
                    + (optional ? '' : slash)                                                                          // 101
                    + '(?:'                                                                                            // 102
                    + (optional ? slash : '')                                                                          // 103
                    + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'                        // 104
                    + (optional || '');                                                                                // 105
            })                                                                                                         // 106
            .replace(/([\/.])/g, '\\$1')                                                                               // 107
            .replace(/__plus__/g, '(.+)')                                                                              // 108
            .replace(/\*/g, '(.*)');                                                                                   // 109
                                                                                                                       // 110
        return new RegExp('^' + path + '$', sensitive ? '' : 'i');                                                     // 111
    };                                                                                                                 // 112
                                                                                                                       // 113
    /// END Route object                                                                                               // 114
                                                                                                                       // 115
    // Added by tom, lifted from mini-pages, with some modifications                                                   // 116
                                                                                                                       // 117
    /**                                                                                                                // 118
     Given a context object, returns a url path with the values of the context                                         // 119
     object mapped over the path.                                                                                      // 120
                                                                                                                       // 121
     Alternatively, supply the named parts of the paths as discrete arguments.                                         // 122
                                                                                                                       // 123
     @method pathWithContext                                                                                           // 124
     @param [context] {Object} An optional context object to use for                                                   // 125
     interpolation.                                                                                                    // 126
                                                                                                                       // 127
     @example                                                                                                          // 128
     // given a page with a path of "/posts/:_id/edit"                                                                 // 129
     var path = page.pathWithContext({ _id: 123 });                                                                    // 130
     // > /posts/123/edit                                                                                              // 131
     */                                                                                                                // 132
    Meteor.RRouter.Route.prototype.pathWithContext = function (context) {                                              // 133
        var self = this,                                                                                               // 134
            path = self.path,                                                                                          // 135
            parts,                                                                                                     // 136
            args = arguments;                                                                                          // 137
                                                                                                                       // 138
        /* get an array of keys from the path to replace with context values.                                          // 139
         /* XXX Right now this comes from page-js. Remove dependency.                                                  // 140
         */                                                                                                            // 141
        parts = self.regexp.exec(self.path).slice(1);                                                                  // 142
                                                                                                                       // 143
        context = context || {};                                                                                       // 144
                                                                                                                       // 145
        var replacePathPartWithContextValue = function (part, i) {                                                     // 146
            var re = new RegExp(part, "g"),                                                                            // 147
                prop = part.replace(":", ""),                                                                          // 148
                val;                                                                                                   // 149
                                                                                                                       // 150
            if (_.isObject(context))                                                                                   // 151
                val = context[prop]                                                                                    // 152
            else                                                                                                       // 153
                val = args[i];                                                                                         // 154
                                                                                                                       // 155
            path = path.replace(re, val || '');                                                                        // 156
        };                                                                                                             // 157
                                                                                                                       // 158
        _.each(parts, replacePathPartWithContextValue);                                                                // 159
                                                                                                                       // 160
        return path;                                                                                                   // 161
    }                                                                                                                  // 162
}());                                                                                                                  // 163
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/istanbul-middleware-port/core.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*                                                                                                                     // 1
 Copyright (c) 2013, Yahoo! Inc.  All rights reserved.                                                                 // 2
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.                           // 3
 */                                                                                                                    // 4
var istanbul = Npm.require('istanbul'),                                                                                // 5
    hook = istanbul.hook,                                                                                              // 6
    Report = istanbul.Report,                                                                                          // 7
    utils = istanbul.utils,                                                                                            // 8
    Instrumenter = istanbul.Instrumenter,                                                                              // 9
    instrumenter = null,                                                                                               // 10
    TreeSummarizer = istanbul.TreeSummarizer,                                                                          // 11
    baselineCoverage = {};                                                                                             // 12
                                                                                                                       // 13
core = {};                                                                                                             // 14
                                                                                                                       // 15
//single place to get global coverage object                                                                           // 16
var getCoverageObject = function () {                                                                                  // 17
    /*jslint nomen: true */                                                                                            // 18
    global.__coverage__ = global.__coverage__ || {};                                                                   // 19
    return global.__coverage__;                                                                                        // 20
};                                                                                                                     // 21
core.getCoverageObject = getCoverageObject;                                                                            // 22
                                                                                                                       // 23
//returns a matcher that returns all JS files under root                                                               // 24
//except when the file is anywhere under `node_modules`                                                                // 25
//does not use istanbul.matcherFor() so as to expose                                                                   // 26
//a synchronous interface                                                                                              // 27
function getRootMatcher(root) {                                                                                        // 28
    return function (file) {                                                                                           // 29
        if (file.indexOf(root) !== 0) {                                                                                // 30
            return false;                                                                                              // 31
        }                                                                                                              // 32
        file = file.substring(root.length);                                                                            // 33
        return file.indexOf('node_modules') < 0;                                                                       // 34
    };                                                                                                                 // 35
}                                                                                                                      // 36
                                                                                                                       // 37
//deep-copy object                                                                                                     // 38
function clone(obj) {                                                                                                  // 39
    if (!obj) {                                                                                                        // 40
        return obj;                                                                                                    // 41
    }                                                                                                                  // 42
    return JSON.parse(JSON.stringify(obj));                                                                            // 43
}                                                                                                                      // 44
/**                                                                                                                    // 45
 * save the baseline coverage stats for a file. This baseline is not 0                                                 // 46
 * because of mainline code that is covered as part of loading the module                                              // 47
 * @method saveBaseline                                                                                                // 48
 * @param file the file for which baseline stats need to be tracked.                                                   // 49
 * @private                                                                                                            // 50
 */                                                                                                                    // 51
function saveBaseline(file) {                                                                                          // 52
    var coverageObject = getCoverageObject(),                                                                          // 53
        fileCoverage;                                                                                                  // 54
    if (coverageObject && coverageObject[file]) {                                                                      // 55
        fileCoverage = coverageObject[file];                                                                           // 56
        if (!baselineCoverage[file]) {                                                                                 // 57
            baselineCoverage[file] = {                                                                                 // 58
                s: clone(fileCoverage.s),                                                                              // 59
                f: clone(fileCoverage.f),                                                                              // 60
                b: clone(fileCoverage.b)                                                                               // 61
            };                                                                                                         // 62
        }                                                                                                              // 63
    }                                                                                                                  // 64
}                                                                                                                      // 65
/**                                                                                                                    // 66
 * overwrites the coverage stats for the global coverage object to restore to baseline                                 // 67
 * @method restoreBaseline                                                                                             // 68
 */                                                                                                                    // 69
core.restoreBaseline = function () {                                                                                   // 70
    var cov = getCoverageObject(),                                                                                     // 71
        fileCoverage,                                                                                                  // 72
        fileBaseline;                                                                                                  // 73
    Object.keys(baselineCoverage).forEach(function (file) {                                                            // 74
        fileBaseline = baselineCoverage[file];                                                                         // 75
        if (cov[file]) {                                                                                               // 76
            fileCoverage = cov[file];                                                                                  // 77
            fileCoverage.s = clone(fileBaseline.s);                                                                    // 78
            fileCoverage.f = clone(fileBaseline.f);                                                                    // 79
            fileCoverage.b = clone(fileBaseline.b);                                                                    // 80
        }                                                                                                              // 81
    });                                                                                                                // 82
    Object.keys(cov).forEach(function (file) {                                                                         // 83
        if (!baselineCoverage[file]) { //throw it out                                                                  // 84
            delete cov[file];                                                                                          // 85
        }                                                                                                              // 86
    });                                                                                                                // 87
};                                                                                                                     // 88
/**                                                                                                                    // 89
 * hooks `require` to add instrumentation to matching files loaded on the server                                       // 90
 * @method hookLoader                                                                                                  // 91
 * @param {Function|String} matcherOrRoot one of:                                                                      // 92
 *      a match function with signature `fn(file)` that returns true if `file` needs to be instrumented                // 93
 *      a root path under which all JS files except those under `node_modules` are instrumented                        // 94
 * @param {Object} opts instrumenter options                                                                           // 95
 */                                                                                                                    // 96
core.hookLoader = function (matcherOrRoot, opts) {                                                                     // 97
    /*jslint nomen: true */                                                                                            // 98
    var matcherFn,                                                                                                     // 99
        transformer,                                                                                                   // 100
        postLoadHook,                                                                                                  // 101
        postLoadHookFn;                                                                                                // 102
                                                                                                                       // 103
    opts = opts || {};                                                                                                 // 104
    opts.coverageVariable = '__coverage__'; //force this always                                                        // 105
                                                                                                                       // 106
    postLoadHook = opts.postLoadHook;                                                                                  // 107
    if (!(postLoadHook && typeof postLoadHook === 'function')) {                                                       // 108
        postLoadHook = function (/* matcher, transformer, verbose */) {                                                // 109
            return function (/* file */) {                                                                             // 110
            };                                                                                                         // 111
        };                                                                                                             // 112
    }                                                                                                                  // 113
    delete opts.postLoadHook;                                                                                          // 114
                                                                                                                       // 115
    if (typeof matcherOrRoot === 'function') {                                                                         // 116
        matcherFn = matcherOrRoot;                                                                                     // 117
    } else if (typeof matcherOrRoot === 'string') {                                                                    // 118
        matcherFn = getRootMatcher(matcherOrRoot);                                                                     // 119
    } else {                                                                                                           // 120
        throw new Error('Argument was not a function or string');                                                      // 121
    }                                                                                                                  // 122
                                                                                                                       // 123
    if (instrumenter) {                                                                                                // 124
        return;                                                                                                        // 125
    } //already hooked                                                                                                 // 126
    instrumenter = new Instrumenter(opts);                                                                             // 127
    transformer = instrumenter.instrumentSync.bind(instrumenter);                                                      // 128
    postLoadHookFn = postLoadHook(matcherFn, transformer, opts.verbose);                                               // 129
                                                                                                                       // 130
    hook.hookRequire(matcherFn, transformer, {                                                                         // 131
        verbose: opts.verbose,                                                                                         // 132
        postLoadHook: function (file) {                                                                                // 133
            postLoadHookFn(file);                                                                                      // 134
            saveBaseline(file);                                                                                        // 135
        }                                                                                                              // 136
    });                                                                                                                // 137
};                                                                                                                     // 138
                                                                                                                       // 139
function getTreeSummary(collector) {                                                                                   // 140
    var summarizer = new TreeSummarizer();                                                                             // 141
    collector.files().forEach(function (key) {                                                                         // 142
        summarizer.addFileCoverageSummary(key, utils.summarizeFileCoverage(collector.fileCoverageFor(key)));           // 143
    });                                                                                                                // 144
    return summarizer.getTreeSummary();                                                                                // 145
}                                                                                                                      // 146
                                                                                                                       // 147
function getPathMap(treeSummary) {                                                                                     // 148
    var ret = {};                                                                                                      // 149
                                                                                                                       // 150
    function walker(node) {                                                                                            // 151
        ret[node.fullPath()] = node;                                                                                   // 152
        node.children.forEach(function (child) {                                                                       // 153
            walker(child);                                                                                             // 154
        });                                                                                                            // 155
    }                                                                                                                  // 156
                                                                                                                       // 157
    walker(treeSummary.root);                                                                                          // 158
    return ret;                                                                                                        // 159
}                                                                                                                      // 160
                                                                                                                       // 161
core.render = function (filePath, res, prefix) {                                                                       // 162
    prefix = '/coverage';                                                                                              // 163
    var collector = new istanbul.Collector(),                                                                          // 164
        treeSummary,                                                                                                   // 165
        pathMap,                                                                                                       // 166
        linkMapper,                                                                                                    // 167
        outputNode,                                                                                                    // 168
        report,                                                                                                        // 169
        fileCoverage,                                                                                                  // 170
        coverage = getCoverageObject();                                                                                // 171
                                                                                                                       // 172
    if (!(coverage && Object.keys(coverage).length > 0)) {                                                             // 173
        res.setHeader('Content-type', 'text/plain');                                                                   // 174
        return res.end('No coverage information has been collected');                                                  // 175
    }                                                                                                                  // 176
                                                                                                                       // 177
    prefix = prefix || '';                                                                                             // 178
    if (prefix.charAt(prefix.length - 1) !== '/') {                                                                    // 179
        prefix += '/';                                                                                                 // 180
    }                                                                                                                  // 181
                                                                                                                       // 182
    utils.removeDerivedInfo(coverage);                                                                                 // 183
                                                                                                                       // 184
    collector.add(coverage);                                                                                           // 185
    treeSummary = getTreeSummary(collector);                                                                           // 186
    pathMap = getPathMap(treeSummary);                                                                                 // 187
                                                                                                                       // 188
    filePath = filePath || treeSummary.root.fullPath();                                                                // 189
                                                                                                                       // 190
    outputNode = pathMap[filePath];                                                                                    // 191
                                                                                                                       // 192
    if (!outputNode) {                                                                                                 // 193
        res.statusCode = 404;                                                                                          // 194
        return res.end('No coverage for file path [' + filePath + ']');                                                // 195
    }                                                                                                                  // 196
                                                                                                                       // 197
    linkMapper = {                                                                                                     // 198
        hrefFor: function (node) {                                                                                     // 199
            return prefix + 'show?p=' + node.fullPath();                                                               // 200
        },                                                                                                             // 201
        fromParent: function (node) {                                                                                  // 202
            return this.hrefFor(node);                                                                                 // 203
        },                                                                                                             // 204
        ancestor: function (node, num) {                                                                               // 205
            var i;                                                                                                     // 206
            for (i = 0; i < num; i += 1) {                                                                             // 207
                node = node.parent;                                                                                    // 208
            }                                                                                                          // 209
            return this.hrefFor(node);                                                                                 // 210
        },                                                                                                             // 211
        asset: function (node, name) {                                                                                 // 212
            return prefix + 'asset/' + name;                                                                           // 213
        }                                                                                                              // 214
    };                                                                                                                 // 215
                                                                                                                       // 216
    report = Report.create('html', { linkMapper: linkMapper });                                                        // 217
    res.setHeader('Content-type', 'text/html');                                                                        // 218
    if (outputNode.kind === 'dir') {                                                                                   // 219
        report.writeIndexPage(res, outputNode);                                                                        // 220
    } else {                                                                                                           // 221
        fileCoverage = coverage[outputNode.fullPath()];                                                                // 222
        utils.addDerivedInfoForFile(fileCoverage);                                                                     // 223
        report.writeDetailPage(res, outputNode, fileCoverage);                                                         // 224
    }                                                                                                                  // 225
                                                                                                                       // 226
    return res.end();                                                                                                  // 227
};                                                                                                                     // 228
                                                                                                                       // 229
core.mergeClientCoverage = function (obj) {                                                                            // 230
    if (!obj) {                                                                                                        // 231
        return;                                                                                                        // 232
    }                                                                                                                  // 233
    var coverage = getCoverageObject();                                                                                // 234
    Object.keys(obj).forEach(function (filePath) {                                                                     // 235
        var original = coverage[filePath],                                                                             // 236
            added = obj[filePath],                                                                                     // 237
            result;                                                                                                    // 238
        if (original) {                                                                                                // 239
            result = utils.mergeFileCoverage(original, added);                                                         // 240
        } else {                                                                                                       // 241
            result = added;                                                                                            // 242
        }                                                                                                              // 243
        coverage[filePath] = result;                                                                                   // 244
    });                                                                                                                // 245
};                                                                                                                     // 246
                                                                                                                       // 247
                                                                                                                       // 248
core.getInstrumenter = function () {                                                                                   // 249
    return instrumenter;                                                                                               // 250
};                                                                                                                     // 251
                                                                                                                       // 252
                                                                                                                       // 253
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/istanbul-middleware-port/zip-writer.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*                                                                                                                     // 1
 Copyright (c) 2013, Yahoo! Inc.  All rights reserved.                                                                 // 2
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.                           // 3
 */                                                                                                                    // 4
var fs = Npm.require('fs');                                                                                            // 5
                                                                                                                       // 6
function Sync(zipStream) {                                                                                             // 7
    this.stream = zipStream;                                                                                           // 8
    this.queue = [];                                                                                                   // 9
    this.idle = true;                                                                                                  // 10
    this.finalized = false;                                                                                            // 11
}                                                                                                                      // 12
                                                                                                                       // 13
Sync.prototype = {                                                                                                     // 14
    addFile: function (content, file) {                                                                                // 15
        this.queue.push({ file: file, content: content });                                                             // 16
        this.maybeSync();                                                                                              // 17
    },                                                                                                                 // 18
    finalize: function () {                                                                                            // 19
        this.finalized = true;                                                                                         // 20
        this.maybeSync();                                                                                              // 21
    },                                                                                                                 // 22
    maybeSync: function () {                                                                                           // 23
        if (!this.idle) {                                                                                              // 24
            return;                                                                                                    // 25
        }                                                                                                              // 26
        if (this.queue.length === 0) {                                                                                 // 27
            if (this.finalized) {                                                                                      // 28
                this.stream.finalize();                                                                                // 29
            }                                                                                                          // 30
            return;                                                                                                    // 31
        }                                                                                                              // 32
        var item = this.queue.shift();                                                                                 // 33
        this.idle = false;                                                                                             // 34
        this.stream.addFile(item.content, { name: item.file, store: true}, this.handler.bind(this));                   // 35
    },                                                                                                                 // 36
    handler: function () {                                                                                             // 37
        this.idle = true;                                                                                              // 38
        this.maybeSync();                                                                                              // 39
    }                                                                                                                  // 40
};                                                                                                                     // 41
                                                                                                                       // 42
ZipWriter = function (zipStream, prefix) {                                                                             // 43
    this.sync = new Sync(zipStream);                                                                                   // 44
    this.prefix = prefix;                                                                                              // 45
    this.currentFile = '';                                                                                             // 46
    this.currentData = '';                                                                                             // 47
};                                                                                                                     // 48
                                                                                                                       // 49
ZipWriter.prototype = {                                                                                                // 50
    copyFile: function (source, dest) {                                                                                // 51
        this.writeFile(dest, function (w) {                                                                            // 52
            w.write(fs.readFileSync(source));                                                                          // 53
        });                                                                                                            // 54
    },                                                                                                                 // 55
    writeFile: function (file, callback) {                                                                             // 56
        if (this.prefix && file.indexOf(this.prefix) === 0) {                                                          // 57
            file = file.substring(this.prefix.length);                                                                 // 58
        }                                                                                                              // 59
        this.start(file);                                                                                              // 60
        callback(this);                                                                                                // 61
        this.end();                                                                                                    // 62
    },                                                                                                                 // 63
    println: function (str) {                                                                                          // 64
        this.write(str);                                                                                               // 65
        this.write('\n');                                                                                              // 66
    },                                                                                                                 // 67
    start: function (fileName) {                                                                                       // 68
        this.currentFile = fileName;                                                                                   // 69
        this.currentData = '';                                                                                         // 70
    },                                                                                                                 // 71
    write: function (str) {                                                                                            // 72
        this.currentData += str;                                                                                       // 73
    },                                                                                                                 // 74
    end: function () {                                                                                                 // 75
        this.sync.addFile(this.currentData, this.currentFile);                                                         // 76
    },                                                                                                                 // 77
    done: function () {                                                                                                // 78
        this.sync.finalize();                                                                                          // 79
    }                                                                                                                  // 80
};                                                                                                                     // 81
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/istanbul-middleware-port/express-shim.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
express = function () {                                                                                                // 1
    function createRoute(route, handler) {                                                                             // 2
        route = '/coverage' + (route === '/' ? '' : route);                                                            // 3
        Meteor.RRouter.add(route, function () {                                                                        // 4
            var res = this.response;                                                                                   // 5
            res.setHeader = function (key, value) {                                                                    // 6
                res.writeHead(200, {key: value});                                                                      // 7
            };                                                                                                         // 8
            res.json = function (obj) {                                                                                // 9
                res.setHeader('Content-type', 'text/json');                                                            // 10
                return res.end(JSON.stringify(obj));                                                                   // 11
            };                                                                                                         // 12
            res.send = function (error, message) {                                                                     // 13
                return res.end(message);                                                                               // 14
            };                                                                                                         // 15
            handler(this.request, this.response);                                                                      // 16
        });                                                                                                            // 17
    }                                                                                                                  // 18
                                                                                                                       // 19
    return {                                                                                                           // 20
        use: function () {                                                                                             // 21
        },                                                                                                             // 22
        get: function (route, handler) {                                                                               // 23
            createRoute(route, handler);                                                                               // 24
        },                                                                                                             // 25
        post: function (route, handler) {                                                                              // 26
            createRoute(route, handler);                                                                               // 27
        }                                                                                                              // 28
    };                                                                                                                 // 29
};                                                                                                                     // 30
                                                                                                                       // 31
                                                                                                                       // 32
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/istanbul-middleware-port/handlers.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*                                                                                                                     // 1
 Copyright (c) 2013, Yahoo! Inc.  All rights reserved.                                                                 // 2
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.                           // 3
 */                                                                                                                    // 4
                                                                                                                       // 5
var path = Npm.require('path'),                                                                                        // 6
    fs = Npm.require('fs'),                                                                                            // 7
    istanbul = Npm.require('istanbul'),                                                                                // 8
//    ASSETS_DIR = istanbul.assetsDir,                                                                                 // 9
    existsSync = fs.existsSync || path.existsSync,                                                                     // 10
    url = Npm.require('url'),                                                                                          // 11
    zs = Npm.require('archiver'),                                                                                      // 12
    Report = istanbul.Report,                                                                                          // 13
    Collector = istanbul.Collector,                                                                                    // 14
    utils = istanbul.utils,                                                                                            // 15
    JS_RE = /\.js$/;                                                                                                   // 16
                                                                                                                       // 17
createHandler = function (/*opts*/) {                                                                                  // 18
    /*jslint nomen: true */                                                                                            // 19
//    opts = opts || {};                                                                                               // 20
                                                                                                                       // 21
    var app = express();                                                                                               // 22
                                                                                                                       // 23
    //show main page for coverage report for /                                                                         // 24
    app.get('/', function (req, res) {                                                                                 // 25
        var origUrl = url.parse(req.originalUrl).pathname,                                                             // 26
            origLength = origUrl.length;                                                                               // 27
        if (origUrl.charAt(origLength - 1) !== '/') {                                                                  // 28
            origUrl += '/';                                                                                            // 29
        }                                                                                                              // 30
        core.render(null, res, origUrl);                                                                               // 31
    });                                                                                                                // 32
                                                                                                                       // 33
    //show page for specific file/ dir for /show?file=/path/to/file                                                    // 34
    app.get('/show', function (req, res) {                                                                             // 35
                                                                                                                       // 36
        var origUrl = url.parse(req.originalUrl).pathname,                                                             // 37
            u = url.parse(req.url).pathname,                                                                           // 38
            pos = origUrl.indexOf(u),                                                                                  // 39
            file = req.url.substring(17);                                                                              // 40
        if (pos >= 0) {                                                                                                // 41
            origUrl = origUrl.substring(0, pos);                                                                       // 42
        }                                                                                                              // 43
        if (!file) {                                                                                                   // 44
            res.setHeader('Content-type', 'text/plain');                                                               // 45
            return res.end('[p] parameter must be specified');                                                         // 46
        }                                                                                                              // 47
        core.render(file, res, origUrl);                                                                               // 48
    });                                                                                                                // 49
                                                                                                                       // 50
//    send static file for /asset/asset-name                                                                           // 51
//    app.get('/asset/:name', function (req, res) {                                                                    // 52
//        res.sendfile(path.resolve(ASSETS_DIR, req.params.name));                                                     // 53
//    });                                                                                                              // 54
                                                                                                                       // 55
    //reset coverage to baseline on POST /reset                                                                        // 56
//    app.post('/reset', function (req, res) {                                                                         // 57
//        core.restoreBaseline();                                                                                      // 58
//        res.json({ ok: true });                                                                                      // 59
//    });                                                                                                              // 60
                                                                                                                       // 61
    //opt-in to allow resets on GET as well (useful for easy browser-based demos :)                                    // 62
//    if (opts.resetOnGet) {                                                                                           // 63
    app.get('/reset', function (req, res) {                                                                            // 64
        core.restoreBaseline();                                                                                        // 65
        res.json({ ok: true });                                                                                        // 66
    });                                                                                                                // 67
//    }                                                                                                                // 68
                                                                                                                       // 69
    //return global coverage object on /object as JSON                                                                 // 70
    app.get('/object', function (req, res) {                                                                           // 71
        res.json(core.getCoverageObject() || {});                                                                      // 72
    });                                                                                                                // 73
                                                                                                                       // 74
    //send self-contained download package with coverage and reports on /download                                      // 75
    app.get('/download', function (req, res) {                                                                         // 76
        var stream = zs.createZip(),                                                                                   // 77
            writer = new ZipWriter(stream, process.cwd()),                                                             // 78
            coverageObject = core.getCoverageObject() || {},                                                           // 79
            collector = new Collector(),                                                                               // 80
            baseDir = process.cwd(),                                                                                   // 81
            reports = [                                                                                                // 82
                Report.create('html', { writer: writer, dir: path.join(baseDir, 'lcov-report') }),                     // 83
                Report.create('lcovonly', { writer: writer, dir: baseDir })                                            // 84
            ];                                                                                                         // 85
                                                                                                                       // 86
        utils.removeDerivedInfo(coverageObject);                                                                       // 87
        collector.add(coverageObject);                                                                                 // 88
                                                                                                                       // 89
        res.statusCode = 200;                                                                                          // 90
        res.setHeader('Content-type', 'application/zip');                                                              // 91
        res.setHeader('Content-Disposition', 'attachment; filename=coverage.zip');                                     // 92
        stream.pipe(res);                                                                                              // 93
        writer.writeFile('coverage.json', function (w) {                                                               // 94
            w.write(JSON.stringify(coverageObject, undefined, 4));                                                     // 95
        });                                                                                                            // 96
        reports.forEach(function (report) {                                                                            // 97
            report.writeReport(collector);                                                                             // 98
        });                                                                                                            // 99
        writer.done();                                                                                                 // 100
    });                                                                                                                // 101
                                                                                                                       // 102
    //merge client coverage posted from browser                                                                        // 103
    app.post('/client', function (req, res) {                                                                          // 104
        var body = req.body;                                                                                           // 105
                                                                                                                       // 106
        if (!(body && typeof body === 'object')) { //probably needs to be more robust                                  // 107
            return res.send(400, 'Please post an object with content-type: application/json');                         // 108
        }                                                                                                              // 109
        core.mergeClientCoverage(body);                                                                                // 110
        res.json({ok: true});                                                                                          // 111
    });                                                                                                                // 112
                                                                                                                       // 113
    return app;                                                                                                        // 114
};                                                                                                                     // 115
                                                                                                                       // 116
function defaultClientMatcher(req) {                                                                                   // 117
    var parsed = url.parse(req.url);                                                                                   // 118
    return parsed.pathname && parsed.pathname.match(JS_RE);                                                            // 119
}                                                                                                                      // 120
                                                                                                                       // 121
function defaultPathTransformer(root) {                                                                                // 122
    return function (req) {                                                                                            // 123
        var parsed = url.parse(req.url),                                                                               // 124
            pathName = parsed.pathname;                                                                                // 125
        if (pathName && pathName.charAt(0) === '/') {                                                                  // 126
            pathName = pathName.substring(1);                                                                          // 127
        }                                                                                                              // 128
        return path.resolve(root, pathName);                                                                           // 129
    };                                                                                                                 // 130
}                                                                                                                      // 131
                                                                                                                       // 132
function clientHandler(matcher, pathTransformer, opts) {                                                               // 133
    var verbose = opts.verbose;                                                                                        // 134
                                                                                                                       // 135
    return function (req, res, next) {                                                                                 // 136
                                                                                                                       // 137
        if (!matcher(req)) {                                                                                           // 138
            return next();                                                                                             // 139
        }                                                                                                              // 140
        var fullPath = pathTransformer(req);                                                                           // 141
        if (!fullPath) {                                                                                               // 142
            return next();                                                                                             // 143
        }                                                                                                              // 144
                                                                                                                       // 145
        if (!core.getInstrumenter()) {                                                                                 // 146
            console.error('No instrumenter set up, please call createHandler() before you use the client middleware'); // 147
            return next();                                                                                             // 148
        }                                                                                                              // 149
        if (!existsSync(fullPath)) {                                                                                   // 150
            console.warn('Could not find file [' + fullPath + '], ignoring');                                          // 151
            return next();                                                                                             // 152
        }                                                                                                              // 153
        fs.readFile(fullPath, 'utf8', function (err, contents) {                                                       // 154
            var instrumented;                                                                                          // 155
            if (err) {                                                                                                 // 156
                console.warn('Error reading file: ' + fullPath);                                                       // 157
                return next();                                                                                         // 158
            }                                                                                                          // 159
            try {                                                                                                      // 160
                instrumented = core.getInstrumenter().instrumentSync(contents, fullPath);                              // 161
                if (verbose) {                                                                                         // 162
                    console.log('Sending instrumented code for: ' + fullPath + ', url:' + req.url);                    // 163
                }                                                                                                      // 164
                res.setHeader('Content-type', 'application/javascript');                                               // 165
                return res.send(instrumented);                                                                         // 166
            } catch (ex) {                                                                                             // 167
                console.warn('Error instrumenting file:' + fullPath);                                                  // 168
                return next();                                                                                         // 169
            }                                                                                                          // 170
        });                                                                                                            // 171
    };                                                                                                                 // 172
}                                                                                                                      // 173
                                                                                                                       // 174
createClientHandler = function (root, opts) {                                                                          // 175
    opts = opts || {};                                                                                                 // 176
                                                                                                                       // 177
    var app = express(),                                                                                               // 178
        matcher = opts.matcher || defaultClientMatcher,                                                                // 179
        pathTransformer = opts.pathTransformer || defaultPathTransformer(root);                                        // 180
    app.get('*', clientHandler(matcher, pathTransformer, opts));                                                       // 181
    return app;                                                                                                        // 182
};                                                                                                                     // 183
                                                                                                                       // 184
hookLoader = core.hookLoader;                                                                                          // 185
                                                                                                                       // 186
createHandler();                                                                                                       // 187
                                                                                                                       // 188
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['istanbul-middleware-port'] = {};

})();
