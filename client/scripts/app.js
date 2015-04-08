
var app = {};
// Server's API URL 
app.server = 'https://api.parse.com/1/classes/chatterbox';

//start the application.
app.init = function(){
  // log the status of the application
  console.log('chatterbox started');
  // catch the username
  app.username = window.location.search.substr(10);

  // object to store the messages that was already loaded
  app.onscreenMessages = {};

  //fetch the server and load the messages
  app.fetch();
  
  // fetch the server using an interval of 1 second
  setInterval(app.fetch.bind(app), 1000);

  // Define the Event handler to the form
  $('#send').on('submit', app.handleSubmit);
};

app.handleSubmit = function(e){
  e.preventDefault();

  var objMsg = {
    username: $('#username').val(),
    text: $('#message').val(),
    roomname: $('#room').val()
  };
  
  // clean the fields
  $('#message').val('');
  $('#username').val('');
  $('#room').val('');

  // Stringify the message
  var msgString = JSON.stringify(objMsg);
  
  app.sendMessage(msgString);
}

app.sendMessage = function(message){
  // Fetch the server and push into the page
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: message,
    contentType: 'application/json',
    success: function (data) {
      //creat a loop that iterates over data and send to messageCreate function.
      console.log('chatterbox: Success to send the message to the server!');

    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

// fetch the server for new messages
app.fetch = function(){
  $.ajax({
    url: app.server,
    type: 'GET',
    data: { order: "-createdAt", limit: 200 },
    contentType: 'application/json',
    success: function (json) {
      //creat a loop that iterates over data and send to messageCreate function.
      app.displayMessages(json.results);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.displayMessages = function(messages){
  for( var i = 0; i < messages.length; i++) {
    app.displayMessage(messages[i]);
  }
};

app.displayMessage = function(message){
  if(!app.onscreenMessages[message.objectId]) {
    // Send the object to render e return a set of HTML's elements 
    var $msg = app.renderMessage(message);
    // Send the message into DOM
    $('#feed').prepend($msg);
    // Flag this message as already displayed (avoid unnecessary render)
    app.onscreenMessages[message.objectId] = true;
  }
};

// create the necessary html's elements for the message to insert into the feed
app.renderMessage = function(message){
  // create HTML's elements
  var $user = $('<div>', { class: 'user' }).text(message.username);
  var $text = $('<div>', { class: 'text' }).text(message.text);
  // Sets the message's content into the elements
  var $message = $('<div>', {class: 'chat', 'data-id': message.objectId}).append($user, $text);
  return $message;
};

//start the application
$(document).ready(function(){
  app.init();
});









