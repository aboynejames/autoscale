/**
* Peer to Peer
*
* deals peer to peer network, tcp, udp, kbuckets etc.
* @class peerTopeer
* @package    Dsensor opensource project
* @copyright  Copyright (c) 2016 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var util = require('util');
var events = require("events");
var kadsetup = require('./kadsetup.js');
var net = require('net');

var peerTopeer = function(nodesLIST, etherAPI) {
console.log('peer to peer live class');
	this.livenodes = nodesLIST;
	this.liveEthereum = etherAPI;
	events.EventEmitter.call(this);
	this.livepublicIP = '';
	this.liveethpk = '';
 	this.liveDHT = new kadsetup();
	this.startDHTkad(1111);

};

/**
* inherits core emitter class within this class
* @method
*/
util.inherits(peerTopeer, events.EventEmitter);

/**
*  discover Plublic IP address
* @method publicIPaddress
*
*/
peerTopeer.prototype.publicIPaddress = function() {

	//this.livepublicIP = this.liveDHT.getpublicIP();

};

/**
*  set ethereum public key for this client
* @method setEthpk
*
*/
peerTopeer.prototype.setEthpk = function(ekeyIN) {

	this.liveethpk = ekeyIN;

};

/**
*  connect to the DHT kad
* @method startDHTkad
*
*/
peerTopeer.prototype.startDHTkad = function(portIN) {

	var localthis = this;
	this.liveDHT.startDHT(portIN);
	this.liveDHT.listLocalMessages();

	this.liveDHT.on("newMfile", function(newFileIN) {

		var newmessageunknown = newFileIN;
		// filter per type of message
		localthis.filterPtoPmessages(newmessageunknown);
		newmessageunknown = '';

	});

};

/**
*  seed Peer to Peer network connections
* @method seedDHTkad
*
*/
peerTopeer.prototype.seedDHTkad = function() {

	var seedData = {};
	seedData.ip = '127.0.0.1';  // need list of peers
	seedData.port = 8816;
	var messagePtoP = {};
	messagePtoP.type = 'join';
	messagePtoP.text = 'Welcome to Network';
	var serialisemessage = JSON.stringify(messagePtoP);
	seedData.sendmessage = serialisemessage;

	this.liveDHT.seedSingle(seedData);

};

/**
*  seed Peer to Peer network connections
* @method seedDHTkad
*
*/
peerTopeer.prototype.sendmDHTkad = function(textIN) {

	var seedData = [];
	//seedData.push('127.0.0.1');  // need list of peers
	//seedData.push(8816);
	//seedData.push('hellow work meesgae');

	this.liveDHT.putMessage('', textIN);

};

/**
*  seed Peer to Peer network connections
* @method seedDHTkad
*
*/
peerTopeer.prototype.readmDHTkad = function() {


	this.liveDHT.getMessage('e907da446512e84e21cfaf5a3ca59b91');

};

/**
*  filter messages for peers and types
* @method filterPtoPmessages
*
*/
peerTopeer.prototype.filterPtoPmessages = function(messagePack) {


		var localthis = this;
	console.log('START OF FILTER MESSAGES package message ----------------');
		var makeMessObj = JSON.parse(messagePack);
	//console.log(makeMessObj);
		var messContent = JSON.parse(makeMessObj.value);
	//console.log(messContent.type);
		//var messObject = JSON.parse(messContent);
	//console.log(messContent.text);
	//console.log(messContent.text.pubethk);
	//console.log(messContent.nodeID);

		// filter for this DHT ID node  type = 'Dsampling';
		if(messContent.nodeID)
		{
	console.log('what is client node ID --SAMPLING PROTOCOL---');
			// match to correct node instance and extract bucketlist and select a random nodeID
			this.livenodes.forEach(function(singlenode) {
				var localnode = singlenode;
	console.log('single nodes=====================');
	console.log(localnode._self.nodeID);
	console.log(messContent.nodeID);
				if(localnode._self.nodeID == messContent.nodeID)
				{
	console.log('identify match node ids ##########################');
					localthis.liveEthereum.recallDmapContract("sample-chosen", messContent.DmapID, localnode);

				}

			});
			// emit message event to ethereum API
			//this.emit("sampling-selected", messContent.DmapID);

		}
		else if(messContent.type == 'join')
		{
	console.log('filter JOIN messaeg ============== message');
			// pass on message to UI
			//localthis.emit('client-message', messagePack);

	}

};

/**
*  Make a single hop across the DHT buckets
* @method singleHop
*
*/
peerTopeer.prototype.singleHop = function(cDmapIN, nodeclass) {

	this.liveDHT.oneHop(cDmapIN, nodeclass);

};

/**
*  simple data vent
* @method dataEvent
*
*/
peerTopeer.prototype.dataEvent = function() {

	var localthis = this;

	setTimeout(function(){

		localthis.emit("peerMessage", "peer");

	}, 9200);

};


module.exports = peerTopeer;
