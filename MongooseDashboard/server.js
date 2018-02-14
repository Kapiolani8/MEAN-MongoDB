/******* BASIC ROUTING ******/
var express     = require("express");
var path        = require("path");
var bodyParser  = require("body-parser");
var session     = require("express-session");
var app         = express();

/******* DATABASE ROUTING ******/
var mongoose    = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
    var FriendSchema = new mongoose.Schema({
        firstName: {type: String, required: true, minlength: 3},
        lastName: {type: String, required: true, minlength: 3},
        age: {type: Number, required: true, min: 1, max: 100}
        }, {timestamps: true});
    mongoose.model('Friend', FriendSchema);     // We are setting this Schema in our Models as 'User'
    var Friend = mongoose.model('Friend')       // We are retrieving this Schema from our Models, named 'User'

/******* APP USE ******/
app.use(session({ secret: "supersecretreallysecretsecret" }));

app.use(bodyParser.urlencoded({ extended:true }));

app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, "./views"));
app.set('view engine', 'ejs');

/******* ROUTE AND FUNCTION ******/
/****** HOME ROUTE ******/
app.get('/', function(req, res) {
    res.render('index');
})

/****** FORM ROUTE ******/
app.post('/addFriend', function(req, res){
    console.log("friend info:", req.body);
    var friend = new Friend(req.body);
    friend.save(function(err){
        if(err){
            console.log("oh no errors");
        } else {
            console.log("it seems to be working.");
            res.redirect('/friend')
        }
    })
})

/****** FRIEND ROUTE, SHOWS FRIENDS******/
app.get('/friend', function(req, res) {
    Friend.find({}, function(err, friends){
        console.log(friends)
        res.render('friend', {friends : friends})
    })
})

/****** ROUTE TO EDIT BY ID ******/
app.get('/edit/:id', function(req, res) {
    Friend.findById(req.params.id, function (err, friends){
        console.log(req.params.id);
        res.render('edit', {friends : friends});
    })
})

/****** EDIT FRIEND ROUTE ******/
app.post('/editFriend/:id', function(req, res) {
    console.log(req.body);
    console.log(req.params.id);
    Friend.findOneAndUpdate({_id: req.params.id}, req.body, {upsert:false}, function(err, friends){
        if (err) return handleError(err);
        console.log(friends);
        res.redirect('/');
    })
})

/****** DELETE FRIEND ROUTE ******/
app.get('/delete/:id', function(req, res) {
    Friend.findByIdAndRemove(req.params.id, function (err) {
        console.log("****************");
        res.redirect('/');
    })
})

/******* PORT LISTEN ******/
app.listen(8000, function() {
    console.log("we should be working on 8000");
})