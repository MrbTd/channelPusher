require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');
const cors = require('cors')

var app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var pusher = new Pusher({//connect to pusher
    appId: process.env.APP_ID,
    key: process.env.APP_KEY,
    secret: process.env.APP_SECRET,
    cluster: process.env.APP_CLUSTER,
});

app.get('/', function (req, res) {//for testing if the server is running
    res.send('all is well...');
});

//for authenticating users
app.get("/pusher/auth", function (req, res) {
    var query = req.query;
    var socketId = query.socket_id;
    var channel = query.channel_name;
    var callback = query.callback;

    var auth = JSON.stringify(pusher.authorizeChannel(socketId, channel));
    var cb = callback.replace(/\"/g, "") + "(" + auth + ");";

    res.set({
        "Content-Type": "application/javascript"
    });

    res.send(cb);
});

app.post('/pusher/auth', function (req, res) {
    var users = ['luz', 'vi', 'minda'];
    var username = req.body.username;

    if (users.indexOf(username) !== -1) {
        var socketId = req.body.socket_id;
        var channel = req.body.channel_name;
        var auth = pusher.authorizeChannel(socketId, channel);
        res.send(auth);
    }
});

var port = process.env.PORT || 3001;
app.listen(port);