var express = require("express");
var path = require("path");
var routes = require("./routes");
var app = express();
var exphbs = require("express-handlebars");

app.engine(
    ".hbs",
    exphbs({
        extname: ".hbs",
        defaultLayout: "main",
    })
)

app.set("port", process.env.PORT || 3000);

app.set("view engine", ".hbs");

app.use(express.static('public'));

app.use("/", routes);

app.listen(app.get("port")), function() {
    console.log("Server started on port " + app.get("port"));
}