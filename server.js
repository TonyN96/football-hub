require('dotenv').config();
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
        helpers: {
            Win: function (result) {
                if (result == "W") {
                    return true
                }
            },
            Draw: function (result) {
                if (result == "D") {
                    return true
                }
            },
            Loss: function (result) {
                if (result == "L") {
                    return true
                }
            },
        }
    })
)

app.set("port", process.env.PORT || 3000);

app.set("view engine", ".hbs");

app.use(express.static('public'));

app.use("/", routes);

app.listen(app.get("port")), function() {
    console.log("Server started on port " + app.get("port"));
}