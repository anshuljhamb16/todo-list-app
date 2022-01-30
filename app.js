//Import express and bodyparser
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Import the mongoose module and setting up default mongoose connection
var mongoose = require('mongoose');
var database = "my_database"
var mongoDB = 'mongodb+srv://admin:test123@cluster0.8lsya.mongodb.net/my_database?retryWrites=true&w=majority'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
    console.log("Connected successfully to DataBase: " + database);
});
var loadUp = true;
//Date file imported
const date = require(__dirname + "/date.js");

//Code logic begins
var items = ["Good Morning"];

const newSchema = new mongoose.Schema({
    name: String
});

const listItem = mongoose.model('item', newSchema);

app.get("/", function(req, res) {

    if (loadUp == true) {
        listItem.find({}, function(err, data) {
            if (err) {
                console.log(err);
                return
            }

            for (var i = 0; i < data.length; i++) {
                items.push([data[i].name]);
            }

            let day = date.getDate();
            res.render("list", { listTitle: day, newListItems: items });
            loadUp = false;
        });
    } else {
        let day = date.getDate();
        res.render("list", { listTitle: day, newListItems: items });
    }
});

app.post("/", function(req, res) {
    var newItem = req.body.input;
    items.push(newItem);
    const item = new listItem({ name: newItem });
    item.save();
    res.redirect("/");

});

app.post("/delete", (req, res) => {

    const index = items.indexOf(req.body.member);
    console.log(items);
    if (index > -1) {
        items.splice(index, 1);
        console.log("removed");
    }

    listItem.deleteOne({ name: req.body.member }, function(err, docs) {
        if (err) {
            console.log(err)
        } else {
            console.log("Deleted User : ", docs);
        }
    });
    res.redirect("/");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});