/**
*  Dsensor Dmap
*  Smart Contract
*
**/
pragma solidity ^0.4.6;
//import './sampling-contract.sol' as samplingContract;

contract DmapContract {

 struct Mapdetail {

    string mname;
    string dmcode;
    string mcodehash;
    string mppsample;
    string mppscience;
  }

   struct Mappers {

    uint maverage;
    uint mppmscore;

  }

   mapping (address => Mappers)  mappershare;
   Mapdetail mapdetail;

  function setMappingDetail (string x) {

     mapdetail.mname = x;

  }

  function setDMcodehash (string x) {

    mapdetail.dmcode = x;

  }

  function setCodeHash (string x) {

    mapdetail.mcodehash = x;

  }

  function setMappingDetailsample (string x) {

   mapdetail.mppsample = x;

  }

  function setMappingDetailscience (string x) {

   mapdetail.mppscience = x;

  }

  /** Start a new sampling smart contract with ID of this Dmap contract */
  function startNewSampling (address dmapiAddr) {

    // create new instance of sampling contract
    //return address(new samplingContract());

  }

  function getMname() constant returns(string) {

   return mapdetail.mname;

  }

  function getDMcode() constant returns(string) {

   return mapdetail.dmcode;

  }

  function getMcodehash() constant returns(string) {

   return mapdetail.mcodehash;

  }

  function getMsample() constant returns(string) {

   return mapdetail.mppsample;

  }

  function getMscience() constant returns(string) {

   return mapdetail.mppscience;

  }

  function getMaverage(address addr) constant returns(uint) {

    return 1;

  }

}
