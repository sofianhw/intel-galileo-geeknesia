var mqtt = require('mqtt'), url = require('url'), Galileo = require("galileo-io");
var mqtt_url = url.parse('mqtt://USERNAME:PASSWORD@geeknesia.com:1883');
var auth = (mqtt_url.auth || ':').split(':');
var board = new Galileo();
var LDR = 0;

var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
  username: auth[0],
  password: auth[1] 
});

client.on('connect', function() { // When connected
  client.publish('iot/live', 'DEVICE_ID', function() {
    console.log("Menghubungkan ke Geeknesia");
  });
  board.pinMode(8,board.MODES.OUTPUT)
  board.analogRead("A3",function(data){
    LDR = data;
  });
  setInterval(function(){
    if(LDR >=300)
      board.digitalWrite(8,1);
    else
      board.digitalWrite(8,0);
    client.publish('iot/data', '{"code":"USERNAME:PASSWORD","attributes":{"LDR":"'+LDR+'"}}', function() {
      console.log("Send data LDR = "+LDR);
    });
  }, 1000);
});
