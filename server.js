var express = require("express");
var app=express();
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/public',express.static(path.join(__dirname+'/public')));

app.get('/', (req, res)=>{
   res.sendFile(__dirname+"/index.html");
  });

http.listen(3000, function(){
   console.log('http://localhost:3000');
});

var five = require('johnny-five'), arduino =  new five.Board({ port: "COM3" });
var temperature, light_pin_led;

io.on('connection', function(socket){
  socket.on('light_status', function(state) {
    //console.log('Light_status is: ' + state);
    light_pin_led.toggle();
  });

  console.log(socket.connected);
  io.sockets.emit('c_msg','Connected');
  
  console.log(socket.disconnected);
});

arduino.on('ready', function() {
    temperature = new five.Thermometer({
		controller: 'LM35',
		pin: 'A0'
    });
    
    light_pin_led = new five.Led(13);
    light_pin_led.off();
    
    temperature.on("data", function () {
        io.sockets.emit('temperature', this.celsius);
        io.sockets.emit('temperature1', this.kelvin);
        io.sockets.emit('temperature2', this.fahrenheit);
      //console.log('temperature in Cel: ' + this.celsius);
      //  console.log('temperature in kel: ' + this.kelvin);
      //  console.log('temperature in Fer: ' + this.fahrenheit);
      //  console.log('--------------------------------------');
    });

});