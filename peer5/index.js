#!/usr/bin/env node
'use strict';
var program = require('commander');
var inquirer = require('inquirer');
/**
 * @example kad/basiclocal
 */
var kad = require('kad');
var traverse = require('kad-traverse');
var KadLocalStorage = require('kad-localstorage');
var getIP = require('external-ip')();
var peertopeer = require('./peertopeer.js');
var ethereumAPI = require('./ethereumapi.js');
var Dsampling = require('./sampling.js');

var PeertoPeer = new peertopeer();
var liveDsampling = new Dsampling(PeertoPeer);
var liveEthereum = new ethereumAPI(liveDsampling);

program
    .version('0.0.1')
    .usage('[options] <Sampling>')
    .description('Decentralized Sampling Protocol')
    .option('-a, --address [addr]', 'Node identity')
    .option('-p, --port [port]', 'Port to connect')
    .parse(process.argv);

if(!program.args.length) {
  program.help();
}
else
{
console.log('Sampling: ' + program.args);
console.log('Address: ' + program.address);
console.log('Port: ' + program.port);
//console.log(program);
    var questions = [
      {
        type: 'input',
        name: 'incommand',
        message: '>>>'
      }
    ];

    ask();
};

function ask() {

  inquirer.prompt(questions).then(function (answers) {
    if(answers.incommand == 'exit')
    {
console.log('original exit');
      // need to exit the DHT
      process.exit(1);
    }
    else if(answers.incommand == 'dht') {
      // make commandline accessable again
console.log('start DHT');
      //mockdht();
      startdht(program.address, program.port);

    }
    else if(answers.incommand == 'seed') {
      // make commandline accessable again
console.log('start Seed process');
console.log(answers);
      seedask();

    }
    else if(answers.incommand == 'dmap') {
      // make ethereum smart contract
      console.log('smart contract Dmaps started');
      ethereumContract();
      ask();

    }
    else if(answers.incommand == 'calldmap') {
      // make ethereum smart contract
      console.log('smart contract Dmaps called');
      ethereumcallDmap();
      ask();

    }
    else if(answers.incommand == 'read') {
      // read existing messages
      console.log('read message called');
      readmessage();
      ask();

    }
    else if(answers.incommand == 'sendmessage') {
      // send a new messages
console.log('send a new message to network');
      sendmessage();

    }
    else if(answers.incommand == 'ethereum') {
      // bring ethereum to life
      console.log('bringing ethereum to life');
      var spawn = require('child_process').spawn;

      var cmd = spawn('geth', ['--networkid 12345', '--datadir ~/.ethereum_experiment', '--rpc', '--rpccorsdomain "*"', '--unlock=6f511fe12ba50e2f2d9de99a4d2bfc61332aebb0', 'console'
], {stdio: 'pipe'});
      cmd.stdout.pipe(ui.log);
      cmd.on('close', function () {
      //  ui.updateBottomBar('Installation done!\n');
      //  process.exit();
      });
      ask();

    }
    else if(answers.incommand != 'dht' || answers.incommand != 'seed' || answers.incommand != 'sendmessage' || answers.incommand != 'read' || answers.incommand != 'dmap' ||answers.incommand != 'calldmap' || answers.incommand != 'ethereum' || answers.incommand != 'exit' )
    {
console.log('Command not recognised, please use help');
      ask();
    }
    else
    {
console.log('Stopped:', output.join(', '));
      process.exit(1);
    }
  });
};

// LOGIC FUNCTIONS
//start mock ptop network
function ethereumContract() {

  liveEthereum.createDmapcontract();
};

//start mock ptop network
function ethereumcallDmap() {

  liveEthereum.recallDmapContract();
};

function startdht (addressIn, portIn) {
console.log(addressIn);
console.log(portIn);
  var portnumber = parseInt(portIn);
  // make life DHT KAD
  PeertoPeer.startDHTkad(portnumber);

  ask();

};

function seedask() {

  var questionseed = [
    {
      type: 'input',
      name: 'addressseed',
      message: 'Enter the IP address to send too:'
    },
    {
      type: 'input',
      name: 'portseed',
      message: 'Port number of the seed:'
    },
    {
      type: 'input',
      name: 'message',
      message: 'Message to send:'
    }

  ];
  inquirer.prompt(questionseed).then(function (answerseed) {

    var output = [];
    output.push(answerseed.addressseed);
    output.push(answerseed.portseed);
    output.push(answerseed.message);
console.log('output muilt inquery cli');
console.log(output);
    if(answerseed.portseed)
    {
      //  now make the seed call to DHT
      seeddht(output);

    }
  });

};

function seeddht(seedIn) {
console.log('seed dht info');
console.log(seedIn);
console.log('seedsht function');
    var sportnumber = parseInt(seedIn[1]);
    var seed = {
      address: seedIn[0],
      port: sportnumber
    };

    PeertoPeer.seedDHTkad(seed);
  // call the original ask function
  console.log('original ask');
  ask();

};

function readmessage() {
  var key = '0222';
  PeertoPeer.readmDHTkad();
};

function sendmessage()  {
console.log('send a message function');
  var questionsend = [
    {
      type: 'input',
      name: 'sendmid',
      message: 'Enter message a short message:'
    }
  ];

  inquirer.prompt(questionsend).then(function (answersend) {
console.log('input message to send');
    var output = [];
    output.push(answersend.sendmid);
console.log(output);
    if(answersend.sendmid)
    {
      //  make call to call to read
      PeertoPeer.sendmDHTkad(output);

    }
    ask();
  });

};
