$(function(){
   	//make connection
	var socket = io.connect('http://localhost:3000')

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var b1 = $("#b1")
	var b2 = $("#b2")
	var b3 = $("#b3")

	// ("#b1").click(function(){
	// 	console.log("clicked");
	// 	socket.emit('user',{b : b.val()})

	// })

	

b1.click(function(){
		socket.emit('user', {b1 : b1.text()})
	})
socket.on("user",(data)=>{
	//console.log("chat-" + data.b1);
		//feedback.html('');
		//b1.val('');
		
		$("#s").text( data.b1);
	})

b2.click(function(){
		socket.emit('user2', {b2 : b2.text()})
	})

socket.on("user2",(data)=>{
	console.log("chat-" + data.b2);
		feedback.html('');
		b2.val('');
		
		$("#s").text( data.b2);
	})

b3.click(function(){
		socket.emit('user3', {b3 : b3.text()})
	})




socket.on("user3",(data)=>{
	//console.log("chat-" + data.b3);
		feedback.html('');
		b3.val('');
		
		$("#s").text( data.b3);
	})
	//Emit message
	 send_message.click(function(){
	 	socket.emit('new_message', {message : message.val()})
	 })

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		 $("#txt").append('<p>' +data.message+'</p>');
		//txt.append('<p>' +data.message+'</p>')
	})


	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
		//clearTimeout(timeout);
    //timeout = setTimeout(timeoutFunction, 200);
	})

	//Listen on typing
	socket.on('typing', (data) => {
	//	feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
		feedback.html('')
		//console.log(data.username + "typing...");
		$("#s").text( " is typing");
		//clearTimeout(timeout);
    //timeout = setTimeout(timeoutFunction, 200);
	})

	socket.off('typing', (data) => {
	//	feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
		feedback.html('')
		//console.log(data.username + "typing...");
		//$("#s").text( data.username + " is typing");
		//clearTimeout(timeout);
    //timeout = setTimeout(timeoutFunction, 200);
	})
});