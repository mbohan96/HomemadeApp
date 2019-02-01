var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  app.post("/api/signin", passport.authenticate("local"), function(req, res) {
    res.json("/recipes");
  });

  app.post("/api/join", function(req, res) {
    console.log(req.body);
    db.User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      res.redirect(307, "/api/signin")
      // res.json(dbResponse);
    }).catch(function(err) {
      console.log(err);
      res.json(err);
    });
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      res.json({});
    }
    else {
      res.json({
        user: req.user.username,
        id: req.user.id
      });
    }
  });
};