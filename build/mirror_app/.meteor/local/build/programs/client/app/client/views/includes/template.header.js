(function(){Template.__define__("header",Package.handlebars.Handlebars.json_ast_to_func(["<nav class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n    <!-- Brand and toggle get grouped for better mobile display -->\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-ex1-collapse\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"index.html\">DaVinci</a>\n    </div>\n\n    <!-- Collect the nav links, forms, and other content for toggling -->\n    <div class=\"collapse navbar-collapse navbar-ex1-collapse\">\n      <ul class=\"nav navbar-nav side-nav\">\n        <li",["#",[[0,"if"],[0,"dashboard"]],[" class=\"active\""]],">\n          <a href=\"",["{",[[0,"pathFor"],"dashboard"]],"\"><i class=\"fa fa-bar-chart-o\"></i> Dashboard</a>\n        </li>\n        <li ",["#",[[0,"if"],[0,"chattr"]],["class=\"active\""]],">\n          <a href=\"",["{",[[0,"pathFor"],"chattrIndex"]],"\">\n            <i class=\"fa fa-comments-o\"></i>\n            Chattr\n            <span class=\"pull-right\">\n              <span class=\"badge class-resources\">2</span>\n              <span class=\"badge class-discussion\">5</span>\n              <span class=\"badge class-chitchat\">17</span>\n            </span>\n          </a>\n        </li>\n        <li ",["#",[[0,"if"],[0,"quizilla"]],["class=\"active\""]],">\n          <a href=\"",["{",[[0,"pathFor"],"quizillaIndex"]],"\"><i class=\"fa fa-question\"></i> Quizilla</a>\n        </li>\n        <li ",["#",[[0,"if"],[0,"modelr"]],["class=\"active\""]],">\n          <a href=\"",["{",[[0,"pathFor"],"modelrIndex"]],"\"><i class=\"fa fa-sitemap\"></i> Modelr</a>\n        </li>\n        <li ",["#",[[0,"if"],[0,"stylr"]],["class=\"active\""]],">\n          <a href=\"",["{",[[0,"pathFor"],"stylrIndex"]],"\"><i class=\"fa fa-pencil\"></i> Stylr</a>\n        </li>\n        <li ",["#",[[0,"if"],[0,"codr"]],["class=\"active\""]],">\n          <a href=\"",["{",[[0,"pathFor"],"codrIndex"]],"\"><i class=\"fa fa-wrench\"></i> Codr</a>\n        </li>\n        <li ",["#",[[0,"if"],[0,"profilr"]],["class=\"active\""]],">\n          <a href=\"",["{",[[0,"pathFor"],"profilrIndex"]],"\"><i class=\"fa fa-user\"></i> Profilr</a>\n        </li>\n      </ul>\n\n      <ul class=\"nav navbar-nav navbar-right navbar-user\">\n        ",[">","cohortsControl"],"\n        ",["#",[[0,"if"],[0,"currentUser"]],["\n          ",[">","logOut"],"\n        "],["\n          ",[">","logIn"],"\n        "]],"\n      </ul>\n    </div><!-- /.navbar-collapse -->\n  </nav>"]));

})();