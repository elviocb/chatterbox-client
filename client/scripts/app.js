
var app = {};
app.rooms = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

//start the application.
app.init = function(){
  // log the status of the application
  console.log('chatterbox started');
  // catch the username
  app.username = window.location.search.substr(10);

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
  console.log(objMsg);
  var msgString = JSON.stringify(objMsg);

  // send the message to the server
  app.sendMessage(msgString);
  // console.log(msgString);
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
  // Fetch the server and push into the page
  $.ajax({
    // always use this url
    url: app.server,
    type: 'GET',
    data: { order: "-updatedAt", limit: 200 },
    contentType: 'application/json',
    success: function (data) {
      // console.log('fetched');
      // console.log(data);
      // debugger;
      //creat a loop that iterates over data and send to messageCreate function.
      app.splitRooms(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

// update the feed's html
app.updateFeed = function(){
  // console.log('preparing to update feed');
  $('#feed').html("");
  for (var i = 0; i < app.feed.length; i++) {
    var message = app.feed[i];
    app.createMsgHTML(message);
  }
};
// create the necessary html's elements for the message to insert into the feed
app.createMsgHTML = function(message){
  // console.log("message's html created");
  // clan the dom
  // create HTML's elements
  var div = $('<div class="message">'),
      a = $('<a href="#" class="username" onclick=app.fetch()/>'),
      p = $('<p>');
  // Sets the message's content into the elements
  $(a).text(message.username);
  $(p).text(message.text);
  // Creates the chain
  $('#feed').append(div).append(a).append(p);
};

app.splitRooms = function(array){

  for(var i = 0; i < array.results.length; i++ ){
    var roomName = array.results[i].roomname;
    var message = array.results[i];

    // Checks whether rom has name
    if(roomName === undefined || roomName === ""){
      this.rooms['anonymous'] = [];
      this.rooms['anonymous'].push(message);
    }
    // If there's no room, create a new property
    if(!this.rooms[roomName]){
      this.rooms[roomName] = [];
    }
    // push the message to the room
    this.rooms[roomName].push(message);

    //update the feed property
    this["feed"] = !this["feed"] ? [] : array.results;
  }
  // console.log('rooms separated');
  this.updateFeed();
};


//start the application
$(document).ready(function(){
  app.init();
});









