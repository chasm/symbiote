(function(){Template.__define__("logOut",Package.handlebars.Handlebars.json_ast_to_func([["#",[[0,"if"],[0,"loggingIn"]],["\n    <li><a>Logging in...</a></li>\n  "],["\n    <li class=\"dropdown user-dropdown\">\n      <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><i class=\"fa fa-user\"></i> ",["{",[[0,"currentUser","profile","login"]]]," <b class=\"caret\"></b></a>\n      <ul class=\"dropdown-menu\">\n        <li><a href=\"#\"><i class=\"fa fa-user\"></i> Profile</a></li>\n        <li><a href=\"#\"><i class=\"fa fa-gear\"></i> Settings</a></li>\n        <li class=\"divider\"></li>\n        <!-- <li><a id=\"logout\" href=\"#\"><i class=\"fa fa-power-off\"></i> Log Out</a></li> -->\n      </ul>\n    </li>\n    <li><a id=\"logout\" href=\"#\"><i class=\"fa fa-power-off\"></i> Log Out</a></li>\n  "]]]));

})();
