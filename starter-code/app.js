const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const expressLayouts = require("express-ejs-layouts");


// Controllers
const index = require("./routes/index");
const authRoutes = require("./routes/auth-routes");
const profiles = require("./routes/profiles");
const posts = require("./routes/posts");

// Mongoose configuration
mongoose.connect("mongodb://localhost/express-linkedin");


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(expressLayouts);
app.set("layout", "layouts/main-layout");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 20 * 60 * 1000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 21 * 60 * 60
    })
  })
);

app.use("/", index);
app.use("/", authRoutes);
app.use("/", profiles);
app.use("/", posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
