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
/*  var setIP = getIP;
  setIP(function (err, ip) {
    if (err) {
        // every service in the list has failed
        throw err;
    }*/
console.log('extippp' + ip);
    localthis.ipPublic = '127.0.0.1';
  //});

};

/**
*  Start up the DHT  (distributed hash table module)
* @method startDHT
*
*/
KAD.prototype.startDHT = function(portIn) {
console.log('startDHT FUNCTION ClassS')

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

};

/**
*  Seed a SINGLE connection on DHT
* @method seedSingle
*
*/
KAD.prototype.seedSingle = function(seedIn) {
console.log('seed single');
console.log(seedIn);
  var localthis = this;
  var sportnumber = parseInt(seedIn[1]);
  var hashkey = crypto.createHash('md5').update(seedIn[2]).digest('hex');

  var seed = {
    address: '127.0.0.1',
    port: sportnumber
  };
console.log(seed);
  var localthis = this;
  this.dht.connect(seed, function(err) {
console.log('begin seed connection');
    var key = hashkey;
    var message = seedIn[2];
    localthis.putMessage(key, message);

  });

};


/**
*  Make a put call ie send a message (to network)
* @method putMessage
*
*/
KAD.prototype.putMessage = function(keyID, message) {
console.log('put message');
console.log(message);
  var keymid = keyID;
  if(keyID.length == 0)
  {
      var hashkey = crypto.createHash('md5').update(message).digest('hex');
      keymid = hashkey;
  }

  this.dht.put(keymid, message, function() {
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
KAD.prototype.oneHop = function(keyID) {
console.log('oneHope select a buck IP start of random walk');
  this.dht._router.hopBucketlist();

};

module.exports = KAD;
