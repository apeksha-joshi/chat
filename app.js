const express = require('express')
const app = express()
//var lg =  $("#log")

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('login')
})


//Listen on port 3000
server = app.listen(3000,()=>{
console.log('listening on- localhost:3000')
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