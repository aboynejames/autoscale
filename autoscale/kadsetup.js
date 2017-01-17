/**
* KAD setup a ptop network
*
* deals peer to peer network, tcp, udp, kbuckets etc.
* @class KAD
* @package    Dsensor opensource project
* @copyright  Copyright (c) 2016 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var util = require('util');
var events = require("events");
var kad = require('kad');
var traverse = require('kad-traverse');
var KadLocalStorage = require('kad-localstorage');
var messageFiles = require('kad-fs');
var crypto = require('crypto');
var getIP = require('external-ip')();

var KAD = function() {
console.log('KAD setup network');
  this.dht = {};
  this.ipPublic = '';
	events.EventEmitter.call(this);
  this.getpublicIP();

};

/**
* inherits core emitter class within this class
* @method
*/
util.inherits(KAD, events.EventEmitter);

/**
*  get the Public IP address
* @method getpublicIP
*
*/
KAD.prototype.getpublicIP = function() {

  var localthis = this;
  var ip = '';
  var setIP = getIP;
  setIP(function (err, ip) {
    if (err) {
        // every service in the list has failed
        throw err;
    }
console.log('extippp' + ip);
    localthis.ipPublic = ip;
  });

};

/**
*  Start up the DHT  (distributed hash table module)
* @method startDHT
*
*/
KAD.prototype.startDHT = function(portIn) {
console.log('startDHT FUNCTION ClassS')
/*
  var ipaddress =  this.ipPublic;
  // Decorate your transport
//console.log('exterip pickedup == ' + ip + 'and port== ' + portnumber);
  // Create your contact
  var contact = kad.contacts.AddressPortContact({
    address: ipaddress,
    port: 8816//portnumber
  });
  // Decorate your transport
  var NatTransport = traverse.TransportDecorator(kad.transports.UDP);

  // Create your transport with options
  var transportlive = new NatTransport(contact, {
  traverse: {
    upnp: { forward: 1901,
                ttl: 0 },
    stun: { address: 'stun.services.mozilla.com',
                 port: 3478 },
    turn: { address: 'turn.counterpointhackers.org',
                 port: 3478 }
  }
  });

  this.dht = new kad.Node({
    transport: transportlive,
    storage: kad.storage.FS('datadir'),
    validator: 'somethingtocheck'
    //storage: new KadLocalStorage('label')
  });
*/
// local DHT network setup
var ipaddress =  this.ipPublic;
// Decorate your transport
this.dht = new kad.Node({
  transport: kad.transports.UDP(kad.contacts.AddressPortContact({
    address: '127.0.0.1',
    port: portIn

  })),
  storage: kad.storage.FS('datadir'),
  validator: 'somethingtocheck'
  //storage: new KadLocalStorage('label')
});
//console.log('----dht--- for this peer');
//console.log(this.dht);

};

/**
*  get a list of all current messages
* @method listLocalMessages
*
*/
KAD.prototype.listLocalMessages = function() {
console.log('get list local directory messages');
// try and read all message files in directory
  var localthis = this;
  var testlstore = new messageFiles('./datadir');
  var listfiles = '';

  setInterval(function(){
    listfiles = testlstore.createReadStream();
    var returmesfiledata = [];
    // every time "data" is read, this event fires
    listfiles.on('data', function(textData) {

     localthis.emit("newMfile", textData.value);

    });

      // the reading is finished...
      listfiles.on('close', function (textData) {

      });

	}	,14000)

};

/**
*  Seed a SINGLE connection on DHT
* @method seedSingle
*
*/
KAD.prototype.seedSingle = function(seedIn) {
console.log('seed single');
//console.log(seedIn);
  var localthis = this;
  var hashkey = crypto.createHash('md5').update(seedIn.sendmessage).digest('hex');

  var seed = {
    address: seedIn.ip,
    port: 8816
  };
//console.log(seed);
  var localthis = this;
  this.dht.connect(seed, function(err) {
//console.log('begin seed connection');
    var key = hashkey;
    var message = seedIn.sendmessage;
    localthis.putMessage(key, message);

  });

};


/**
*  Make a put call ie send a message (to network)
* @method putMessage
*
*/
KAD.prototype.putMessage = function(keyID, message, nodeClass) {
console.log('put message');
  var keymid = keyID;
  if(keyID.length == 0)
  {
      var hashkey = crypto.createHash('md5').update(message).digest('hex');
      keymid = hashkey;
  }

  nodeClass.put(keymid, message, function() {
console.log('sent message to peers');
    });

};

/**
*  Read a SINGLE message sent by ID
* @method getMessage
*
*/
KAD.prototype.getMessage = function(keyID) {
console.log('get read message');

      var key = keyID;
      var info = '';
      this.dht.get(key, function(err, info) {
console.log('successfully read message');
console.log(info);
      });

};
/**
*  Single hop across the peers
* @method oneHop
*
*/
KAD.prototype.oneHop = function(cDmapIN, nodeClass) {
console.log('oneHope select a buck IP start of random walk');
  var localthis = this;
  var nodebuckets = nodeClass._router.hopBucketlist();
    var sizebucketsobject = Object.keys(nodebuckets).length;

    // send message to IP node Protocol and then let the protocol go through the Sampling and scoring.
    // needs instant if Dmap Contract and ....
    var hoplist = [];
    var nodelist = [];
    var combinelist = [];
    var bucks = Object.keys(nodebuckets);

    bucks.forEach(function(buc) {

      var bcont = Object.keys(nodebuckets[buc]);

        bcont.forEach(function(bc) {

          var contacts = nodebuckets[buc][bc];

          contacts.forEach(function(cont) {

            var localcont = {};
            localcont = cont;
            var address = Object.keys(localcont);
            var tempholder = [];
            address.forEach(function(item) {

            if(item == 'port')
            {
              hoplist.push(localcont[item]);
              tempholder.push(localcont[item]);
            }
            else if(item == 'nodeID')
            {
              nodelist.push(localcont[item]);
              tempholder.push(localcont[item]);
              combinelist.push(tempholder);
            }
          });
        });
    });

    });
    var rand = nodelist[Math.floor(Math.random() * nodelist.length)];
console.log('rand chosen');
console.log(rand);
    // send message to this peer, update dmap/sampling contract
    var samplingMessage = {};
    samplingMessage.type = 'Dsampling';
    samplingMessage.text = 'chosen';
    samplingMessage.DmapID = cDmapIN;
    samplingMessage.nodeID = rand;
    var serialiseDmessage = JSON.stringify(samplingMessage);
    // send message to network id.
    this.putMessage('', serialiseDmessage, nodeClass)
    // call smart contract
    // POLICY WHAT IS THE properties to get a 'random' walk  one hope two hopes, select, jump over, statifed etc.
};

module.exports = KAD;
