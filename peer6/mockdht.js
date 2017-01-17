/**
* Self Sever
*
* deals peer to peer network, tcp, udp, kbuckets etc.
* @class peerTopeer
* @package    Self Engine opensource project
* @copyright  Copyright (c) 2012 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var util = require('util');
var events = require("events");
var net = require('net');
var Logger = require('./logger.js');
var Web3 = require('web3');
var fs = require('fs');

var peerTopeer = function() {
console.log('peer to peer live MOCK class');
	events.EventEmitter.call(this);
  this.livelogging = new Logger(4);
console.log(this.livelogging);

console.log('after logger started');
  this.contractid = '';
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
peerTopeer.prototype.publiclogs = function() {
console.log('publick logs');
  this.livelogging.info('staring settings with logger', 'ham');
  var key = '333';
  this.livelogging.debug('attempting to set value for key %s', key);


  var web3 = new Web3();

  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

  var coinbase = web3.eth.coinbase;
  console.log(coinbase);
  this.livelogging.debug('coinbase acc %s', coinbase);	
  web3.eth.defaultAccount = coinbase;
  var balance = web3.eth.getBalance(coinbase);
  console.log(balance.toString(10));
  // solidity code code
  fs.readFile('smartcontracts/sampling.so', function(err, data) {
  console.log('data from solidity file');
  console.log(data.toString());
    var source = data.toString();

  var compiled = web3.eth.compile.solidity(source);
  console.log(compiled);
  var code = compiled.samplingContract.code;
  console.log(code);
    // contract json abi, this is autogenerated using solc CLI
  var abi = compiled.samplingContract.info.abiDefinition;
  console.log('that abi ===');
  console.log(abi);

  var myContract;
  //  var blockwatch = web3.eth.filter('latest');
  //console.log(blockwatch);

    web3.eth.contract(abi).new({data: code, gas: 900000,}, function (err, contract) {

      if (err) {
  console.error(err);
        return;
      }
      else if(contract.address) {
        myContract = contract;
        this.contractid = myContract.address;
  console.log('address: ' + myContract.address);
  // call the contract and save data
  var dmapid = 'firstdmapever';
  myContract.setDmapid(dmapid);

      }
    });

  });




};

/**
*  call a Dmap contract
* @method publicIPaddress
*
*/
peerTopeer.prototype.callDmap = function() {

  var web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

  var coinbase = web3.eth.coinbase;
  //console.log(coinbase);
  web3.eth.defaultAccount = coinbase;
  var balance = web3.eth.getBalance(coinbase);
  //console.log(balance.toString(10));
  // solidity code code
  fs.readFile('smartcontracts/sampling.so', function(err, data) {
  console.log('data from solidity file');
  //console.log(data.toString());
    var source = data.toString();

  var compiled = web3.eth.compile.solidity(source);
  //console.log(compiled);
  var code = compiled.samplingContract.code;
  //console.log(code);
    // contract json abi, this is autogenerated using solc CLI
  var abi = compiled.samplingContract.info.abiDefinition;
  console.log('that abi ===');
  //console.log(abi);

  var myContract;
  console.log('start recall process');
  	var myContract = web3.eth.contract(abi);
console.log('save contractid===' + this.contractid);
  	var mysamplingContract = myContract.at(this.contractid);
  //console.log(mysamplingContract);
    // call the contract to return data
    var returnDmap = mysamplingContract.getSampledmap();
  console.log('Dmap content returned');
  console.log(returnDmap);

  });

};

module.exports = peerTopeer;
