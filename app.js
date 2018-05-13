const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//const mongoose = require('mongoose');


//connect to db
mongoose.connect('mongodb://localhost/chat');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("db connected");
});


var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});



//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization, Page');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
    res.setHeader('Access-Control-Max-Age', '1000');

    next();
};


app.use(allowCrossDomain);
//routes
app.get('/', (req, res) => {
	res.render('login')
});


//validate input-method authenticate
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

var User = mongoose.model('User', UserSchema);

//run this- save this na 

//Register the user
app.post('/register', function (req, res) {
	console.log("inside the register toute",req.body);
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;
	let confPass = req.body.passwordConf;
	if(confPass === password){
		let user = new User({
			username : username,
			email:email,
			password:password
		});
		user.save((error)=>{
			console.log("saved user");
			res.json({status:true,msg:"user saved"});
			if(error){
			console.log(error);
			}
		});
	}else{
		res.json({status:false,errMsg:"confirm passwaord is not as same as password"});
	}
});


//POST route for updating data
/*app.post('/login', function (req, res) {
  // confirm that user typed same password twice
 /!* if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    //return next(err);
  }*!/

if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return error;
      } else {
      
       console.log("Data added");
       return res.redirect('/');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        res.send(err);
      } else {
        
        return res.redirect('dashboard');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    res.send(err);
  }


});*/


app.post('/login',(req,res)=>{
    console.log(req.body);
    let uname = req.body.username;
    let pass = req.body.password;
    User.find({username:uname},(error,docs)=>{
        //assuming username is unique and only returns 1 document
        console.log("the docs are 0",docs[0]);
        bcrypt.compare(pass, docs[0].password, function (err, result) {
            if (result === true) {
                res.json({status:true});
            } else {
                res.json({status:false,msg:"wrong creds"});
            }
        })
    });
});

app.get('/dashboard',(req,res)=>{
    // res.json({status:true})
    res.render('index');
});


//Listen on port 3000
server = app.listen(3000,()=>{
console.log('listening on- localhost:3000s')
})
const io = require("socket.io")(server)

// app.get('/', function (req, res) {
//   console.log(req.body.todo + " is added to top of the list.");
//   res.redirect('index');
// });


io.on('connection', (socket) => {
	console.log('New user connected')

	//default username
	socket.username = "Anonymous"

socket.on('user', (data)=> {
   // console.log("app-" + data.b1);
    io.sockets.emit('user',{b1 : data.b1});
})

socket.on('user2', (data)=> {
    console.log("app-" + data.b2);
    io.sockets.emit('user2',{b2 : data.b2});
})

socket.on('user3', (data)=> {
   // console.log("app-" + data.b3);
    io.sockets.emit('user3',{b3 : data.b3});
})

socket.on('new_message', (data) => {
        //broadcast the new message
      //  console.log("app-" + data);
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })


    //listen on typing
    socket.on('typing', (data) => {
       
    	io.sockets.emit('typing', {username : socket.username})
    })
})