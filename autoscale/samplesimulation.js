/**
 * @module kad/simulation
 */
'use strict';

var kademlia = require('kad');
var traverse = require('kad-traverse');
var KadLocalStorage = require('kad-localstorage');
var messageFiles = require('kad-fs');
var faker = require('faker');
var peertopeer = require('./peertopeer.js');
var ethereumAPI = require('./ethereumapi.js');

var NUM_NODES = 8;

// Let simulation runners specify the number of nodes they would like to
// create for the simulation.
if (!Number.isNaN(Number(process.argv[2]))) {
  NUM_NODES = Number(process.argv[2]);
}

// Try to set the interval at which the simulation sends STORE messages
// to a value somewhat consistent with the number of node in the simulation
// to throttle the messages (since we are running in a single thread).
var STORE_INTERVAL = NUM_NODES * 10;

// Start at the highest available port and count down for the number of nodes
// in the simulation.
var created = 0;
var nodes = [];
var port = 65000;

// Create the number of nodes specified for the simulation and stick them into
// and array so we can connect them to one another.
while (created < NUM_NODES) {
  var contact = kademlia.contacts.AddressPortContact({
    address: '127.0.0.1',
    port: port--
  });

  var node = kademlia.Node({
    storage: kademlia.storage.FS('datadir'),
    transport: kademlia.transports.UDP(contact),
    logger: kademlia.Logger(3, 'NODE ' + created++)
  });

  nodes.push(node);
}

console.log(nodes);
var liveEthereum = new ethereumAPI();
var PeertoPeer = new peertopeer(nodes, liveEthereum);  // pass in nodeid so identify right bucket list

liveEthereum.on("sample-next", function(selectPeer, nodeClass) {

  PeertoPeer.singleHop(selectPeer, nodeClass);

});

// When a simulation node connects to another simulation node, store a random
// phrase by a new UUID every STORE_INTERVAL, then fetch the value from peers
// to make sure it was successfully stored.
var connect = function onConnect(err) {
  var node = this;

  if (err) {
    node._log.error(err.message);
    process.exit();
  }

  var key = faker.random.uuid();
  var value = faker.hacker.phrase();
  var messagePtoP = {};
	messagePtoP.type = 'join';
	messagePtoP.text = 'Welcome to Network';
	var serialisemessage = JSON.stringify(messagePtoP);

//  setInterval(function() {
    node.put(key, serialisemessage, function() {
      node.get(key, function() {
        node._log.info('successfully put and get an item in the dht');
      });
    });
//  }, STORE_INTERVAL);

};

// Iterate over all of the created nodes and connect them in a chain to let
// them all begin to discover each other.
for (var n = 0; n < nodes.length; n++) {
  if (nodes[n + 1]) {

    nodes[n].connect(nodes[n + 1]._self, connect);


  }
}
