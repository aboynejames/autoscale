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
console.log('----dht--- for this peer');
console.log(this.dht);

};

/**
*  Seed a SINGLE connection on DHT
* @method seedSingle
*
*/
KAD.prototype.seedSingle = function(seedIn) {
console.log('seed single');
console.log(seedIn);
  //console.log(seedIn);
    var localthis = this;
    var hashkey = crypto.createHash('md5').update(seedIn.sendmessage).digest('hex');

    var seed = {
      address: seedIn.ip,
      port: seedIn.port
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
  var nodebuckets = this.dht._router.hopBucketlist();
console.log(nodebuckets);
    var sizebucketsobject = Object.keys(nodebuckets).length;
console.log('length ie no buckets.'+ sizebucketsobject);
    // send message to IP node Protocol and then let the protocol go through the Sampling and scoring.
    // needs instant if Dmap Contract and ....
    var hoplist = [];
    var nodelist = [];
    var combinelist = [];
    var bucks = Object.keys(nodebuckets);
console.log('keys of buckets');
console.log(bucks);
    bucks.forEach(function(buc) {
console.log(buc);
console.log(nodebuckets[buc]);
      var bcont = Object.keys(nodebuckets[buc]);
console.log(Object.keys(nodebuckets[buc]));
        bcont.forEach(function(bc) {
//console.log(bc);
//console.log(nodebuckets[buc][bc]);
          var contacts = nodebuckets[buc][bc];
//console.log('contact array?')
//console.log(contacts);
          contacts.forEach(function(cont) {
//console.log('each contact details address and port');
//console.log(cont);
            var localcont = {};
            localcont = cont;
console.log('local connt');
console.log(localcont);
console.log(Object.keys(localcont));
            var address = Object.keys(localcont);
//console.log(address);
            var tempholder = [];
            address.forEach(function(item) {

console.log(item);
console.log('after item');
console.log(localcont[item]);
console.log(item.port);
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
console.log(hoplist);
console.log('idlist');
console.log(nodelist);
console.log('cobmined');
console.log(combinelist);



var rand = hoplist[Math.floor(Math.random() * hoplist.length)];
console.log('rand chosen');
console.log(rand);
      // send message to this peer, update dmap/sampling contract
      // call smart contract
      // send message to network id.


    });

    // POLICY WHAT IS THE properties to get a 'random' walk  one hope two hopes, select, jump over, statifed etc.
};

module.exports = KAD;
